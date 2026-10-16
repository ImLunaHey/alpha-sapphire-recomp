import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-63.json"), "utf8"));
const source = readFileSync(join(root, config.source), "utf8");
const expectedNames = ["func_0016F94C", "func_005587C0"];
const expectedHelpers = ["func_0015E4C4", "func_00558928"];
const expectedLabels = [44, 80, 152, 176, 196, 212, 232, 248, 280];

if (config.version !== 1 || config.mode !== "arm" || config.expectedBodyBytes !== 600 ||
    JSON.stringify(config.templates) !== JSON.stringify({ unique_tree_insert_result: {
      bodySize: 300, instructionCount: 75, count: 2, internalLabels: 9,
      directCalls: 1, indirectCalls: 0, ownedLiteralCount: 0,
    } }) ||
    JSON.stringify(config.internalLabelOffsets) !== JSON.stringify(expectedLabels) ||
    config.callOffset !== 256 || JSON.stringify(config.functions.map(({ name }) => name)) !== JSON.stringify(expectedNames) ||
    JSON.stringify(config.functions.map(({ call }) => call.symbol)) !== JSON.stringify(expectedHelpers) ||
    config.functions.some(({ nextGlobalOffset, call }) => nextGlobalOffset !== 300 ||
      call.offset !== 256 || call.kind !== "R_ARM_CALL" || call.role !== "insert_new_node") ||
    !source.includes(".macro DT63_BODY name, insertion_helper") ||
    !source.includes("DT63_BODY func_0016F94C, func_0015E4C4") ||
    !source.includes("DT63_BODY func_005587C0, func_00558928")) {
  throw new Error("Unexpected duplicate template 63 clean-room contract");
}

const [objectPath, readelf = "arm-none-eabi-readelf"] = process.argv.slice(2);
if (!objectPath) {
  console.log("Validated duplicate template 63 source and manifest.");
  process.exit(0);
}
const run = (args) => {
  const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  return result.stdout;
};
const symbols = run(["--symbols", "--wide", objectPath]);
const relocations = run(["--relocs", "--wide", objectPath]);
let normalizedReference;
for (let index = 0; index < expectedNames.length; index++) {
  const name = expectedNames[index];
  const helper = expectedHelpers[index];
  const symbolLine = symbols.split(/\r?\n/).find((line) => new RegExp(`\\b300\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${name}$`).test(line.trim()));
  if (!symbolLine) throw new Error(`${name} is not a 300-byte global function`);
  const sectionIndex = symbolLine.trim().split(/\s+/)[6];
  const sectionNameMatch = run(["--sections", "--wide", objectPath]).split(/\r?\n/)
    .find((line) => new RegExp(`^\\s*\\[\\s*${sectionIndex}\\]`).test(line));
  if (!sectionNameMatch || !sectionNameMatch.includes(`.text.${name}`)) throw new Error(`${name} does not own its exact text section`);
  const relocationSection = relocations.split(/Relocation section /).find((block) => block.includes(`'.rel.text.${name}'`)) ?? "";
  const entries = relocationSection.split(/\r?\n/).filter((line) => /R_ARM_/.test(line));
  if (entries.length !== 1 || !/^\s*00000100\s/.test(entries[0]) || !entries[0].includes("R_ARM_CALL") || !entries[0].includes(helper)) {
    throw new Error(`${name} does not have its one symbolic insertion-helper call at +256`);
  }
  const dump = run(["--hex-dump", `.text.${name}`, objectPath]);
  const hex = dump.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\s*0x[0-9a-f]+\s+((?:[0-9a-f]{8}\s*){1,4})/i);
    return match ? match[1].trim().split(/\s+/) : [];
  }).join("");
  const body = Buffer.from(hex, "hex");
  if (body.length !== 300 || body.length / 4 !== 75) throw new Error(`${name} has an unexpected complete body`);
  const localTargets = new Set();
  for (let cursor = 0; cursor < body.length; cursor += 4) {
    if (cursor === 256) continue;
    const instruction = body.readUInt32LE(cursor);
    if ((instruction & 0x0e000000) !== 0x0a000000) continue;
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const target = cursor + 8 + displacement * 4;
    if (target < 0 || target >= body.length) throw new Error(`${name} has an external non-call branch`);
    localTargets.add(target);
  }
  if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !== JSON.stringify(expectedLabels)) {
    throw new Error(`${name} has unexpected local branch destinations`);
  }
  body.fill(0, 256, 260);
  if (normalizedReference && !body.equals(normalizedReference)) throw new Error(`${name} violates normalized body identity`);
  normalizedReference = body;
}
console.log("Validated duplicate template 63 sizes, counts, branches, boundaries, ownership, relocations, and normalized identity.");
