# Probe-verified ARM IPC templates 18

## Scope and provenance

- Target: `AS_EUR_REV2`, as independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 inventory, current objdiff report,
  and bounded private-target control/data-flow analysis.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, encoded
  instruction words, private addresses, literal values, assets,
  implementation, or proprietary source are present.

This batch covers 25 previously unspecified and unmatched ARM-state
synchronous IPC wrappers in 11 complete templates, totaling 1,676 code bytes.
TPIDRURO plus 128 and SVC 50 follow public CTR IPC conventions. Unless noted,
an error SVC result is returned unchanged and success returns response word 1.

## Handle-pointer mapped request with byte input/output

`func_002C8E54` and `func_002CA6C0` are 80 bytes and share
`ipc_command_func_002C8E54`. Entry `r0` points to the handle, `r3` is a byte
output pointer, and `stack0` supplies a byte input. Request words are `r2`, the
low byte of `stack0`, `10 | (r2 << 4)`, and `r1`. On success the low byte of
response word 2 is stored through `r3`.

```asm
push {r4, r5, r6, lr}
mov r5, r3
mrc p15, 0, r4, c13, c0, 3
ldr r3, .Lcommand
str r3, [r4, #128]!
str r2, [r4, #4]
ldrb r3, [sp, #16]
strb r3, [r4, #8]
mov r3, #10
orr r2, r3, r2, lsl #4
str r1, [r4, #16]
str r2, [r4, #12]
ldr r0, [r0]
svc #50
ands r1, r0, #0x80000000
bmi .Lreturn
ldrb r0, [r4, #8]
strb r0, [r5]
ldr r0, [r4, #4]
.Lreturn:
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C8E54 */
```

## Handle-pointer two-mapped-buffer request

`func_002C8FB0` and `func_002CA81C` are 80 bytes and share
`ipc_command_func_002C8FB0`. Let `stack0` be the first entry-stack word.
Request words 1 through 6 are `r2`, `stack0`, `10 | (r2 << 4)`, `r1`,
`10 | (stack0 << 4)`, and `r3`.

```asm
push {r4, r5, r6, lr}
ldr r12, [sp, #16]
mrc p15, 0, r4, c13, c0, 3
ldr r5, .Lcommand
str r5, [r4, #128]!
add r6, r4, #4
mov r5, #10
stm r6, {r2, r12}
orr r2, r5, r2, lsl #4
str r1, [r4, #16]
orr r1, r5, r12, lsl #4
add r5, r4, #20
str r2, [r4, #12]
stm r5, {r1, r3}
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C8FB0 */
```

## Handle-pointer byte and descriptor request

`func_002C9260` and `func_002CAACC` are 80 bytes and share
`ipc_command_func_002C9260`. Let `stack0` be the first entry-stack word.
Request word 1 is `r1`, the low byte of word 2 is the low byte of `r2`, word 3
is `stack0`, word 4 is `12 | (stack0 << 4)`, and word 5 is `r3`.

```asm
push {r0, r1, r2, r3, r4, lr}
ldr r2, [sp, #24]
mrc p15, 0, r4, c13, c0, 3
ldr r12, .Lcommand
str r12, [r4, #128]!
add r12, r4, #16
str r1, [r4, #4]
ldrb r1, [sp, #8]
strb r1, [r4, #8]
mov r1, #12
orr r1, r1, r2, lsl #4
str r2, [r4, #12]
stm r12, {r1, r3}
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #16
pop {r4, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C9260 */
```

## Global-handle constant-32 request

These functions are 52 bytes and write constant 32 to request word 1:

- `func_0010986C`: `ipc_command_func_0010986C`, existing
  `ipc_handle_slot_delta`;
- `func_0015F350`: `ipc_command_func_0015F350`, new
  `ipc_handle_slot_iota`;
- `func_001F15A0`: `ipc_command_func_001F15A0`,
  `ipc_handle_slot_iota`.

```asm
push {r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r0, .Lcommand
str r0, [r4, #128]!
mov r0, #32
str r0, [r4, #4]
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, pc}
.size <function>, . - <function>
.Lcommand:     /* per-function command */
.Lhandle_slot: /* delta or iota */
```

## Handle-pointer no-input request with one output

`func_00160078`, `func_001F757C`, and `func_001F7800` are 52 bytes. Their
commands are named after their functions. Entry `r0` points to the handle and
`r1` is an output pointer. No request word beyond the command is written. On
success response word 2 is stored through `r1` and word 1 is returned.

```asm
push {r4, r5, r6, lr}
mov r5, r1
mrc p15, 0, r4, c13, c0, 3
ldr r1, .Lcommand
str r1, [r4, #128]!
ldr r0, [r0]
svc #50
ands r1, r0, #0x80000000
bmi .Lreturn
ldr r0, [r4, #8]
str r0, [r5]
ldr r0, [r4, #4]
.Lreturn:
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand: /* per-function command */
```

## Global-handle halfword request

These 52-byte functions store only the low halfword of entry `r0` into the low
halfword of request word 1 and use existing `ipc_handle_slot_gamma`:

- `func_002C62B0`: `ipc_command_func_002C62B0`;
- `func_002C64F8`: `ipc_command_func_002C64F8`;
- `func_002C6660`: existing `ipc_command_func_00109CB8`.

```asm
push {r0, r4, r5, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r0, .Lcommand
str r0, [r4, #128]!
ldrh r0, [sp]
strh r0, [r4, #4]
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r3, r4, r5, pc}
.size <function>, . - <function>
.Lcommand:     /* named command */
.Lhandle_slot: /* ipc_handle_slot_gamma */
```

## Global-handle static-descriptor word request

