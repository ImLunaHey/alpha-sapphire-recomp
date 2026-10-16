# Probe-verified duplicate ARM templates 53

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated function inventory, current objdiff report,
  complete-body structural comparison, bounded private-target control-flow
  inspection, and an independent GNU Arm Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Functions already exact, functions named by tracked contracts, and the
concurrent IPC and runtime batch 53 reservations were excluded. These three
ARM-state functions share one 1,020-byte schedule, totalling 3,060 executable
bytes:

```text
func_001B04BC  func_001B6ABC  func_001BD0BC
```

## Observable contract

This is a custom-ABI sixteen-lane block interpolation routine. It first saves
`r4`, `r10`, `r12`, and the return link, then invokes the expansion-specific
setup helper. The helper's returned `r0` through `r3` are preserved across
the remainder of this routine and are restored at return; the original
`r4`, `r10`, and `r12` are also restored. The body copies four source words
from `r11 - unitStride`, obtains an endpoint byte at
`r11 + farInputOffset - 1`, and expands the sixteen source bytes into a
128-byte stack work area containing value and signed-delta pairs.

The body then performs exactly sixteen iterations. Each iteration reads the
byte immediately before the current `r11`, combines it with the work area by
successive signed half-step interpolation, rounds each lane by adding 64
before an arithmetic shift by seven, packs four groups of four results into
four words, and advances `r11` by one unit stride in total. After the loop,
the stack work area is released, `r11` is rewound by sixteen unit strides,
and all explicitly saved registers return to their incoming values. Exact
32-bit wrapping arithmetic, byte-load behavior, signed shifts, read/write
order, and faulting behavior of invalid addresses are normative.

The expansion parameters are:

| Function | Setup helper | Unit stride | Far input | Final store step | Frame rewind |
| --- | --- | ---: | ---: | ---: | ---: |
| `func_001B04BC` | `func_001B047C` | 1024 | 15360 | 1012 | 16384 |
| `func_001B6ABC` | `func_001B6A7C` | 256 | 3840 | 244 | 4096 |
| `func_001BD0BC` | `func_001BD07C` | 512 | 7680 | 500 | 8192 |

For every row, the far-input displacement is fifteen unit strides, the final
store step is one unit stride minus the twelve bytes already advanced by the
first three stores, and the rewind is sixteen unit strides.

## Boundaries and control flow

Each function is 1,020 bytes and 255 ARM instructions. The only linked call
is at +4 and uses that expansion's setup helper. The only ordinary branch is
the loop-back branch at +1004 to the internal label at +500. There are no
indirect calls, tail branches, pool slots, or function-owned data words.

