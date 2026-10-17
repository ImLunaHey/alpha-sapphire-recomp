# DllDialogCommon clean-room specification 02

## Scope and status

This specification covers the one accepted function in `cro/DllDialogCommon`
that remains without source credit: `func_00000780`. It is an ARM function at
module text offset `0x0780`, is 796 bytes (199 instructions), and has 37 direct
call sites. The other accepted function, `func_000002C0` (332 bytes), is already
credited by CRO contract 09 and is outside this implementation scope.

The routine is a factory/setup operation. It obtains an object from a helper,
initializes object and embedded-subobject fields, performs common dialog/UI
configuration, selects one of two mode-specific setup paths, optionally
attaches a caller-provided resource, finalizes the object, and returns it.

The behavioral descriptions below use abstract machine-word values and neutral
helper aliases. They deliberately do not assign SDK or game-domain names that
the evidence does not establish.

## Entry contract

Use the following ABI-level model. All unspecified values are 32-bit words.

```text
object *func_00000780(
    word argument0,
    owner *argument1,
    word mode,
    const signed_halfword *argument3,
    word optional_resource);
```

`argument1` and `argument3` must be readable. The function reads a word at
`argument1 + 0x10`; on the `mode == 1` path it reads and sign-extends the
halfword at `argument3`. It does not validate these pointers. The fifth
argument is received on the stack under the ARM procedure-call convention.

The return value is the object returned by helper H01. No observed path returns
a different value. The implementation must preserve the original ARM calling
convention and the callee-saved registers used by an ordinary non-leaf
function.

## Neutral external-helper interface

Every direct call targets a local import veneer. The veneer in turn names an
anonymous import from the static module's text segment. These aliases are the
stable interface facts needed by an implementation; signatures show only the
arguments whose values are established at the call sites. `ret` means the
helper's return value is consumed.

| Alias | Static text coordinate | Observed interface/use |
| --- | ---: | --- |
| H00 | `0x004EA64` | `H00(0, 0, 0)`; invalid-mode diagnostic/assertion |
| H01 | `0x023DF9C` | `ret H01(argument0, argument1, owner_word, owner_word)` |
| H02 | `0x023DA5C` | `H02(object, argument1, 1)` |
| H03 | `0x023DDAC` | twelve-argument common setup described below |
| H04 | `0x02617D8` | `H04(handle, selector_a, selector_b, 0)` |
| H05 | `0x03C4B40` | `ret H05(object)`; obtains a handle used by H04/H16/H18 |
| H06 | `0x0262010` | `H06(handle, 1, rodata+0x1C, 5)` |
| H07 | `0x023B838` | `H07(object, object+0x74)`; finalization |
| H08 | `0x03C4BDC` | `ret H08(object, 1)` |
| H09 | `0x023B840` | `H09(object, object[0x78], H08_result, rodata+0x80, 2)` |
| H10 | `0x023B738` | `ret H10(object)` |
| H11 | `0x024B0CC` | `H11(H10_result, index, 0x00060001)` |
| H12 | `0x024AE00` | `H12(H10_result, 5, 32, 0)` |
| H13 | `0x02611D8` | `H13(object[0x5C], 1, 0, 1, 1)` |
| H14 | `0x02610E4` | `ret H14()` |
| H15 | `0x0350A0C` | `H15(H14_result, 0, optional_resource)` |
| H16 | `0x0262C68` | `H16(handle, 0, 70, variant, object[0x78])` |
| H17 | `0x023DB64` | `H17(object, 1, value, slot)` |
| H18 | `0x026277C` | nine-argument mode-1 setup described below |

The coordinates identify anonymous imports; they are not proposed source names.
An implementation may retain the repository's reversible anonymous-import
symbols or introduce local neutral aliases that resolve to those same imports.

## Required behavior

Let `owner_word = *(word *)(argument1 + 0x10)` and
`object = H01(argument0, argument1, owner_word, owner_word)`.

Perform the following common initialization in order:

1. Store `rodata + 0x248` at `object + 0x00`.
2. Store `rodata + 0x288`, `argument1`, and zero at object offsets `0x74`,
   `0x78`, and `0x7C`, respectively.
3. Call `H02(object, argument1, 1)`.
4. Call H03 as
   `H03(object, argument1, 0, 2, rodata+0xB8, 2, rodata+0xE0, 2,
   0x88, 0, 0, 8)`. The last eight arguments are stack arguments in precisely
   that order.
5. Call `H04(object[0x5C], 0, 73, 0)` and then
   `H04(object[0x5C], 0, 75, 0)`.
6. Compute `handle = H05(object)` and call
   `H06(handle, 1, rodata+0x1C, 5)`.

Then perform the first mode dispatch:

