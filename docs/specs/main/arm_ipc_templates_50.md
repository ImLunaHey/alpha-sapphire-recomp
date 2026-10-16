# Probe-verified ARM service/IPC helpers 50

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, direct-branch resolution, physical literal
  identity comparison, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, linker, objcopy, and objdump 2.44.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers seven adjacent, still-unmatched ARM-state record and service
helpers totaling exactly 680 executable bytes. They initialize a parsed-record
view, derive its table bounds, visit registered objects, release owned service
objects, find a named registration, and broadcast a floating-point parameter.
The selection excludes the already exact intervening helper and is disjoint
from duplicate batch 54 and runtime batch 54.

## Identity contracts

Ten physical direct-branch sites resolve to six primary ARM entries. The sites
at `func_00166604+0x10` and `func_001666EC+0x10` share `func_0017A8A8`.
The sites at `func_00166604+0x48`, `+0x6C`, and `+0x80`, together with
`func_001666EC+0x2C`, share `func_001668E8`. The four remaining sites resolve
individually to `func_0014983C`, `func_0014B890`, `func_00174B00`, and
`func_00174A8C`. All six destinations were resolved independently from their
original displacements and cross-checked as defined, global, four-byte-aligned
ARM functions. There are no secondary entries or semantic branch addends.
Register-indirect `blx` sites are part of the schedules but not relocations.

The three pool slots following `func_001664C4` form three new literal classes,
named `ipc_record_tag_50`, `ipc_record_kind_a_50`, and
`ipc_record_kind_b_50`. They are pairwise distinct and distinct from every
literal class established by IPC manifests 13 through 49. The cumulative IPC
contract becomes 629 physical slots in 322 classes.

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; a following pool
belongs to the preceding section but lies outside its function size. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, addressing mode, immediate, local branch, pool order, and
direct-branch form. In particular, the first padding operation in each of
`func_00166604` and `func_001666EC` is the legacy `mov r0,r0` encoding, while
the padding operation in `func_0016668C` is the architectural `nop` encoding.

