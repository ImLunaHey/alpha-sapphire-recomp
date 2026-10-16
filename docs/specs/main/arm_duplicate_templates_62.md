# Probe-verified duplicate ARM templates 62

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, normalized complete-body duplicate grouping, bounded target
  control/data-flow inspection, direct-transfer resolution, post-body boundary
  inspection, and an independent GNU Arm Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named by
an existing tracked implementation contract was excluded. The concurrent IPC
batch 57, runtime batch 61, and duplicate batch 61 reservations were also
excluded. These two ARM-state functions share one 304-byte schedule, totaling
608 executable bytes:

```text
func_0052DCB4  func_0056CF84
```

## Observable contract

The sole entry argument in `r0` is an owner-like record. The routine saves the
owner, derives its offset-36 member, and calls `func_0017EA3C` with that member.
It then asks `func_0017E30C` to write a lookup key into the first stack word,
using the offset-12 word of a shared opaque context as the second argument. A
negative returned status conditionally calls `func_001603A0`; the exact
call-clobbered argument state is retained by the schedule.

The owner offset-100 word is a tree header. Its offset-4 word is the root, and
nodes have left, right, and unsigned key fields at offsets +8, +12, and +16.
The routine performs an unsigned lower-bound search for the generated key,
then accepts the candidate only when its key is equal. An exact match produces
the node's offset-20 address as the result.

When no exact node exists, the routine obtains a second token through
`func_0017E30C` into stack offset four and applies the same negative-status
check. It copies that token to stack offset zero and calls
`func_0018D348(owner + 84, stack_base)`. The returned value and `owner + 12`
are then passed to `func_0018D6D4`. It obtains a third token in the same way,
copies it to stack offset zero, and returns the result of a second
`func_0018D348(owner + 84, stack_base)` call.

Before either result is returned, `func_0017EA90` is called with `owner + 36`.
The target retains an arithmetic guard around this call: it clears the low
byte of the original owner value, sets bit zero, sign-extends the resulting low
byte, and tests it. The derived byte is one for every input, but the complete
guarded schedule, including both no-ops following the call, is normative.

Null or malformed non-null owners, tree headers, context records, or nodes
retain the target's original faulting behavior. Helper non-return behavior and
the inherited argument state of the three conditional failure calls are also
preserved rather than strengthened into a higher-level contract.

## Transfers, labels, identity, and boundaries

Each function has eight ordinary linked calls and three conditional linked
calls. GNU Arm Embedded represents the conditional `blne` sites with
`R_ARM_JUMP24` relocations even though the encoded operation retains link
semantics.

| Offset | Relocation | Destination | Role |
| ---: | --- | --- | --- |
| +28 | `R_ARM_CALL` | `func_0017EA3C` | enter owner guard |
| +44 | `R_ARM_CALL` | `func_0017E30C` | obtain lookup key |
| +52 | `R_ARM_JUMP24` | `func_001603A0` | lookup-key failure |
| +148 | `R_ARM_CALL` | `func_0017E30C` | obtain first creation token |
| +160 | `R_ARM_JUMP24` | `func_001603A0` | first-token failure |
| +180 | `R_ARM_CALL` | `func_0018D348` | first owner operation |
| +192 | `R_ARM_CALL` | `func_0018D6D4` | attach owner member |
| +204 | `R_ARM_CALL` | `func_0017E30C` | obtain second creation token |
| +216 | `R_ARM_JUMP24` | `func_001603A0` | second-token failure |
| +236 | `R_ARM_CALL` | `func_0018D348` | second owner operation |
| +260 | `R_ARM_CALL` | `func_0017EA90` | leave owner guard |

There are no indirect calls or external tail branches. Complete local branch
destinations are +80, +108, +128, +132, +256, +276, and +292.

Each function symbol ends at +304. One aligned word slot follows at +304 and
is loaded by the instruction at +32. Both slots denote the same opaque context
identity and contribute one `R_ARM_ABS32` relocation each. The private numeric
value is deliberately outside this contract, and the `.size` boundary must
precede the slot.

