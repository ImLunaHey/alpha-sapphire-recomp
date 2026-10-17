import { createHash } from "node:crypto";
import {
  closeSync,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  renameSync,
  statSync,
  unlinkSync,
  writeSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));

export const CRO_HEADER_SIZE = 0x138;
export const MAX_CRO_SIZE = 64 * 1024 * 1024;

const TABLE_NAMES = [
  "code",
  "data",
  "moduleName",
  "segments",
  "namedExports",
  "indexedExports",
  "exportStrings",
  "exportTree",
  "importModules",
  "importPatches",
  "namedImports",
  "indexedImports",
  "anonymousImports",
  "importStrings",
  "unknown14",
  "internalRelocations",
  "unknown16",
];

const TABLE_ELEMENT_SIZE = {
  code: 1,
  data: 1,
  moduleName: 1,
  segments: 12,
  namedExports: 8,
  indexedExports: 4,
  exportStrings: 1,
  exportTree: 8,
  importModules: 20,
  importPatches: 12,
  namedImports: 8,
  indexedImports: 8,
  anonymousImports: 8,
  importStrings: 1,
  unknown14: 8,
  internalRelocations: 12,
  unknown16: 12,
};

const SEGMENT_NAMES = new Map([
  [0, ".text"],
  [1, ".rodata"],
  [2, ".data"],
  [3, ".bss"],
]);

const SHT_NULL = 0;
const SHT_PROGBITS = 1;
const SHT_SYMTAB = 2;
const SHT_STRTAB = 3;
const SHT_NOBITS = 8;
const SHT_REL = 9;
const SHF_WRITE = 1;
const SHF_ALLOC = 2;
const SHF_EXECINSTR = 4;
const SHF_INFO_LINK = 0x40;
const STB_GLOBAL = 1;
const STT_NOTYPE = 0;
const STT_OBJECT = 1;
const STT_FUNC = 2;
const STT_SECTION = 3;
const R_ARM_ABS32 = 2;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function add(...values) {
  const result = values.reduce((sum, value) => sum + value, 0);
  check(Number.isSafeInteger(result) && result >= 0, "integer overflow while computing a CRO range");
  return result;
}

function multiply(left, right, label) {
  const result = left * right;
  check(Number.isSafeInteger(result) && result >= 0, `${label} byte size overflows`);
  return result;
}

function align(value, alignment) {
  check(Number.isSafeInteger(value) && value >= 0, "invalid value to align");
  check(Number.isSafeInteger(alignment) && alignment > 0 && (alignment & (alignment - 1)) === 0,
    "invalid power-of-two alignment");
  return add(value, (alignment - (value % alignment)) % alignment);
}

function range(buffer, offset, size, label) {
  check(Number.isSafeInteger(offset) && offset >= 0, `${label} has an invalid offset`);
  check(Number.isSafeInteger(size) && size >= 0, `${label} has an invalid size`);
  check(add(offset, size) <= buffer.length, `${label} extends beyond the CRO`);
  return buffer.subarray(offset, offset + size);
}

function u32(buffer, offset, label) {
  return range(buffer, offset, 4, label).readUInt32LE(0);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest();
}

const UTF8 = new TextDecoder("utf-8", { fatal: true });

function decodeCString(buffer, offset, table, label) {
  const end = add(table.offset, table.bytes);
  check(offset >= table.offset && offset < end, `${label} offset is outside its string table`);
  let cursor = offset;
  while (cursor < end && buffer[cursor] !== 0) cursor++;
  check(cursor < end, `${label} is not NUL terminated inside its string table`);
  check(cursor - offset <= 4096, `${label} exceeds the 4096-byte string limit`);
  let value;
  try {
    value = UTF8.decode(buffer.subarray(offset, cursor));
  } catch {
    throw new Error(`${label} is not valid UTF-8`);
  }
  check(value.length > 0 && !value.includes("\0"), `${label} is empty or contains NUL`);
  return value;
}

