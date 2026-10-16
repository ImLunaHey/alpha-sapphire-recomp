# Probe-verified Thumb leaf/helper batch 01

Source SHA-256: `33f5074d59f9215e913e5c47b2a5bf1613e2e0c9cbaeadec31b5ac35ff59b814`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
Thumb-state leaf/helper functions totaling 470 executable bytes and
235 instructions. Evidence was limited to the current unmatched objdiff
report, neutral symbol and section inventories, recursive configuration
ownership/reference auditing, bounded private-target control/data-flow
inspection, and an independently assembled exact-schedule probe. The target is
revision `AS_EUR_REV2`; GNU Arm binutils 2.45.1 was used with ARMv6K
selection on 2026-10-16.

Every selected function is complete and symbol-bounded. The batch has no call,
external direct branch, relocation, owned adjacent data, private string, or
asset. Twenty-three functions have no PC-relative access. The sole exception,
`func_0010420C`, has a Thumb literal-form load at offset zero whose effective
address is exactly the first unowned byte after its four-byte body. The batch
does not emit or claim that byte and requires no target-object identity mapping.
Its original entry is word-aligned, which is required by the architectural
aligned-PC rule even though the input section records only two-byte alignment.
Two helpers end either by normal return or by an indirect tail dispatch; all
other exits are returns. Independent assembly reproduced all 470 target bytes
with a zero-byte exact diff, and both target and probe sections have zero
relocations.

## Structural and boundary inventory

All sections execute in Thumb state, require two-byte alignment, and contain
only 16-bit instructions. Return sites and indirect tail sites are excluded
from the local-branch count.

