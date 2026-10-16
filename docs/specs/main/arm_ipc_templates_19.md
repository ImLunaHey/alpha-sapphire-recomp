# Probe-verified ARM IPC templates 19

## Scope and provenance

- Target: `AS_EUR_REV2`, as independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra inventory, current objdiff report, and
  bounded private-target control/data-flow analysis.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203.
- Clean-room role: analysis/specification only. No target bytes, encoded
  instruction words, private addresses, private literal values, assets,
  implementation, or proprietary source are present.

This batch covers 23 previously unspecified and unmatched ARM-state IPC
wrappers in 11 complete templates, totaling 1,384 code bytes. Public CTR IPC
conventions identify TPIDRURO plus 128 as the command buffer and SVC 50 as
`SendSyncRequest`.

## Global-handle static descriptor request

These 68-byte functions write request word 1 as `r1`, word 2 as
`2 | (r1 << 14)`, and word 3 as `r0`:

- `func_0016516C`: `ipc_command_func_0016516C`, existing
  `ipc_handle_slot_alpha`;
- `func_001FB6F8`: `ipc_command_func_001FB6F8`, existing
  `ipc_handle_slot_epsilon`.

Exact order: `push {r4,lr}`, acquire the buffer, load the command, create zero
in `r2`, pre-index-store the command, store word 1 then word 3, load the handle
literal, synthesize the descriptor with two `orr` instructions, store word 2,
dereference the handle, SVC 50, and use the common `and/cmp/ldrge` tail.

Pool order: command, handle.

## Global-handle byte request with word output

These 68-byte functions take entry `r0` as an output pointer and store the low
byte of entry `r1` to the low byte of request word 1:

- `func_002DEC1C`: existing `ipc_command_func_002C6104`, existing
  `ipc_handle_slot_beta`;
- `func_002DED28`: `ipc_command_func_002DED28`,
  `ipc_handle_slot_beta`.

On success response word 3 is stored through the output pointer and response
word 1 is returned. The exact tail uses `ands`, `bmi`, a conditional output
store, `add sp,#8`, and `pop {r4,r5,r6,pc}`.

Exact register schedule: push `{r0,r1,r4,r5,r6,lr}` and preserve the output
pointer in `r5`. After storing the command, load the saved request byte into
`r0` at semantic offset `+0x14` and store it with `strb r0` at `+0x18`.
Following SVC 50, test the result with `ands r1,r0`; on success load response
word 3 through `r0`, store it through `r5`, then load response word 1 into
`r0`. The saved-byte load/store pair must not use `r1`.

Pool order: command, handle.

## Inline-command no-input request with mixed outputs

`func_00119FE0` and `func_0011A178` are 64 bytes and contain no post-body
literal. They use the public CTR command-header identity
`ipc_inline_command_id_48_no_params`, synthesized directly as command ID 48
with zero normal and translated words. Entry `r0` points to the handle, `r1`
is a word-output pointer, and `r2` is a halfword-output pointer. On success,
response word 2 is stored through `r1`, the low halfword of response word 3 is
stored through `r2`, and response word 1 is returned. No output occurs on
error.

Exact order: preserve output pointers in `r5/r6`; acquire the command buffer;
synthesize/store the inline command header; dereference the handle and issue
SVC 50; `ands`/`bmi`; word output, halfword output, response-word-1 load; pop.

## Handle-pointer fixed-32 request

`func_00173EE4` and `func_00174704` are 64 bytes and share
`ipc_command_func_00173EE4`. Request word 1 is `r2`, word 2 is 32, word 4 is
zero, and word 5 is `r1`; word 3 is untouched. Entry `r0` points to the handle.
Exact register schedule: command literal into `r12` at `+0x08`, materialize
zero in `r3` at `+0x0c`, store the command at `+0x10`, store `r2` to word 1
at `+0x14`, materialize 32 in `r2` at `+0x18`, store `r1` to word 5 at
`+0x1c`, store 32 to word 2 at `+0x20`, and store `r3` to word 4 at `+0x24`.
Then dereference the entry handle, send, and use the common result tail.

Pool order: command only.

## Global-handle mapped-buffer request

`func_001FFAE8` and `func_002001B0` are 64 bytes and share
`ipc_command_func_001FFAE8`; their handles are `ipc_handle_slot_eta` and
`ipc_handle_slot_theta`. Request words 1 through 5 are `r0`, `r2`, `r3`,
`10 | (r2 << 4)`, and `r1`. Exact ordering uses `stm` for words 1-3 and `strd`
for words 4-5, followed by the common result tail.

Pool order: command, handle.

## Handle-pointer byte request with word output

`func_002C8E10` and `func_002CA67C` are 64 bytes and share
`ipc_command_func_002C8E10`. Entry `r1` is an output pointer and only the low
byte of entry `r2` is written to request word 1. On success response word 2 is
stored through the output pointer. Exact ordering preserves `r1` in `r5`, uses
`strb`, then the `ands/bmi` output tail with 12-byte stack cleanup.

The exact frame is push `{r0,r1,r2,r4,r5,lr}` and pop `{r4,r5,pc}` after
`add sp,#12`; `r6` is not saved or restored. The saved request byte is loaded
from stack offset 8 into `r1`. On success response word 2 is loaded through
`r0` and stored through `r5`, followed by the response-word-1 load into `r0`.

Pool order: command only.

## Handle-pointer halfword/zero/word request

