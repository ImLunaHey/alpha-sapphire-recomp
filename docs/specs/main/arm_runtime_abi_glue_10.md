# Probe-verified ARM runtime and ABI glue batch 10

## Scope and clean-room classification

This specification covers eleven short ARM-state runtime helpers. They set the
public ARM floating-point control register, restore an ARM execution context,
copy fixed-size records, implement signed 64-bit shifting, calculate an ABI
stack-argument expression, or perform exclusive-monitor synchronization.

The descriptions use only public ARM architecture and procedure-call concepts.
They contain no target instruction words, executable literals, extracted
assets, proprietary SDK interfaces, or private destination addresses. The
register names and mnemonic constraints below are independently authored
textual-assembly requirements. Public architectural meanings were checked
against the [Arm Architecture Reference Manual][arm-arm] and argument placement
against [AAPCS32][aapcs32].

[arm-arm]: https://developer.arm.com/documentation/ddi0406/latest/
[aapcs32]: https://github.com/ARM-software/abi-aa/releases/latest/download/aapcs32.pdf

All helpers are ARM-state functions and use little-endian 32-bit words.

## Behavioral specification

### Floating-point environment

`func_001235A8` (12 bytes) replaces `FPSCR` with `0x03000000`, enabling the
architectural default-NaN and flush-to-zero controls while clearing the other
FPSCR fields. It then returns normally. Its exact three-operation shape is:

```asm
mov r0, #0x03000000
vmsr fpscr, r0
bx lr
```

The implementation must enable a VFP assembler profile that accepts `vmsr`;
the repository's ordinary soft-float calling convention remains unchanged.

### Execution-context restore

`func_00123768` (28 bytes) consumes a context record with saved `r0` through
`r12` at byte offsets 0 through 48, a saved stack pointer at offset 52, a saved
link register at offset 56, and a saved program counter at offset 60. It stages
the saved link register and program counter immediately below the saved stack
pointer, restores `r0` through `r12`, switches to that staged stack, and resumes
at the saved program counter. It does not return to its incoming caller.

Use this exact mnemonic/register choreography:

```asm
ldr lr, [r0, #52]
add r1, r0, #56
ldm r1, {r2, r3}
stmdb lr!, {r2, r3}
ldm r0, {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12}
mov sp, lr
pop {lr, pc}
```

Do not replace the two-word staging operation with separate stores or change
the register-list spellings.

### Fixed-size forward-copy helpers

The following routines copy non-overlapping or forward-safe records from the
address in `r1` to the address in `r0`. They return with both pointer registers
advanced by the copied byte count. Their explicit saves restore every
callee-saved scratch register used by the helper. They provide no overlap-safe
`memmove` guarantee.

| Function | Size | Bytes copied | Load/store grouping | Prefetch behavior |
| --- | ---: | ---: | --- | --- |
| `func_001237BC` | 28 | 24 | 16 bytes, then 8 bytes | none |
| `func_001237D8` | 32 | 32 | 16 bytes twice | prefetch original source + 80 after the first load |
| `func_00123858` | 48 | 56 | 16, 16, 16, then 8 bytes | prefetch original source + 80 after the first load |
| `func_00123888` | 52 | 64 | four 16-byte groups | prefetch original source + 80 and +112 |

All four helpers begin with `push {r4, r5, r9, r10, r11}`, end with the matching
`pop` followed by `bx lr`, and use increment-after writeback for each source
load and destination store. The exact bodies between save and restore are:

```asm
/* func_001237BC */
ldm r1!, {r2, r3, r4, r5}
ldm r1!, {r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r11, r12}

/* func_001237D8 */
ldm r1!, {r2, r3, r4, r5}
pld [r1, #64]
ldm r1!, {r9, r10, r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r9, r10, r11, r12}

/* func_00123858 */
ldm r1!, {r2, r3, r4, r5}
pld [r1, #64]
ldm r1!, {r9, r10, r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r9, r10, r11, r12}
ldm r1!, {r2, r3, r4, r5}
ldm r1!, {r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r11, r12}

/* func_00123888 */
ldm r1!, {r2, r3, r4, r5}
pld [r1, #64]
ldm r1!, {r9, r10, r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r9, r10, r11, r12}
ldm r1!, {r2, r3, r4, r5}
pld [r1, #64]
ldm r1!, {r9, r10, r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r9, r10, r11, r12}
```

### Signed 64-bit arithmetic right shift

`func_00123D98` (40 bytes) accepts a signed 64-bit value in `r1:r0` and a shift
count in `r2`, returning the arithmetic-right-shifted result in `r1:r0`. For
counts below 32 it combines the two input halves and sign-shifts the high half;
for counts of at least 32 it derives the low result from the signed high half
and fills the high result with the sign. This is the public AAPCS two-register
form commonly used by a signed-long-long shift helper.

Use one forward local label and this exact shape:

