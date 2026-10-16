# Probe-verified ARM IPC templates 30

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: evidence-gated symbols, the current objdiff unmatched report,
  bounded private-target control/data-flow inspection, physical literal-pool
  identity comparison, and independent GNU Arm probes.
- Probe toolchain: GNU Arm assembler, objcopy, objdump, and readelf
  2.45.1.20251203 from GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, encoded
  instruction words, private addresses, private pool values, implementation,
  assets, or proprietary source are present.

This batch covers the twenty-five remaining previously unspecified and
unmatched ARM-state IPC wrappers, totaling exactly 1,912 executable bytes.
Public CTR conventions identify TPIDRURO plus 128 as the command buffer,
TPIDRURO plus 384 as the thread-static-buffer area, and SVC 50 as
SendSyncRequest.

## Function and relocation inventory

All functions are ARM mode and have no external call or branch relocations.
Pool offsets are relative to the function body. Pool entries occur in exactly
the displayed order.

| Function | Size | Command identity and pool | Other pool identities | Request and successful output |
| --- | ---: | --- | --- | --- |
| `func_001F736C` | 76 | new `ipc_command_func_001F736C`, ID 2121, 1 normal, 0 translated; +0x4c | none; handle pointer in entry `r0` | byte entry `r2` to word 1; response words 2-5 to entry `r1` |
| `func_001F74B0` | 84 | new `ipc_command_func_001F74B0`, ID 2159, 1 normal, 0 translated; +0x54 | none; handle pointer in entry `r0` | word 1 = entry stack word; response bytes in words 2-3 to entry `r1-r2`, words 4-5 to entry `r3` |
| `func_001F75B4` | 72 | new `ipc_command_func_001F75B4`, ID 2049, 4 normal, 0 translated; +0x48 | none; handle pointer in entry `r0` | words 1-4 = entry `r2-r3` and two stack words; response word 3 to entry `r1` |
| `func_001F7668` | 84 | new `ipc_command_func_001F7668`, ID 2050, 3 normal, 2 translated; +0x54 | none; handle pointer in entry `r0` | words 1-3 = entry `r2-r3` and stack word 1; word 4 = `12 OR (stack word 1 LSL 4)`; word 5 = stack word 0; response word 2 to entry `r1` |
| `func_001F774C` | 72 | new `ipc_command_func_001F774C`, ID 3073, 4 normal, 0 translated; +0x48 | none; handle pointer in entry `r0` | words 1-4 = entry `r2-r3` and two stack words; response words 2-3 to entry `r1` |
| `func_001F7868` | 80 | new `ipc_command_func_001F7868`, ID 2049, 1 normal, 2 translated; +0x50 | none; handle pointer in entry `r0` | word 1 = entry `r3`; word 2 = `12 OR ((r3 * 552) LSL 4)`; word 3 = entry `r2`; response word 2 to entry `r1` |
| `func_001FB478` | 76 | new `ipc_command_func_001FB478`, ID 7, 11 normal, 0 translated; +0x4c | existing `ipc_handle_slot_epsilon`; +0x50 | byte entry `r0`, entry `r2-r3`, then eight stack words; no copied output |
| `func_001FB5B8` | 80 | new `ipc_command_func_001FB5B8`, ID 24, 6 normal, 2 translated; +0x50 | existing `ipc_handle_slot_epsilon`; +0x54 | entry `r1-r3`, stack words 0-1, byte stack word 2, zero, then entry `r0`; no copied output |
| `func_001FB6AC` | 68 | existing `ipc_command_func_002C576C`, ID 17, 1 normal, 0 translated; +0x44 | existing `ipc_handle_slot_epsilon`; +0x48 | byte entry `r1` to word 1; response word 2 to entry `r0` |
| `func_001FF934` | 72 | existing `ipc_command_func_00132E48`, ID 1, 3 normal, 2 translated; +0x48 | existing `ipc_handle_slot_eta`; +0x4c | words 1-4 = entry `r0-r2`, 32; response word 2 to entry `r3` |
| `func_00202DA8` | 76 | new `ipc_command_func_00202DA8`, ID 3, 5 normal, 0 translated; +0x4c | existing `ipc_handle_slot_zeta`; +0x50 | bytes entry `r0-r1`, words entry `r2-r3`, byte stack word 0; no copied output |
| `func_002C55EC` | 76 | new `ipc_command_func_002C55EC`, ID 29, 1 normal, 4 translated; +0x4c | existing `ipc_aux_func_002C59AC_word1`; +0x50; handle pointer in entry `r0` | word 1 = entry `r3`; words 2-5 = auxiliary, entry `r1`, descriptor `(r3 LSL 14) OR 2`, entry `r2`; no copied output |
| `func_002C57CC` | 76 | existing `ipc_command_func_002C6624`, ID 13, 1 normal, 0 translated; +0x4c | none; handle pointer in entry `r0` | halfword entry `r2` to word 1; response words 2-11 to entry `r1` |
| `func_002C5860` | 80 | existing inline ID 11, 0 normal, 0 translated | none; handle pointer in entry `r0` | no request fields; response words 2-13 to entry `r1` |
| `func_002C5924` | 68 | existing `ipc_command_func_002DE78C`, ID 33, 2 normal, 0 translated; +0x44 | none; handle pointer in entry `r0` | halfword and following byte from entry `r1` occupy word 1; byte entry `r2` to word 2; no copied output |
| `func_002C5A54` | 72 | new `ipc_command_func_002C5A54`, ID 18, 4 normal, 0 translated; +0x48 | none; handle pointer in entry `r0` | words 1-2 = entry `r2-r3`; byte stack word 0 to word 3; halfword stack word 1 to word 4; response word 3 to entry `r1` |
| `func_002C5B14` | 68 | existing `ipc_command_func_00126A20`, ID 19, 1 normal, 0 translated; +0x44 | none; handle pointer in entry `r0` | word 1 = entry `r1`; response words 2-5 to entry `r2` |
| `func_002C94A8` | 88 | new `ipc_command_func_002C94A8`, ID 1046, 5 normal, 2 translated; +0x58 | none; handle pointer in entry `r0` | entry `r2-r3`, stack word 0, byte stack word 1, stack word 3, descriptor `12 OR (stack word 3 LSL 4)`, stack word 2; no copied output |
| `func_002CCCA4` | 84 | existing `ipc_command_func_00118594`, ID 2, 2 normal, 2 translated; +0x54 | none; handle pointer in entry `r0` | word 1 = entry `r2`; byte entry `r3` to word 2; word 3 = `10 OR (r2 LSL 4)`; word 4 = entry `r1`; response word 2 to stack output pointer |
| `func_002DE588` | 76 | existing `ipc_command_func_00126740`, ID 13, 2 normal, 0 translated; +0x4c | existing `ipc_handle_slot_beta`; +0x50 | halfwords entry `r1-r2` to words 1-2; response word 2 to entry `r0` |
| `func_002DEA80` | 76 | new `ipc_command_func_002DEA80`, ID 11, 4 normal, 0 translated; +0x4c | existing `ipc_handle_slot_beta`; +0x50 | byte entry `r0`, word entry `r1`, halfwords entry `r2-r3`; no copied output |
| `func_002DEAD4` | 80 | new `ipc_command_func_002DEAD4`, ID 9, 4 normal, 0 translated; +0x50 | existing `ipc_handle_slot_beta`; +0x54 | byte entry `r0`, then halfwords entry `r1-r3`; no copied output |
| `func_002DEDB0` | 68 | existing `ipc_command_func_002C63E4`, ID 3, 1 normal, 0 translated; +0x44 | existing `ipc_handle_slot_beta`; +0x48 | byte entry `r1` to word 1; response byte in word 2 to entry `r0` |
| `func_002E6918` | 72 | new inline ID 51, 0 normal, 0 translated | existing `ipc_aux_func_001F16F8_static_descriptor`; +0x48; existing `ipc_handle_slot_lambda`; +0x4c | temporarily installs entry `r0` with the auxiliary descriptor in TLS scratch words, restores them after the request; no copied output |
| `func_002E6968` | 88 | new `ipc_command_func_002E6968`, ID 52, 1 normal, 6 translated; +0x58 | new `ipc_aux_func_002E6968_static_descriptor`; +0x5c; existing `ipc_handle_slot_lambda`; +0x60 | word 1 = entry `r3`; translated words = zero, entry `r0`, auxiliary, entry `r1`, `(r3 LSL 15) OR 4096 OR 2`, entry `r2`; no copied output |

