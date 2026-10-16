# Probe-verified duplicate ARM templates 69

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body grouping after direct-transfer normalization, bounded
  target control/data-flow and post-body inspection, primary/secondary branch
  resolution, literal-identity comparison, and an independent GNU Arm
  Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, private literal values, target hashes,
  extracted assets, proprietary source, or implementation source.

Every function already exact in the current report and every function named by
an existing tracked implementation contract was excluded. Candidate selection
was restricted to unmatched ARM-state functions at or above `0x00400000`, so
this lane remains separate from concurrent low-address work. Ten functions
share five complete schedules, totaling 1,304 executable bytes:

```text
func_0049866C  func_004995CC
func_0044C63C  func_0044EC5C
func_00450D90  func_0045174C
func_0052AF8C  func_0052B1A8
func_0041097C  func_004109DC
```

## Branch-identity contract

All linked transfers are ARM-to-ARM and four-byte aligned. Fifteen
destinations are inventoried primary entries. Four are aligned secondary
entries without independent function-start rows:

| Secondary symbol | Structural relation | Sites |
| --- | --- | ---: |
| `func_0014EA68 - 4` | established relational secondary entry four bytes before `func_0014EA68` | 2 |
| `indexed_float_dispatch_secondary_a_69` | `func_003A52AC + 140`, 132 bytes before `func_003A53BC` | 1 |
| `indexed_float_dispatch_secondary_b_69` | `func_003A4E68 + 116`, 36 bytes before `func_003A4F00` | 1 |
| `service_context_secondary_69` | `func_0012BB4C + 8`, eight bytes before `func_0012BB5C` | 4 |

The established `func_0014EA68 - 4` secondary is a return entry reached only after the caller has
zeroed `r0`, `r1`, and `r2`. The two indexed-float destinations are distinct
secondary dispatch entries even though they begin equivalent dispatch
schedules. The service-context secondary is a two-instruction prelude that
falls through into the following primary global. None may be replaced with
the neighbouring primary entry or with another secondary identity.

The four secondary entries and all fifteen primary entries are pairwise
distinct. Shared primary classes are `func_0044E250`, `func_0013D4AC`,
`func_00123480`, `func_00109434`, and `func_00300B28`, each used twice.

## Search-VFP-records contract

`func_0049866C` and `func_004995CC` share a 180-byte schedule. The routine
retains entry `r0` through `r3` in `r8`, `r9`, `r7`, and `r5`, saves all eight
callee-saved VFP registers, and allocates 76 bytes of local storage. It loads
sixteen single-precision argument words from the caller's stack into `s16`
through `s31`, then passes four local-field pointers to the expansion-specific
prepare helper. Three pointers occupy the first three outgoing stack words and
the fourth is in `r2`.

The signed halfword written at local offset 12 is the iteration count. A
non-positive count takes the miss path. Otherwise, the routine starts a signed
halfword index at zero. Each iteration copies `s16` through `s31` to the local
VFP argument block, calls the expansion-specific examine helper with the
retained `r0`, `r1`, index, local-result pointer, and retained entry `r3`, then
compares the helper-written halfword at local offset 68 against retained entry
`r2`. A match returns immediately with the helper's result registers intact.
Otherwise the signed-halfword index advances until it reaches the count.

The miss path releases local and VFP storage, writes zero to `r0` through `r2`,
restores the integer register set without `pc`, and tail-branches to
`func_0014EA68 - 4`. The complete local destinations are +80,
+140, and +168. Linked transfers are:

| Function | Offset | Relocation | Destination | Role |
| --- | ---: | --- | --- | --- |
| `func_0049866C` | +60 | `R_ARM_CALL` | `func_00497E48` | prepare local records |
| `func_0049866C` | +108 | `R_ARM_CALL` | `func_0049840C` | examine one record |
| `func_004995CC` | +60 | `R_ARM_CALL` | `func_00498DA0` | prepare local records |
| `func_004995CC` | +108 | `R_ARM_CALL` | `func_00499388` | examine one record |
| both | +164 | `R_ARM_JUMP24` | `func_0014EA68` with addend -4 | return the zero triplet |

Each function symbol ends at +180 and owns no literal pool. Unrelated anonymous
material begins at +180; the next inventoried global begins at +492 in both
expansions. That anonymous material is not template-owned.

## Iterate-indexed-float-dispatch contract

`func_0044C63C` and `func_0044EC5C` share a 172-byte schedule followed by one
owned identity word. The routine retains entry `r0` and `r1`, loads the shared
iteration-owner identity, saves `d8`, and retains entry `s0` in `s16`. A zero
byte at identity offset one returns immediately. Otherwise it iterates an
unsigned-byte index from zero through ten.

