# Probe-verified ARM record/state helpers 58

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control-flow inspection, direct-branch resolution, and an independent GNU
  Arm linked exact-schedule probe.
- Probe toolchain: GNU Arm assembler, linker, objcopy, readelf, and objdump
  2.46.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers nineteen still-unmatched ARM-state record/state helpers
totaling exactly 1,176 executable bytes. The set is disjoint from all earlier
configured functions and the duplicate/runtime batch-62 reservations.

## Semantic contract

- `func_00168B10` and `func_00168B3C` flush pending state, acquire record kind
  one, write respectively a byte field at displacement 20 or a word field at
  displacement 16, then tail-enter the commit helper.
- `func_00168B68` flushes, acquires record kind one, replaces only the low
  seven bits of byte field 45, and commits.
- `func_00168BA4`, `func_00168BE0`, `func_00168C20`, and `func_00168C60`
  replace respectively bits 0..4, 15..19, 5..9, and 10..14 of word field 52
  after the common flush/acquire sequence, then commit.
- `func_00168CDC` selects one of two record layouts from a discriminator,
  writes a byte field at displacement 42 or 26, and commits.
- `func_00168D30` flushes, stores the supplied word through the owner record's
  pointer at displacement 8, and commits.
- `func_00168D54` and `func_00168D94` replace respectively bits 20..24 and
  25..29 of word field 52 after the common flush/acquire sequence, then commit.
- `func_00168DD4` initializes two owner pointers and clears both one-byte state
  flags before tail-entering the commit helper.
- `func_00168DF4` flushes, acquires record kind one, writes byte field 47, and
  commits.
- `func_00168E50` is the guarded commit helper. It computes/stores the primary
  checksum and conditionally processes a secondary record, then marks the
  owner committed.
- `func_00168EC0` is the guarded flush helper. It processes the primary and
  optional secondary records, clears the committed flag, recomputes a checksum,
  and marks the record header when the checksum changed.
- `func_00168F48` and `func_00168F74` flush, acquire record kind one, write
  respectively word fields 4 and 8, and commit.
- `func_00168FCC` compares the XOR-folded halfwords of two inputs against a
  threshold and returns a Boolean.
- `func_00168FF0` conditionally selects or reconstructs a packed two-halfword
  value using the same fold threshold, with a zeroing fallback before returning
  the reconstructed word.

## Identity and accounting contract

There are exactly 50 physical direct-transfer sites forming nine pairwise-
distinct ARM primary-entry identities. Site counts are: `func_00168EC0` 14,
`func_00168E50` 15, `func_0016BC84` 4, `func_0016BD80` 3,
`func_0016BD00` 6, and two each for `func_00176EFC`, `func_00175F08`,
`func_00168AC8`, and `func_00175F68`. There are no secondary-entry identities.

