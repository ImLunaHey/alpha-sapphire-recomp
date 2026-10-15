# Probe-verified ARM IPC templates 15

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

This batch covers 23 previously unspecified and unmatched ARM-state
synchronous IPC wrappers in seven complete templates, totaling 1,920 target
code bytes. TPIDRURO plus 128 and SVC 50 are interpreted according to the
public CTR IPC and `SendSyncRequest` conventions documented by 3dbrew.

Unless a template says otherwise, the result rule is: if bit 31 of the SVC
result is set, return that result; otherwise return IPC-buffer word 1. The
exact common tail uses `and`, `cmp`, and `ldrge`.

## Handle-pointer one-word request

These seven functions are ARM-state 44-byte bodies:

- `func_001182D0`
- `func_00119F88`
- `func_0011A120`
- `func_001F7600`
- `func_001F7838`
- `func_002CCBE4`
- `func_002CCD5C`

`r0` points to a service-handle word and `r1` is the request word. The routine
writes the command identity to word 0 and `r1` to word 1, dereferences `r0`,
sends the request, and applies the common result rule.

```asm
push {r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r2, .Lcommand
str r2, [r4, #128]!
str r1, [r4, #4]
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, pc}
.size <function>, . - <function>
.Lcommand: /* named command identity */
```

Command identities:

- `func_001182D0`: `ipc_command_func_001182D0`;
- `func_00119F88` and `func_0011A120`:
  `ipc_command_func_00119F88`;
- `func_001F7600`: `ipc_command_func_001F7600`;
- `func_001F7838`: `ipc_command_func_001F7838`;
- `func_002CCBE4`: `ipc_command_func_002CCBE4`;
- `func_002CCD5C`: the existing batch-12/13 identity
  `ipc_command_func_002C63E4`.

## Thirteen-argument descriptor request

`func_001F6DE4` and `func_001F7208` are ARM-state 140-byte bodies. They use
`ipc_command_func_001F6DE4` and `ipc_command_func_001F7208`, respectively.
`r0` points to a service-handle word.

Number the 32-bit words at the entry stack pointer `stack0`, `stack1`, and so
on. The routine writes request words 1 through 13 as follows:

```text
r1, r2, r3, stack0, stack2, stack4, stack5, stack6, stack8,
0x402 | (stack2 << 14), stack1,
0x802 | (stack8 << 14), stack7
```

It then dereferences the handle pointer and applies the common result rule.
The exact body is:

```asm
push {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
add r4, sp, #44
ldm r4, {r5, r12}
add r4, sp, #68
ldr r10, [sp, #40]
ldm r4, {r6, lr}
add r4, sp, #56
ldm r4, {r7, r8, r11}
mrc p15, 0, r4, c13, c0, 3
ldr r9, .Lcommand
str r9, [r4, #128]!
str r1, [r4, #4]
str r10, [r4, #16]
str r12, [r4, #20]
str r7, [r4, #24]
mov r1, #1024
str r8, [r4, #28]
orr r1, r1, r12, lsl #14
str r11, [r4, #32]
orr r1, r1, #2
str lr, [r4, #36]
str r1, [r4, #40]
mov r1, #2048
orr r1, r1, lr, lsl #14
orr r1, r1, #2
str r5, [r4, #44]
str r1, [r4, #48]
str r6, [r4, #52]
strd r2, [r4, #8]
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
.size <function>, . - <function>
.Lcommand: /* named command identity */
```

## Mixed static and mapped descriptor request

These ARM-state functions are 92 bytes:

- `func_002CCA90`: `ipc_command_func_002CCA90`;
- `func_002CCC14`: `ipc_command_func_002CCC14`;
- `func_002CCCFC`: `ipc_command_func_002CCCFC`.

`r0` points to a service-handle word. Let `stack0` and `stack1` be the first
two entry-stack words. Request words 1 through 7 are `r1`, `r3`, `stack1`,
`0xC02 | (r3 << 14)`, `r2`, `10 | (stack1 << 4)`, and `stack0`. The routine
then dereferences the handle pointer and applies the common result rule.

```asm
push {r4, r5, r6, lr}
add r4, sp, #16
ldm r4, {r5, r12}
mrc p15, 0, r4, c13, c0, 3
ldr r6, .Lcommand
str r6, [r4, #128]!
add lr, r4, #4
stm lr, {r1, r3, r12}
mov r1, #3072
orr r1, r1, r3, lsl #14
add lr, r4, #16
orr r1, r1, #2
stm lr, {r1, r2}
mov r1, #10
add lr, r4, #24
orr r1, r1, r12, lsl #4
stm lr, {r1, r5}
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, r5, r6, pc}
.size <function>, . - <function>
.Lcommand: /* named command identity */
```

