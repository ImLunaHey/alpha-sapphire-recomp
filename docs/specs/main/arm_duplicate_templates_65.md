# Probe-verified duplicate ARM templates 65

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, direct-transfer-normalized complete-body duplicate grouping, bounded
  target control/data-flow inspection, direct-transfer resolution, boundary
  inspection, and an independent GNU Arm Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named by
an existing tracked implementation contract was excluded. Candidate selection
was restricted to ARM-state functions at or above `0x00400000`, keeping this
lane disjoint from concurrent IPC and runtime work. These two functions share
one 256-byte schedule, totaling 512 executable bytes:

```text
func_0056EF44  func_0056F044
```

## Observable contract

The routine accepts a mutable owner record in `r0`, retains it in `r4`, and
returns the same pointer. If the owner word at offset 16 is null, it returns
immediately without changing the owner. Otherwise, that word denotes a
sentinel-like record, whose offset-zero link supplies the first node of an
intrusive chain.

Until the current node equals the sentinel, each iteration unlinks the current
node from a two-link structure. It loads the current node's offset-zero and
offset-four links, stores the former link into the word addressed by the
latter, and stores the latter link into offset four of the former. It then
decrements the owner word at offset 20. Finally, it prepends the removed node
to the chain rooted at owner offset four and advances using the original
offset-zero link. The repeated load and equality test against owner offset 16,
including its equality-only move and branch back to the loop test, are
normative. Once the sentinel is reached, the current owner-offset-four link is
stored at sentinel offset zero, and the sentinel is installed at owner offset
four.

The routine next consumes the singly linked chain rooted at owner offset zero.
On each iteration it retains the current node, advances owner offset zero from
the node's offset-zero link, and conditionally destroys an auxiliary pointer
loaded from node offset eight. For a non-null auxiliary pointer, the pointer is
adjusted backward by eight bytes and the word at that adjusted address is
treated as an optional indirect callback. A non-null callback is invoked with
the adjusted pointer in `r0`. A null callback executes the explicit no-op and
calls `func_00302108` with that same adjusted pointer.

The node itself then follows an analogous destruction path. The callback word
is loaded eight bytes before the node and the callback, when non-null, is
invoked with the node-minus-eight address in `r0`. A null callback again
executes an explicit no-op and calls `func_00302108`. The explicit null test of
the retained node is preserved even though entry to the loop requires a
non-null chain head. Destruction repeats until owner offset zero is null. The
routine then writes zero to owner offsets four, eight, and twelve before
returning the owner pointer.

Null or malformed non-null owner, sentinel, node, link, auxiliary-storage, or
callback pointers retain the target's original conditional-access and faulting
behavior. Callback and fallback-helper non-return behavior and their ordinary
call-clobber effects are preserved rather than strengthened into a higher-level
contract.

## Transfers, labels, and boundaries

Each expansion has two linked calls to the same fallback helper and two
register-indirect linked calls:

| Function | Offset | Relocation | Destination | Role |
| --- | ---: | --- | --- | --- |
| both | +176 | `R_ARM_CALL` | `func_00302108` | destroy auxiliary storage when its callback is null |
| both | +216 | `R_ARM_CALL` | `func_00302108` | destroy node storage when its callback is null |

The indirect `blx r1` calls occur at +164 and +204. The complete set of local
branch destinations is +24, +100, +128, +172, +180, +212, +220, +232, and
+248.

Each function symbol ends at +256 and owns no literal pool or other trailing
material. The next inventoried global after `func_0056EF44` starts immediately
at +256. After `func_0056F044`, unrelated anonymous target code begins at +256
and the next inventoried global starts at +272. That anonymous material is not
owned by this template and must not be copied or synthesized as part of it.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT65_BODY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r4, r0
    ldr     r2, [r0, #16]
    cmp     r2, #0
    ldrne   r0, [r2]
    beq     .Ldt65_return\@
.Ldt65_unlink_test\@:
    cmp     r0, r2
    beq     .Ldt65_relink_sentinel\@
    ldr     r3, [r4, #16]
    mov     r1, r0
    cmp     r0, r3
    moveq   r0, r3
    beq     .Ldt65_unlink_test\@
    ldmia   r1, {r0, r3}
    ldr     r12, [r1]
    str     r12, [r3]
    ldmia   r1, {r3, r12}
    str     r12, [r3, #4]
    ldr     r3, [r4, #20]
    sub     r3, r3, #1
    str     r3, [r4, #20]
    ldr     r3, [r4, #4]
    str     r3, [r1]
    str     r1, [r4, #4]
    b       .Ldt65_unlink_test\@
.Ldt65_relink_sentinel\@:
    ldr     r0, [r4, #16]
    ldr     r1, [r4, #4]
    str     r1, [r0]
    str     r0, [r4, #4]
    ldr     r0, [r4]
    cmp     r0, #0
    beq     .Ldt65_clear_fields\@
.Ldt65_destroy_loop\@:
    mov     r5, r0
    ldr     r0, [r0]
    str     r0, [r4]
    ldr     r0, [r5, #8]
    cmp     r0, #0
    beq     .Ldt65_destroy_primary_done\@
    ldr     r1, [r0, #-8]!
    cmp     r1, #0
    beq     .Ldt65_destroy_primary_fallback\@
    blx     r1
    b       .Ldt65_destroy_primary_done\@
.Ldt65_destroy_primary_fallback\@:
    nop
    bl      func_00302108
.Ldt65_destroy_primary_done\@:
    cmp     r5, #0
    beq     .Ldt65_destroy_node_done\@
    ldr     r1, [r5, #-8]
    sub     r0, r5, #8
    cmp     r1, #0
    beq     .Ldt65_destroy_node_fallback\@
    blx     r1
    b       .Ldt65_destroy_node_done\@
.Ldt65_destroy_node_fallback\@:
    nop
    bl      func_00302108
.Ldt65_destroy_node_done\@:
    ldr     r0, [r4]
    cmp     r0, #0
    bne     .Ldt65_destroy_loop\@
.Ldt65_clear_fields\@:
    mov     r0, #0
    str     r0, [r4, #4]
    str     r0, [r4, #8]
    str     r0, [r4, #12]
.Ldt65_return\@:
    mov     r0, r4
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.endm

DT65_BODY func_0056EF44
DT65_BODY func_0056F044
```

Labels must be uniquely scoped per expansion.

## Independent exact-probe evidence

The complete schedule above was assembled independently with GNU Arm Embedded
15.2. Each 256-byte body matched its target body after only the linked-call
instruction fields at +176 and +216 were normalized. Every local branch,
prologue, epilogue, comparison, conditional operation, memory operation,
indirect call, and explicit no-op matched without normalization. The
relocatable probe produced exactly two `R_ARM_CALL` relocations per expansion,
both against `func_00302108`, and no literal relocation. Temporary probe and
extracted material were deleted after verification.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-65.json`. Keep both direct transfers symbolic.
A validator should check body sizes, instruction counts, exact ordered
relocations, indirect-call sites, complete local branch destinations,
anonymous-material and next-global boundaries, absence of literal slots, and
complete target-body identity after direct-transfer normalization. Do not
transcribe target encodings or private target material into source, scripts,
configuration, or documentation.