The batch has no PC-relative literal slots. IPC cumulative accounting remains
684 physical slots in 363 value classes.

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` terminates the executable body. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, addressing mode, immediate, local branch, and direct-
branch form.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro BEGIN f
 .section .text.\f,"ax",%progbits
 .balign 4
 .arm
 .global \f
 .type \f,%function
\f:
.endm
.macro END f
 .size \f,.-\f
.endm

.global func_0016BC84,func_0016BD00,func_0016BD80,func_00176EFC
.global func_00175F08,func_00175F68,func_00168AC8

BEGIN func_00168B10
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BC84
strb r4,[r0,#20]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168B10

BEGIN func_00168B3C
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BC84
str r4,[r0,#16]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168B3C

BEGIN func_00168B68
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BD80
ldrb r2,[r0,#45]
and r1,r4,#127
bic r2,r2,#127
orr r1,r1,r2
strb r1,[r0,#45]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168B68

BEGIN func_00168BA4
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BD00
ldr r2,[r0,#52]
and r1,r4,#31
bic r2,r2,#31
orr r1,r1,r2
str r1,[r0,#52]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168BA4

BEGIN func_00168BE0
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BD00
ldr r1,[r0,#52]
mov r2,#1015808
and r2,r2,r4,lsl #15
bic r1,r1,#1015808
orr r1,r1,r2
str r1,[r0,#52]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168BE0

BEGIN func_00168C20
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BD00
ldr r1,[r0,#52]
mov r2,#992
and r2,r2,r4,lsl #5
bic r1,r1,#992
orr r1,r1,r2
str r1,[r0,#52]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168C20

BEGIN func_00168C60
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BD00
ldr r1,[r0,#52]
mov r2,#31744
and r2,r2,r4,lsl #10
bic r1,r1,#31744
orr r1,r1,r2
str r1,[r0,#52]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168C60

BEGIN func_00168CDC
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#0
mov r0,r5
bl func_00176EFC
ldrb r0,[r0,#27]
mov r1,#1
cmp r0,#0
mov r0,r5
beq .Lalternate_00168CDC
bl func_00176EFC
strb r4,[r0,#42]
b .Lfinish_00168CDC
.Lalternate_00168CDC:
nop {0}
bl func_0016BD80
strb r4,[r0,#26]
.Lfinish_00168CDC:
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168CDC

BEGIN func_00168D30
push {r4,r5,r6,lr}
mov r5,r1
mov r4,r0
bl func_00168EC0
ldr r0,[r4,#8]
str r5,[r0]
mov r0,r4
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168D30

BEGIN func_00168D54
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BD00
ldr r1,[r0,#52]
mov r2,#32505856
and r2,r2,r4,lsl #20
bic r1,r1,#32505856
orr r1,r1,r2
str r1,[r0,#52]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168D54

BEGIN func_00168D94
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BD00
ldr r1,[r0,#52]
mov r2,#1040187392
and r2,r2,r4,lsl #25
bic r1,r1,#1040187392
orr r1,r1,r2
str r1,[r0,#52]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168D94

BEGIN func_00168DD4
mov r3,#0
str r1,[r0,#8]
strb r3,[r0,#12]
str r2,[r0,#4]
strb r3,[r0,#13]
b func_00168E50
END func_00168DD4

BEGIN func_00168DF4
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BD80
strb r4,[r0,#47]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168DF4

BEGIN func_00168E50
push {r4,lr}
mov r4,r0
ldrb r0,[r0,#12]
cmp r0,#0
ldrbeq r0,[r4,#13]
cmpeq r0,#0
bne .Ldone_00168E50
ldr r0,[r4,#8]
mov r1,#224
add r0,r0,#8
bl func_00175F08
ldr r1,[r4,#8]
strh r0,[r1,#6]
ldr r1,[r4,#8]
add r0,r1,#8
ldr r2,[r1]
mov r1,#224
bl func_00168AC8
ldr r0,[r4,#4]
cmp r0,#0
beq .Lmark_00168E50
ldr r1,[r4,#8]
ldr r2,[r1]
mov r1,#28
bl func_00168AC8
.Lmark_00168E50:
mov r0,#1
strb r0,[r4,#12]
.Ldone_00168E50:
pop {r4,pc}
END func_00168E50

BEGIN func_00168EC0
push {r4,r5,r6,lr}
mov r4,r0
ldrb r0,[r0,#12]
cmp r0,#0
beq .Ldone_00168EC0
ldr r1,[r4,#8]
add r0,r1,#8
ldr r2,[r1]
mov r1,#224
bl func_00175F68
ldr r0,[r4,#4]
cmp r0,#0
beq .Lclear_00168EC0
ldr r1,[r4,#8]
ldr r2,[r1]
mov r1,#28
bl func_00175F68
.Lclear_00168EC0:
mov r0,#0
strb r0,[r4,#12]
ldr r0,[r4,#8]
mov r1,#224
ldrh r5,[r0,#6]
add r0,r0,#8
bl func_00175F08
cmp r5,r0
nop {0}
beq .Ldone_00168EC0
ldr r0,[r4,#8]
ldrh r1,[r0,#4]
orr r1,r1,#4
strh r1,[r0,#4]
.Ldone_00168EC0:
pop {r4,r5,r6,pc}
END func_00168EC0

BEGIN func_00168F48
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BC84
str r4,[r0,#4]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168F48

BEGIN func_00168F74
push {r4,r5,r6,lr}
mov r4,r1
mov r5,r0
bl func_00168EC0
mov r1,#1
mov r0,r5
bl func_0016BC84
str r4,[r0,#8]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00168E50
END func_00168F74

BEGIN func_00168FCC
uxth r3,r0
eor r0,r3,r0,lsr #16
uxth r2,r1
eor r0,r0,r1,lsr #16
eor r0,r0,r2
cmp r0,#16
movcc r0,#1
movcs r0,#0
bx lr
END func_00168FCC

BEGIN func_00168FF0
uxth r2,r0
eor r2,r2,r0,lsr #16
uxth r3,r1
eor r12,r2,r1,lsr #16
eor r3,r3,r12
cmp r3,#16
movcc r0,r1
bxcc lr
uxth r1,r1
eor r0,r0,r0,lsr #16
eor r0,r0,r1
push {r4,lr}
orr r4,r1,r0,lsl #16
uxth r0,r4
eor r1,r2,r4,lsr #16
eor r0,r0,r1
cmp r0,#16
bcc .Lvalid_00168FF0
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
.Lvalid_00168FF0:
mov r0,r4
pop {r4,pc}
END func_00168FF0
```
