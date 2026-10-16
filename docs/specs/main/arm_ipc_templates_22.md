# Probe-verified ARM IPC templates 22

## Scope and provenance

- Target: AS_EUR_REV2, independently verified in docs/PROVENANCE.md.
- Analysis date: 2026-10-16.
- Evidence: evidence-gated symbols, current objdiff, bounded private-target control/data-flow analysis, and independent GNU Arm probes.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203.
- Clean-room role: analysis/specification only. No target bytes, encoded instruction words, private addresses, private literal values, implementation, assets, or proprietary source are present.

This batch covers eight previously unspecified and unmatched ARM-state IPC wrappers in eight schedules totaling exactly 920 code bytes. Public CTR conventions identify TPIDRURO plus 128 as the command buffer, TPIDRURO plus 384 as the static-buffer area, and SVC 50 as SendSyncRequest.

## Function and relocation inventory

| Function | Mode | Size | Command form | Pool and relocation order |
| --- | --- | ---: | --- | --- |
| func_001FC668 | ARM | 120 | pool ipc_command_func_001FC668 | command +0x78, existing ipc_handle_slot_kappa +0x7c |
| func_00125018 | ARM | 116 | inline ipc_inline_command_id_10_no_params | new ipc_handle_slot_mu +0x74 |
| func_00126638 | ARM | 116 | pool ipc_command_func_00126638 | command +0x74, existing ipc_handle_slot_alpha +0x78 |
| func_002C56CC | ARM | 116 | pool ipc_command_func_002C56CC | command +0x74 |
| func_002E4038 | ARM | 116 | pool ipc_command_func_002E4038 | command +0x74 |
| func_001F7508 | ARM | 112 | pool ipc_command_func_001F7508 | command +0x70 |
| func_002C58B0 | ARM | 112 | pool ipc_command_func_002C58B0 | command +0x70 |
| func_002C5AA0 | ARM | 112 | pool ipc_command_func_002C5AA0 | command +0x70 |

There are no direct-call relocations. func_00125018 synthesizes public command ID 10 with zero normal and translated words and therefore has a handle-only pool. Every other command is pool-backed.

## Complete normative mnemonic sequences

The following committed sequence is complete and literal. B emits only the standard ARM section/function header. E1, E2, and EH close the body at the declared size and emit the displayed neutral symbolic pool entries. Every other line is an instruction in exact physical order. Labels occupy no bytes. An implementation must preserve every mnemonic, register, width, condition, stack offset, multiregister grouping, store order, and branch destination.

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
.macro EH f,h
 .size \f,.-\f
.Lh_\f:.word \h
.endm

