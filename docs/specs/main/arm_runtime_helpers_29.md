# Probe-verified ARM runtime/helper batch 29

## Scope and provenance

This clean-room specification covers two currently unmatched ARM-state
helpers totaling 364 executable bytes. Each complete body was independently
assembled from the schedules below and compared byte-for-byte with target
revision `AS_EUR_REV2`; both bodies and all 364 bytes matched.

The first helper is a leaf with no literal pool or adjacent data. The second
has one external ARM call and no literal pool or adjacent data. Its callee is
an opaque symbolic code identity specified only by instruction mode,
alignment, equality, and argument traffic visible at the call site. No callee
address or implementation, raw private value, target instruction encoding,
or proprietary source is recorded here.

## `func_002D03B4` — indexed descriptor validation and slot installation

This 284-byte leaf takes a writable array of 12-byte slots in entry `r0`, a
candidate record in entry `r1`, an array of four-byte descriptors in entry
`r2`, and an unsigned descriptor count in entry `r3`. It preserves exactly
`r4-r9`; LR is not saved because the function makes no calls.

Call the entry pointers `slots`, `candidate`, and `descriptors`. The candidate
fields visible to this helper are:

```text
candidate + 0   unsigned payload length
candidate + 4   payload pointer
candidate + 8   descriptor key / installed metadata word
candidate + 10  candidate kind byte
```

Each four-byte descriptor has an index byte at +0, a kind byte at +1, and a
halfword key at +2. An entry count of zero returns one immediately. Otherwise
descriptors are scanned in order until their halfword key equals the low
halfword at candidate+8. If no key matches, the function returns one without
writing.

After a key match, the descriptor kind must equal candidate byte +10. A kind
mismatch returns zero immediately; the scan does not continue. The descriptor
index selects `slot = slots + 12*index`. Slot byte +11 must be zero or the
function returns zero. A zero candidate payload length returns one without
installing the slot.

For a nonempty candidate, two candidate kinds have extra acceptance gates:

- Kind 2 reads the byte at `payload + length - 1`. A nonzero byte returns one
  without installation; a zero byte permits installation.
- Kinds 5 and 10 inspect bytes +4 through +7 of each eight-byte payload
  group, beginning with the group at offset zero. If all four inspected bytes
  in any visited group are zero, the function returns one without
  installation. Otherwise it advances by eight and continues while
  `length > group_offset`. The loads occur exactly as scheduled, including
  the four individual byte loads before the combined zero test.
- Every other kind proceeds directly to installation.

Installation writes candidate metadata, payload pointer, and payload length
to slot offsets +8, +4, and +0 in that physical order. It then recomputes the
slot address from the descriptor index and writes one to slot byte +11. The
success result is one. The only zero results are the matched-descriptor kind
mismatch and an already-occupied selected slot.

### Complete exact body schedule

```asm
push {r4-r9}
cmp r3,#0
ldrhne r12,[r1,#8]
beq success
scan:
ldrh r4,[r2,#2]
cmp r4,r12
bne next_descriptor
ldrb r3,[r1,#10]
ldrb r12,[r2,#1]
cmp r12,r3
bne fail
ldrb r12,[r2]
add r12,r12,r12,lsl #1
add r5,r0,r12,lsl #2
ldrb r12,[r5,#11]
cmp r12,#0
beq matched_slot_free
fail:
pop {r4-r9}
mov r0,#0
bx lr
matched_slot_free:
ldr r4,[r1]
cmp r4,#0
beq success
cmp r3,#2
beq kind_two
cmp r3,#5
cmpne r3,#10
bne install
b scan_payload
kind_two:
ldr r3,[r1,#4]
add r3,r3,r4
ldrb r3,[r3,#-1]
cmp r3,#0
bne success
b install
scan_payload:
cmp r4,#0
ldrhi r12,[r1,#4]
mov r3,#0
bls install
payload_loop:
add r6,r3,#4
add r7,r3,#5
add r8,r3,#6
add r9,r3,#7
ldrb r6,[r12,r6]
ldrb r7,[r12,r7]
ldrb r8,[r12,r8]
ldrb r9,[r12,r9]
orr r6,r6,r7
orr r7,r8,r9
orrs r6,r6,r7
beq success
add r3,r3,#8
cmp r4,r3
bhi payload_loop
install:
ldr r3,[r1,#4]
ldr r1,[r1,#8]
mov r12,#1
str r1,[r5,#8]
str r3,[r5,#4]
str r4,[r5]
ldrb r1,[r2]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
strb r12,[r0,#11]
b success
next_descriptor:
subs r3,r3,#1
add r2,r2,#4
bne scan
success:
pop {r4-r9}
mov r0,#1
bx lr
```

