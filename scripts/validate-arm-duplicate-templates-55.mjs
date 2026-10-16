import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const objectPath = resolve(process.argv[2] ?? join(root, "build/AS_EUR_REV2/base/code.o"));
const readelf = process.argv[3] ?? join(
  execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"], {
    encoding: "utf8", maxBuffer: MAX_BUFFER,
  }).trim().split(/\r?\n/).at(-1),
  "bin/arm-none-eabi-readelf",
);
const manifest = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-55.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

const expectedTemplate = {
  bodySize: 340, instructionCount: 85, count: 2, internalLabels: 10,
  directCalls: 2, indirectCalls: 0, literalCount: 0,
};
const callContract = [
  { offset: 92, kind: "R_ARM_CALL", symbol: "$clearHelper", role: "clear_subtree" },
  { offset: 304, kind: "R_ARM_CALL", symbol: "$eraseHelper", role: "erase_current" },
];
const expectedFunctions = [
  { name: "func_005597F4", template: "tree_range_erase",
    clearHelper: "func_00559948", eraseHelper: "func_00182CB0" },
  { name: "func_0055A9E4", template: "tree_range_erase",
    clearHelper: "func_0055AB38", eraseHelper: "func_0055A388" },
];

function fail(message) {
  throw new Error(`duplicate template 55: ${message}`);
}

if (manifest.version !== 1 || manifest.mode !== "arm" ||
    manifest.source !== "src/main/arm_duplicate_templates_55.S" ||
    manifest.expectedBodyBytes !== 680 ||
    JSON.stringify(manifest.templates) !== JSON.stringify({ tree_range_erase: expectedTemplate }) ||
    JSON.stringify(manifest.internalLabelOffsets) !==
      JSON.stringify([84, 120, 160, 168, 184, 208, 228, 248, 272, 288]) ||
    JSON.stringify(manifest.callContract) !== JSON.stringify(callContract) ||
    JSON.stringify(manifest.functions) !== JSON.stringify(expectedFunctions)) {
  fail("unexpected positional manifest");
}
if (sources.sources.filter(({ path, mode }) => path === manifest.source && mode === manifest.mode).length !== 1) {
  fail("source must occur once in config/sources.json in ARM mode");
}

function inspect(path) {
  if (!existsSync(path)) fail(`object does not exist: ${path}`);
  const metadata = execFileSync(readelf, ["-SW", "-sW", "-rW", path], {
    encoding: "utf8", maxBuffer: MAX_BUFFER,
  });
  const sectionIndex = new Map();
  for (const line of metadata.split(/\r?\n/)) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-fA-F]+)\b/);
    if (match) sectionIndex.set(match[2], { index: Number(match[1]), size: Number.parseInt(match[3], 16) });
  }
  const symbols = [];
  for (const line of metadata.split(/\r?\n/)) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+\S+\s+(\S+)\s+(.+?)\s*$/);
    if (match) symbols.push({
      value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3],
      bind: match[4], ndx: match[5], name: match[6],
    });
  }
  const relocations = new Map();
  let relocationSection;
  for (const line of metadata.split(/\r?\n/)) {
    const heading = line.match(/^Relocation section '\.rel(?:a)?(\.text\.[^']+)'/);
    if (heading) {
      relocationSection = heading[1];
      relocations.set(relocationSection, []);
      continue;
    }
    if (/^Relocation section /.test(line)) relocationSection = undefined;
    if (!relocationSection) continue;
    const match = line.match(/^\s*([0-9a-fA-F]+)\s+\S+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (match) relocations.get(relocationSection).push({
      offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3],
    });
  }

  const sections = new Map();
  for (const entry of expectedFunctions) {
    const sectionName = `.text.${entry.name}`;
    const info = sectionIndex.get(sectionName);
    if (!info || info.size !== 340) fail(`${sectionName} must contain only the 340-byte body`);
    const symbol = symbols.find(({ name, ndx }) => name === entry.name && ndx === String(info.index));
    if (!symbol || symbol.value !== 0 || symbol.size !== 340 ||
        symbol.type !== "FUNC" || symbol.bind !== "GLOBAL") {
      fail(`${entry.name} must be a 340-byte global function at section offset zero`);
    }
    const expectedRelocations = callContract.map((call) => ({
      offset: call.offset,
      type: call.kind,
      symbol: call.symbol === "$clearHelper" ? entry.clearHelper : entry.eraseHelper,
    }));
    const actualRelocations = relocations.get(sectionName) ?? [];
    if (JSON.stringify(actualRelocations) !== JSON.stringify(expectedRelocations)) {
      fail(`${entry.name} must have exactly the two specified direct-call relocations`);
    }
    const dump = execFileSync(readelf, ["-x", sectionName, path], {
      encoding: "utf8", maxBuffer: MAX_BUFFER,
    });
    const bytes = [];
    for (const line of dump.split(/\r?\n/)) {
      const match = line.match(/^\s*0x[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
      if (!match) continue;
      for (const word of match[1].trim().split(/\s+/)) {
        for (let cursor = 0; cursor < 8; cursor += 2) {
          bytes.push(Number.parseInt(word.slice(cursor, cursor + 2), 16));
        }
      }
    }
    const body = Buffer.from(bytes).subarray(0, info.size);
    if (body.length !== 340 || body.length / 4 !== 85) {
      fail(`${entry.name} must contain exactly 85 ARM instructions and no literal material`);
    }
    const externalOffsets = new Set(callContract.map(({ offset }) => offset));
    const localTargets = new Set();
    for (let offset = 0; offset < body.length; offset += 4) {
      if (externalOffsets.has(offset)) continue;
      const instruction = body.readUInt32LE(offset);
      if ((instruction & 0x0e000000) !== 0x0a000000) continue;
      let displacement = instruction & 0x00ffffff;
      if (displacement & 0x00800000) displacement -= 0x01000000;
      const target = offset + 8 + displacement * 4;
      if (target < 0 || target >= body.length) {
        fail(`${entry.name} has an unexpected external branch at +${offset}`);
      }
      localTargets.add(target);
    }
    if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !==
        JSON.stringify(manifest.internalLabelOffsets)) {
      fail(`${entry.name} has unexpected local branch destinations`);
    }
    sections.set(sectionName, body);
  }

  const normalized = expectedFunctions.map(({ name }) => {
    const body = Buffer.from(sections.get(`.text.${name}`));
    for (const { offset } of callContract) body.fill(0, offset, offset + 4);
    return body;
  });
  if (!normalized[0].equals(normalized[1])) {
    fail("the two template expansions differ after direct-call normalization");
  }
  return sections;
}

const current = inspect(objectPath);
if (objectPath.includes("/target/")) {
  const basePath = objectPath.replace("/target/", "/base/");
  if (!existsSync(basePath)) fail("base combined object is required for exact target comparison");
  const base = inspect(basePath);
  for (const entry of expectedFunctions) {
    const sectionName = `.text.${entry.name}`;
    const currentBody = Buffer.from(current.get(sectionName));
    const baseBody = Buffer.from(base.get(sectionName));
    for (const { offset } of callContract) {
      currentBody.fill(0, offset, offset + 4);
      baseBody.fill(0, offset, offset + 4);
    }
    if (!currentBody.equals(baseBody)) {
      fail(`${entry.name} does not exactly match the approved normalized target body`);
    }
  }
}

console.log("Validated ARM duplicate template batch 55 (2 functions, 680 body bytes).");