## Global-handle request with one output and an auxiliary literal

`func_001FF7E4` and `func_001FFEAC` are ARM-state 136-byte bodies. Both use
`ipc_command_func_001FF7E4` and `ipc_aux_literal_class_15`. Their handles are
`ipc_handle_slot_eta` and `ipc_handle_slot_theta`, respectively.

Let `stack0` through `stack3` denote the first four entry-stack words. The
request defines word 1 as entry `r0`, the low byte of word 2 as the low byte of
entry `r1`, word 3 as `r3`, word 4 as `stack2`, word 5 as
`10 | (r3 << 4)`, word 6 as `r2`, word 7 as the named auxiliary literal, word
8 as `stack3`, word 9 as `12 | (stack2 << 4)`, and word 10 as `stack1`. Bytes
1 through 3 of word 2 are left unchanged. After a successful request, response
word 2 is stored through the pointer in `stack0`, and response word 1 is
returned. On an error result no output store occurs and the error is returned.

```asm
push {r0, r1, r2, r3, r4, r5, r6, r7, r8, lr}
add r4, sp, #48
ldm r4, {r1, r6}
add r4, sp, #40
ldm r4, {r5, r12}
mrc p15, 0, r4, c13, c0, 3
ldr r7, .Lcommand
str r7, [r4, #128]!
add r7, r4, #20
str r0, [r4, #4]
ldrb r0, [sp, #4]
strb r0, [r4, #8]
mov r0, #10
str r3, [r4, #12]
orr r0, r0, r3, lsl #4
str r1, [r4, #16]
stm r7, {r0, r2}
add r7, r4, #28
ldr r0, .Lauxiliary
stm r7, {r0, r6}
mov r0, #12
add r7, r4, #36
orr r0, r0, r1, lsl #4
stm r7, {r0, r12}
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
pop {r4, r5, r6, r7, r8, pc}
.size <function>, . - <function>
.Lcommand:     /* ipc_command_func_001FF7E4 */
.Lauxiliary:   /* ipc_aux_literal_class_15 */
.Lhandle_slot: /* eta or theta */
```

The auxiliary literal is an opaque request value. Its equality is established,
but its private value and higher-level meaning are deliberately unspecified.

## Global-handle request with temporary TLS descriptor state

`func_00126740` and `func_00133D18` are ARM-state 132-byte bodies. Both use
`ipc_handle_slot_alpha`. Their command identities are
`ipc_command_func_00126740` and the existing
`ipc_command_func_002DE6C0`, respectively.

Let `stack0`, `stack1`, and `stack2` be the first three entry-stack words. The
routine saves the two words at TPIDRURO plus 384, temporarily replaces them
with `2 | (stack0 << 14)` and `r3`, sends a global-handle request, and restores
both saved words before testing success. Request word 1 is `r1` and word 2 is
`stack0`. On success it stores response words 2, 3, 4, and 6 through the
pointers supplied in entry `r0`, entry `r2`, `stack1`, and `stack2`, then
returns response word 1. On error it performs none of those output stores and
returns the error.

```asm
push {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
mov r8, r0
mov r9, r2
add r2, sp, #40
ldm r2, {r0, r10, r11}
mrc p15, 0, r4, c13, c0, 3
ldr r12, .Lcommand
mov r2, #0
str r12, [r4, #128]!
str r1, [r4, #4]
str r0, [r4, #8]
mrc p15, 0, r1, c13, c0, 3
add r5, r1, #384
orr r0, r2, r0, lsl #14
orr r0, r0, #2
ldrd r6, [r5]
stm r5, {r0, r3}
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
ands r1, r0, #0x80000000
strd r6, [r5]
bmi .Lreturn
ldr r0, [r4, #8]
str r0, [r8]
ldr r0, [r4, #12]
str r0, [r9]
ldr r0, [r4, #16]
str r0, [r10]
ldr r0, [r4, #24]
str r0, [r11]
ldr r0, [r4, #4]
.Lreturn:
pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
.size <function>, . - <function>
.Lcommand:     /* named command identity */
.Lhandle_slot: /* ipc_handle_slot_alpha */
```

## Global-handle byte-and-halfword request

These ARM-state functions are 88 bytes and all use the existing
`ipc_handle_slot_beta`:

- `func_002DEBBC`: `ipc_command_func_002DEBBC`;
- `func_002DEC68`: `ipc_command_func_002DEC68`;
- `func_002DECC8`: `ipc_command_func_002DECC8`.

