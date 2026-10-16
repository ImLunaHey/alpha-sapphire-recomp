# Probe-verified ARM scene/layout helpers 54

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, direct-branch resolution, physical literal
  identity comparison, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objcopy, readelf, and objdump 2.44.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers two adjacent, still-unmatched ARM-state helpers totaling
exactly 632 executable bytes. The first validates a selected record and builds
one of two stack-resident geometry/layout requests; the second initializes a
small configuration record. The set is disjoint from duplicate batch 58 and
runtime batch 58.

## Identity contracts

Eleven physical direct-branch sites resolve to eight pairwise-distinct
destinations. Seven are primary entries: `func_0014DBB8`, `func_0013E9CC`,
`func_00157FBC`, `func_00175AD0`, `func_00176C88`, `func_0017C888`, and
`func_00175C54`. The remaining destination,
`service_geometry_setup_secondary_54`, is a standalone ARM secondary entry
without a function-start row in the neutral inventory. `func_00176C88` is
used by three sites and the secondary entry by two; every other destination
is used once. All destinations are ARM and four-byte aligned.

Seven physical pool slots form six identities. Two slots reuse the established
`service_zero_scalar_51` identity. The other five are new, pairwise-distinct
classes: `ipc_render_context_54`, `ipc_coordinate_scale_a_54`,
`ipc_coordinate_scale_b_54`, `ipc_default_flags_54`, and
`ipc_unit_scalar_54`. They are distinct from every literal class established
by IPC manifests 13 through 53. The cumulative IPC contract becomes 657
physical slots in 347 classes.

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; a following pool
belongs to the preceding section but lies outside its function size. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, addressing mode, immediate, local branch, pool order, and
direct-branch form.

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

.global func_0014DBB8,func_0013E9CC,func_00157FBC,func_00175AD0
.global func_00176C88,service_geometry_setup_secondary_54
.global func_0017C888,func_00175C54
.global ipc_render_context_54,ipc_coordinate_scale_a_54
.global ipc_coordinate_scale_b_54,service_zero_scalar_51
.global ipc_default_flags_54,ipc_unit_scalar_54

