#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG = join(ROOT, "config", "cro-sources.json");
const SPEC = join(ROOT, "docs", "specs", "cro", "small_unit_completions_01.md");
const COMPLETIONS = Object.freeze([
  {
    unit: "DllContestCommon",
    name: "func_00000030",
    address: 0x30,
    size: 472,
    semantics: "contest-resource-initialization",
    source: "src/cro/DllContestCommon/remaining_01.S",
    sha256: "fa20423c4bdc4b434235edbd87527f1b5f3394743853acd1f3eacfc6d3394712",
  },
  {
    unit: "DllContestOhirome",
    name: "func_00000544",
    address: 0x544,
    size: 332,
    semantics: "contest-introduction-construction",
    source: "src/cro/DllContestOhirome/remaining_01.S",
    sha256: "52ac21b1b42b18b8dbf9bcfb0337f67fa237bb45411944402e2a30d115622db5",
  },
  {
    unit: "DllFieldEventPokeRideAction",
    name: "func_00000158",
    address: 0x158,
    size: 556,
    semantics: "ride-action-resource-initialization",
    source: "src/cro/DllFieldEventPokeRideAction/remaining_01.S",
    sha256: "6bc92aee62ad3d5b00c77db24d42dfacf16825d16dda73a6fbc4c95652a9b030",
  },
  {
    unit: "DllPhotoSaverSecretBase",
    name: "func_00001D60",
    address: 0x1D60,
    size: 536,
    semantics: "secret-base-photo-layout-setup",
    source: "src/cro/DllPhotoSaverSecretBase/remaining_01.S",
    sha256: "e24f74b974477187da4ef14c5d1fc1e67a1ccf79b9772be850beb9b5ed8d2efc",
  },
  {
    unit: "DllStartMenu",
    name: "func_00000E44",
    address: 0xE44,
    size: 440,
    semantics: "start-menu-input-navigation",
    source: "src/cro/DllStartMenu/remaining_01.S",
    sha256: "16b708c9fab4c3d01d531afd944bb50b0f34ee75c613f1437884ed1ad99a4303",
  },
  {
    unit: "DllDialogCommon",
    name: "func_00000780",
    address: 0x780,
    size: 796,
    semantics: "dialog-object-factory-setup",
    source: "src/cro/DllDialogCommon/remaining_02.S",
    specification: "docs/specs/cro/DllDialogCommon_02.md",
    sha256: "6159155d77b7859ed4cdfb21ef02418550d1f833f1475c3c2daa69964114f65a",
  },
  {
    unit: "DllPhotoViewer",
    name: "func_00000F20",
    address: 0xF20,
    size: 596,
    semantics: "photo-viewer-object-setup",
    source: "src/cro/DllPhotoViewer/remaining_01.S",
    specification: "docs/specs/cro/DllPhotoViewer_blocker.md",
    sha256: "5e7e55d14c203eb1d6cfd83d803274b28e59c1a2c6c13176de97738f9fb14a3a",
  },
  {
    unit: "DllPssPlaySelect",
    name: "func_00000658",
    address: 0x658,
    size: 172,
    semantics: "play-selection-controller-start",
    source: "src/cro/DllPssPlaySelect/remaining_01.S",
    specification: "docs/specs/cro/DllPssPlaySelect_blocker.md",
    sha256: "b1d34449591e33210719f631f93e6e5726611232cb51288c00805cb25f31acf3",
  },
  {
    unit: "DllPssPlaySelect",
    name: "func_000008A0",
    address: 0x8A0,
    size: 428,
    semantics: "play-selection-object-setup",
    source: "src/cro/DllPssPlaySelect/remaining_01.S",
    specification: "docs/specs/cro/DllPssPlaySelect_blocker.md",
    sha256: "789a39ce9fa442a38401b8c3b0d76ccc604dc02166ced6f66a29fd0752f9c5ab",
  },
  {
    unit: "DllPssConfig",
    name: "func_00000DC0",
    address: 0xDC0,
    size: 176,
    semantics: "configuration-controller-start",
    source: "src/cro/DllPssConfig/remaining_01.S",
    specification: "docs/specs/cro/DllPssConfig_blocker.md",
    sha256: "b239f3d94e287cafea19c90e739f0594aa78c769dd9ad01729bb3c474c794fa5",
  },
  {
    unit: "DllPssConfig",
    name: "func_000015C4",
    address: 0x15C4,
    size: 512,
    semantics: "configuration-object-setup",
    source: "src/cro/DllPssConfig/remaining_01.S",
    specification: "docs/specs/cro/DllPssConfig_blocker.md",
    sha256: "979c4430fb0559268f4e5f6579134c749c55ea2ef33aa5e1e27c83f34ae7bb8c",
  },
  {
    unit: "DllCommWait",
    name: "func_00000334",
    address: 0x334,
    size: 632,
    semantics: "communication-wait-state-update",
    source: "src/cro/DllCommWait/remaining_01.S",
    specification: "docs/specs/cro/DllCommWait.md",
    sha256: "e6701242b94aeb773cdf464f4930d60a89c14bae7bde2978ad230726b204cf33",
  },
  {
    unit: "DllCommWait",
    name: "func_00000A2C",
    address: 0xA2C,
    size: 400,
    semantics: "communication-wait-object-setup",
    source: "src/cro/DllCommWait/remaining_01.S",
    specification: "docs/specs/cro/DllCommWait.md",
    sha256: "9dca229e26563324af4925eedfdf23fcac494330ba60562daf595cc6dd77acbd",
  },
  ...[
    ["func_0000BF38", 0xBF38, 4, "title-direct-tail-dispatch", "4129e4a7a8559c67b5bb33c69c19a6dc4708d1a4de17d8b213cad975c2938168"],
    ["func_0000D434", 0xD434, 40, "title-output-triple-initialize", "39d2a5eadf255e465bd5e604fea7b8efea75e851bb326dac26a562d7ca8ab33c"],
    ["func_0000D45C", 0xD45C, 24, "title-byte-halfword-record-copy", "c3c2e727ab44a1b86ba452f28fd293d6bf4abbb8815890be02e9e2539f9dec79"],
    ["func_0000E258", 0xE258, 32, "title-ring-entry-access", "a47133c10034d57f5322d0752de34cc4b6d490e5f4c3026370d48065d7be1ae0"],
    ["func_0000E704", 0xE704, 44, "title-linked-record-initialize", "6d911bfe6402a9dfc7192900a6ab6de2821a190d12f0438c3bae2a45a3b26291"],
    ["func_0000EE88", 0xEE88, 52, "title-capacity-normalize", "a25a903813c951c55cf92566bcd41cda96a6bc240e187400b71a41678b04f762"],
    ["func_000124F4", 0x124F4, 40, "title-nested-state-query", "d2cb73686f25a5ca4ae16ffade7c83feb8dc596af07dd87e2321a33b50343da3"],
    ["func_0001BD60", 0x1BD60, 44, "title-record-identity-compare", "88fa75fbfe2188fb0a1a090cbf7fb823535a84312fb239513e06f726e3902098"],
    ["func_0001C408", 0x1C408, 36, "title-global-pair-store-a", "07255b8cd0cb959db5e1485dfd065987ce946444bd40d2cf117b46ac3b1a1ea8"],
    ["func_0001C78C", 0x1C78C, 20, "title-global-pair-clear-a", "2eb59411a86f4d590d1ce69a71e13e1b864898f0bb335bbd0b4b1d325894d541"],
    ["func_0001C7A4", 0x1C7A4, 36, "title-global-pair-store-b", "8dc052eb266f2f1ac4743bfb8a3ddbdaa361938bd35239936a9d84cc391fe25c"],
    ["func_0001C838", 0x1C838, 28, "title-global-pair-clear-b", "f96f9d459eba3efc94a26986fcd63d87f1d6159429d978ab105754658fe35d8e"],
    ["func_0001CBF8", 0x1CBF8, 20, "title-global-pair-clear-c", "3e4e953cfdfac4503078b7c1873b8454b06ae245f0926643dfce58985e097778"],
    ["func_0001CD0C", 0x1CD0C, 36, "title-global-pair-store-c", "5f5599121d38323dc580d0d0d218b50b09450dce4fe425787fad2bcfe6ecee5e"],
  ].map(([name, address, size, semantics, sha256]) => ({
    unit: "DllTitle",
    name,
    address,
    size,
    semantics,
    source: "src/cro/DllTitle/small_leaves_01.S",
    specification: "docs/specs/cro/DllTitle_blocker.md",
    sha256,
    partial: true,
  })),
  ...[
    ["func_0000E610", 0xE610, 72, "title-linked-sequence-assign", "155d88df7065614fd5ea4e220aa2bd7b06a65d2f970067c9ae0d2fcdfb299a5d"],
    ["func_0000E6B8", 0xE6B8, 76, "title-list-head-rotate", "f1d60bbdfc4af8dfdf0989c04c1f8ae9cb7fc58347d924a583950fb2bc4cd160"],
    ["func_0000E730", 0xE730, 60, "title-linked-container-initialize", "72c4ae70740971e5edecba03ea2b3d58be2879f4c8dab25bcf9916a0008d57ac"],
    ["func_0000F060", 0xF060, 64, "title-record-update-dispatch", "8b0c4ff956586dab2eabacea9996678c1b16ae157846c76a2c9da60d3b67ef7e"],
    ["func_0001230C", 0x1230C, 72, "title-three-stage-state-dispatch", "791feda5e6551155b2bbc0c63d3d12bb563397ae26fe6c7a620878880ff9e55c"],
    ["func_00012360", 0x12360, 60, "title-secondary-state-dispatch", "6c2fd36dfddebc248c5c9fe9f83b894ea583621dd5c6e7eb4184cfd678880960"],
    ["func_000123A0", 0x123A0, 60, "title-primary-state-dispatch", "8de48072d8bb4bead4835453f031213bb37dba86d3b3e212455a654e46186dbd"],
    ["func_0001251C", 0x1251C, 64, "title-nested-validation-status-a", "d33c0f98051e0f9add599b017dd17ecc99a7f3fe2a24b5dc46a87eaab7278ffb"],
    ["func_0001C73C", 0x1C73C, 76, "title-global-record-allocate", "336ac30d5176e5fba4e2b793547743151420d1bacfaf4d5b9adbcda7fa3a8e56"],
    ["func_0001C880", 0x1C880, 60, "title-global-pair-store-d", "7007b127f1e3d4c81a0a8a6191dcbf280893659151907dc789ef7349b8434ecf"],
    ["func_0001CE20", 0x1CE20, 68, "title-nested-validation-status-b", "39e3b28e7084928a307384b3304a98ca3f8616859d229b794cb921d5f2784041"],
  ].map(([name, address, size, semantics, sha256]) => ({
    unit: "DllTitle",
    name,
    address,
    size,
    semantics,
    source: "src/cro/DllTitle/small_leaves_02.S",
    specification: "docs/specs/cro/DllTitle_blocker.md",
    sha256,
    partial: true,
  })),
  ...[
    ["func_0000E658", 0xE658, 96, "title-list-head-rotate-increment", "79c59f58fba997c756ebca8f253b3027da5ba99d4bd54f66b5aa05b9e61772b1"],
    ["func_0000EEBC", 0xEEBC, 108, "title-linked-container-release", "5920e6673e93d6b74de85c9b9f991d81411c5b1717ef3d1e8ad439bd80684f39"],
    ["func_000119C4", 0x119C4, 92, "title-staged-state-dispatch", "94e0f4f7a067ba32ad1c7cb05694094060ff5219bcdfb4017790f1af6d1b64a1"],
    ["func_00012488", 0x12488, 108, "title-nested-validation-loop", "0ef0291bf44fda18e2fdfcea0c9c3627d34ff8908af8eaf627cdd9de2d7f0af7"],
  ].map(([name, address, size, semantics, sha256]) => ({
    unit: "DllTitle",
    name,
    address,
    size,
    semantics,
    source: "src/cro/DllTitle/small_leaves_03.S",
    specification: "docs/specs/cro/DllTitle_blocker.md",
    sha256,
    partial: true,
  })),
  ...[
    ["func_0001157C", 0x1157C, 124, "title-record-range-release", "93f882df0d4aaa0ab0fb98e55b2d874f685b10d7f7af64f02b62e1647c5928c3"],
    ["func_00012630", 0x12630, 112, "title-validated-output-query", "61e67646d195c7790d7c9fe2b25c221e838ae7a6540fa891ff9e27d8e4b59a00"],
    ["func_0001ABF0", 0x1ABF0, 120, "title-state-block-initialize", "7fb7e7ce83f433b3464f2c5e18cdf6973a8648b6077ee3420a3abb36d41c8a99"],
    ["func_0001B640", 0x1B640, 132, "title-tree-left-walk", "bbf011a0c3649f39a5af3da460433e61000e2ac48dc5eb9656ff3b9d325c271a"],
    ["func_0001B6C4", 0x1B6C4, 132, "title-tree-right-walk", "39a3dae90ae7befc56c5a151eba59232d12ba4ed1d2910ddff19d7168eeeb63b"],
  ].map(([name, address, size, semantics, sha256]) => ({
    unit: "DllTitle",
    name,
    address,
    size,
    semantics,
    source: "src/cro/DllTitle/small_leaves_04.S",
    specification: "docs/specs/cro/DllTitle_blocker.md",
    sha256,
    partial: true,
  })),
  ...[
    ["func_0000EDF4", 0xEDF4, 148, "title-counter-rebalance", "fe3543449e1795b559cac5208633e0274ce8dad9a58bc29f748fd9e8ede489c8"],
    ["func_0000F6E0", 0xF6E0, 140, "title-tree-lookup-dispatch", "60c15f1ca50433dd2324c8915f3afb798d1e1eef025eef23dc52419b302c0874"],
    ["func_000105B8", 0x105B8, 136, "title-record-range-release-pair", "65608204a6ff7bcf3d6deb416b33cdd797f1d051cbc7b90f2b8eb3968c5acfef"],
    ["func_000107E4", 0x107E4, 152, "title-tree-traversal-predicate", "fa5c72b38b072ca0461a8c9e16ce01f03cb4f1d2b1ef358150f7938991a5f051"],
  ].map(([name, address, size, semantics, sha256]) => ({
    unit: "DllTitle",
    name,
    address,
    size,
    semantics,
    source: "src/cro/DllTitle/small_leaves_05.S",
    specification: "docs/specs/cro/DllTitle_blocker.md",
    sha256,
    partial: true,
  })),
  ...[
    ["func_0000E1B8", 0xE1B8, 160, "title-linked-chain-release", "93e9306a0b4f2413632d4cb707425bff7ac1cff7e4228dcd64acc851caf2f90c"],
    ["func_0000E340", 0xE340, 160, "title-tree-index-access", "d99a2efa8284cba12c98492cbc32a1824e40af155e3879e4c81d7a31d61d6fef"],
    ["func_000129C8", 0x129C8, 160, "title-multiword-span-adjust", "ebd7d8df7ce8ef145bc1f9db0b0eb598bc523a254699721a6b94c35213756958"],
    ["func_00014CA8", 0x14CA8, 160, "title-state-machine-update", "dc259e3ddff92204a28f61cf68356805a25b60cc8fd4e50059efb7bc62cee633"],
    ["func_000195D0", 0x195D0, 156, "title-tree-traversal-filter", "74768077487b678875323f62384a0e11402cd7f0398aa58e58e9ff2939cc7191"],
  ].map(([name, address, size, semantics, sha256]) => ({
    unit: "DllTitle",
    name,
    address,
    size,
    semantics,
    source: "src/cro/DllTitle/small_leaves_06.S",
    specification: "docs/specs/cro/DllTitle_blocker.md",
    sha256,
    partial: true,
  })),
  ...[
    ["func_0000ED48", 0xED48, 172, "title-resource-release-reset", "f98493014917e8c5b57f8aac26502013ab5cd699345037e801d84dc4da10cdfc"],
    ["func_00010738", 0x10738, 172, "title-tree-entry-activate", "6d6b89953cdbe9289c32c8bd700c1876e089a7732047f8a94b0640fcf35c0139"],
    ["func_000123E0", 0x123E0, 168, "title-entry-collection-release", "4704f4c3a60b6e999c4cd4f40be83c52ff349f852911b4723877bb49652eade5"],
    ["func_000155A4", 0x155A4, 168, "title-state-structure-initialize", "d2d3e4e75f3624d275bd05e08b2bafb235a3befcb87fd1e34c13cbb290f00e19"],
    ["func_0001AB40", 0x1AB40, 172, "title-resource-attach-initialize", "6333cf1b4c383de9ef22556e930303ba56ca994d558898fb7e53b13d5447f3da"],
  ].map(([name, address, size, semantics, sha256]) => ({
    unit: "DllTitle",
    name,
    address,
    size,
    semantics,
    source: "src/cro/DllTitle/small_leaves_07.S",
    specification: "docs/specs/cro/DllTitle_blocker.md",
    sha256,
    partial: true,
  })),
  ...[
    ["func_000109B4", 0x109B4, 176, "title-linked-record-insert", "bf3fd4a9d78dcdd9a2277a1acfddf14056b389f230fa1eb6ce729e700b26f0cb"],
    ["func_00011FF8", 0x11FF8, 176, "title-render-entry-configure", "780c36ab3d3d296ad8adb6bf48323908d10acdaf473b6423da2a778f9b001a08"],
    ["func_00012244", 0x12244, 180, "title-timed-state-transition", "255166554e7a6e483be57f0ab8a798ff5f7b261ac90115b127bc765f781a8599"],
    ["func_00012F48", 0x12F48, 180, "title-buffer-resource-create", "8d67b9cef23b58571eb9d5644c76a15aa2d958d8dd90fd90562cca05bb5bce84"],
    ["func_0001966C", 0x1966C, 196, "title-tree-entry-state-reset", "43dda52b9288f0459581f65443b1c6c2f7d37a8527518e0aa843817293054b91"],
  ].map(([name, address, size, semantics, sha256]) => ({
    unit: "DllTitle",
    name,
    address,
    size,
    semantics,
    source: "src/cro/DllTitle/small_leaves_08.S",
    specification: "docs/specs/cro/DllTitle_blocker.md",
    sha256,
    partial: true,
  })),
]);