function parseSegmentOffset(value) {
  return { segmentIndex: value & 0xf, offset: value >>> 4 };
}

function encodeIdentity(value) {
  return Buffer.from(value, "utf8").toString("hex");
}

function parseTables(buffer) {
  const tables = {};
  for (let index = 0; index < TABLE_NAMES.length; index++) {
    const name = TABLE_NAMES[index];
    const offset = u32(buffer, 0xb0 + index * 8, `${name} table offset`);
    const sizeOrCount = u32(buffer, 0xb4 + index * 8, `${name} table size`);
    const elementSize = TABLE_ELEMENT_SIZE[name];
    const bytes = multiply(sizeOrCount, elementSize, name);
    if (elementSize > 1) check(sizeOrCount <= 0x100000, `${name} table count exceeds the parser limit`);
    range(buffer, offset, bytes, `${name} table`);
    tables[name] = { offset, sizeOrCount, bytes, elementSize };
  }
  return tables;
}

function validateMetadataTables(tables) {
  const metadataStart = tables.moduleName.offset;
  const metadataEnd = tables.data.offset;
  const metadataNames = TABLE_NAMES.slice(2);
  const intervals = [];
  for (const name of metadataNames) {
    const table = tables[name];
    check(table.offset >= metadataStart && add(table.offset, table.bytes) <= metadataEnd,
      `${name} table lies outside the metadata hash region`);
    if (table.bytes) intervals.push({ name, start: table.offset, end: table.offset + table.bytes });
  }
  intervals.sort((left, right) => left.start - right.start || left.end - right.end);
  for (let index = 1; index < intervals.length; index++) {
    check(intervals[index - 1].end <= intervals[index].start,
      `${intervals[index - 1].name} overlaps ${intervals[index].name}`);
  }
}

function sectionForSegment(segments, segmentIndex, label) {
  const segment = segments[segmentIndex];
  check(segment && segment.sectionName, `${label} refers to unsupported segment index ${segmentIndex}`);
  return segment;
}

function validateSegmentTarget(segment, offset, label) {
  const logical = segment.sectionName === ".text" ? offset & ~1 : offset;
  check(logical < segment.size, `${label} points beyond ${segment.sectionName}`);
}

function parseRelocationRecord(buffer, table, index, label) {
  check(index >= 0 && index < table.sizeOrCount, `${label} index is out of range`);
  const offset = table.offset + index * 12;
  const output = parseSegmentOffset(u32(buffer, offset, `${label} output`));
  return {
    index,
    output,
    type: buffer[offset + 4],
    byte5: buffer[offset + 5],
    byte6: buffer[offset + 6],
    byte7: buffer[offset + 7],
    addend: u32(buffer, offset + 8, `${label} addend`),
  };
}

function validateAndPlaceRelocation(record, sections, relocations, occupied, target) {
  check(record.type === R_ARM_ABS32, `unsupported CRO relocation type ${record.type}; only type 2 is losslessly implemented`);
  check(record.byte6 === 0 && record.byte7 === 0, "type-2 CRO relocation has nonzero reserved bytes");
  const outputSegment = sectionForSegment(sections, record.output.segmentIndex, "relocation output");
  check(outputSegment.sectionName !== ".bss", "relocation output cannot address NOBITS .bss");
  check((record.output.offset & 3) === 0, "type-2 CRO relocation output is not 4-byte aligned");
  check(add(record.output.offset, 4) <= outputSegment.size, "type-2 CRO relocation output exceeds its segment");
  const key = `${record.output.segmentIndex}:${record.output.offset}`;
  check(!occupied.has(key), "multiple CRO relocations write the same output word");
  occupied.add(key);
  check(outputSegment.data.readUInt32LE(record.output.offset) === 0,
    "type-2 CRO relocation output is already resolved or noncanonical");
  outputSegment.data.writeUInt32LE(record.addend, record.output.offset);
  relocations.get(record.output.segmentIndex).push({ offset: record.output.offset, target });
}

