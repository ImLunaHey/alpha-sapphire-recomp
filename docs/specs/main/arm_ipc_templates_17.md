# Probe-verified ARM IPC templates 17

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

This batch covers 18 previously unspecified and unmatched ARM-state
synchronous IPC wrappers in nine complete templates, totaling 1,608 target
code bytes. TPIDRURO plus 128 and SVC 50 are interpreted according to public
CTR IPC and `SendSyncRequest` conventions.

## Handle-pointer mapped request with three outputs

`func_002C8EA8` and `func_002CA714` are ARM-state 100-byte bodies and share
`ipc_command_func_002C8EA8`. Entry `r0` points to the service-handle word and
entry `r3` is the first output pointer. Let `stack0`, `stack1`, and `stack2`
denote the first three entry-stack words. The request writes `r2` to word 1,
the low byte of `stack0` to the low byte of word 2,
`10 | (r2 << 4)` to word 3, and `r1` to word 4. On success, the low byte of
response word 2 is stored through `r3`, response word 3 through `stack1`, and
the low byte of response word 4 through `stack2`; response word 1 is returned.
No output occurs on error.

```asm
push {r4, r5, r6, r7, r8, lr}
mov r5, r3
ldrd r6, [sp, #28]
mrc p15, 0, r4, c13, c0, 3
ldr r3, .Lcommand
str r3, [r4, #128]!
str r2, [r4, #4]
ldrb r3, [sp, #24]
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
ldr r0, [r4, #12]
str r0, [r6]
ldrb r0, [r4, #16]
strb r0, [r7]
ldr r0, [r4, #4]
.Lreturn:
pop {r4, r5, r6, r7, r8, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C8EA8 */
```

## Handle-pointer descriptor request with two word outputs

`func_002C8D60` and `func_002CA5CC` are ARM-state 96-byte bodies and share
`ipc_command_func_002C8D60`. Entry `r0` points to the handle. Let `stack0`
through `stack3` be the first four entry-stack words. Request words 1 through 6
are `r1`, `r2`, `r3`, `stack1`, `12 | (stack1 << 4)`, and `stack0`. On success,
response words 2 and 3 are stored through `stack2` and `stack3`; response word
1 is returned. No output occurs on error.

```asm
push {r4, r5, r6, r7, r8, lr}
add r4, sp, #32
ldm r4, {r5, r6}
add r4, sp, #24
ldm r4, {r7, r12}
mrc p15, 0, r4, c13, c0, 3
ldr r8, .Lcommand
str r8, [r4, #128]!
add lr, r4, #4
stm lr, {r1, r2, r3, r12}
mov r1, #12
add lr, r4, #20
orr r1, r1, r12, lsl #4
stm lr, {r1, r7}
ldr r0, [r0]
svc #50
ands r1, r0, #0x80000000
bmi .Lreturn
ldr r0, [r4, #8]
str r0, [r5]
ldr r0, [r4, #12]
str r0, [r6]
ldr r0, [r4, #4]
.Lreturn:
pop {r4, r5, r6, r7, r8, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C8D60 */
```

## Handle-pointer mapped request with mixed-width outputs

`func_002C902C` and `func_002CA898` are ARM-state 92-byte bodies and share
`ipc_command_func_002C902C`. Entry `r0` points to the handle and `r3` is a byte
output pointer. Let `stack0` and `stack1` be the first two entry-stack words.
The request writes `r2`, `10 | (r2 << 4)`, and `r1` to words 1 through 3. On
success, the low byte of response word 2 is stored through `r3`, response word
3 through `stack0`, and the low byte of response word 4 through `stack1`.

```asm
push {r4, r5, r6, r7, r8, lr}
mov r5, r3
ldrd r6, [sp, #24]
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
ldr r0, [r4, #12]
str r0, [r6]
ldrb r0, [r4, #16]
strb r0, [r7]
ldr r0, [r4, #4]
.Lreturn:
pop {r4, r5, r6, r7, r8, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C902C */
```

## Handle-pointer request with two byte inputs and one byte output

`func_002C908C` and `func_002CA8F8` are ARM-state 92-byte bodies and share
`ipc_command_func_002C908C`. Entry `r0` points to the handle. Let `stack0` be a
byte output pointer and `stack1` supply a byte input. The request writes `r2`
to word 1, the low byte of `r3` to word 2, the low byte of `stack1` to word 3,
`10 | (r2 << 4)` to word 4, and `r1` to word 5. On success, the low byte of
response word 2 is stored through `stack0` and response word 1 is returned.

