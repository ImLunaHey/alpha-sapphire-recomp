# Probe-verified duplicate ARM templates 52

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated function inventory, current objdiff report,
  complete-body structural grouping, bounded private-target control/data-flow
  inspection, section relocation inspection, and an independent GNU Arm
  Embedded 15.2 mnemonic-only exact-body probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Functions already exact in the current report and functions named by any
existing tracked implementation contract were excluded. The concurrent
runtime and IPC batch 52 reservations were also excluded. These three
ARM-state functions share one 240-byte executable schedule, totalling 720
executable bytes:

```text
func_001D0834  func_001D0928  func_001D0A1C
```

## Observable contract

The routine accepts an output handle cell in `r0`, an accumulator cell in
`r1`, and an operation-specific input in `r2`. It returns a result in `r0`.
Null output or accumulator cells, a zero operation input, or a zero current
accumulator return the shared symbolic result identity plus 16 without
accessing an output handle.

For valid inputs, the routine reuses the handle in the output cell when it is
nonzero. A zero output handle is acquired through `func_001D0F00`, which
writes a temporary handle cell and returns a result. A nonzero acquisition
result is returned after releasing any temporary handle that was produced.
If acquisition succeeds without producing a handle, zero is stored back to
the output cell and zero is returned.

The word at handle offset +4 is passed as the first argument to the
per-expansion operation. The other operation arguments are the current
accumulator value, the original `r2`, and a pointer to a zero-initialized
temporary contribution word. A nonzero operation result is returned after
cleanup. On operation success, `func_001CF858(handle_word, 0)` performs a
common finalization step. A nonzero finalization result is represented by the
shared symbolic result identity itself and follows the same cleanup path.
When both calls succeed, the temporary contribution is added to the
accumulator, the active handle is stored in the output cell, and zero is
returned.

Every failure path with a nonzero temporary handle calls `func_001D07E0` on
that handle before returning. The temporary handle cell is cleared after the
call. The exact null checks, dereference order, 32-bit wrapping addition, and
faulting behavior of non-null invalid pointers are normative.

The operation called at +128 is the sole expansion parameter:

| Function | Operation |
| --- | --- |
| `func_001D0834` | `func_001C4EE8` |
| `func_001D0928` | `func_001C4F18` |
| `func_001D0A1C` | `func_001C4F48` |

## Boundaries and symbolic material

Each function has a 240-byte body containing 60 ARM instructions. A single
word slot follows the body at +240 and the next global begins at +244. The
load at +16 addresses that slot. All three 4-byte-aligned slots denote one
shared, opaque result identity; the private numeric value is deliberately not
part of this contract. The body size directive must precede the slot so the
slot is not function-owned.

There are four linked calls, at +80, +128, +152, and +208. The first, third,
and fourth call `func_001D0F00`, `func_001CF858`, and `func_001D07E0`,
respectively. The +128 call uses the per-expansion operation in the table
above. There are no indirect calls or tail branches. All ordinary branch
destinations are local at offsets +104, +188, +196, +216, and +228.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT52_HANDLE name, operation
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, lr}
    sub     sp, sp, #8
    movs    r6, r0
    mov     r5, r1
    ldr     r8, .Ldt52_result_slot\@
    mov     r7, #0
    cmpne   r5, #0
    mov     r9, r2
    add     r4, r8, #16
    str     r7, [sp]
    beq     .Ldt52_return\@
    cmp     r9, #0
    ldrne   r0, [r5]
    cmpne   r0, #0
    beq     .Ldt52_return\@
    ldr     r0, [r6]
    cmp     r0, #0
    strne   r0, [sp]
    bne     .Ldt52_have_handle\@
    mov     r0, sp
    bl      func_001D0F00
    movs    r4, r0
    bne     .Ldt52_cleanup\@
    ldr     r0, [sp]
    cmp     r0, #0
    beq     .Ldt52_no_handle\@
.Ldt52_have_handle\@:
    ldr     r10, [r0, #4]
    str     r7, [sp, #4]
    ldr     r1, [r5]
    add     r3, sp, #4
    mov     r2, r9
    mov     r0, r10
    bl      \operation
    movs    r4, r0
    nop
    bne     .Ldt52_cleanup\@
    mov     r1, #0
    mov     r0, r10
    bl      func_001CF858
    cmp     r0, #0
    movne   r4, r8
    bne     .Ldt52_cleanup\@
    ldr     r0, [r5]
    ldr     r1, [sp, #4]
    add     r0, r0, r1
    str     r0, [r5]
    b       .Ldt52_success\@
.Ldt52_no_handle\@:
    cmp     r4, #0
    beq     .Ldt52_success\@
.Ldt52_cleanup\@:
    ldr     r0, [sp]
    cmp     r0, #0
    beq     .Ldt52_return\@
    bl      func_001D07E0
    str     r7, [sp]
.Ldt52_return\@:
    add     sp, sp, #8
    mov     r0, r4
    pop     {r4, r5, r6, r7, r8, r9, r10, pc}
.Ldt52_success\@:
    ldr     r0, [sp]
    str     r0, [r6]
    b       .Ldt52_return\@
.size \name, .-\name
.Ldt52_result_slot\@:
    .word   duplicate52_shared_result_identity
.endm

DT52_HANDLE func_001D0834, func_001C4EE8
DT52_HANDLE func_001D0928, func_001C4F18
DT52_HANDLE func_001D0A1C, func_001C4F48
```

The explicit no-op at +136 is required. The conditional comparison at +24
must retain the condition produced by the `movs` at +8; replacing it with
ordinary source-level short-circuit logic is not schedule-equivalent.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-52.json`. Keep every external destination and
the post-body word symbolic. A validator should check body sizes, instruction
counts, local branch destinations, all four call relocations, the shared slot
identity, the position of `.size`, and complete byte identity against the
approved target artifact. Do not transcribe target encodings or private
literal values into source, scripts, configuration, or documentation.
