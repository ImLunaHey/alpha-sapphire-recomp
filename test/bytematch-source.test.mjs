import { readFile } from "node:fs/promises";

import { expect, test } from "vitest";

const source = await readFile(new URL("../src/cro/DllGameSync/contract_12.S", import.meta.url), "utf8");

test.each(["func_00001C84", "func_00002120", "func_00003564", "func_00003714"])(
  "ByteMatch can locate %s through its assembly marker",
  (name) => {
    const marker = new RegExp(`^ASM_FUNC\\(${name}\\)$`, "m");
    expect(source).toMatch(marker);
  },
);
