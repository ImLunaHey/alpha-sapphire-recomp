# Probe-verified ARM service/state helpers 61

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, direct-transfer resolution, and an independent
  GNU Arm mnemonic-schedule check.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.

This batch covers 20 still-unmatched ARM service/state helpers totaling exactly
960 executable bytes. Every exact function and every function named by an
existing implementation contract was excluded. The set is disjoint from all
concurrent batch-65 reservations confirmed by the coordinating agent.

## Semantic contract

- `func_00176684` compares a signed source byte against one plus the arithmetic
  sign word of an input word and returns a Boolean.
- `func_001766A4` asks the shared packed-field helper for field one of the
  record beginning at displacement four and returns the helper output on
  success.
- `func_001766C4`, `func_00176700`, `func_0017673C`, and `func_00176778` are
  parallel typed-handle lookups. They require handle classes three, one, four,
  and two respectively, remove the class byte, follow their class table at
  owner displacements 20, 4, 44, and 12, bounds-check the entry index, and
  return the entry-relative pointer. Invalid class or index returns null.
- `func_001767CC` and `func_001767F4` read field zero from the packed record at
  displacement eight. The first returns its low byte, using 64 when the field
  is absent; the second returns bits 8 through 15 when present.
- `func_00176820` follows the relative record at displacement four and writes
  four output words. Each slot receives the corresponding stored word when the
  record count covers it, or all-bits-one otherwise.
- `func_00176880`, `func_001768A0`, and `func_001768C8` read fields zero or one
  from the packed record at displacement 12. They respectively return the raw
  field-zero word, field one's low byte with absent fallback 64, and field
  one's middle byte with zero-or-absent fallback one.
- `func_001768FC`, `func_00176920`, `func_0017697C`, `func_001769A0`, and
  `func_001769D8` read packed fields from the record at displacement 20. They
  return, respectively, field one's low byte, field one's middle byte, field
  17's low bit, field two's middle byte, and field two's low byte with absent
  fallback 64.
- `func_0017694C` maps three consecutive halfword tags beginning at `0x2201`
  to result values two, three, and one; every other tag maps to zero.
- `func_00176A0C` returns null when the owner's record-count byte is zero.
  Otherwise it addresses a twelve-byte descriptor by index and returns the
  descriptor word at displacement 12.
- `func_00176A34` likewise returns null when the record-count byte is zero.
  Otherwise it derives a base from the owner's leading word, addresses the
  selected twelve-byte descriptor, follows its relative word at displacement
  eight, and returns that address plus eight.

## Identity and accounting contract

