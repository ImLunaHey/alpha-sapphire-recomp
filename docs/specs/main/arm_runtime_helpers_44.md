# Probe-verified ARM runtime/leaf-helper batch 44

## Scope and provenance

This clean-room specification covers 18 currently unmatched ARM-state helpers
totaling 440 executable bytes. Evidence was limited to the current unmatched
report, neutral symbols, bounded private-target control/data-flow inspection,
and independent exact-schedule probes. The selection excludes
`func_0016FF88` and `func_001F3884`, which are reserved for duplicate-template
batch 44, and is disjoint from all earlier runtime-helper manifests.

Eleven bodies are call-free. Three make ordinary calls and four tail-transfer.
Two bodies use one aligned word immediately after their function extent; those
words are opaque initialized-data identities and are represented only by
symbolic relocation slots. Their identities are distinct. No private absolute
address, raw byte sequence, instruction encoding, or private slot value is
recorded here.

The schedules were independently assembled with GNU Arm Embedded 15.2 for
ARMv6K/VFPv2 and compared with target revision `AS_EUR_REV2` on 2026-10-16.
All 18 complete bodies and all 440 body bytes matched directly. Use this common
preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Every symbolic call target below is an ARM-state, four-byte-aligned entry. The
seven call identities are pairwise distinct. Four are global primary function
entries. Three are secondary entries inside global ARM functions and have no
standalone symbol in the neutral target inventory. The two slot identities are
also distinct from each other and denote aligned initialized-data locations.

## Small accessors

`func_004EAE00` is a 16-byte leaf. It reads the byte at entry `r0 + 338` and
returns zero for a zero byte or one for any nonzero byte.

```asm
ldrb r0,[r0,#338]
cmp r0,#0
movne r0,#1
bx lr
```

`func_004EAE18` is a 20-byte leaf. It loads a pointer from entry `r0`, advances
that pointer by 3824, deliberately performs `mov r0,r0`, then returns the
unsigned halfword at a further offset of 228. Preserve the split address
calculation and the otherwise inert move.

```asm
ldr r0,[r0]
add r0,r0,#3824
mov r0,r0
ldrh r0,[r0,#228]
bx lr
```

`func_0050DD10` is a 16-byte leaf returning the sum of the two words at entry
`r0` offsets 8 and 12. Preserve the load order and destination registers.

```asm
ldr r1,[r0,#8]
ldr r0,[r0,#12]
add r0,r0,r1
bx lr
```

## `func_004F2BC8` — stack-output call wrapper

This 16-byte wrapper saves exactly `r3` and `lr`, passes the resulting stack
pointer in `r1`, and calls `runtime_stack_output_call_44` with entry `r0`
unchanged. It returns the callee result directly.

```asm
push {r3,lr}
mov r1,sp
bl runtime_stack_output_call_44
pop {r3,pc}
```

## Fixed clear and byte-replication stores

`func_004F2C20` is a 16-byte leaf that clears a word at output offset 0 and a
byte at output offset 4.

```asm
mov r1,#0
str r1,[r0]
strb r1,[r0,#4]
bx lr
```

`func_004F2C40` and `func_004F2C58` are 24-byte leaves. Each reduces entry
`r1` to its low byte, replicates that byte across all four lanes of `r1`, and
stores the resulting word at output offset 0. The former then stores one byte
at offset 4; the latter stores the full replicated word at offset 4.

```asm
and r1,r1,#255
orr r1,r1,r1,lsl #8
orr r1,r1,r1,lsl #16
str r1,[r0]
strb r1,[r0,#4]    @ func_004F2C40
bx lr
```

```asm
and r1,r1,#255
orr r1,r1,r1,lsl #8
orr r1,r1,r1,lsl #16
str r1,[r0]
str r1,[r0,#4]     @ func_004F2C58
bx lr
```

## `func_004F2C70` — return-address table dispatch

This 24-byte ABI veneer treats entry `lr` as the base of an inline dispatch
table. It reads a discriminator byte at `lr - 1`, compares entry `r3` with
that byte, and selects a byte at `lr + discriminator` when `r3` is unsigned
greater than or equal, otherwise at `lr + r3`. It then branches to
`lr + 2 * selected_byte`. The branch does not update `lr`.

