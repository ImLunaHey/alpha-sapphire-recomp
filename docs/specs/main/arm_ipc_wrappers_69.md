# Probe-verified ARM service/data wrappers 69

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function inventory, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  equality analysis, and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, target hashes, private literal values, private strings, assets,
  implementation, or proprietary source are present.
- Implementation source SHA-256: `6a4d43c1c37bb92552d1c0fed866da82610c42be5e62dc6a12d60d108a51926f`.

This batch covers four still-unmatched ARM classification, timing, allocation,
and callback-dispatch bodies totaling exactly 520 executable bytes. It is
disjoint from all earlier IPC work and from the pending runtime 73 and duplicate
72 cohorts.

## Function, extent, and semantic contract

| Function | Section | Body | Next global | Contract |
|---|---|---:|---|---|
| `func_00188644` | `.text.func_00188644` | 216 | `func_00188728` at +228 | Classify two packed selectors against a shared record, select a stored member or one of two established classification values, and publish the result through the output pointer. |
| `func_00188878` | `.text.func_00188878` | 40 | `func_001888A8` at +48 | Compare a two-word quantity with the established threshold; tail-transfer either to the established zero-pair service entry or, after fixed-point scaling, to the countdown-loop entry. |
| `func_00188A00` | `.text.func_00188A00` | 140 | `func_00188A8C` at +140 | Initialize a three-pointer byte buffer, allocate at least the minimum capacity, clear the requested prefix, and publish its logical and capacity ends. |
| `func_00188A8C` | `.text.func_00188A8C` | 124 | `func_00188B08` at +124 | Visit up to sixteen selected resource slots and invoke either a direct callback or a callback obtained through the selected slot while preserving the floating argument. |

## Positional identity and transfer contract

`func_00188644` has three physical post-body literals. Its +216 slot is reached
only by the load at +0 and reuses `ipc_record_tree_owner_66`; its +220 and +224
slots are reached only by the conditional loads at +156 and +168 and establish
`ipc_classification_value_a_69` and `ipc_classification_value_b_69`.
`func_00188878` has two physical post-body literals: +40 is reached only by +0
and establishes `ipc_time_threshold_high_69`, while +44 is reached only by +20
and establishes `ipc_time_scale_factor_69`. Private equality analysis found the
four new identities pairwise distinct and unequal to every earlier IPC literal
identity. Starting from the IPC68 baseline of 724 slots in 377 classes, this
batch therefore requires 729 physical slots in 381 classes.

There are exactly three symbolic direct-transfer sites: one call to a primary
ARM entry and two tail jumps to secondary ARM entries. The existing
`runtime_zero_pair_tail_44` identity lies +12 bytes into owner
`func_00123D60`, eight bytes before `func_00123D74`.
`countdown_loop_secondary_69` lies +40 bytes into owner `func_00123710`, 48
bytes before `func_00123768`. All three transfer identity classes are pairwise
distinct. The `blx r1` in `func_00188A8C` remains register-indirect and does not
create a symbolic relocation.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_00188878` | +16 | `R_ARM_JUMP24` | `b` | `runtime_zero_pair_tail_44` |
| `func_00188878` | +36 | `R_ARM_JUMP24` | `b` | `countdown_loop_secondary_69` |
| `func_00188A00` | +64 | `R_ARM_CALL` | `bl` | `func_00184990` |

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` fixes the executable body size. Each `.word`
is adjacent data outside the preceding declared body. Labels and directives
occupy no executable bytes. Preserve every mnemonic, operand, condition,
addressing mode, immediate, local branch, direct-transfer form, pool position,
and pool order.

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

.global func_00184990,runtime_zero_pair_tail_44,countdown_loop_secondary_69
.global ipc_record_tree_owner_66,ipc_classification_value_a_69
.global ipc_classification_value_b_69,ipc_time_threshold_high_69
.global ipc_time_scale_factor_69