There are exactly 12 physical direct-call sites forming two pairwise-distinct
ARM primary-entry identities. `func_0017D058` is reused from earlier IPC
contracts and has eleven sites; newly observed `func_0017CEF4` is a singleton.
There are no secondary-entry identities, external tail branches, or
PC-relative literal slots. IPC literal-pool accounting therefore remains 684
physical slots in 363 value classes.

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` terminates the executable body. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, addressing mode, immediate, local branch, and direct-call
form.

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

.global func_0017D058,func_0017CEF4

BEGIN func_00176684
ldr r0,[r0]
ldrsb r1,[r1]
mov r2,#1
add r0,r2,r0,asr #31
cmp r0,r1
moveq r0,#1
movne r0,#0
bx lr
END func_00176684

BEGIN func_001766A4
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#4
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
pop {r3,pc}
END func_001766A4

BEGIN func_001766C4
mov r2,#3
cmp r2,r1,lsr #24
bne .Lfalse_001766C4
ldr r2,[r0,#20]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_001766C4
.Lfalse_001766C4:
mov r0,#0
bx lr
.Lentry_001766C4:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_001766C4

BEGIN func_00176700
mov r2,#1
cmp r2,r1,lsr #24
bne .Lfalse_00176700
ldr r2,[r0,#4]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_00176700
.Lfalse_00176700:
mov r0,#0
bx lr
.Lentry_00176700:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_00176700

BEGIN func_0017673C
mov r2,#4
cmp r2,r1,lsr #24
bne .Lfalse_0017673C
ldr r2,[r0,#44]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_0017673C
.Lfalse_0017673C:
mov r0,#0
bx lr
.Lentry_0017673C:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_0017673C

BEGIN func_00176778
mov r2,#2
cmp r2,r1,lsr #24
bne .Lfalse_00176778
ldr r2,[r0,#12]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_00176778
.Lfalse_00176778:
mov r0,#0
bx lr
.Lentry_00176778:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_00176778

BEGIN func_001767CC
push {r3,lr}
mov r2,#0
mov r1,sp
add r0,r0,#8
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
moveq r0,#64
andne r0,r0,#255
pop {r3,pc}
END func_001767CC

BEGIN func_001767F4
push {r3,lr}
mov r2,#0
mov r1,sp
add r0,r0,#8
bl func_0017D058
cmp r0,#0
beq .Ldone_001767F4
ldr r0,[sp]
lsl r0,r0,#16
lsr r0,r0,#24
.Ldone_001767F4:
pop {r3,pc}
END func_001767F4

BEGIN func_00176820
ldr r2,[r0,#4]
add r0,r0,r2
mvn r2,#0
ldr r3,[r0]
cmp r3,#0
ldrne r3,[r0,#4]
streq r2,[r1]
strne r3,[r1]
ldr r3,[r0]
cmp r3,#1
ldrhi r3,[r0,#8]
strls r2,[r1,#4]
strhi r3,[r1,#4]
ldr r3,[r0]
cmp r3,#2
ldrhi r3,[r0,#12]
strls r2,[r1,#8]
strhi r3,[r1,#8]
ldr r3,[r0]
cmp r3,#3
ldrhi r0,[r0,#16]
strls r2,[r1,#12]
strhi r0,[r1,#12]
bx lr
END func_00176820

BEGIN func_00176880
push {r3,lr}
mov r2,#0
mov r1,sp
add r0,r0,#12
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
pop {r3,pc}
END func_00176880

BEGIN func_001768A0
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#12
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
moveq r0,#64
andne r0,r0,#255
pop {r3,pc}
END func_001768A0

BEGIN func_001768C8
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#12
bl func_0017D058
cmp r0,#0
beq .Lfallback_001768C8
ldr r0,[sp]
lsl r0,r0,#16
lsrs r0,r0,#24
beq .Ldone_001768C8
.Lfallback_001768C8:
mov r0,#1
.Ldone_001768C8:
pop {r3,pc}
END func_001768C8

BEGIN func_001768FC
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
andne r0,r0,#255
pop {r3,pc}
END func_001768FC

BEGIN func_00176920
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
beq .Ldone_00176920
ldr r0,[sp]
lsl r0,r0,#16
lsr r0,r0,#24
.Ldone_00176920:
pop {r3,pc}
END func_00176920

BEGIN func_0017694C
ldrh r0,[r0,#12]
sub r0,r0,#0x2200
subs r0,r0,#1
moveq r0,#2
beq .Ldone_0017694C
cmp r0,#1
moveq r0,#3
beq .Ldone_0017694C
cmp r0,#2
movne r0,#0
moveq r0,#1
.Ldone_0017694C:
bx lr
END func_0017694C

BEGIN func_0017697C
push {r3,lr}
mov r2,#17
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
andne r0,r0,#1
pop {r3,pc}
END func_0017697C

BEGIN func_001769A0
push {r3,lr}
mov r2,#2
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
beq .Ldone_001769A0
ldr r0,[sp]
lsl r0,r0,#16
lsr r0,r0,#24
.Ldone_001769A0:
pop {r3,pc}
END func_001769A0

BEGIN func_001769D8
push {r3,lr}
mov r2,#2
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
moveq r0,#64
andne r0,r0,#255
pop {r3,pc}
END func_001769D8

BEGIN func_00176A0C
ldrb r2,[r0,#12]
cmp r2,#0
moveq r0,#0
beq .Ldone_00176A0C
ldr r0,[r0,#4]
add r1,r1,r1,lsl #1
mov r2,#12
add r1,r2,r1,lsl #2
ldr r0,[r0,r1]
.Ldone_00176A0C:
bx lr
END func_00176A0C

BEGIN func_00176A34
push {r4,r5,r6,lr}
mov r4,r0
ldrb r0,[r0,#12]
mov r5,r1
cmp r0,#0
beq .Ldone_00176A34
ldr r0,[r4]
bl func_0017CEF4
mov r1,r0
ldr r0,[r4,#4]
add r2,r5,r5,lsl #1
add r0,r0,r2,lsl #2
ldr r0,[r0,#8]
add r0,r0,r1
add r0,r0,#8
.Ldone_00176A34:
pop {r4,r5,r6,pc}
END func_00176A34
```

## Boundary and relocation summary

| Function | Body bytes | Direct-call offsets |
| --- | ---: | --- |
| `func_00176684` | 32 | none |
| `func_001766A4` | 32 | 16 -> `func_0017D058` |
| `func_001766C4` | 60 | none |
| `func_00176700` | 60 | none |
| `func_0017673C` | 60 | none |
| `func_00176778` | 60 | none |
| `func_001767CC` | 40 | 16 -> `func_0017D058` |
| `func_001767F4` | 44 | 16 -> `func_0017D058` |
| `func_00176820` | 96 | none |
| `func_00176880` | 32 | 16 -> `func_0017D058` |
| `func_001768A0` | 40 | 16 -> `func_0017D058` |
| `func_001768C8` | 52 | 16 -> `func_0017D058` |
| `func_001768FC` | 36 | 16 -> `func_0017D058` |
| `func_00176920` | 44 | 16 -> `func_0017D058` |
| `func_0017694C` | 48 | none |
| `func_0017697C` | 36 | 16 -> `func_0017D058` |
| `func_001769A0` | 44 | 16 -> `func_0017D058` |
| `func_001769D8` | 40 | 16 -> `func_0017D058` |
| `func_00176A0C` | 40 | none |
| `func_00176A34` | 64 | 28 -> `func_0017CEF4` |

All listed transfers use `R_ARM_CALL`. All other branches are local. The body
sizes sum to 960 bytes, and all function boundaries are four-byte aligned.
