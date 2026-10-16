# Probe-verified ARM IPC templates 23

## Scope and provenance

- Target: AS_EUR_REV2, independently verified in docs/PROVENANCE.md.
- Analysis date: 2026-10-16.
- Evidence: evidence-gated symbols, objdiff, bounded private-target analysis, and independent GNU Arm probes.
- Clean-room role: analysis/specification only. No target bytes, encoded instruction words, private addresses, private literal values, implementation, assets, or proprietary source are present.

This batch covers eight unmatched ARM-state IPC wrappers in eight schedules totaling 844 code bytes. TPIDRURO plus 128 is the public CTR command buffer, TPIDRURO plus 384 is the static-buffer area, and SVC 50 is SendSyncRequest.

## Inventory and pool forms

| Function | Mode | Size | Pool form |
| --- | --- | ---: | --- |
| func_002C9334 | ARM | 112 | new command ipc_command_func_002C9334 at +0x70 |
| func_001F152C | ARM | 108 | existing command ipc_command_func_002C9220 +0x6c, existing handle ipc_handle_slot_iota +0x70 |
| func_00133DA4 | ARM | 104 | existing command ipc_command_func_002C6104 +0x68, existing handle ipc_handle_slot_alpha +0x6c |
| func_001F7030 | ARM | 104 | new command ipc_command_func_001F7030 +0x68 |
| func_001F73F4 | ARM | 104 | new command ipc_command_func_001F73F4 +0x68 |
| func_002C5548 | ARM | 104 | new command ipc_command_func_002C5548 +0x68 |
| func_002C59AC | ARM | 104 | new command +0x68, new auxiliary word identity +0x6c, new static-descriptor identity +0x70 |
| func_002CCB34 | ARM | 104 | new command ipc_command_func_002CCB34 +0x68 |

There are no inline command headers and no direct calls. Pool entries occur in the exact physical order shown.

## Complete normative mnemonic sequences

The following committed sequence is complete and literal. B emits only the ARM section/function header. E1 and E2 close the body before emitting neutral symbolic pools. Every other line is an instruction in exact physical order. Implementation must preserve every mnemonic, operand, width, condition, frame operation, multiregister grouping, label, and branch destination.

