# Probe-verified ARM IPC templates 21

## Scope and provenance

- Target: AS_EUR_REV2, independently verified in docs/PROVENANCE.md.
- Analysis date: 2026-10-16.
- Evidence: evidence-gated symbols, current objdiff, private-target control/data-flow analysis, current base-object comparison, and independent GNU Arm probes.
- Clean-room role: analysis/specification only. This document contains no target bytes, encoded instruction words, private addresses, private literal values, assets, implementation, or proprietary source.

This batch covers 12 unmatched ARM-state IPC wrappers in 12 schedules totaling 1,616 code bytes. Public CTR conventions identify TPIDRURO plus 128 as the command buffer, TPIDRURO plus 384 as the static-buffer area, and SVC 50 as SendSyncRequest.

## Complete normative mnemonic sequences

The following is the complete self-contained normative schedule. Implementation must use this committed specification and must not depend on the ignored build probe. B emits only the standard ARM section/function header. E1 and E2 close the body before emitting symbolic post-body pools. Every other line is an instruction in physical order. Numeric immediates are independently derived public ABI, IPC descriptor, stack, or structure constants; command and handle values remain neutral symbolic identities.

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

B func_002E3F94
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,lr};add r4,sp,#60
ldm r4,{r5,r12};ldr r1,[sp,#68];ldr r6,[sp,#56];mrc p15,0,r4,c13,c0,3
ldr r7,.Lc_func_002E3F94;mov r11,#0;str r7,[r4,#128]!;add r7,r4,#8
str r2,[r4,#4];ldr r2,[r6];stm r7,{r2,r5};add r7,r4,#16;mov r2,#32
stm r7,{r1,r2};mrc p15,0,r2,c13,c0,3;add r5,r2,#384;ldr r2,[r6]
orr r1,r11,r1,lsl #14;ldm r5,{r7,r8,r9,r10};orr r1,r1,#2
orr r2,r11,r2,lsl #14;add r11,r5,#8;orr r2,r2,#2;stm r11,{r1,r12}
strd r2,[r5];ldr r0,[r0];svc #50;stm r5,{r7,r8,r9,r10}
ands r1,r0,#0x80000000;bmi 1f;ldr r0,[sp,#4];ldr r1,[r4,#8];str r1,[r0]
ldr r0,[r4,#12];str r0,[r6];ldr r0,[r4,#4]
1:add sp,sp,#16;pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
E1 func_002E3F94,ipc_command_func_001FFA8C

B func_001325A4
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,lr};add r4,sp,#64
ldm r4,{r1,r10};add r4,sp,#72;ldr r5,[sp,#60];ldm r4,{r6,r12}
add r4,sp,#80;ldr r9,[sp,#56];ldm r4,{r11,lr};mrc p15,0,r4,c13,c0,3
ldr r7,.Lc_func_001325A4;mov r8,#0;str r7,[r4,#128]!;add r7,r4,#20
str r9,[r4,#12];str r1,[r4,#16];str r11,[r4,#28];strd r2,[r4,#4]
mov r2,#2048;stm r7,{r10,r12};orr r1,r2,r1,lsl #14;add r7,r4,#36
orr r1,r1,#2;str lr,[r4,#32];stm r7,{r1,r5};orr r1,r8,r12,lsl #14
add r7,r4,#44;orr r1,r1,#2;stm r7,{r1,r6};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi 1f;ldr r1,[sp,#4];ldr r0,[r4,#12];str r0,[r1]
ldr r0,[r4,#4]
1:add sp,sp,#16;pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
E1 func_001325A4,ipc_command_func_001325A4

B func_002C5B84
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,lr};add r4,sp,#56
ldm r4,{r0,r12};mrc p15,0,r4,c13,c0,3;ldr r5,.Lc_func_002C5B84
mov r2,#0;str r5,[r4,#128]!;str r3,[r4,#4]
ldm r0,{r5,r6,r7,r8,r9,r10,r11,lr};str r5,[r4,#8];add r5,r4,#12
stm r5,{r6,r7,r8,r9,r10,r11,lr};add r5,r0,#32;add r9,r4,#56
ldr r0,[r0,#48];ldm r5,{r5,r6,r7,r8};stm r9,{r0,r12};add r9,r4,#40
stm r9,{r5,r6,r7,r8};ldrb r0,[sp,#64];strb r0,[r4,#64];str r1,[r4,#72]
str r2,[r4,#68];ldr r0,[sp,#8];mov r1,#12;orr r1,r1,r3,lsl #4
str r0,[r4,#80];str r1,[r4,#76];ldr r0,[sp];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];add sp,sp,#16
pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
E1 func_002C5B84,ipc_command_func_002C5B84

B func_001F6F40
push {r4,r5,r6,r7,r8,r9,r10,lr};add r4,sp,#36;mov r7,r3;mov r5,r1
mov r6,r2;ldm r4,{r3,r12};ldr r1,[sp,#48];ldr r2,[sp,#44]
ldr r8,[sp,#32];mrc p15,0,r4,c13,c0,3;ldr r10,.Lc_func_001F6F40
mov r9,#0;str r10,[r4,#128]!;str r1,[r4,#12];orr r1,r9,r1,lsl #14
add r9,r4,#16;orr r1,r1,#2;stm r9,{r1,r2};add r9,r4,#4
stm r9,{r3,r12};ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#12];str r0,[r6]
ldr r0,[r4,#16];str r0,[r7];ldrb r0,[r4,#20];strb r0,[r8];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,pc}
E1 func_001F6F40,ipc_command_func_001F6F40

B func_002E4110
push {r4,r5,r6,r7,r8,lr};mov r6,r1;ldr r5,[sp,#28];ldr r12,[sp,#24]
mrc p15,0,r4,c13,c0,3;add r4,r4,#128;ldr r7,.Lc_func_002E4110
str r5,[r4,#8];mov r5,#32;stm r4,{r7,r12};add r12,r12,r12,lsl #1
str r5,[r4,#12];lsl r12,r12,#2;mov r5,#10240;orr r5,r5,r12,lsl #14
orr r5,r5,#2;str r2,[r4,#24];mov r1,#0;str r5,[r4,#20]
mrc p15,0,r2,c13,c0,3;add r5,r2,#384;orr r1,r1,r12,lsl #14 @ +0x54: r12, never r3
ldm r5,{r7,r8};orr r1,r1,#2;stm r5,{r1,r3};ldr r0,[r0];svc #50
stm r5,{r7,r8};ands r1,r0,#0x80000000;bmi 1f;ldr r0,[r4,#8]
str r0,[r6];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_002E4110,ipc_command_func_002E4110

B func_002E6BA0
push {r0,r1,r2,r3,r4,lr};mrc p15,0,r4,c13,c0,3
ldr r12,.Lc_func_002E6BA0;mov r3,#0;str r12,[r4,#128]!;str r1,[r4,#4]
ldr r1,[r2];str r1,[r4,#8];ldr r1,[r2,#4];str r1,[r4,#12]
ldr r1,[r2,#8];str r1,[r4,#16];ldr r1,[r2,#12];str r1,[r4,#20]
ldr r1,[r2,#16];str r1,[r4,#24];ldrh r1,[r2,#20];strh r1,[r4,#28]
ldrb r1,[sp,#12];strb r1,[r4,#32];ldrb r1,[sp,#24];strb r1,[r4,#36]
str r0,[r4,#52];ldr r0,.Lh_func_002E6BA0;mov r1,#32;str r1,[r4,#40]
str r3,[r4,#48];ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];add sp,sp,#16;pop {r4,pc}
E2 func_002E6BA0,ipc_command_func_002E6BA0,ipc_handle_slot_lambda

B func_002E3F10
push {r4,r5,r6,r7,r8,lr};mov r5,r1;ldr r1,[sp,#36];ldr r6,[sp,#32]
ldr r7,[sp,#28];ldr r12,[sp,#24];mrc p15,0,r4,c13,c0,3
ldr r8,.Lc_func_002E3F10;str r8,[r4,#128]!;add lr,r4,#4
str r7,[r4,#12];stm lr,{r2,r12};add lr,r4,#16;mov r2,#32;stm lr,{r1,r2}
mov r2,#2048;orr r2,r2,r12,lsl #14;orr r2,r2,#2;strd r2,[r4,#28]
mov r2,#1024;orr r1,r2,r1,lsl #14;add lr,r4,#36;orr r1,r1,#2
stm lr,{r1,r6};ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_002E3F10,ipc_command_func_002E3F10

B func_002E422C
push {r4,r5,r6,r7,r8,lr};mov r5,r1;ldr r1,[sp,#36];ldr r6,[sp,#32]
ldr r7,[sp,#28];ldr r12,[sp,#24];mrc p15,0,r4,c13,c0,3
ldr r8,.Lc_func_002E422C;str r8,[r4,#128]!;add lr,r4,#4
str r7,[r4,#12];stm lr,{r2,r12};add lr,r4,#16;mov r2,#32;stm lr,{r1,r2}
mov r2,#1024;orr r1,r2,r1,lsl #14;add lr,r4,#28;orr r1,r1,#2
stm lr,{r1,r6};mov r1,#10;add lr,r4,#36;orr r1,r1,r12,lsl #4
stm lr,{r1,r3};ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_002E422C,ipc_command_func_002E422C

B func_002E435C
push {r4,r5,r6,r7,r8,r9,r10,lr};mov r7,r1;add r1,sp,#32
ldm r1,{r5,r8};add r1,sp,#40;ldm r1,{r6,r12};mrc p15,0,r4,c13,c0,3
ldr r9,.Lc_func_002E435C;mov r1,#0;str r9,[r4,#128]!;add r10,r4,#4
stm r10,{r2,r5,r8,r12};mov r2,#32;str r2,[r4,#20];mov r2,#12
orr r2,r2,r5,lsl #4;strd r2,[r4,#28];mrc p15,0,r2,c13,c0,3
add r5,r2,#384;orr r1,r1,r12,lsl #14;orr r1,r1,#2
ldrd r8,[r5];stm r5,{r1,r6};ldr r0,[r0];svc #50;ands r1,r0,#0x80000000
strd r8,[r5];bmi 1f;ldr r0,[r4,#8];str r0,[r7];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,pc}
E1 func_002E435C,ipc_command_func_002E435C

B func_002E6A88
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
ldr r0,.Lc_func_002E6A88;add r4,r4,#128;mov r6,#0;strd r0,[r4]
mov r1,r3;ldr r3,[r2];add r0,r4,#20;str r3,[r4,#8]
ldr r3,[r2,#4];str r3,[r4,#12];ldrb r2,[r2,#8];strb r2,[r4,#16]
bl func_0016C090;ldrb r0,[sp,#16];strb r0,[r4,#28]
ldrb r0,[sp,#20];strb r0,[r4,#32];mov r0,#32;str r0,[r4,#36]
ldr r0,.Lh_func_002E6A88;str r5,[r4,#48];str r6,[r4,#44]
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,r5,r6,pc}
E2 func_002E6A88,ipc_command_func_002E6A88,ipc_handle_slot_lambda

B func_00174770
push {r4,r5,r6,r7,r8,r9,r10,lr};add r4,sp,#32;mov r7,r1
ldm r4,{r1,r6};mrc p15,0,r4,c13,c0,3;ldr r5,.Lc_func_00174770
mov r12,#0;str r5,[r4,#128]!;strd r2,[r4,#4];ldr r2,[r6]
str r2,[r4,#12];mrc p15,0,r2,c13,c0,3;add r5,r2,#384
ldrd r8,[r5];ldr r2,[r6];str r1,[r5,#4];orr r2,r12,r2,lsl #14
orr r2,r2,#2;str r2,[r5];ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;strd r8,[r5];bmi 1f;ldr r0,[r4,#8]
str r0,[r7];ldr r0,[r4,#12];str r0,[r6];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,pc}
E1 func_00174770,ipc_command_func_00174770

B func_00194D78
push {r4,r5,r6,r7,r8,r9,r10,lr};mov r7,r1;add r1,sp,#32
ldm r1,{r6,r12};mrc p15,0,r4,c13,c0,3;ldr r5,.Lc_func_00194D78
mov r1,#0;str r5,[r4,#128]!;add r8,r4,#4;mov r5,#3072
stm r8,{r3,r12};orr r3,r5,r3,lsl #14;orr r3,r3,#2
str r2,[r4,#16];str r3,[r4,#12];mrc p15,0,r2,c13,c0,3
add r5,r2,#384;orr r1,r1,r12,lsl #14;orr r1,r1,#2
ldrd r8,[r5];stm r5,{r1,r6};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;strd r8,[r5];bmi 1f;ldr r0,[r4,#8]
str r0,[r7];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,r9,r10,pc}
E1 func_00194D78,ipc_command_func_002C9190
```

## Exact body, pool, and call offsets

| Function | ARM body | Post-body pool | Named call |
| --- | ---: | --- | --- |
| func_002E3F94 | +0x00..+0x9f | command +0xa0 | none |
| func_001325A4 | +0x00..+0x9b | command +0x9c | none |
| func_002C5B84 | +0x00..+0x8f | command +0x90 | none |
| func_001F6F40 | +0x00..+0x87 | command +0x88 | none |
| func_002E4110 | +0x00..+0x87 | command +0x88 | none |
| func_002E6BA0 | +0x00..+0x87 | command +0x88, handle +0x8c | none |
| func_002E3F10 | +0x00..+0x7f | command +0x80 | none |
| func_002E422C | +0x00..+0x7f | command +0x80 | none |
| func_002E435C | +0x00..+0x7f | command +0x80 | none |
| func_002E6A88 | +0x00..+0x7b | command +0x7c, handle +0x80 | BL func_0016C090 at +0x3c |
| func_00174770 | +0x00..+0x77 | command +0x78 | none |
| func_00194D78 | +0x00..+0x77 | command +0x78 | none |

All functions are ARM state, so each body instruction advances four bytes. Labels occupy no bytes. Conditional branches in the normative sequences land on their immediately following numeric local return labels. No conditional branch destination differs between the current base and target. There are no missing or extra instruction slots in the current base; all remaining differences are substitutions or same-width scheduling errors. The named BL in func_002E6A88 is the only in-body relocation.

## Exhaustive current-base mismatch ledger

Each entry lists every differing instruction offset in the current base object and the required target mnemonic. Offsets absent from a row already agree with the target.

Fourth-rebuild delta: the only remaining difference is in `func_002E4110` at
`+0x54`. The required instruction is
`orr r1,r1,r12,lsl #14`, using the scaled value retained in `r12`. The current
base incorrectly selects `r3` as the shifted source. This is an operand-only
substitution: no instruction is missing or extra, the surrounding order is
unchanged, and no label or branch destination changes.

The following rows retain the exhaustive third-rebuild evidence that led to
the self-contained schedules above:

- func_001325A4: +0x2c mov r8,#0; +0x54 add r7,r4,#36; +0x58 orr r1,r1,#2; +0x7c ands r1,r0,#0x80000000. The add must precede the final descriptor ORR.
- func_00174770: +0x18 mov r12,#0; +0x40 orr r2,r12,r2,lsl #14; +0x54 ands r1,r0,#0x80000000; +0x60 ldr r0,[r4,#8]; +0x64 str r0,[r7]; +0x68 ldr r0,[r4,#12]; +0x6c str r0,[r6]. Both output transfers use r0.
- func_00194D78: +0x18 mov r1,#0; +0x5c ands r1,r0,#0x80000000; +0x68 ldr r0,[r4,#8]; +0x6c str r0,[r7].
- func_001F6F40: +0x2c mov r9,#0; +0x38 orr r1,r9,r1,lsl #14; +0x58 ands r1,r0,#0x80000000; +0x60/+0x64 load response word 2 into r0 and store r0 through r5; +0x68/+0x6c do the same for response word 3 through r6; +0x70/+0x74 do the same for response word 4 through r7; +0x78 ldrb r0,[r4,#20]; +0x7c strb r0,[r8].
- func_002C5B84: +0x14 mov r2,#0; +0x50 strb r0,[r4,#64]; +0x5c ldr r0,[sp,#8]; +0x60 mov r1,#12; +0x64 orr r1,r1,r3,lsl #4; +0x68 str r0,[r4,#80]; +0x7c and r1,r0,#0x80000000. The pointer store follows descriptor materialization, not the stack load.
- func_002E3F10: +0x4c mov r2,#1024; +0x50 orr r1,r2,r1,lsl #14; +0x68 ands r1,r0,#0x80000000; +0x70 ldr r0,[r4,#8]; +0x74 str r0,[r5].
- func_002E3F94: +0x1c mov r11,#0; +0x4c orr r1,r11,r1,lsl #14; +0x58 orr r2,r11,r2,lsl #14; +0x78 ands r1,r0,#0x80000000.
- func_002E4110: +0x44 mov r1,#0; +0x54 orr r1,r1,r12,lsl #14; +0x70 ands r1,r0,#0x80000000; +0x78 ldr r0,[r4,#8]; +0x7c str r0,[r6].
- func_002E422C: +0x3c mov r2,#1024; +0x40 orr r1,r2,r1,lsl #14; +0x68 ands r1,r0,#0x80000000; +0x70 ldr r0,[r4,#8]; +0x74 str r0,[r5].
- func_002E435C: +0x20 mov r1,#0; +0x30 mov r2,#32; +0x34 str r2,[r4,#20]; +0x64 ands r1,r0,#0x80000000; +0x70 ldr r0,[r4,#8]; +0x74 str r0,[r7].
- func_002E6A88: +0x14 mov r6,#0; +0x20 ldr r3,[r2]; +0x24 add r0,r4,#20; +0x28 str r3,[r4,#8]; +0x2c ldr r3,[r2,#4]; +0x30 str r3,[r4,#12]; +0x34 ldrb r2,[r2,#8]; +0x38 strb r2,[r4,#16]; +0x3c bl func_0016C090; +0x44 strb r0,[r4,#28]; +0x4c strb r0,[r4,#32]; +0x6c and r1,r0,#0x80000000. The structure loads, request stores, helper-address setup, and call must occur in exactly this order.
- func_002E6BA0: +0x0c mov r3,#0; +0x44 strh r1,[r4,#28]; +0x4c strb r1,[r4,#32]; +0x54 strb r1,[r4,#36]; +0x60 mov r1,#32; +0x64 str r1,[r4,#40]; +0x74 and r1,r0,#0x80000000.

## Literal identities and relocation ledger

The functions contribute 14 post-body literal slots forming 13 classes. Ten are new command identities. Reused identities are ipc_command_func_001FFA8C, ipc_command_func_002C9190, and ipc_handle_slot_lambda; the handle class occurs twice. There are no equality splits or accidental merges.

Across IPC batches 12, 13, and 15 through 21, 284 post-body slots form 147 identity/value classes. Ten functions have command-only pools. func_002E6BA0 and func_002E6A88 have command-then-handle pools. func_002E6A88 additionally has the named direct ARM call relocation before its two pool relocations. This batch has no inline command identities.

## Independent verification and validator requirements

The committed schedule above is duplicated in the ignored independent probe build/AS_EUR_REV2/probes/ipc_templates21_probe.S only for local verification. Its SHA-256 is d1ba25c6179a67e202c54054fc838b72360c7d5c48c742459cbf09763ff12640; the assembled object's SHA-256 is 8789795a4c0c904f3d1033d6b31f0fb6063488c141185601c0203bd675810aa3.

Eleven complete bodies compare byte-exact directly. func_002E6A88 compares byte-exact after applying its named call relocation; that relocation is its sole unlinked difference. A validator must enforce every mnemonic and operand in the committed sequence, body size, label destination, pool form and offset, all 14 post-body relocations, all 13 equality classes, and the single in-body call relocation. It must reject raw instruction directives, numeric pool words, missing or extra instructions, reordered stores, register substitutions, and condition-code substitutions.
