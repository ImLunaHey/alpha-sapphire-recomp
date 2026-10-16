# Probe-verified ARM service/IPC wrappers 49

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, branch-target resolution, physical literal
  identity comparison, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objdump, objcopy, and readelf 2.44.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers five adjacent, still-unmatched ARM-state parsing and service
helpers totaling exactly 620 executable bytes. They validate a bounded record,
initialize and enqueue message descriptors, unlink a message, and dispatch
five supported message kinds through an established table. The selection is
disjoint from all prior IPC manifests, duplicate batch 53, and runtime batch
53.

## Identity contracts

The two wrappers with direct branches contain five physical branch sites.
Both calls at `func_00165EEC+0x44` and `func_00165F58+0x14` resolve to the
same primary ARM entry, `func_001748D4`. The remaining three sites resolve,
respectively, to the distinct primary entries `func_0015EB9C`,
`func_0017A8E8`, and `func_0017A8A8`. All four destinations were independently
resolved from their original branch displacements and cross-checked as
defined, global, four-byte-aligned ARM functions in the target symbol table.
There are no secondary-entry destinations and no semantic branch addends.

Four physical pool slots form three new literal classes. The slot at
`func_00165EEC+0x68` and the slot at `func_00165F58+0x38` are physically
equal and must both use `service_message_chain_49`. The other two slots are
pairwise distinct from that class, from one another, and from every literal
identity established by IPC manifests 13 through 48. This equality and all
three non-equalities were cross-checked directly against the target words.
The cumulative IPC contract becomes 626 slots in 319 classes.

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; each following
pool belongs to the preceding section but lies outside its function size.
Labels and directives occupy no executable bytes. Preserve every mnemonic,
operand, register, condition, addressing mode, immediate, local branch, pool
order, and direct-branch form.