function subtable(globalTable, offset, count, elementSize, label) {
  const bytes = multiply(count, elementSize, label);
  check(offset >= globalTable.offset && add(offset, bytes) <= add(globalTable.offset, globalTable.bytes),
    `${label} lies outside its global table`);
  check((offset - globalTable.offset) % elementSize === 0, `${label} is not entry aligned`);
  return { offset, count, bytes };
}

function addExport(exports, names, name, target, segments, label) {
  const segment = sectionForSegment(segments, target.segmentIndex, label);
  validateSegmentTarget(segment, target.offset, label);
  check(!names.has(name), `duplicate exported ELF symbol ${name}`);
  names.add(name);
  exports.push({ name, segmentIndex: target.segmentIndex, value: target.offset });
}

export function parseCro(buffer) {
  check(Buffer.isBuffer(buffer), "CRO input must be a Buffer");
  check(buffer.length >= CRO_HEADER_SIZE && buffer.length <= MAX_CRO_SIZE,
    `CRO input size must be between ${CRO_HEADER_SIZE} and ${MAX_CRO_SIZE} bytes`);
  check(buffer.toString("ascii", 0x80, 0x84) === "CRO0", "CRO0 magic is missing");
  const declaredSize = u32(buffer, 0x90, "declared CRO size");
  check(declaredSize === buffer.length, "declared CRO size differs from the complete input size");
  const bssSize = u32(buffer, 0x94, "CRO BSS allocation size");
  const tables = parseTables(buffer);
  check(tables.code.offset >= CRO_HEADER_SIZE, "code blob overlaps the CRO header");
  check(tables.code.bytes === tables.moduleName.offset - tables.code.offset,
    "code blob does not end at the module metadata region");
  check(tables.data.offset >= tables.moduleName.offset, "data blob precedes module metadata");
  check(add(tables.data.offset, tables.data.bytes) <= declaredSize, "data blob exceeds the declared CRO size");
  validateMetadataTables(tables);

  const hashRanges = [
    [0x80, tables.code.offset],
    [tables.code.offset, tables.moduleName.offset],
    [tables.moduleName.offset, tables.data.offset],
    [tables.data.offset, tables.data.offset + tables.data.bytes],
  ];
  for (let index = 0; index < hashRanges.length; index++) {
    const [start, end] = hashRanges[index];
    check(start <= end && end <= declaredSize, `CRO hash region ${index} is invalid`);
    const calculated = sha256(buffer.subarray(start, end));
    check(buffer.subarray(index * 32, index * 32 + 32).equals(calculated),
      `CRO hash region ${index} does not match its header digest`);
  }

  check(tables.moduleName.bytes >= 2 && buffer[tables.moduleName.offset + tables.moduleName.bytes - 1] === 0,
    "module name table is not NUL terminated");
  const moduleName = decodeCString(buffer, tables.moduleName.offset, tables.moduleName, "module name");
  check(moduleName.length + 1 === tables.moduleName.bytes,
    "module name table contains trailing bytes after its string");

  check(tables.segments.sizeOrCount >= 4 && tables.segments.sizeOrCount <= 16,
    "segment table must contain between 4 and 16 entries");
  const segments = [];
  for (let index = 0; index < tables.segments.sizeOrCount; index++) {
    const offset = tables.segments.offset + index * 12;
    const fileOffset = u32(buffer, offset, `segment ${index} file offset`);
    const size = u32(buffer, offset + 4, `segment ${index} size`);
    const type = u32(buffer, offset + 8, `segment ${index} type`);
    let sectionName = SEGMENT_NAMES.get(type);
    // CROs reserve entries 0..3 for text, rodata, data and BSS. An absent
    // BSS is encoded as an all-zero entry (therefore raw type 0), while an
    // absent rodata retains type 1. Normalize the reserved empty BSS slot.
    if (index === 3 && size === 0 && fileOffset === 0 && type === 0) sectionName = ".bss";
    const segment = { index, fileOffset, size, type, sectionName, data: null };
    segments.push(segment);
    if (index < 3) check(type === index, `reserved segment ${index} has type ${type}, expected ${index}`);
    if (index === 3) check((size === 0 && fileOffset === 0 && (type === 0 || type === 3)) || type === 3,
      "reserved BSS segment has invalid geometry or type");
    if (index > 3) check(size === 0, `unexpected nonempty auxiliary segment ${index}`);
    if (index > 3 || size === 0) {
      if (index < 3 && sectionName !== ".bss") segment.data = Buffer.alloc(0);
      continue;
    }
    check(sectionName, `nonempty segment ${index} has unsupported type ${type}`);
    if (sectionName === ".bss") {
      check(fileOffset === 0, ".bss segment must have zero file offset");
    } else {
      range(buffer, fileOffset, size, `${sectionName} segment`);
      segment.data = Buffer.from(buffer.subarray(fileOffset, fileOffset + size));
    }
  }
  const [text, rodata, data, bss] = segments;
  check(text.size > 0, "CRO has an empty .text segment");
  for (const segment of [text, rodata]) {
    check(segment.fileOffset >= tables.code.offset && add(segment.fileOffset, segment.size) <= tables.moduleName.offset,
      `${segment.sectionName} lies outside the hashed code blob`);
  }
  check((data.size === 0 || data.fileOffset === tables.data.offset) && data.size === tables.data.bytes,
    ".data segment differs from the hashed data blob");
  check(bssSize >= bss.size, "header BSS allocation is smaller than the .bss segment");
  const fileSegments = [text, rodata, data].filter((segment) => segment.size > 0)
    .sort((left, right) => left.fileOffset - right.fileOffset);
  for (let index = 1; index < fileSegments.length; index++) {
    check(fileSegments[index - 1].fileOffset + fileSegments[index - 1].size <= fileSegments[index].fileOffset,
      `${fileSegments[index - 1].sectionName} overlaps ${fileSegments[index].sectionName}`);
  }
  check(tables.unknown14.sizeOrCount === 0 && tables.unknown16.sizeOrCount === 0,
    "unsupported CRO auxiliary relocation tables are nonempty");

  const exports = [];
  const exportNames = new Set();
  for (let index = 0; index < tables.namedExports.sizeOrCount; index++) {
    const offset = tables.namedExports.offset + index * 8;
    const name = decodeCString(buffer, u32(buffer, offset, `named export ${index} name offset`),
      tables.exportStrings, `named export ${index}`);
    addExport(exports, exportNames, name,
      parseSegmentOffset(u32(buffer, offset + 4, `named export ${index} target`)),
      segments, `named export ${index}`);
  }
  for (let index = 0; index < tables.indexedExports.sizeOrCount; index++) {
    const name = `__cro_export_index_${index.toString(16).padStart(4, "0")}`;
    addExport(exports, exportNames, name,
      parseSegmentOffset(u32(buffer, tables.indexedExports.offset + index * 4, `indexed export ${index}`)),
      segments, `indexed export ${index}`);
  }

  const importRecords = Array.from({ length: tables.importPatches.sizeOrCount }, (_, index) =>
    parseRelocationRecord(buffer, tables.importPatches, index, `import patch ${index}`));
  const internalRecords = Array.from({ length: tables.internalRelocations.sizeOrCount }, (_, index) =>
    parseRelocationRecord(buffer, tables.internalRelocations, index, `internal relocation ${index}`));
  const importOwners = new Array(importRecords.length).fill(null);
  const importedNames = new Set();
  const importLists = [];

  function registerImport(name, patchOffset, label) {
    check(name.length > 0 && !name.includes("\0"), `${label} produced an invalid ELF symbol name`);
    check(!exportNames.has(name), `${label} collides with an exported symbol`);
    importedNames.add(name);
    check(patchOffset >= tables.importPatches.offset && patchOffset < tables.importPatches.offset + tables.importPatches.bytes,
      `${label} patch-list head is outside the import patch table`);
    check((patchOffset - tables.importPatches.offset) % 12 === 0, `${label} patch-list head is not entry aligned`);
    const indices = [];
    let index = (patchOffset - tables.importPatches.offset) / 12;
    for (;;) {
      check(index < importRecords.length, `${label} patch list is unterminated`);
      check(importOwners[index] === null, `${label} patch list overlaps ${importOwners[index]}`);
      importOwners[index] = label;
      indices.push(index);
      const record = importRecords[index];
      check(record.byte5 === 0 || record.byte5 === 1, `${label} has a noncanonical patch-list marker`);
      if (record.byte5 === 1) break;
      index++;
    }
    importLists.push({ name, indices });
  }

  for (let index = 0; index < tables.namedImports.sizeOrCount; index++) {
    const offset = tables.namedImports.offset + index * 8;
    const name = decodeCString(buffer, u32(buffer, offset, `named import ${index} name offset`),
      tables.importStrings, `named import ${index}`);
    registerImport(name, u32(buffer, offset + 4, `named import ${index} patch head`),
      `named import ${index}`);
  }

  for (let moduleIndex = 0; moduleIndex < tables.importModules.sizeOrCount; moduleIndex++) {
    const offset = tables.importModules.offset + moduleIndex * 20;
    const module = decodeCString(buffer, u32(buffer, offset, `import module ${moduleIndex} name offset`),
      tables.importStrings, `import module ${moduleIndex}`);
    const indexed = subtable(tables.indexedImports,
      u32(buffer, offset + 4, `import module ${moduleIndex} indexed offset`),
      u32(buffer, offset + 8, `import module ${moduleIndex} indexed count`), 8,
      `import module ${moduleIndex} indexed imports`);
    const anonymous = subtable(tables.anonymousImports,
      u32(buffer, offset + 12, `import module ${moduleIndex} anonymous offset`),
      u32(buffer, offset + 16, `import module ${moduleIndex} anonymous count`), 8,
      `import module ${moduleIndex} anonymous imports`);
    const encodedModule = encodeIdentity(module);
    for (let index = 0; index < indexed.count; index++) {
      const entry = indexed.offset + index * 8;
      const exportIndex = u32(buffer, entry, `indexed import ${moduleIndex}:${index} export index`);
      const name = `__cro_import_indexed_m${encodedModule}_i${exportIndex.toString(16).padStart(8, "0")}`;
      registerImport(name, u32(buffer, entry + 4, `indexed import ${moduleIndex}:${index} patch head`),
        `indexed import ${moduleIndex}:${index}`);
    }
    for (let index = 0; index < anonymous.count; index++) {
      const entry = anonymous.offset + index * 8;
      const target = parseSegmentOffset(u32(buffer, entry, `anonymous import ${moduleIndex}:${index} target`));
      check(target.segmentIndex < 16, `anonymous import ${moduleIndex}:${index} has an invalid target segment`);
      const name = `__cro_import_anon_m${encodedModule}_s${target.segmentIndex.toString(16)}_${target.offset.toString(16).padStart(7, "0")}`;
      registerImport(name, u32(buffer, entry + 4, `anonymous import ${moduleIndex}:${index} patch head`),
        `anonymous import ${moduleIndex}:${index}`);
    }
  }
  check(importOwners.every((owner) => owner !== null), "one or more import patch records have no owning import");

  const relocations = new Map(segments.map((segment) => [segment.index, []]));
  const occupied = new Set();
  for (const list of importLists) {
    for (const index of list.indices) {
      validateAndPlaceRelocation(importRecords[index], segments, relocations, occupied,
        { kind: "symbol", name: list.name });
    }
  }
  for (const record of internalRecords) {
    check(record.byte5 < segments.length, `internal relocation ${record.index} has an invalid target segment`);
    // CRO addends are signed/wrapping Elf32 words. Retail modules use
    // negative and one-past-segment addends, so only the target section
    // identity is bounded; the loader/linker deliberately does the math.
    sectionForSegment(segments, record.byte5, `internal relocation ${record.index} target`);
    validateAndPlaceRelocation(record, segments, relocations, occupied,
      { kind: "section", segmentIndex: record.byte5 });
  }

  return {
    moduleName,
    declaredSize,
    bssSize,
    tables,
    segments,
    exports,
    importedNames: [...importedNames].sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right))),
    relocations,
    importRelocationCount: importRecords.length,
    internalRelocationCount: internalRecords.length,
  };
}

