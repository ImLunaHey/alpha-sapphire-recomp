import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const configPath = join(root, "config", "arm-duplicate-templates-73.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const fail = (message) => {
  throw new Error(message);
};

if (
  config.version !== 1 ||
  config.source !== "src/main/arm_duplicate_templates_73.S" ||
  config.mode !== "arm" ||
  config.expectedBodyBytes !== 1800 ||
  config.expectedInstructionCount !== 450 ||
  !Array.isArray(config.functions) ||
  config.functions.length !== 24
) {
  fail("Unexpected duplicate-template batch 73 configuration header");
}

const templateNames = [
  "initialize_pointer_vector",
  "lazy_shared_object",
  "guarded_dispatch",
  "register_literal_sized_record",
  "register_fixed_68_record",
  "select_relative_identity",
  "visit_24_entries",
  "set_object_flag",
];
if (Object.keys(config.templates).join(",") !== templateNames.join(",")) {
  fail("Unexpected template inventory or order");
}

const identities = config.literalIdentities;
const identitySymbols = new Map();
for (const [identity, entry] of Object.entries(identities)) {
  if (
    typeof entry?.symbol !== "string" ||
    typeof entry.class !== "string" ||
    identitySymbols.has(entry.symbol)
  ) {
    fail(`Invalid or aliased literal identity ${identity}`);
  }
  identitySymbols.set(entry.symbol, identity);
}
const declaredIdentitySymbols = [
  ...config.reusedLiteralIdentities,
  ...config.newLiteralIdentities,
];
if (
  new Set(declaredIdentitySymbols).size !== declaredIdentitySymbols.length ||
  declaredIdentitySymbols.length !== identitySymbols.size ||
  declaredIdentitySymbols.some((symbol) => !identitySymbols.has(symbol))
) {
  fail("Literal identity ownership lists do not partition the configured identities");
}

const functions = new Map();
const templateFunctions = new Map(templateNames.map((name) => [name, []]));
let bodyBytes = 0;
let instructionCount = 0;
let transferCount = 0;
let literalCount = 0;
let addressReferenceCount = 0;
const transferSitesBySymbol = new Map();

