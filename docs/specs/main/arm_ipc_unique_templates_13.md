# Probe-verified ARM IPC templates 13

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function inventory plus bounded
  local control-flow and data-flow analysis of the private target executable.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document records behavior
  and neutral ABI/code-generation facts. It contains no target bytes, encoded
  instruction words, private addresses, command values, extracted assets, or
  proprietary source.

This batch covers 29 previously unspecified, unmatched ARM-state synchronous
IPC wrappers in five complete templates, totaling 1,916 target code bytes.
The interpretation of TPIDRURO plus 128 as the per-thread command buffer and
SVC 50 as `SendSyncRequest` follows the public CTR system-call and IPC
conventions documented by 3dbrew. Command identities below are deliberately
symbolic; their values are outside this specification.

All five templates use the same result rule. Let `result` be the value returned
by SVC 50. If bit 31 of `result` is set, return `result`; otherwise return IPC
buffer word 1. The exact instruction spelling implements this as an `and`, a
comparison with zero, and a conditional `ldrge`.

## One-word request through a global handle

The following eight functions are complete 48-byte bodies:

- `func_00109CF4`
- `func_0010F864`
- `func_0011B9B8`
- `func_00133E94`
- `func_00133ECC`
- `func_001651B8`
- `func_001FB580`
- `func_00202E88`

Each accepts one 32-bit argument in `r0`, writes its named command identity to
IPC word 0 and the argument to IPC word 1, loads a service handle through a
named global handle slot, sends the request, and applies the common result
rule. Command identities normally use `ipc_command_<function>`. Two
cross-function equalities are intentional: `func_00109CF4` uses the existing
`ipc_command_func_002C63E4` identity from batch 12, and `func_001FB580` uses
`ipc_command_func_00133E94`. Every other function in this template uses its
own function-named command identity.

Handle-slot identities are:

- `ipc_handle_slot_alpha`: `func_00109CF4`, `func_0011B9B8`,
  `func_00133E94`, `func_00133ECC`, and `func_001651B8`. This is the same
  neutral identity already specified under that name in batch 12.
- `ipc_handle_slot_delta`: `func_0010F864`.
- `ipc_handle_slot_epsilon`: `func_001FB580`.
- `ipc_handle_slot_zeta`: `func_00202E88`.

Exact semantic ARM template:

```asm
push {r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r1, .Lcommand
str r1, [r4, #128]!
str r0, [r4, #4]
ldr r0, .Lhandle_slot
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, pc}
.size <function>, . - <function>
.Lcommand:     /* named command identity */
.Lhandle_slot: /* named handle-slot identity */
```

The two literal entries are consecutive and immediately follow the function
interval, in command-then-handle order.

## Six-word mixed-width request through a global handle

The following five functions are complete 84-byte bodies and all use the
existing `ipc_handle_slot_gamma` identity:

- `func_002C6140`
- `func_002C619C`
- `func_002C61F8`
- `func_002C6254`
- `func_002C62EC`

Each command identity is named `ipc_command_<function>`. At entry, call the
register arguments `arg0` through `arg3`, and call the first stack argument
`arg4`. The request writes:

- word 0: the named command identity;
- word 1: `arg1`;
- word 2: `arg2`;
- low halfword of word 3: low halfword of `arg3`;
- low halfword of word 4: low halfword of `arg4`;
- word 5: zero;
- word 6: `arg0`.

The two halfword stores do not define the upper halfwords of their destination
words. The routine then loads the handle through `ipc_handle_slot_gamma`, sends
the request, and applies the common result rule.

```asm
push {r0, r1, r2, r3, r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr ip, .Lcommand
mov r3, #0
str ip, [r4, #128]!
add lr, r4, #4
stm lr, {r1, r2}
ldrh r1, [sp, #12]
strh r1, [r4, #12]
ldrh r1, [sp, #24]
strh r1, [r4, #16]
str r0, [r4, #24]
ldr r0, .Lhandle_slot
str r3, [r4, #20]
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #16
pop {r4, pc}
.size <function>, . - <function>
.Lcommand:     /* named command identity */
.Lhandle_slot: /* ipc_handle_slot_gamma */
```

The command and handle literal entries are consecutive immediately after the
function interval.

## Handle-pointer request with one word and one byte

The following six functions are complete 72-byte bodies:

- `func_002C8DC4`
- `func_002C90EC`
- `func_002C9190`
- `func_002CA630`
- `func_002CA958`
- `func_002CA9FC`

At entry, `r0` points to the service-handle word, `r1` is a pointer-shaped
payload value, `r2` is a 32-bit size/value, and only the low byte of `r3` is
observed. The request writes the named command identity to word 0, `r2` to
word 1, the low byte of `r3` to the low byte of word 2, the public CTR
descriptor-shaped value `10 | (r2 << 4)` to word 3, and `r1` to word 4. The
upper three bytes of word 2 are not defined by this routine. It dereferences
`r0` for the handle, sends the request, and applies the common result rule.

