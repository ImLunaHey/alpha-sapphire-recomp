# Probe-verified ARM IPC templates 20

## Scope and provenance

- Target: `AS_EUR_REV2`, as independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated function inventory, current objdiff report,
  bounded private-target control/data-flow analysis, and exact independent
  assembly probes.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203.
- Clean-room role: analysis/specification only. No target bytes, encoded
  instruction words, private addresses, private literal values, assets,
  implementation, or proprietary source are present.

This batch contains 24 previously unspecified, unmatched ARM-state IPC
wrappers in 12 two-function templates, totaling exactly 1,232 code bytes.
Public CTR conventions identify TPIDRURO plus 128 as the thread command
buffer and SVC 50 as `SendSyncRequest`.

Unless a template states otherwise, the exact common result tail is
`and r1,r0,#0x80000000; cmp r1,#0; ldrge r0,[r4,#4]`, followed by the stated
return. The response load must use condition `ge`, not `eq`. Pool-bearing
templates place their named symbolic words directly
after `.size`; those words are outside the function's code-byte total.

## Handle-pointer four-word request with word output

These 72-byte functions have distinct command identities:

- `func_002E41E0`: `ipc_command_func_002E41E0`;
- `func_002E42B0`: `ipc_command_func_002E42B0`.

Entry `r0` points to the handle, `r1` is an output pointer, `r2/r3` become
request words 1/2, the first entry stack word becomes request word 3, and
request word 4 is 32. Preserve the output pointer in `r5`. Exact request order
is stack-word load into `r1` at `+0x08`, command-buffer acquisition, command
load into `r12` at `+0x10`, command store at `+0x14`, word-3 store from `r1`
at `+0x18`, materialize/store 32 to word 4, then `strd r2,r3` to words 1/2.
On return from SVC, use `ands r1,r0,#0x80000000` at `+0x30` and `bmi`. On
success, load response word 2 into `r0` at `+0x38`, store `r0` through `r5`
at `+0x3c`, then return response word 1 in `r0`. Use
`push/pop {r4,r5,r6,lr/pc}`. Do not substitute `r6` for the stack word,
condition scratch, or response value.

Pool and relocation order: command only.

## Handle-pointer mixed-width stack request

`func_0011A020` and `func_0011A1B8` are 68 bytes and share
`ipc_command_func_0011A020`. Entry `r0` points to the handle. Request words
1/2 are entry `r2/r3`; request word 3 is the first entry stack word; only the
low halfword of the second entry stack word is stored to word 4, and only the
low byte of the third is stored to word 5. Entry `r1` is unused.

Exact schedule after `push {r4,lr}`: load stack word 0 from stack offset 8;
acquire the command buffer; load/store the command; store stack word 0 to
word 3; `strd r2,r3` to words 1/2; load/store the halfword at stack offset 12;
load/store the byte at stack offset 16; dereference the handle and send; use
the common result tail.

Pool and relocation order: command only. Both functions relocate to the same
command identity.

## Global-handle byte request

These 56-byte functions use existing `ipc_handle_slot_zeta`:

- `func_00202D34`: `ipc_command_func_00202D34`;
- `func_00202F00`: `ipc_command_func_00202F00`.

Only the low byte of entry `r0` is stored to request word 1. Preserve the
otherwise redundant leading `mov r0,r0`, then push `{r0,r4,r5,lr}`. Load the
command into `r0` at `+0x0c` and pre-index-store it from `r0` at `+0x10`.
Load the saved byte with `ldrb r0,[sp]` at `+0x14`, not a word load, and use
`strb r0` for request word 1. Load/dereference the global handle and send. The
exact return is the `and/cmp/ldrge` common result tail followed by
`pop {r3,r4,r5,pc}`, which both restores registers and discards the saved
argument.

Pool and relocation order: command, handle.

## Handle-pointer two-register plus stack-word request

These 52-byte functions have distinct commands:

- `func_0011A068`: `ipc_command_func_0011A068`;
- `func_001F73BC`: `ipc_command_func_001F73BC`.

Entry `r0` points to the handle. Request words 1/2 are entry `r2/r3`, and
request word 3 is the first entry stack word; entry `r1` is unused. After
`push {r4,lr}`, load that stack word from stack offset 8, acquire the buffer,
load/store the command, store word 3, then use `strd r2,r3` for words 1/2.
Dereference the handle, send, and use the common result tail.

Pool and relocation order: command only.

## Handle-pointer word-plus-32 request

These 52-byte functions have distinct commands:

- `func_0012408C`: `ipc_command_func_0012408C`;
- `func_002CCF14`: `ipc_command_func_002CCF14`.

Entry `r0` points to the handle. Request word 1 is entry `r1`; word 2 is 32.
The exact command temporary is `r2`. Store word 1 before materializing 32 in
`r1`, store word 2, dereference the handle, send, and use the common result
tail.

Pool and relocation order: command only.

## Handle-pointer no-input byte output

These 52-byte functions have distinct commands:

- `func_001F70F4`: `ipc_command_func_001F70F4`;
- `func_001F712C`: `ipc_command_func_001F712C`.

Entry `r0` points to the handle and `r1` is a byte-output pointer preserved in
`r5`. Use `push/pop {r4,r5,r6,lr/pc}`. After sending, use exactly
`ands r1,r0,#0x80000000` and `bmi`; on
success load only the low byte of response word 2 through `r0`, store it
through `r5`, then return response word 1. No output occurs on error.