For `func_0052DCB4`, unrelated anonymous target code starts at +308 and the
next inventoried global begins at +356. For `func_0056CF84`, the next global
begins immediately after the slot at +308. The anonymous code is not owned by
this template and must not be copied or synthesized as part of it.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT62_BODY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, lr}
    bic     r2, r0, #255
    mov     r4, r0
    add     r5, r0, #36
    sub     sp, sp, #12
    orr     r6, r2, #1
    mov     r0, r5
    bl      func_0017EA3C
    ldr     r7, .Ldt62_context\@
    mov     r0, sp
    ldr     r1, [r7, #12]
    bl      func_0017E30C
    lsrs    r1, r0, #31
    blne    func_001603A0
    ldr     r1, [r4, #100]
    ldr     r3, [sp]
    mov     r12, r1
    ldr     r0, [r1, #4]
    cmp     r0, #0
    beq     .Ldt62_search_done\@
.Ldt62_search\@:
    ldr     r2, [r0, #16]
    cmp     r2, r3
    movhs   r1, r0
    ldrhs   r0, [r0, #8]
    ldrlo   r0, [r0, #12]
    cmp     r0, #0
    bne     .Ldt62_search\@
.Ldt62_search_done\@:
    cmp     r1, r12
    beq     .Ldt62_no_exact\@
    ldr     r0, [r1, #16]
    cmp     r0, r3
    bls     .Ldt62_candidate_checked\@
.Ldt62_no_exact\@:
    mov     r1, r12
.Ldt62_candidate_checked\@:
    cmp     r1, r12
    bne     .Ldt62_found\@
    ldr     r1, [r7, #12]
    add     r0, sp, #4
    bl      func_0017E30C
    lsrs    r1, r0, #31
    nop
    blne    func_001603A0
    ldr     r0, [sp, #4]
    mov     r1, sp
    str     r0, [sp]
    add     r0, r4, #84
    bl      func_0018D348
    add     r1, r4, #12
    nop
    bl      func_0018D6D4
    ldr     r1, [r7, #12]
    add     r0, sp, #4
    bl      func_0017E30C
    lsrs    r1, r0, #31
    nop
    blne    func_001603A0
    ldr     r0, [sp, #4]
    mov     r1, sp
    str     r0, [sp]
    add     r0, r4, #84
    bl      func_0018D348
    mov     r4, r0
    sxtb    r0, r6
    cmp     r0, #0
    beq     .Ldt62_return\@
.Ldt62_cleanup\@:
    mov     r0, r5
    bl      func_0017EA90
    nop
    nop
    b       .Ldt62_return\@
.Ldt62_found\@:
    sxtb    r0, r6
    cmp     r0, #0
    add     r4, r1, #20
    bne     .Ldt62_cleanup\@
.Ldt62_return\@:
    add     sp, sp, #12
    mov     r0, r4
    pop     {r4, r5, r6, r7, pc}
.size \name, .-\name
.Ldt62_context\@:
    .word duplicate62_shared_context_identity
.endm

DT62_BODY func_0052DCB4
DT62_BODY func_0056CF84
```

Labels must be uniquely scoped per expansion.

## Independent exact-probe evidence

The complete schedule above was assembled independently with GNU Arm Embedded
15.2. Both 304-byte bodies matched their target bodies after only the eleven
audited external transfer fields were normalized. Every local branch,
prologue, epilogue, arithmetic operation, memory operation, conditional
operation, and explicit no-op matched without normalization. The two target
slots were physically equal, and the relocatable probe produced one symbolic
post-body identity slot per expansion. Temporary probe and extracted material
were deleted after verification.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-62.json`. Keep all eleven transfer
destinations and the shared post-body word symbolic. A validator should check
body sizes, instruction counts, every ordered relocation and conditional-link
opcode, complete local branch destinations, slot placement and shared identity,
`.size` placement, anonymous-material boundaries, next-global boundaries, and
complete target-body identity after external-transfer normalization. Do not
transcribe target encodings, the private slot value, or anonymous target code
into source, scripts, configuration, or documentation.
