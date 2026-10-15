import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  fs.readFileSync(
    path.join(root, "config/arm-duplicate-recycle-subtrees-11.json"),
    "utf8",
  ),
);

function fail(message) {
  console.error(`arm-duplicate-recycle-subtrees-11 validation failed: ${message}`);
  process.exit(1);
}

if (
  manifest.schemaVersion !== 1 ||
  manifest.source !== "src/main/arm_duplicate_recycle_subtrees_11.S" ||
  !Array.isArray(manifest.functions) ||
  manifest.functions.length !== 37
) {
  fail("the manifest must describe exactly 37 schema-version-1 functions");
}

const names = new Set();
for (const entry of manifest.functions) {
  if (
    typeof entry !== "object" ||
    !/^func_[0-9A-F]{8}$/.test(entry.name) ||
    entry.size !== 60 ||
    names.has(entry.name)
  ) {
    fail("the manifest contains an invalid or duplicate function entry");
  }
  names.add(entry.name);
}

const template = [
  ".syntax unified",
  ".arm",
  "",
  ".macro recycle_subtree name",
  ".section .text.\\name, \"ax\", %progbits",
  ".balign 4",
  ".global \\name",
  ".type \\name, %function",
  "\\name:",
  "    cmp r1, #0",
  "    bxeq lr",
  "    push {r4, r5, lr}",
  "    mov r5, r0",
  "    mov r4, r1",
  ".Lloop_\\name:",
  "    mov r0, r5",
  "    ldr r1, [r4, #12]",
  "    bl \\name",
  "    ldr r1, [r5, #4]",
  "    ldr r0, [r4, #8]",
  "    str r1, [r4, #12]",
  "    str r4, [r5, #4]",
  "    movs r4, r0",
  "    bne .Lloop_\\name",
  "    pop {r4, r5, pc}",
  ".size \\name, . - \\name",
  ".endm",
  "",
  ...manifest.functions.map(({ name }) => `recycle_subtree ${name}`),
  "",
].join("\n");

const source = fs.readFileSync(path.join(root, manifest.source), "utf8");
if (source !== template) {
  fail("the assembly source does not exactly match the authorized symbolic template");
}
if (/^\s*\.(?:word|inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("embedded instruction or data directives are not permitted");
}

const objectPath = process.argv[2];
const readelf = process.argv[3];
if ((objectPath && !readelf) || (!objectPath && readelf)) {
  fail("object validation requires both an object path and readelf path");
}

if (objectPath) {
  const symbolsResult = spawnSync(readelf, ["-sW", objectPath], { encoding: "utf8" });
  if (symbolsResult.status !== 0) {
    process.stderr.write(symbolsResult.stderr);
    fail("readelf could not inspect base-object symbols");
  }
  const relocationsResult = spawnSync(readelf, ["-rW", objectPath], { encoding: "utf8" });
  if (relocationsResult.status !== 0) {
    process.stderr.write(relocationsResult.stderr);
    fail("readelf could not inspect base-object relocations");
  }

  const symbols = symbolsResult.stdout
    .split("\n")
    .map((line) =>
      line.match(
        /^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/,
      ),
    )
    .filter(Boolean)
    .map((match) => ({
      value: Number.parseInt(match[1], 16),
      size: Number.parseInt(match[2], 10),
      type: match[3],
      bind: match[4],
      index: match[6],
      name: match[7].trim(),
    }));

  const relocations = new Map();
  let relocationSection = null;
  for (const line of relocationsResult.stdout.split("\n")) {
    const sectionMatch = line.match(/^Relocation section '([^']+)'/);
    if (sectionMatch) {
      relocationSection = sectionMatch[1];
      relocations.set(relocationSection, []);
      continue;
    }
    const entryMatch = line.match(
      /^\s*([0-9a-fA-F]+)\s+\S+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/,
    );
    if (relocationSection && entryMatch) {
      relocations.get(relocationSection).push({
        offset: Number.parseInt(entryMatch[1], 16),
        type: entryMatch[2],
        symbol: entryMatch[3],
      });
    }
  }

  const sectionIndexes = new Set();
  for (const expected of manifest.functions) {
    const matchingSymbols = symbols.filter((entry) => entry.name === expected.name);
    if (matchingSymbols.length !== 1) {
      fail(`${expected.name} must have exactly one base-object symbol`);
    }
    const symbol = matchingSymbols[0];
    if (
      symbol.type !== "FUNC" ||
      symbol.bind !== "GLOBAL" ||
      symbol.value !== 0 ||
      symbol.size !== expected.size ||
      !/^\d+$/.test(symbol.index)
    ) {
      fail(`${expected.name} has unexpected base-object symbol metadata`);
    }
    if (sectionIndexes.has(symbol.index)) {
      fail(`${expected.name} does not have an independent text section`);
    }
    sectionIndexes.add(symbol.index);

    const armMapping = symbols.find(
      (entry) => entry.name === "$a" && entry.index === symbol.index && entry.value === 0,
    );
    if (!armMapping) {
      fail(`${expected.name} lacks an ARM mapping symbol at section offset zero`);
    }

    const sectionRelocations = relocations.get(`.rel.text.${expected.name}`) ?? [];
    if (
      sectionRelocations.length !== 1 ||
      sectionRelocations[0].offset !== 28 ||
      sectionRelocations[0].type !== "R_ARM_CALL" ||
      sectionRelocations[0].symbol !== expected.name
    ) {
      fail(`${expected.name} must have one self-call relocation at byte offset 28`);
    }
  }
}

console.log(
  `Validated ${manifest.functions.length} ARM duplicate subtree recyclers${
    objectPath ? " in source and base object" : " in source"
  }.`,
);