for (const entry of config.functions) {
  const template = config.templates[entry.template];
  if (
    !/^func_[0-9A-F]{8}$/.test(entry.name) ||
    functions.has(entry.name) ||
    template === undefined ||
    !Array.isArray(entry.internalLabelOffsets) ||
    !Array.isArray(entry.directTransfers) ||
    !Array.isArray(entry.literals)
  ) {
    fail(`Invalid or duplicate function entry ${entry?.name ?? "<unnamed>"}`);
  }
  functions.set(entry.name, entry);
  templateFunctions.get(entry.template).push(entry);
  bodyBytes += template.bodySize;
  instructionCount += template.instructionCount;
  transferCount += entry.directTransfers.length;
  literalCount += entry.literals.length;
  addressReferenceCount += entry.addressReferences?.length ?? 0;

  if (template.bodySize !== template.instructionCount * 4) {
    fail(`Invalid body metrics for ${entry.name}`);
  }
  if (
    entry.internalLabelOffsets.length !== template.internalLabels ||
    entry.directTransfers.length !== template.directTransfers ||
    (entry.addressReferences?.length ?? 0) !== template.addressReferences ||
    entry.literals.length !== template.poolSlots
  ) {
    fail(`Contract cardinality mismatch for ${entry.name}`);
  }
  if (new Set(entry.internalLabelOffsets).size !== entry.internalLabelOffsets.length) {
    fail(`Duplicate internal label offset for ${entry.name}`);
  }
  for (const offset of entry.internalLabelOffsets) {
    if (!Number.isInteger(offset) || offset < 0 || offset >= template.bodySize || offset % 4) {
      fail(`Invalid internal label offset for ${entry.name}`);
    }
  }
  for (const transfer of entry.directTransfers) {
    if (
      !Number.isInteger(transfer.offset) ||
      transfer.offset < 0 ||
      transfer.offset >= template.bodySize ||
      transfer.offset % 4 ||
      !["R_ARM_CALL", "R_ARM_JUMP24"].includes(transfer.kind) ||
      !["bl", "blne", "b"].includes(transfer.mnemonic) ||
      typeof transfer.symbol !== "string" ||
      typeof transfer.role !== "string"
    ) {
      fail(`Invalid direct transfer in ${entry.name}`);
    }
    transferSitesBySymbol.set(
      transfer.symbol,
      (transferSitesBySymbol.get(transfer.symbol) ?? 0) + 1
    );
  }
  for (const literal of entry.literals) {
    if (
      !Number.isInteger(literal.offset) ||
      literal.offset < template.bodySize ||
      literal.offset % 4 ||
      !Number.isInteger(literal.loadOffset) ||
      literal.loadOffset < 0 ||
      literal.loadOffset >= template.bodySize ||
      literal.loadOffset % 4 ||
      identities[literal.identity] === undefined
    ) {
      fail(`Invalid literal contract in ${entry.name}`);
    }
  }
  for (const reference of entry.addressReferences ?? []) {
    if (
      !Number.isInteger(reference.offset) ||
      reference.offset < 0 ||
      reference.offset >= template.bodySize ||
      reference.offset % 4 ||
      reference.mnemonic !== "adr" ||
      !/^r(?:[0-9]|1[0-2])$/.test(reference.destinationRegister) ||
      reference.targetOffset !== config.addressIdentityContract.targetOffset
    ) {
      fail(`Invalid address-reference contract in ${entry.name}`);
    }
  }
  const materialEnd = Math.max(
    template.bodySize,
    ...entry.literals.map((literal) => literal.offset + 4)
  );
  if (
    (entry.templateMaterialEndOffset !== undefined &&
      entry.templateMaterialEndOffset + 1 !== materialEnd) ||
    (entry.anonymousMaterialOffset !== undefined &&
      entry.anonymousMaterialOffset !== template.bodySize)
  ) {
    fail(`Invalid post-body material boundary for ${entry.name}`);
  }
}

for (const name of templateNames) {
  const template = config.templates[name];
  const entries = templateFunctions.get(name);
  if (entries.length !== template.count || entries.length !== 3) {
    fail(`Unexpected expansion count for ${name}`);
  }
}
if (
  bodyBytes !== config.expectedBodyBytes ||
  instructionCount !== config.expectedInstructionCount ||
  transferCount !== 60 ||
  literalCount !== 21 ||
  addressReferenceCount !== 6
) {
  fail("Aggregate batch metrics do not match the contract");
}

const branchContract = config.branchIdentityContract;
const branchSymbols = [...branchContract.primaryEntries, ...branchContract.secondaryEntries];
if (
  branchContract.mode !== "arm" ||
  branchContract.minimumAlignment !== 4 ||
  !branchContract.classesPairwiseDistinct ||
  new Set(branchSymbols).size !== branchSymbols.length ||
  branchSymbols.length !== transferSitesBySymbol.size ||
  branchSymbols.some((symbol) => !transferSitesBySymbol.has(symbol))
) {
  fail("Branch identity inventory does not match direct-transfer destinations");
}
const sharedSymbols = new Set();
for (const shared of branchContract.sharedClasses) {
  if (
    sharedSymbols.has(shared.symbol) ||
    shared.siteCount < 2 ||
    transferSitesBySymbol.get(shared.symbol) !== shared.siteCount
  ) {
    fail(`Invalid shared branch class ${shared.symbol}`);
  }
  sharedSymbols.add(shared.symbol);
}
if (
  new Set(branchContract.singletonClasses).size !== branchContract.singletonClasses.length ||
  branchContract.singletonClasses.some(
    (symbol) => sharedSymbols.has(symbol) || transferSitesBySymbol.get(symbol) !== 1
  ) ||
  sharedSymbols.size + branchContract.singletonClasses.length !== transferSitesBySymbol.size
) {
  fail("Shared and singleton branch classes do not partition the destinations");
}
for (const relation of branchContract.secondaryEntryRelations) {
  if (
    !branchContract.secondaryEntries.includes(relation.symbol) ||
    relation.ownerOffset + relation.bytesBeforeNextGlobal !==
      Number.parseInt(relation.nextGlobal.slice(5), 16) - Number.parseInt(relation.owner.slice(5), 16)
  ) {
    fail(`Invalid secondary-entry ownership relation for ${relation.symbol}`);
  }
}
if (
  config.addressIdentityContract.kind !== "post-body-address-only" ||
  config.addressIdentityContract.siteCount !== addressReferenceCount ||
  !config.addressIdentityContract.pairwiseDistinctAcrossFunctions ||
  config.addressIdentityContract.bytesOwnedByBatch ||
  config.addressIdentityContract.relocationCount !== 0
) {
  fail("Invalid address-identity contract");
}

