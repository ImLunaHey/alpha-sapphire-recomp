# Probe-verified ARM service/IPC helpers 51

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

This batch covers six adjacent, still-unmatched ARM-state service and record
helpers totaling exactly 736 executable bytes. They dispatch through a global
service object, initialize a record, assign aligned slices to three intrusive
lists, initialize a service instance, drain its prioritized work queues, and
poll those queues. The selection excludes the already exact intervening helper
and is disjoint from duplicate batch 55 and runtime batch 55.

## Identity contracts

Sixteen physical direct-branch sites resolve to nine primary entries. The six
sites in the two work-queue helpers that select a queue share
`func_00174E80`; the three cleanup sites in `func_001670D8` share
`func_00160380`. The remaining sites resolve individually to
`func_0017ABB8`, `func_001757E8`, `func_001754A8`, `func_0010018C`,
`func_001602B8`, `func_0017048C`, and `func_0015E354`. The destination
`func_0010018C` is a Thumb primary entry reached with immediate `blx`; all
other destinations are four-byte-aligned ARM primary entries. There are no
secondary entries or semantic branch addends. Register-indirect `blx` sites
are part of the schedules but are not relocations.

Seven physical pool slots form seven pairwise-distinct new literal classes:
`service_dispatch_root_51`, `service_record_vtable_51`,
`service_zero_scalar_51`, `service_instance_vtable_51`,
`service_instance_index_bias_51`, `service_instance_template_51`, and
`service_instance_slot_bias_51`. They are also distinct from every literal
class established by IPC manifests 13 through 50. The cumulative IPC contract
becomes 636 physical slots in 329 classes.

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; a following pool
belongs to the preceding section but lies outside its function size. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, addressing mode, immediate, local branch, pool order, and
direct-branch form. In particular, every written `nop` is the architectural
`nop` encoding rather than legacy `mov r0,r0` padding.

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

.global func_0017ABB8,func_001757E8,func_001754A8,func_0010018C
.global func_001602B8,func_00174E80,func_00160380,func_0017048C
.global func_0015E354
.global service_dispatch_root_51,service_record_vtable_51
.global service_zero_scalar_51,service_instance_vtable_51
.global service_instance_index_bias_51,service_instance_template_51
.global service_instance_slot_bias_51