```asm
.syntax unified
.arch armv6k
.fpu vfp
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

.global func_0014983C,func_0017A8A8,func_0014B890
.global func_001668E8,func_00174B00,func_00174A8C
.global ipc_record_tag_50,ipc_record_kind_a_50,ipc_record_kind_b_50

BEGIN func_001664C4
push {r4,r5,r6,lr}
mov r4,r0
mov r0,#0
str r0,[r4]
str r0,[r4,#4]
mov r5,r1
str r0,[r4,#8]
str r0,[r4,#12]
ldr r2,.Lpool_001664C4
ldr r1,.Lpool_001664C4+4
mov r3,#1
mov r0,r5
bl func_0014983C
cmp r0,#0
beq .Ldone_001664C4
str r5,[r4]
ldrh r2,[r5,#16]
ldrh r0,[r5,#6]
mov r1,#0
cmp r2,#0
ldrgt r3,.Lpool_001664C4+8
add r0,r0,r5
ble .Ldone_001664C4
.Lloop_001664C4:
ldr r2,[r0]
adds r2,r2,r3
streq r0,[r4,#12]
beq .Lnext_001664C4
cmp r2,#0x10000
streq r0,[r4,#4]
beq .Lnext_001664C4
cmp r2,#0xc0000
streq r0,[r4,#8]
.Lnext_001664C4:
ldr r2,[r0,#4]
add r1,r1,#1
add r0,r0,r2
ldrh r2,[r5,#16]
cmp r2,r1
bgt .Lloop_001664C4
.Ldone_001664C4:
pop {r4,r5,r6,pc}
END func_001664C4
.Lpool_001664C4:
.word ipc_record_tag_50
.word ipc_record_kind_a_50
.word ipc_record_kind_b_50

BEGIN func_0016656C
str r0,[r1]
ldr r2,[r0,#16]
add r2,r2,r0
str r2,[r1,#4]
ldr r3,[r0,#24]
add r3,r3,r0
str r3,[r1,#8]
ldr r3,[r2,#8]
add ip,r3,r3,lsl #1
add r2,r2,ip,lsl #2
str r2,[r1,#16]
str r3,[r1,#12]
ldr r0,[r0,#20]
add r1,r1,#20
mov r2,#0
stm r1,{r0,r2}
mov r0,#1
bx lr
END func_0016656C

BEGIN func_001665B4
push {r4,r5,r6,r7,r8,lr}
add r5,r0,#12
mov r6,r1
ldr r4,[r0,#16]!
mov r7,r2
mov r8,r3
cmp r4,r0
beq .Ldone_001665B4
.Lloop_001665B4:
ldr r0,[r4,#8]
mov r3,r8
mov r2,r7
ldr r1,[r0]
ldr ip,[r1,#68]
mov r1,r6
blx ip
ldr r4,[r4]
add r0,r5,#4
cmp r4,r0
bne .Lloop_001665B4
.Ldone_001665B4:
pop {r4,r5,r6,r7,r8,pc}
END func_001665B4

BEGIN func_00166604
add r0,r0,#36
mov r0,r0
push {r4,r5,r6,lr}
mov r4,r1
bl func_0017A8A8
cmp r4,#0
beq .Ldone_00166604
ldrb r0,[r4,#140]
cmp r0,#0
beq .Lrelease_self_00166604
ldr r0,[r4,#136]
cmp r0,#0
ldrne r5,[r0,#12]
cmpne r5,#0
beq .Lrelease_object_00166604
mov r1,#0
bl func_0014B890
mov r0,r5
bl func_001668E8
.Lrelease_object_00166604:
ldr r5,[r4,#136]
cmp r5,#0
beq .Lclear_00166604
ldr r0,[r5]
ldr r1,[r0]
mov r0,r5
blx r1
mov r0,r5
bl func_001668E8
.Lclear_00166604:
mov r1,#0
str r1,[r4,#136]
.Lrelease_self_00166604:
mov r0,r4
pop {r4,r5,r6,lr}
b func_001668E8
.Ldone_00166604:
pop {r4,r5,r6,pc}
END func_00166604

BEGIN func_0016668C
push {r4,r5,r6,lr}
mov r5,r0
ldr r4,[r0,#4]!
mov r6,r1
cmp r4,r0
beq .Lnone_0016668C
.Lloop_0016668C:
mov r1,r6
add r0,r4,#20
bl func_00174B00
cmp r0,#0
nop
beq .Lnext_0016668C
sub r0,r4,#4
pop {r4,r5,r6,pc}
.Lnext_0016668C:
ldr r4,[r4]
add r0,r5,#4
cmp r4,r0
bne .Lloop_0016668C
.Lnone_0016668C:
mov r0,#0
pop {r4,r5,r6,pc}
END func_0016668C

BEGIN func_001666EC
add r0,r0,#48
mov r0,r0
push {r4,lr}
mov r4,r1
bl func_0017A8A8
cmp r4,#0
beq .Ldone_001666EC
add r0,r4,#136
bl func_00174A8C
mov r0,r4
pop {r4,lr}
b func_001668E8
.Ldone_001666EC:
pop {r4,pc}
END func_001666EC

BEGIN func_00166720
push {r4,r5,r6,r7,r8,lr}
add r5,r0,#12
mov r6,r1
mov r7,r2
vpush {d8}
sub sp,sp,#8
ldr r4,[r0,#16]!
vldr s16,[sp,#40]
mov r8,r3
cmp r4,r0
beq .Ldone_00166720
.Lloop_00166720:
ldr r0,[r4,#8]
vstr s16,[sp]
mov r3,r8
mov r2,r7
ldr r1,[r0]
ldr ip,[r1,#72]
mov r1,r6
blx ip
ldr r4,[r4]
add r0,r5,#4
cmp r4,r0
bne .Lloop_00166720
.Ldone_00166720:
add sp,sp,#8
vpop {d8}
pop {r4,r5,r6,r7,r8,pc}
END func_00166720
```

## Acceptance contract

- Exactly seven global ARM functions are emitted with body sizes 156, 72, 80,
  136, 80, 52, and 104 bytes in the order above.
- The three pool words following `func_001664C4` lie outside that function's
  156-byte size and produce `R_ARM_ABS32` relocations to the three symbolic
  identities in the stated order.
- The ten direct sites produce the exact `R_ARM_CALL`/`R_ARM_JUMP24` mappings
  in `config/arm-ipc-templates-50.json`; register-indirect calls do not produce
  relocations.
- An independent GNU Arm probe linked at the inventory addresses reproduced all
  seven target bodies and the three physical pool slots exactly.