`func_002C91DC` and `func_002CAA48` are 64 bytes and share
`ipc_command_func_002C91DC`. The low halfword of entry `r1` is stored to the
low halfword of request word 1, word 2 is zero, and word 3 is `r2`. Exact order
uses `strh`, then one `stm` for zero and `r2`, followed by the common result
tail and 12-byte stack cleanup.

The exact frame is push `{r0,r1,r2,r4,r5,lr}` and pop `{r4,r5,pc}` after
`add sp,#12`; `r6` is not saved or restored. Load the command into `r3` at
`+0x08`, materialize zero in `r1` at `+0x0c`, store the command at `+0x10`,
load the saved halfword into `r3` at `+0x14`, and store it at `+0x18`. Then
form the word-2 address in `r3` and use `stm r3,{r1,r2}`.

Pool order: command only.

## Inline-command no-input request

`func_00119FB8`, `func_0011A150`, and `func_002C5B5C` are 40 bytes and have no
post-body pool. They synthesize public CTR identity
`ipc_inline_command_id_3_no_params` directly: command ID 3 with zero normal and
translated words. Entry `r0` points to the handle. Exact semantic sequence:

```asm
push {r4, lr}
mrc p15, 0, r4, c13, c0, 3
mov r1, #(3 << 16)
str r1, [r4, #128]!
ldr r0, [r0]
svc #50
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, pc}
```

## Global-handle word request with byte output

These 60-byte functions write entry `r0` to request word 1 and use entry `r1`
as a byte-output pointer. On success, the low byte of response word 2 is stored
through that pointer:

- `func_00126808`: `ipc_command_func_00126808`,
  `ipc_handle_slot_alpha`;
- `func_00133BCC`: existing `ipc_command_func_0010F864`,
  `ipc_handle_slot_alpha`.

Exact order preserves the output pointer in `r5`, stores word 1, then uses the
global handle and the `ands/bmi/ldrb/strb` output tail.

Pool order: command, handle.

## Global-handle five-word request

`func_00132E48` and `func_00145DF8` are 60 bytes. Their commands are named
after their functions and both use new `ipc_handle_slot_kappa`. Request words
1 through 5 are `r1`, `r2`, `r3`, zero, and `r0`. Exact order materializes zero
in `r12`, stores word 5, loads the handle literal, then uses a single `stm` for
words 1-4 before sending.

Exact frame and schedule: push `{r4,r5,r6,lr}`; acquire the command buffer;
load the command into `r5`; materialize zero in `r12`; store the command;
form the word-1 address in `r6`; store entry `r0` to word 5; load the handle
literal; use `stm r6,{r1,r2,r3,r12}`; dereference and send; then use the common
result tail and pop `{r4,r5,r6,pc}`. The command/address temporaries must not
be assigned to `lr`.

Pool order: command, handle.

## Global-handle word-plus-32 request

These 56-byte functions write entry `r0` to request word 1 and 32 to word 2:

- `func_0011BAE8`: `ipc_command_func_0011BAE8`, new
  `ipc_handle_slot_lambda`;
- `func_001F162C`: existing `ipc_command_func_0016516C`, existing
  `ipc_handle_slot_iota`.

Exact order stores the command, word 1, then 32, loads/dereferences the handle,
issues SVC 50, and uses `and/cmp/ldrge` before `pop {r4,pc}`.

The exact command-register assignment is `r1`: load the command literal into
`r1` at `+0x08` and store it at `+0x0c`. Store entry `r0` to word 1, then
materialize 32 in `r0` and store it to word 2. The command load/store pair must
not use `r2`.

Pool order: command, handle.

## Literal equality and deterministic validation

The two inline-command templates have no post-body pool. The remaining
functions contribute 30 literal slots forming exactly 21 classes. Eight
classes reuse prior identities:

- commands `ipc_command_func_002C6104` and
  `ipc_command_func_0010F864`; and
- handles `ipc_handle_slot_alpha`, `ipc_handle_slot_beta`,
  `ipc_handle_slot_epsilon`, `ipc_handle_slot_eta`,
  `ipc_handle_slot_theta`, and `ipc_handle_slot_iota`.

Thus the authoritative totals are 21 batch classes, 13 new classes, and eight
classes whose values were already present before this batch.

New handle classes are `ipc_handle_slot_kappa` and
`ipc_handle_slot_lambda`. All other new identities are commands listed above.
Across IPC batches 12, 13, and 15 through 19, 248 post-body literal slots form
exactly 122 value/identity classes. Inline command identities are tracked
separately because they create no relocation. A private-target audit proved
the post-body mapping bijective.

The implementation should use 11 textual templates and a neutral manifest
covering exactly 23 ARM functions and 1,384 code bytes. Function counts by
template are 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, and 2. Enforce 30 literal slots
and 21 batch literal classes.

Raw instruction/data directives are forbidden. Pool-bearing sections permit
only named symbolic `.word` entries in command, optional auxiliary, then handle
order. Inline sections contain no relocation or pool. A deterministic
validator must pin source/manifest hashes and prove section/symbol size, ARM
mapping symbols, pool-adjusted section sizes, ordered `R_ARM_ABS32`
relocations, exactly 21 undefined literal identities, and no other covered
relocation. Target generation must extend the post-body equality guard to 248
slots and 122 classes.

## Probe result

A neutral symbolic ARM probe instantiated all 23 functions. Named zero-valued
placeholders appeared only after `.size`; inline-command functions had no
placeholder. Size-bounded objcopy comparison matched all 23 functions and all
1,384 code bytes. A fresh report/spec scan confirmed ARM mode, unmatched
status, and zero overlap at selection time.

No implementation is included.