const sourcePath = join(root, config.source);
const source = readFileSync(sourcePath, "utf8");
const sourceSha256 = createHash("sha256").update(source).digest("hex");
if (!/^[0-9a-f]{64}$/.test(config.sourceSha256) || sourceSha256 !== config.sourceSha256) {
  fail(`Source SHA-256 mismatch: expected ${config.sourceSha256}, found ${sourceSha256}`);
}

const identitySymbol = (literal) => identities[literal.identity].symbol;
const transferForRole = (entry, role) => {
  const found = entry.directTransfers.find((transfer) => transfer.role === role);
  if (found === undefined) fail(`Missing ${role} transfer for ${entry.name}`);
  return found.symbol;
};
function expectedInvocation(entry) {
  switch (entry.template) {
    case "initialize_pointer_vector":
      return `DT73_VECTOR ${entry.name}, ${transferForRole(entry, "construct_element")}, ${identitySymbol(entry.literals[0])}`;
    case "lazy_shared_object":
      return `DT73_LAZY ${entry.name}, ${identitySymbol(entry.literals[0])}`;
    case "guarded_dispatch":
      return `DT73_GUARDED ${entry.name}, ${transferForRole(entry, "dispatch_active_request")}`;
    case "register_literal_sized_record":
      return `DT73_REGISTER_LITERAL ${entry.name}, ${transferForRole(entry, "construct_record")}, ${identitySymbol(entry.literals[0])}, ${entry.literals[0].offset}`;
    case "register_fixed_68_record":
      return `DT73_REGISTER_FIXED ${entry.name}, ${transferForRole(entry, "construct_record")}`;
    case "select_relative_identity":
      return `DT73_SELECT ${entry.name}, ${identitySymbol(entry.literals[0])}, ${identitySymbol(entry.literals[1])}`;
    case "visit_24_entries":
      return `DT73_VISIT ${entry.name}, ${transferForRole(entry, "visit_entry")}`;
    case "set_object_flag":
      return `DT73_FLAG ${entry.name}, ${transferForRole(entry, "select_object_member")}`;
    default:
      fail(`Unknown template ${entry.template}`);
  }
}
const invocationPattern = /^DT73_(?:VECTOR|LAZY|GUARDED|REGISTER_LITERAL|REGISTER_FIXED|SELECT|VISIT|FLAG) .+$/gm;
const invocations = [...source.matchAll(invocationPattern)].map((match) => match[0]);
const expectedInvocations = config.functions.map(expectedInvocation);
if (
  invocations.length !== expectedInvocations.length ||
  invocations.some((line, index) => line !== expectedInvocations[index])
) {
  fail("Assembly invocation list does not match the configuration");
}
for (const macro of ["BEGIN", "END", "VECTOR", "LAZY", "GUARDED", "REGISTER_LITERAL", "REGISTER_FIXED", "SELECT", "VISIT", "FLAG"]) {
  if (!source.includes(`.macro DT73_${macro} `) && !source.includes(`.macro DT73_${macro}\n`)) {
    fail(`Missing DT73_${macro} macro definition`);
  }
}

