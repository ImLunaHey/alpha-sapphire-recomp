# Probe-verified duplicate ARM templates 67

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body comparison after direct-transfer normalization,
  bounded control/data-flow and boundary inspection, direct-transfer
  resolution, and an independent GNU Arm Embedded 15.2 mnemonic probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, private literal values, target hashes,
  extracted assets, or proprietary source.

Every function already exact in the current report and every function named by
an existing tracked implementation contract was excluded. Candidate selection
was restricted to unmatched ARM-state functions at or above `0x00400000`,
keeping the lane disjoint from concurrent low-address work. Two duplicate
pairs share two complete schedules, totaling 736 executable bytes:

```text
func_0056E4F0  func_0056E6A8
func_0056B390  func_0056B550
```

## Clear-intrusive-owner contract

`func_0056E4F0` and `func_0056E6A8` share a 212-byte schedule. The routine
retains its owner argument in `r4` and loads the sentinel from owner offset 16.
A null sentinel returns the owner unchanged.

Otherwise, it walks the intrusive list beginning at the sentinel's offset-zero
link. For every entry other than the currently reloaded sentinel, it saves the
entry's next link, unlinks the entry through its offset-zero and offset-four
links, decrements owner offset 20, and indirectly invokes the offset-zero
function pointer loaded through entry offset eight. The indirect call receives
entry-plus-eight in `r0`. The removed entry is then pushed onto the singly
linked free chain rooted at owner offset four. Iteration advances through the
saved next link until it reaches the original sentinel.

After the entry walk, the routine links the sentinel in front of the free
chain. It then consumes the allocation-header chain rooted at owner offset
zero. For each header it saves the header's offset-zero successor into the
owner, releases the pointer at header offset eight, and releases the header
itself. Both releases call `func_00160F9C`. When the chain is exhausted, zero
is written to owner offsets four, eight, and twelve, and the original owner is
returned.

Malformed non-null owner, sentinel, entry, link, dispatch, or allocation
pointers retain the target's original conditional accesses and faulting
behavior. Indirect-call and release-helper failure, non-return behavior, and
normal call clobbers are not strengthened into a higher-level contract.

The complete set of local branch destinations is +32, +104, +116, +144, +188,
and +204. The linked direct calls are:

| Offset | Relocation | Destination | Role |
| ---: | --- | --- | --- |
| +160 | `R_ARM_CALL` | `func_00160F9C` | release block storage |
| +172 | `R_ARM_CALL` | `func_00160F9C` | release block header |

There is one indirect linked transfer at +88. Each function symbol ends at
+212, owns no literal pool or trailing data, and is followed immediately by
the next inventoried global.

## Release-or-grow-pointer-storage contract

`func_0056B390` and `func_0056B550` share a 156-byte schedule. Let the signed
byte distance be owner offset 20 minus owner offset 16. The routine loads the
two words at owner offsets four and eight, subtracts one quarter of that byte
distance from the latter, and compares the result against twice the former.
If it is lower, the routine returns immediately.

When the arithmetic-shifted distance is nonzero, or when the adjusted owner
offset-eight word is greater than owner offset twelve, control goes to the
expansion-specific grow helper. That helper receives the owner in `r0` and the
distance divided by four in `r1`. A zero owner-offset-16 pointer on the
remaining path also returns immediately.

The release path performs the exact counting loop in the schedule, including
the zero-iteration bypass and the otherwise redundant final count. It calls
`func_0040AC94`, dereferences the result once, loads a dispatch pointer from
that object's offset zero, and invokes the function at dispatch offset four.
The indirect call receives the once-dereferenced object in `r0` and the saved
owner-offset-16 pointer in `r1`. It then clears owner offsets 20, 16, and eight.

Signed shifts, unsigned comparisons, arithmetic overflow, malformed pointers,
and helper or indirect-call failure retain the target's exact machine-level
behavior. The complete set of local branch destinations is +80, +92, +136,
and +140. There is one indirect linked transfer at +116. The linked direct
transfers are:

| Function | Offset | Relocation | Destination | Role |
| --- | ---: | --- | --- | --- |
| both | +96 | `R_ARM_CALL` | `func_0040AC94` | acquire release dispatch |
| `func_0056B390` | +148 | `R_ARM_CALL` | `func_0056B42C` | grow storage |
| `func_0056B550` | +148 | `R_ARM_CALL` | `func_0056B5EC` | grow storage |

