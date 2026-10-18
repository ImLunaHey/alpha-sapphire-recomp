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
