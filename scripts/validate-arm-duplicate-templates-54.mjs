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
const manifest = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-54.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

const expectedTemplate = {
  bodySize: 352, instructionCount: 88, count: 2, internalLabels: 6,
  directCalls: 8, indirectCalls: 2, literalCount: 4,
};
const callContract = [
  { offset: 48, kind: "R_ARM_CALL", symbol: "func_00150110", role: "worker_create" },
  { offset: 168, kind: "R_ARM_CALL", symbol: "$operation", role: "operation" },
  { offset: 192, kind: "R_ARM_CALL", symbol: "func_00184990", addend: -4, role: "record_allocate" },
  { offset: 252, kind: "R_ARM_CALL", symbol: "func_0014648C", role: "worker_prepare" },
  { offset: 272, kind: "R_ARM_CALL", symbol: "func_00146464", role: "worker_submit" },
  { offset: 316, kind: "R_ARM_CALL", symbol: "func_001505A4", role: "cleanup_acquire" },
  { offset: 328, kind: "R_ARM_CALL", symbol: "func_00139650", role: "cleanup_stage" },
  { offset: 340, kind: "R_ARM_CALL", symbol: "func_00169564", role: "cleanup_finish" },
];
const slotContract = [
  { offset: 352, loadOffset: 40, identity: "worker_interval", role: "worker_interval_scalar" },
  { offset: 356, loadOffset: 116, identity: "divide_by_40", role: "element_count_reciprocal" },
  { offset: 360, loadOffset: 212, identity: "record_seed", role: "record_seed_address" },
  { offset: 364, loadOffset: 236, identity: "record_dispatch", role: "record_dispatch_address" },
];
const literalIdentities = {
  worker_interval: { symbol: "arm_duplicate_templates_54_worker_interval_identity", class: "opaque-scalar" },
  divide_by_40: { symbol: "arm_duplicate_templates_54_divide_by_40_identity", class: "arithmetic-scalar" },
  record_seed: { symbol: "arm_duplicate_templates_54_record_seed_identity", class: "read-only-address" },
  record_dispatch: { symbol: "arm_duplicate_templates_54_record_dispatch_identity", class: "dispatch-identity" },
};
const expectedFunctions = [
  { name: "func_0013BE38", template: "guarded_worker_start", operation: "func_00146BD0" },
  { name: "func_0013C138", template: "guarded_worker_start", operation: "func_00146CD8" },
];

function fail(message) {
  throw new Error(`duplicate template 54: ${message}`);
}

if (manifest.version !== 1 || manifest.mode !== "arm" ||
    manifest.source !== "src/main/arm_duplicate_templates_54.S" ||
    manifest.expectedBodyBytes !== 704 ||
    JSON.stringify(manifest.templates) !== JSON.stringify({ guarded_worker_start: expectedTemplate }) ||
    JSON.stringify(manifest.internalLabelOffsets) !== JSON.stringify([88, 156, 276, 280, 284, 308]) ||
    JSON.stringify(manifest.callContract) !== JSON.stringify(callContract) ||
    JSON.stringify(manifest.slotContract) !== JSON.stringify(slotContract) ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.functions) !== JSON.stringify(expectedFunctions)) {
  fail("unexpected positional manifest");
}
if (new Set(Object.values(literalIdentities).map(({ symbol }) => symbol)).size !== 4 ||
    new Set(Object.values(literalIdentities).map(({ class: identityClass }) => identityClass)).size !== 4) {
  fail("the four post-body roles must use distinct identity classes");
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
      offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3], line,
    });
  }

  const sections = new Map();
  for (const entry of expectedFunctions) {
    const sectionName = `.text.${entry.name}`;
    const info = sectionIndex.get(sectionName);
    if (!info || info.size !== 368) fail(`${sectionName} must contain a 352-byte body and four slots`);
    const symbol = symbols.find(({ name, ndx }) => name === entry.name && ndx === String(info.index));
    if (!symbol || symbol.value !== 0 || symbol.size !== 352 || symbol.type !== "FUNC" || symbol.bind !== "GLOBAL") {
      fail(`${entry.name} must be a 352-byte global function at section offset zero`);
    }
    const expectedRelocations = [
      ...callContract.map((call) => ({ offset: call.offset, type: call.kind,
        symbol: call.symbol === "$operation" ? entry.operation : call.symbol })),
      ...slotContract.map((slot) => ({ offset: slot.offset, type: "R_ARM_ABS32",
        symbol: literalIdentities[slot.identity].symbol })),
    ].sort((a, b) => a.offset - b.offset);
    const actualRelocations = (relocations.get(sectionName) ?? []).map(({ offset, type, symbol }) =>
      ({ offset, type, symbol }));
    if (JSON.stringify(actualRelocations) !== JSON.stringify(expectedRelocations)) {
      fail(`${entry.name} has unexpected direct-call or post-body relocations`);
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
    const extent = Buffer.from(bytes).subarray(0, info.size);
    if (extent.length !== info.size) fail(`could not read complete bytes for ${sectionName}`);
    const body = extent.subarray(0, 352);
    if (body.length / 4 !== 88) fail(`${entry.name} must contain exactly 88 ARM instructions`);
    if (body.readUInt32LE(192) !== 0xebfffffd) {
      fail(`${entry.name} does not encode the allocator call's required -4 addend`);
    }
    for (const offset of [100, 304]) {
      if (body.readUInt32LE(offset) !== 0xe12fff31) fail(`${entry.name} must use blx r1 at +${offset}`);
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
      if (target < 0 || target >= body.length) fail(`${entry.name} has an unexpected external branch at +${offset}`);
      localTargets.add(target);
    }
    if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !==
        JSON.stringify(manifest.internalLabelOffsets)) {
      fail(`${entry.name} has unexpected local branch destinations`);
    }
    for (const slot of slotContract) {
      const load = body.readUInt32LE(slot.loadOffset);
      if ((load & 0x0f7f0000) !== 0x051f0000 ||
          slot.loadOffset + 8 + (load & 0xfff) !== slot.offset) {
        fail(`${entry.name} does not load slot +${slot.offset} at +${slot.loadOffset}`);
      }
    }
    sections.set(sectionName, Buffer.from(body));
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

console.log("Validated ARM duplicate template batch 54 (2 functions, 704 body bytes).");
