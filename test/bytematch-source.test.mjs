import { readFile } from "node:fs/promises";

import { expect, test } from "vitest";

const gameSyncSource = await readFile(
  new URL("../src/cro/DllGameSync/contract_12.S", import.meta.url),
  "utf8",
);
const skatePipeSource = await readFile(
  new URL("../src/cro/DllFieldEventSkatePipe/contract_13.S", import.meta.url),
  "utf8",
);
const waterSurfaceSource = await readFile(
  new URL("../src/cro/DllUSAreaWaterSurface/remaining_01.S", import.meta.url),
  "utf8",
);
const smallCompletionSources = await Promise.all([
  ["DllContestCommon", "func_00000030"],
  ["DllContestOhirome", "func_00000544"],
  ["DllFieldEventPokeRideAction", "func_00000158"],
  ["DllPhotoSaverSecretBase", "func_00001D60"],
  ["DllStartMenu", "func_00000E44"],
  ["DllDialogCommon", "func_00000780", "remaining_02.S"],
  ["DllPhotoViewer", "func_00000F20"],
  ["DllPssPlaySelect", "func_00000658"],
  ["DllPssPlaySelect", "func_000008A0"],
  ["DllPssConfig", "func_00000DC0"],
  ["DllPssConfig", "func_000015C4"],
  ["DllCommWait", "func_00000334"],
  ["DllCommWait", "func_00000A2C"],
  ["DllTitle", "func_0000BF38", "small_leaves_01.S"],
  ["DllTitle", "func_0000D434", "small_leaves_01.S"],
  ["DllTitle", "func_0000D45C", "small_leaves_01.S"],
  ["DllTitle", "func_0000E258", "small_leaves_01.S"],
  ["DllTitle", "func_0000E704", "small_leaves_01.S"],
  ["DllTitle", "func_0000EE88", "small_leaves_01.S"],
  ["DllTitle", "func_000124F4", "small_leaves_01.S"],
  ["DllTitle", "func_0001BD60", "small_leaves_01.S"],
  ["DllTitle", "func_0001C408", "small_leaves_01.S"],
  ["DllTitle", "func_0001C78C", "small_leaves_01.S"],
  ["DllTitle", "func_0001C7A4", "small_leaves_01.S"],
  ["DllTitle", "func_0001C838", "small_leaves_01.S"],
  ["DllTitle", "func_0001CBF8", "small_leaves_01.S"],
  ["DllTitle", "func_0001CD0C", "small_leaves_01.S"],
  ["DllTitle", "func_0000E610", "small_leaves_02.S"],
  ["DllTitle", "func_0000E6B8", "small_leaves_02.S"],
  ["DllTitle", "func_0000E730", "small_leaves_02.S"],
  ["DllTitle", "func_0000F060", "small_leaves_02.S"],
  ["DllTitle", "func_0001230C", "small_leaves_02.S"],
  ["DllTitle", "func_00012360", "small_leaves_02.S"],
  ["DllTitle", "func_000123A0", "small_leaves_02.S"],
  ["DllTitle", "func_0001251C", "small_leaves_02.S"],
  ["DllTitle", "func_0001C73C", "small_leaves_02.S"],
  ["DllTitle", "func_0001C880", "small_leaves_02.S"],
  ["DllTitle", "func_0001CE20", "small_leaves_02.S"],
  ["DllTitle", "func_0000E658", "small_leaves_03.S"],
  ["DllTitle", "func_0000EEBC", "small_leaves_03.S"],
  ["DllTitle", "func_000119C4", "small_leaves_03.S"],
  ["DllTitle", "func_00012488", "small_leaves_03.S"],
  ["DllTitle", "func_0001157C", "small_leaves_04.S"],
  ["DllTitle", "func_00012630", "small_leaves_04.S"],
  ["DllTitle", "func_0001ABF0", "small_leaves_04.S"],
  ["DllTitle", "func_0001B640", "small_leaves_04.S"],
  ["DllTitle", "func_0001B6C4", "small_leaves_04.S"],
  ["DllTitle", "func_0000EDF4", "small_leaves_05.S"],
  ["DllTitle", "func_0000F6E0", "small_leaves_05.S"],
  ["DllTitle", "func_000105B8", "small_leaves_05.S"],
  ["DllTitle", "func_000107E4", "small_leaves_05.S"],
  ["DllTitle", "func_0000E1B8", "small_leaves_06.S"],
  ["DllTitle", "func_0000E340", "small_leaves_06.S"],
  ["DllTitle", "func_000129C8", "small_leaves_06.S"],
  ["DllTitle", "func_00014CA8", "small_leaves_06.S"],
  ["DllTitle", "func_000195D0", "small_leaves_06.S"],
  ["DllTitle", "func_0000ED48", "small_leaves_07.S"],
  ["DllTitle", "func_00010738", "small_leaves_07.S"],
  ["DllTitle", "func_000123E0", "small_leaves_07.S"],
  ["DllTitle", "func_000155A4", "small_leaves_07.S"],
  ["DllTitle", "func_0001AB40", "small_leaves_07.S"],
  ["DllTitle", "func_000109B4", "small_leaves_08.S"],
  ["DllTitle", "func_00011FF8", "small_leaves_08.S"],
  ["DllTitle", "func_00012244", "small_leaves_08.S"],
  ["DllTitle", "func_00012F48", "small_leaves_08.S"],
  ["DllTitle", "func_0001966C", "small_leaves_08.S"],
  ["DllTitle", "func_0000E278", "small_leaves_09.S"],
  ["DllTitle", "func_00011B84", "small_leaves_09.S"],
  ["DllTitle", "func_0001255C", "small_leaves_09.S"],
  ["DllTitle", "func_00012A68", "small_leaves_09.S"],
  ["DllTitle", "func_00012D6C", "small_leaves_09.S"],
].map(async ([unit, name, file = "remaining_01.S"]) => ({
  name,
  source: await readFile(new URL(`../src/cro/${unit}/${file}`, import.meta.url), "utf8"),
})));

test.each(["func_00001C84", "func_00002120", "func_00003564", "func_00003714"])(
  "ByteMatch can locate %s through its assembly marker",
  (name) => {
    const marker = new RegExp(`^ASM_FUNC\\(${name}\\)$`, "m");
    expect(gameSyncSource).toMatch(marker);
  },
);

test("ByteMatch can locate func_000009EC through its assembly marker", () => {
  expect(skatePipeSource).toMatch(/^ASM_FUNC\(func_000009EC\)$/m);
});

test("ByteMatch can locate func_00000610 through its assembly marker", () => {
  expect(waterSurfaceSource).toMatch(/^ASM_FUNC\(func_00000610\)$/m);
});

test.each(smallCompletionSources)(
  "ByteMatch can locate $name through its assembly marker",
  ({ name, source }) => {
    expect(source).toMatch(new RegExp(`^ASM_FUNC\\(${name}\\)$`, "m"));
  },
);