function fail(message) {
  throw new Error(`small CRO completion validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function run(executable, args) {
  try {
    return execFileSync(executable, args, {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch (error) {
    fail(`${executable} failed: ${error.stderr?.toString().trim() || error.message}`);
  }
}

function parseArguments(argv) {
  if (argv.length === 0) return {};
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index];
    const value = argv[index + 1];
    check(["--object-directory", "--readelf"].includes(option) && value,
      "usage: validate-cro-small-completions.mjs [--object-directory DIR --readelf FILE]");
    values[option.slice(2)] = value;
  }
  check(values["object-directory"] && values.readelf,
    "--object-directory and --readelf must be supplied together");
  return values;
}

function sectionBytes(readelf, object, section) {
  const groups = [];
  for (const line of run(readelf, ["--hex-dump", section, object]).split("\n")) {
    const match = /^\s*0x[0-9a-f]+\s+(.+)$/iu.exec(line);
    if (!match) continue;
    for (const token of match[1].trim().split(/\s+/u)) {
      if (!/^[0-9a-f]{8}$/iu.test(token)) break;
      groups.push(token);
    }
  }
  return Buffer.from(groups.join(""), "hex");
}

function validateSources() {
  const config = JSON.parse(readFileSync(CONFIG, "utf8"));
  const sharedSpecification = readFileSync(SPEC, "utf8");
  check(COMPLETIONS.reduce((total, entry) => total + entry.size, 0) === 11392,
    "aggregate completion size changed");

  for (const entry of COMPLETIONS) {
    const specification = entry.specification ?
      readFileSync(join(ROOT, entry.specification), "utf8") : sharedSpecification;
    const unit = config.units.find((candidate) => candidate.name === entry.unit);
    check(unit, `${entry.unit} is absent from config/cro-sources.json`);
    check(unit.sources.filter((source) => source.path === entry.source && source.mode === "arm").length === 1,
      `${entry.unit} lacks its exact ARM source claim`);
    const claim = unit.functions.filter((fn) => fn.name === entry.name);
    check(claim.length === 1 && claim[0].address === entry.address &&
      claim[0].size === entry.size && claim[0].semantics === entry.semantics,
    `${entry.name} has an invalid function claim`);

    const inventory = readFileSync(join(ROOT, "symbols", "cro", `${entry.unit}.csv`), "utf8");
    const accepted = inventory.split(/\r?\n/u).filter((line) => /^[0-9A-F]{8},/u.test(line));
    check(accepted.some((line) => line.includes(`"${entry.name}"`)) &&
      (entry.partial || accepted.length === unit.functions.length),
    `${entry.unit} accepted-function ownership is invalid`);

    const sourcePath = join(ROOT, entry.source);
    check(existsSync(sourcePath) && lstatSync(sourcePath).isFile() &&
      !lstatSync(sourcePath).isSymbolicLink(), `${entry.source} is not a regular file`);
    const source = readFileSync(sourcePath, "utf8");
    check(!/^\s*\.(?:byte|hword|short|word|long|inst|incbin)\b/imu.test(source),
      `${entry.source} contains encoded data`);
    for (const fragment of [`.section .text.${entry.name}, "ax", %progbits`,
      `.global ${entry.name}`, `.type ${entry.name}, %function`,
      `ASM_FUNC(${entry.name})`, `.size ${entry.name}, . - ${entry.name}`]) {
      check(source.split(fragment).length === 2,
        `${entry.source} lacks one exact ${fragment} declaration`);
    }
    check(specification.includes(entry.unit) &&
      specification.includes(`\`${entry.name}\``),
    `${entry.unit} is missing from the provenance specification`);
  }
}