Anonymous non-function material begins at +1020 in the original layout, and
the next named global begins at +1296. That material is outside the function
body and is deliberately not part of this contract.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT53_BLOCK name, helper, unit, far_input, final_step, rewind
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r10, r12, lr}
    bl      \helper
    push    {r0, r1, r2, r3}
    sub     lr, r11, #\unit
    ldm     lr, {r0, r1, r2, r3}
    add     lr, r11, #\far_input
    ldrb    r4, [lr, #-1]
    lsr     r10, r3, #24
    add     r5, r4, r10
    add     r5, r5, #1
    asr     r5, r5, #1
    add     r5, r5, r6, lsl #1
    sub     r6, r5, r4
    add     r6, r6, #1
    lsl     r4, r4, #3
    sub     sp, sp, #128
    mov     lr, sp
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r0
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r0, lsr #8
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r0, lsr #16
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r0, lsr #24
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r1
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r1, lsr #8
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r1, lsr #16
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r1, lsr #24
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r2
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r2, lsr #8
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r2, lsr #16
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r2, lsr #24
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r3
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r3, lsr #8
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r3, lsr #16
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r3, lsr #24
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    sub     r9, r5, r10
    add     r9, r9, #1
    lsl     r10, r10, #3
    mov     lr, #16
.Ldt53_loop\@:
    add     r10, r10, r9, asr #1
    ldrb    r8, [r11, #-1]
    sub     r7, r10, r8, lsl #3
    add     r7, r7, #1
    lsl     r8, r8, #6
    add     r12, sp, #0
    ldm     r12, {r0, r1, r2, r3, r4, r5, r6, r12}
    add     r0, r0, r1, asr #1
    add     r2, r2, r3, asr #1
    add     r4, r4, r5, asr #1
    add     r6, r6, r12, asr #1
    str     r0, [sp]
    str     r2, [sp, #8]
    str     r4, [sp, #16]
    str     r6, [sp, #24]
    add     r8, r8, r7, asr #1
    add     r5, r0, r8
    add     r5, r5, #64
    asr     r5, r5, #7
    add     r8, r8, r7, asr #1
    add     r12, r2, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #8
    add     r8, r8, r7, asr #1
    add     r12, r4, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #16
    add     r8, r8, r7, asr #1
    add     r12, r6, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #24
    str     r5, [r11], #4
    add     r12, sp, #32
    ldm     r12, {r0, r1, r2, r3, r4, r5, r6, r12}
    add     r0, r0, r1, asr #1
    add     r2, r2, r3, asr #1
    add     r4, r4, r5, asr #1
    add     r6, r6, r12, asr #1
    str     r0, [sp, #32]
    str     r2, [sp, #40]
    str     r4, [sp, #48]
    str     r6, [sp, #56]
    add     r8, r8, r7, asr #1
    add     r5, r0, r8
    add     r5, r5, #64
    asr     r5, r5, #7
    add     r8, r8, r7, asr #1
    add     r12, r2, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #8
    add     r8, r8, r7, asr #1
    add     r12, r4, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #16
    add     r8, r8, r7, asr #1
    add     r12, r6, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #24
    str     r5, [r11], #4
    add     r12, sp, #64
    ldm     r12, {r0, r1, r2, r3, r4, r5, r6, r12}
    add     r0, r0, r1, asr #1
    add     r2, r2, r3, asr #1
    add     r4, r4, r5, asr #1
    add     r6, r6, r12, asr #1
    str     r0, [sp, #64]
    str     r2, [sp, #72]
    str     r4, [sp, #80]
    str     r6, [sp, #88]
    add     r8, r8, r7, asr #1
    add     r5, r0, r8
    add     r5, r5, #64
    asr     r5, r5, #7
    add     r8, r8, r7, asr #1
    add     r12, r2, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #8
    add     r8, r8, r7, asr #1
    add     r12, r4, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #16
    add     r8, r8, r7, asr #1
    add     r12, r6, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #24
    str     r5, [r11], #4
    add     r12, sp, #96
    ldm     r12, {r0, r1, r2, r3, r4, r5, r6, r12}
    add     r0, r0, r1, asr #1
    add     r2, r2, r3, asr #1
    add     r4, r4, r5, asr #1
    add     r6, r6, r12, asr #1
    str     r0, [sp, #96]
    str     r2, [sp, #104]
    str     r4, [sp, #112]
    str     r6, [sp, #120]
    add     r8, r8, r7, asr #1
    add     r5, r0, r8
    add     r5, r5, #64
    asr     r5, r5, #7
    add     r8, r8, r7, asr #1
    add     r12, r2, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #8
    add     r8, r8, r7, asr #1
    add     r12, r4, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #16
    add     r8, r8, r7, asr #1
    add     r12, r6, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #24
    str     r5, [r11], #\final_step
    subs    lr, lr, #1
    bne     .Ldt53_loop\@
    add     sp, sp, #128
    sub     r11, r11, #\rewind
    pop     {r0, r1, r2, r3, r4, r10, r12, pc}
.size \name, .-\name
.endm

DT53_BLOCK func_001B04BC, func_001B047C, 1024, 15360, 1012, 16384
DT53_BLOCK func_001B6ABC, func_001B6A7C, 256, 3840, 244, 4096
DT53_BLOCK func_001BD0BC, func_001BD07C, 512, 7680, 500, 8192
```

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-53.json`. Preserve the unusual custom ABI,
the linked setup calls at +4, the local loop target, and the exact four store
increments. A validator should check body sizes, instruction counts, the
single local branch destination, call relocation targets, absence of owned
pool data, and complete linked byte identity against the approved target
artifact. Do not transcribe target encodings, private literal values, or
anonymous post-body material into source, scripts, configuration, or
documentation.
