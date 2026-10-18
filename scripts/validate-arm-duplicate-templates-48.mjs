import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { armReadelf } from "./arm-readelf.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-48.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const definition = {
  bodySize: 272, instructionCount: 68, count: 3, internalLabels: 4,
  directCalls: 12, indirectCalls: 0, poolSlots: 0, postBodyIdentifiers: 3,
};
const commonCalls = [
  [12, "func_0012B95C", 0], [28, "func_0036F398", 0],
  [48, "func_0036F398", 0], [68, "func_0036F4D0", 0],
  [84, "func_0036F4D0", 0], [96, "func_0036F28C", 0],
  [112, "func_00123480", 0], [156, "func_003AB384", 0],
  [184, "func_0012B95C", 16], [220, "func_0011EF4C", 0],
  [256, "func_0011EF4C", 0],
];
const expectedFunctions = [
  ["func_00368600", "func_0019C0F8", 20, 340, null, 340, "neutral-expansion-a"],
  ["func_00368CE0", "func_0019C160", 22, 342, null, 344, "neutral-expansion-b01"],
  ["func_00369104", "func_0019C190", 22, 342, 344, 444, "neutral-expansion-c02"],
];
const expectedManifestFunctions = expectedFunctions.map(
  ([name, constructor, identifierThreeBytes, templateMaterialEndOffset, anonymousMaterialOffset, nextGlobalOffset]) => ({
    name, template: "registry_pair_attachment", constructor, constructorCallOffset: 132,
    identifierThreeBytes, templateMaterialEndOffset, anonymousMaterialOffset, nextGlobalOffset,
  })
);
assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 816,
  "unexpected batch metadata");
assert(manifest.source === "src/main/arm_duplicate_templates_48.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ registry_pair_attachment: definition }),
  "unexpected template definition");
assert(JSON.stringify(manifest.commonDirectCalls.map(({ offset, symbol, addend = 0, kind }) =>
  [offset, symbol, addend, kind])) ===
  JSON.stringify(commonCalls.map(([offset, symbol, addend]) => [offset, symbol, addend, "R_ARM_CALL"])),
  "unexpected common call contract");
assert(JSON.stringify(manifest.internalLabelOffsets) === JSON.stringify([140, 196, 224, 260]),
  "unexpected local label contract");
assert(JSON.stringify(manifest.functions) === JSON.stringify(expectedManifestFunctions),
  "unexpected function contract");

const identifierContract = manifest.identifierContract;
assert(JSON.stringify(identifierContract) === JSON.stringify([
  { role: "shared_identifier_one", offset: 272, addressInstructionOffset: 24,
    nulTerminatedBytes: 21, reservedSpan: 24, sharedAcrossAllExpansions: true },
  { role: "shared_identifier_two", offset: 296, addressInstructionOffset: 40,
    nulTerminatedBytes: 23, reservedSpan: 24, sharedAcrossAllExpansions: true },
  { role: "expansion_identifier_three", offset: 320, addressInstructionOffset: 88,
    pairwiseDistinctAcrossExpansions: true },
]), "unexpected identifier contract");