function symbolEntry(nameOffset, value, size, info, sectionIndex) {
  const output = Buffer.alloc(16);
  output.writeUInt32LE(nameOffset, 0);
  output.writeUInt32LE(value >>> 0, 4);
  output.writeUInt32LE(size >>> 0, 8);
  output[12] = info;
  output[13] = 0;
  output.writeUInt16LE(sectionIndex, 14);
  return output;
}

function sectionHeader(section) {
  const output = Buffer.alloc(40);
  output.writeUInt32LE(section.nameOffset, 0);
  output.writeUInt32LE(section.type, 4);
  output.writeUInt32LE(section.flags, 8);
  output.writeUInt32LE(0, 12);
  output.writeUInt32LE(section.fileOffset, 16);
  output.writeUInt32LE(section.size, 20);
  output.writeUInt32LE(section.link ?? 0, 24);
  output.writeUInt32LE(section.info ?? 0, 28);
  output.writeUInt32LE(section.align ?? 1, 32);
  output.writeUInt32LE(section.entsize ?? 0, 36);
  return output;
}

function elfHeader(sectionHeaderOffset, sectionCount, shstrndx) {
  const output = Buffer.alloc(52);
  output.set([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1], 0);
  output.writeUInt16LE(1, 16);
  output.writeUInt16LE(40, 18);
  output.writeUInt32LE(1, 20);
  output.writeUInt32LE(sectionHeaderOffset, 32);
  output.writeUInt32LE(0x05000000, 36);
  output.writeUInt16LE(52, 40);
  output.writeUInt16LE(40, 46);
  output.writeUInt16LE(sectionCount, 48);
  output.writeUInt16LE(shstrndx, 50);
  return output;
}