```asm
subs r3, r2, #32
bpl 1f
rsb r3, r2, #32
lsr r0, r0, r2
orr r0, r0, r1, lsl r3
asr r1, r1, r2
bx lr
1:
asr r0, r1, r3
asr r1, r1, #31
bx lr
```

### Stack-argument arithmetic helper

`func_00123E68` (24 bytes) ignores the first four register arguments, reads the
fifth 32-bit argument from `[sp, #4]` and the sixth from `[sp, #8]`, and returns
`fifth * 32 + sixth * 24` in `r0`. Preserve the observed load order and use
shifted-add multiplication rather than multiply instructions:

```asm
ldr r0, [sp, #8]
ldr r1, [sp, #4]
add r0, r0, r0, lsl #1
lsl r1, r1, #5
add r0, r1, r0, lsl #3
bx lr
```

### Exclusive-monitor synchronization helpers

`func_00124150` (80 bytes) operates on a signed 32-bit state at `r0`. If an
ordinary initial load sees state 1, it returns 1 unchanged. Otherwise it tries
to atomically replace state 0 with -1, retrying only a failed exclusive store.
It returns 1 after a successful replacement and 0 when the exclusive load sees
a nonzero value; that nonreplacement path explicitly clears the monitor. It
saves and restores `r4` and `r5`. Use `r1 = -1`, `r2 = 0`, `r3` for the
exclusive value, and `r5` for the store status. Preserve the comparison and
branch ordering: initial test for 1; exclusive-load loop; nonzero `clrex` path;
test of `r3`; then Boolean return selection.

In particular, the ordinary initial value must stay in `r1`; do not preserve it
in a callee-saved register or funnel both Boolean results through one final
move. Both setup immediates are conditional on that initial value not being 1,
the exclusive-store status is compared with immediate zero rather than `r2`,
and the final nonzero path writes `r0` and branches around the success write.
Use this exact register and control-flow shape:

```asm
push {r4, r5}
ldr r1, [r0]
cmp r1, #1
movne r2, #0
mvnne r1, #0
beq 3f
1:
ldrex r3, [r0]
cmp r3, r2
bne 2f
strex r5, r1, [r0]
cmp r5, #0
bne 1b
b 4f
2:
clrex
4:
cmp r3, #0
movne r0, #0
bne 5f
3:
mov r0, #1
5:
pop {r4, r5}
bx lr
```

`func_001241A0` (24 bytes) atomically stores 1 through `r0`. It uses `r1` for
the new value, performs `ldrex` into `r2`, performs `strex` with status in
`r12`, and retries from the exclusive load while that status is nonzero. It
then returns with `bx lr`; do not add barriers or a stack frame.

`func_001241B8` (48 bytes) repeatedly exclusive-loads a signed 32-bit state. If
the value is positive, it negates it, attempts the exclusive store using `r3`
as status, retries on store failure, and returns 1 on success. If the loaded
value is zero or negative, it clears the monitor and returns 0. Use `rsb r1,
r1, #0`, direct Boolean immediates, and two `bx lr` return sites. Do not add
memory barriers.

For all three helpers, `ldrex`, `strex`, and `clrex` are architectural
mnemonics; no proprietary synchronization primitive is implied.

## Relocatable implementation and acceptance criteria

Implement the batch in original textual ARM assembly with one executable,
four-byte-aligned function section per symbol. Do not use `.word`, `.inst`, or
another embedded instruction/data directive. None of these helpers requires a
relocation or an executable-address literal.

Acceptance requires all of the following:

- all eleven symbols have ARM mapping symbols and the exact listed sizes;
- the context restore and copy helpers preserve the specified register-list
  choreography;
- the shift and stack-argument helpers preserve their branch/load ordering;
- the exclusive-monitor helpers do not acquire added barriers or calls;
- every function reports 100% through the repository's objdiff pipeline; and
- no ROM-derived byte sequence or generated private artifact enters Git.

## Probe result and provenance

An ignored textual-assembly probe implemented all eleven behaviors using only
the mnemonics and constants stated above. Each independently assembled section
was compared with its corresponding private target section and was exact: 11
of 11 functions and 416 of 416 code bytes.

- Target: `AS_EUR_REV2`, verified code SHA-256
  `b7f9ce60361f3709ed0ce879658afe10a712f7db060640fa72bba826301b7c16`.
- Neutral inventory: `symbols/code.bin.csv`, SHA-256
  `4b7bcc35a838a2d4fe1c0cdbac2ccbe36b4df1ac24b91f1f8660693967c8c2fe`.
- Analysis date: 2026-10-15.
- Analysis tools: GNU Arm objdump, assembler, and objcopy 2.45.1.20251203 from
  Arm GNU Toolchain 15.2.Rel1.
- Method: filter unmatched ARM functions to at most 160 bytes, classify public
  architecture/runtime behavior, independently express candidates as textual
  assembly, assemble them without embedded target words, and compare each
  complete function section against the private target. No leaked source,
  proprietary SDK header, ROM, extracted asset, target instruction dump, or
  target byte sequence is included in this specification.