```asm
.syntax unified
.arch armv6k
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

.global func_0015EB9C,func_001748D4,func_0017A8E8,func_0017A8A8
.global service_descriptor_state_49,service_message_chain_49
.global service_dispatch_table_49

BEGIN func_00165E0C
ldrh r2,[r0,#4]
sub r3,r2,#65024
subs r3,r3,#255
bne .Lformat_b_00165E0C
cmp r1,#0
ldrne r2,[r1,#4]
addne r2,r2,r1
beq .Lformat_a_local_00165E0C
.Lformat_a_compare_00165E0C:
ldr r1,[r0,#12]
add r0,r0,r1
cmp r0,r2
bls .Lvalid_00165E0C
b .Linvalid_00165E0C
.Lformat_a_local_00165E0C:
ldrh r1,[r0,#16]
cmp r1,#0
ldrhne r1,[r0,#6]
addne r2,r1,r0
bne .Lformat_a_compare_00165E0C
b .Lvalid_00165E0C
.Lformat_b_00165E0C:
cmp r1,#0
beq .Lformat_b_local_00165E0C
ldr r2,[r1,#4]
lsl r3,r2,#16
lsl ip,r2,#24
lsr r3,r3,#24
orr ip,ip,r3,lsl #16
lsl r3,r2,#8
lsr r3,r3,#24
orr r3,ip,r3,lsl #8
orr r2,r3,r2,lsr #24
add r2,r2,r1
.Lformat_b_compare_00165E0C:
ldr r1,[r0,#12]
lsl r3,r1,#16
lsl ip,r1,#24
lsr r3,r3,#24
orr ip,ip,r3,lsl #16
lsl r3,r1,#8
lsr r3,r3,#24
orr r3,ip,r3,lsl #8
orr r1,r3,r1,lsr #24
add r0,r0,r1
cmp r0,r2
bhi .Linvalid_00165E0C
.Lvalid_00165E0C:
mov r0,#0
bx lr
.Lformat_b_local_00165E0C:
ldrh r1,[r0,#16]
cmp r1,#0
beq .Lvalid_00165E0C
ldrh r1,[r0,#6]
lsr r2,r1,#8
and r1,r1,#255
orr r1,r2,r1,lsl #8
add r2,r0,r1
b .Lformat_b_compare_00165E0C
.Linvalid_00165E0C:
mov r0,r2
bx lr
END func_00165E0C

BEGIN func_00165EEC
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[sp,#16]
and r0,r0,#255
str r0,[r4,#36]
tst r0,#2
str r1,[r4,#20]
mov r0,r2
strd r2,[r4,#12]
sub r1,r3,r0
beq .Lskip_00165EEC
ldr r2,.Lpool_00165EEC
ldr r2,[r2]
bl func_0015EB9C
.Lskip_00165EEC:
ldr r5,.Lpool_00165EEC+4
mov r1,r4
add r0,r5,#0
bl func_001748D4
cmp r0,#0
addne r5,r0,#24
mov r0,r5
add r1,r5,#4
add r2,r4,#4
pop {r4,r5,r6,lr}
b func_0017A8E8
END func_00165EEC
.Lpool_00165EEC:
.word service_descriptor_state_49
.word service_message_chain_49

BEGIN func_00165F58
push {r4,r5,r6,lr}
mov r4,r0
ldr r5,.Lpool_00165F58
mov r1,r0
add r0,r5,#0
bl func_001748D4
cmp r0,#0
addne r5,r0,#24
mov r0,r5
add r1,r4,#4
bl func_0017A8A8
mov r0,#0
str r0,[r4,#20]
pop {r4,r5,r6,pc}
END func_00165F58
.Lpool_00165F58:
.word service_message_chain_49

BEGIN func_00165F94
mov r3,r0
push {r4}
ldr r0,[r1]
cmp r1,r0
movne r4,#0
beq .Ldone_00165F94
.Lloop_00165F94:
ldm r1,{r2,ip}
cmp r2,r0
str ip,[r2,#4]
str r2,[ip]
ldr ip,[r3]
sub ip,ip,#1
str ip,[r3]
str r4,[r1]
str r4,[r1,#4]
mov r1,r2
bne .Lloop_00165F94
.Ldone_00165F94:
pop {r4}
bx lr
END func_00165F94

BEGIN func_00165FE0
mov r1,r0
push {r4,lr}
ldr r2,[r1]
ldr r0,.Lpool_00165FE0
mov r4,#0
ldr r1,[r2]
cmp r1,#0x20000009
beq .Ldispatch_1_00165FE0
bgt .Lupper_00165FE0
cmp r1,#0x20000002
beq .Ldispatch_3_00165FE0
cmp r1,#0x20000004
bne .Lreturn_00165FE0
b .Ldispatch_2_00165FE0
.Lupper_00165FE0:
sub r1,r1,#16
subs r1,r1,#0x20000001
beq .Ldispatch_0_00165FE0
cmp r1,#16
bne .Lreturn_00165FE0
b .Ldispatch_4_00165FE0
.Ldispatch_0_00165FE0:
ldr r1,[r0]
mov r0,r2
blx r1
b .Lreturn_00165FE0
.Ldispatch_1_00165FE0:
ldr r1,[r0,#4]
mov r0,r2
blx r1
b .Lreturn_00165FE0
.Ldispatch_2_00165FE0:
ldr r1,[r0,#8]
mov r0,r2
blx r1
b .Lreturn_00165FE0
.Ldispatch_3_00165FE0:
ldr r1,[r0,#12]
mov r0,r2
blx r1
b .Lreturn_00165FE0
.Ldispatch_4_00165FE0:
ldr r1,[r0,#16]
mov r0,r2
blx r1
.Lreturn_00165FE0:
mov r0,r4
pop {r4,pc}
END func_00165FE0
.Lpool_00165FE0:
.word service_dispatch_table_49
```

## Probe result

The independent probe reproduced all 620 non-relocation body bytes exactly.
It emitted the five direct branch relocations at the manifest offsets with the
required `R_ARM_CALL`/`R_ARM_JUMP24` kinds and the four literal relocations in
the required order. Function sizes were independently checked as 224, 100,
56, 76, and 164 bytes.
