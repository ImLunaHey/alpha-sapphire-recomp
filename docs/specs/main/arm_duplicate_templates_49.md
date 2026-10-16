# Probe-verified duplicate ARM templates 49

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated function inventory, current objdiff report,
  complete-body structural grouping, bounded private-target control/data-flow
  inspection, direct-branch resolution, physical post-body comparison, and an
  independent GNU Arm Embedded 15.2 exact-body probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Functions already exact in the current report and functions named by an
existing tracked implementation contract were excluded. The concurrent
runtime-helper batch 49 reservation was also excluded. The two functions below
are the highest-yield remaining structural ARM duplicate family after external
branches are represented symbolically: two 380-byte bodies, totalling 760
executable bytes.

```text
func_00493D18  func_004977B4
```

## Observable contract

Each routine accepts an owner-like record in `r0`, a secondary signed index in
`r1`, a primary signed index in `r2`, a signed parameter in `r3`, and one opaque
word at entry stack offset zero. A negative signed parameter restores the frame,
sets `r0-r2` to zero, and tail-branches to the offset-minus-four entry of
`func_0014EA68`.

On the normal path, the routine obtains a table through a shared opaque
post-body identity: it loads the identity's word, then that object's offset-60
word. The unsigned owner offset-32 index is required to be below 20. A valid
index selects the table element at word index one plus the owner index; a
non-null element contributes its offset-32 pointer. The out-of-range path
deliberately clears `r0-r2`, executes an inert `mov r0, r0`, and joins the
unchecked dispatch path. The selected pointer is dereferenced and its virtual
slot 28 is called. Preserve this exact faulting/unreachable behavior rather
than adding a guard. The indirect call's result remains in `r0` for the next
helper.

The primary index selects the owner's offset-120 word at a 172-byte stride.
The routine then constructs sixteen halfword output pointers covering stack
offsets 64 through 94, plus a signed-halfword count pointer at stack offset 96.
The expansion helper receives the indirect-call result in `r0`, the signed
entry parameter in `r1`, the opaque stacked word in `r2`, the count pointer in
`r3`, and the sixteen halfword pointers as stacked arguments in interleaved
low/high-array order.

If the returned signed-halfword count is positive, the secondary index selects
a 364-byte stride from the earlier table-derived pointer. For each signed
16-bit loop index from zero to count minus one, the routine calls
`func_00398FC0` with the primary selection's offset-120 word, the corresponding
signed halfword from each of the two eight-element output arrays, and the word
at offset 148 plus four times the loop index within the secondary selection.
The non-tail path returns with `r0` holding the sign-extended count. The exact
register, stack, signed-multiply, signed-load, branch, and return schedule below
is normative.

## Calls, labels, identity, and boundaries

Each body has two direct calls, one indirect call, and one tail branch:

| Offset | Kind | Identity |
| ---: | --- | --- |
| +108 | indirect call | selected object's virtual slot 28 |
| +264 | `R_ARM_CALL` | expansion helper |
| +324 | `R_ARM_CALL` | `func_00398FC0` |
| +376 | `R_ARM_JUMP24` | `func_0014EA68` with addend -4 |

Expansion helpers are:

| Function | Helper |
| --- | --- |
| `func_00493D18` | `func_0049866C` |
| `func_004977B4` | `func_004995CC` |

Complete local branch-target offsets are `+80`, `+96`, `+296`, `+348`, and
`+356`. Labels must be uniquely scoped per expansion.

Each function symbol ends at +380. One aligned word slot immediately follows
at +380 and is loaded by the instruction at +32. It is an opaque registry
identity, equal across both expansions, and contributes one `R_ARM_ABS32`
relocation. Its value must come from an approved clean-room identity provider.
Unrelated anonymous target material begins at +384, and the next global
function begins at +912 for both expansions. Neither region is owned by this
template.

## Complete exact schedule

