import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateObjdiffConfig, inspectArmObject } from "./generate-objdiff-config.mjs";

function align(value, amount) {
  return Math.ceil(value / amount) * amount;
}

function armObject(functionName, instruction = 0xe12fff1e, codeWithoutFunction = false) {
  const hasFunction = typeof functionName === "string" && functionName.length > 0;
  const sectionNames = Buffer.from("\0.text\0.symtab\0.strtab\0.shstrtab\0");
  const strings = Buffer.from(hasFunction ? `\0${functionName}\0` : "\0");
  const textSize = hasFunction || codeWithoutFunction ? 4 : 0;
  const symbolSize = hasFunction ? 32 : 16;
  const textOffset = 52;
  const symbolOffset = align(textOffset + textSize, 4);
  const stringOffset = symbolOffset + symbolSize;
  const namesOffset = stringOffset + strings.length;
  const sectionOffset = align(namesOffset + sectionNames.length, 4);
  const output = Buffer.alloc(sectionOffset + 5 * 40);
  Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1]).copy(output);
  output.writeUInt16LE(1, 16);
  output.writeUInt16LE(40, 18);
  output.writeUInt32LE(1, 20);
  output.writeUInt32LE(sectionOffset, 32);
  output.writeUInt16LE(52, 40);
  output.writeUInt16LE(40, 46);
  output.writeUInt16LE(5, 48);
  output.writeUInt16LE(4, 50);
  if (textSize > 0) output.writeUInt32LE(instruction >>> 0, textOffset);
  if (hasFunction) {
    output.writeUInt32LE(1, symbolOffset + 16);
    output.writeUInt32LE(4, symbolOffset + 24);
    output[symbolOffset + 28] = 0x12;
    output.writeUInt16LE(1, symbolOffset + 30);
  }
  strings.copy(output, stringOffset);
  sectionNames.copy(output, namesOffset);

  const section = (index, name, type, flags, offset, size, link, info, alignment, entrySize) => {
    const cursor = sectionOffset + index * 40;
    output.writeUInt32LE(sectionNames.indexOf(Buffer.from(`\0${name}\0`)) + 1, cursor);
    output.writeUInt32LE(type, cursor + 4);
    output.writeUInt32LE(flags, cursor + 8);
    output.writeUInt32LE(offset, cursor + 16);
    output.writeUInt32LE(size, cursor + 20);
    output.writeUInt32LE(link, cursor + 24);
    output.writeUInt32LE(info, cursor + 28);
    output.writeUInt32LE(alignment, cursor + 32);
    output.writeUInt32LE(entrySize, cursor + 36);
  };
  section(1, ".text", 1, 0x6, textOffset, textSize, 0, 0, 4, 0);
  section(2, ".symtab", 2, 0, symbolOffset, symbolSize, 3, 1, 4, 16);
  section(3, ".strtab", 3, 0, stringOffset, strings.length, 0, 0, 1, 0);
  section(4, ".shstrtab", 3, 0, namesOffset, sectionNames.length, 0, 0, 1, 0);
  return output;
}

function withUnknownSection(input) {
  const oldSectionOffset = input.readUInt32LE(32);
  const oldCount = input.readUInt16LE(48);
  const namesIndex = input.readUInt16LE(50);
  const namesHeader = oldSectionOffset + namesIndex * 40;
  const oldNamesOffset = input.readUInt32LE(namesHeader + 16);
  const oldNamesSize = input.readUInt32LE(namesHeader + 20);
  const suffix = Buffer.from(".cro.unknown.test\0");
  const names = Buffer.concat([input.subarray(oldNamesOffset, oldNamesOffset + oldNamesSize), suffix]);
  const prefix = input.subarray(0, oldSectionOffset);
  const namesOffset = prefix.length;
  const unknownOffset = namesOffset + names.length;
  const sectionOffset = align(unknownOffset + 1, 4);
  const output = Buffer.alloc(sectionOffset + (oldCount + 1) * 40);
  prefix.copy(output);
  names.copy(output, namesOffset);
  output[unknownOffset] = 0x5a;
  input.subarray(oldSectionOffset, oldSectionOffset + oldCount * 40).copy(output, sectionOffset);
  output.writeUInt32LE(sectionOffset, 32);
  output.writeUInt16LE(oldCount + 1, 48);
  const movedNamesHeader = sectionOffset + namesIndex * 40;
  output.writeUInt32LE(namesOffset, movedNamesHeader + 16);
  output.writeUInt32LE(names.length, movedNamesHeader + 20);
  const extra = sectionOffset + oldCount * 40;
  output.writeUInt32LE(oldNamesSize, extra);
  output.writeUInt32LE(1, extra + 4);
  output.writeUInt32LE(unknownOffset, extra + 16);
  output.writeUInt32LE(1, extra + 20);
  output.writeUInt32LE(1, extra + 32);
  return output;
}