function normalize(line) {
  return line.replace(/\/\*.*?\*\//g, "").replace(/\s+/g, " ").trim();
}
const macroStart = source.indexOf(".macro DT48_BODY");
const macroEnd = source.indexOf(".endm", macroStart);
assert(macroStart >= 0 && macroEnd > macroStart, "missing DT48_BODY macro");
const macro = source.slice(macroStart, macroEnd).split(/\r?\n/).map(normalize).filter(Boolean);
const instructionLines = macro.filter((line) => !line.startsWith(".") && !line.endsWith(":") &&
  line !== "\\name:");
assert(instructionLines.length === 68, `macro has ${instructionLines.length} instructions, expected 68`);
const calls = instructionLines.map((line, index) => [line, index * 4])
  .filter(([line]) => line.startsWith("bl "));
assert(calls.length === 12, "macro must contain twelve direct calls");
assert(!instructionLines.some((line) => /^blx\b/.test(line)), "macro must not contain indirect calls");
const expectedCallText = [
  [12, "bl func_0012B95C"], [28, "bl func_0036F398"], [48, "bl func_0036F398"],
  [68, "bl func_0036F4D0"], [84, "bl func_0036F4D0"], [96, "bl func_0036F28C"],
  [112, "bl func_00123480"], [132, "bl \\ctor"], [156, "bl func_003AB384"],
  [184, "bl func_0012B95C+16"], [220, "bl func_0011EF4C"], [256, "bl func_0011EF4C"],
];
assert(JSON.stringify(calls.map(([line, offset]) => [offset, line])) === JSON.stringify(expectedCallText),
  "macro direct-call schedule differs from the contract");

const invocations = source.split(/\r?\n/).map(normalize)
  .filter((line) => line.startsWith("DT48_BODY "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedFunctions.map(([name, ctor, , , , , id]) =>
  `DT48_BODY ${name}, ${ctor}, ${id}`)), "unexpected macro instantiations");
assert(source.includes('.set .Ldt48_id2\\@, .Ldt48_id1\\@ + 24') &&
  source.includes('.set .Ldt48_id3\\@, .Ldt48_id1\\@ + 48') &&
  source.includes('.ascii "neutral-shared-id-01\\000\\000\\000\\000neutral-shared-second2\\000\\000\\expansion_id\\000"'),
  "missing continuous neutral identifier payload");

function runReadelf(object, ...args) {
  const result = spawnSync(armReadelf(), [...args, object], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`readelf ${args.join(" ")} failed`);
  }
  return result.stdout;
}

function sectionBytes(object, sectionName) {
  const output = runReadelf(object, "-x", sectionName);
  const bytes = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*0x[0-9a-f]+\s+((?:[0-9a-f]{8}\s+){1,4})/i);
    if (!match) continue;
    for (const group of match[1].trim().split(/\s+/)) {
      for (let index = 0; index < group.length; index += 2) bytes.push(Number.parseInt(group.slice(index, index + 2), 16));
    }
  }
  return Buffer.from(bytes);
}

function rotatedImmediate(word) {
  const value = word & 0xff;
  const rotation = ((word >>> 8) & 0xf) * 2;
  return rotation === 0 ? value : ((value >>> rotation) | (value << (32 - rotation))) >>> 0;
}