export function buildCroTargetElf(parsed) {
  const sections = [{ name: "", type: SHT_NULL, flags: 0, align: 0, data: Buffer.alloc(0), size: 0 }];
  const segmentSections = new Map();
  const sectionSymbolBySegment = new Map();
  for (const [type, name] of SEGMENT_NAMES) {
    const segment = parsed.segments[type];
    check(segment?.sectionName === name, `reserved CRO segment ${type} is not ${name}`);
    const section = {
      name,
      type: name === ".bss" ? SHT_NOBITS : SHT_PROGBITS,
      flags: name === ".text" ? SHF_ALLOC | SHF_EXECINSTR
        : name === ".rodata" ? SHF_ALLOC : SHF_ALLOC | SHF_WRITE,
      align: 4,
      data: name === ".bss" ? null : Buffer.from(segment.data),
      size: segment.size,
      segmentIndex: segment.index,
    };
    section.index = sections.length;
    sections.push(section);
    segmentSections.set(segment.index, section);
  }

  const moduleMarker = {
    name: ".cro.module",
    type: SHT_PROGBITS,
    flags: 0,
    align: 1,
    data: Buffer.from(`${parsed.moduleName}\0`, "utf8"),
    size: Buffer.byteLength(`${parsed.moduleName}\0`, "utf8"),
  };
  moduleMarker.index = sections.length;
  sections.push(moduleMarker);

  const relocationSections = [];
  for (const [segmentIndex, entries] of parsed.relocations) {
    if (!entries.length) continue;
    const target = segmentSections.get(segmentIndex);
    check(target && target.type !== SHT_NOBITS, "relocations target an unavailable ELF section");
    const section = {
      name: `.rel${target.name}`,
      type: SHT_REL,
      flags: SHF_INFO_LINK,
      align: 4,
      entsize: 8,
      info: target.index,
      data: null,
      size: entries.length * 8,
      segmentIndex,
      entries: [...entries].sort((left, right) => left.offset - right.offset),
    };
    section.index = sections.length;
    sections.push(section);
    relocationSections.push(section);
  }

  const symtab = { name: ".symtab", type: SHT_SYMTAB, flags: 0, align: 4, entsize: 16, data: null, size: 0 };
  symtab.index = sections.length;
  sections.push(symtab);
  const strtab = { name: ".strtab", type: SHT_STRTAB, flags: 0, align: 1, data: null, size: 0 };
  strtab.index = sections.length;
  sections.push(strtab);
  const shstrtab = { name: ".shstrtab", type: SHT_STRTAB, flags: 0, align: 1, data: null, size: 0 };
  shstrtab.index = sections.length;
  sections.push(shstrtab);

  const strings = [Buffer.from([0])];
  let stringLength = 1;
  const stringOffsets = new Map();
  function intern(value) {
    if (stringOffsets.has(value)) return stringOffsets.get(value);
    const offset = stringLength;
    const bytes = Buffer.from(`${value}\0`, "utf8");
    strings.push(bytes);
    stringLength += bytes.length;
    stringOffsets.set(value, offset);
    return offset;
  }

  const symbols = [symbolEntry(0, 0, 0, 0, 0)];
  for (const segment of parsed.segments.slice(0, 4)) {
    const section = segmentSections.get(segment.index);
    sectionSymbolBySegment.set(segment.index, symbols.length);
    symbols.push(symbolEntry(0, 0, 0, STT_SECTION, section.index));
  }
  const firstGlobal = symbols.length;
  const globalNames = new Map();
  const globals = [];
  for (const exported of parsed.exports) {
    const segment = parsed.segments[exported.segmentIndex];
    const section = segmentSections.get(exported.segmentIndex);
    const type = segment.sectionName === ".text" ? STT_FUNC : STT_OBJECT;
    globals.push({ name: exported.name, value: exported.value, info: (STB_GLOBAL << 4) | type,
      sectionIndex: section.index });
  }
  for (const name of parsed.importedNames) {
    globals.push({ name, value: 0, info: (STB_GLOBAL << 4) | STT_NOTYPE, sectionIndex: 0 });
  }
  globals.sort((left, right) => Buffer.compare(Buffer.from(left.name), Buffer.from(right.name))
    || left.sectionIndex - right.sectionIndex || left.value - right.value);
  for (const global of globals) {
    check(!globalNames.has(global.name), `duplicate global ELF symbol ${global.name}`);
    const index = symbols.length;
    globalNames.set(global.name, index);
    symbols.push(symbolEntry(intern(global.name), global.value, 0, global.info, global.sectionIndex));
  }
  symtab.data = Buffer.concat(symbols);
  symtab.size = symtab.data.length;
  symtab.link = strtab.index;
  symtab.info = firstGlobal;
  strtab.data = Buffer.concat(strings);
  strtab.size = strtab.data.length;

  for (const section of relocationSections) {
    const data = Buffer.alloc(section.entries.length * 8);
    section.entries.forEach((entry, index) => {
      const symbolIndex = entry.target.kind === "section"
        ? sectionSymbolBySegment.get(entry.target.segmentIndex)
        : globalNames.get(entry.target.name);
      check(Number.isInteger(symbolIndex), "relocation target symbol was not emitted");
      data.writeUInt32LE(entry.offset, index * 8);
      data.writeUInt32LE((symbolIndex << 8) | R_ARM_ABS32, index * 8 + 4);
    });
    section.data = data;
    section.link = symtab.index;
  }

  const sectionStrings = [Buffer.from([0])];
  let sectionStringLength = 1;
  for (const section of sections.slice(1)) {
    section.nameOffset = sectionStringLength;
    const bytes = Buffer.from(`${section.name}\0`, "utf8");
    sectionStrings.push(bytes);
    sectionStringLength += bytes.length;
  }
  shstrtab.data = Buffer.concat(sectionStrings);
  shstrtab.size = shstrtab.data.length;

  let cursor = 52;
  for (const section of sections.slice(1)) {
    cursor = align(cursor, section.align);
    section.fileOffset = cursor;
    if (section.type !== SHT_NOBITS) {
      check(Buffer.isBuffer(section.data) && section.data.length === section.size,
        `${section.name} payload size is inconsistent`);
      cursor += section.size;
    }
  }
  const sectionHeaderOffset = align(cursor, 4);
  const output = Buffer.alloc(sectionHeaderOffset + sections.length * 40);
  elfHeader(sectionHeaderOffset, sections.length, shstrtab.index).copy(output, 0);
  for (const section of sections.slice(1)) {
    if (section.type !== SHT_NOBITS) section.data.copy(output, section.fileOffset);
  }
  sections.forEach((section, index) => sectionHeader(section).copy(output, sectionHeaderOffset + index * 40));
  return output;
}

