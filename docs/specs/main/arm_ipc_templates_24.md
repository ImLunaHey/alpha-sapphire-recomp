# Probe-verified ARM IPC templates 24

## Scope and provenance

- Target: AS_EUR_REV2, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: evidence-gated symbols, the current objdiff report, bounded private-target control/data-flow analysis, and independent GNU Arm probes.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203.
- Clean-room role: analysis/specification only. No target bytes, encoded instruction words, private addresses, private pool values, implementation, assets, or proprietary source are present.

This batch covers eight previously unspecified and unmatched ARM-state IPC wrappers in eight schedules totaling exactly 780 code bytes. Public CTR conventions identify TPIDRURO plus 128 as the command buffer, TPIDRURO plus 384 as the thread-static-buffer area, and SVC 50 as SendSyncRequest.

## Function and relocation inventory

| Function | Mode | Size | Pool and relocation order |
| --- | --- | ---: | --- |
| `func_002E3EA4` | ARM | 104 | new command `ipc_command_func_002E3EA4` at +0x68 |
| `func_00170954` | ARM | 100 | new command `ipc_command_func_00170954` at +0x64 |
| `func_001F16F8` | ARM | 100 | new command at +0x64, new static-descriptor identity at +0x68, existing handle `ipc_handle_slot_iota` at +0x6c |
| `func_002E3E3C` | ARM | 100 | existing command `ipc_command_func_001FF71C` at +0x64 |
| `func_001F6FCC` | ARM | 96 | new command `ipc_command_func_001F6FCC` at +0x60 |
| `func_002DE7D4` | ARM | 96 | new command at +0x60, existing handle `ipc_handle_slot_beta` at +0x64 |
| `func_00110310` | ARM | 92 | new command at +0x5c, existing handle `ipc_handle_slot_alpha` at +0x60 |
| `func_00132FE0` | ARM | 92 | new command `ipc_command_func_00132FE0` at +0x5c |

There are no inline command headers and no direct calls. Pool entries occur in the exact physical order shown.

## Complete normative mnemonic sequences

The following sequence is complete and literal. `B` emits only the standard ARM section/function header. `E1` and `E2` close the executable body at the declared size and emit the displayed neutral symbolic pool entries. Every other line is an instruction in exact physical order. An implementation must preserve every mnemonic, operand, register, width, condition, stack offset, multiregister grouping, label, and branch destination.

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