```asm
push {r0, r1, r2, r3, r4, r5, r6, lr}
ldr r5, [sp, #32]
mrc p15, 0, r4, c13, c0, 3
ldr r3, .Lcommand
str r3, [r4, #128]!
str r2, [r4, #4]
ldrb r3, [sp, #12]
strb r3, [r4, #8]
ldrb r3, [sp, #36]
strb r3, [r4, #12]
mov r3, #10
orr r2, r3, r2, lsl #4
str r1, [r4, #20]
str r2, [r4, #16]
ldr r0, [r0]
svc #50
ands r1, r0, #0x80000000
bmi .Lreturn
ldrb r0, [r4, #8]
strb r0, [r5]
ldr r0, [r4, #4]
.Lreturn:
add sp, sp, #16
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand: /* ipc_command_func_002C908C */
```

## Handle-pointer static-descriptor request with one output

`func_002E40B0` and `func_002E42FC` are ARM-state 92-byte bodies. They use
`ipc_command_func_002E40B0` and `ipc_command_func_002E42FC`, respectively.
Entry `r0` points to the handle and entry `r1` is the output pointer. Let
`stack0` be the first entry-stack word. Request word 1 is `r2`, word 2 is
`stack0`, word 3 is 32, word 5 is `2 | (stack0 << 14)`, and word 6 is `r3`;
word 4 is not defined. On success response word 2 is stored through entry `r1`.

```asm
push {r4, r5, r6, lr}
mov r5, r1
ldr r1, [sp, #16]
mrc p15, 0, r4, c13, c0, 3
ldr r6, .Lcommand
mov r12, #0
str r6, [r4, #128]!
add lr, r4, #8
str r2, [r4, #4]
mov r2, #32
stm lr, {r1, r2}
orr r1, r12, r1, lsl #14
add r12, r4, #20
orr r1, r1, #2
stm r12, {r1, r3}
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
.Lcommand: /* per-function command identity */
```

## Global-handle words, byte, and mapped descriptor request

`func_001FFA8C` and `func_00200154` are ARM-state 84-byte bodies. Both use
`ipc_command_func_001FFA8C`; their handles are `ipc_handle_slot_eta` and
`ipc_handle_slot_theta`, respectively. Let `stack0` be the first entry-stack
word. Request words 1 and 2 are entry `r0` and `r1`; the low byte of word 3 is
the low byte of `r2`; word 4 is `stack0`; word 5 is
`10 | (stack0 << 4)`; and word 6 is `r3`. The common result rule applies.

```asm
push {r0, r1, r2, r3, r4, lr}
ldr r2, [sp, #24]
mrc p15, 0, r4, c13, c0, 3
ldr r12, .Lcommand
str r12, [r4, #128]!
add r12, r4, #20
strd r0, [r4, #4]
ldrb r0, [sp, #8]
strb r0, [r4, #12]
mov r0, #10
orr r0, r0, r2, lsl #4
str r2, [r4, #16]
stm r12, {r0, r3}
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #16
pop {r4, pc}
.size <function>, . - <function>
.Lcommand:     /* ipc_command_func_001FFA8C */
.Lhandle_slot: /* eta or theta */
```

## Global-handle two-descriptor request

`func_001FFB30` and `func_002001F8` are ARM-state 84-byte bodies. Both use
`ipc_command_func_001FFB30`; their handles are `ipc_handle_slot_eta` and
`ipc_handle_slot_theta`. Let `stack0` be the first entry-stack word. Request
words 1 through 7 are `r1`, `r2`, `stack0`, `10 | (stack0 << 4)`, `r3`,
`12 | (r1 << 4)`, and `r0`. The common result rule applies.

```asm
push {r4, r5, r6, lr}
ldr r12, [sp, #16]
mrc p15, 0, r4, c13, c0, 3
ldr r5, .Lcommand
str r5, [r4, #128]!
add r6, r4, #4
stm r6, {r1, r2, r12}
mov r2, #10
orr r2, r2, r12, lsl #4
strd r2, [r4, #16]
str r0, [r4, #28]
ldr r0, .Lhandle_slot
mov r2, #12
orr r1, r2, r1, lsl #4
str r1, [r4, #24]
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand:     /* ipc_command_func_001FFB30 */
.Lhandle_slot: /* eta or theta */
```