The `.size` boundary deliberately precedes the shared identity slot.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT49_BODY name, helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, sl, fp, lr}
    sub sp, sp, #100
    subs r6, r3, #0
    mov r4, r0
    mov r8, r1
    ldr r9, [sp, #136]
    mov r7, r2
    blt .Ldt49_reject\@
    ldr r0, .Ldt49_slot\@
    mov r5, #0
    ldr r1, [r0]
    ldr r0, [r4, #32]
    ldr r1, [r1, #60]
    cmp r0, #20
    bhs .Ldt49_oob\@
    add r0, r1, r0, lsl #2
    ldr r0, [r0, #4]
    cmp r0, #0
    ldrne r5, [r0, #32]
    b .Ldt49_dispatch\@
.Ldt49_oob\@:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
.Ldt49_dispatch\@:
    ldr r0, [r5]
    ldr r1, [r0, #28]
    mov r0, r5
    blx r1
    mov r1, #43
    add r2, sp, #78
    smulbb r3, r7, r1
    add r1, sp, #94
    add ip, sp, #76
    add sl, sp, #36
    add r4, r4, r3, lsl #2
    add r3, sp, #92
    ldr r7, [r4, #120]
    str r1, [sp, #60]
    str r3, [sp, #52]
    add r1, sp, #90
    add r3, sp, #72
    str r2, [sp, #56]
    str ip, [sp, #48]
    str r1, [sp, #44]
    str r3, [sp, #32]
    add r2, sp, #88
    add ip, sp, #74
    stm sl, {r2, ip}
    add r1, sp, #86
    add r2, sp, #70
    str r1, [sp, #28]
    str r2, [sp, #24]
    add r3, sp, #84
    add r2, sp, #66
    add lr, sp, #12
    str r3, [sp, #20]
    str r2, [sp, #8]
    add ip, sp, #68
    add r1, sp, #82
    stm lr, {r1, ip}
    add fp, sp, #80
    add sl, sp, #64
    add r3, sp, #96
    mov r2, r9
    mov r1, r6
    strd sl, [sp]
    bl \helper
    ldrsh r0, [sp, #96]
    mov r4, #0
    cmp r0, #0
    ble .Ldt49_done\@
    mov r0, #91
    smulbb r0, r8, r0
    add r5, r5, r0, lsl #2
.Ldt49_loop\@:
    add r0, r5, r4, lsl #2
    add r1, sl, r4, lsl #1
    ldr r3, [r0, #148]
    add r0, fp, r4, lsl #1
    ldrsh r1, [r1]
    ldrsh r2, [r0]
    mov r0, r7
    bl func_00398FC0
    ldrsh r0, [sp, #96]
    add r1, r4, #1
    sxth r4, r1
    cmp r4, r0
    blt .Ldt49_loop\@
.Ldt49_done\@:
    add sp, sp, #100
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt49_reject\@:
    add sp, sp, #100
    mov r2, #0
    pop {r4, r5, r6, r7, r8, r9, sl, fp, lr}
    mov r1, r2
    mov r0, r2
    b func_0014EA68-4
.size \name, .-\name
.Ldt49_slot\@:
    .word duplicate49_shared_registry_identity
.endm
```

Instantiate the macro with the helper mapping above. The independent probe
linked each section at its inventory address with the shared identity supplied
privately and matched both 380-byte executable bodies and both following slots
exactly. Each relocatable expansion contained two `R_ARM_CALL` relocations,
one `R_ARM_JUMP24` relocation, and one `R_ARM_ABS32` relocation. Probe-only
files were deleted after validation.

## Acceptance checklist

- Both symbols are ARM, 380 bytes, and 95 instructions.
- Their combined executable contribution is 760 bytes.
- The five internal branch targets and all four call/branch sites match this
  contract.
- The expansion helper is the only direct-call identity that varies.
- The tail branch retains the offset-minus-four addend.
- The post-body identity slot is equal across both expansions and remains
  outside `.size`.
- Anonymous trailing material and the next global functions are not claimed.