B func_002E3EA4
push {r4,r5,r6,r7,r8,lr};mov r6,r1;ldr r1,[sp,#24]
mrc p15,0,r4,c13,c0,3;ldr r5,.Lc_func_002E3EA4;mov r12,#0
str r5,[r4,#128]!;add r7,r4,#8;str r2,[r4,#4];mov r2,#32
stm r7,{r1,r2};mrc p15,0,r2,c13,c0,3;add r5,r2,#384
orr r1,r12,r1,lsl #14;ldm r5,{r7,r8};orr r1,r1,#2
stm r5,{r1,r3};ldr r0,[r0];svc #50;stm r5,{r7,r8}
ands r1,r0,#0x80000000;bmi 1f;ldr r0,[r4,#8];str r0,[r6]
ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_002E3EA4,ipc_command_func_002E3EA4

B func_00170954
push {r4,r5,r6,r7,r8,lr};ldr r7,[sp,#28];mrc p15,0,r4,c13,c0,3
ldr r5,.Lc_func_00170954;mov r12,#0;str r5,[r4,#128]!
add r6,r4,#4;stm r6,{r1,r2};ldrh r1,[sp,#24];strh r1,[r4,#12]
mrc p15,0,r2,c13,c0,3;add r5,r2,#384;orr r1,r12,r1,lsl #14
ldm r5,{r6,r8};orr r1,r1,#2;stm r5,{r1,r3};ldr r0,[r0]
svc #50;stm r5,{r6,r8};ands r1,r0,#0x80000000;bmi 1f
ldrh r0,[r4,#8];strh r0,[r7];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_00170954,ipc_command_func_00170954

B func_001F16F8
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,lr};mrc p15,0,r4,c13,c0,3
ldr r2,.Lc_func_001F16F8;str r2,[r4,#128]!;ldrb r2,[sp,#8]
strb r2,[r4,#4];ldrb r2,[sp,#12];strb r2,[r4,#8]
ldr r2,.La_func_001F16F8;str r0,[r4,#16];str r2,[r4,#12]
mrc p15,0,r0,c13,c0,3;add r5,r0,#384;ldrd r6,[r5]
str r2,[r0,#384]!;str r1,[r0,#4];ldr r0,.Lh_func_001F16F8
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
strd r6,[r5];ldrge r0,[r4,#4];add sp,sp,#16
pop {r4,r5,r6,r7,r8,pc}
.size func_001F16F8,.-func_001F16F8
.Lc_func_001F16F8:.word ipc_command_func_001F16F8
.La_func_001F16F8:.word ipc_aux_func_001F16F8_static_descriptor
.Lh_func_001F16F8:.word ipc_handle_slot_iota

B func_002E3E3C
push {r4,r5,r6,r7,r8,lr};add r4,sp,#24;mov r5,r1
ldm r4,{r1,r6,r12};mrc p15,0,r4,c13,c0,3
ldr r7,.Lc_func_002E3E3C;str r7,[r4,#128]!;add r8,r4,#12
strd r2,[r4,#4];mov r2,#32;str r2,[r4,#20];mov r2,#9216
stm r8,{r1,r12};orr r2,r2,r12,lsl #14;add r8,r4,#28
orr r2,r2,#2;stm r8,{r2,r6};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi 1f;ldr r0,[r4,#8];str r0,[r5]
ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_002E3E3C,ipc_command_func_001FF71C

B func_001F6FCC
push {r4,r5,r6,r7,r8,lr};add r4,sp,#24;mov r5,r1
ldm r4,{r7,r12};ldr r1,[sp,#32];mrc p15,0,r4,c13,c0,3
ldr r8,.Lc_func_001F6FCC;mov r6,#0;str r8,[r4,#128]!
str r1,[r4,#16];orr r1,r6,r1,lsl #14;add r6,r4,#20
orr r1,r1,#2;stm r6,{r1,r12};add r6,r4,#4;stm r6,{r2,r3,r7}
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_001F6FCC,ipc_command_func_001F6FCC

B func_002DE7D4
push {r0,r1,r2,r3,r4,r5,r6,lr};mov r5,r0;ldr r3,[sp,#32]
mrc p15,0,r4,c13,c0,3;ldr r12,.Lc_func_002DE7D4;mov r0,#0
str r12,[r4,#128]!;str r2,[r4,#4];ldrb r2,[sp,#12]
strb r2,[r4,#8];str r3,[r4,#12];ldrh r2,[sp,#36]
strh r2,[r4,#16];strd r0,[r4,#20];ldr r0,.Lh_func_002DE7D4
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
1:add sp,sp,#16;pop {r4,r5,r6,pc}
E2 func_002DE7D4,ipc_command_func_002DE7D4,ipc_handle_slot_beta

B func_00110310
push {r4,r5,r6,lr};mrc p15,0,r4,c13,c0,3
ldr r5,.Lc_func_00110310;mov r12,#0;str r5,[r4,#128]!
add r6,r4,#4;stm r6,{r1,r3};orr r1,r12,r1,lsl #14
str r0,[r4,#16];mov r0,#2048;orr r1,r1,#2
orr r0,r0,r3,lsl #14;add r6,r4,#20;orr r0,r0,#2
str r1,[r4,#12];stm r6,{r0,r2};ldr r0,.Lh_func_00110310
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,r5,r6,pc}
E2 func_00110310,ipc_command_func_00110310,ipc_handle_slot_alpha

B func_00132FE0
push {r0,r1,r2,r3,r4,r5,r6,lr};ldr r5,[sp,#36]
mrc p15,0,r4,c13,c0,3;ldr r3,.Lc_func_00132FE0
str r3,[r4,#128]!;str r2,[r4,#4];ldrh r3,[sp,#12]
strh r3,[r4,#8];ldrh r3,[sp,#32];strh r3,[r4,#12]
mov r3,#10;orr r2,r3,r2,lsl #4;str r1,[r4,#20]
str r2,[r4,#16];ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi 1f;ldrb r0,[r4,#8]
strb r0,[r5];ldr r0,[r4,#4]
1:add sp,sp,#16;pop {r4,r5,r6,pc}
E1 func_00132FE0,ipc_command_func_00132FE0
```

## Semantic behavior summary

- `func_002E3EA4` sends two ordinary words and a temporary thread-static descriptor/pointer pair through the entry handle. It restores the saved static-buffer pair before testing the result, stores response word 2 through entry `r1` on success, and returns response word 1.
- `func_00170954` sends two ordinary words plus a halfword and a temporary thread-static descriptor/pointer pair. It restores the pair after the request, stores response halfword 2 through stack argument 2 on success, and returns response word 1.
- `func_001F16F8` sends two entry bytes, a named static descriptor identity, and two pointers through a global handle. It restores the saved thread-static pair after the request and returns response word 1 on success.
- `func_002E3E3C` sends two entry words, three stack words, one fixed size, and one static descriptor/pointer pair through the entry handle. It stores response word 2 through entry `r1` on success and returns response word 1.
- `func_001F6FCC` sends three entry words, three stack words, and one static descriptor/pointer pair through the entry handle. It stores response word 3 through entry `r1` on success and returns response word 1.
- `func_002DE7D4` sends a word, byte, word, halfword, and zero pair through a global handle. It stores response word 3 through entry `r0` on success and returns response word 1.
- `func_00110310` sends two ordinary descriptor/pointer pairs plus one word through a global handle and returns response word 1 on success.
- `func_00132FE0` sends a word, two halfwords, and one counted pointer pair through the entry handle. It stores response byte 2 through stack argument 1 on success and returns response word 1.

## Literal identity and relocation ledger

The eight functions contribute exactly twelve post-body literal slots. Eight classes are new: seven command identities and `ipc_aux_func_001F16F8_static_descriptor`. Four slots reuse established classes: `ipc_command_func_001FF71C`, `ipc_handle_slot_iota`, `ipc_handle_slot_beta`, and `ipc_handle_slot_alpha`. The target establishes a strict identity/value bijection: no differently named identities compare equal and no identity is split across different values.

Across IPC batches 12, 13, and 15 through 24, exactly 318 post-body slots form 171 identity/value classes. This batch adds no inline identity and no direct-call relocation.

## Probe evidence, overlap audit, and validator requirements

The ignored probe `build/AS_EUR_REV2/probes/ipc_templates24_probe.S` has SHA-256 `6e2a5f86391aceb3ee772353597c2586159a6b872489012256277542a54a03ef`. Its assembled object has SHA-256 `81757da9847b3ae03d6f2e9e703333ed6f2108bbc227d4d5021fdb22d14273b4`. Size-bounded independent extraction proved all eight complete executable bodies byte-exact at their declared sizes.

The selection was intersected with the current objdiff inventory, all earlier IPC manifests/specifications, and the in-flight batch 23 manifests. Every selected function was unmatched and absent from those sets; the eight body ranges and all twelve post-body slots do not overlap any inventoried function or one another.

A deterministic validator must pin source and manifest hashes; enforce all eight names, ARM mode, sizes, the complete literal mnemonic sequences, branch targets, body/pool boundaries and ordering, all twelve absolute pool relocations and all twelve identity assignments; verify the 318-slot/171-class cumulative bijection; and reject raw instruction directives, numeric pool words, register substitution, rescheduling, calls, inline commands, and missing or extra instructions. It must independently compare every complete body against the verified target.
