import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const objectPath = resolve(process.argv[2] ?? join(root, "build/AS_EUR_REV2/base/code.o"));
const readelf = process.argv[3] ?? join(
  execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"], {
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  }).trim().split(/\r?\n/).at(-1),
  "bin/arm-none-eabi-readelf",
);
const manifest = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-52.json"), "utf8"));
const sourcePath = join(root, manifest.source);

const expectedFunctions = [
  ["func_001D0834", "func_001C4EE8"],
  ["func_001D0928", "func_001C4F18"],
  ["func_001D0A1C", "func_001C4F48"],
];
const commonCalls = new Map([
  [80, "func_001D0F00"],
  [152, "func_001CF858"],
  [208, "func_001D07E0"],
]);
const expectedLabels = [104, 188, 196, 216, 228];

function fail(message) {
  throw new Error(`duplicate template 52: ${message}`);
}

if (manifest.version !== 1 || manifest.mode !== "arm" ||
    manifest.source !== "src/main/arm_duplicate_templates_52.S" ||
    manifest.expectedBodyBytes !== 720 ||
    JSON.stringify(manifest.functions.map(({ name, operation }) => [name, operation])) !==
      JSON.stringify(expectedFunctions) ||
    JSON.stringify(manifest.internalLabelOffsets) !== JSON.stringify(expectedLabels) ||
    manifest.slotContract?.length !== 1 ||
    manifest.slotContract[0].identity !== "duplicate52_shared_result_identity") {
  fail("unexpected positional manifest");
}

const source = readFileSync(sourcePath, "utf8");
const sizePosition = source.indexOf(".size \\name, .-\\name");
const slotPosition = source.indexOf(".Ldt52_result_slot\\@:");
if (sizePosition < 0 || slotPosition < 0 || sizePosition > slotPosition) {
  fail("the function size directive must precede the post-body slot");
}

function inspect(path) {
  if (!existsSync(path)) fail(`object does not exist: ${path}`);
  const output = execFileSync(readelf, ["-SW", "-sW", "-rW", path], {
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  });
  const sectionIndex = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-fA-F]+)\b/);
    if (match) sectionIndex.set(match[2], { index: Number(match[1]), size: Number.parseInt(match[3], 16) });
  }

  const symbols = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/);
    if (match) symbols.push({
      value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3],
      bind: match[4], ndx: match[6], name: match[7],
    });
  }

  const relocations = new Map();
  let relocationSection;
  for (const line of output.split(/\r?\n/)) {
    const heading = line.match(/^Relocation section '\.rel(?:a)?(\.text\.[^']+)'/);
    if (heading) {
      relocationSection = heading[1];
      relocations.set(relocationSection, []);
      continue;
    }
    if (/^Relocation section /.test(line)) {
      relocationSection = undefined;
      continue;
    }
    if (!relocationSection) continue;
    const match = line.match(/^\s*([0-9a-fA-F]+)\s+\S+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (match) relocations.get(relocationSection).push({
      offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3],
    });
  }

  const sections = new Map();
  for (const [name] of expectedFunctions) {
    const sectionName = `.text.${name}`;
    const info = sectionIndex.get(sectionName);
    if (!info || info.size !== 244) fail(`${sectionName} must be exactly 244 bytes`);
    const dump = execFileSync(readelf, ["-x", sectionName, path], {
      encoding: "utf8",
      maxBuffer: MAX_BUFFER,
    });
    const bytes = [];
    for (const line of dump.split(/\r?\n/)) {
      const match = line.match(/^\s*0x[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
      if (!match) continue;
      for (const word of match[1].trim().split(/\s+/)) {
        for (let cursor = 0; cursor < 8; cursor += 2) bytes.push(Number.parseInt(word.slice(cursor, cursor + 2), 16));
      }
    }
    const data = Buffer.from(bytes).subarray(0, info.size);
    if (data.length !== info.size) fail(`could not read complete bytes for ${sectionName}`);
    sections.set(sectionName, data);

    const symbol = symbols.find((candidate) => candidate.name === name &&
      candidate.ndx === String(info.index));
    if (!symbol || symbol.value !== 0 || symbol.size !== 240 ||
        symbol.type !== "FUNC" || symbol.bind !== "GLOBAL") {
      fail(`${name} must be a 240-byte global function at section offset zero`);
    }

    const operation = expectedFunctions.find(([functionName]) => functionName === name)[1];
    const expectedRelocations = [
      ...[...commonCalls].map(([offset, target]) => ({ offset, type: "R_ARM_CALL", symbol: target })),
      { offset: 128, type: "R_ARM_CALL", symbol: operation },
      { offset: 240, type: "R_ARM_ABS32", symbol: "duplicate52_shared_result_identity" },
    ].sort((left, right) => left.offset - right.offset);
    const actualRelocations = (relocations.get(sectionName) ?? [])
      .filter(({ offset }) => offset <= 240)
      .sort((left, right) => left.offset - right.offset);
    if (JSON.stringify(actualRelocations) !== JSON.stringify(expectedRelocations)) {
      fail(`${name} has an unexpected symbolic call or slot relocation contract`);
    }

    if (240 / 4 !== 60) fail(`${name} instruction count contract is inconsistent`);
    const externalOffsets = new Set([80, 128, 152, 208]);
    const localTargets = new Set();
    for (let offset = 0; offset < 240; offset += 4) {
      if (externalOffsets.has(offset)) continue;
      const instruction = data.readUInt32LE(offset);
      if ((instruction & 0x0e000000) !== 0x0a000000) continue;
      let displacement = instruction & 0x00ffffff;
      if (displacement & 0x00800000) displacement -= 0x01000000;
      const target = offset + 8 + displacement * 4;
      if (target >= 0 && target < 240) localTargets.add(target);
      else fail(`${name} has an unexpected non-call external branch at +${offset}`);
    }
    if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !== JSON.stringify(expectedLabels)) {
      fail(`${name} has unexpected local branch destinations`);
    }
  }
  return { sections, relocations };
}

const current = inspect(objectPath);
const currentBodies = expectedFunctions.map(([name]) => current.sections.get(`.text.${name}`).subarray(0, 240));
if (!currentBodies.every((body) => body.equals(currentBodies[0]))) {
  fail("normalized expansion bodies are not byte-identical");
}

if (objectPath.includes("/target/")) {
  const basePath = objectPath.replace("/target/", "/base/");
  if (!existsSync(basePath)) fail("base combined object is required for exact target comparison");
  const base = inspect(basePath);
  for (const [name] of expectedFunctions) {
    const sectionName = `.text.${name}`;
    if (!current.sections.get(sectionName).equals(base.sections.get(sectionName))) {
      fail(`${name} does not exactly match the approved normalized target section`);
    }
  }
}

console.log("Validated ARM duplicate template batch 52 (3 functions, 720 body bytes).");