- If `mode == 0`, evaluate `temporary = H08(object, 1)` and call
  `H09(object, object[0x78], temporary, rodata+0x80, 2)`. Call H10 and pass
  its result to `H11(result, 4, 0x00060001)`; repeat with index 5. Call H10
  once more and pass its result to `H12(result, 5, 32, 0)`. Finally call
  `H13(object[0x5C], 1, 0, 1, 1)`.
- If `mode == 1`, call H05 and use its result for
  `H04(result, 1, 6, 0)`, then call H05 again and use its new result for
  `H04(result, 1, 7, 0)`.
- Otherwise call `H00(0, 0, 0)`. If H00 returns, execution continues to the
  second dispatch; do not assume that the helper is non-returning.

The second mode dispatch uses `optional_resource`:

- If `mode == 0` and `optional_resource != 0`, call H05, then call H14 and
  pass its result to `H15(result, 0, optional_resource)`. Call H05 again and
  invoke `H16(result, 0, 70, 0, object[0x78])`. Whether or not the optional
  block ran, call `H17(object, 1, 0, 4)` followed by
  `H17(object, 1, 2, 5)`.
- If `mode == 1` and `optional_resource != 0`, perform the same H05/H14/H15
  sequence, then call H05 and invoke
  `H16(result, 0, 70, 3, object[0x78])`. Whether or not that optional block
  ran, call H05 and invoke
  `H18(result, 0, 70, 3, sign_extend_16(*argument3), 2, 1, 0, 1)`; the last
  five values are stack arguments in precisely that order.
- Otherwise call `H00(0, 0, 0)` again. If H00 returns, continue normally.

Finally call `H07(object, object + 0x74)` and return `object`.

Call order and repeated helper evaluation are observable requirements. In
particular, do not cache H05 or H10 results across the call sites described
above, and do not fold the two invalid-mode calls into one.

## Pool and relocation facts

The function body contains no relocation output words. It addresses the
adjacent pool beginning at text offset `0x0A9C`, which is outside the accepted
function boundary. The pool contains five words: four `R_ARM_ABS32` references
to read-only data with addends `0x248`, `0xE0`, `0x1C`, and `0x80`, followed by
the scalar `0x00060001`. The code derives `rodata+0x288` by adding `0x40` to
the first pointer and derives `rodata+0xB8` by subtracting `0x28` from the
second. An implementation that owns only this function must not claim or emit
the adjacent pool as authored data unless integration separately assigns that
pool.

Private target inspection gives the function-body SHA-256
`6159155d77b7859ed4cdfb21ef02418550d1f833f1475c3c2daa69964114f65a`.
This digest is an acceptance aid, not a semantic substitute.

## Unit residue and completeness

The public complete partition accounts for the 3,336-byte module text segment
as follows: two accepted functions totaling 1,128 bytes, 58 executable gaps
totaling 1,840 bytes, 58 pools totaling 328 bytes, and one 40-byte objectively
unknown range at `0x0C2C`. The structural target additionally has 708 bytes of
read-only data, 4 bytes of writable data, and 16 bytes of BSS.

Private structural inspection observes 137 relocations, all `R_ARM_ABS32`, and
57 distinct undefined import symbols. Those counts describe the whole unit;
this function reaches only the 19 imports listed above and owns no relocation
word itself.

Implementing `func_00000780` can make both accepted functions (1,128/1,128
accepted code bytes) exact, but it cannot establish whole-file identity or a
complete unit. The 1,840 bytes of executable gaps have no accepted function
contracts, the 40-byte unknown range remains deliberately unclassified, and
all 1,056 report-accounted data bytes (pool, read-only data, writable data, and
BSS) remain unclaimed. The 12,288-byte CRO container also includes structural
metadata outside these link-time payload sections. Therefore the unit must
remain `complete: false` after this function is implemented.

## Provenance

- Target: Pokémon Alpha Sapphire, Europe revision 2 (`AS_EUR_REV2`), title
  version 3120; public unit identity SHA-256
  `c6153574d71e284207c166f88f62455f37eb84d1dbecefa19937efe4684bb39d`.
- Public evidence: `symbols/cro/DllDialogCommon.csv`,
  `symbols/cro-partitions/DllDialogCommon.json`, the checked-in unit manifest,
  and the checked-in objdiff report.
- Private verification evidence: the ignored converted and split target
  objects located through the ignored environment configuration. No private
  path or target payload is reproduced here.
- Tools: repository CRO converter/splitter; Ghidra 12.0.2 inventory;
  GNU Arm objdump/readelf/objcopy 2.45.1 from Arm GNU Toolchain 15.2.Rel1;
  SHA-256.
- Observation date: 2026-10-17.
- Classification: neutral analysis/specification. No leaked source,
  proprietary SDK header, authored target symbol, or implementation source was
  consulted or copied into this document.
