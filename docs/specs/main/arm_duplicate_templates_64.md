# Probe-verified duplicate ARM templates 64

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, direct-transfer-normalized complete-body duplicate grouping, bounded
  target control/data-flow inspection, direct-transfer resolution, post-body
  boundary inspection, and an independent GNU Arm Embedded 15.2 mnemonic-only
  probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named by
an existing tracked implementation contract was excluded. The concurrent
duplicate, IPC, and runtime batch 63 reservations were also excluded. These two
ARM-state functions share one 292-byte schedule, totaling 584 executable
bytes:

```text
func_00492E68  func_004968F0
```

## Observable contract

The routine accepts a destination record in `r0`, two fallback values in `r1`
and `r2`, and a descriptor-like pointer in `r3`. It retains all four inputs,
reserves a 64-byte stack buffer, and loads a pointer through a shared opaque
state identity. When that pointer is non-null, the destination word at offset
28 is set to one. The pointed-to record's offset-60 member and the original
descriptor are passed to `func_0049F360`; its result is stored at destination
offset 32. A negative result triggers `func_0011EF4C` with three zero
arguments. The path on which the shared pointer is null does not initialize
either destination word before later consuming destination offset 32.

The signed halfword at descriptor offset four selects how the 64-byte payload
at destination offset 36 is produced. A value of negative one copies 64 bytes
directly from the address stored at descriptor offset eight through
`func_00300B28`. Otherwise, the halfword indexes a 16-byte entry in a
per-expansion read-only table. The per-expansion descriptor helper writes an
intermediate 64-byte value to the stack, which `func_00300B28` then copies to
destination offset 36. The two explicit no-ops after this copy are normative.

The saved dispatch index at destination offset 32 is then checked unsigned
against 20. An in-range index selects a word from the shared state's offset-60
table, loads the selected record's offset-four pointer, and, when non-null,
loads an object pointer from that record's offset 32. The out-of-range path
retains a null object and performs the exact three-register clear plus
`mov r0, r0` schedule before joining. The selected object is dereferenced
unconditionally: the routine loads the indirect callee from offset 20 of the
object's leading dispatch table, then calls it with the object as its sole
explicit argument.

If the indirect result is nonnegative, the two words at selected-object
offsets 12 and 16 become `r1` and `r2`; otherwise the original fallback values
are restored. In either case the destination record is restored to `r0`, the
stack and saved registers are released, and control tail-branches to the
expansion's completion helper.

Null or malformed non-null destination, descriptor, shared-state, table-entry,
selected-record, object, or dispatch-table pointers retain the target's
original conditional-access and faulting behavior. Helper non-return behavior,
the use of destination offset 32 after a null shared pointer, and the inherited
call-clobbered state are preserved rather than strengthened into a higher-level
contract.

## Transfers, labels, identities, and boundaries

Each expansion has five linked direct calls, two external tail branches, and
one indirect linked call at +232. The ordered direct transfers are:

| Function | Offset | Relocation | Destination | Role |
| --- | ---: | --- | --- | --- |
| both | +56 | `R_ARM_CALL` | `func_0049F360` | select dispatch index |
| both | +84 | `R_ARM_CALL` | `func_0011EF4C` | negative-index failure |
| `func_00492E68` | +112 | `R_ARM_CALL` | `func_0012EC80` | expand descriptor |
| `func_004968F0` | +112 | `R_ARM_CALL` | `func_0012EF50` | expand descriptor |
| both | +128 | `R_ARM_CALL` | `func_00300B28` | copy expanded descriptor |
| both | +156 | `R_ARM_CALL` | `func_00300B28` | copy direct descriptor |
| `func_00492E68` | +264, +288 | `R_ARM_JUMP24` | `func_004930B4` | complete either result path |
| `func_004968F0` | +264, +288 | `R_ARM_JUMP24` | `func_00496B3C` | complete either result path |

The complete set of local branch destinations is +88, +144, +160, +204,
+220, and +268.

Each function symbol ends at +292. An aligned word at +292 is loaded by the
instruction at +12 and denotes the same opaque shared-state identity for both
expansions. A second aligned word at +296 is loaded by the instruction at +100
and denotes a distinct per-expansion read-only descriptor-table identity. All
three identities are symbolic; their private numeric values are deliberately
outside this contract. The `.size` boundary must precede both slots.