Exact-schedule cautions:

- The initial candidate-key halfword load is conditional and occurs before
  the empty-count branch. Keep `r12` as the key register throughout the
  descriptor scan.
- Once a key matches, candidate byte +10 replaces the remaining count in
  `r3`. A kind mismatch is a hard zero result rather than a reason to advance
  to another descriptor.
- Form the slot address with the multiply-by-three add followed by an add
  shifted by two. Do not substitute a multiply instruction.
- Keep the kind-2 last-byte load as a negative-one immediate load after
  adding the length. The nonzero condition skips installation but is still a
  successful result.
- Preserve the conditional payload-pointer load (`ldrhi`) and unsigned
  `bls`/`bhi` conditions. The four byte loads and two ordinary ORs precede the
  flag-setting OR exactly as shown.
- The install stores are ordered metadata, pointer, length. Recompute the
  slot address for the final byte store instead of reusing `r5`.
- There are two separate `pop {r4-r9}` epilogues. Neither restores PC; both
  are followed by a result move and `bx lr`.

## `func_002DFED0` — prepared five-word endian reversal copy

This 80-byte wrapper takes a source record in entry `r0` and a writable
20-byte output in entry `r1`. It preserves exactly `r4-r6` and LR, retaining
the source in `r5` and output in `r4`. It first calls the opaque ARM identity
`runtime_record_prepare_29` with the original entry `r0` and `r1` unchanged.
The callee result is ignored.

After the call, words at source offsets 80, 84, 88, 92, and 96 are loaded in
order. Each word is byte-reversed independently with `rev` and immediately
stored at output offsets 0, 4, 8, 12, and 16. The final `r0` value is the
byte-reversed fifth word; there is no separately materialized status result.

### Complete exact body schedule

```asm
push {r4-r6,lr}
mov r4,r1
mov r5,r0
bl runtime_record_prepare_29
ldr r0,[r5,#80]
rev r0,r0
str r0,[r4]
ldr r0,[r5,#84]
rev r0,r0
str r0,[r4,#4]
ldr r0,[r5,#88]
rev r0,r0
str r0,[r4,#8]
ldr r0,[r5,#92]
rev r0,r0
str r0,[r4,#12]
ldr r0,[r5,#96]
rev r0,r0
str r0,[r4,#16]
pop {r4-r6,pc}
```

The call at body offset `+0x0c` is an `R_ARM_CALL` relocation to
`runtime_record_prepare_29`.

Exact-schedule cautions:

- Preserve unused `r6` as part of the exact four-register push/pop set.
- Save the output pointer before the source pointer. The external call sees
  original entry `r0-r1`; do not reorder them as call arguments.
- Keep five alternating load/reverse/store groups. Do not use a multiple-word
  transfer, defer stores, or combine byte reversal with another operation.
- Use word transfers throughout and retain the final-word result in `r0`.

## Symbolic call identity ledger

| Identity | Relocation site | Mode/alignment | Equality class | Permitted visible contract |
| --- | --- | --- | --- | --- |
| `runtime_record_prepare_29` | `func_002DFED0 + 0x0c` | ARM code, 4-byte aligned | one unique batch-local call target | called with original source in `r0` and output in `r1`; may clobber caller-saved registers; return value ignored |

An implementation may teach the audited target-object generator to normalize
only this observed branch site to the named `R_ARM_CALL` relocation. It must
verify that the observed destination is an aligned ARM target and must not
generalize normalization to any other branch.

## Exact-probe and overlap audit

| Function | Mode | Body size | Calls | Adjacent words | Probe result |
| --- | --- | ---: | ---: | ---: | --- |
| `func_002D03B4` | ARM | 284 | 0 | 0 | exact complete body |
| `func_002DFED0` | ARM | 80 | 1 | 0 | exact complete body after symbolic call link |
| **Total** |  | **364** | **1** | **0** | **2 / 2 exact; 364 / 364 bytes** |

The current objdiff report lists both functions as unmatched. A complete
tracked specification and configuration inventory contains no earlier batch
naming either function. Neither appears in the concurrent IPC batch-28
selection or the concurrent duplicate batch-29 selection. The two selected
functions are distinct from each other, giving zero known overlap with
existing or concurrent work.