```asm
push {r0, r1, r2, r3, r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r3, .Lcommand
str r3, [r4, #128]!
str r2, [r4, #4]
ldrb r3, [sp, #12]
strb r3, [r4, #8]
mov r3, #10
orr r2, r3, r2, lsl #4
str r1, [r4, #16]
str r2, [r4, #12]
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #16
pop {r4, pc}
.size <function>, . - <function>
.Lcommand: /* named command identity */
```

One command literal entry immediately follows each function interval. The
identity pairs are:

- `func_002C8DC4` and `func_002CA630`: `ipc_command_func_002C8DC4`;
- `func_002C90EC` and `func_002CA958`: `ipc_command_func_002C90EC`;
- `func_002C9190` and `func_002CA9FC`: `ipc_command_func_002C9190`.

## Handle-pointer request with one word

The following six functions are complete 60-byte bodies:

- `func_002C8D20`
- `func_002C9220`
- `func_002C93A8`
- `func_002CA58C`
- `func_002CAA8C`
- `func_002CABA0`

At entry, `r0` points to the service-handle word, `r1` is a pointer-shaped
payload value, and `r2` is a 32-bit size/value. The request writes the named
command identity to word 0, `r2` to word 1, `10 | (r2 << 4)` to word 2, and
`r1` to word 3. It dereferences `r0` for the handle, sends the request, and
applies the common result rule.

```asm
push {r4, lr}
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
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, pc}
.size <function>, . - <function>
.Lcommand: /* named command identity */
```

One command literal entry immediately follows each function interval. The
identity pairs are:

- `func_002C8D20` and `func_002CA58C`: `ipc_command_func_002C8D20`;
- `func_002C9220` and `func_002CAA8C`: `ipc_command_func_002C9220`;
- `func_002C93A8` and `func_002CABA0`: `ipc_command_func_002C93A8`.

## Handle-pointer request with one word and two bytes

The following four functions are complete 80-byte bodies:

- `func_002C8F10`
- `func_002C93E8`
- `func_002CA77C`
- `func_002CABE0`

At entry, `r0` points to the service-handle word, `r1` is a pointer-shaped
payload value, `r2` is a 32-bit size/value, the low byte of `r3` is the first
byte argument, and the low byte of the first stack argument is the second byte
argument. The request writes the command to word 0, `r2` to word 1, the first
byte to the low byte of word 2, the second byte to the low byte of word 3,
`10 | (r2 << 4)` to word 4, and `r1` to word 5. The other bytes of words 2 and
3 are not defined by this routine. It dereferences `r0` for the handle, sends
the request, and applies the common result rule.

```asm
push {r0, r1, r2, r3, r4, lr}
mrc p15, 0, r4, c13, c0, 3
ldr r3, .Lcommand
str r3, [r4, #128]!
str r2, [r4, #4]
ldrb r3, [sp, #12]
strb r3, [r4, #8]
ldrb r3, [sp, #24]
strb r3, [r4, #12]
mov r3, #10
orr r2, r3, r2, lsl #4
str r1, [r4, #20]
str r2, [r4, #16]
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
add sp, sp, #16
pop {r4, pc}
.size <function>, . - <function>
.Lcommand: /* named command identity */
```

One command literal entry immediately follows each function interval. The
identity pairs are:

- `func_002C8F10` and `func_002CA77C`: `ipc_command_func_002C8F10`;
- `func_002C93E8` and `func_002CABE0`: `ipc_command_func_002C93E8`.

## Deterministic implementation and validator requirements

The clean-room implementation should use five textual macros, one invocation
per listed function, and a neutral JSON manifest. The manifest must record
exactly 29 unique names, ARM mode, the template kind, the function size, the
command identity assigned above, and the handle identity where applicable. It
must enforce the cardinalities 8, 5, 6, 6, and 4 and a total of 1,916 function
bytes.

Raw instruction/data directives (`.inst`, `.long`, `.4byte`, `.byte`,
`.hword`, or `.short`) are forbidden. The only `.word` directives permitted in
the implementation are the named command and handle identities described here.
The validator should pin reviewed source and manifest hashes and inspect the
linked relocatable object with `readelf`:

- every function owns one aligned executable `.text.<function>` section;
- the symbol is global `FUNC`, begins at section offset zero, and has exactly
  the specified function size;
- the section has an ARM mapping symbol at offset zero;
- a command-only section is function size plus four bytes and has one
  `R_ARM_ABS32` relocation at the function-size offset to its named command;
- a command-plus-handle section is function size plus eight bytes and has two
  consecutive `R_ARM_ABS32` relocations to its named command and handle;
- every named identity is one global undefined `NOTYPE` symbol; and
- no other relocation occurs in any covered section.

## Probe result

A neutral symbolic ARM assembly probe instantiated all 29 functions. Named,
zero-valued placeholder literal identities were emitted only after each
function's `.size` boundary to establish the documented PC-relative layout.
GNU objcopy extraction followed by a size-bounded binary comparison matched
every complete probe body against its corresponding target interval: 29 of 29
functions and 1,916 of 1,916 code bytes. A current inventory/report scan also
confirmed ARM mode, unmatched status, and absence from all earlier
specifications at selection time.

No clean-room implementation is included in this analysis document.