For each index it calls `func_0044E250` with the index in `r0` and the retained
arguments in `r1` and `r2`. A zero helper result skips dispatch. A nonzero
result reloads the identity's offset-one byte. If that byte has become zero,
the dispatch selector is four. Otherwise, indices below eleven become their
index plus four; the defensive out-of-range path explicitly clears `r0`
through `r2`, executes `mov r0,r0`, then also produces four. The selector minus
four is compared against ten. The routine loads identity offset 16, restores
entry `s0`, conditionally loads its offset-four pointer, and conditionally
links to the expansion-specific secondary dispatch entry.

The two deliberate no-ops differ: +60 is the architectural hint spelling
`nop {0}`, while +108 is exactly `mov r0,r0`. The complete local destinations
are +40, +116, +124, +148, and +164. Linked transfers are:

| Function | Offset | Relocation | Mnemonic | Destination |
| --- | ---: | --- | --- | --- |
| both | +52 | `R_ARM_CALL` | `bl` | `func_0044E250` |
| `func_0044C63C` | +144 | `R_ARM_JUMP24` | `blls` | `indexed_float_dispatch_secondary_a_69` |
| `func_0044EC5C` | +144 | `R_ARM_JUMP24` | `blls` | `indexed_float_dispatch_secondary_b_69` |

GNU Arm records the conditional linked transfer as `R_ARM_JUMP24`; validators
must preserve that relocation kind rather than infer `R_ARM_CALL` from the
link-register side effect.

Each symbol ends at +172. The load at +12 reads the shared
established `global_load_11` identity from +172. Template
material therefore ends at +175, and unrelated anonymous material begins at
+176. The next globals begin at +760 and +652, respectively.

## Pack-classified-flag contract

`func_00450D90` and `func_0045174C` share a 108-byte schedule. The routine
retains entry `r0`, `r1`, and `r2`. It calls its expansion-specific mapping
helper with retained `r2` in `r0` and the leading word of entry `r0` in `r1`,
then calls its expansion-specific classifier with retained `r2` in `r0`.

The classifier result becomes a one-bit flag only when it equals one. The
schedule deliberately performs two no-op OR operations with zero, stores zero
as the fifth outgoing argument, and reproduces the bit-packing sequence using
left and right shifts plus a masked high byte. It calls `func_0013D4AC` with
the retained first two arguments, the retained owner's leading word, and the
packed flag word, then returns that helper's result.

There are no local branch destinations or literal slots. Linked calls are:

| Function | Offset | Destination | Role |
| --- | ---: | --- | --- |
| `func_00450D90` | +24 | `func_004D12A8` | map input |
| `func_00450D90` | +32 | `func_004D26FC` | classify input |
| `func_0045174C` | +24 | `func_004D1E10` | map input |
| `func_0045174C` | +32 | `func_004D1CDC` | classify input |
| both | +100 | `func_0013D4AC` | submit packed record |

All five rows use `R_ARM_CALL`. Each symbol ends at +108. Unrelated anonymous
material begins there; the next globals begin at +116 and +520, respectively.

## Allocate-attached-node contract

`func_0052AF8C` and `func_0052B1A8` share a 100-byte schedule followed by one
owned identity word. The routine retains its owner in `r5`, calls
`service_context_secondary_69`, passes that result to `func_00123480` together
with a requested size of 40, and tests the allocation result.

For a non-null allocation, it retains the allocation in `r4`, reacquires the
context through the same secondary entry, and calls `func_00109434` with the
allocation and context. It clears returned-object offset 24 and byte offset
37, and installs the shared node-dispatch identity at offset zero. Both the
null and non-null paths then call the expansion-specific attach helper with the
original owner and current node pointer. The routine returns the node pointer
retained across that attach call.

Null allocation, helper non-return behavior, ordinary call clobbers, and
malformed non-null returned pointers preserve the target's machine behavior.
The only local destination is +76. Linked calls are:

| Function | Offset | Destination | Role |
| --- | ---: | --- | --- |
| both | +8, +40 | `service_context_secondary_69` | acquire context |
| both | +20 | `func_00123480` | allocate node |
| both | +52 | `func_00109434` | initialize node |
| `func_0052AF8C` | +88 | `func_00108CB0` | attach node |
| `func_0052B1A8` | +88 | `func_001E711C` | attach node |

Every row uses `R_ARM_CALL`. Each symbol ends at +100. The load at +56 reads
the shared `arm_duplicate_templates_69_allocated_node_dispatch_identity` from
+100. The next global starts at +104.

## Copy-tagged-VFP-record contract