export function convertCroToElf(buffer) {
  const parsed = parseCro(buffer);
  return { parsed, elf: buildCroTargetElf(parsed) };
}

function isInside(parent, candidate) {
  const rel = relative(parent, candidate);
  return rel === "" || (rel !== ".." && !rel.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`)
    && !isAbsolute(rel));
}

function writeAll(fd, buffer) {
  let cursor = 0;
  while (cursor < buffer.length) cursor += writeSync(fd, buffer, cursor, buffer.length - cursor);
}

function main() {
  const args = process.argv.slice(2);
  check(args.length === 2, "usage: generate-cro-target-object.mjs <private-module.cro> <ignored-target.o>");
  const input = realpathSync(resolve(args[0]));
  check(!isInside(ROOT, input), "private CRO input must remain outside the repository");
  const inputStat = statSync(input);
  check(inputStat.isFile() && inputStat.size <= MAX_CRO_SIZE, "private CRO input is not a bounded regular file");

  const output = resolve(args[1]);
  check(output !== input, "input and output paths must differ");
  mkdirSync(dirname(output), { recursive: true });
  const outputParent = realpathSync(dirname(output));
  check(isInside(outputParent, output), "output path escapes its resolved parent");
  if (existsSync(output)) check(!lstatSync(output).isSymbolicLink(), "refusing to overwrite an output symlink");
  if (isInside(ROOT, output)) {
    const ignored = spawnSync("git", ["check-ignore", "-q", "--no-index", "--", output], { cwd: ROOT });
    check(ignored.status === 0, "target object path inside the repository must be ignored by Git");
  }

  const { parsed, elf } = convertCroToElf(readFileSync(input));
  const temporary = `${output}.tmp-${process.pid}`;
  const fd = openSync(temporary, "wx", 0o600);
  try {
    writeAll(fd, elf);
    closeSync(fd);
    renameSync(temporary, output);
  } catch (error) {
    try { closeSync(fd); } catch {}
    try { unlinkSync(temporary); } catch {}
    throw error;
  }
  console.log(`Generated ${output} for ${parsed.moduleName}: ${parsed.segments.find((entry) => entry.type === 0 && entry.size).size} text bytes, ${parsed.importRelocationCount} import and ${parsed.internalRelocationCount} internal R_ARM_ABS32 relocations`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