`func_00109C64` and `func_00133C68` are 76 bytes, use commands named after
their functions, and share existing `ipc_handle_slot_alpha`. Request words 1
through 5 are `r1`, zero, `r2`, `2 | (r1 << 14)`, and `r0`.

```asm
push {r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r12, .Lcommand
mov r3, #0
str r12, [r4, #128]!
add lr, r4, #4
str r2, [r4, #12]
stm lr, {r1, r3}
orr r1, r3, r1, lsl #14
str r0, [r4, #20]
ldr r0, .Lhandle_slot
orr r1, r1, #2
str r1, [r4, #16]
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, pc}
.size <function>, . - <function>
.Lcommand:     /* per-function command */
.Lhandle_slot: /* ipc_handle_slot_alpha */
```

## Global-handle six-word static-descriptor request

`func_00133E14` and `func_0016511C` are 72 bytes, use commands named after
their functions, and share `ipc_handle_slot_alpha`. Request words 1 through 6
are `r0`, `r2`, zero, `r3`, `2 | (r2 << 14)`, and `r1`.

```asm
push {r4, r5, r6, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r5, .Lcommand
mov r12, #0
str r5, [r4, #128]!
add r6, r4, #4
str r3, [r4, #16]
stm r6, {r0, r2, r12}
orr r0, r12, r2, lsl #14
orr r0, r0, #2
strd r0, [r4, #20]
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand:     /* per-function command */
.Lhandle_slot: /* ipc_handle_slot_alpha */
```

## Global-handle mapped request with one output

`func_001FF984` and `func_0020004C` are 72 bytes and share
`ipc_command_func_001FF984`. Their handles are `ipc_handle_slot_eta` and
`ipc_handle_slot_theta`. Entry `r0` is an output pointer. Request word 1 is
`r2`, word 2 is `12 | (r2 << 4)`, and word 3 is `r1`. On success response word
2 is stored through entry `r0`.

```asm
push {r4, r5, r6, lr}
mov r5, r0
mrc p15, 0, r4, c13, c0, 3
ldr r0, .Lcommand
add r4, r4, #128
stm r4, {r0, r2}
mov r0, #12
orr r0, r0, r2, lsl #4
strd r0, [r4, #8]
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
ands r1, r0, #0x80000000
bmi .Lreturn
ldr r0, [r4, #8]
str r0, [r5]
ldr r0, [r4, #4]
.Lreturn:
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand:     /* ipc_command_func_001FF984 */
.Lhandle_slot: /* eta or theta */
```

## Handle-pointer halfword and mapped request

`func_002C8F64` and `func_002CA7D0` are 72 bytes and share
`ipc_command_func_002C8F64`. The low halfword of entry `r1` is written to the
low halfword of request word 1; word 2 is `r3`, word 3 is
`10 | (r3 << 4)`, and word 4 is `r2`.

```asm
push {r0, r1, r2, r3, r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r1, .Lcommand
str r1, [r4, #128]!
ldrh r1, [sp, #4]
add r12, r4, #12
strh r1, [r4, #4]
mov r1, #10
orr r1, r1, r3, lsl #4
str r3, [r4, #8]
stm r12, {r1, r2}
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #16
pop {r4, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C8F64 */
```

## Handle-pointer mapped request with byte output

`func_002C92E8` and `func_002CAB54` are 72 bytes and share
`ipc_command_func_002C92E8`. Entry `r3` is a byte output pointer. Request words
1 through 3 are `r2`, `10 | (r2 << 4)`, and `r1`. On success the low byte of
response word 2 is stored through `r3`.

```asm
push {r4, r5, r6, lr}
mov r5, r3
mrc p15, 0, r4, c13, c0, 3
ldr r3, .Lcommand
str r3, [r4, #128]!
mov r3, #10
str r2, [r4, #4]
orr r2, r3, r2, lsl #4
str r1, [r4, #12]
str r2, [r4, #8]
ldr r0, [r0]
svc #50
ands r1, r0, #0x80000000
bmi .Lreturn
ldrb r0, [r4, #8]
strb r0, [r5]
ldr r0, [r4, #4]
.Lreturn:
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C92E8 */
```

## Literal layouts, equality, and validation

Handle-pointer templates have one post-body command literal. Global-handle
templates have command then handle. The batch has 37 literal slots forming 25
classes. Six classes reuse prior identities:

- `ipc_handle_slot_delta`, `gamma`, `alpha`, `eta`, and `theta`; and
- `ipc_command_func_00109CB8`.

The 19 new classes include `ipc_handle_slot_iota`, shared by
`func_0015F350` and `func_001F15A0`; all other new classes are commands named
above. Across IPC batches 12, 13, and 15 through 18, 218 slots form exactly 109
value/identity classes. A private-target audit proved a bijection.

The implementation should use 11 textual macros and a neutral manifest with
exactly 25 ARM functions, 1,676 function bytes, 37 literal slots, and 25 batch
classes. Per-template function counts are 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, and
2.

Raw instruction/data directives are forbidden; only named symbolic `.word`
literals are permitted. A deterministic validator must pin source/manifest
hashes and prove one aligned executable section, one correctly sized global
ARM `FUNC`, an ARM mapping symbol, section size equal to function plus pool,
ordered `R_ARM_ABS32` command/handle relocations, exactly 25 undefined identity
symbols, and no other covered relocations. Target generation must extend the
cross-batch guard to 218 slots and 109 classes.

## Probe result

A neutral symbolic ARM probe instantiated every function, with named
zero-valued placeholders only after `.size`. Size-bounded objcopy comparisons
matched all 25 functions and all 1,676 code bytes. A fresh report/spec scan
confirmed ARM mode, unmatched status, and zero overlap at selection time.

No implementation is included.