## Complete normative mnemonic sequences

The schedules are complete and literal. `B` emits only the standard ARM
section/function header. `E`, `EP1`, `EP2`, and `EP3` close the executable
body before emitting zero through three ordered symbolic pool entries. Labels
and directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, branch shape, stack adjustment, and pool order.

```asm
.syntax unified
.arch armv6k
.arm
.macro B f
 .section .text.\f,"ax",%progbits;.balign 4;.arm;.global \f;.type \f,%function
\f:
.endm
.macro E f
 .size \f,.-\f
.endm
.macro EP1 f,p0
 .size \f,.-\f;.Lpool_\f:.word \p0
.endm
.macro EP2 f,p0,p1
 .size \f,.-\f;.Lpool_\f:.word \p0;.word \p1
.endm
.macro EP3 f,p0,p1,p2
 .size \f,.-\f;.Lpool_\f:.word \p0;.word \p1;.word \p2
.endm

B func_001F736C
push {r0,r1,r2,r4,r5,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F736C;str r1,[r4,#128]!
ldrb r1,[sp,#8];strb r1,[r4,#4];ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_001F736C
add r0,r4,#8;ldm r0,{r1,r2,r3};ldr r0,[r4,#20]
str r0,[r5,#12];stm r5,{r1,r2,r3};ldr r0,[r4,#4]
.Lret_001F736C:add sp,sp,#12;pop {r4,r5,pc}
EP1 func_001F736C,ipc_command_func_001F736C

B func_001F74B0
push {r4,r5,r6,r7,r8,lr};mov r6,r2;mov r5,r1;ldr r2,[sp,#24]
mov r7,r3;mrc p15,0,r4,c13,c0,3;ldr r1,.Lpool_func_001F74B0
add r4,r4,#128;stm r4,{r1,r2};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_001F74B0
ldrb r0,[r4,#8];strb r0,[r5];ldrb r0,[r4,#12];strb r0,[r6]
ldrd r0,[r4,#16];strd r0,[r7];ldr r0,[r4,#4]
.Lret_001F74B0:pop {r4,r5,r6,r7,r8,pc}
EP1 func_001F74B0,ipc_command_func_001F74B0

B func_001F75B4
push {r4,r5,r6,lr};add r4,sp,#16;mov r5,r1;ldm r4,{r1,ip}
mrc p15,0,r4,c13,c0,3;ldr r6,.Lpool_func_001F75B4
str r6,[r4,#128]!;add lr,r4,#12;stm lr,{r1,ip};strd r2,[r4,#4]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001F75B4
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
.Lret_001F75B4:pop {r4,r5,r6,pc}
EP1 func_001F75B4,ipc_command_func_001F75B4

B func_001F7668
push {r4,r5,r6,lr};add r4,sp,#16;mov r5,r1;ldm r4,{r1,ip}
mrc p15,0,r4,c13,c0,3;ldr r6,.Lpool_func_001F7668
str r6,[r4,#128]!;add lr,r4,#4;stm lr,{r2,r3,ip};mov r2,#12
orr r2,r2,ip,lsl #4;str r1,[r4,#20];str r2,[r4,#16]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001F7668
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_001F7668:pop {r4,r5,r6,pc}
EP1 func_001F7668,ipc_command_func_001F7668

B func_001F774C
push {r4,r5,r6,lr};add r4,sp,#16;mov r5,r1;ldm r4,{r1,ip}
mrc p15,0,r4,c13,c0,3;ldr r6,.Lpool_func_001F774C
str r6,[r4,#128]!;add lr,r4,#12;stm lr,{r1,ip};strd r2,[r4,#4]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001F774C
ldrd r0,[r4,#8];strd r0,[r5];ldr r0,[r4,#4]
.Lret_001F774C:pop {r4,r5,r6,pc}
EP1 func_001F774C,ipc_command_func_001F774C

B func_001F7868
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F7868;add r4,r4,#128;mov ip,#12
stm r4,{r1,r3};mov r1,#552;add r6,r4,#8;mul r1,r3,r1
orr r1,ip,r1,lsl #4;stm r6,{r1,r2};ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_001F7868
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_001F7868:pop {r4,r5,r6,pc}
EP1 func_001F7868,ipc_command_func_001F7868

B func_001FB478
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,sl,lr};add r4,sp,#48
ldm r4,{r0,r1,r5,r6,r7,r8,r9,ip};mrc p15,0,r4,c13,c0,3
ldr sl,.Lpool_func_001FB478;str sl,[r4,#128]!
ldrb sl,[sp];strb sl,[r4,#4];add sl,r4,#16
stm sl,{r0,r1,r5,r6,r7,r8,r9,ip};ldr r0,.Lpool_func_001FB478+4
strd r2,[r4,#8];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#16;pop {r4,r5,r6,r7,r8,r9,sl,pc}
EP2 func_001FB478,ipc_command_func_001FB478,ipc_handle_slot_epsilon

B func_001FB5B8
push {r4,r5,r6,r7,r8,lr};add r4,sp,#24;ldm r4,{r5,r6}
mrc p15,0,r4,c13,c0,3;ldr r7,.Lpool_func_001FB5B8;mov ip,#0
str r7,[r4,#128]!;add r8,r4,#4;stm r8,{r1,r2,r3,r5,r6}
ldrb r1,[sp,#32];strb r1,[r4,#24];str r0,[r4,#32]
ldr r0,.Lpool_func_001FB5B8+4;str ip,[r4,#28];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,pc}
EP2 func_001FB5B8,ipc_command_func_001FB5B8,ipc_handle_slot_epsilon

B func_001FB6AC
push {r0,r1,r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_001FB6AC;str r0,[r4,#128]!
ldrb r0,[sp,#4];strb r0,[r4,#4]
ldr r0,.Lpool_func_001FB6AC+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_001FB6AC
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_001FB6AC:add sp,sp,#8;pop {r4,r5,r6,pc}
EP2 func_001FB6AC,ipc_command_func_002C576C,ipc_handle_slot_epsilon

B func_001FF934
push {r4,r5,r6,lr};mov r5,r3;mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_001FF934;str r3,[r4,#128]!;add r6,r4,#4
stm r6,{r0,r1,r2};mov r0,#32;str r0,[r4,#16]
ldr r0,.Lpool_func_001FF934+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_001FF934
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_001FF934:pop {r4,r5,r6,pc}
EP2 func_001FF934,ipc_command_func_00132E48,ipc_handle_slot_eta

B func_00202DA8
push {r0,r1,r2,r3,r4,lr};mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_00202DA8;str r0,[r4,#128]!
ldrb r0,[sp];strb r0,[r4,#4];ldrb r0,[sp,#4];strb r0,[r4,#8]
strd r2,[r4,#12];ldrb r0,[sp,#24];strb r0,[r4,#20]
ldr r0,.Lpool_func_00202DA8+4;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#16;pop {r4,pc}
EP2 func_00202DA8,ipc_command_func_00202DA8,ipc_handle_slot_zeta

B func_002C55EC
push {r4,r5,r6,lr};mrc p15,0,r4,c13,c0,3
ldr r5,.Lpool_func_002C55EC;mov ip,#0;str r5,[r4,#128]!
ldr r5,.Lpool_func_002C55EC+4;add r6,r4,#4;str r1,[r4,#12]
stm r6,{r3,r5};orr r1,ip,r3,lsl #14;add r5,r4,#16
orr r1,r1,#2;stm r5,{r1,r2};ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
pop {r4,r5,r6,pc}
EP2 func_002C55EC,ipc_command_func_002C55EC,ipc_aux_func_002C59AC_word1

B func_002C57CC
push {r0,r1,r2,r4,r5,r6,r7,r8,r9,lr};mov r5,r1
mrc p15,0,r4,c13,c0,3;ldr r1,.Lpool_func_002C57CC
str r1,[r4,#128]!;ldrh r1,[sp,#8];strh r1,[r4,#4]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C57CC
add r0,r4,#8;ldm r0,{r1,r2,r3,r6,r7,r8,r9,ip}
stm r5,{r1,r2,r3,r6,r7,r8,r9,ip};ldrd r0,[r4,#40];strd r0,[r5,#32]
ldr r0,[r4,#4]
.Lret_002C57CC:add sp,sp,#12;pop {r4,r5,r6,r7,r8,r9,pc}
EP1 func_002C57CC,ipc_command_func_002C6624

B func_002C5860
push {r4,r5,r6,r7,r8,r9,sl,lr};mov r4,r1
mrc p15,0,r5,c13,c0,3;mov r1,#(11 << 16);str r1,[r5,#128]!
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C5860
add r0,r5,#8;ldm r0,{r1,r2,r3,r6,r7,r8,r9,ip}
stm r4,{r1,r2,r3,r6,r7,r8,r9,ip};add r1,r5,#40
ldr r0,[r5,#52];ldm r1,{r1,r2,r3};str r0,[r4,#44]
add r4,r4,#32;stm r4,{r1,r2,r3};ldr r0,[r5,#4]
.Lret_002C5860:pop {r4,r5,r6,r7,r8,r9,sl,pc}
E func_002C5860

B func_002C5924
push {r0,r1,r2,r4,r5,lr};mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_002C5924;str r2,[r4,#128]!
ldrh r2,[r1];strh r2,[r4,#4];ldrb r1,[r1,#2];strb r1,[r4,#6]
ldrb r1,[sp,#8];strb r1,[r4,#8];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#12;pop {r4,r5,pc}
EP1 func_002C5924,ipc_command_func_002DE78C

B func_002C5A54
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002C5A54;add r4,r4,#128;stm r4,{r1,r2,r3}
ldrb r1,[sp,#16];strb r1,[r4,#12];ldrh r1,[sp,#20];strh r1,[r4,#16]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C5A54
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
.Lret_002C5A54:pop {r4,r5,r6,pc}
EP1 func_002C5A54,ipc_command_func_002C5A54

B func_002C5B14
push {r4,r5,r6,lr};mov r5,r2;mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_002C5B14;str r2,[r4,#128]!;str r1,[r4,#4]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C5B14
add r0,r4,#8;ldm r0,{r1,r2,r3};ldr r0,[r4,#20]
str r0,[r5,#12];stm r5,{r1,r2,r3};ldr r0,[r4,#4]
.Lret_002C5B14:pop {r4,r5,r6,pc}
EP1 func_002C5B14,ipc_command_func_00126A20

B func_002C94A8
push {r4,r5,r6,lr};add r4,sp,#24;ldr r5,[sp,#16];ldm r4,{r1,ip}
mrc p15,0,r4,c13,c0,3;ldr r6,.Lpool_func_002C94A8
str r6,[r4,#128]!;add lr,r4,#4;stm lr,{r2,r3,r5}
ldrb r2,[sp,#20];strb r2,[r4,#16];mov r2,#12
str ip,[r4,#20];orr r2,r2,ip,lsl #4;str r1,[r4,#28];str r2,[r4,#24]
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,r5,r6,pc}
EP1 func_002C94A8,ipc_command_func_002C94A8

B func_002CCCA4
push {r0,r1,r2,r3,r4,r5,r6,lr};ldr r5,[sp,#32]
mrc p15,0,r4,c13,c0,3;ldr r3,.Lpool_func_002CCCA4
str r3,[r4,#128]!;str r2,[r4,#4];ldrb r3,[sp,#12];strb r3,[r4,#8]
mov r3,#10;orr r2,r3,r2,lsl #4;str r1,[r4,#16];str r2,[r4,#12]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002CCCA4
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_002CCCA4:add sp,sp,#16;pop {r4,r5,r6,pc}
EP1 func_002CCCA4,ipc_command_func_00118594

B func_002DE588
push {r0,r1,r2,r4,r5,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002DE588;str r0,[r4,#128]!
ldrh r0,[sp,#4];strh r0,[r4,#4];ldrh r0,[sp,#8];strh r0,[r4,#8]
ldr r0,.Lpool_func_002DE588+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_002DE588
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_002DE588:add sp,sp,#12;pop {r4,r5,pc}
EP2 func_002DE588,ipc_command_func_00126740,ipc_handle_slot_beta

B func_002DEA80
push {r0,r1,r2,r3,r4,lr};mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002DEA80;str r0,[r4,#128]!
ldrb r0,[sp];strb r0,[r4,#4];str r1,[r4,#8]
ldrh r0,[sp,#8];strh r0,[r4,#12];ldrh r0,[sp,#12];strh r0,[r4,#16]
ldr r0,.Lpool_func_002DEA80+4;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#16;pop {r4,pc}
EP2 func_002DEA80,ipc_command_func_002DEA80,ipc_handle_slot_beta

B func_002DEAD4
push {r0,r1,r2,r3,r4,lr};mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002DEAD4;str r0,[r4,#128]!
ldrb r0,[sp];strb r0,[r4,#4];ldrh r0,[sp,#4];strh r0,[r4,#8]
ldrh r0,[sp,#8];strh r0,[r4,#12];ldrh r0,[sp,#12];strh r0,[r4,#16]
ldr r0,.Lpool_func_002DEAD4+4;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#16;pop {r4,pc}
EP2 func_002DEAD4,ipc_command_func_002DEAD4,ipc_handle_slot_beta

B func_002DEDB0
push {r0,r1,r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002DEDB0;str r0,[r4,#128]!
ldrb r0,[sp,#4];strb r0,[r4,#4]
ldr r0,.Lpool_func_002DEDB0+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_002DEDB0
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_002DEDB0:add sp,sp,#8;pop {r4,r5,r6,pc}
EP2 func_002DEDB0,ipc_command_func_002C63E4,ipc_handle_slot_beta

B func_002E6918
push {r4,r5,r6,r7,r8,lr};mrc p15,0,r5,c13,c0,3
mov r1,#(51 << 16);str r1,[r5,#128]!
mrc p15,0,r1,c13,c0,3;add r4,r1,#384
ldr r1,.Lpool_func_002E6918;ldrd r6,[r4];str r0,[r4,#4]
ldr r0,.Lpool_func_002E6918+4;str r1,[r4];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;strd r6,[r4]
ldrge r0,[r5,#4];pop {r4,r5,r6,r7,r8,pc}
EP2 func_002E6918,ipc_aux_func_001F16F8_static_descriptor,ipc_handle_slot_lambda

B func_002E6968
push {r4,r5,r6,lr};mrc p15,0,r4,c13,c0,3
ldr r5,.Lpool_func_002E6968;mov ip,#0;str r5,[r4,#128]!
add r6,r4,#4;str r0,[r4,#12];ldr r0,.Lpool_func_002E6968+4
strd r0,[r4,#16];mov r1,#4096;stm r6,{r3,ip}
orr r0,r1,r3,lsl #15;add r6,r4,#24;orr r0,r0,#2
stm r6,{r0,r2};ldr r0,.Lpool_func_002E6968+8;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
pop {r4,r5,r6,pc}
EP3 func_002E6968,ipc_command_func_002E6968,ipc_aux_func_002E6968_static_descriptor,ipc_handle_slot_lambda
```

