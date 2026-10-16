# Probe-verified ARM IPC templates 28

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: evidence-gated symbols, the current objdiff report, bounded
  private-target control/data-flow inspection, physical literal-pool identity
  comparison, and independent GNU Arm probes.
- Probe toolchain: GNU Arm assembler, objcopy, objdump, and readelf
  2.45.1.20251203 from GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, encoded
  instruction words, private addresses, private pool values, implementation,
  assets, or proprietary source are present.

This batch covers twenty-seven previously unspecified and unmatched ARM-state
IPC wrappers totaling exactly 1,532 code bytes. Public CTR conventions identify
TPIDRURO plus 128 as the command buffer and SVC 50 as SendSyncRequest.

## Function and relocation inventory

| Function | Mode | Size | Header identity | Handle source | Request / successful output |
| --- | --- | ---: | --- | --- | --- |
| `func_00118300` | ARM | 48 | new literal ID 2158, 3 normal, 0 translated; pool +0x30 | pointer in entry `r0` | words 1-3 = entry `r1`-`r3`; no copied output |
| `func_001190E0` | ARM | 52 | new literal ID 20, 1 normal, 0 translated; pool +0x34 | existing `ipc_handle_slot_xi`, pool +0x38 | word 1 = entry `r0`; no copied output |
| `func_00125E50` | ARM | 52 | existing `ipc_command_func_00126808`, ID 11, 1 normal, 0 translated; pool +0x34 | pointer in entry `r0` | byte of entry `r1` to word 1; no copied output |
| `func_00126600` | ARM | 48 | new literal ID 66, 2 normal, 0 translated; pool +0x30 | existing `ipc_handle_slot_alpha`, pool +0x34 | words 1-2 = entry `r0`-`r1`; no copied output |
| `func_001266FC` | ARM | 60 | new literal ID 62, 2 normal, 0 translated; pool +0x3c | existing `ipc_handle_slot_alpha`, pool +0x40 | word 1 = entry `r0`; byte of entry `r1` to word 2; no copied output |
| `func_001338B8` | ARM | 52 | new literal ID 1, 2 normal, 2 translated; pool +0x34 | pointer in entry `r0` | words 1-2 = entry `r2`-`r3`; word 3 = 32; no copied output |
| `func_00145FC0` | ARM | 60 | new inline ID 4, 0 normal, 0 translated | existing `ipc_handle_slot_nu`, pool +0x3c | no request fields; response byte in word 2 to entry `r0` |
| `func_00160844` | ARM | 56 | new literal ID 21, 2 normal, 2 translated; pool +0x38 | pointer in entry `r0` | words 1-3 = entry `r2`, `r3`, zero; word 4 = entry `r1`; no copied output |
| `func_001709BC` | ARM | 56 | new literal ID 12, 1 normal, 0 translated; pool +0x38 | pointer in entry `r0` | word 1 = entry `r1`; response word 2 to entry `r2` |
| `func_00170C80` | ARM | 56 | new literal ID 2, 0 normal, 2 translated; pool +0x38 | existing `ipc_handle_slot_xi`, pool +0x3c | word 1 = 32; no copied output |
| `func_001F6F04` | ARM | 56 | new literal ID 2066, 2 normal, 0 translated; pool +0x38 | pointer in entry `r0` | words 1-2 = entry `r2`-`r3`; response words 2-3 to entry `r1` |
| `func_001F72F4` | ARM | 56 | new literal ID 2130, 4 normal, 0 translated; pool +0x38 | pointer in entry `r0` | three words at entry `r1` to words 1-3; no copied output |
| `func_001F7330` | ARM | 56 | new literal ID 2139, 2 normal, 0 translated; pool +0x38 | pointer in entry `r0` | words 1-2 = entry `r2`-`r3`; response word 2 to entry `r1` |
| `func_00202DFC` | ARM | 60 | new literal ID 1, 1 normal, 2 translated; pool +0x3c | existing `ipc_handle_slot_zeta`, pool +0x40 | words 1-3 = entry `r1`, zero, entry `r0`; no copied output |
| `func_00202EC0` | ARM | 60 | existing inline ID 9, 0 normal, 0 translated | existing `ipc_handle_slot_zeta`, pool +0x3c | no request fields; response byte in word 2 to entry `r0` |
| `func_00203128` | ARM | 60 | new shared `ipc_command_func_00202DFC`, ID 1, 1 normal, 2 translated; pool +0x3c | existing `ipc_handle_slot_xi`, pool +0x40 | words 1-2 = entry `r0`, 32; no copied output |
| `func_0020316C` | ARM | 48 | existing inline ID 23, 0 normal, 0 translated | existing `ipc_handle_slot_xi`, pool +0x30 | no request fields and no copied output |
| `func_002C35DC` | ARM | 48 | existing `ipc_command_func_0010986C`, ID 1, 0 normal, 2 translated; pool +0x30 | pointer in entry `r0` | word 1 = 32; no copied output |
| `func_002C55B4` | ARM | 52 | existing `ipc_command_func_002C6104`, ID 5, 1 normal, 0 translated; pool +0x34 | pointer in entry `r0` | halfword of entry `r1` to word 1; no copied output |
| `func_002C581C` | ARM | 64 | new literal ID 16, 1 normal, 2 translated; pool +0x40 | pointer in entry `r0` | word 1 = entry `r2`; word 2 = descriptor `4096 OR (r2 LSL 14) OR 2`; word 3 = entry `r1`; no copied output |
| `func_002C596C` | ARM | 60 | new literal ID 7, 2 normal, 0 translated; pool +0x3c | pointer in entry `r0` | halfword of entry `r1` to word 1; byte of entry `r2` to word 2; no copied output |
| `func_002CCFD0` | ARM | 64 | existing `ipc_command_func_002C8E54`, ID 36, 2 normal, 2 translated; pool +0x40 | pointer in entry `r0` | words 1-2 = entry `r1`, `r3`; word 3 = `10 OR (r3 LSL 4)`; word 4 = entry `r2`; no copied output |
| `func_002DD9FC` | ARM | 60 | new literal ID 77, 2 normal, 0 translated; pool +0x3c | existing `ipc_handle_slot_alpha`, pool +0x40 | words 1-2 = entry `r0`-`r1`; response halfword in word 2 to entry `r2` |
| `func_002E419C` | ARM | 64 | new literal ID 11, 1 normal, 2 translated; pool +0x40 | pointer in entry `r0` | word 1 = entry `r2`; word 2 = 32; response word 2 to entry `r1` |
| `func_002E43E0` | ARM | 64 | existing `ipc_command_func_002C90EC`, ID 12, 2 normal, 2 translated; pool +0x40 | pointer in entry `r0` | words 1-2 = entry `r2`-`r3`; word 3 = 32; response word 2 to entry `r1` |
| `func_002E68D4` | ARM | 60 | new literal ID 39, 1 normal, 0 translated; pool +0x3c | existing `ipc_handle_slot_lambda`, pool +0x40 | word 1 = entry `r1`; response word 2 to entry `r0` |
| `func_002E6B0C` | ARM | 60 | new literal ID 36, 1 normal, 0 translated; pool +0x3c | existing `ipc_handle_slot_lambda`, pool +0x40 | word 1 = entry `r1`; response words 2-3 to entry `r0` |