Each function symbol ends at +156, owns no literal pool or trailing data, and
is followed immediately by its expansion-specific grow-helper global.

## Complete exact schedules

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT67_CLEAR name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, lr}
    mov     r4, r0
    ldr     r6, [r0, #16]
    cmp     r6, #0
    beq     .Lclear_return\@
    ldr     r5, [r6]
    cmp     r5, r6
    beq     .Lclear_relink\@
.Lclear_entry_loop\@:
    ldr     r7, [r4, #16]
    cmp     r5, r7
    beq     .Lclear_next\@
    ldr     r2, [r5, #4]
    ldr     r7, [r5]
    add     r0, r5, #8
    str     r7, [r2]
    ldmia   r5, {r1, r2}
    str     r2, [r1, #4]
    ldr     r1, [r4, #20]
    sub     r1, r1, #1
    str     r1, [r4, #20]
    ldr     r1, [r5, #8]
    ldr     r1, [r1]
    blx     r1
    ldr     r0, [r4, #4]
    str     r0, [r5]
    str     r5, [r4, #4]
.Lclear_next\@:
    cmp     r7, r6
    mov     r5, r7
    bne     .Lclear_entry_loop\@
.Lclear_relink\@:
    ldr     r0, [r4, #16]
    ldr     r1, [r4, #4]
    str     r1, [r0]
    str     r0, [r4, #4]
    ldr     r0, [r4]
    cmp     r0, #0
    beq     .Lclear_zero\@
.Lclear_block_loop\@:
    mov     r5, r0
    ldr     r0, [r0]
    str     r0, [r4]
    ldr     r0, [r5, #8]
    bl      func_00160F9C
    mov     r0, r5
    nop
    bl      func_00160F9C
    ldr     r0, [r4]
    cmp     r0, #0
    bne     .Lclear_block_loop\@
.Lclear_zero\@:
    mov     r0, #0
    str     r0, [r4, #4]
    str     r0, [r4, #8]
    str     r0, [r4, #12]
.Lclear_return\@:
    mov     r0, r4
    pop     {r4, r5, r6, r7, r8, pc}
.size \name, .-\name
.endm

.macro DT67_RELEASE name, grow
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r4, r0
    ldr     r1, [r0, #20]
    ldr     r5, [r0, #16]
    add     r0, r0, #4
    ldmia   r0, {r0, r2}
    sub     r1, r1, r5
    sub     r2, r2, r1, asr #2
    cmp     r2, r0, lsl #1
    bcc     .Lrelease_return\@
    asrs    r2, r1, #2
    bne     .Lrelease_grow\@
    ldr     r2, [r4, #12]
    cmp     r2, r0
    bhi     .Lrelease_grow\@
    cmp     r5, #0
    beq     .Lrelease_return\@
    mov     r0, #0
.Lrelease_count\@:
    cmp     r0, r1, asr #2
    bcs     .Lrelease_destroy\@
.Lrelease_count_loop\@:
    add     r0, r0, #1
    cmp     r0, r1, asr #2
    bcc     .Lrelease_count_loop\@
.Lrelease_destroy\@:
    nop
    bl      func_0040AC94
    ldr     r0, [r0]
    ldr     r1, [r0]
    ldr     r2, [r1, #4]
    mov     r1, r5
    blx     r2
    mov     r0, #0
    str     r0, [r4, #20]
    str     r0, [r4, #16]
    str     r0, [r4, #8]
.Lrelease_return\@:
    pop     {r4, r5, r6, pc}
.Lrelease_grow\@:
    asr     r1, r1, #2
    mov     r0, r4
    bl      \grow
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.endm

DT67_CLEAR func_0056E4F0
DT67_CLEAR func_0056E6A8
DT67_RELEASE func_0056B390, func_0056B42C
DT67_RELEASE func_0056B550, func_0056B5EC
```

## Independent probe result

GNU Arm Embedded 15.2 assembled all four schedules for ARMv6K/VFPv2. Each
probe section had the specified byte size and matched its complete target body
after normalizing only the immediate fields of direct branch instructions.
Local branch offsets remained exact. The probe object contained the eight
expected `R_ARM_CALL` records and no data relocations or owned literal slots.
All private probe source, objects, extracted section binaries, and comparison
scratch data were removed after verification.
