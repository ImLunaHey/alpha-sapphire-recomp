# Probe-verified duplicate ARM IPC and table templates 12

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-15.
- Evidence: the evidence-gated Ghidra 12.0.2 function inventory plus local
  control-flow and data-flow analysis of the private target executable.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document records behavior
  and neutral ABI/code-generation facts. It contains no target bytes, encoded
  instruction words, private addresses, extracted assets, or proprietary
  source.

This bounded batch covers every remaining unmatched and previously unspecified
identical-body group whose aggregate payoff is at least 512 bytes and whose
members are 16 through 256 bytes. It contains 28 ARM functions in three groups,
for 1,960 target code bytes.

## One-byte IPC request template

Every function below is 52 bytes and has the same complete code body:

- `func_00109CB8`
- `func_001103C0`
- `func_001267CC`
- `func_001269A8`
- `func_00126A20`
- `func_002C6104`
- `func_002C6378`
- `func_002C63E4`
- `func_002C64BC`
- `func_002C65E8`
- `func_002C6624`
- `func_002DE708`
- `func_002DE884`
- `func_002DEA44`

Treat each function as having its own named `ipc_command_<function>` identity.
The service-handle-slot identities are shared as follows:

- `ipc_handle_slot_alpha`: `func_00109CB8`, `func_001103C0`
- `ipc_handle_slot_beta`: `func_001267CC`, `func_001269A8`,
  `func_00126A20`, `func_002DE708`, `func_002DE884`, `func_002DEA44`
- `ipc_handle_slot_gamma`: all six listed `func_002C...` functions

The routine accepts one machine word in `r0`, but only its low byte is
observed. It obtains the thread-local IPC buffer base with CP15 TPIDRURO, writes
its named command identity to buffer word 0 and the low argument byte to the
low byte of buffer word 1, loads the service handle through its named handle
slot, and issues synchronous-request SVC 50. If the SVC result has its sign bit
set, that result is returned. Otherwise, buffer word 1 is returned as the
service response. The command and handle identities occupy consecutive literal
entries immediately after the inventoried function interval, in that order;
their values are intentionally outside this specification.

Exact semantic ARM template (`<command>` and `<handle-slot>` name only the two
post-function literal identities):

```asm
push {r0, r4, r5, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r0, .Lcommand
str r0, [r4, #128]!
ldrb r0, [sp]
strb r0, [r4, #4]
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r3, r4, r5, pc}
.size <function>, . - <function>
.Lcommand:     /* named <command> literal identity */
.Lhandle_slot: /* named <handle-slot> literal identity */
```

Preserve the pre-indexed TLS-buffer store, byte loads/stores, sign-bit test,
conditional response load, and unusual discard restore into `r3` exactly.

## Two-byte IPC request template

Every function below is 64 bytes and has the same complete code body. Each has
its own `ipc_command_<function>` identity and all use `ipc_handle_slot_beta`.

- `func_002DE630`
- `func_002DE678`
- `func_002DE6C0`
- `func_002DE744`
- `func_002DE78C`
- `func_002DE83C`
- `func_002DE8F0`
- `func_002DE938`
- `func_002DE980`
- `func_002DEB2C`
- `func_002DEB74`

This is the two-argument counterpart of the preceding template. Only the low
byte of `r0` and the low byte of `r1` are observed. They are stored into the low
bytes of IPC-buffer words 1 and 2 respectively. Command dispatch and return
selection have the same semantics. Its two named literal identities likewise
follow the inventoried interval and are not included here as values.

```asm
push {r0, r1, r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r0, .Lcommand
str r0, [r4, #128]!
ldrb r0, [sp]
strb r0, [r4, #4]
ldrb r0, [sp, #4]
strb r0, [r4, #8]
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #8
pop {r4, pc}
.size <function>, . - <function>
.Lcommand:     /* named <command> literal identity */
.Lhandle_slot: /* named ipc_handle_slot_beta literal identity */
```

## Table-driven state initializer template

The following three functions are ARM-state, 176-byte bodies and are identical
over their complete inventoried intervals:

- `func_001B2D70`
- `func_001B9370`
- `func_001BF970`

This routine has a nonstandard internal interface: `r0` is a writable state
pointer and `r4` is an integer selector. It returns through `lr` and clobbers
`r4` through `r11`. Each copy uses an identical private replica of six immutable
byte-table identities: `selector_shift`, `selector_variant`, `source16`,
`base16`, `source64`, and `base64`. Their content is outside this code-only
specification.

Clamp the selector to the inclusive range 12 through 52 and store it as a
32-bit value at state offset 72. Let `variant` be
`selector_variant[selector]` and `shift` be
`selector_shift[selector] + 8`. For indices 0 through 15, write a 32-bit value
at state offset `376 + 4 * index` equal to
`base16[index] | (source16[variant * 16 + index] << shift)`. Then subtract two
from `shift`. For indices 0 through 63, write the analogous value at state
offset `120 + 4 * index` using `base64` and the selected 64-byte `source64`
block. Finally, write byte value 9 at state offsets 81, 82, 83, 84, 88, 96,
104, and 112. All table bytes are zero-extended before the shift and OR.

Exact semantic ARM template; the four PC-relative base calculations in each
loop name the corresponding table identities described above:

```asm
cmp r4, #12
movlt r4, #12
cmp r4, #52
movgt r4, #52
str r4, [r0, #72]
sub r5, pc, #136       /* selector_shift */
ldrb r6, [r5, r4]
add r6, r6, #8
sub r5, pc, #94        /* selector_variant */
ldrb r5, [r5, r4]
sub r4, pc, #268       /* source16 */
add r4, r4, r5, lsl #4
sub r7, pc, #180       /* base16 */
add r8, r0, #376
mov r9, #16
.Lloop16:
ldrb r10, [r4], #1
ldrb r11, [r7], #1
orr r11, r11, r10, lsl r6
str r11, [r8], #4
subs r9, r9, #1
bne .Lloop16
sub r6, r6, #2
sub r4, pc, #764       /* source64 */
add r4, r4, r5, lsl #6
sub r7, pc, #388       /* base64 */
add r8, r0, #120
mov r9, #64
.Lloop64:
ldrb r10, [r4], #1
ldrb r11, [r7], #1
orr r11, r11, r10, lsl r6
str r11, [r8], #4
subs r9, r9, #1
bne .Lloop64
add r4, r0, #80
mov r5, #9
strb r5, [r4, #1]
strb r5, [r4, #2]
strb r5, [r4, #3]
strb r5, [r4, #4]
strb r5, [r4, #8]
strb r5, [r4, #16]
strb r5, [r4, #24]
strb r5, [r4, #32]
mov pc, lr
```

## Probe result

A neutral symbolic ARM assembly probe instantiated every listed function. For
the IPC templates, zero-valued placeholder literal identities were placed
after each function solely to fix the documented PC-relative layout; those
literal entries are outside the compared function intervals. Every one of the
28 complete probe bodies matched its corresponding complete target interval.
An independent inventory scan confirmed that all members are ARM mode, absent
from earlier specifications, and not already reported as exact matches. The
three table-driven copies also reference byte-identical table replicas, though
no table content is reproduced here.

No clean-room implementation is included in this analysis document.
