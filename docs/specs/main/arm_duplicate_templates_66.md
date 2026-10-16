# Probe-verified duplicate ARM templates 66

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body comparison after direct-transfer normalization,
  bounded target control/data-flow inspection, direct-transfer resolution,
  boundary inspection, and an independent GNU Arm Embedded 15.2 mnemonic-only
  probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named by
an existing tracked implementation contract was excluded. Candidate selection
was restricted to unmatched ARM-state functions at or above `0x00400000`,
keeping this lane disjoint from concurrent IPC work. Two duplicate pairs share
two complete schedules, totaling 944 executable bytes:

```text
func_0049B080  func_004A1E14
func_0056E77C  func_0056E944
```

## Allocate-and-populate record contract

`func_0049B080` and `func_004A1E14` share one 244-byte schedule. The routine
preserves the four register arguments and consumes additional arguments from
the incoming stack. It calls its expansion-specific allocator helper with the
original `r0` through `r3` values and the final two incoming words as stacked
arguments. A null helper result bypasses all record writes and is returned
unchanged.

For a non-null result, the routine writes the constant four at offset zero and
the original `r1`, `r2`, and `r3` values at offsets four, eight, and twelve.
It then populates three parallel groups. Each group contains an incoming
halfword followed by three incoming single-precision register-width values:
the group destinations begin at offsets 16, 32, and 48, with the three-value
payloads beginning four bytes after each halfword. The payload loads and
stores use the exact VFP single-register schedules in the assembly contract;
no floating-point arithmetic is performed.

Four bytes from the incoming pointer associated with the third group are
copied individually to record offsets 64 through 67. The next incoming
register-width value is copied through `s25` to offset 68. Four bytes from a
second incoming pointer are copied individually to offsets 72 through 75.
The low halfwords of the final two incoming words are stored at offsets 76 and
78, and zero is stored at offsets 80 and 84. The allocator result remains in
`r0` on return.

The incoming stack layout is observed exactly relative to the routine's entry
stack pointer: the three halfwords originate at +0, +16, and +32; the three
three-value payloads begin at +4, +20, and +36; the four-byte pointer is at
+48; the value copied through `s25` is at +52; the second four-byte pointer is
at +56; and the final words are at +60 and +64. Pointer validity, alignment,
helper behavior, and helper non-return behavior retain the target's original
faulting and call-clobber semantics.

Each expansion has one linked direct call at +80:

| Function | Relocation | Destination | Role |
| --- | --- | --- | --- |
| `func_0049B080` | `R_ARM_CALL` | `func_0049A0F8` | allocate record |
| `func_004A1E14` | `R_ARM_CALL` | `func_004A0CDC` | allocate record |

The sole local branch destination is +232. Each function symbol ends at +244
and owns no literal pool or trailing data. Unrelated anonymous target material
starts immediately at +244. The next inventoried globals start at +4208 and
+4216 respectively. That anonymous material is not owned by this template and
must not be copied or synthesized.

## Append-intrusive-record contract

`func_0056E77C` and `func_0056E944` share one 228-byte schedule. The routine
accepts a mutable owner in `r0` and a source record in `r1`. It removes the
first entry from the free-list rooted at owner offset four when one exists,
updating that owner field from the entry's offset-zero link. The owner word at
offset 16 is retained as the sentinel used by the final intrusive-list insert.

When the free-list is empty, the routine compares the cursor and end pointers
at owner offsets eight and twelve. If storage is exhausted, it chooses a
capacity of 32 when the owner has no current allocation. Otherwise it computes
one and five-eighths of the old capacity, but raises that result to old
capacity plus 32 when the latter is larger. It allocates a 12-byte header and
then `capacity * 56` bytes of record storage through two calls to
`func_00184990`. The storage pointer is written at header offset eight; the
old header and new capacity are written at header offsets zero and four. The
new header becomes owner offset zero, while the new storage start and end
pointers become owner offsets eight and twelve.

The selected cursor becomes the record pointer, and owner offset eight is
advanced by 56 bytes. When record-pointer-plus-eight is non-null, the routine
calls `func_0020675C` with that adjusted pointer and the source. It then copies
four words from source offset 32 to offset 32 of the returned pointer. The
adjusted-pointer null test and its bypass behavior are normative even where
ordinary valid allocations would make the condition redundant.

Finally the record is inserted immediately before the retained sentinel. The
sentinel is stored at record offset zero, the sentinel's previous offset-four
link is stored at record offset four, that previous link's offset-zero word is
updated to the record, and the sentinel's offset-four word is also updated to
the record. Owner offset 20 is incremented and the routine returns without
placing a defined result in `r0` beyond the value left by the exact path.

Both expansions have the same three linked direct calls:

| Offset | Relocation | Destination | Role |
| ---: | --- | --- | --- |
| +92 | `R_ARM_CALL` | `func_00184990` | allocate 12-byte header |
| +108 | `R_ARM_CALL` | `func_00184990` | allocate record storage |
| +168 | `R_ARM_CALL` | `func_0020675C` | copy record prefix |

The complete set of local branch destinations is +88, +144, +156, and +188.
Each function symbol ends at +228, owns no literal pool or trailing material,
and is followed immediately by the next inventoried global.

Null or malformed non-null owner, free-list, allocation-header, storage,
source, record, sentinel, or intrusive-link pointers retain the target's
original conditional-access and faulting behavior. Allocation or copy-helper
failure, non-return behavior, and normal call-clobber effects are preserved
rather than strengthened into a higher-level contract.

