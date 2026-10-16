# Probe-verified ARM runtime/leaf-helper batch 35

## Scope and provenance

This clean-room specification covers eight still-unmatched ARM-state runtime
and leaf helpers totaling 428 executable bytes. The complete schedules below
were independently assembled with GNU Arm Embedded 15.2 for ARMv6K and
compared against target revision `AS_EUR_REV2` on 2026-10-16. All eight
complete bodies and all 428 bytes matched directly, without normalization.

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

## `func_00300EA8` — logical left shift of a two-word value

This 40-byte arithmetic leaf shifts the two-word value in entry `r1:r0`
left by the count in entry `r2` and returns the low two result words in
`r1:r0`. Counts below 32 combine the two entry words; counts at least 32
derive the high result word from entry `r0` and clear the low result word.
The exact schedule is normative, including the flag-setting subtraction and
the early return in the below-32 path.

### Complete exact body schedule

```asm
subs r3,r2,#32
bpl 1f
rsb r3,r2,#32
lsl r1,r1,r2
orr r1,r1,r0,lsr r3
lsl r0,r0,r2
bx lr
1:
lsl r1,r0,r3
mov r0,#0
bx lr
```

Preserve the signed `bpl` selection, the register-shift forms, and the order
in which the entry high word is updated before the entry low word.

## `func_00301FBC` — zero-fill runtime primitive

This 84-byte leaf clears the byte range beginning at entry `r0` for the byte
count in entry `r1`. It materializes zero in four registers, consumes
32-byte blocks with two consecutive four-register stores, then handles the
16-, 8-, 4-, 2-, and 1-byte residual components through condition flags.
Only LR is saved. The pointer writebacks, flag flow, and early conditional
return are part of the exact implementation contract.

### Complete exact body schedule

```asm
mov r2,#0
stmfd sp!,{lr}
mov r3,r2
mov r12,r2
mov lr,r2
subs r1,r1,#32
1:
stmiacs r0!,{r2,r3,r12,lr}
stmiacs r0!,{r2,r3,r12,lr}
subscs r1,r1,#32
bcs 1b
lsls r1,r1,#28
stmiacs r0!,{r2,r3,r12,lr}
stmiami r0!,{r2,r3}
ldmfd sp!,{lr}
lsls r1,r1,#2
strcs r2,[r0],#4
bxeq lr
strhmi r2,[r0],#2
tst r1,#0x40000000
strbne r2,[r0],#1
bx lr
```

Exact-schedule cautions:

- The loop back-edge targets the first conditional multiple store, not the
  preceding subtraction.
- Both 16-byte stores execute for each accepted 32-byte block.
- Restore LR before the final residual flag schedule, and retain the
  conditional `bx` rather than joining both exits.

## `func_003028B8` — guarded unsigned ordering predicate

This 100-byte leaf compares ordering fields reached through entry `r1` and
entry `r2`. A null entry `r2` returns one immediately, while a null entry
`r1` returns zero. Each non-null entry contributes its offset-8 link. When a
link is non-null, its header word must contain both bits selected by the
mask materialized in `r3`; otherwise that link is replaced with null. Under
the surrounding runtime invariant that the resulting links are valid for
the later loads, the words at offset 76 are compared unsigned. The helper
returns one exactly when the left word is below the right word, and zero
otherwise.

### Complete exact body schedule

```asm
cmp r2,#0
beq 2f
cmp r1,#0
beq 3f
ldr r1,[r1,#8]
mov r3,#0x40000001
cmp r1,#0
beq 1f
ldr r0,[r1]
bics r0,r3,r0
movne r1,#0
1:
ldr r0,[r2,#8]
cmp r0,#0
beq 4f
ldr r2,[r0]
bics r2,r3,r2
movne r0,#0
4:
ldr r1,[r1,#76]
ldr r0,[r0,#76]
cmp r1,r0
bcs 3f
2:
mov r0,#1
bx lr
3:
mov r0,#0
bx lr
```

Do not turn either `bics` into a simple test: its result register and flags
are both observable in the subsequent schedule. Preserve the unsigned
`bcs` result selection and the asymmetric null-entry results.

## `func_00303150` — conditional state-bit refresh

This 56-byte leaf reads the state word at offset 60 from entry `r0`. If bit
16 is already set, it returns without writing. Otherwise it compares the
words at offsets 0 and 20 with the single-precision representation of one.
When both compare equal it sets bit 128 in the state word; when either does
not, it clears that bit. It then writes the updated state word back to
offset 60.

### Complete exact body schedule

```asm
ldr r1,[r0,#60]
mov r2,#16
bics r2,r2,r1
beq 1f
ldr r2,[r0]
cmp r2,#0x3f800000
bne 2f
ldr r2,[r0,#20]
cmp r2,#0x3f800000
orreq r1,r1,#128
beq 3f
2:
bic r1,r1,#128
3:
str r1,[r0,#60]
1:
bx lr
```

The equality path relies on conditional execution after the second compare;
retain the displayed branch and conditional OR rather than consolidating the
two comparisons.