const root = mkdtempSync(join(tmpdir(), "as-objdiff-config-"));
const target = join(root, "build", "TEST", "target", "cro-split");
const base = join(root, "build", "TEST", "base", "cro-split");
mkdirSync(target, { recursive: true });
mkdirSync(base, { recursive: true });
mkdirSync(join(root, "progress", "units"), { recursive: true });

const fixtureNames = ["DllBattle", "DllBroken", "DllEmpty", "DllField", "DllMismatch", "DllTitle"];
for (let index = 0; fixtureNames.length < 145; index++) fixtureNames.push(`DllTest${String(index).padStart(3, "0")}`);
fixtureNames.sort();
const manifestPath = join(root, "progress", "units", "TEST.cro.json");
const manifest = {
  schemaVersion: 1,
  target: "TEST",
  unitCount: 145,
  units: fixtureNames.map((name, index) => ({
    name: `cro/${name}`,
    size: index + 1,
    sha256: index.toString(16).padStart(64, "0"),
  })),
};
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
writeFileSync(manifestPath, manifestText);

const battle = armObject("battle_entry");
writeFileSync(join(target, "DllBattle.o"), battle);
writeFileSync(join(base, "DllBattle.o"), battle);
writeFileSync(join(target, "DllField.o"), armObject("field_entry", 0xe3a00000));
writeFileSync(join(base, "DllField.o"), armObject("field_entry", 0xe3a00001));
writeFileSync(join(target, "DllTitle.o"), armObject("title_entry"));
writeFileSync(join(target, "DllBroken.o"), Buffer.from("not an ELF"));
writeFileSync(join(base, "DllBroken.o"), armObject("broken_entry"));
// A genuine partition with no independently accepted boundaries must still
// appear as a linker unit. It simply contributes no functions yet.
writeFileSync(join(target, "DllEmpty.o"), armObject(undefined, 0xe12fff1e, true));
writeFileSync(join(base, "DllEmpty.o"), armObject(undefined, 0xe3a00000, true));
writeFileSync(join(target, "DllMismatch.o"), armObject("target_only_entry"));
writeFileSync(join(base, "DllMismatch.o"), armObject("base_only_entry"));
writeFileSync(join(target, "DllUnknown.o"), armObject("unknown_entry"));
writeFileSync(join(base, "DllUnknown.o"), armObject("unknown_entry"));
const unknownResidue = withUnknownSection(armObject("residue_entry"));
writeFileSync(join(target, "DllTitle.o"), unknownResidue);
writeFileSync(join(base, "DllTitle.o"), unknownResidue);
writeFileSync(join(target, "NotADll.o"), armObject("ignored_entry"));
writeFileSync(join(base, "NotADll.o"), armObject("ignored_entry"));
symlinkSync(join(target, "DllBattle.o"), join(target, "DllTest000.o"));
writeFileSync(join(base, "DllTest000.o"), armObject("test_entry"));

assert.equal(inspectArmObject(join(target, "DllBattle.o")).functions.has("battle_entry"), true);
assert.throws(() => inspectArmObject(join(target, "DllBroken.o")), /ELF32|invalid size/);
const warnings = [];
const config = generateObjdiffConfig({ root, version: "TEST", requireIgnored: false, warn: (value) => warnings.push(value) });
assert.deepEqual(config.units.map((unit) => unit.name), [
  "main/code", "cro/DllBattle", "cro/DllEmpty", "cro/DllField", "cro/DllMismatch", "cro/DllTitle",
]);
assert.equal(config.units[1].metadata.complete, true);
assert.equal(config.units[2].metadata.complete, false);
assert.equal(config.units[3].metadata.complete, false);
assert.equal(config.units[4].metadata.complete, false);
assert.equal(config.units[5].metadata.complete, false);
assert.match(warnings.join("\n"), /DllBroken: excluded/);
assert.match(warnings.join("\n"), /DllUnknown: excluded because it is absent from the public CRO manifest/);
assert.match(warnings.join("\n"), /DllTest000: excluded: .*not a regular file/);
assert.equal(JSON.stringify(config).includes("NotADll"), false);

writeFileSync(manifestPath, JSON.stringify({ ...manifest, unitCount: 144 }));
assert.throws(
  () => generateObjdiffConfig({ root, version: "TEST", requireIgnored: false }),
  /must contain exactly 145 TEST units/,
);
writeFileSync(manifestPath, manifestText);

console.log("objdiff CRO config generator tests: ok");