| Function | Bytes | Instructions | Local branches | Memory ops | Returns | Indirect tails | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0030232C` | 8 | 4 | 0 | 1 | 1 | 0 | `func_00302334` (+8) |
| `func_00302C50` | 10 | 5 | 1 | 1 | 1 | 0 | `func_00302C5C` (+12) |
| `func_0030490A` | 10 | 5 | 0 | 3 | 1 | 0 | `func_00304914` (+10) |
| `func_003034C0` | 12 | 6 | 1 | 0 | 2 | 0 | `func_003034CC` (+12) |
| `func_002FFB94` | 14 | 7 | 1 | 0 | 2 | 0 | `func_002FFBAE` (+26) |
| `func_00303304` | 14 | 7 | 1 | 2 | 1 | 0 | `func_00303314` (+16) |
| `func_00304766` | 14 | 7 | 0 | 6 | 1 | 0 | `func_00304774` (+14) |
| `func_002FEDC0` | 16 | 8 | 1 | 4 | 1 | 0 | `func_002FEDD0` (+16) |
| `func_00303934` | 16 | 8 | 1 | 2 | 2 | 0 | `func_00303944` (+16) |
| `func_00303944` | 16 | 8 | 1 | 2 | 2 | 0 | `func_00303954` (+16) |
| `func_00304774` | 16 | 8 | 1 | 2 | 2 | 0 | `func_00304784` (+16) |
| `func_003048BE` | 18 | 9 | 2 | 1 | 2 | 0 | `func_003048D0` (+18) |
| `func_00304974` | 18 | 9 | 1 | 6 | 1 | 0 | `func_00304C58` (+740) |
| `func_00304DB4` | 18 | 9 | 2 | 2 | 1 | 0 | `func_00304DC6` (+18) |
| `func_003055D4` | 18 | 9 | 2 | 2 | 1 | 0 | `func_003055E6` (+18) |
| `func_00301D1C` | 20 | 10 | 0 | 4 | 1 | 0 | `func_00301D30` (+20) |
| `func_002FF972` | 22 | 11 | 2 | 1 | 2 | 0 | `func_002FF988` (+22) |
| `func_00304DEE` | 24 | 12 | 2 | 3 | 2 | 0 | `func_00304E3C` (+78) |
| `func_0030560E` | 26 | 13 | 2 | 3 | 2 | 0 | `func_0030570C` (+254) |
| `func_002FEDD0` | 30 | 15 | 3 | 0 | 1 | 0 | `func_002FEDF0` (+32) |
| `func_0030242A` | 40 | 20 | 1 | 8 | 2 | 0 | `func_00302452` (+40) |
| `func_00304D7E` | 42 | 21 | 2 | 9 | 1 | 1 | `func_00304DA8` (+42) |
| `func_003055A8` | 44 | 22 | 2 | 9 | 1 | 1 | `func_003055D4` (+44) |
| `func_0010420C` | 4 | 2 | 0 | 1 | 1 | 0 | `func_001042A6` (+154) |

Totals: 235 instructions, 29 local branches, 72 memory
operations, 34 return sites, two indirect tail sites, zero calls, and zero
relocations. A next-global offset larger than the body size denotes unowned
padding; no such padding is emitted by this batch.

## Canonical schedules and hashes

Canonical instruction records are
`function:offset:mnemonic:operands`; local transfers replace their operand
with `local:+target`. Offsets and targets are lowercase hexadecimal without
an `0x` prefix. Records are joined by LF with no terminal newline.

- Full mnemonic/operand schedule: `82de23679dba280a97b763b9d8ae94fceaeff53df34f808173288bf8beaed131`
- Local-transfer schedule: `491f6998c9987816e500d407e99990b875340608c269591b731efa793fb28275`
- Return/indirect-tail schedule: `47530e42d17f362b2ffc5aa8809852931757e78c7b9217e4275842f4ba75126c`

The configuration contains every ordered instruction and every exact local
branch destination, return site, indirect-tail site, boundary, and count.
Equivalent uniquely scoped local-label names are permitted, but instruction
selection, flags behavior, operand order, branch width, order, mode, alignment,
and section boundary are normative.

## Unmatched, uniqueness, and collision audit

All twenty-four selected report entries are unmatched at zero percent. Their
names are pairwise distinct, their symbol intervals are pairwise disjoint, and
none of the selected names appeared among the 17,269 string leaves (6,169
distinct strings; 3,209 distinct function-shaped names) in the 224 top-level
JSON configurations present at selection time. The audit includes owners,
aliases, branch destinations, identity members, next-global annotations, and
secondary entries. No selected interval overlaps an already configured
interval, including `arm-thumb-runtime-helpers-12`.

Complete-body comparison against all 10,440 target functions yields twenty-one
byte-body classes. Nineteen are singleton classes. The remaining exact classes
are deliberately explicit: `func_00303934`, `func_00303944`, and
`func_00304774` share one complete body; `func_00304DB4` and
`func_003055D4` share another. There are no unrecorded selected-body
collisions.

## Completeness contract

The implementation must define exactly these twenty-four global Thumb
functions in individual `.text.<name>` sections and stop every section at its
recorded body size. It must emit no pool word, padding byte, string, asset,
external symbol reference, relocation, call, or direct external branch. In
particular, `func_0010420C` emits only its two instructions; the post-body
read target is not owned by this batch.

The following is the complete independently assembled artifact:

```asm
.syntax unified
.arch armv6k
.thumb

.macro TL01_BEGIN name
.section .text.\name,"ax",%progbits
.balign 2
.global \name
.type \name,%function
.thumb_func
\name:
.endm

.macro TL01_END name
.size \name,.-\name
.endm