## Semantic identity and equality ledger

The twenty-three command-header pool occurrences form twenty-three semantic
classes. Eight reuse established classes:
`ipc_command_func_002C576C`, `ipc_command_func_00132E48`,
`ipc_command_func_002C6624`, `ipc_command_func_002DE78C`,
`ipc_command_func_00126A20`, `ipc_command_func_00118594`,
`ipc_command_func_00126740`, and `ipc_command_func_002C63E4`. The other
fifteen are new, mutually distinct, and use the function-derived names
displayed above. Physical target comparison confirms that none of those
fifteen equals any prior pool class. In particular, the command slot of
`func_002CCCA4` is identity-equal to the command slot of `func_00118594` from
batch 29, not a new function-local class.

The three auxiliary occurrences form three classes. The first two reuse
`ipc_aux_func_002C59AC_word1` and
`ipc_aux_func_001F16F8_static_descriptor`; the third is the new and distinct
`ipc_aux_func_002E6968_static_descriptor`. The eleven handle occurrences are
three `epsilon`, one `eta`, one `zeta`, four `beta`, and two `lambda` slots.
All reuse their established identities. Command, auxiliary, and handle class
names are a bijection with the physically compared target identities; no
incidental numerical equality may merge distinct semantic classes.

This batch therefore adds exactly 37 post-body literal slots and 16 new
identity/value classes. Across IPC batches 12, 13, and 15 through 30, exactly
468 post-body slots form 232 identity/value classes. A cumulative validator
must enforce both totals and the complete ordered assignment in this file.