## `func_003032D0` — staged state-bit normalization

This 52-byte leaf loads the state word at offset 60, clears bits 32 and 64,
and stores that intermediate value unconditionally. It then uses a
flag-setting bit-clear against mask 384. Only when all bits selected by that
mask are already present does it set bit 64, store again, and test bit 512
with another flag-setting bit-clear. If bit 512 is present, it also sets bit
32 and performs a final conditional store.

### Complete exact body schedule

```asm
ldr r1,[r0,#60]
mov r2,#384
bic r1,r1,#96
bics r2,r2,r1
str r1,[r0,#60]
bne 1f
orr r1,r1,#64
mov r2,#512
bics r2,r2,r1
str r1,[r0,#60]
orreq r1,r1,#32
streq r1,[r0,#60]
1:
bx lr
```

All three possible stores are normative. In particular, preserve the first
store before the branch and the second store between the later flag-setting
operation and its conditional consumers.

## `func_00305760` — conditionally clear a linked byte

This 32-byte leaf follows entry `r1` through offsets 76 and 204 and treats
the resulting word as signed. If that word is positive, it loads the link at
entry `r0 + 0`, clears the byte at that link, and leaves zero in `r0`. If the
word is zero or negative, it returns without accessing the entry-`r0` link.

### Complete exact body schedule

```asm
ldr r1,[r1,#76]
ldr r1,[r1,#204]
cmp r1,#0
ble 1f
ldr r1,[r0]
mov r0,#0
strb r0,[r1]
1:
bx lr
```

Preserve the signed `ble` gate and the destructive zeroing of `r0` only on
the store path.

## `func_0030E318` — tagged relative-link resolver

This 48-byte leaf loads a base pointer through entry `r0` and examines its
header word. For the first distinguished tag it returns the base pointer
unchanged. For the second distinguished tag it advances the base by 12,
loads the relative displacement there, and returns base-plus-displacement
when that displacement is nonzero. Every other tag, and a zero displacement,
returns null.

### Complete exact body schedule

```asm
ldr r0,[r0]
ldr r1,[r0]
cmp r1,#0x80000000
beq 1f
cmp r1,#0x40000000
bne 2f
ldr r1,[r0,#12]!
cmp r1,#0
addne r0,r0,r1
bne 1f
2:
mov r0,#0
1:
bx lr
```

The pre-indexed load permanently advances `r0` before the conditional add.
Do not replace it with a non-writeback load or fold the tag cases.

## `func_0030FDE8` — checked-load zero pair

This 16-byte leaf first loads the word addressed by entry `r0` into `r2`,
then returns zero in both `r0` and `r1`. The initial load is architecturally
significant even though its value is not returned: it preserves the memory
access and any fault behavior, while leaving the loaded word in `r2`.

### Complete exact body schedule

```asm
ldr r2,[r0]
mov r1,#0
mov r0,r1
bx lr
```

## Branch, data, and equality ledger

There are no direct external branch sites in this batch and therefore no
`R_ARM_CALL`, `R_ARM_JUMP24`, or interworking relocation identities to name.
Every branch is body-local, and every exit is a local `bx lr`, including the
conditional early return in `func_00301FBC`.

There are no PC-relative literal loads, embedded words, adjacent pool slots,
or data relocations in any of the eight sections. Consequently this batch
introduces no symbolic data equality classes and asserts no cross-batch data
identity. The immediate tag, mask, and comparison constants shown above are
instruction operands, not target data identities.

## Exact-probe and overlap audit

| Function | Mode | Body bytes | External relocations | Probe result |
| --- | --- | ---: | ---: | --- |
| `func_00300EA8` | ARM | 40 | 0 | exact complete body |
| `func_00301FBC` | ARM | 84 | 0 | exact complete body |
| `func_003028B8` | ARM | 100 | 0 | exact complete body |
| `func_00303150` | ARM | 56 | 0 | exact complete body |
| `func_003032D0` | ARM | 52 | 0 | exact complete body |
| `func_00305760` | ARM | 32 | 0 | exact complete body |
| `func_0030E318` | ARM | 48 | 0 | exact complete body |
| `func_0030FDE8` | ARM | 16 | 0 | exact complete body |
| **Total** |  | **428** | **0** | **8 / 8 exact; 428 / 428 bytes** |

The probe emitted one independently assembled section per helper. Direct
section comparison found zero differences across all 428 executable bytes,
and readelf reported no relocations anywhere in the probe object. The sizes
above exactly equal the function extents in the current report; no trailing
data was included or omitted.

The current objdiff report lists all eight helpers as zero-percent matched.
The complete tracked inventory contains none of their names, and their body
extents are pairwise disjoint. At the time of this audit, neither a duplicate
batch 36 specification nor an IPC batch 32 specification was present in the
workspace; the existing duplicate batch 35, IPC batch 31, runtime batch 34,
and all earlier tracked specifications contain none of these functions.
Thus there is zero known function, executable-byte, or adjacent-data overlap
with another clean-room batch.