TL01_BEGIN func_0030232C
    ldr r0, [r0, #12]
    movs r1, #128
    ands r0, r1
    bx lr
TL01_END func_0030232C

TL01_BEGIN func_00302C50
    ldr r0, [r0]
    cmp r0, #0
    beq.n .Ltl01_00302c50_return
    movs r0, #1
.Ltl01_00302c50_return:
    bx lr
TL01_END func_00302C50

TL01_BEGIN func_0030490A
    str r1, [r0]
    movs r1, #0
    str r1, [r0, #4]
    str r1, [r0, #8]
    bx lr
TL01_END func_0030490A

TL01_BEGIN func_003034C0
    lsrs r0, r0, #8
    beq.n .Ltl01_003034c0_true
    movs r0, #0
    bx lr
.Ltl01_003034c0_true:
    movs r0, #1
    bx lr
TL01_END func_003034C0

TL01_BEGIN func_002FFB94
    subs r0, #48
    cmp r0, #10
    bcs.n .Ltl01_002ffb94_false
    movs r0, #1
    bx lr
.Ltl01_002ffb94_false:
    movs r0, #0
    bx lr
TL01_END func_002FFB94

TL01_BEGIN func_00303304
    ldr r0, [r0, #20]
    lsls r2, r2, #1
    ldrh r0, [r0, r2]
    ands r0, r1
    beq.n .Ltl01_00303304_return
    movs r0, #1
.Ltl01_00303304_return:
    bx lr
TL01_END func_00303304

TL01_BEGIN func_00304766
    ldr r2, [r1]
    str r2, [r0]
    ldr r2, [r1, #8]
    ldr r1, [r1, #4]
    str r2, [r0, #8]
    str r1, [r0, #4]
    bx lr
TL01_END func_00304766

TL01_BEGIN func_002FEDC0
    ldr r3, [r1, #4]
    ldr r2, [r1]
    cmp r2, r3
    bcs.n .Ltl01_002fedc0_return
    adds r3, r2, #2
    str r3, [r1]
    strh r0, [r2]
.Ltl01_002fedc0_return:
    bx lr
TL01_END func_002FEDC0

TL01_BEGIN func_00303934
    ldr r0, [r0]
    ldr r1, [r1]
    cmp r0, r1
    bne.n .Ltl01_00303934_false
    movs r0, #1
    bx lr
.Ltl01_00303934_false:
    movs r0, #0
    bx lr
TL01_END func_00303934

TL01_BEGIN func_00303944
    ldr r0, [r0]
    ldr r1, [r1]
    cmp r0, r1
    bne.n .Ltl01_00303944_false
    movs r0, #1
    bx lr
.Ltl01_00303944_false:
    movs r0, #0
    bx lr
TL01_END func_00303944

TL01_BEGIN func_00304774
    ldr r0, [r0]
    ldr r1, [r1]
    cmp r0, r1
    bne.n .Ltl01_00304774_false
    movs r0, #1
    bx lr
.Ltl01_00304774_false:
    movs r0, #0
    bx lr
TL01_END func_00304774

TL01_BEGIN func_003048BE
    cmp r0, #0
    beq.n .Ltl01_003048be_true
    ldr r0, [r0]
    cmp r0, #0
    beq.n .Ltl01_003048be_true
    movs r0, #0
    bx lr
.Ltl01_003048be_true:
    movs r0, #1
    bx lr
TL01_END func_003048BE

TL01_BEGIN func_00304974
    cmp r1, r0
    beq.n .Ltl01_00304974_return
    ldr r2, [r1]
    str r2, [r0]
    ldr r2, [r1, #8]
    ldr r1, [r1, #4]
    str r2, [r0, #8]
    str r1, [r0, #4]
.Ltl01_00304974_return:
    bx lr
TL01_END func_00304974

TL01_BEGIN func_00304DB4
    ldr r2, [r0, #16]
    movs r3, #2
    cmp r1, #0
    beq.n .Ltl01_00304db4_clear
    orrs r2, r3
    b.n .Ltl01_00304db4_store
.Ltl01_00304db4_clear:
    bics r2, r3
.Ltl01_00304db4_store:
    str r2, [r0, #16]
    bx lr
TL01_END func_00304DB4

TL01_BEGIN func_003055D4
    ldr r2, [r0, #16]
    movs r3, #2
    cmp r1, #0
    beq.n .Ltl01_003055d4_clear
    orrs r2, r3
    b.n .Ltl01_003055d4_store
.Ltl01_003055d4_clear:
    bics r2, r3
.Ltl01_003055d4_store:
    str r2, [r0, #16]
    bx lr
TL01_END func_003055D4

TL01_BEGIN func_00301D1C
    ldr r1, [r0, #12]
    movs r2, #128
    orrs r1, r2
    lsls r2, r2, #14
    bics r1, r2
    str r1, [r0, #12]
    movs r1, #0
    str r1, [r0, #8]
    str r1, [r0]
    bx lr
TL01_END func_00301D1C

TL01_BEGIN func_002FF972
    ldr r1, [r1]
    lsls r2, r1, #21
    bpl.n .Ltl01_002ff972_second
    lsls r0, r0, #24
    lsrs r0, r0, #24
.Ltl01_002ff972_first_return:
    bx lr
.Ltl01_002ff972_second:
    lsls r1, r1, #23
    bpl.n .Ltl01_002ff972_first_return
    lsls r0, r0, #16
    lsrs r0, r0, #16
.Ltl01_002ff972_return:
    bx lr
TL01_END func_002FF972

TL01_BEGIN func_00304DEE
    ldr r1, [r0, #4]
    lsls r1, r1, #29
    lsrs r1, r1, #31
    beq.n .Ltl01_00304dee_zero
    ldr r1, [r0, #24]
    cmp r1, #0
    beq.n .Ltl01_00304dee_zero
    ldr r0, [r0, #20]
    subs r0, r1, r0
    bx lr
.Ltl01_00304dee_zero:
    movs r0, #0
    bx lr
TL01_END func_00304DEE

TL01_BEGIN func_0030560E
    ldr r1, [r0, #4]
    lsls r1, r1, #29
    lsrs r1, r1, #31
    beq.n .Ltl01_0030560e_zero
    ldr r1, [r0, #24]
    cmp r1, #0
    beq.n .Ltl01_0030560e_zero
    ldr r0, [r0, #20]
    subs r0, r1, r0
    asrs r0, r0, #1
    bx lr
.Ltl01_0030560e_zero:
    movs r0, #0
    bx lr
TL01_END func_0030560E

TL01_BEGIN func_002FEDD0
    cmp r0, #58
    bcs.n .Ltl01_002fedd0_letter
    subs r0, #48
.Ltl01_002fedd0_letter:
    movs r3, #32
    movs r2, r0
    bics r2, r3
    cmp r2, #65
    bcc.n .Ltl01_002fedd0_check
    movs r0, r2
    subs r0, #55
.Ltl01_002fedd0_check:
    cmp r0, r1
    bcc.n .Ltl01_002fedd0_return
    movs r0, #0
    mvns r0, r0
.Ltl01_002fedd0_return:
    bx lr
TL01_END func_002FEDD0

TL01_BEGIN func_0030242A
    ldr r1, [r0, #12]
    movs r2, #64
    orrs r1, r2
    lsls r2, r2, #6
    bics r1, r2
    movs r2, #0
    str r2, [r0]
    str r1, [r0, #12]
    lsls r1, r1, #21
    lsrs r1, r1, #30
    beq.n .Ltl01_0030242a_compute
    str r2, [r0, #8]
    bx lr
.Ltl01_0030242a_compute:
    ldr r2, [r0, #16]
    ldr r1, [r0, #4]
    subs r1, r1, r2
    ldr r2, [r0, #28]
    subs r1, r1, r2
    str r1, [r0, #8]
    bx lr
TL01_END func_0030242A

TL01_BEGIN func_00304D7E
    push {r0, r1}
    ldr r1, [r0, #4]
    lsls r1, r1, #28
    lsrs r2, r1, #31
    mov r1, sp
    ldrb r1, [r1, #4]
    beq.n .Ltl01_00304d7e_tail
    ldr r3, [r0, #40]
    ldr r2, [r0, #36]
    subs r3, r3, r2
    beq.n .Ltl01_00304d7e_tail
    adds r3, r2, #1
    str r3, [r0, #36]
    strb r1, [r2]
    movs r0, r1
    add sp, #8
    bx lr
.Ltl01_00304d7e_tail:
    ldr r2, [r0]
    ldr r2, [r2, #40]
    add sp, #8
    bx r2
TL01_END func_00304D7E

TL01_BEGIN func_003055A8
    push {r0, r1}
    ldr r1, [r0, #4]
    lsls r1, r1, #28
    lsrs r2, r1, #31
    mov r1, sp
    ldrh r1, [r1, #4]
    beq.n .Ltl01_003055a8_tail
    ldr r3, [r0, #40]
    ldr r2, [r0, #36]
    subs r3, r3, r2
    asrs r3, r3, #1
    beq.n .Ltl01_003055a8_tail
    adds r3, r2, #2
    str r3, [r0, #36]
    strh r1, [r2]
    movs r0, r1
    add sp, #8
    bx lr
.Ltl01_003055a8_tail:
    ldr r2, [r0]
    ldr r2, [r2, #40]
    add sp, #8
    bx r2
TL01_END func_003055A8

TL01_BEGIN func_0010420C
    ldr r0, [pc, #0]
    bx lr
TL01_END func_0010420C
```