There are no direct calls, external branches, or call relocations. Each
displayed pool entry is the only post-body word at its stated offset. Every
new command identity is distinct from every established literal class. New
identities are mutually distinct except for the deliberately shared ID-1,
1-normal/2-translated class used by `func_00202DFC` and `func_00203128`.

## Complete normative mnemonic sequences

The following schedules are complete and literal. `B` emits only the standard
ARM section/function header. `EP1` and `EP2` close the executable body before
emitting the displayed neutral symbolic pool entries. Labels and directives
occupy no executable bytes. Every other line is an instruction in exact
physical order. Preserve every mnemonic, operand, register, condition, branch
shape, and pool order. In particular, the six leading `mov r0,r0`
instructions are the exact historical no-op spelling; the architectural
`nop` hint is not interchangeable.

```asm
.syntax unified
.arch armv6k
.arm
.macro B f
 .section .text.\f,"ax",%progbits;.balign 4;.arm;.global \f;.type \f,%function
\f:
.endm
.macro EP1 f,p
 .size \f,.-\f
.Lpool_\f:.word \p
.endm
.macro EP2 f,p0,p1
 .size \f,.-\f
.Lpool_\f:.word \p0;.word \p1
.endm

B func_00118300
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr ip,.Lpool_func_00118300;str ip,[r4,#128]!
add lr,r4,#4;stm lr,{r1,r2,r3};ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP1 func_00118300,ipc_command_func_00118300

B func_001190E0
mov r0,r0;push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001190E0;str r1,[r4,#128]!;str r0,[r4,#4]
ldr r0,.Lpool_func_001190E0+4;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP2 func_001190E0,ipc_command_func_001190E0,ipc_handle_slot_xi

B func_00125E50
push {r0,r1,r4,lr};mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_00125E50;str r1,[r4,#128]!
ldrb r1,[sp,#4];strb r1,[r4,#4];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#8;pop {r4,pc}
EP1 func_00125E50,ipc_command_func_00126808

B func_00126600
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_00126600;str r2,[r4,#128]!;strd r0,[r4,#4]
ldr r0,.Lpool_func_00126600+4;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP2 func_00126600,ipc_command_func_00126600,ipc_handle_slot_alpha

B func_001266FC
push {r0,r1,r4,lr};mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001266FC;str r1,[r4,#128]!;str r0,[r4,#4]
ldrb r0,[sp,#4];strb r0,[r4,#8];ldr r0,.Lpool_func_001266FC+4
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];add sp,sp,#8;pop {r4,pc}
EP2 func_001266FC,ipc_command_func_001266FC,ipc_handle_slot_alpha

B func_001338B8
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001338B8;add r4,r4,#128;stm r4,{r1,r2,r3}
mov r1,#32;str r1,[r4,#12];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP1 func_001338B8,ipc_command_func_001338B8

B func_00145FC0
mov r0,r0;push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(4 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_00145FC0
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_00145FC0
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_00145FC0:pop {r4,r5,r6,pc}
EP1 func_00145FC0,ipc_handle_slot_nu

B func_00160844
push {r4,r5,r6,lr};mrc p15,0,r4,c13,c0,3
ldr r5,.Lpool_func_00160844;mov ip,#0;str r5,[r4,#128]!
add r6,r4,#4;str r1,[r4,#16];stm r6,{r2,r3,ip}
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,r5,r6,pc}
EP1 func_00160844,ipc_command_func_00160844

B func_001709BC
push {r4,r5,r6,lr};mov r5,r2;mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_001709BC;str r2,[r4,#128]!;str r1,[r4,#4]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001709BC
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_001709BC:pop {r4,r5,r6,pc}
EP1 func_001709BC,ipc_command_func_001709BC

B func_00170C80
mov r0,r0;push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_00170C80;str r0,[r4,#128]!;mov r0,#32
str r0,[r4,#4];ldr r0,.Lpool_func_00170C80+4;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP2 func_00170C80,ipc_command_func_00170C80,ipc_handle_slot_xi

B func_001F6F04
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F6F04;add r4,r4,#128;stm r4,{r1,r2,r3}
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001F6F04
ldrd r0,[r4,#8];strd r0,[r5];ldr r0,[r4,#4]
.Lret_001F6F04:pop {r4,r5,r6,pc}
EP1 func_001F6F04,ipc_command_func_001F6F04

B func_001F72F4
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_001F72F4;str r2,[r4,#128]!
ldrd r2,[r1];ldr r1,[r1,#8];str r1,[r4,#12];strd r2,[r4,#4]
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EP1 func_001F72F4,ipc_command_func_001F72F4

B func_001F7330
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F7330;add r4,r4,#128;stm r4,{r1,r2,r3}
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001F7330
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_001F7330:pop {r4,r5,r6,pc}
EP1 func_001F7330,ipc_command_func_001F7330

B func_00202DFC
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_00202DFC;mov r2,#0;str r3,[r4,#128]!
add ip,r4,#4;str r0,[r4,#12];ldr r0,.Lpool_func_00202DFC+4
stm ip,{r1,r2};ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP2 func_00202DFC,ipc_command_func_00202DFC,ipc_handle_slot_zeta

B func_00202EC0
mov r0,r0;push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(9 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_00202EC0
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_00202EC0
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_00202EC0:pop {r4,r5,r6,pc}
EP1 func_00202EC0,ipc_handle_slot_zeta

B func_00203128
mov r0,r0;push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_00203128;str r1,[r4,#128]!;str r0,[r4,#4]
mov r0,#32;str r0,[r4,#8];ldr r0,.Lpool_func_00203128+4
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EP2 func_00203128,ipc_command_func_00202DFC,ipc_handle_slot_xi

B func_0020316C
mov r0,r0;push {r4,lr};mrc p15,0,r4,c13,c0,3
mov r0,#(23 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_0020316C
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EP1 func_0020316C,ipc_handle_slot_xi

B func_002C35DC
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002C35DC;str r1,[r4,#128]!
mov r1,#32;str r1,[r4,#4];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP1 func_002C35DC,ipc_command_func_0010986C

B func_002C55B4
push {r0,r1,r4,lr};mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002C55B4;str r1,[r4,#128]!
ldrh r1,[sp,#4];strh r1,[r4,#4];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#8;pop {r4,pc}
EP1 func_002C55B4,ipc_command_func_002C6104

B func_002C581C
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_002C581C;str r3,[r4,#128]!;mov r3,#4096
str r2,[r4,#4];orr r2,r3,r2,lsl #14;orr r2,r2,#2
str r1,[r4,#12];str r2,[r4,#8];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP1 func_002C581C,ipc_command_func_002C581C

B func_002C596C
push {r0,r1,r2,r4,r5,lr};mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002C596C;str r1,[r4,#128]!
ldrh r1,[sp,#4];strh r1,[r4,#4];ldrb r1,[sp,#8];strb r1,[r4,#8]
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];add sp,sp,#12;pop {r4,r5,pc}
EP1 func_002C596C,ipc_command_func_002C596C

B func_002CCFD0
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr ip,.Lpool_func_002CCFD0;str ip,[r4,#128]!;add lr,r4,#4
stm lr,{r1,r3};mov r1,#10;add lr,r4,#12
orr r1,r1,r3,lsl #4;stm lr,{r1,r2};ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP1 func_002CCFD0,ipc_command_func_002C8E54

B func_002DD9FC
push {r4,r5,r6,lr};mov r5,r2;mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_002DD9FC;str r2,[r4,#128]!;strd r0,[r4,#4]
ldr r0,.Lpool_func_002DD9FC+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_002DD9FC
ldrh r0,[r4,#8];strh r0,[r5];ldr r0,[r4,#4]
.Lret_002DD9FC:pop {r4,r5,r6,pc}
EP2 func_002DD9FC,ipc_command_func_002DD9FC,ipc_handle_slot_alpha

B func_002E419C
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002E419C;add r4,r4,#128;stm r4,{r1,r2}
mov r1,#32;str r1,[r4,#8];ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_002E419C
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_002E419C:pop {r4,r5,r6,pc}
EP1 func_002E419C,ipc_command_func_002E419C

B func_002E43E0
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002E43E0;add r4,r4,#128;stm r4,{r1,r2,r3}
mov r1,#32;str r1,[r4,#12];ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_002E43E0
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_002E43E0:pop {r4,r5,r6,pc}
EP1 func_002E43E0,ipc_command_func_002C90EC

B func_002E68D4
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002E68D4;add r4,r4,#128;strd r0,[r4]
ldr r0,.Lpool_func_002E68D4+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_002E68D4
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_002E68D4:pop {r4,r5,r6,pc}
EP2 func_002E68D4,ipc_command_func_002E68D4,ipc_handle_slot_lambda

B func_002E6B0C
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002E6B0C;add r4,r4,#128;strd r0,[r4]
ldr r0,.Lpool_func_002E6B0C+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_002E6B0C
ldrd r0,[r4,#8];strd r0,[r5];ldr r0,[r4,#4]
.Lret_002E6B0C:pop {r4,r5,r6,pc}
EP2 func_002E6B0C,ipc_command_func_002E6B0C,ipc_handle_slot_lambda
```