## Handle-pointer halfword-input request with one output

`func_002C9138` and `func_002CA9A4` are ARM-state 84-byte bodies and share
`ipc_command_func_002C9138`. Entry `r0` points to the handle and `stack0` is an
output pointer. The low halfword of entry `r1` is stored to the low halfword of
request word 1; word 2 is `r3`, word 3 is `12 | (r3 << 4)`, and word 4 is
`r2`. On success response word 2 is stored through `stack0` and response word
1 is returned.

```asm
push {r0, r1, r2, r3, r4, r5, r6, lr}
ldr r5, [sp, #32]
mrc p15, 0, r4, c13, c0, 3
ldr r1, .Lcommand
str r1, [r4, #128]!
ldrh r1, [sp, #4]
add r6, r4, #12
strh r1, [r4, #4]
mov r1, #12
orr r1, r1, r3, lsl #4
str r3, [r4, #8]
stm r6, {r1, r2}
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
.Lcommand: /* ipc_command_func_002C9138 */
```

## Global-handle fixed-field mapped request

`func_001FF78C` and `func_001FFE54` are ARM-state 80-byte bodies. Both use
`ipc_command_func_001FF78C`; their handles are `ipc_handle_slot_eta` and
`ipc_handle_slot_theta`. Let `stack0` be the first entry-stack word. Request
words 1 through 5 are `r1`, `r2`, `r3`, `stack0`, and 32; word 6 is not
defined; word 7 is `10 | (r1 << 4)`; and word 8 is `r0`. The common result
rule applies.

```asm
push {r4, r5, r6, lr}
ldr r12, [sp, #16]
mrc p15, 0, r4, c13, c0, 3
ldr r5, .Lcommand
str r5, [r4, #128]!
add r6, r4, #4
stm r6, {r1, r2, r3, r12}
mov r2, #32
str r2, [r4, #20]
str r0, [r4, #32]
ldr r0, .Lhandle_slot
mov r2, #10
orr r1, r2, r1, lsl #4
str r1, [r4, #28]
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand:     /* ipc_command_func_001FF78C */
.Lhandle_slot: /* eta or theta */
```

## Literal layouts and equality classes

Every handle-pointer template has one post-body command literal. Each global-
handle template has consecutive command and handle literals. Thus this batch
has 24 post-body slots forming exactly 12 equality classes.

Two classes reuse prior identities: `ipc_handle_slot_eta` is used by all three
first copies of the global-handle pairs, and `ipc_handle_slot_theta` by all
three second copies. The ten new classes are:

- one shared command class for each of the eight paired templates other than
  the two static-descriptor functions; and
- distinct command classes for `func_002E40B0` and `func_002E42FC`.

The exact new identities are those named in the sections above. Across IPC
batches 12, 13, 15, 16, and 17, 181 literal slots form exactly 90
value/identity classes. A private-target audit proved a bijection: no identity
names two values and no value has two identities.

The implementation should use nine textual macros and a neutral manifest
covering exactly these 18 functions, their ARM mode, sizes, template kinds,
and ordered identities. Enforce two functions per template, 1,608 function
bytes, 24 literal slots, and 12 batch identity classes.

Raw instruction/data directives (`.inst`, `.long`, `.4byte`, `.byte`,
`.hword`, and `.short`) are forbidden. Only named `.word` literal entries are
permitted. A deterministic validator should pin reviewed source/manifest
hashes and prove with `readelf`:

- one aligned executable `.text.<function>` section and one global ARM `FUNC`
  symbol of the specified size per entry;
- an ARM mapping symbol at offset zero;
- section size is function size plus four bytes for handle-pointer templates
  or plus eight bytes for global-handle templates;
- ordered `R_ARM_ABS32` relocations at the function boundary name the command,
  then handle when present;
- each of the 12 identities is one global undefined `NOTYPE` symbol; and
- no other relocation occurs in a covered section.

Target generation must extend its cross-batch identity guard to 181 slots and
90 classes before substituting private literal words.

## Probe result

A neutral symbolic ARM assembly probe instantiated all 18 functions. Named
zero-valued placeholders were emitted only after each `.size` boundary. GNU
objcopy extraction followed by size-bounded binary comparison matched all 18
complete bodies and all 1,608 code bytes. A fresh report/specification scan
confirmed every selected function was ARM mode, unmatched, and non-overlapping
at selection time.

No clean-room implementation is included in this analysis document.