if (process.argv.length > 3) throw new Error("usage: validate-arm-duplicate-templates-48.mjs [base-or-target-object]");
if (process.argv[2]) {
  const object = resolve(process.argv[2]);
  const symbolsText = runReadelf(object, "-sW");
  const relocationsText = runReadelf(object, "-rW");
  for (const [name, constructor, id3Bytes, materialEnd] of expectedFunctions) {
    const symbolLine = symbolsText.split(/\r?\n/).find((line) =>
      new RegExp(`\\b272\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${name}$`).test(line.trim()));
    assert(symbolLine, `${name} is not a 272-byte global function`);
    const sectionIndex = Number.parseInt(symbolLine.trim().split(/\s+/)[6], 10);
    const mappingSymbols = symbolsText.split(/\r?\n/).flatMap((line) => {
      const fields = line.trim().split(/\s+/);
      if (fields.length < 8 || Number.parseInt(fields[6], 10) !== sectionIndex ||
          !/^\$[ad](?:\.|$)/.test(fields[7])) return [];
      return [[fields[7].slice(0, 2), Number.parseInt(fields[1], 16)]];
    });
    const expectedMappingSymbols = [["$a", 0], ["$d", 272],
      ...(materialEnd % 4 === 0 ? [] : [["$d", materialEnd]])];
    assert(JSON.stringify(mappingSymbols) === JSON.stringify(expectedMappingSymbols),
      `${name} has mapping-symbol fragments inside its identifier region`);
    const section = `.text.${name}`;
    const bytes = sectionBytes(object, section);
    assert(bytes.length === (materialEnd + 3 & ~3), `${name} section has an unexpected padded extent`);
    assert(bytes.subarray(materialEnd).equals(Buffer.alloc(bytes.length - materialEnd)),
      `${name} has nonzero terminal section padding`);
    const callsForFunction = [...commonCalls, [132, constructor, 0]].sort((a, b) => a[0] - b[0]);
    const relocationBlock = relocationsText.match(
      new RegExp(`Relocation section '\\.rel${section.replaceAll(".", "\\.")}'[\\s\\S]*?(?=\\nRelocation section|$)`));
    assert(relocationBlock, `${name} has no relocation section`);
    const relocations = relocationBlock[0].split(/\r?\n/).flatMap((line) => {
      const match = line.match(/^\s*([0-9a-f]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)(?:\s+\+\s+([0-9a-f]+))?/i);
      return match ? [[Number.parseInt(match[1], 16), match[2], match[3], Number.parseInt(match[4] ?? "0", 16)]] : [];
    });
    assert(JSON.stringify(relocations) === JSON.stringify(callsForFunction.map(([offset, symbol]) =>
      [offset, "R_ARM_CALL", symbol, 0])), `${name} has an unexpected relocation schedule`);
    for (const [callOffset, , expectedAddend] of callsForFunction) {
      const instruction = bytes.readUInt32LE(callOffset);
      let immediate = instruction & 0x00ffffff;
      if (immediate & 0x00800000) immediate -= 0x01000000;
      assert((instruction >>> 24) === 0xeb && immediate * 4 + 8 === expectedAddend,
        `${name} call at +${callOffset} does not preserve addend ${expectedAddend}`);
    }
    const localTargets = [];
    for (let offset = 0; offset < 272; offset += 4) {
      if (callsForFunction.some(([callOffset]) => callOffset === offset)) continue;
      const word = bytes.readUInt32LE(offset);
      if ((word & 0x0f000000) === 0x0a000000) {
        let displacement = word & 0x00ffffff;
        if (displacement & 0x00800000) displacement -= 0x01000000;
        localTargets.push(offset + 8 + displacement * 4);
      }
      assert((word & 0x0ffffff0) !== 0x012fff30, `${name} contains an indirect call`);
    }
    assert(JSON.stringify([...new Set(localTargets)].sort((a, b) => a - b)) === JSON.stringify([140, 196, 224, 260]),
      `${name} has unexpected local branch targets`);
    for (const [instructionOffset, targetOffset] of [[24, 272], [40, 296], [88, 320]]) {
      const word = bytes.readUInt32LE(instructionOffset);
      const opcode = (word >>> 21) & 0xf;
      assert((word >>> 28) === 0xe && ((word >>> 25) & 1) === 1 && ((word >>> 16) & 0xf) === 15 &&
        (opcode === 2 || opcode === 4), `${name} has an invalid adr at +${instructionOffset}`);
      const immediate = rotatedImmediate(word);
      const target = instructionOffset + 8 + (opcode === 4 ? immediate : -immediate);
      assert(target === targetOffset, `${name} adr at +${instructionOffset} targets +${target}, expected +${targetOffset}`);
    }
    assert(bytes.subarray(272, 293).equals(Buffer.from("neutral-shared-id-01\0")), `${name} identifier one mismatch`);
    assert(bytes.subarray(293, 296).equals(Buffer.alloc(3)), `${name} identifier one padding mismatch`);
    assert(bytes.subarray(296, 319).equals(Buffer.from("neutral-shared-second2\0")), `${name} identifier two mismatch`);
    assert(bytes[319] === 0, `${name} identifier two padding mismatch`);
    const neutralId = expectedFunctions.find(([candidate]) => candidate === name)[6];
    assert(bytes.subarray(320, 320 + id3Bytes).equals(Buffer.from(`${neutralId}\0`)), `${name} identifier three mismatch`);
  }
}

console.log("Validated ARM duplicate templates batch 48: 3 functions, 816 body bytes, neutral opaque identifiers.");