B func_001FC668
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,lr};add r4,sp,#56
ldm r4,{r5,r6,r7,r8,r9,r10};add r4,sp,#84;ldm r4,{r11,lr}
mrc p15,0,r4,c13,c0,3;ldr r12,.Lc_func_001FC668;mov r0,#0
str r12,[r4,#128]!;add r12,r4,#40;str r5,[r4,#12];str r10,[r4,#32]
strd r2,[r4,#4];strd r6,[r4,#16];strd r8,[r4,#24]
ldrb r2,[sp,#80];strb r2,[r4,#36];strd r0,[r4,#48]
ldr r0,.Lh_func_001FC668;stm r12,{r11,lr};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi 1f;ldr r0,[sp];ldr r1,[r4,#8]
str r1,[r0];ldr r0,[r4,#4]
1:add sp,sp,#16;pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
E2 func_001FC668,ipc_command_func_001FC668,ipc_handle_slot_kappa

B func_00125018
push {r4,r5,r6,r7,r8,r9,r10,lr};mov r5,r0;add r0,sp,#32;mov r6,r1
ldm r0,{r9,r10};mov r7,r2;mov r8,r3;mrc p15,0,r4,c13,c0,3
mov r0,#(10 << 16);str r0,[r4,#128]!;ldr r0,.Lh_func_00125018
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#16];str r0,[r6]
ldr r0,[r4,#20];str r0,[r7];ldr r0,[r4,#24];str r0,[r8]
ldr r0,[r4,#28];str r0,[r9];ldr r0,[r4,#32];str r0,[r10]
ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,pc}
EH func_00125018,ipc_handle_slot_mu

B func_00126638
push {r4,r5,r6,r7,r8,r9,r10,lr};ldr r6,[sp,#36];ldr r12,[sp,#32]
mrc p15,0,r4,c13,c0,3;ldr r5,.Lc_func_00126638;mov r9,#0
str r5,[r4,#128]!;add r7,r4,#4;stm r7,{r0,r2,r12};mov r0,#1024
orr r0,r0,r2,lsl #14;orr r0,r0,#2;strd r0,[r4,#16]
mrc p15,0,r0,c13,c0,3;add r5,r0,#384;orr r0,r9,r12,lsl #14
ldm r5,{r7,r8};orr r0,r0,#2;stm r5,{r0,r3};ldr r0,.Lh_func_00126638
ldr r0,[r0];svc #50;stm r5,{r7,r8};ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#8];str r0,[r6];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,pc}
E2 func_00126638,ipc_command_func_00126638,ipc_handle_slot_alpha

B func_002C56CC
push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr};ldr r12,[sp,#40]
mrc p15,0,r4,c13,c0,3;ldr r5,.Lc_func_002C56CC;str r5,[r4,#128]!
str r2,[r4,#4];ldm r3,{r5,r6,r7,r8,r9,r10,r11,lr};str r5,[r4,#8]
add r5,r4,#12;stm r5,{r6,r7,r8,r9,r10,r11,lr};add r5,r3,#32
add r9,r4,#56;ldr r3,[r3,#48];ldm r5,{r5,r6,r7,r8};stm r9,{r3,r12}
add r9,r4,#40;stm r9,{r5,r6,r7,r8};ldrb r3,[sp,#44];strb r3,[r4,#64]
mov r3,#12;orr r2,r3,r2,lsl #4;str r1,[r4,#72];str r2,[r4,#68]
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
E1 func_002C56CC,ipc_command_func_002C56CC

B func_002E4038
push {r4,r5,r6,r7,r8,r9,r10,lr};add r4,sp,#32;mov r6,r1
ldm r4,{r1,r5,r7,r8,r12};mrc p15,0,r4,c13,c0,3
ldr r9,.Lc_func_002E4038;str r9,[r4,#128]!;add r10,r4,#8
str r2,[r4,#4];mov r2,#32;str r2,[r4,#24];mov r2,#12288
stm r10,{r1,r5,r8,r12};orr r2,r2,r1,lsl #14;orr r2,r2,#2
strd r2,[r4,#32];mov r2,#13312;orr r2,r2,r12,lsl #14
add r10,r4,#40;orr r2,r2,#2;stm r10,{r2,r7};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi 1f;ldr r0,[r4,#8];str r0,[r6]
ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,pc}
E1 func_002E4038,ipc_command_func_002E4038

B func_001F7508
push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr};add r4,sp,#40;mov r5,r1
ldm r4,{r1,r6,r7,r12};add r4,sp,#56;ldm r4,{r3,r8,r9}
mrc p15,0,r4,c13,c0,3;ldr r10,.Lc_func_001F7508;mov r11,#0
str r10,[r4,#128]!;add lr,r4,#8;str r2,[r4,#4];stm lr,{r1,r6,r7}
add lr,r4,#20;orr r1,r11,r3,lsl #14;stm lr,{r3,r8};add r10,r4,#32
orr r1,r1,#2;str r9,[r4,#28];stm r10,{r1,r12};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi 1f;ldr r0,[r4,#12];str r0,[r5]
ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
E1 func_001F7508,ipc_command_func_001F7508

B func_002C58B0
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,lr};ldr r1,[sp,#56]
mrc p15,0,r4,c13,c0,3;ldr r5,.Lc_func_002C58B0;mov r12,#0
str r5,[r4,#128]!;add lr,r4,#8;str r3,[r4,#4]
ldm r1,{r3,r5,r6,r7,r8,r9,r10,r11};stm lr,{r3,r5,r6,r7,r8,r9,r10,r11}
ldr r3,[r1,#36];ldr r1,[r1,#32];str r1,[r4,#40];str r3,[r4,#44]
ldrh r1,[sp,#60];strh r1,[r4,#48];str r2,[r4,#56];str r12,[r4,#52]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r1,[sp,#4];ldr r0,[r4,#12];str r0,[r1];ldr r0,[r4,#4]
1:add sp,sp,#16;pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
E1 func_002C58B0,ipc_command_func_002C58B0

B func_002C5AA0
push {r0,r1,r2,r3,r4,r5,r6,lr};add r4,sp,#32;ldm r4,{r2,r3,r12}
mrc p15,0,r4,c13,c0,3;ldr r5,.Lc_func_002C5AA0;str r5,[r4,#128]!
add r5,r4,#16;str r1,[r4,#4];ldrh r1,[sp,#8];strh r1,[r4,#8]
ldrb r1,[sp,#12];strb r1,[r4,#12];stm r5,{r3,r12};add r5,r4,#28
ldrb r1,[sp,#44];strb r1,[r4,#24];lsl r1,r3,#2;mov r3,#5120
orr r1,r3,r1,lsl #14;orr r1,r1,#2;stm r5,{r1,r2};ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#16;pop {r4,r5,r6,pc}
E1 func_002C5AA0,ipc_command_func_002C5AA0
```

## Semantic behavior summary

- func_001FC668 builds a twelve-word global-handle request from entry registers and eight stack arguments, including one byte and a final zero/pointer pair. On success it stores response word 2 through saved entry r0 and returns response word 1.
- func_00125018 sends inline no-input command 10 through a global handle. On success it stores response words 3 through 8 through six output pointers in entry r0-r3 and the first two stack words, then returns response word 1.
- func_00126638 builds a global-handle request containing ordinary words plus one mapped descriptor and one thread-static descriptor. It restores the saved static-buffer pair before error testing and stores response word 2 through the second stack pointer on success.
- func_002C56CC copies a structured block into request words 2 through 14, adds a byte, a mapped descriptor, and a pointer, sends through the entry handle, and returns response word 1.
- func_002E4038 builds two descriptor/pointer pairs from five stack words, sends through the entry handle, stores response word 2 through entry r1 on success, and returns response word 1.
- func_001F7508 builds a mixed ordinary/static-descriptor request from seven stack words, stores response word 3 through entry r1 on success, and returns response word 1.
- func_002C58B0 copies ten structure words plus a halfword and trailing word/zero pair, stores response word 3 through saved entry r1 on success, and returns response word 1.
- func_002C5AA0 builds mixed word, halfword, byte, and scaled static-descriptor fields from saved registers and stack words, sends through the entry handle, and returns response word 1.

## Literal identity ledger

The eight functions contribute exactly ten post-body literal slots forming ten classes. Eight classes are new: seven command identities and the new handle ipc_handle_slot_mu. Two classes reuse earlier handles ipc_handle_slot_kappa and ipc_handle_slot_alpha. No differently named identities compare equal, and there are no splits or accidental merges.

Across IPC batches 12, 13, and 15 through 22, exactly 294 post-body literal slots form 155 identity/value classes. Inline command identities are tracked separately; this batch adds public ipc_inline_command_id_10_no_params.

## Independent probes and validator requirements

The ignored local probe is build/AS_EUR_REV2/probes/ipc_templates22_probe.S. Its SHA-256 is 74b5e24e8594128a76386b58096e10a117dfa66af5ad8f1dc5a590b073674084; the assembled object's SHA-256 is 62b9e280a9d38691ee6933441e27f870d0b70442769efa16eb2ab10b83655267. Independent bounded section extraction proved all eight complete bodies byte-exact at their declared sizes.

A deterministic validator must pin source and manifest hashes; enforce all eight names, ARM mode, sizes, literal mnemonic sequences, branch targets, pool boundaries and forms, ten absolute pool relocations, ten equality classes, and absence of direct calls; reject raw instruction directives and numeric pool words; and independently compare each complete body against the verified target.