Unrelated anonymous target code starts at +300 in each extent. The next
inventoried global starts at +388. The anonymous code is not owned by this
template and must not be copied or synthesized as part of it.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT64_BODY name, descriptor_helper, completion_helper, shared_identity, descriptor_identity
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, lr}
    mov     r4, r0
    mov     r6, r1
    ldr     r8, .Ldt64_shared\@
    sub     sp, sp, #64
    mov     r7, r2
    mov     r5, r3
    ldr     r0, [r8]
    mov     r1, r3
    cmp     r0, #0
    beq     .Ldt64_descriptor\@
    mov     r2, #1
    str     r2, [r4, #28]
    ldr     r0, [r0, #60]
    bl      func_0049F360
    cmp     r0, #0
    str     r0, [r4, #32]
    bge     .Ldt64_descriptor\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    bl      func_0011EF4C
.Ldt64_descriptor\@:
    ldrsh   r0, [r5, #4]
    cmn     r0, #1
    beq     .Ldt64_direct_copy\@
    ldr     r1, .Ldt64_descriptor_identity\@
    add     r1, r1, r0, lsl #4
    mov     r0, sp
    bl      \descriptor_helper
    mov     r1, sp
    mov     r2, #64
    add     r0, r4, #36
    bl      func_00300B28
    nop
    nop
    b       .Ldt64_dispatch\@
.Ldt64_direct_copy\@:
    ldr     r1, [r5, #8]
    mov     r2, #64
    add     r0, r4, #36
    bl      func_00300B28
.Ldt64_dispatch\@:
    ldr     r1, [r8]
    ldr     r0, [r4, #32]
    mov     r5, #0
    ldr     r1, [r1, #60]
    cmp     r0, #20
    bcs     .Ldt64_invalid_index\@
    add     r0, r1, r0, lsl #2
    ldr     r0, [r0, #4]
    cmp     r0, #0
    ldrne   r5, [r0, #32]
    b       .Ldt64_indirect\@
.Ldt64_invalid_index\@:
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    mov     r0, r0
.Ldt64_indirect\@:
    ldr     r0, [r5]
    ldr     r1, [r0, #20]
    mov     r0, r5
    blx     r1
    cmp     r0, #0
    blt     .Ldt64_fallback\@
    add     r5, r5, #12
    mov     r0, r4
    ldmia   r5, {r1, r2}
    add     sp, sp, #64
    pop     {r4, r5, r6, r7, r8, lr}
    b       \completion_helper
.Ldt64_fallback\@:
    add     sp, sp, #64
    mov     r2, r7
    mov     r1, r6
    mov     r0, r4
    pop     {r4, r5, r6, r7, r8, lr}
    b       \completion_helper
.size \name, .-\name
.Ldt64_shared\@:
    .word   \shared_identity
.Ldt64_descriptor_identity\@:
    .word   \descriptor_identity
.endm

DT64_BODY func_00492E68, func_0012EC80, func_004930B4, duplicate64_shared_state_identity, duplicate64_descriptor_table_a_identity
DT64_BODY func_004968F0, func_0012EF50, func_00496B3C, duplicate64_shared_state_identity, duplicate64_descriptor_table_b_identity
```

Labels must be uniquely scoped per expansion.

## Independent exact-probe evidence

The complete schedule above was assembled independently with GNU Arm Embedded
15.2. Each 292-byte body matched its target body after only the seven audited
external direct-transfer fields were normalized. Every local branch,
prologue, epilogue, comparison, conditional operation, memory operation,
indirect call, and explicit no-op matched without normalization. The
relocatable probe produced exactly five `R_ARM_CALL` relocations, two
`R_ARM_JUMP24` relocations, and two `R_ARM_ABS32` relocations per expansion.
The pool-load targets and identity-sharing relationships were independently
verified. Temporary probe and extracted material were deleted after
verification.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-64.json`. Keep every direct transfer and pool
identity symbolic. A validator should check body sizes, instruction counts,
exact ordered relocations, complete local branch destinations, literal-load
targets, identity-sharing relationships, anonymous-material and next-global
boundaries, and complete target-body identity after direct-transfer
normalization. Do not transcribe target encodings or private target material
into source, scripts, configuration, or documentation.