BEGIN func_001678FC
push {r4,r5,r6,r7,lr}
sub sp,sp,#180
mov r7,r0
mov r4,r1
mov r5,r2
mov r6,r3
add r0,sp,#8
bl func_0014DBB8
ldr r0,[r7,#376]
cmp r4,#3
bcs .Lreturn_001678FC
ldr r1,[r0,#8]
add r2,r0,r4,lsl #2
ldr r2,[r2,#40]
ldrh r3,[r1,#4]
cmp r2,r3
bcs .Lreturn_001678FC
ldr r1,[r1]
add r4,r1,r2,lsl #6
ldrb r1,[r4,#4]
cmp r1,#0
cmpne r4,#0
beq .Lreturn_001678FC
ldr r1,[r4,#8]
bl func_0013E9CC
cmp r0,#0
beq .Lreturn_001678FC
bl func_00157FBC
mov r0,r4
bl func_00175AD0
ldr r7,.Lpool_001678FC
cmp r6,#0
beq .Lalternate_001678FC
add r1,sp,#140
mov r0,#2
str r1,[sp]
str r0,[sp,#8]
add r3,sp,#132
add r2,sp,#128
add r1,sp,#92
mov r0,r4
str r6,[sp,#80]
bl func_00176C88
vldr s0,[sp,#132]
vldr s1,[sp,#92]
vldr s2,[sp,#128]
vldr s3,.Lpool_001678FC+8
vsub.f32 s0,s0,s1
vldr s1,[sp,#140]
add r0,sp,#100
add r4,sp,#96
vsub.f32 s2,s1,s2
vldr s1,.Lpool_001678FC+4
vmul.f32 s1,s0,s1
vldr s0,.Lpool_001678FC+12
vmul.f32 s2,s2,s3
vstr s2,[sp,#96]
vstr s0,[sp,#108]
vstmia r0,{s1-s2}
add r0,sp,#112
vstmia r0,{s0-s1}
add r0,sp,#8
vstr s0,[sp,#120]
vstr s0,[sp,#124]
bl service_geometry_setup_secondary_54
ldr r0,[r7,#72]
add r1,sp,#136
vldmia r5,{s1-s4}
add r3,sp,#152
add r2,sp,#148
ldr r0,[r0]
ldr r0,[r0,#12]
str r1,[sp]
add r1,sp,#144
bl func_00176C88
add r0,sp,#160
mov r1,#0
vstmia r0,{s1-s4}
str r0,[sp,#4]
str r4,[sp]
vldr s0,[sp,#136]
vldr s1,[sp,#148]
vldr s2,[sp,#144]
mov r0,r1
vsub.f32 s0,s0,s1
vldr s1,[sp,#152]
vsub.f32 s2,s1,s2
vcvt.s32.f32 s1,s0
vcvt.s32.f32 s0,s2
vmov r3,s1
vmov r2,s0
bl func_0017C888
.Lreturn_001678FC:
add sp,sp,#180
pop {r4,r5,r6,r7,pc}
.Lalternate_001678FC:
add r0,sp,#8
bl service_geometry_setup_secondary_54
ldr r0,[r7,#72]
add r1,sp,#100
vldmia r5,{s1-s4}
add r3,sp,#96
add r2,sp,#92
ldr r0,[r0]
ldr r0,[r0,#12]
str r1,[sp]
add r1,sp,#4
bl func_00176C88
add r1,sp,#104
add r0,sp,#104
vstmia r1,{s1-s4}
mov r1,#0
str r0,[sp]
vldr s0,[sp,#100]
vldr s1,[sp,#92]
vldr s2,[sp,#4]
mov r0,r1
vsub.f32 s0,s0,s1
vldr s1,[sp,#96]
vsub.f32 s2,s1,s2
vcvt.s32.f32 s1,s0
vcvt.s32.f32 s0,s2
vmov r3,s1
vmov r2,s0
bl func_00175C54
add sp,sp,#180
pop {r4,r5,r6,r7,pc}
END func_001678FC
.Lpool_001678FC:
.word ipc_render_context_54
.word ipc_coordinate_scale_a_54
.word ipc_coordinate_scale_b_54
.word service_zero_scalar_51

BEGIN func_00167B00
push {r4,r5,r6,r7,r8}
mov r4,#131072
mov r8,#2
ldr r5,.Lpool_00167B00
strb r8,[r0]
str r4,[r0,#20]
mov r6,#256
str r5,[r0,#12]
mov r7,#512
str r6,[r0,#8]
mov r12,#33554432
str r7,[r0,#4]
vldr s0,.Lpool_00167B00+4
vldr s1,.Lpool_00167B00+8
add r4,r0,#60
str r12,[r0,#44]
mov r1,#0
vstmia r4,{s0-s1}
mov r3,#4
str r1,[r0,#16]
str r3,[r0,#68]
str r1,[r0,#24]
add r4,r0,#36
str r1,[r0,#28]
mov r2,#1
str r1,[r0,#32]
stm r4,{r1,r2}
add r4,r0,#52
str r1,[r0,#48]
stm r4,{r1,r2}
str r1,[r0,#72]
pop {r4,r5,r6,r7,r8}
bx lr
END func_00167B00
.Lpool_00167B00:
.word ipc_default_flags_54
.word service_zero_scalar_51
.word ipc_unit_scalar_54
```

## Probe results

- The assembled body sizes are exactly 500 and 132 bytes, totaling 632 bytes;
  their pools are excluded from those sizes.
- Every one of the 588 non-relocated body bytes matches independently. The
  eleven four-byte direct-branch fields are represented by the relocation and
  identity contract above; their decoded destinations and branch forms were
  checked independently.
- The first function's four ordered pool slots follow its 500-byte body. The
  second function's three ordered pool slots follow its 132-byte body.
- Physical comparison against all earlier IPC pool identities confirms two
  uses of one established class (`service_zero_scalar_51`) and five new
  pairwise-distinct classes.
