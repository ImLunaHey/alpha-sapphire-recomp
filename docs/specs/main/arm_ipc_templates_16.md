# Probe-verified ARM IPC templates 16

## Scope and provenance

- Target: `AS_EUR_REV2`, as independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 inventory, the current local
  objdiff report, and bounded control-flow/data-flow analysis of the private
  executable.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, private addresses, literal values,
  extracted assets, implementation, or proprietary source.

This batch covers 16 previously unspecified and unmatched ARM-state
synchronous IPC wrappers in seven complete templates, totaling 1,540 target
code bytes. TPIDRURO plus 128 and SVC 50 are interpreted according to the
public CTR IPC and `SendSyncRequest` conventions documented by 3dbrew.

Unless stated otherwise, the common result rule returns the SVC result when
its sign bit is set and returns IPC-buffer word 1 otherwise.

## Global-handle request with two descriptors and one output

`func_001FF5F0` and `func_001FFCB8` are ARM-state 120-byte bodies. Both use
`ipc_command_func_001FF5F0`; their handle identities are
`ipc_handle_slot_eta` and `ipc_handle_slot_theta`, respectively.

Let `stack0`, `stack1`, and `stack2` denote the first three entry-stack words.
The request writes entry `r0` to word 1, the low byte of entry `r1` to the low
byte of word 2, `r3` to word 3, `stack2` to word 4,
`10 | (r3 << 4)` to word 5, `r2` to word 6,
`12 | (stack2 << 4)` to word 7, and `stack1` to word 8. The upper bytes of word
2 remain unchanged. On success, response word 2 is stored through `stack0` and
response word 1 is returned. On error, no output store occurs.

```asm
push {r0, r1, r2, r3, r4, r5, r6, lr}
add r4, sp, #32
ldm r4, {r5, r12}
ldr r1, [sp, #40]
mrc p15, 0, r4, c13, c0, 3
ldr r6, .Lcommand
str r6, [r4, #128]!
add r6, r4, #20
str r0, [r4, #4]
ldrb r0, [sp, #4]
strb r0, [r4, #8]
mov r0, #10
str r3, [r4, #12]
orr r0, r0, r3, lsl #4
str r1, [r4, #16]
stm r6, {r0, r2}
mov r0, #12
add r6, r4, #28
orr r0, r0, r1, lsl #4
stm r6, {r0, r12}
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
ands r1, r0, #0x80000000
bmi .Lreturn
ldr r0, [r4, #8]
str r0, [r5]
ldr r0, [r4, #4]
.Lreturn:
add sp, sp, #16
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand:     /* ipc_command_func_001FF5F0 */
.Lhandle_slot: /* eta or theta */
```

## Global-handle request with an auxiliary literal and three descriptors

`func_001FF878` and `func_001FFF40` are ARM-state 116-byte bodies. Both use
`ipc_command_func_001FF878` and the existing opaque
`ipc_aux_literal_class_15`; their handles are `ipc_handle_slot_eta` and
`ipc_handle_slot_theta`, respectively.

Let `stack0`, `stack1`, and `stack2` denote the first three entry-stack words.
The request writes entry `r0` to word 1; the low byte of entry `r1` to the low
byte of word 2; `r3` to word 3; `stack1` to word 4;
`10 | (stack1 << 4)` to word 5; `stack0` to word 6; the named auxiliary literal
to word 7; `stack2` to word 8; `14 | (r3 << 4)` to word 9; and `r2` to word 10.
It applies the common result rule and performs no output store.

```asm
push {r0, r1, r2, r3, r4, r5, r6, lr}
add r4, sp, #32
ldm r4, {r1, r5, r12}
mrc p15, 0, r4, c13, c0, 3
ldr r6, .Lcommand
str r6, [r4, #128]!
add r6, r4, #12
str r0, [r4, #4]
ldrb r0, [sp, #4]
strb r0, [r4, #8]
mov r0, #10
stm r6, {r3, r5}
orr r0, r0, r5, lsl #4
strd r0, [r4, #20]
ldr r0, .Lauxiliary
add r6, r4, #28
stm r6, {r0, r12}
mov r0, #14
add r6, r4, #36
orr r0, r0, r3, lsl #4
stm r6, {r0, r2}
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #16
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand:     /* ipc_command_func_001FF878 */
.Lauxiliary:   /* ipc_aux_literal_class_15 */
.Lhandle_slot: /* eta or theta */
```

## Handle-pointer request with a static descriptor

These ARM-state functions are 76 bytes:

