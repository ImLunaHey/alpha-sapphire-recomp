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
