#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const configPath = join(root, "config/arm-duplicate-templates-64.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const source = join(root, config.source);
const sourceContents = readFileSync(source);
assert.equal(createHash("sha256").update(sourceContents).digest("hex"), config.sourceSha256, "source SHA-256");
const [externalObjectPath, externalReadelf] = process.argv.slice(2);
const scratch = mkdtempSync(join(tmpdir(), "validate-dt64-"));
const object = externalObjectPath ? resolve(externalObjectPath) : join(scratch, "arm_duplicate_templates_64.o");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function parseHex(value) {
  return Number.parseInt(value, 16);
}

function relocationKind(type) {
  if (/R_ARM_(?:PC24|CALL)$/.test(type)) return "R_ARM_CALL";
  if (/R_ARM_JUMP24$/.test(type)) return "R_ARM_JUMP24";
  return type;
}

try {
  let assembler = process.env.ARM_NONE_EABI_AS;
  let readelf = externalReadelf || process.env.ARM_NONE_EABI_READELF;
  let objdump = process.env.ARM_NONE_EABI_OBJDUMP ||
    (externalReadelf?.endsWith("readelf") ? `${externalReadelf.slice(0, -"readelf".length)}objdump` : undefined);
  if (!externalObjectPath && (!assembler || !readelf || !objdump)) {
    const toolchain = run("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"]).trim();
    assembler ||= join(toolchain, "bin/arm-none-eabi-as");
    readelf ||= join(toolchain, "bin/arm-none-eabi-readelf");
    objdump ||= join(toolchain, "bin/arm-none-eabi-objdump");
  }
  readelf ||= "arm-none-eabi-readelf";
  objdump ||= "arm-none-eabi-objdump";

  if (!externalObjectPath) {
    run(assembler, ["-march=armv6k", "-mfpu=vfpv2", "-o", object, source]);
  }
  const symbolsText = run(readelf, ["--wide", "--symbols", object]);
  const sectionsText = run(readelf, ["--wide", "--sections", object]);
  const relocationsText = run(readelf, ["--wide", "--relocs", object]);

  const symbols = new Map();
  for (const line of symbolsText.split("\n")) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+FUNC\s+\S+\s+\S+\s+(\S+)\s+(\S+)\s*$/);
    if (match) symbols.set(match[4], { value: parseHex(match[1]), size: Number(match[2]), section: match[3] });
  }

  const sectionSizes = new Map();
  for (const line of sectionsText.split("\n")) {
    const match = line.match(/^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)/);
    if (match) sectionSizes.set(match[1], parseHex(match[2]));
  }

  const sectionBlocks = new Map();
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const disassembly = run(objdump, ["-dr", "-j", sectionName, object]);
    const heading = `Disassembly of section ${sectionName}:`;
    const headingIndex = disassembly.indexOf(heading);
    assert.notEqual(headingIndex, -1, `${fn.name}: missing disassembly section`);
    sectionBlocks.set(sectionName, disassembly.slice(headingIndex + heading.length).split("\n"));
  }

  const relocationSections = new Map();
  let currentRelocationSection = null;
  for (const line of relocationsText.split("\n")) {
    const heading = line.match(/^Relocation section '([^']+)'/);
    if (heading) {
      currentRelocationSection = heading[1];
      relocationSections.set(currentRelocationSection, []);
      continue;
    }
    const relocation = line.match(/^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (relocation && currentRelocationSection) {
      relocationSections.get(currentRelocationSection).push({
        offset: parseHex(relocation[1]),
        kind: relocationKind(relocation[2]),
        rawKind: relocation[2],
        symbol: relocation[3],
      });
    }
  }

  const sharedSymbols = [];
  for (const fn of config.functions) {
    const expected = config.templates[fn.template];
    const symbol = symbols.get(fn.name);
    assert(symbol, `missing function symbol ${fn.name}`);
    assert.equal(symbol.size, expected.bodySize, `${fn.name}: body size`);

    const textSection = `.text.${fn.name}`;
    assert.equal(sectionSizes.get(textSection), fn.anonymousMaterialOffset, `${fn.name}: source section boundary`);
    const lines = sectionBlocks.get(textSection);
    assert(lines, `${fn.name}: missing ${textSection}`);
    const instructions = lines.flatMap((line) => {
      const match = line.match(/^\s*([0-9a-fA-F]+):\s+(?:[0-9a-fA-F]{4,8}\s+)+(\S+)(?:\s+(.*))?$/);
      return match ? [{ offset: parseHex(match[1]), mnemonic: match[2], operands: match[3] || "" }] : [];
    });
    const bodyInstructions = instructions.filter((entry) => entry.offset < expected.bodySize);
    assert.equal(bodyInstructions.length, expected.instructionCount, `${fn.name}: instruction count`);

    const relocSection = `.rel${textSection}`;
    const relocations = relocationSections.get(relocSection) || relocationSections.get(`.rela${textSection}`) || [];
    const transfers = relocations.filter((entry) => entry.kind === "R_ARM_CALL" || entry.kind === "R_ARM_JUMP24");
    assert.deepEqual(
      transfers.map(({ offset, kind, symbol: target }) => ({ offset, kind, symbol: target })),
      fn.directTransfers.map(({ offset, kind, symbol: target }) => ({ offset, kind, symbol: target })),
      `${fn.name}: ordered direct transfers`,
    );

    const abs32 = relocations.filter((entry) => entry.rawKind === "R_ARM_ABS32");
    assert.equal(abs32.length, expected.poolSlots, `${fn.name}: pool relocation count`);
    assert.deepEqual(abs32.map((entry) => entry.offset), config.slotContract.map((slot) => slot.offset), `${fn.name}: pool slot offsets`);
    assert.equal(abs32[0].symbol, config.slotContract[0].identity, `${fn.name}: shared identity`);
    assert.equal(abs32[1].symbol, fn.descriptorIdentity, `${fn.name}: descriptor identity`);
    sharedSymbols.push(abs32[0].symbol);

    for (const slot of config.slotContract) {
      const load = bodyInstructions.find((entry) => entry.offset === slot.loadOffset);
      assert(load && load.mnemonic.startsWith("ldr"), `${fn.name}: missing literal load at +${slot.loadOffset}`);
      const address = load.operands.match(/\b([0-9a-fA-F]+)\s+</)?.[1];
      assert(address, `${fn.name}: unresolved literal target at +${slot.loadOffset}`);
      assert.equal(parseHex(address), slot.offset, `${fn.name}: literal target at +${slot.loadOffset}`);
    }

    const localBranches = bodyInstructions.flatMap((entry) => {
      if (!/^b(?:eq|ge|cs|lt)?$/.test(entry.mnemonic) || config.directTransferOffsets.includes(entry.offset)) return [];
      const address = entry.operands.match(/^([0-9a-fA-F]+)\b/)?.[1];
      if (!address) return [];
      const target = parseHex(address);
      return target < expected.bodySize ? [target] : [];
    });
    assert.deepEqual([...new Set(localBranches)].sort((a, b) => a - b), config.internalLabelOffsets, `${fn.name}: local branch targets`);
    assert.equal(bodyInstructions.filter((entry) => entry.mnemonic === "blx").length, expected.indirectCalls, `${fn.name}: indirect call count`);
    assert.equal(fn.templateMaterialEndOffset, expected.bodySize + 2 * 4 - 1, `${fn.name}: material boundary`);
    assert.equal(fn.anonymousMaterialOffset, fn.templateMaterialEndOffset + 1, `${fn.name}: anonymous boundary`);
    assert(fn.nextGlobalOffset > fn.anonymousMaterialOffset, `${fn.name}: next-global boundary`);
  }

  assert.equal(new Set(sharedSymbols).size, 1, "shared identity must be common to all expansions");
  assert.equal(new Set(config.functions.map((fn) => fn.descriptorIdentity)).size, config.functions.length, "descriptor identities must be distinct");
  assert.equal(config.functions.length * config.templates.descriptor_dispatch_and_complete.bodySize, config.expectedBodyBytes, "aggregate body bytes");
  console.log(`validated ${config.functions.length} duplicate-template expansions (${config.expectedBodyBytes} body bytes)`);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