- `func_001F6D94`: `ipc_command_func_001F6D94`;
- `func_001F71B8`: `ipc_command_func_001F71B8`;
- `func_001F7460`: `ipc_command_func_001F7460`.

Entry `r0` points to the service-handle word. Let `stack0`, `stack1`, and
`stack2` be the first three entry-stack words. Request words 1 through 7 are
`r1`, `r2`, `r3`, `stack0`, `stack2`, `2 | (stack2 << 14)`, and `stack1`.
The routine dereferences `r0`, sends the request, and applies the common result
rule.

```asm
push {r4, r5, r6, r7, r8, lr}
add r4, sp, #24
ldm r4, {r5, r7, r12}
mrc p15, 0, r4, c13, c0, 3
ldr r8, .Lcommand
mov r6, #0
str r8, [r4, #128]!
add lr, r4, #4
stm lr, {r1, r2, r3, r5, r12}
orr r1, r6, r12, lsl #14
add r6, r4, #24
orr r1, r1, #2
stm r6, {r1, r7}
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, r5, r6, r7, r8, pc}
.size <function>, . - <function>
.Lcommand: /* named command identity */
```

## Global-handle three-byte request

These ARM-state functions are 72 bytes and all use the existing
`ipc_handle_slot_beta`:

- `func_002DEDFC`: `ipc_command_func_002DEDFC`;
- `func_002DEE4C`: `ipc_command_func_002DEE4C`;
- `func_002DEE9C`: `ipc_command_func_002DEE9C`.

The low bytes of entry `r0`, `r1`, and `r2` are stored into the low bytes of
request words 1, 2, and 3. Other bytes of those words remain unchanged. The
routine sends through the global handle and applies the common result rule.

```asm
push {r0, r1, r2, r4, r5, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r0, .Lcommand
str r0, [r4, #128]!
ldrb r0, [sp]
strb r0, [r4, #4]
ldrb r0, [sp, #4]
strb r0, [r4, #8]
ldrb r0, [sp, #8]
strb r0, [r4, #12]
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #12
pop {r4, r5, pc}
.size <function>, . - <function>
.Lcommand:     /* named command identity */
.Lhandle_slot: /* ipc_handle_slot_beta */
```

## Global-handle request with two mapped descriptors

`func_001FF6AC` and `func_001FFD74` are ARM-state 104-byte bodies. Both use
`ipc_command_func_001FF6AC`; their handles are `ipc_handle_slot_eta` and
`ipc_handle_slot_theta`, respectively.

Let `stack0` and `stack1` be the first two entry-stack words. The request writes
entry `r0` to word 1, the low byte of entry `r1` to the low byte of word 2,
`r3` to word 3, `stack1` to word 4, `10 | (stack1 << 4)` to word 5, `stack0`
to word 6, `14 | (r3 << 4)` to word 7, and `r2` to word 8. It applies the
common result rule.

```asm
push {r0, r1, r2, r3, r4, r5, r6, lr}
add r4, sp, #32
ldm r4, {r1, r12}
mrc p15, 0, r4, c13, c0, 3
ldr r5, .Lcommand
str r5, [r4, #128]!
add r5, r4, #12
str r0, [r4, #4]
ldrb r0, [sp, #4]
strb r0, [r4, #8]
mov r0, #10
stm r5, {r3, r12}
orr r0, r0, r12, lsl #4
strd r0, [r4, #20]
mov r0, #14
add r5, r4, #28
orr r0, r0, r3, lsl #4
stm r5, {r0, r2}
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #16
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand:     /* ipc_command_func_001FF6AC */
.Lhandle_slot: /* eta or theta */
```

## Global-handle fixed-field request with one output

`func_001FF71C` and `func_001FFDE4` are ARM-state 104-byte bodies. Both use
`ipc_command_func_001FF71C`; their handles are `ipc_handle_slot_eta` and
`ipc_handle_slot_theta`, respectively.

Entry `r2` is an output pointer. Let `stack0` and `stack1` be the first two
entry-stack words. The routine defines request word 1 as `r1`, word 2 as `r3`,
word 3 as `stack0`, word 4 as `stack1`, word 5 as 32, word 7 as
`12 | (r1 << 4)`, and word 8 as entry `r0`; word 6 is not defined by this
routine. On success, response word 2 is stored through the entry `r2` pointer
and response word 1 is returned. On error no output store occurs.

