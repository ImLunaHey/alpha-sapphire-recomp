import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-49.json"), "utf8"));
const source = readFileSync(join(root, config.source), "utf8");

const expected = {
  names: ["func_00493D18", "func_004977B4"],
  helpers: ["func_0049866C", "func_004995CC"],
  bodySize: 380,
  instructions: 95,
  labels: [80, 96, 296, 348, 356],
};

function fail(message) {
  throw new Error(`ARM duplicate template 49 validation failed: ${message}`);
}

if (config.version !== 1 || config.mode !== "arm" || config.expectedBodyBytes !== 760 ||
    config.source !== "src/main/arm_duplicate_templates_49.S" ||
    JSON.stringify(config.internalLabelOffsets) !== JSON.stringify(expected.labels) ||
    config.templates?.indexed_halfword_pair_dispatch?.bodySize !== expected.bodySize ||
    config.templates.indexed_halfword_pair_dispatch.instructionCount !== expected.instructions ||
    config.templates.indexed_halfword_pair_dispatch.count !== 2 ||
    JSON.stringify(config.functions?.map(({ name, helper }) => [name, helper])) !==
      JSON.stringify(expected.names.map((name, index) => [name, expected.helpers[index]]))) {
  fail("unexpected manifest contract");
}

const macro = source.match(/\.macro DT49_BODY name, helper\n([\s\S]*?)\n\.endm/);
if (macro === null) fail("DT49_BODY macro is missing");
const bodyBeforeSize = macro[1].split(".size \\name, .-\\name")[0];
const instructions = bodyBeforeSize.split(/\r?\n/).map((line) => line.trim()).filter((line) =>
  line !== "" && !line.startsWith(".") && !line.endsWith(":") && line !== "\\name:");
if (instructions.length !== expected.instructions) {
  fail(`macro has ${instructions.length} instructions instead of ${expected.instructions}`);
}
let instructionOffset = 0;
const labelOffsets = [];
for (const line of bodyBeforeSize.split(/\r?\n/).map((line) => line.trim())) {
  if (/^\.Ldt49_(?:reject|oob|dispatch|done|loop)\\@:$/.test(line)) labelOffsets.push(instructionOffset);
  else if (line !== "" && !line.startsWith(".") && !line.endsWith(":") && line !== "\\name:") {
    instructionOffset += 4;
  }
}
if (JSON.stringify(labelOffsets.sort((a, b) => a - b)) !== JSON.stringify(expected.labels)) {
  fail(`unexpected local label offsets: ${labelOffsets.join(", ")}`);
}
for (const [offset, spelling] of [
  [108, "blx r1"], [264, "bl \\helper"], [324, "bl func_00398FC0"],
  [376, "b func_0014EA68-4"],
]) {
  if (instructions[offset / 4] !== spelling) fail(`unexpected instruction at +${offset}`);
}
if (!macro[1].includes(".size \\name, .-\\name\n.Ldt49_slot\\@:\n    .word duplicate49_shared_registry_identity")) {
  fail("post-body shared identity slot is missing or included in .size");
}
const expansions = [...source.matchAll(/^DT49_BODY ([^,]+), (.+)$/gm)].map((match) => [match[1], match[2]]);
if (JSON.stringify(expansions) !== JSON.stringify(expected.names.map((name, index) =>
  [name, expected.helpers[index]]))) fail("unexpected macro expansions");

const objectPath = process.argv[2];
if (objectPath !== undefined) {
  const readelf = process.argv[3] ?? "arm-none-eabi-readelf";
  const run = (args) => {
    const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
    if (result.error || result.status !== 0) fail(`readelf failed: ${result.error?.message ?? result.stderr.trim()}`);
    return result.stdout;
  };
  const symbols = run(["-sW", objectPath]);
  const sections = run(["-SW", objectPath]);
  const relocations = run(["-rW", objectPath]);
  for (const [name, helper] of expected.names.map((name, index) => [name, expected.helpers[index]])) {
    const symbolLine = symbols.split(/\r?\n/).find((line) => line.trim().endsWith(` ${name}`));
    if (symbolLine === undefined || !new RegExp(`\\b${expected.bodySize}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+`).test(symbolLine)) {
      fail(`${name} is not a ${expected.bodySize}-byte global function`);
    }
    const sectionName = `.text.${name}`;
    const sectionLine = sections.split(/\r?\n/).find((line) => line.includes(` ${sectionName} `));
    if (sectionLine === undefined || !/PROGBITS\s+[0-9a-f]+\s+[0-9a-f]+\s+000180\s/i.test(sectionLine)) {
      fail(`${sectionName} is not a 384-byte PROGBITS section`);
    }
    const hexDump = run(["-x", sectionName, objectPath]);
    const sectionBytes = Buffer.alloc(384);
    for (const line of hexDump.split(/\r?\n/)) {
      const match = line.match(/^\s*0x([0-9a-f]+)\s+((?:[0-9a-f]{8}\s*)+)/i);
      if (match === null) continue;
      Buffer.from(match[2].replaceAll(/\s/g, ""), "hex").copy(sectionBytes, Number.parseInt(match[1], 16));
    }
    if (sectionBytes.readUInt32LE(376) !== 0xeafffffd) {
      fail(`${name} does not encode the R_ARM_JUMP24 offset-minus-four addend`);
    }
    const escaped = sectionName.replaceAll(".", "\\.");
    const block = relocations.match(new RegExp(`Relocation section '\\.?rel${escaped}'[\\s\\S]*?(?=\\nRelocation section|$)`))?.[0];
    if (block === undefined) fail(`${sectionName} relocation section is missing`);
    const contracts = [
      ["00000108", "R_ARM_CALL", helper],
      ["00000144", "R_ARM_CALL", "func_00398FC0"],
      ["00000178", "R_ARM_JUMP24", "func_0014EA68"],
      ["0000017c", "R_ARM_ABS32", "duplicate49_shared_registry_identity"],
    ];
    for (const [offset, kind, symbol] of contracts) {
      const line = block.split(/\r?\n/).find((candidate) => candidate.trimStart().startsWith(offset));
      if (line === undefined || !line.includes(kind) || !line.includes(symbol)) {
        fail(`${name} relocation contract at 0x${offset} is invalid`);
      }
    }
  }
}

console.log("Validated ARM duplicate template batch 49 (2 functions, 760 executable bytes).");
