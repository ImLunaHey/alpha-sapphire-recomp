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
const manifest = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-53.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

const expectedTemplate = {
  bodySize: 1020, instructionCount: 255, count: 3, internalLabels: 1,
  directCalls: 1, indirectCalls: 0, tailBranches: 0, poolSlots: 0,
};
const expectedFunctions = [
  { name: "func_001B04BC", template: "sixteen_lane_bilinear_block", setupHelper: "func_001B047C",
    setupCallOffset: 4, directCalls: [{ offset: 4, kind: "R_ARM_CALL", symbol: "func_001B047C", role: "setup" }],
    unitStride: 1024, farInputOffset: 15360, finalStoreStep: 1012, frameRewind: 16384,
    anonymousMaterialOffset: 1020, nextGlobalOffset: 1296 },
  { name: "func_001B6ABC", template: "sixteen_lane_bilinear_block", setupHelper: "func_001B6A7C",
    setupCallOffset: 4, directCalls: [{ offset: 4, kind: "R_ARM_CALL", symbol: "func_001B6A7C", role: "setup" }],
    unitStride: 256, farInputOffset: 3840, finalStoreStep: 244, frameRewind: 4096,
    anonymousMaterialOffset: 1020, nextGlobalOffset: 1296 },
  { name: "func_001BD0BC", template: "sixteen_lane_bilinear_block", setupHelper: "func_001BD07C",
    setupCallOffset: 4, directCalls: [{ offset: 4, kind: "R_ARM_CALL", symbol: "func_001BD07C", role: "setup" }],
    unitStride: 512, farInputOffset: 7680, finalStoreStep: 500, frameRewind: 8192,
    anonymousMaterialOffset: 1020, nextGlobalOffset: 1296 },
];

function fail(message) {
  throw new Error(`duplicate template 53: ${message}`);
}

if (manifest.version !== 1 || manifest.mode !== "arm" ||
    manifest.source !== "src/main/arm_duplicate_templates_53.S" ||
    manifest.expectedBodyBytes !== 3060 ||
    JSON.stringify(manifest.templates) !== JSON.stringify({ sixteen_lane_bilinear_block: expectedTemplate }) ||
    JSON.stringify(manifest.internalLabelOffsets) !== JSON.stringify([500]) ||
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
    if (match) symbols.push({ value: Number.parseInt(match[1], 16), size: Number(match[2]),
      type: match[3], bind: match[4], ndx: match[5], name: match[6] });
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
    if (!info || info.size !== expectedTemplate.bodySize) fail(`${sectionName} must be exactly 1020 bytes`);
    const symbol = symbols.find(({ name, ndx }) => name === entry.name && ndx === String(info.index));
    if (!symbol || symbol.value !== 0 || symbol.size !== expectedTemplate.bodySize ||
        symbol.type !== "FUNC" || symbol.bind !== "GLOBAL") {
      fail(`${entry.name} must be a 1020-byte global function at section offset zero`);
    }
    const actualRelocations = relocations.get(sectionName) ?? [];
    const expectedRelocations = [{ offset: 4, type: "R_ARM_CALL", symbol: entry.setupHelper }];
    if (JSON.stringify(actualRelocations) !== JSON.stringify(expectedRelocations)) {
      fail(`${entry.name} must have only its setup R_ARM_CALL relocation at +4`);
    }
    const dump = execFileSync(readelf, ["-x", sectionName, path], {
      encoding: "utf8", maxBuffer: MAX_BUFFER,
    });
    const bytes = [];
    for (const line of dump.split(/\r?\n/)) {
      const match = line.match(/^\s*0x[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
      if (!match) continue;
      for (const word of match[1].trim().split(/\s+/)) {
        for (let cursor = 0; cursor < 8; cursor += 2) bytes.push(Number.parseInt(word.slice(cursor, cursor + 2), 16));
      }
    }
    const body = Buffer.from(bytes).subarray(0, info.size);
    if (body.length !== info.size) fail(`could not read complete bytes for ${sectionName}`);
    if (body.length / 4 !== expectedTemplate.instructionCount) {
      fail(`${entry.name} must contain exactly 255 ARM instructions`);
    }
    const localBranches = [];
    for (let offset = 0; offset < body.length; offset += 4) {
      if (offset === entry.setupCallOffset) continue;
      const instruction = body.readUInt32LE(offset);
      if ((instruction & 0x0e000000) !== 0x0a000000) continue;
      let displacement = instruction & 0x00ffffff;
      if (displacement & 0x00800000) displacement -= 0x01000000;
      const target = offset + 8 + displacement * 4;
      if (target < 0 || target >= body.length) fail(`${entry.name} has an unexpected external branch at +${offset}`);
      localBranches.push({ offset, target });
    }
    if (JSON.stringify(localBranches) !== JSON.stringify([{ offset: 1004, target: 500 }])) {
      fail(`${entry.name} must have only its loop-back branch from +1004 to +500`);
    }
    sections.set(sectionName, body);
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
    currentBody.fill(0, entry.setupCallOffset, entry.setupCallOffset + 4);
    baseBody.fill(0, entry.setupCallOffset, entry.setupCallOffset + 4);
    if (!currentBody.equals(baseBody)) fail(`${entry.name} does not exactly match the approved normalized target body`);
  }
}

console.log("Validated ARM duplicate template batch 53 (3 functions, 3060 body bytes).");