`func_0041097C` and `func_004109DC` share a 92-byte schedule followed by one
owned identity word. The routine allocates a 64-byte local record and calls
`func_00300B28` with the record pointer in `r0`, the untouched entry `r1`, and
64 in `r2`. It compares the record's leading word against the shared record-tag
identity. A mismatch returns zero without writing the destination.

On a match, it copies local offsets 4 through 31 into destination offsets 60
through 87 using `s1` through `s7`, stores the tag at destination offset 56,
and copies local offsets 32 through 63 into destination offsets 88 through 119
using `s0` through `s7`. It returns one. The only local destination is +84.
The one linked transfer is an `R_ARM_CALL` at +20 to `func_00300B28`.

Each symbol ends at +92. The load at +28 reads the shared
`arm_duplicate_templates_69_copied_record_tag_identity` from +92. The next
global starts at +96.

## Literal identities

There are six owned pool slots in three equality classes:

| Identity | Slots | Class |
| --- | ---: | --- |
| `global_load_11` | 2 | reused initialized-global identity |
| `arm_duplicate_templates_69_allocated_node_dispatch_identity` | 2 | dispatch identity |
| `arm_duplicate_templates_69_copied_record_tag_identity` | 2 | record-tag identity |

The three classes are pairwise distinct. `global_load_11` deliberately reuses
the identity already established by the adjacent-global-load contract. The
two batch-local identities are new and distinct from every previously
configured identity. No private value is part of this contract.

