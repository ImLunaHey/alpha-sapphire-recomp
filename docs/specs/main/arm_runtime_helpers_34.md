# Probe-verified ARM runtime/leaf-helper batch 34

## Scope and provenance

This clean-room specification covers eight still-unmatched ARM-state runtime
and arithmetic leaf helpers totaling 336 executable bytes. The complete
schedules below were independently assembled with GNU Arm Embedded 15.2 for
ARMv6K and compared against target revision `AS_EUR_REV2` on 2026-10-16. All
eight complete bodies and all 336 bytes matched directly, without any
normalization.

The evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and an
independent exact-schedule probe. These helpers have no direct external
branches, relocations, literal pools, adjacent data, or embedded private data
identities. No private absolute address, raw byte sequence, instruction
encoding, proprietary source, or private data value is recorded here.

All schedules are ARM state under this common preamble:

```asm
.syntax unified
.arch armv6k
.arm
```

## `func_002E173C` — sparse record clear

This 72-byte leaf clears the twelve words at offsets 8 through 52, then the
word at offset 0, and finally the three bytes at offsets 4, 5, and 6. Offset
7 is deliberately untouched. The order is normative: the leading contiguous
word range is cleared before the low word and bytes.

### Complete exact body schedule

```asm
mov r1,#0
str r1,[r0,#8]
str r1,[r0,#12]
str r1,[r0,#16]
str r1,[r0,#20]
str r1,[r0,#24]
str r1,[r0,#28]
str r1,[r0,#32]
str r1,[r0,#36]
str r1,[r0,#40]
str r1,[r0,#44]
str r1,[r0,#48]
str r1,[r0,#52]
str r1,[r0]
strb r1,[r0,#4]
strb r1,[r0,#5]
strb r1,[r0,#6]
bx lr
```

Exact-schedule caution: do not replace the stores with a loop, multiple-store
instruction, or wider clear that would overwrite offset 7.

## `func_002F32AC` — scaled size plus aligned tail

This 36-byte arithmetic leaf derives a scale from entry `r0`: the scale is
four when subtracting 5120 and then 6 produces zero, and one otherwise. It
multiplies entry `r1` by that scale, rounds entry `r2` upward to a 32-byte
boundary, and returns the sum in `r0`.

### Complete exact body schedule

```asm
sub r0,r0,#5120
subs r0,r0,#6
mov r0,#1
moveq r0,#4
mul r0,r1,r0
add r1,r2,#31
bic r1,r1,#31
add r0,r0,r1
bx lr
```

The non-flag-setting `mov` between `subs` and `moveq` must remain exactly as
shown so the conditional move consumes the subtraction flags. Preserve the
displayed multiply operand order and use the `add`/`bic` alignment sequence.

## `func_002F3950` — double-region aligned size calculation

This 60-byte arithmetic leaf uses the same one-or-four scale rule as
`func_002F32AC`. It first forms `(entry r2 + 8) * entry r1`, applies the scale,
and retains that scaled product in `r0`. Entry `r3` is rounded upward to a
32-byte boundary. The helper adds one scaled region, rounds again, adds a
second scaled region, and returns the resulting total in `r0`.

### Complete exact body schedule

```asm
add r12,r2,#8
sub r0,r0,#5120
mul r1,r12,r1
subs r0,r0,#6
mov r0,#1
moveq r0,#4
add r2,r3,#31
mul r0,r1,r0
bic r1,r2,#31
add r1,r1,r0
add r1,r1,#31
bic r1,r1,#31
add r1,r1,r0
add r0,r0,r1
bx lr
```

Exact-schedule cautions:

- Form `r12` and perform the first multiply before the flag-setting second
  subtraction.
- Preserve the non-flag-setting scale materialization between `subs` and
  `moveq`.
- Keep both separate `add`/`bic` rounding sequences and both later additions
  of the scaled product; do not algebraically fold the calculation.

## `func_002F398C` — alignment-state advance

This 72-byte leaf updates a three-word state at offsets 0, 4, and 8. It saves
the offset-4 word, temporarily writes 32 there, and raises the offset-8 word
to at least 32 using an unsigned conditional move. It then restores the saved
offset-4 word, rounds the offset-0 word upward to a 32-byte boundary, adds
2144, and stores it back. Finally it raises the offset-8 word to at least the
restored offset-4 word, again using an unsigned conditional move.

Thus offset 4 is unchanged on return, offset 0 is advanced from its rounded
value, and offset 8 becomes the unsigned maximum of its entry value, 32, and
the entry offset-4 value.

### Complete exact body schedule

```asm
ldr r1,[r0,#4]
mov r2,#32
str r2,[r0,#4]
ldr r3,[r0,#8]
cmp r3,#32
movcs r2,r3
str r2,[r0,#8]
ldr r2,[r0]
str r1,[r0,#4]
add r2,r2,#31
bic r2,r2,#31
add r2,r2,#2144
str r2,[r0]
ldr r2,[r0,#8]
cmp r2,r1
movcs r1,r2
str r1,[r0,#8]
bx lr
```

