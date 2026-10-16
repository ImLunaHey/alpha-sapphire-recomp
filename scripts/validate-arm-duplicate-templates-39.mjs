import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-39.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 39: ${message}`);
}

const templateName = "typed_record_create_and_register";
const expectedTemplate = {
  bodySize: 192, instructionCount: 48, count: 12, internalLabels: 5, calls: 6, literalCount: 3,
};
const callContract = [
  { offset: 12, kind: "R_ARM_CALL", symbol: "func_00178DFC" },
  { offset: 48, kind: "R_ARM_CALL", symbol: "func_00184990", addend: -4 },
  { offset: 68, kind: "R_ARM_CALL", symbol: "$self" },
  { offset: 80, kind: "R_ARM_CALL", symbol: "func_00171FC0" },
  { offset: 140, kind: "R_ARM_CALL", symbol: "func_00178974" },
  { offset: 164, kind: "R_ARM_CALL", symbol: "func_0017933C" },
];
const slotContract = [
  { offset: 192, loadOffset: 16, role: "derived_dispatch_identity" },
  { offset: 196, loadOffset: 84, role: "shared_registry_identity" },
  { offset: 200, loadOffset: 124, role: "diagnostic_descriptor_identity" },
];
const expectedFunctions = [
  ["func_001628A0", "dispatch_001628A0", "descriptor_001628A0"],
  ["func_00163AA4", "dispatch_00163AA4", "descriptor_00163AA4"],
  ["func_00172534", "dispatch_00172534", "descriptor_pair_00172534"],
  ["func_00173064", "dispatch_00173064", "descriptor_pair_00172534"],
  ["func_00270F44", "dispatch_00270F44", "descriptor_00270F44"],
  ["func_00278924", "dispatch_00278924", "descriptor_00278924"],
  ["func_00287E00", "dispatch_00287E00", "descriptor_00287E00"],
  ["func_0028F9E0", "dispatch_0028F9E0", "descriptor_pair_0028F9E0"],
  ["func_002914EC", "dispatch_002914EC", "descriptor_pair_002914EC"],
  ["func_002948AC", "dispatch_002948AC", "descriptor_pair_0028F9E0"],
  ["func_0029DB3C", "dispatch_0029DB3C", "descriptor_0029DB3C"],
  ["func_0029FAC4", "dispatch_0029FAC4", "descriptor_pair_002914EC"],
];
const expectedIdentities = {
  dispatch_001628A0: { symbol: "func_001628A0_dispatch_identity", class: "dispatch-identity" },
  dispatch_00163AA4: { symbol: "func_00163AA4_dispatch_identity", class: "dispatch-identity" },
  dispatch_00172534: { symbol: "func_00172534_dispatch_identity", class: "dispatch-identity" },
  dispatch_00173064: { symbol: "func_00173064_dispatch_identity", class: "dispatch-identity" },
  dispatch_00270F44: { symbol: "func_00270F44_dispatch_identity", class: "dispatch-identity" },
  dispatch_00278924: { symbol: "func_00278924_dispatch_identity", class: "dispatch-identity" },
  dispatch_00287E00: { symbol: "func_00287E00_dispatch_identity", class: "dispatch-identity" },
  dispatch_0028F9E0: { symbol: "func_0028F9E0_dispatch_identity", class: "dispatch-identity" },
  dispatch_002914EC: { symbol: "func_002914EC_dispatch_identity", class: "dispatch-identity" },
  dispatch_002948AC: { symbol: "func_002948AC_dispatch_identity", class: "dispatch-identity" },
  dispatch_0029DB3C: { symbol: "func_0029DB3C_dispatch_identity", class: "dispatch-identity" },
  dispatch_0029FAC4: { symbol: "func_0029FAC4_dispatch_identity", class: "dispatch-identity" },
  registry: { symbol: "arm_duplicate_templates_39_shared_registry_identity", class: "mutable-global-address" },
  descriptor_001628A0: { symbol: "func_001628A0_diagnostic_descriptor_identity", class: "read-only-address" },
  descriptor_00163AA4: { symbol: "func_00163AA4_diagnostic_descriptor_identity", class: "read-only-address" },
  descriptor_pair_00172534: { symbol: "arm_duplicate_templates_39_diagnostic_descriptor_pair_00172534", class: "read-only-address" },
  descriptor_00270F44: { symbol: "func_00270F44_diagnostic_descriptor_identity", class: "read-only-address" },
  descriptor_00278924: { symbol: "func_00278924_diagnostic_descriptor_identity", class: "read-only-address" },
  descriptor_00287E00: { symbol: "func_00287E00_diagnostic_descriptor_identity", class: "read-only-address" },
  descriptor_pair_0028F9E0: { symbol: "arm_duplicate_templates_39_diagnostic_descriptor_pair_0028F9E0", class: "read-only-address" },
  descriptor_pair_002914EC: { symbol: "arm_duplicate_templates_39_diagnostic_descriptor_pair_002914EC", class: "read-only-address" },
  descriptor_0029DB3C: { symbol: "func_0029DB3C_diagnostic_descriptor_identity", class: "read-only-address" },
};

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 2304,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_39.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract),
  "unexpected direct-call contract");
assert(JSON.stringify(manifest.slotContract) === JSON.stringify(slotContract),
  "unexpected literal-slot/load contract");
assert(Array.isArray(manifest.functions) && manifest.functions.length === expectedFunctions.length,
  "unexpected function cardinality");

const identities = manifest.literalIdentities;
assert(JSON.stringify(identities) === JSON.stringify(expectedIdentities),
  "unexpected semantic identity ledger");
assert(new Set(Object.values(identities).map(({ symbol }) => symbol)).size === 22,
  "each semantic identity class must use a distinct symbol");
const expectedIdentityKeys = new Set(["registry"]);
for (const [, dispatch, diagnostic] of expectedFunctions) {
  expectedIdentityKeys.add(dispatch);
  expectedIdentityKeys.add(diagnostic);
}
assert(JSON.stringify([...Object.keys(identities)].sort()) === JSON.stringify([...expectedIdentityKeys].sort()),
  "unexpected semantic identity keys");

const occurrences = new Map(Object.keys(identities).map((identity) => [identity, 0]));
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const [name, dispatch, diagnostic] = expectedFunctions[index];
  const entry = manifest.functions[index];
  const expectedKeys = [dispatch, "registry", diagnostic];
  assert(entry && Object.keys(entry).sort().join(",") === "literals,name,template" &&
    entry.name === name && entry.template === templateName && Array.isArray(entry.literals) &&
    entry.literals.length === 3, `invalid mapping for ${name}`);
  assert(JSON.stringify(entry.literals.map(({ offset, loadOffset, identity }) =>
    [offset, loadOffset, identity])) === JSON.stringify(slotContract.map((slot, slotIndex) =>
    [slot.offset, slot.loadOffset, expectedKeys[slotIndex]])), `invalid literal mapping for ${name}`);
  for (const identity of expectedKeys) occurrences.set(identity, occurrences.get(identity) + 1);
}
assert(occurrences.get("registry") === 12 &&
  occurrences.get("descriptor_pair_00172534") === 2 &&
  occurrences.get("descriptor_pair_0028F9E0") === 2 &&
  occurrences.get("descriptor_pair_002914EC") === 2 &&
  [...occurrences].filter(([identity]) => identity !== "registry" && !identity.startsWith("descriptor_pair_"))
    .every(([, count]) => count === 1),
"the 36 literal occurrences must form the approved 22 equality classes");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/).filter((line) => line.startsWith("TYPED_RECORD_CREATE_AND_REGISTER "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedFunctions.map(([name, dispatch, diagnostic]) =>
  `TYPED_RECORD_CREATE_AND_REGISTER ${name}, ${identities[dispatch].symbol}, ${identities[diagnostic].symbol}`)),
"unexpected macro invocation order or semantic identity mapping");
const labels = source.match(/^\.Ldt39_\\@_[0-9a-f]{4}:$/gm) ?? [];
assert(JSON.stringify(labels) === JSON.stringify([
  ".Ldt39_\\@_004c:", ".Ldt39_\\@_0094:", ".Ldt39_\\@_0098:",
  ".Ldt39_\\@_00a8:", ".Ldt39_\\@_00b0:",
]), "template must define the five approved macro-local control labels");
assert((source.match(/^    bl\b/gm) ?? []).length === 6 && !/^    blx\b/m.test(source),
  "template must contain the approved six-call schedule");
assert(JSON.stringify(source.match(/^    \.word .+$/gm) ?? []) === JSON.stringify([
  "    .word \\dispatch",
  "    .word arm_duplicate_templates_39_shared_registry_identity",
  "    .word \\diagnostic",
]), "template must contain only the three approved symbolic post-body slots");
assert(!/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source),
  "source must not contain raw encodings or unapproved data objects");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/).filter((line) => /^    [a-z]/.test(line)).length === 48,
  "template must contain exactly 48 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "60cbd77624a1d84451feba774000ae9b69f3bf91bd949c543493638a35649180",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 39 manifest and deterministic source mapping");
  process.exit(0);
}

const data = readFileSync(resolve(process.cwd(), process.argv[2]));
assert(data.length >= 52 && data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) &&
  data[4] === 1 && data[5] === 1, "expected a little-endian ELF32 object");
const sectionOffset = data.readUInt32LE(32);
const sectionEntrySize = data.readUInt16LE(46);
const sectionCount = data.readUInt16LE(48);
const sectionNameIndex = data.readUInt16LE(50);
assert(sectionEntrySize >= 40 && sectionOffset + sectionEntrySize * sectionCount <= data.length,
  "invalid ELF section table");
const sections = [];
for (let index = 0; index < sectionCount; index += 1) {
  const offset = sectionOffset + index * sectionEntrySize;
  sections.push({ index, nameOffset: data.readUInt32LE(offset), type: data.readUInt32LE(offset + 4),
    flags: data.readUInt32LE(offset + 8), offset: data.readUInt32LE(offset + 16), size: data.readUInt32LE(offset + 20),
    link: data.readUInt32LE(offset + 24), info: data.readUInt32LE(offset + 28),
    alignment: data.readUInt32LE(offset + 32), entrySize: data.readUInt32LE(offset + 36) });
}
function readString(section, offset) {
  const start = section.offset + offset;
  const end = data.indexOf(0, start);
  assert(start >= section.offset && end >= start && end <= section.offset + section.size,
    "invalid ELF string reference");
  return data.toString("utf8", start, end);
}
const sectionNames = sections[sectionNameIndex];
assert(sectionNames, "missing section-name table");
for (const section of sections) section.name = readString(sectionNames, section.nameOffset);
const symbolTable = sections.find(({ type }) => type === 2);
assert(symbolTable && symbolTable.entrySize >= 16 && symbolTable.link < sections.length,
  "missing ELF symbol table");
const symbolStrings = sections[symbolTable.link];
const symbols = [];
for (let cursor = 0; cursor < symbolTable.size; cursor += symbolTable.entrySize) {
  const offset = symbolTable.offset + cursor;
  symbols.push({ name: readString(symbolStrings, data.readUInt32LE(offset)),
    value: data.readUInt32LE(offset + 4), size: data.readUInt32LE(offset + 8),
    info: data[offset + 12], sectionIndex: data.readUInt16LE(offset + 14) });
}
const symbolsByName = new Map(symbols.filter(({ name }) => name).map((symbol) => [symbol.name, symbol]));

const loadContract = [[16, 0xe59f10a8, 192], [84, 0xe59f1068, 196], [124, 0xe59f0044, 200]];
let reference;
for (const [name] of expectedFunctions) {
  const entry = manifest.functions.find((candidate) => candidate.name === name);
  const symbol = symbolsByName.get(name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 192, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 204, `${name} has an unexpected executable section or slot layout`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${name} must have one relocation section`);
  const relocationSection = relocationSections[0];
  assert(relocationSection.type === 9 && relocationSection.entrySize === 8 && relocationSection.size === 72,
    `${name} must have exactly nine REL relocations`);
  const expectedRelocations = [
    ...callContract.map(({ offset, symbol: target }) => [offset, 28, target === "$self" ? name : target]),
    ...entry.literals.map(({ offset, identity }) => [offset, 2, identities[identity].symbol]),
  ];
  for (let index = 0; index < expectedRelocations.length; index += 1) {
    const offset = relocationSection.offset + index * relocationSection.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const relocationSymbol = symbols[relocationInfo >>> 8];
    const [expectedOffset, expectedType, expectedSymbol] = expectedRelocations[index];
    assert(relocationOffset === expectedOffset && (relocationInfo & 0xff) === expectedType &&
      relocationSymbol?.name === expectedSymbol, `${name} has an unexpected call or identity relocation`);
    if (expectedType === 2) assert(relocationSymbol.sectionIndex === 0 && relocationSymbol.size === 0,
      `${name} relocation identity ${expectedSymbol} must remain undefined`);
  }
  const body = Buffer.from(data.subarray(section.offset, section.offset + symbol.size));
  for (const [useOffset, word, slotOffset] of loadContract) {
    assert(body.readUInt32LE(useOffset) === word &&
      useOffset + 8 + (word & 0xfff) === slotOffset,
    `${name} has an unexpected PC-relative literal load at body offset ${useOffset}`);
  }
  assert(body.readUInt32LE(48) === 0xebfffffd,
    `${name} allocator call does not preserve the symbolic -4 addend`);
  assert(body.readUInt32LE(68) === 0xebfffffe,
    `${name} self-call does not preserve the relocation addend`);
  for (const call of callContract.filter(({ symbol: target }) => target !== "$self")) {
    body.fill(0, call.offset, call.offset + 4);
  }
  if (reference) assert(body.equals(reference), `${name} differs from the normalized complete template body`);
  else reference = body;
}

console.log("Validated 12 ARM duplicate-template 39 functions (2,304 body bytes, 576 instructions, 36 literal slots in 22 equality classes)");