## Semantic behavior and identity ledger

Every wrapper writes exactly the displayed request, issues SendSyncRequest,
and returns response word 1 on nonnegative SVC status. Wrappers using `and`
plus `cmp` select that response with `ldrge`; wrappers using `ands` plus `bmi`
skip their output copy when the SVC result is negative and otherwise return
response word 1. Entry-handle wrappers dereference entry `r0`; global-handle
wrappers dereference their displayed symbolic handle slot. Access widths,
save sets, stack cleanup, descriptor construction, and request-store order are
normative.

This batch contributes exactly 36 post-body literal slots:

- 24 command-header slots: nineteen occurrences forming eighteen new classes,
  plus established
  classes `ipc_command_func_00126808`, `ipc_command_func_0010986C`,
  `ipc_command_func_002C6104`, `ipc_command_func_002C8E54`, and
  `ipc_command_func_002C90EC`, each reused once; and
- 12 handle slots: `alpha` three times, `xi` four times, `nu` once, `zeta`
  twice, and `lambda` twice.

Physical private-target comparison confirms a bijection between raw pool
identity and the symbolic assignments above. Across IPC batches 12, 13, 15
through 27, and this batch, exactly 391 post-body slots form 198 identity/value
classes.

There are three inline-header occurrences. Inline IDs 9 and 23 reuse
established no-parameter semantic identities. Inline ID 4 is a new
no-parameter semantic identity. Inline identities have no pool slot or
relocation. The two literal ID-1 headers are the same new 1-normal/2-translated
identity and deliberately share the symbol `ipc_command_func_00202DFC`.

