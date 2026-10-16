import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const maxBuffer = 16 * 1024 * 1024;
const config = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-61.json"), "utf8"));
const expectedTemplate = {
  bodySize: 312,
  instructionCount: 78,
  count: 2,
  internalLabels: 9,
  directCalls: 2,
  indirectCalls: 0,
  ownedLiteralCount: 0,
};
const expectedFunctions = [
  {
    name: "func_005530BC", template: "range_erase", nextGlobalOffset: 312,
    calls: [
      { offset: 92, kind: "R_ARM_CALL", symbol: "func_005531F4", role: "clear_right_subtree" },
      { offset: 296, kind: "R_ARM_CALL", symbol: "func_0014456C", role: "erase_current_node" },
    ],
  },
  {
    name: "func_00558688", template: "range_erase", nextGlobalOffset: 312,
    calls: [
      { offset: 92, kind: "R_ARM_CALL", symbol: "func_005588EC", role: "clear_right_subtree" },
      { offset: 296, kind: "R_ARM_CALL", symbol: "func_00558028", role: "erase_current_node" },
    ],
  },
];
const labelOffsets = [84, 120, 160, 168, 200, 220, 240, 264, 280];
if (config.version !== 1 || config.source !== "src/main/arm_duplicate_templates_61.S" ||
    config.mode !== "arm" || config.expectedBodyBytes !== 624 ||
    JSON.stringify(config.templates) !== JSON.stringify({ range_erase: expectedTemplate }) ||
    JSON.stringify(config.internalLabelOffsets) !== JSON.stringify(labelOffsets) ||
    JSON.stringify(config.callOffsets) !== JSON.stringify([92, 296]) ||
    JSON.stringify(config.functions) !== JSON.stringify(expectedFunctions)) {
  throw new Error("Unexpected duplicate template 61 manifest format");
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer });
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.stdout}`);
  return result.stdout.trim();
}

let objectPath = process.argv[2];
let temporary;
let readelf = process.argv[3];
if (objectPath === undefined) {
  temporary = mkdtempSync(join(tmpdir(), "dt61-"));
  const toolchain = run("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"]);
  const compiler = run("find", [toolchain, "-type", "f", "-name", "arm-none-eabi-gcc", "-print", "-quit"]);
  readelf = run("find", [toolchain, "-type", "f", "-name", "arm-none-eabi-readelf", "-print", "-quit"]);
  objectPath = join(temporary, "batch61.o");
  run(compiler, ["-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft", "-ffreestanding",
    "-fno-pic", "-fno-pie", "-Wa,--noexecstack", "-x", "assembler-with-cpp", "-c",
    join(root, config.source), "-o", objectPath]);
}
if (readelf === undefined) readelf = "arm-none-eabi-readelf";

try {
  const sections = run(readelf, ["-SW", objectPath]);
  const symbols = run(readelf, ["-sW", objectPath]);
  const relocations = run(readelf, ["-rW", objectPath]);
  let reference;
  let bodyBytes = 0;
  for (const expected of expectedFunctions) {
    const sectionName = `.text.${expected.name}`;
    const escapedSectionName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sectionMatch = sections.match(new RegExp(`\\[\\s*(\\d+)\\]\\s+${escapedSectionName}\\s+PROGBITS\\s+\\S+\\s+(\\S+)\\s+(\\S+)`));
    if (sectionMatch === null || Number.parseInt(sectionMatch[3], 16) !== expectedTemplate.bodySize) {
      throw new Error(`${expected.name} does not occupy one exact 312-byte text section`);
    }
    const sectionIndex = Number.parseInt(sectionMatch[1], 10);
    const symbolPattern = new RegExp(`\\b([0-9a-fA-F]+)\\s+${expectedTemplate.bodySize}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+${sectionIndex}\\s+${expected.name}\\b`);
    if (!symbolPattern.test(symbols)) throw new Error(`${expected.name} has an invalid global function boundary`);
    if (new RegExp(`\\bNOTYPE\\s+LOCAL\\s+DEFAULT\\s+${sectionIndex}\\s+\\$d\\b`).test(symbols)) {
      throw new Error(`${expected.name} contains literal or other data material`);
    }
    const dump = run(readelf, ["-x", sectionName, objectPath]);
    const words = [...dump.matchAll(/^\s*0x[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}\s*){1,4})/gm)]
      .flatMap((match) => match[1].trim().split(/\s+/));
    const body = Buffer.from(words.join(""), "hex");
    if (body.length !== expectedTemplate.bodySize || body.length / 4 !== expectedTemplate.instructionCount) {
      throw new Error(`${expected.name} has an invalid body or instruction count`);
    }
    bodyBytes += body.length;
    const relocationBlock = relocations.match(new RegExp(`Relocation section '\\.?rel${escapedSectionName}'[\\s\\S]*?(?=\\nRelocation section|$)`));
    if (relocationBlock === null) throw new Error(`${expected.name} has no relocation section`);
    const actualCalls = [...relocationBlock[0].matchAll(/^([0-9a-fA-F]{8})\s+\S+\s+R_ARM_CALL\s+\S+\s+(\S+)/gm)]
      .map((match) => ({ offset: Number.parseInt(match[1], 16), symbol: match[2] }));
    if (actualCalls.length !== expectedTemplate.directCalls ||
        expected.calls.some((call, index) => call.kind !== "R_ARM_CALL" ||
          actualCalls[index]?.offset !== call.offset || actualCalls[index]?.symbol !== call.symbol)) {
      throw new Error(`${expected.name} has unexpected direct-call relocations`);
    }
    const relocationLines = relocationBlock[0].split("\n").filter((line) => /^\s*[0-9a-fA-F]{8}\s/.test(line));
    if (relocationLines.length !== expectedTemplate.directCalls) {
      throw new Error(`${expected.name} owns unexpected literal or non-call relocations`);
    }
    const localTargets = new Set();
    let indirectCalls = 0;
    for (let offset = 0; offset < body.length; offset += 4) {
      if (config.callOffsets.includes(offset)) continue;
      const instruction = body.readUInt32LE(offset);
      if ((instruction & 0x0ffffff0) === 0x012fff30) indirectCalls++;
      if ((instruction & 0x0e000000) !== 0x0a000000) continue;
      let displacement = instruction & 0x00ffffff;
      if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
      const target = offset + 8 + displacement * 4;
      if (target < 0 || target >= body.length) throw new Error(`${expected.name} has an external non-call branch`);
      localTargets.add(target);
    }
    if (indirectCalls !== expectedTemplate.indirectCalls) {
      throw new Error(`${expected.name} has unexpected indirect calls`);
    }
    if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !== JSON.stringify(labelOffsets)) {
      throw new Error(`${expected.name} has unexpected local branch targets`);
    }
    const normalized = Buffer.from(body);
    for (const offset of config.callOffsets) normalized.fill(0, offset, offset + 4);
    if (reference !== undefined && !normalized.equals(reference)) {
      throw new Error(`${expected.name} violates normalized complete-body identity`);
    }
    reference = normalized;
  }
  if (bodyBytes !== config.expectedBodyBytes) throw new Error("Unexpected aggregate duplicate template 61 body size");
  console.log(`Validated ${expectedFunctions.length} ARM duplicate template 61 functions (${bodyBytes} body bytes).`);
} finally {
  if (temporary !== undefined) rmSync(temporary, { recursive: true, force: true });
}