function validateObjects(directory, readelf) {
  for (const entry of COMPLETIONS) {
    const object = join(directory, `${entry.unit}.o`);
    check(existsSync(object) && lstatSync(object).isFile() &&
      !lstatSync(object).isSymbolicLink(), `${entry.unit}.o is missing`);
    const section = `.text.${entry.name}`;
    const sections = run(readelf, ["--sections", "--wide", object]);
    const sectionLine = sections.split("\n").find((line) =>
      new RegExp(`\\s${section.replaceAll(".", "\\.")}\\s`, "u").test(line));
    check(sectionLine && new RegExp(`\\s${entry.size.toString(16).padStart(6, "0")}\\s+00\\s+AX\\s`, "iu")
      .test(sectionLine), `${entry.name} has an invalid executable section`);

    const symbols = run(readelf, ["--symbols", "--wide", object]);
    const symbolLines = symbols.split("\n").filter((line) =>
      new RegExp(`\\s${entry.name}$`, "u").test(line.trimEnd()));
    check(symbolLines.length === 1 &&
      new RegExp(`^\\s*\\d+:\\s+00000000\\s+${entry.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${entry.name}$`, "u")
        .test(symbolLines[0]), `${entry.name} is not one exact global function symbol`);

    const relocations = run(readelf, ["--relocs", "--wide", object]);
    check(!relocations.includes(`.rel.text.${entry.name}`) &&
      !relocations.includes(`.rela.text.${entry.name}`),
    `${entry.name} unexpectedly has relocations`);
    const bytes = sectionBytes(readelf, object, section);
    check(bytes.length === entry.size &&
      createHash("sha256").update(bytes).digest("hex") === entry.sha256,
    `${entry.name} instruction body differs`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  validateSources();
  if (options["object-directory"]) validateObjects(options["object-directory"], options.readelf);
  console.log(`Validated 66 accepted-function completions (11,392 bytes)${options["object-directory"] ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