BEGIN func_00188644
ldr r0,.Lpool_00188644_owner
sub ip,r1,#33280
subs ip,ip,#26
ldr r1,[r0]
mov r0,#0
ldr r1,[r1,#8]
beq .Lselector_primary_00188644
sub ip,ip,#2560
subs ip,ip,#198
beq .Lselector_ready_00188644
cmp ip,#32
bne .Lreturn_00188644
.Lselector_primary_00188644:
mov r0,#1
.Lselector_ready_00188644:
sub r2,r2,#32768
subs r2,r2,#3280
mov ip,#0
beq .Lkind_zero_00188644
cmp r2,#1
addeq r0,r1,r0,lsl #4
ldreq r0,[r0,#4]
beq .Lstore_r0_00188644
cmp r2,#2
beq .Lstore_zero_00188644
cmp r2,#3
bne .Lreturn_00188644
add r0,r1,r0,lsl #4
ldr r1,[r0,#12]
cmp r1,#0
beq .Lstore_zero_00188644
ldr r1,[r0]
cmp r1,#1
bne .Lstore_zero_00188644
b .Linspect_tag_00188644
.Lkind_zero_00188644:
add r0,r1,r0,lsl #4
ldr r1,[r0,#4]
cmp r1,#0
beq .Lstore_zero_00188644
ldr r0,[r0]
cmp r0,#0
ldreq r0,.Lpool_00188644_class_a
beq .Lstore_r0_00188644
cmp r0,#1
ldreq r0,.Lpool_00188644_class_b
streq r0,[r3]
.Lreturn_00188644:
bx lr
.Lstore_r0_00188644:
str r0,[r3]
bx lr
.Lstore_zero_00188644:
str ip,[r3]
bx lr
.Linspect_tag_00188644:
ldr r0,[r0,#8]
sub r1,r0,#3328
subs r1,r1,#225
beq .Lstore_zero_00188644
b .Lstore_r0_00188644
END func_00188644
.Lpool_00188644_owner:
.word ipc_record_tree_owner_66
.Lpool_00188644_class_a:
.word ipc_classification_value_a_69
.Lpool_00188644_class_b:
.word ipc_classification_value_b_69

BEGIN func_00188878
ldr r2,.Lpool_00188878_threshold
subs r2,r0,r2
sbcs r2,r1,#0
blt .Lscale_00188878
b runtime_zero_pair_tail_44
.Lscale_00188878:
ldr r2,.Lpool_00188878_scale
umull r3,r0,r0,r2
umull r1,r2,r1,r2
adds r0,r0,r1
b countdown_loop_secondary_69
END func_00188878
.Lpool_00188878_threshold:
.word ipc_time_threshold_high_69
.Lpool_00188878_scale:
.word ipc_time_scale_factor_69

BEGIN func_00188A00
push {r4,r5,r6,lr}
sub sp,sp,#8
mov r5,#0
str r5,[r0]
str r5,[r0,#4]
str r5,[r0,#8]
mov r4,r0
cmp r1,#32
add r2,sp,#4
mov r0,sp
mov r3,#32
movcc r0,r2
str r1,[sp]
str r3,[sp,#4]
ldr r6,[r0]
mov r0,r6
bl func_00184990
str r0,[r4]
ldr r1,[sp]
cmp r1,#0
beq .Lpublish_00188A00
.Lclear_00188A00:
cmp r0,#0
strbne r5,[r0]
subs r1,r1,#1
add r0,r0,#1
bne .Lclear_00188A00
.Lpublish_00188A00:
ldr r0,[r4]
ldr r1,[sp]
add r1,r1,r0
add r0,r0,r6
str r0,[r4,#8]
str r1,[r4,#4]
add sp,sp,#8
mov r0,r4
pop {r4,r5,r6,pc}
END func_00188A00

BEGIN func_00188A8C
push {r4,r5,r6,r7,r8,lr}
mov r6,r0
mov r4,r1
mov r8,r2
vpush {d8}
vmov.f32 s16,s0
mov r7,r3
mov r5,#0
.Lloop_00188A8C:
cmp r4,#0
beq .Lreturn_00188A8C
tst r4,#1
beq .Lnext_00188A8C
cmp r5,#15
bgt .Lnext_00188A8C
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00188A8C
add r0,r0,r7,asr #1
tst r7,#1
ldrne r1,[r0]
vmov.f32 s0,s16
moveq r1,r8
ldrne r1,[r1,r8]
blx r1
.Lnext_00188A8C:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00188A8C
.Lreturn_00188A8C:
vpop {d8}
pop {r4,r5,r6,r7,r8,pc}
END func_00188A8C
```

## Independent probe result

The normative schedule was independently assembled with the pinned GNU Arm
toolchain in ARMv6K/VFPv2 mode. Section-scoped comparison against the private
target confirmed all 130 executable instructions, all local-control targets,
all five literal reaches and their physical order, all three symbolic transfer
sites, all function sizes, and all four next-global boundaries. The comparison
normalizes only relocation payload fields; opcode, condition, register,
addressing-mode, immediate, and local-displacement bits remain exact.