## Complete exact schedules

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT66_RECORD name, allocator
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, r11, lr}
    mov     r7, r2
    mov     r8, r3
    vpush   {d8-d12}
    sub     sp, sp, #12
    add     r4, sp, #92
    add     r6, sp, #144
    ldmia   r6, {r5, r12, lr}
    mov     r6, r1
    ldr     r9, [sp, #88]
    ldr     r10, [sp, #104]
    ldr     r11, [sp, #120]
    vldr    s25, [sp, #140]
    vldmia  r4, {s16-s18}
    add     r4, sp, #108
    vldmia  r4, {s19-s21}
    add     r4, sp, #124
    vldmia  r4, {s22-s24}
    ldr     r4, [sp, #136]
    stmia   sp, {r12, lr}
    bl      \allocator
    cmp     r0, #0
    beq     .Ldt66_record_return\@
    mov     r2, #4
    stmia   r0, {r2, r6, r7, r8}
    add     r2, r0, #20
    mov     r1, #0
    strh    r9, [r0, #16]
    vstmia  r2, {s16-s18}
    add     r2, r0, #36
    strh    r10, [r0, #32]
    vstmia  r2, {s19-s21}
    add     r2, r0, #52
    strh    r11, [r0, #48]
    vstmia  r2, {s22-s24}
    ldrb    r2, [r4]
    strb    r2, [r0, #64]
    ldrb    r2, [r4, #1]
    strb    r2, [r0, #65]
    ldrb    r2, [r4, #2]
    strb    r2, [r0, #66]
    ldrb    r2, [r4, #3]
    strb    r2, [r0, #67]
    vstr    s25, [r0, #68]
    ldrb    r2, [r5]
    strb    r2, [r0, #72]
    ldrb    r2, [r5, #1]
    strb    r2, [r0, #73]
    ldrb    r2, [r5, #2]
    strb    r2, [r0, #74]
    ldrb    r2, [r5, #3]
    strb    r2, [r0, #75]
    ldr     r2, [sp]
    strh    r2, [r0, #76]
    ldr     r2, [sp, #4]
    strh    r2, [r0, #78]
    str     r1, [r0, #80]
    str     r1, [r0, #84]
.Ldt66_record_return\@:
    add     sp, sp, #12
    vpop    {d8-d12}
    pop     {r4, r5, r6, r7, r8, r9, r10, r11, pc}
.size \name, .-\name
.endm

.macro DT66_APPEND name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, lr}
    mov     r4, r0
    mov     r8, r1
    ldr     r5, [r0, #4]!
    ldr     r7, [r0, #12]
    cmp     r5, #0
    ldrne   r0, [r5]
    strne   r0, [r4, #4]
    bne     .Ldt66_have_slot\@
    ldrd    r0, r1, [r4, #8]
    cmp     r0, r1
    bne     .Ldt66_use_tail\@
    ldr     r0, [r4]
    cmp     r0, #0
    moveq   r5, #32
    beq     .Ldt66_have_capacity\@
    ldr     r0, [r0, #4]
    add     r1, r0, r0, lsr #1
    add     r5, r1, r0, lsr #3
    add     r0, r0, #32
    cmp     r0, r5
    movhi   r5, r0
.Ldt66_have_capacity\@:
    mov     r0, #12
    bl      func_00184990
    mov     r6, r0
    rsb     r0, r5, r5, lsl #3
    lsl     r0, r0, #3
    bl      func_00184990
    str     r0, [r6, #8]
    ldr     r0, [r4]
    rsb     r1, r5, r5, lsl #3
    stmia   r6, {r0, r5}
    str     r6, [r4]
    ldr     r0, [r6, #8]
    add     r1, r0, r1, lsl #3
    strd    r0, r1, [r4, #8]
.Ldt66_use_tail\@:
    ldr     r5, [r4, #8]
    add     r0, r5, #56
    str     r0, [r4, #8]
.Ldt66_have_slot\@:
    adds    r0, r5, #8
    beq     .Ldt66_link\@
    mov     r1, r8
    bl      func_0020675C
    add     r8, r8, #32
    add     r0, r0, #32
    ldmia   r8, {r1, r2, r3, r12}
    stmia   r0, {r1, r2, r3, r12}
.Ldt66_link\@:
    str     r7, [r5]
    ldr     r0, [r7, #4]
    str     r0, [r5, #4]
    ldr     r0, [r7, #4]
    str     r5, [r0]
    str     r5, [r7, #4]
    ldr     r0, [r4, #20]
    add     r0, r0, #1
    str     r0, [r4, #20]
    pop     {r4, r5, r6, r7, r8, pc}
.size \name, .-\name
.endm

DT66_RECORD func_0049B080, func_0049A0F8
DT66_RECORD func_004A1E14, func_004A0CDC
DT66_APPEND func_0056E77C
DT66_APPEND func_0056E944
```

Labels must be uniquely scoped per expansion.

## Independent exact-probe evidence

The two complete schedules above were assembled independently with GNU Arm
Embedded 15.2. All four complete bodies matched their target bodies after only
the audited external direct-transfer fields were normalized. Every local
branch, prologue, epilogue, VFP operation, memory operation, conditional
operation, and arithmetic operation matched without normalization. The
relocatable probe produced exactly one `R_ARM_CALL` relocation for each
allocate-and-populate expansion and three `R_ARM_CALL` relocations for each
append expansion. Temporary probe and extracted material were deleted after
verification.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-66.json`. Keep every direct transfer symbolic.
A validator should check body sizes, instruction counts, exact ordered
relocations, complete local branch destinations, absence of owned literal
material, anonymous-material and next-global boundaries, and complete target
body identity after direct-transfer normalization. Do not transcribe target
encodings or private target material into source, scripts, configuration, or
documentation.