const [objectPath, readelfPath] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelfPath === undefined) || process.argv.length > 4) {
  fail("Usage: node scripts/validate-arm-duplicate-templates-73.mjs [object readelf]");
}
if (objectPath === undefined) {
  console.log(
    `Validated duplicate-template batch 73 source: ${functions.size} functions, ` +
      `${instructionCount} instructions, ${bodyBytes} body bytes, ${transferCount} direct transfers, ` +
      `${literalCount} literal slots, ${addressReferenceCount} address-only identities; SHA-256 ${sourceSha256}.`
  );
  process.exit(0);
}

function inspect(args) {
  const result = spawnSync(readelfPath, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  }
  return result.stdout;
}
const sectionOutput = inspect(["--sections", "--wide", objectPath]);
const symbolOutput = inspect(["--symbols", "--wide", objectPath]);
const relocationOutput = inspect(["--relocs", "--wide", objectPath]);
const object = readFileSync(objectPath);

const sections = new Map();
const sectionPattern = /^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+([0-9A-Fa-f]+)\s+([0-9A-Fa-f]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/gm;
for (const match of sectionOutput.matchAll(sectionPattern)) {
  sections.set(match[2], {
    index: Number.parseInt(match[1], 10),
    type: match[3],
    fileOffset: Number.parseInt(match[4], 16),
    size: Number.parseInt(match[5], 16),
    flags: match[6],
    alignment: Number.parseInt(match[7], 10),
  });
}

const symbols = new Map();
const symbolPattern = /^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm;
for (const match of symbolOutput.matchAll(symbolPattern)) {
  const entries = symbols.get(match[7]) ?? [];
  entries.push({
    value: Number.parseInt(match[1], 16),
    size: Number.parseInt(match[2], 10),
    type: match[3],
    binding: match[4],
    visibility: match[5],
    sectionIndex: match[6],
  });
  symbols.set(match[7], entries);
}

const relocations = new Map();
let relocatedSection;
for (const line of relocationOutput.split("\n")) {
  const heading = /^Relocation section '\.rela?(\S+)'/.exec(line);
  if (heading !== null) {
    relocatedSection = heading[1];
    continue;
  }
  const relocation = /^\s*([0-9A-Fa-f]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/.exec(line);
  if (relocation !== null && relocatedSection !== undefined) {
    const entries = relocations.get(relocatedSection) ?? [];
    entries.push({
      offset: Number.parseInt(relocation[1], 16),
      type: relocation[2],
      symbol: relocation[3],
    });
    relocations.set(relocatedSection, entries);
  }
}

const internalBranches = {
  initialize_pointer_vector: [[64, 112, 9], [108, 68, 3]],
  lazy_shared_object: [[24, 80, 1], [44, 64, 0]],
  guarded_dispatch: [[32, 76, 0]],
  register_literal_sized_record: [],
  register_fixed_68_record: [],
  select_relative_identity: [[8, 52, 0], [20, 52, 0], [40, 52, 0]],
  visit_24_entries: [[44, 12, 11]],
  set_object_flag: [],
};
const literalDestinationRegisters = {
  initialize_pointer_vector: [1],
  lazy_shared_object: [6],
  guarded_dispatch: [1, 0],
  register_literal_sized_record: [0],
  register_fixed_68_record: [],
  select_relative_identity: [0, 0],
  visit_24_entries: [],
  set_object_flag: [],
};
const normalizedBodies = new Map();
let objectRelocationCount = 0;

function branchTarget(word, offset) {
  let displacement = word & 0x00ffffff;
  if (displacement & 0x00800000) displacement -= 0x01000000;
  return offset + 8 + displacement * 4;
}
function rotateRight32(value, count) {
  if (count === 0) return value >>> 0;
  return ((value >>> count) | (value << (32 - count))) >>> 0;
}

for (const entry of config.functions) {
  const template = config.templates[entry.template];
  const sectionName = `.text.${entry.name}`;
  const section = sections.get(sectionName);
  const expectedSectionSize = Math.max(
    template.bodySize,
    ...entry.literals.map((literal) => literal.offset + 4)
  );
  if (
    section === undefined ||
    section.type !== "PROGBITS" ||
    section.size !== expectedSectionSize ||
    !section.flags.includes("A") ||
    !section.flags.includes("X") ||
    section.alignment !== 4 ||
    section.fileOffset + section.size > object.length
  ) {
    fail(`Invalid executable section for ${entry.name}`);
  }
  const functionSymbols = symbols.get(entry.name) ?? [];
  if (
    functionSymbols.length !== 1 ||
    functionSymbols[0].value !== 0 ||
    functionSymbols[0].size !== template.bodySize ||
    functionSymbols[0].type !== "FUNC" ||
    functionSymbols[0].binding !== "GLOBAL" ||
    functionSymbols[0].visibility !== "DEFAULT" ||
    Number.parseInt(functionSymbols[0].sectionIndex, 10) !== section.index
  ) {
    fail(`Invalid function symbol for ${entry.name}`);
  }

  const expectedRelocations = [
    ...entry.directTransfers.map((transfer) => ({
      offset: transfer.offset,
      type: transfer.kind,
      symbol: transfer.symbol,
    })),
    ...entry.literals.map((literal) => ({
      offset: literal.offset,
      type: "R_ARM_ABS32",
      symbol: identitySymbol(literal),
    })),
  ].sort((left, right) => left.offset - right.offset);
  const actualRelocations = relocations.get(sectionName) ?? [];
  objectRelocationCount += actualRelocations.length;
  if (
    actualRelocations.length !== expectedRelocations.length ||
    actualRelocations.some((actual, index) => {
      const expected = expectedRelocations[index];
      return actual.offset !== expected.offset || actual.type !== expected.type || actual.symbol !== expected.symbol;
    })
  ) {
    fail(`Relocation schedule mismatch for ${entry.name}`);
  }

  const bytes = object.subarray(section.fileOffset, section.fileOffset + section.size);
  const wordAt = (offset) => bytes.readUInt32LE(offset);
  for (const transfer of entry.directTransfers) {
    const word = wordAt(transfer.offset);
    const condition = word >>> 28;
    const link = (word >>> 24) & 1;
    const expectedCondition = transfer.mnemonic === "blne" ? 1 : 14;
    const expectedLink = transfer.mnemonic === "b" ? 0 : 1;
    if (((word >>> 25) & 7) !== 5 || condition !== expectedCondition || link !== expectedLink) {
      fail(`Direct-transfer instruction mismatch for ${entry.name}+${transfer.offset}`);
    }
  }
  for (const [offset, target, condition] of internalBranches[entry.template]) {
    const word = wordAt(offset);
    if (
      ((word >>> 25) & 7) !== 5 ||
      ((word >>> 24) & 1) !== 0 ||
      word >>> 28 !== condition ||
      branchTarget(word, offset) !== target
    ) {
      fail(`Internal branch mismatch for ${entry.name}+${offset}`);
    }
  }
  const localTargets = [...new Set(internalBranches[entry.template].map((branch) => branch[1]))].sort((a, b) => a - b);
  if (localTargets.join(",") !== [...entry.internalLabelOffsets].sort((a, b) => a - b).join(",")) {
    fail(`Internal label contract mismatch for ${entry.name}`);
  }
  for (const [index, literal] of entry.literals.entries()) {
    const word = wordAt(literal.loadOffset);
    const immediate = word & 0xfff;
    const target = literal.loadOffset + 8 + (((word >>> 23) & 1) ? immediate : -immediate);
    if (
      ((word >>> 26) & 3) !== 1 ||
      ((word >>> 24) & 1) !== 1 ||
      ((word >>> 21) & 1) !== 0 ||
      ((word >>> 20) & 1) !== 1 ||
      ((word >>> 16) & 15) !== 15 ||
      ((word >>> 12) & 15) !== literalDestinationRegisters[entry.template][index] ||
      target !== literal.offset
    ) {
      fail(`Literal load mismatch for ${entry.name}+${literal.loadOffset}`);
    }
  }
  for (const reference of entry.addressReferences ?? []) {
    const word = wordAt(reference.offset);
    const opcode = (word >>> 21) & 15;
    const immediate = rotateRight32(word & 0xff, ((word >>> 8) & 15) * 2);
    const target = reference.offset + 8 + (opcode === 4 ? immediate : -immediate);
    if (
      ((word >>> 25) & 7) !== 1 ||
      ![2, 4].includes(opcode) ||
      ((word >>> 16) & 15) !== 15 ||
      ((word >>> 12) & 15) !== Number.parseInt(reference.destinationRegister.slice(1), 10) ||
      target !== reference.targetOffset ||
      actualRelocations.some((relocation) => relocation.offset === reference.offset)
    ) {
      fail(`Address-reference instruction mismatch for ${entry.name}+${reference.offset}`);
    }
  }

  const normalized = Buffer.from(bytes.subarray(0, template.bodySize));
  for (const transfer of entry.directTransfers) {
    normalized.writeUInt32LE(
      (normalized.readUInt32LE(transfer.offset) & 0xff000000) >>> 0,
      transfer.offset
    );
  }
  for (const literal of entry.literals) {
    normalized.writeUInt32LE(
      (normalized.readUInt32LE(literal.loadOffset) & 0xfffff000) >>> 0,
      literal.loadOffset
    );
  }
  const normalizedDigest = createHash("sha256").update(normalized).digest("hex");
  const priorDigest = normalizedBodies.get(entry.template);
  if (priorDigest !== undefined && priorDigest !== normalizedDigest) {
    fail(`Normalized body mismatch within template ${entry.template}`);
  }
  normalizedBodies.set(entry.template, normalizedDigest);
}

if (objectRelocationCount !== transferCount + literalCount) {
  fail(`Expected ${transferCount + literalCount} configured relocations, found ${objectRelocationCount}`);
}
for (const symbol of transferSitesBySymbol.keys()) {
  const entries = symbols.get(symbol) ?? [];
  const entry = entries[0];
  const validUndefined = entry?.sectionIndex === "UND" && entry.value === 0 &&
    entry.size === 0 && entry.type === "NOTYPE";
  const validForeignDefinition = entry?.sectionIndex !== "UND" &&
    Number.isInteger(Number.parseInt(entry.sectionIndex, 10)) && entry.type === "FUNC";
  if (entries.length !== 1 || entry.binding !== "GLOBAL" || entry.visibility !== "DEFAULT" ||
      (!validUndefined && !validForeignDefinition)) {
    fail(`Invalid direct-transfer identity ${symbol}`);
  }
}
for (const symbol of identitySymbols.keys()) {
  const entries = symbols.get(symbol) ?? [];
  if (entries.length !== 1 || entries[0].value !== 0 || entries[0].size !== 0 ||
      entries[0].type !== "NOTYPE" || entries[0].binding !== "GLOBAL" ||
      entries[0].visibility !== "DEFAULT" || entries[0].sectionIndex !== "UND") {
    fail(`Invalid undefined literal identity ${symbol}`);
  }
}

console.log(
  `Validated duplicate-template batch 73 object: ${functions.size} ARM functions, ` +
    `${instructionCount} instructions, ${bodyBytes} body bytes, ${objectRelocationCount} relocations ` +
    `(${transferCount} direct transfers and ${literalCount} literal identities), ` +
    `${addressReferenceCount} relocation-free address identities; SHA-256 ${sourceSha256}.`
);