```asm
ldrb r12,[lr,#-1]
cmp r3,r12
ldrbcs r3,[lr,r12]
ldrbcc r3,[lr,r3]
add r12,lr,r3,lsl #1
bx r12
```

## `func_004F4F34` — conditional argument-swap tail

This 28-byte wrapper always copies entry `r1` to `r3`. If entry `r2` is zero,
it returns immediately with entry `r0` preserved. Otherwise it swaps the first
two arguments using `r3` and tail-transfers to
`runtime_conditional_transfer_44`; `r2` is unchanged.

```asm
cmp r2,#0
mov r3,r1
beq 1f
mov r1,r0
mov r0,r3
b runtime_conditional_transfer_44
1:
bx lr
```

## `func_00502E20` — bounded indexed pointer lookup

This 44-byte leaf treats entry `r0` as an unsigned index. An index of 32 or
greater returns zero without reading the symbolic slot. Otherwise it obtains
a root identity from `opaque_runtime_root_slot_44_a`, loads a base pointer
through that identity, selects a four-byte table element using the index at
base displacement 2088, and returns zero for a null element or the word at
the non-null element otherwise.

```asm
cmp r0,#32
bcs 1f
ldr r1,opaque_runtime_root_slot_44_a
ldr r1,[r1]
add r0,r1,r0,lsl #2
ldr r0,[r0,#2088]
cmp r0,#0
ldrne r0,[r0]
bne 2f
1:
mov r0,#0
2:
bx lr
```

The function symbol ends after `bx lr` at offset 44. One aligned outside-extent
word at offset 44 carries `R_ARM_ABS32` against
`opaque_runtime_root_slot_44_a`. It is not part of the 44-byte body.

## `func_00506E0C` — double-register call wrapper

This 20-byte wrapper moves the entry `r0:r1` pair into `d0`, saves exactly
`r4` and `lr`, calls `runtime_double_transform_44`, moves the resulting `d0`
back to `r0:r1`, and returns.

```asm
vmov d0,r0,r1
push {r4,lr}
bl runtime_double_transform_44
vmov r0,r1,d0
pop {r4,pc}
```

## `func_00509D48` — binary64 absolute value

This 40-byte leaf returns the entry `r0:r1` binary64 bit pattern with its sign
bit cleared. Preserve the VFP transfer, eight-byte stack scratch, high-word
rewrite, and reload schedule exactly.

```asm
vmov d0,r0,r1
sub sp,sp,#8
vmov r0,s1
vstr d0,[sp]
bic r0,r0,#0x80000000
str r0,[sp,#4]
vldr d0,[sp]
add sp,sp,#8
vmov r0,r1,d0
bx lr
```

## `func_0050A61C` — biased state-field store

This 24-byte leaf computes entry `r0 - 32768 - 1216` in `r1`, obtains an
opaque root through `opaque_runtime_root_slot_44_b`, loads the current state
pointer through that root, and stores the biased value at state offset 88.

```asm
sub r1,r0,#32768
ldr r0,opaque_runtime_root_slot_44_b
sub r1,r1,#1216
ldr r0,[r0]
str r1,[r0,#88]
bx lr
```

The function symbol ends after `bx lr` at offset 24. One aligned outside-extent
word at offset 24 carries `R_ARM_ABS32` against
`opaque_runtime_root_slot_44_b`. The two batch-44 slot identities are unequal.

## `func_0050BCB4` — fixed-flag tail wrapper

This 8-byte wrapper sets `r1` to one and tail-transfers to
`runtime_flagged_tail_44`, preserving entry `r0`.

```asm
mov r1,#1
b runtime_flagged_tail_44
```

## `func_0050DC38` — null-safe release and clear

This 40-byte wrapper returns immediately when entry `r0` is null. Otherwise
it saves `r4-r6` and `lr`, keeps the record pointer in `r4`, clears word 0,
calls `runtime_conditional_release_44` with the record pointer still in `r0`,
then clears words 4 and 8. It returns the callee's `r0` unchanged.

```asm
cmp r0,#0
bxeq lr
push {r4-r6,lr}
mov r5,#0
mov r4,r0
str r5,[r0]
bl runtime_conditional_release_44
str r5,[r4,#4]
str r5,[r4,#8]
pop {r4-r6,pc}
```

## `func_0050DC60` — decrement and zero-count tail

