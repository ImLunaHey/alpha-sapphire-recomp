import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const source = readFileSync(
  join(root, "src", "main", "arm_scalar_literal_returns.S"),
  "utf8"
);
const config = JSON.parse(
  readFileSync(join(root, "config", "arm-scalar-literal-returns.json"), "utf8")
);

const expected = [
  ["func_0020B92C", 8, 12, 4, 8, [0x00030003]],
  ["func_0020B938", 8, 12, 4, 8, [0x00080004]],
  ["func_002CD4CC", 8, 12, 4, 8, [0x00002370]],
  ["func_0045CECC", 8, 12, 4, 8, [0x0000270f]],
  ["func_0010945C", 12, 16, 4, 12, [0x000011c5]],
  ["func_00188538", 12, 16, 4, 12, [0x10000000]],
  ["func_00195AE0", 12, 24, 8, 16, [0x00000000, 0x10000000]],
];

if (
  config.schemaVersion !== 1 ||
  !Array.isArray(config.functions) ||
  config.functions.length !== expected.length
) {
  throw new Error("Unexpected ARM scalar literal-return manifest format");
}

for (let index = 0; index < expected.length; index += 1) {
  const [name, functionSize, sectionSize, sectionAlignment, literalOffset, literalWords] =
    expected[index];
  const entry = config.functions[index];
  if (
    entry?.name !== name ||
    entry.functionSize !== functionSize ||
    entry.sectionSize !== sectionSize ||
    entry.sectionAlignment !== sectionAlignment ||
    entry.literalOffset !== literalOffset ||
    JSON.stringify(entry.literalWords) !== JSON.stringify(literalWords)
  ) {
    throw new Error(`Manifest mismatch for ${name}`);
  }
}

if (/^\s*\.inst\b/m.test(source)) {
  throw new Error("Scalar literal-return source must use semantic mnemonics");
}

const exactDefinitions = new Map([
  [
    "func_0020B92C",
    `    ldr r0, .Lliteral_func_0020B92C
    bx lr
.size func_0020B92C, .-func_0020B92C
.Lliteral_func_0020B92C:
    .word 0x00030003`,
  ],
  [
    "func_0020B938",
    `    ldr r0, .Lliteral_func_0020B938
    bx lr
.size func_0020B938, .-func_0020B938
.Lliteral_func_0020B938:
    .word 0x00080004`,
  ],
  [
    "func_002CD4CC",
    `    ldr r0, .Lliteral_func_002CD4CC
    bx lr
.size func_002CD4CC, .-func_002CD4CC
.Lliteral_func_002CD4CC:
    .word 0x00002370`,
  ],
  [
    "func_0045CECC",
    `    ldr r0, .Lliteral_func_0045CECC
    bx lr
.size func_0045CECC, .-func_0045CECC
.Lliteral_func_0045CECC:
    .word 0x0000270F`,
  ],
  [
    "func_0010945C",
    `    ldr r0, .Lliteral_func_0010945C
    mov r1, #0
    bx lr
.size func_0010945C, .-func_0010945C
.Lliteral_func_0010945C:
    .word 0x000011C5`,
  ],
  [
    "func_00188538",
    `    vldr s0, .Lliteral_func_00188538
    vmul.f32 s0, s0, s0
    bx lr
.size func_00188538, .-func_00188538
.Lliteral_func_00188538:
    .word 0x10000000`,
  ],
  [
    "func_00195AE0",
    `    vldr d0, .Lliteral_func_00195AE0
    vmul.f64 d0, d0, d0
    bx lr
.size func_00195AE0, .-func_00195AE0
.balign 8, 0
.Lliteral_func_00195AE0:
    .word 0x00000000
    .word 0x10000000`,
  ],
]);

for (const [name, body] of exactDefinitions) {
  const prefix = `.section .text.${name},"ax",%progbits
.balign 4
.global ${name}
.type ${name}, %function
${name}:
`;
  if (!source.includes(prefix + body)) {
    throw new Error(`Exact semantic assembly shape mismatch for ${name}`);
  }
}

const definitions = [...source.matchAll(/^\.global (func_[0-9A-F]{8})$/gm)].map(
  (match) => match[1]
);
if (
  definitions.length !== expected.length ||
  definitions.some((name, index) => name !== expected[index][0])
) {
  throw new Error("Unexpected ARM scalar literal-return source coverage");
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) {
  throw new Error("Object and readelf paths must be provided together");
}
if (objectPath === undefined) {
  console.log(`Validated ${expected.length} semantic ARM scalar literal returns.`);
  process.exit(0);
}

function inspect(args) {
  const result = spawnSync(readelf, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  }
  return result.stdout;
}

const sectionOutput = inspect(["--sections", "--wide", objectPath]);
const symbolOutput = inspect(["--symbols", "--wide", objectPath]);
const relocationOutput = inspect(["--relocs", "--wide", objectPath]);
const sections = new Map();
const sectionPattern =
  /^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9A-Fa-f]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/gm;
for (const match of sectionOutput.matchAll(sectionPattern)) {
  sections.set(match[2], {
    index: Number.parseInt(match[1], 10),
    type: match[3],
    size: Number.parseInt(match[4], 16),
    flags: match[5],
    alignment: Number.parseInt(match[6], 10),
  });
}

const symbols = new Map();
const symbolPattern =
  /^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm;
for (const match of symbolOutput.matchAll(symbolPattern)) {
  const list = symbols.get(match[7]) ?? [];
  list.push({
    value: Number.parseInt(match[1], 16),
    size: Number.parseInt(match[2], 10),
    type: match[3],
    binding: match[4],
    visibility: match[5],
    sectionIndex: match[6],
  });
  symbols.set(match[7], list);
}

for (const [name, functionSize, sectionSize, sectionAlignment] of expected) {
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  if (
    section?.type !== "PROGBITS" ||
    section.size !== sectionSize ||
    section.alignment !== sectionAlignment ||
    !section.flags.includes("A") ||
    !section.flags.includes("X")
  ) {
    throw new Error(`Invalid base section for ${name}`);
  }
  const matches = symbols.get(name) ?? [];
  const symbol = matches[0];
  if (
    matches.length !== 1 ||
    symbol.value !== 0 ||
    symbol.size !== functionSize ||
    symbol.type !== "FUNC" ||
    symbol.binding !== "GLOBAL" ||
    symbol.visibility !== "DEFAULT" ||
    Number.parseInt(symbol.sectionIndex, 10) !== section.index
  ) {
    throw new Error(`Invalid base function symbol for ${name}`);
  }
  const relocationHeading = new RegExp(
    `Relocation section '\\.rela?${sectionName.replaceAll(".", "\\.")}'`
  );
  if (relocationHeading.test(relocationOutput)) {
    throw new Error(`Unexpected base relocation for ${name}`);
  }
}

console.log(
  `Validated ${expected.length} ARM scalar literal returns and their base layouts.`
);