The two inline-header occurrences have no pool slot or relocation. ID 11 with
zero normal and translated words reuses the established identity; ID 51 with
zero normal and translated words is a new inline identity. Inline identities
are not included in the post-body pool totals.

## Probe evidence, overlap audit, and validator requirements

An independent GNU Arm probe assembled the complete displayed schedules for
ARMv6K. The exact extracted schedule text has SHA-256
`6ea9f3e2a41e5adee942e15f6cda3c70a3025c902b5202eab3dc0d929b8a371c`;
the assembled probe object has SHA-256
`9fd89a0477baa9787e5c2fd60c05f093eae191600f7a98c69505317df8ff350b`.
Size-bounded extraction compared every body against the verified target after
excluding the symbolic pool words: 25/25 functions and 1,912/1,912 executable
bytes matched exactly. Relocation inspection found exactly the 37 ordered
`R_ARM_ABS32` pool relocations specified above and no call or branch
relocation. Direct inspection independently confirmed every declared body
size, pool boundary, and pool-load displacement.

The selection was intersected with the current objdiff unmatched inventory,
every IPC manifest/specification through batch 29, every other existing
manifest/specification, concurrent duplicate batch 31 (`func_001AB5F4` and
`func_001AD528`), concurrent duplicate batch 32 (`func_001AB0F8` and
`func_001AD02C`), and concurrent runtime batch 31 (`func_002DDA5C`,
`func_002DDBAC`, `func_002DDBC8`, `func_002DE3CC`, and `func_002DEEEC`). Every
selected function was ARM mode, unmatched, and absent from those sets. The 25
body ranges and 37 post-body slots are mutually disjoint and do not overlap an
inventoried function or any concurrent selection.

A deterministic validator must pin source and manifest hashes; enforce all
25 names, ARM mode, declared sizes, complete literal mnemonic schedules,
body/pool boundaries, all 37 pool relocations and their ordered identity
assignments, both inline command identities, and the 468-slot/232-class
cumulative bijection; and reject raw instruction directives, numeric pool
words, register substitution, rescheduling, direct calls, unnamed identities,
and missing or extra instructions. It must independently compare every
complete body against the verified target.