Pool and relocation order: command only.

## Inline command 31 with response-word-3 output

`func_002C92B4` and `func_002CAB20` are 52 bytes and have no post-body pool or
relocation. They synthesize public identity
`ipc_inline_command_id_31_no_params`: command ID 31 with zero normal and
translated words. Entry `r0` points to the handle and `r1` is a word-output
pointer preserved in `r5`. After sending, use exactly
`ands r1,r0,#0x80000000` and `bmi`; on success store
response word 3 through `r5`, then return response word 1. Use the
`{r4,r5,r6,lr/pc}` frame.

## Inline command 43 with global handle

These 44-byte functions synthesize public identity
`ipc_inline_command_id_43_no_params`, with zero normal and translated words:

- `func_00133E64`: existing `ipc_handle_slot_alpha`;
- `func_002C6450`: existing `ipc_handle_slot_gamma`.

Use `r0` to synthesize and store the command, then load/dereference the named
global handle, send, and use the common result tail.

Pool and relocation order: handle only. There is no command relocation.

## Handle-pointer two-word request

These 44-byte functions have distinct commands:

- `func_001F6ED4`: `ipc_command_func_001F6ED4`;
- `func_001F77D0`: `ipc_command_func_001F77D0`.

Entry `r0` points to the handle; request words 1/2 are entry `r2/r3`; entry
`r1` is unused. Acquire TPIDRURO in `r4`, load the command into `r1`, add 128
to `r4`, then use exactly one `stm r4,{r1,r2,r3}` for the command and request
words. Dereference the handle, send, and use the common result tail.

Pool and relocation order: command only.

## Inline command 2 with global handle

These 44-byte functions synthesize public identity
`ipc_inline_command_id_2_no_params`, with zero normal and translated words:

- `func_001FB448`: existing `ipc_handle_slot_epsilon`;
- `func_00202CC8`: existing `ipc_handle_slot_zeta`.

The exact schedule matches the inline-command-43 global-handle template: use
`r0` for the inline command, load/dereference the global handle, send, and use
the common result tail.

Pool and relocation order: handle only. There is no command relocation.

## Handle-pointer literal no-input request

These 40-byte functions have distinct commands:

- `func_001F76C0`: `ipc_command_func_001F76C0`;
- `func_001F78BC`: `ipc_command_func_001F78BC`.

Entry `r0` points to the handle. Load the command into `r1`, pre-index-store
it to the command buffer, dereference the handle, send, and use the common
result tail.

Pool and relocation order: command only.

## Inline command 14 no-input request

`func_002C9004` and `func_002CA870` are 40 bytes and have no post-body pool or
relocation. They synthesize public identity
`ipc_inline_command_id_14_no_params`: command ID 14 with zero normal and
translated words. Entry `r0` points to the handle. Use `r1` for the inline
command, dereference the handle, send, and use the common result tail.

## Literal identities, equality classes, and relocations

The 24 functions contribute exactly 22 post-body literal slots. Those slots
form 19 equality classes: 15 new command classes and four reused handle
classes. The reused classes are `ipc_handle_slot_alpha`,
`ipc_handle_slot_gamma`, `ipc_handle_slot_epsilon`, and
`ipc_handle_slot_zeta`. No new handle class is introduced.

Only `func_0011A020` and `func_0011A1B8` share a new command identity. Every
other named batch-20 command identity is distinct from every other new class
and from every earlier command class. Repeated handle slots compare equal to
their same-named earlier classes, and no differently named literal identities
compare equal.

Four inline identities are tracked separately because they create no command
relocation: command IDs 31, 43, 2, and 14, each with zero normal and translated
words. Each inline identity is shared by its two-function template. They are
distinct from the earlier inline identities for command IDs 3 and 48.

Across IPC batches 12, 13, and 15 through 20, exactly 270 post-body literal
slots form 137 value/identity classes. A private-target audit proved the
mapping bijective and found no split or accidental merge.

Every pool slot emits one named symbolic absolute relocation. The only legal
orders are command; command then handle; or handle-only for the inline/global
templates. Inline handle-pointer templates emit no pool and no relocation.

## Independent exact probes and implementation requirements

The ignored local probe is
`build/AS_EUR_REV2/probes/ipc_templates20_probe.S`. Its SHA-256 is
`c053ab7bf99c88a025610e0e214de58c801cf520c1f5f45ecf2c2d1e6b8cbecc`;
the assembled object's SHA-256 is
`62d5405c3deebbf9dab6af7b71f2768db4cba5ce3a47051f491f271c72987f59`.
Independent section extraction and bounded comparison proved all 24 complete
function bodies byte-exact at their declared sizes.

The implementation should use exactly 12 textual templates and a neutral
manifest covering 24 ARM functions and 1,232 code bytes. Function counts by
template are uniformly two. A deterministic validator must pin source and
manifest hashes; enforce names, mode, sizes, template membership, 22 literal
slots, 19 pool equality classes, and relocation count/order; reject numeric
`.word` entries and raw instruction directives; and independently compare
each complete body against the verified target. It must also prove that the
four inline templates have precisely the pool/relocation forms described
above.