This 32-byte wrapper decrements the word at entry `r0 + 8` and stores the
wrapped 32-bit result. A nonzero result returns immediately. A zero result
clears the word at offset 4 and tail-transfers, with entry `r0` preserved, to
`runtime_zero_count_tail_44`.

```asm
ldr r1,[r0,#8]
subs r1,r1,#1
str r1,[r0,#8]
bne 1f
mov r1,#0
str r1,[r0,#4]
b runtime_zero_count_tail_44
1:
bx lr
```

## `func_0050DD20` — null-safe record clear

This 36-byte leaf does nothing for a null entry `r0`. Otherwise it clears the
four words at offsets 0, 4, 8, and 12, then clears the byte at offset 16.

```asm
cmp r0,#0
beq 1f
mov r1,#0
str r1,[r0]
str r1,[r0,#4]
str r1,[r0,#8]
str r1,[r0,#12]
strb r1,[r0,#16]
1:
bx lr
```

## `func_0050DD44` — zero-pair tail wrapper

This 12-byte wrapper sets both `r0` and `r1` to zero, in that order, and
tail-transfers to `runtime_zero_pair_tail_44`.

```asm
mov r0,#0
mov r1,r0
b runtime_zero_pair_tail_44
```

## Branch identity and visibility ledger

The branch identities must be classified by their actual code entries, not by
choosing the nearest primary symbol and assuming offset zero:

| Neutral identity | Target relation | Mode and visibility | Entry behavior |
| --- | --- | --- | --- |
| `runtime_stack_output_call_44` | `func_004F2BD8 + 0` | ARM primary; global function | standalone branch thunk called with `r1 = sp` |
| `runtime_conditional_transfer_44` | `func_00300B28 + 0` | ARM primary; global function | standalone transfer/copy routine |
| `runtime_double_transform_44` | `func_004F3510 + 0` | ARM primary; global function | standalone binary64 transform |
| `runtime_flagged_tail_44` | `func_005095B0 + 0x08` | ARM secondary; no standalone symbol | enters at the save/prologue after the primary wrapper's `r1 = 0` setup, so the caller-supplied `r1 = 1` is retained |
| `runtime_conditional_release_44` | `func_001241A0 + 0` | ARM primary; global function | standalone exclusive-store helper |
| `runtime_zero_count_tail_44` | `func_00132A14 + 0x64` | ARM secondary; no standalone symbol | enters a distinct aligned prologue following the primary routine's earlier epilogue |
| `runtime_zero_pair_tail_44` | `func_00123D60 + 0x0C` | ARM secondary; no standalone symbol | enters directly at the SVC after the primary wrapper's zero-argument setup |

For implementation assembly, all seven neutral names remain global undefined
function symbols so the listed call/jump relocations retain their neutral
identities. For authoritative target normalization, the four primary entries
must resolve to their global function starts. The three secondary identities
must resolve to the exact listed offsets inside their enclosing global
functions; they must not be rejected or rewritten merely because no symbol
table row begins there. Their ARM mode is established by four-byte alignment,
the enclosing ARM mapping, the direct ARM `b` instruction form, and the
surrounding ARM instruction stream. None is Thumb, a `blx` destination, or an
interworking veneer.

## Manifest requirements

- Mode: ARM for every body and every symbolic call target.
- Total body size: 440 bytes across 18 functions.
- Ordinary-call relocations are at offsets 8 in `func_004F2BC8`, 8 in
  `func_00506E0C`, and 24 in `func_0050DC38`.
- Tail relocations are at offsets 20 in `func_004F4F34`, 4 in
  `func_0050BCB4`, 24 in `func_0050DC60`, and 8 in `func_0050DD44`.
- All seven call identities are pairwise unequal, ARM-state, and aligned to at
  least four bytes. Four are primary global function entries and three are the
  exact secondary-entry relations in the branch identity ledger. A target-side
  audit must permit those three no-standalone-symbol destinations.
- `func_00502E20` and `func_0050A61C` each have one four-byte executable-section
  slot immediately after the function symbol, at offsets 44 and 24
  respectively. Each slot has one `R_ARM_ABS32` relocation to its configured
  undefined opaque identity. The identities are distinct aligned initialized-
  data locations; their private values must never be emitted by tooling.
- Every other body has no adjacent word or literal-pool slot.