Exact-schedule caution: preserve the temporary offset-4 store and its later
restoration even though the entry value is ultimately unchanged. Both
maximum operations use carry-set unsigned comparisons, not signed ones.

## `func_002F78F0` — single-byte state clear

This 12-byte leaf writes zero to the byte at offset 300 from entry `r0` and
returns. No surrounding byte is touched.

### Complete exact body schedule

```asm
mov r1,#0
strb r1,[r0,#300]
bx lr
```

## `func_002FCE50` — nested indirect tail dispatch

This 16-byte helper replaces `r0` with the word at entry `r0 + 8`, loads a
second word through that object, loads a branch identity from offset 16 of
the second object, and tail-dispatches through it. The indirect destination
is runtime data, not a statically named code identity; its low bit controls
the destination instruction state in the ordinary `bx` manner.

### Complete exact body schedule

```asm
ldr r0,[r0,#8]
ldr r1,[r0]
ldr r1,[r1,#16]
bx r1
```

This schedule has no relocation. Preserve the destructive replacement of
`r0`, the two successive loads through `r1`, and the tail `bx`; do not turn
the dispatch into a linked call.

## `func_002FF7C0` — quotient/remainder-by-ten arithmetic leaf

This 44-byte leaf uses a fixed shift-and-add schedule to approximate division
by ten, then corrects the quotient and remainder from one signed subtraction.
For the intended nonnegative input domain, it returns quotient in `r0` and
remainder in `r1`. The exact arithmetic schedule and flag flow are normative
even where an implementation language could express division directly.

### Complete exact body schedule

```asm
sub r1,r0,#10
sub r0,r0,r0,lsr #2
add r0,r0,r0,lsr #4
add r0,r0,r0,lsr #8
add r0,r0,r0,lsr #16
lsr r0,r0,#3
add r2,r0,r0,lsl #2
subs r1,r1,r2,lsl #1
addpl r0,r0,#1
addmi r1,r1,#10
bx lr
```

The last two conditional additions consume the flags from `subs`. Do not
replace the staged shifts, use a multiply-by-reciprocal sequence, or emit a
hardware divide.

## `func_002FFBE0` — low 64-bit product

This 24-byte leaf treats entry `r1:r0` and `r3:r2` as two-word operands and
returns the low two words of their product in `r1:r0`. It retains entry `r0`
in LR, uses `r12` for the high word of the first unsigned multiply, and adds
the two cross products with consecutive multiply-accumulate instructions.
Only LR is saved; return is performed by loading PC from the stack.

### Complete exact body schedule

```asm
stmfd sp!,{lr}
mov lr,r0
umull r0,r12,r2,lr
mla r1,r2,r1,r12
mla r1,r3,lr,r1
ldmfd sp!,{pc}
```

Exact-schedule caution: preserve the operand order, the use of LR and `r12`
as temporaries, and the `stmfd`/`ldmfd` single-register frame rather than
introducing a larger conventional save set.

## Branch, data, and equality ledger

There are no direct external branch sites in this batch and therefore no
`R_ARM_CALL`, `R_ARM_JUMP24`, or interworking relocation identities to name.
`func_002FCE50` has one indirect non-linking dispatch whose destination is
loaded from runtime data. All other exits return locally through `bx lr` or
the displayed PC-restoring load.

There are no PC-relative literal loads, embedded words, adjacent pool slots,
or data relocations in any of the eight sections. Consequently this batch
introduces no symbolic data equality classes and asserts no cross-batch data
identity. All conditional execution is body-local and relocation-free.

## Exact-probe and overlap audit

| Function | Mode | Body bytes | External relocations | Probe result |
| --- | --- | ---: | ---: | --- |
| `func_002E173C` | ARM | 72 | 0 | exact complete body |
| `func_002F32AC` | ARM | 36 | 0 | exact complete body |
| `func_002F3950` | ARM | 60 | 0 | exact complete body |
| `func_002F398C` | ARM | 72 | 0 | exact complete body |
| `func_002F78F0` | ARM | 12 | 0 | exact complete body |
| `func_002FCE50` | ARM | 16 | 0 | exact complete body |
| `func_002FF7C0` | ARM | 44 | 0 | exact complete body |
| `func_002FFBE0` | ARM | 24 | 0 | exact complete body |
| **Total** |  | **336** | **0** | **8 / 8 exact; 336 / 336 bytes** |

The probe emitted one independently assembled section per helper. Direct
section comparison found zero differences across all 336 executable bytes,
and readelf reported no relocations anywhere in the probe object. The sizes
above exactly equal the function extents in the current report; no trailing
data was included or omitted.

The current objdiff report lists all eight helpers as zero-percent matched.
The complete tracked and concurrent inventory contains none of their names.
In particular, IPC batch 31 selects only `func_002C...` wrappers; duplicate
batch 34 selects `func_002E25B0`, `func_002E4960`, and `func_002E52EC`;
runtime batch 33 selects ten `func_002DD...`/`func_002DE...` retry wrappers;
and duplicate batch 35 selects four functions outside every extent in this
batch. The eight body extents here are pairwise disjoint from one another and
from all earlier and concurrent specifications, with zero function,
executable-byte, or adjacent-data overlap.