## Probe evidence, overlap audit, and validator requirements

The ignored probe `build/AS_EUR_REV2/probes/ipc_templates28_probe.S` has
SHA-256 `abfade8c963cb62f8dbe1a9811d813f200472f89bad412aac6d19609a8cc0a3c`;
its assembled object has SHA-256
`05da43abe51058f4ee42e5eae293aab5b35af7592bbcc09beb7ab29751e13026`.
Size-bounded independent extraction proved all twenty-seven complete
executable bodies byte-exact at their declared sizes: 27/27 functions and
1,532/1,532 code bytes.

The selection was intersected with the current objdiff unmatched inventory,
every manifest and specification through IPC batch 27 and duplicate batch 28,
and the concurrent batch-29 selections: runtime functions `func_002D03B4` and
`func_002DFED0`, plus the ten duplicate-template functions in
`arm_duplicate_templates_29.md`. Every selected function was unmatched and
absent from those sets. The twenty-seven body ranges and 36 post-body slots are
mutually disjoint, do not overlap an inventoried function, and do not overlap
either concurrent selection.

A deterministic validator must pin source and manifest hashes; enforce all 27
names, ARM mode, declared sizes, complete literal mnemonic sequences,
body/pool boundaries, all 36 pool relocations and their identity assignments,
all three inline command identities, the deliberate shared ID-1 command
class, and the 391-slot/198-class cumulative bijection; and reject raw
instruction directives, numeric pool words, register substitution,
rescheduling, direct calls, and missing or extra instructions. It must
independently compare every complete body against the verified target.