The routine writes the low byte of entry `r0` to the low byte of request word
1, then writes the low halfwords of entry `r1`, `r2`, `r3`, and the first
entry-stack word to the low halfwords of request words 2 through 5. Unwritten
bytes remain unchanged. It sends through the global handle and applies the
common result rule.

```asm
push {r0, r1, r2, r3, r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r0, .Lcommand
str r0, [r4, #128]!
ldrb r0, [sp]
strb r0, [r4, #4]
ldrh r0, [sp, #4]
strh r0, [r4, #8]
ldrh r0, [sp, #8]
strh r0, [r4, #12]
ldrh r0, [sp, #12]
strh r0, [r4, #16]
ldrh r0, [sp, #24]
strh r0, [r4, #20]
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #16
pop {r4, pc}
.size <function>, . - <function>
.Lcommand:     /* named command identity */
.Lhandle_slot: /* ipc_handle_slot_beta */
```

## Global-handle mapped-buffer request

These four functions are ARM-state 64-byte bodies:

- `func_001FB4CC`: `ipc_command_func_001FB4CC`,
  `ipc_handle_slot_epsilon`;
- `func_001FFA44`: `ipc_command_func_001FFA44`,
  `ipc_handle_slot_eta`;
- `func_0020010C`: `ipc_command_func_001FFA44`,
  `ipc_handle_slot_theta`;
- `func_00202E40`: `ipc_command_func_00202E40`,
  `ipc_handle_slot_zeta`.

Entry `r0` is a pointer-shaped payload value and `r1` is a 32-bit size/value.
The request writes `r1` to word 1, `10 | (r1 << 4)` to word 2, and entry `r0`
to word 3. It sends through the named global handle and applies the common
result rule.

```asm
push {r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r2, .Lcommand
str r2, [r4, #128]!
mov r2, #10
str r1, [r4, #4]
str r0, [r4, #12]
ldr r0, .Lhandle_slot
orr r1, r2, r1, lsl #4
str r1, [r4, #8]
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, pc}
.size <function>, . - <function>
.Lcommand:     /* named command identity */
.Lhandle_slot: /* named handle identity */
```

## Literal equality and deterministic validation

This batch contains 36 post-function literal slots forming exactly 27 equality
classes. Six classes reuse earlier identities:

- commands `ipc_command_func_002C63E4` and
  `ipc_command_func_002DE6C0`;
- handles `ipc_handle_slot_alpha`, `ipc_handle_slot_beta`,
  `ipc_handle_slot_epsilon`, and `ipc_handle_slot_zeta`.

The remaining 21 classes are new. Notably, `ipc_handle_slot_eta` is shared by
`func_001FF7E4` and `func_001FFA44`, while `ipc_handle_slot_theta` is shared by
`func_001FFEAC` and `func_0020010C`. Across IPC batches 12, 13, and 15, 128
literal slots form exactly 70 value/identity classes. A private-target audit
verified a bijection: no name denotes two values and no value has two names.

The implementation should use seven textual macros and a neutral manifest
containing exactly the 23 functions, their ARM mode, sizes, template kinds,
and the literal identities listed above. It must enforce per-template counts
7, 2, 3, 2, 2, 3, and 4; 1,920 function bytes; 36 literal slots; and 27 batch
identity classes.

Raw instruction/data directives (`.inst`, `.long`, `.4byte`, `.byte`,
`.hword`, and `.short`) are forbidden. Only named symbolic `.word` literal
entries are permitted. A deterministic validator should pin reviewed source
and manifest hashes, then use `readelf` to prove:

- one aligned executable `.text.<function>` section and one global ARM `FUNC`
  symbol of the specified size per entry;
- an ARM mapping symbol at section offset zero;
- section size equals function size plus four bytes per literal slot;
- consecutive `R_ARM_ABS32` relocations at the function boundary name exactly
  the manifest identities in command/auxiliary/handle order;
- each of the 27 identities is one global undefined `NOTYPE` symbol; and
- no other relocations occur in the covered sections.

Target generation must extend the cross-batch bijection audit to the totals
128 literal slots and 70 classes before substituting private literal words.

## Probe result

A neutral symbolic ARM assembly probe instantiated all 23 functions. Named
zero-valued placeholders were placed only after each `.size` boundary. GNU
objcopy extraction followed by size-bounded binary comparison matched all 23
complete bodies and all 1,920 code bytes. A fresh scan of the current report
and every existing specification confirmed that all selected functions were
ARM mode, unmatched, and non-overlapping at selection time.

No clean-room implementation is included in this analysis document.