```asm
push {r4, r5, r6, lr}
add r4, sp, #16
mov r5, r2
ldm r4, {r2, r12}
mrc p15, 0, r4, c13, c0, 3
ldr r6, .Lcommand
str r6, [r4, #128]!
add lr, r4, #12
stm lr, {r2, r12}
mov r2, #32
add lr, r4, #4
str r2, [r4, #20]
stm lr, {r1, r3}
mov r2, #12
str r0, [r4, #32]
ldr r0, .Lhandle_slot
orr r1, r2, r1, lsl #4
str r1, [r4, #28]
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
.Lcommand:     /* ipc_command_func_001FF71C */
.Lhandle_slot: /* eta or theta */
```

## Handle-pointer request with two halfword outputs

`func_002C943C` and `func_002CAC34` are ARM-state 104-byte bodies. Both use the
existing `ipc_command_func_002C619C`. Entry `r0` points to the service-handle
word.

Let `stack0` through `stack3` denote the first four entry-stack words. Request
word 1 is `r1`, word 2 is `r3`, the low halfword of word 3 is the low halfword
of `stack1`, word 4 is `stack2`, word 5 is `12 | (r3 << 6)`, and word 6 is
`r2`. The upper halfword of word 3 remains unchanged. On success, the low
halfword of response word 2 is stored through `stack0`, the low halfword of
response word 3 is stored through `stack3`, and response word 1 is returned.
No output stores occur on error.

```asm
push {r4, r5, r6, r7, r8, lr}
ldr r5, [sp, #24]
ldr r6, [sp, #36]
ldr r12, [sp, #32]
mrc p15, 0, r4, c13, c0, 3
ldr r7, .Lcommand
str r7, [r4, #128]!
add r8, r4, #4
add r7, r4, #20
stm r8, {r1, r3}
ldrh r1, [sp, #28]
strh r1, [r4, #12]
str r12, [r4, #16]
mov r12, #12
orr r1, r12, r3, lsl #6
stm r7, {r1, r2}
ldr r0, [r0]
svc #50
ands r1, r0, #0x80000000
bmi .Lreturn
ldrh r0, [r4, #8]
strh r0, [r5]
ldrh r0, [r4, #12]
strh r0, [r6]
ldr r0, [r4, #4]
.Lreturn:
pop {r4, r5, r6, r7, r8, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C619C */
```

## Literal equality and deterministic validation

This batch has 29 post-function literal slots forming exactly 15 equality
classes. Five classes reuse prior identities:

- `ipc_handle_slot_eta`, used by `func_001FF5F0`, `func_001FF878`,
  `func_001FF6AC`, and `func_001FF71C`;
- `ipc_handle_slot_theta`, used by the corresponding four paired copies;
- `ipc_aux_literal_class_15`, used by both 116-byte functions;
- `ipc_handle_slot_beta`, used by all three 72-byte functions; and
- `ipc_command_func_002C619C`, used by both final functions.

The ten new classes are the command identities specified above. Across IPC
batches 12, 13, 15, and 16, 157 literal slots form exactly 80 value/identity
classes. A private-target audit verified a bijection: no name denotes two
values and no value has two names.

The implementation should use seven textual macros and a neutral manifest
covering exactly these 16 functions, their ARM mode, sizes, template kinds,
and ordered literal identities. It must enforce template counts 2, 2, 3, 3,
2, 2, and 2; 1,540 function bytes; 29 literal slots; and 15 batch identity
classes.

Raw instruction/data directives (`.inst`, `.long`, `.4byte`, `.byte`,
`.hword`, and `.short`) are forbidden. Only named symbolic `.word` literals
are permitted. A deterministic validator should pin reviewed source and
manifest hashes, then use `readelf` to prove:

- one aligned executable `.text.<function>` section and one global ARM `FUNC`
  symbol of the specified size per entry;
- an ARM mapping symbol at section offset zero;
- section size equals function size plus four bytes per literal slot;
- consecutive `R_ARM_ABS32` relocations at the function boundary exactly
  follow command, optional auxiliary, and optional handle order;
- each of the 15 identities is one global undefined `NOTYPE` symbol; and
- no other relocation occurs in a covered section.

Target generation must extend its cross-batch equality guard to 157 slots and
80 classes before substituting private literal words.

## Probe result

A neutral symbolic ARM assembly probe instantiated all 16 functions. Named
zero-valued placeholders were placed only after each `.size` boundary. GNU
objcopy extraction followed by size-bounded binary comparison matched all 16
complete bodies and all 1,540 code bytes. A fresh current-report and
all-specification scan confirmed every selected function was ARM mode,
unmatched, and non-overlapping at selection time.

No clean-room implementation is included in this analysis document.
