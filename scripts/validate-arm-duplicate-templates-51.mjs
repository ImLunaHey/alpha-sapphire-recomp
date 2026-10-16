import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config/arm-duplicate-templates-51.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const expectedOffsets = [...manifest.internalLabelOffsets].sort((a, b) => a - b);
const functions = manifest.functions;

function run(program, args) {
  return execFileSync(program, args, { encoding: "utf8", maxBuffer: MAX_BUFFER });
}

function findExecutable(tree, basename) {
  const pending = [tree];
  while (pending.length) {
    const directory = pending.pop();
    for (const entry of readdirSync(directory)) {
      const path = join(directory, entry);
      let info;
      try {
        info = statSync(path);
      } catch {
        continue;
      }
      if (info.isDirectory()) pending.push(path);
      else if (entry === basename && (info.mode & 0o111)) return path;
    }
  }
  throw new Error(`could not find ${basename} below ${tree}`);
}

function resolveTool(name, explicit) {
  if (explicit) return explicit;
  try {
    return run("which", [name]).trim();
  } catch {
    const storePath = run("nix", [
      "build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded",
    ]).trim().split(/\s+/).at(-1);
    return findExecutable(storePath, name);
  }
}

function fail(message) {
  throw new Error(`duplicate template batch 51: ${message}`);
}

if (manifest.version !== 1 || manifest.mode !== "arm") fail("invalid manifest header");
if (manifest.expectedBodyBytes !== 4896 || functions.length !== 3) fail("invalid manifest totals");
const template = manifest.templates.intrusive_red_black_tree_erase_variant;
if (!template || template.bodySize !== 1632 || template.instructionCount !== 408 ||
    template.count !== 3 || template.internalLabels !== 48) {
  fail("invalid template contract");
}
if (manifest.relocations.length !== 0 || template.directCalls !== 0 ||
    template.indirectCalls !== 0 || template.tailBranches !== 0 || template.poolSlots !== 0) {
  fail("batch must be relocation- and call-free");
}

let objectPath = process.argv[2];
let readelf = process.argv[3];
if (!objectPath) {
  const assembler = resolveTool("arm-none-eabi-as");
  readelf = resolveTool("arm-none-eabi-readelf");
  objectPath = join(root, "build/AS_EUR_REV2/validation/arm_duplicate_templates_51.o");
  mkdirSync(dirname(objectPath), { recursive: true });
  run(assembler, [
    "-march=armv6k", "-mcpu=mpcore", "-mfpu=vfpv2",
    "-o", objectPath, join(root, manifest.source),
  ]);
} else {
  objectPath = resolve(objectPath);
  if (!existsSync(objectPath)) fail(`object does not exist: ${objectPath}`);
  readelf = resolveTool("arm-none-eabi-readelf", readelf);
}

const objdump = join(dirname(readelf), "arm-none-eabi-objdump");
if (!existsSync(objdump)) fail(`objdump not found next to readelf: ${objdump}`);

const symbolText = run(readelf, ["-Ws", objectPath]);
const symbols = new Map();
for (const line of symbolText.split("\n")) {
  const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+\S+\s+\S+\s+(\S+)\s+(.+?)\s*$/);
  if (!match) continue;
  symbols.set(match[5], {
    value: Number.parseInt(match[1], 16),
    size: Number.parseInt(match[2], 10),
    type: match[3],
    section: match[4],
  });
}

for (const fn of functions) {
  const symbol = symbols.get(fn.name);
  if (!symbol) fail(`missing symbol ${fn.name}`);
  if (symbol.type !== "FUNC" || symbol.size !== template.bodySize) {
    fail(`${fn.name} must be a ${template.bodySize}-byte function`);
  }
}

const selectedSections = functions.flatMap(({ name }) => ["-j", `.text.${name}`]);
const disassembly = run(objdump, ["-dr", ...selectedSections, objectPath]);
const bodies = new Map(functions.map(({ name }) => [name, { instructions: [], relocations: [] }]));
let current = null;
for (const line of disassembly.split("\n")) {
  const header = line.match(/^([0-9a-fA-F]+) <([^>]+)>:$/);
  if (header) {
    current = bodies.has(header[2]) ? { name: header[2], start: Number.parseInt(header[1], 16) } : null;
    continue;
  }
  if (!current) continue;
  const instruction = line.match(/^\s*([0-9a-fA-F]+):\s+([0-9a-fA-F]{8})\s+([a-z][a-z0-9.]*)\s*(.*)$/i);
  if (instruction) {
    bodies.get(current.name).instructions.push({
      address: Number.parseInt(instruction[1], 16),
      word: instruction[2].toLowerCase(),
      mnemonic: instruction[3].toLowerCase(),
      operands: instruction[4],
    });
    continue;
  }
  if (/^\s*[0-9a-fA-F]+:\s+R_ARM_/.test(line)) bodies.get(current.name).relocations.push(line.trim());
}

let referenceWords;
for (const fn of functions) {
  const body = bodies.get(fn.name);
  if (body.instructions.length !== template.instructionCount) {
    fail(`${fn.name} has ${body.instructions.length} instructions, expected ${template.instructionCount}`);
  }
  if (body.relocations.length !== 0) fail(`${fn.name} contains relocations`);

  const words = body.instructions.map(({ word }) => word).join("");
  if (referenceWords === undefined) referenceWords = words;
  else if (words !== referenceWords) fail(`${fn.name} is not byte-identical to the first expansion`);

  const start = body.instructions[0].address;
  const branchOffsets = [];
  for (const instruction of body.instructions) {
    if (/^blx?$/.test(instruction.mnemonic)) fail(`${fn.name} contains a direct call`);
    if (/^bx$/.test(instruction.mnemonic)) continue;
    if (!/^b(?:eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(instruction.mnemonic)) continue;
    const destination = instruction.operands.match(/^([0-9a-fA-F]+)/);
    if (!destination) fail(`${fn.name} has an unparseable branch destination`);
    const offset = Number.parseInt(destination[1], 16) - start;
    if (offset < 0 || offset >= template.bodySize) fail(`${fn.name} has a non-local branch`);
    branchOffsets.push(offset);
  }
  const actualOffsets = [...new Set(branchOffsets)].sort((a, b) => a - b);
  if (JSON.stringify(actualOffsets) !== JSON.stringify(expectedOffsets)) {
    fail(`${fn.name} internal branch destinations differ from the manifest`);
  }
}

console.log(`Validated ${functions.length} duplicate template batch 51 functions (${manifest.expectedBodyBytes} bytes).`);