```asm
.syntax unified
.arch armv6k
.arm
.macro B f
 .section .text.\f,"ax",%progbits;.balign 4;.arm;.global \f;.type \f,%function
\f:
.endm
.macro E1 f,c
 .size \f,.-\f
.Lc_\f:.word \c
.endm
.macro E2 f,c,h
 .size \f,.-\f
.Lc_\f:.word \c
.Lh_\f:.word \h
.endm

B func_002C9334
push {r4,r5,r6,r7,r8,r9,r10,lr};add r4,sp,#52;ldm r4,{r1,r5,r6}
add r4,sp,#40;ldr r9,[sp,#32];ldm r4,{r7,r8,r12};mrc p15,0,r4,c13,c0,3
ldr r10,.Lc_func_002C9334;str r10,[r4,#128]!;add lr,r4,#4
str r1,[r4,#24];stm lr,{r2,r3,r9};mov r2,#12;add lr,r4,#28
orr r1,r2,r1,lsl #4;stm lr,{r1,r12};add lr,r4,#16;stm lr,{r7,r8}
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#12];str r0,[r6];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,pc}
E1 func_002C9334,ipc_command_func_002C9334

B func_001F152C
push {r0,r1,r2,r4,r5,r6,r7,r8,r9,lr};mov r6,r0;mrc p15,0,r4,c13,c0,3
ldr r2,.Lc_func_001F152C;mov r3,#32;mov r0,#0;str r2,[r4,#128]!
ldrh r2,[sp,#8];strh r2,[r4,#4];str r3,[r4,#8]
mrc p15,0,r3,c13,c0,3;add r5,r3,#384;orr r0,r0,r2,lsl #14
ldm r5,{r7,r8};orr r0,r0,#2;strd r0,[r5];ldr r0,.Lh_func_001F152C
ldr r0,[r0];svc #50;stm r5,{r7,r8};ands r1,r0,#0x80000000;bmi 1f
ldrb r0,[r4,#8];strb r0,[r6];ldr r0,[r4,#4]
1:add sp,sp,#12;pop {r4,r5,r6,r7,r8,r9,pc}
E2 func_001F152C,ipc_command_func_002C9220,ipc_handle_slot_iota

B func_00133DA4
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,lr};mov r5,r1;mov r6,r2
ldr r8,[sp,#40];mov r7,r3;mrc p15,0,r4,c13,c0,3
ldr r0,.Lc_func_00133DA4;str r0,[r4,#128]!;ldrb r0,[sp];strb r0,[r4,#4]
ldr r0,.Lh_func_00133DA4;ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#12];str r0,[r6]
ldr r0,[r4,#16];str r0,[r7];ldr r0,[r4,#20];str r0,[r8];ldr r0,[r4,#4]
1:add sp,sp,#16;pop {r4,r5,r6,r7,r8,pc}
E2 func_00133DA4,ipc_command_func_002C6104,ipc_handle_slot_alpha

B func_001F7030
push {r4,r5,r6,r7,r8,lr};add r4,sp,#32;ldm r4,{r1,r6,r12}
ldr r5,[sp,#28];ldr r7,[sp,#24];mrc p15,0,r4,c13,c0,3
ldr r8,.Lc_func_001F7030;str r8,[r4,#128]!;add lr,r4,#4
stm lr,{r2,r3,r7};add lr,r4,#16;mov r2,#10;stm lr,{r1,r12}
add lr,r4,#24;orr r1,r2,r1,lsl #4;stm lr,{r1,r5};mov r1,#12
add lr,r4,#32;orr r1,r1,r12,lsl #4;stm lr,{r1,r6};ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,pc}
E1 func_001F7030,ipc_command_func_001F7030

B func_001F73F4
push {r4,r5,r6,r7,r8,lr};mov r6,r1;mov r7,r2;ldr r2,[sp,#24]
mov r5,r3;mrc p15,0,r4,c13,c0,3;ldr r1,.Lc_func_001F73F4
str r1,[r4,#128]!;ldm r2,{r1,r3};add r8,r4,#4;ldr r2,[r2,#8]
str r2,[r4,#12];stm r8,{r1,r3};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi 1f;ldrd r0,[r4,#8];strd r0,[r6]
add r1,r4,#16;ldrd r0,[r1];strd r0,[r7];ldr r0,[r4,#24]
str r0,[r5];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_001F73F4,ipc_command_func_001F73F4

B func_002C5548
push {r4,r5,r6,r7,r8,r9,r10,lr};add r4,sp,#32;ldm r4,{r5,r8,r9}
mrc p15,0,r4,c13,c0,3;ldr r6,.Lc_func_002C5548;mov r12,#0
str r6,[r4,#128]!;add r7,r4,#4;stm r7,{r1,r3,r5}
mrc p15,0,r1,c13,c0,3;add r5,r1,#384;orr r1,r12,r3,lsl #16
orr r1,r1,#2;ldrd r6,[r5];stm r5,{r1,r2};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;strd r6,[r5];bmi 1f;ldr r0,[r4,#8]
str r0,[r8];ldrh r0,[r4,#12];strh r0,[r9];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,pc}
E1 func_002C5548,ipc_command_func_002C5548

B func_002C59AC
push {r4,r5,r6,r7,r8,lr};ldr r12,[sp,#24];mrc p15,0,r4,c13,c0,3
ldr r5,.Lc_func_002C59AC;str r5,[r4,#128]!;ldr r5,.La_func_002C59AC
str r2,[r4,#8];add r6,r4,#20;sub r2,r5,#162816;str r5,[r4,#4]
strd r2,[r4,#12];add r2,r2,#1024;stm r6,{r2,r12}
mrc p15,0,r2,c13,c0,3;add r5,r2,#384;ldr r2,.Ld_func_002C59AC
ldrd r6,[r5];str r1,[r5,#4];str r2,[r5];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;strd r6,[r5];ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,pc}
.size func_002C59AC,.-func_002C59AC
.Lc_func_002C59AC:.word ipc_command_func_002C59AC
.La_func_002C59AC:.word ipc_aux_func_002C59AC_word1
.Ld_func_002C59AC:.word ipc_aux_func_002C59AC_static_descriptor

B func_002CCB34
push {r4,r5,r6,r7,r8,lr};add r4,sp,#24;ldm r4,{r6,r12}
ldr r5,[sp,#32];mrc p15,0,r4,c13,c0,3;ldr r7,.Lc_func_002CCB34
str r7,[r4,#128]!;add r8,r4,#4;stm r8,{r1,r3,r12};mov r1,#3072
orr r1,r1,r3,lsl #14;add r8,r4,#16;orr r1,r1,#2;stm r8,{r1,r2}
mov r1,#12;add r8,r4,#24;orr r1,r1,r12,lsl #4;stm r8,{r1,r6}
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_002CCB34,ipc_command_func_002CCB34
```

## Literal identities and relocation ledger

The eight functions contribute 12 post-body literal slots forming 12 classes. Eight classes are new: six commands and the two auxiliary identities used by func_002C59AC. Four classes reuse earlier identities: ipc_command_func_002C9220, ipc_command_func_002C6104, ipc_handle_slot_iota, and ipc_handle_slot_alpha. No differently named identities compare equal; there are no splits or accidental merges.

Across IPC batches 12, 13, and 15 through 23, 306 post-body slots form 163 identity/value classes. This batch adds no inline identity and no call relocation.

## Probe evidence and validator requirements

The ignored probe build/AS_EUR_REV2/probes/ipc_templates23_probe.S has SHA-256 f5fbe43341169accd21243b1fba58371c693e16eafa80a25a944909458fa5aa7. Its object has SHA-256 cb3b0f7d36a5a8462b587ab85fcec7fdaa352b02ca27af4666353de8706ad250. Independent bounded extraction proved all eight complete bodies byte-exact.

A validator must enforce names, ARM mode, sizes, literal schedules, labels, body/pool boundaries, all 12 pool relocations and 12 equality classes, and absence of calls/inline commands. It must reject raw instruction directives, numeric pool words, register substitution, rescheduling, and missing or extra instructions.