BEGIN func_001668E8
mov r1,r0
ldr r0,.Lpool_001668E8
ldr r0,[r0]
ldr r2,[r0]
ldr r2,[r2,#12]
bx r2
END func_001668E8
.Lpool_001668E8:
.word service_dispatch_root_51

BEGIN func_00166904
ldr r1,.Lpool_00166904
mov r2,#0
add r3,r0,#8
str r1,[r0]
add r1,r0,#4
vldr s0,.Lpool_00166904+4
strd r2,[r1]
str r2,[r0,#16]
str r3,[r0,#12]
str r2,[r0,#20]
vstr s0,[r0,#24]
vstr s0,[r0,#28]
bx lr
END func_00166904
.Lpool_00166904:
.word service_record_vtable_51
.word service_zero_scalar_51

BEGIN func_00166F10
push {r4,r5,r6}
ldr r1,[r1]
tst r1,#31
bne .Lfail_00166F10
add r3,r3,#3
bic ip,r3,#3
ldr r3,[r0,#132]
add r4,r0,#132
add r5,r0,#128
cmp r3,r4
beq .Lsecond_00166F10
.Lfirst_loop_00166F10:
sub r4,r3,#12
mov r6,r1
stm r4,{r6,ip}
add r4,r5,#4
ldr r3,[r3]
add r1,r1,ip
cmp r3,r4
bne .Lfirst_loop_00166F10
.Lsecond_00166F10:
ldr r3,[r0,#56]
add r4,r0,#56
add r5,r0,#52
cmp r3,r4
beq .Lthird_00166F10
.Lsecond_loop_00166F10:
sub r4,r3,#12
mov r6,r1
stm r4,{r6,ip}
add r4,r5,#4
ldr r3,[r3]
add r1,r1,ip
cmp r3,r4
bne .Lsecond_loop_00166F10
.Lthird_00166F10:
ldr r3,[r0,#208]
add r4,r0,#208
add r5,r0,#204
cmp r3,r4
beq .Lfinish_00166F10
.Lthird_loop_00166F10:
sub r4,r3,#12
mov r6,r1
stm r4,{r6,ip}
add r4,r5,#4
ldr r3,[r3]
add r1,r1,ip
cmp r3,r4
bne .Lthird_loop_00166F10
.Lfinish_00166F10:
sub r1,r1,r2
cmp r1,#0
str ip,[r0,#268]
movle r0,#1
ble .Lreturn_00166F10
.Lfail_00166F10:
mov r0,#0
.Lreturn_00166F10:
pop {r4,r5,r6}
bx lr
END func_00166F10

BEGIN func_00167054
push {r4,lr}
mov r4,r1
bl func_0017ABB8
ldr r1,.Lpool_00167054
str r1,[r0],#276
bl func_001757E8
add r0,r0,#7168
add r0,r0,#152
bl func_001754A8
ldr r1,.Lpool_00167054+4
sub r0,r0,#7168
sub r0,r0,#428
mov r3,#4
str r4,[r1,r0]
add r0,r0,#10240
ldr r1,.Lpool_00167054+8
mov r2,#16
add r0,r0,#488
blx func_0010018C
ldr r2,.Lpool_00167054+12
sub r0,r0,#10240
sub r0,r0,#488
mov r1,#0
add r3,r2,#2
add ip,r2,#6
strb r1,[r2,r0]
str r1,[r3,r0]
str r1,[ip,r0]
pop {r4,pc}
END func_00167054
.Lpool_00167054:
.word service_instance_vtable_51
.word service_instance_index_bias_51
.word service_instance_template_51
.word service_instance_slot_bias_51

BEGIN func_001670D8
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
mov r7,#0
mov r8,#3
.Lretry_001670D8:
add r6,r5,#44
mov r0,r6
bl func_001602B8
mov r2,#1
mov r1,#2
mov r0,r5
bl func_00174E80
movs r4,r0
nop
beq .Lsecond_001670D8
.Lcleanup_001670D8:
mov r0,r6
bl func_00160380
nop
nop
b .Ldispatch_001670D8
.Lsecond_001670D8:
mov r2,#1
mov r1,r2
mov r0,r5
bl func_00174E80
movs r4,r0
nop
bne .Lcleanup_001670D8
mov r2,#1
mov r1,#0
mov r0,r5
bl func_00174E80
cmp r0,#0
nop
beq .Lnone_001670D8
mov r4,r0
mov r0,r6
bl func_00160380
.Ldispatch_001670D8:
str r4,[r5,#36]
ldr r0,[r4]
ldr r1,[r0,#8]
mov r0,r4
blx r1
add r0,r4,#12
strb r8,[r4,#20]
bl func_0017048C
str r7,[r5,#36]
nop
b .Lretry_001670D8
.Lnone_001670D8:
mov r0,r6
pop {r4,r5,r6,r7,r8,lr}
b func_00160380
END func_001670D8

BEGIN func_001671A0
push {r4,lr}
mov r4,r0
mov r0,#0
strb r0,[r4,#40]
b .Lpoll_001671A0
.Lwait_001671A0:
add r0,r4,#56
bl func_0015E354
cmp r0,#0
nop
beq .Ldone_001671A0
.Lpoll_001671A0:
mov r2,#0
mov r1,#2
mov r0,r4
bl func_00174E80
cmp r0,#0
nop
bne .Ldone_001671A0
mov r2,#0
mov r1,#1
mov r0,r4
bl func_00174E80
cmp r0,#0
nop
bne .Ldone_001671A0
mov r2,#0
mov r1,r2
mov r0,r4
bl func_00174E80
cmp r0,#0
ldrbeq r0,[r4,#40]
cmpeq r0,#0
beq .Lwait_001671A0
.Ldone_001671A0:
pop {r4,pc}
END func_001671A0
```

## Relocation and size summary

- executable body bytes: 736;
- physical literal slots: 7, all new and pairwise distinct;
- cumulative literal slots/classes: 636 / 329;
- direct branch relocations: 16;
- ARM `bl` call relocations: 14;
- ARM tail-jump relocations: 1;
- ARM-to-Thumb immediate `blx` call encoded with `R_ARM_CALL`: 1;
- register-indirect branch/call sites: 2, deliberately not relocations;
- semantic branch addends: none.