## Complete exact schedules

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT69_SEARCH name, prepare, examine
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, lr}
    mov     r5, r3
    mov     r7, r2
    mov     r8, r0
    mov     r9, r1
    vpush   {d8-d15}
    sub     sp, sp, #76
    add     r2, sp, #168
    add     r12, sp, #28
    add     r4, sp, #24
    add     r3, sp, #12
    vldmia  r2, {s16-s31}
    add     r2, sp, #20
    stmia   sp, {r2, r4, r12}
    add     r2, sp, #16
    bl      \prepare
    ldrsh   r6, [sp, #12]
    mov     r4, #0
    cmp     r6, #0
    ble     .Ldt69_search_miss\@
.Ldt69_search_loop\@:
    add     r0, sp, #4
    add     r3, sp, #68
    vstmia  r0, {s16-s31}
    mov     r2, r4
    mov     r1, r9
    mov     r0, r8
    str     r5, [sp]
    bl      \examine
    ldrsh   r2, [sp, #68]
    cmp     r2, r7
    beq     .Ldt69_search_found\@
    add     r2, r4, #1
    sxth    r4, r2
    cmp     r6, r4
    bgt     .Ldt69_search_loop\@
.Ldt69_search_miss\@:
    add     sp, sp, #76
    mov     r2, #0
    vpop    {d8-d15}
    mov     r1, r2
    mov     r0, r2
    pop     {r4, r5, r6, r7, r8, r9, lr}
    b       func_0014EA68-4
.Ldt69_search_found\@:
    add     sp, sp, #76
    vpop    {d8-d15}
    pop     {r4, r5, r6, r7, r8, r9, pc}
.size \name, .-\name
.endm

.macro DT69_ITERATE name, dispatch
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, lr}
    mov     r5, r0
    mov     r6, r1
    ldr     r7, .Ldt69_iterate_identity\@
    vpush   {d8}
    vmov.f32 s16, s0
    ldrb    r0, [r7, #1]
    cmp     r0, #0
    movne   r4, #0
    beq     .Ldt69_iterate_return\@
.Ldt69_iterate_loop\@:
    mov     r2, r6
    mov     r1, r5
    mov     r0, r4
    bl      func_0044E250
    cmp     r0, #0
    nop     {0}
    beq     .Ldt69_iterate_next\@
    ldrb    r1, [r7, #1]
    mov     r0, r4
    cmp     r1, #0
    moveq   r1, #4
    beq     .Ldt69_iterate_ready\@
    cmp     r0, #11
    bcc     .Ldt69_iterate_clamp\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    mov     r0, r0
    mov     r0, #0
.Ldt69_iterate_clamp\@:
    add     r0, r0, #4
    and     r1, r0, #255
.Ldt69_iterate_ready\@:
    sub     r0, r1, #4
    cmp     r0, #10
    ldr     r0, [r7, #16]
    vmov.f32 s0, s16
    ldrls   r0, [r0, #4]
    blls    \dispatch
.Ldt69_iterate_next\@:
    add     r0, r4, #1
    and     r4, r0, #255
    cmp     r4, #11
    bcc     .Ldt69_iterate_loop\@
.Ldt69_iterate_return\@:
    vpop    {d8}
    pop     {r4, r5, r6, r7, r8, pc}
.size \name, .-\name
.Ldt69_iterate_identity\@:
    .word global_load_11
.endm

.macro DT69_PACK name, map, classify
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r3, r4, r5, r6, r7, lr}
    mov     r4, r0
    mov     r6, r1
    ldr     r1, [r0]
    mov     r5, r2
    mov     r0, r2
    bl      \map
    mov     r0, r5
    bl      \classify
    cmp     r0, #1
    moveq   r1, #1
    movne   r1, #0
    mov     r0, #0
    and     r1, r1, #3
    orr     r1, r1, r0
    orr     r1, r1, r0
    str     r0, [sp]
    lsl     r2, r1, #16
    mov     r0, r4
    lsr     r2, r2, #24
    lsl     r2, r2, #8
    and     r2, r2, #65280
    orr     r3, r1, r2
    ldr     r2, [r4]
    mov     r1, r6
    bl      func_0013D4AC
    pop     {r3, r4, r5, r6, r7, pc}
.size \name, .-\name
.endm

.macro DT69_ALLOCATE name, attach
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r5, r0
    bl      service_context_secondary_69
    mov     r1, r0
    mov     r0, #40
    bl      func_00123480
    cmp     r0, #0
    beq     .Ldt69_allocate_attach\@
    mov     r4, r0
    mov     r0, r5
    bl      service_context_secondary_69
    mov     r1, r0
    mov     r0, r4
    bl      func_00109434
    ldr     r2, .Ldt69_allocate_identity\@
    mov     r1, #0
    str     r1, [r0, #24]
    str     r2, [r0]
    strb    r1, [r0, #37]
.Ldt69_allocate_attach\@:
    mov     r4, r0
    mov     r1, r0
    mov     r0, r5
    bl      \attach
    mov     r0, r4
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.Ldt69_allocate_identity\@:
    .word arm_duplicate_templates_69_allocated_node_dispatch_identity
.endm

.macro DT69_COPY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, lr}
    sub     sp, sp, #64
    mov     r4, r0
    mov     r2, #64
    mov     r0, sp
    bl      func_00300B28
    ldr     r0, [sp]
    ldr     r1, .Ldt69_copy_tag\@
    cmp     r0, r1
    movne   r0, #0
    bne     .Ldt69_copy_return\@
    add     r1, sp, #4
    vldmia  r1, {s1-s7}
    add     r1, r4, #60
    str     r0, [r4, #56]
    add     r4, r4, #88
    vstmia  r1, {s1-s7}
    add     r1, sp, #32
    mov     r0, #1
    vldmia  r1, {s0-s7}
    vstmia  r4, {s0-s7}
.Ldt69_copy_return\@:
    add     sp, sp, #64
    pop     {r4, pc}
.size \name, .-\name
.Ldt69_copy_tag\@:
    .word arm_duplicate_templates_69_copied_record_tag_identity
.endm

.global func_0014EA68
.global indexed_float_dispatch_secondary_a_69
.global indexed_float_dispatch_secondary_b_69
.global service_context_secondary_69
.global global_load_11
.global arm_duplicate_templates_69_allocated_node_dispatch_identity
.global arm_duplicate_templates_69_copied_record_tag_identity

DT69_SEARCH func_0049866C, func_00497E48, func_0049840C
DT69_SEARCH func_004995CC, func_00498DA0, func_00499388
DT69_ITERATE func_0044C63C, indexed_float_dispatch_secondary_a_69
DT69_ITERATE func_0044EC5C, indexed_float_dispatch_secondary_b_69
DT69_PACK func_00450D90, func_004D12A8, func_004D26FC
DT69_PACK func_0045174C, func_004D1E10, func_004D1CDC
DT69_ALLOCATE func_0052AF8C, func_00108CB0
DT69_ALLOCATE func_0052B1A8, func_001E711C
DT69_COPY func_0041097C
DT69_COPY func_004109DC
```

## Verification record

- The candidate finder compared every still-unmatched ARM function in the
  selected address lane after normalizing only direct-transfer immediates and
  PC-relative owned-pool references.
- Exact boundaries and non-overlap were checked against the complete neutral
  function inventory. Anonymous gaps are described but excluded from template
  ownership.
- A fresh GNU Arm Embedded 15.2 assembly of the mnemonic schedules was linked
  at each target function position using independently resolved branch and
  identity contracts.
- All ten complete bodies and all six owned pool slots compared exactly. The
  probe produced exactly 28 direct-transfer relocations and six
  `R_ARM_ABS32` pool relocations at the offsets listed in the config.
- No target byte sequence, encoding word, private literal value, or target hash
  was copied into the clean-room contract.
