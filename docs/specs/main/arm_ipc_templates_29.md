# Probe-verified ARM IPC templates 29

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

This batch covers twenty-four previously unspecified and unmatched ARM-state
IPC wrappers totaling exactly 1,748 code bytes. Public CTR conventions identify
TPIDRURO plus 128 as the command buffer and SVC 50 as SendSyncRequest.

## Function and relocation inventory

| Function | Size | Command identity and pool | Handle / auxiliary identity | Request and successful output |
| --- | ---: | --- | --- | --- |
| `func_00110264` | 72 | new literal ID 2, 2 normal, 0 translated; +0x48 | existing `ipc_handle_slot_alpha`; +0x4c | words 1-2 = entry `r0`-`r1`; response words 3 and 4 to entry `r2` and `r3` |
| `func_001102B4` | 84 | existing `ipc_command_func_002C6378`, ID 1, 1 normal, 0 translated; +0x54 | existing `ipc_handle_slot_alpha`; +0x58 | word 1 = entry `r1`; response words 2, 3, and 5 to entry `r2`, `r3`, and `r0` |
| `func_00110374` | 68 | new literal ID 49, 4 normal, 0 translated; +0x44 | existing `ipc_handle_slot_alpha`; +0x48 | byte entry `r0`, words 2-3 entry `r2`-`r3`, byte word 4 from the stack argument; no copied output |
| `func_00118594` | 60 | new literal ID 2, 2 normal, 2 translated; +0x3c | existing `ipc_handle_slot_kappa`; +0x40 | words 1-3 = entry `r1`, `r2`, zero; word 4 = entry `r0`; no copied output |
| `func_0011BA30` | 72 | existing inline ID 8, 0 normal, 0 translated | new `ipc_aux_func_0011BA30_tls_descriptor`; +0x48; existing `ipc_handle_slot_lambda`; +0x4c | temporarily installs entry `r0` with the auxiliary descriptor in TLS scratch words, restores them after the request; no copied output |
| `func_00124838` | 64 | existing `ipc_command_func_002C63E4`, ID 3, 1 normal, 0 translated; +0x40 | existing `ipc_handle_slot_nu`; +0x44 | word 1 = entry `r0`; response words 2-3 to entry `r1` |
| `func_00124880` | 72 | existing `ipc_command_func_001338B8`, ID 1, 2 normal, 2 translated; +0x48 | existing `ipc_handle_slot_nu`; +0x4c | words 1-2 = entry `r1`-`r2`; word 3 = static descriptor `12 OR (r1 LSL 4)`; word 4 = entry `r0` |
| `func_00124FE0` | 56 | new inline ID 1, 32 normal, 0 translated | entry handle in `r0`; direct call `func_00144D28` | helper copies 128 bytes from entry `r1` into command words 1-32; no copied output |
| `func_00125584` | 68 | existing `ipc_command_func_002C8F10`, ID 11, 3 normal, 2 translated; +0x44 | new `ipc_handle_slot_omicron`; +0x48 | words 1-3 = entry `r1`-`r3`; word 4 = static descriptor `12 OR (r1 LSL 5)`; word 5 = entry `r0` |
| `func_001266B4` | 68 | new inline ID 68, 0 normal, 0 translated | existing `ipc_handle_slot_alpha`; +0x44 | no request fields; response words 2 and 4 to entry `r1` and `r0` |
| `func_00133918` | 64 | new literal ID 22, 1 normal, 2 translated; +0x40 | entry handle in `r0` | byte of entry `r2` to word 1; word 2 zero; word 3 entry `r1` |
| `func_00133C10` | 80 | new literal ID 12, 4 normal, 4 translated; +0x50 | existing `ipc_handle_slot_alpha`; +0x54 | six direct words, then descriptor `entry stack word << 14 OR 2`, then entry `r3` |
| `func_00133CBC` | 84 | new literal ID 15, 4 normal, 0 translated; +0x54 | existing `ipc_handle_slot_alpha`; +0x58 | byte/word/byte/word request; response byte in word 2 to stack output pointer |
| `func_001342C8` | 68 | new inline ID 5, 0 normal, 0 translated | existing `ipc_handle_slot_lambda`; +0x44 | no request fields; response words 2-5 copied to entry `r0` |
| `func_0015F308` | 64 | new literal ID 8, 0 normal, 4 translated; +0x40 | existing `ipc_handle_slot_iota`; +0x44 | words 1-4 = 32, unspecified word 2, zero, entry `r0`; no copied output |
| `func_0016FF3C` | 68 | new literal ID 62, 1 normal, 2 translated; +0x44 | existing `ipc_handle_slot_iota`; +0x48 | words 1-2 = entry `r0`, 32; response byte in word 2 to entry `r1` |
| `func_00174400` | 80 | new inline ID 24, 0 normal, 0 translated | entry handle in `r0`; no pool | no request fields; response words 2-9 copied to entry `r1` |
| `func_00174450` | 76 | new literal ID 19, 1 normal, 2 translated; +0x4c | entry handle in `r0` | words 1-3 = entry `r2`, zero, entry `r1`; response words 2 and 4 to stack output and the entry-`r3` output pointer |
| `func_001F1474` | 76 | new literal ID 4, 0 normal, 6 translated; +0x4c | new `ipc_aux_func_001F1474_static_descriptor`; +0x50; existing `ipc_handle_slot_iota`; +0x54 | words 1-6 = 32, unspecified word 2, zero, entry `r1`, fixed auxiliary descriptor, entry `r0` |
| `func_001F14CC` | 84 | new literal ID 36, 1 normal, 2 translated; +0x54 | existing `ipc_aux_func_001F16F8_static_descriptor`; +0x58; existing `ipc_handle_slot_iota`; +0x5c | command words 1-3 plus temporary TLS scratch descriptor pair; scratch restored after request |
| `func_001F15DC` | 68 | new literal ID 39, 0 normal, 2 translated; +0x44 | existing-in-batch `ipc_aux_func_001F1474_static_descriptor`; +0x48; existing `ipc_handle_slot_iota`; +0x4c | words 1-2 = auxiliary descriptor, entry `r0`; response byte in word 2 to entry `r1` |
| `func_001F709C` | 84 | new literal ID 2124, 9 normal, 2 translated; +0x54 | entry handle in `r0` | eight direct request words, byte word 9, descriptor `stack word << 14 OR 2`, then entry `r3` |
| `func_001F7164` | 80 | new literal ID 2057, 6 normal, 2 translated; +0x50 | entry handle in `r0` | six direct words, descriptor `stack word << 14 OR 2`, then adjacent stack word |
| `func_001F7298` | 88 | new literal ID 2129, 9 normal, 2 translated; +0x58 | entry handle in `r0` | three-word struct, five direct words, static descriptor `10 OR (stack word LSL 4)`, then adjacent stack word |

All functions are ARM mode. The displayed offsets are relative to the function
body. There is exactly one direct call, to `func_00144D28`; there are no other
external branches or call relocations.

## Complete normative mnemonic sequences

The schedules below are complete and literal. `B` emits only the standard ARM
section/function header. `E`, `EP1`, `EP2`, and `EP3` close the executable body
before emitting zero, one, two, or three displayed symbolic pool entries.
Labels and directives occupy no executable bytes. Preserve every mnemonic,
operand, register, condition, branch shape, pool order, and historical
`mov r0,r0` spelling.

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

B func_00110264
push {r4,r5,r6,lr};mov r5,r2;mov r6,r3;mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_00110264;str r2,[r4,#128]!;strd r0,[r4,#4]
ldr r0,.Lpool_func_00110264+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_00110264
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#16];str r0,[r6]
ldr r0,[r4,#4]
.Lret_00110264:pop {r4,r5,r6,pc}
EP2 func_00110264,ipc_command_func_00110264,ipc_handle_slot_alpha

B func_001102B4
push {r4,r5,r6,r7,r8,lr};mov r5,r0;mov r6,r2;mov r7,r3
mrc p15,0,r4,c13,c0,3;ldr r0,.Lpool_func_001102B4;add r4,r4,#128
strd r0,[r4];ldr r0,.Lpool_func_001102B4+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_001102B4
ldr r0,[r4,#8];str r0,[r6];ldr r0,[r4,#12];str r0,[r7]
ldr r0,[r4,#20];str r0,[r5];ldr r0,[r4,#4]
.Lret_001102B4:pop {r4,r5,r6,r7,r8,pc}
EP2 func_001102B4,ipc_command_func_002C6378,ipc_handle_slot_alpha

B func_00110374
push {r0,r1,r2,r3,r4,lr};mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_00110374;str r0,[r4,#128]!
ldrb r0,[sp];strb r0,[r4,#4];strd r2,[r4,#8]
ldrb r0,[sp,#24];strb r0,[r4,#16]
ldr r0,.Lpool_func_00110374+4;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#16;pop {r4,pc}
EP2 func_00110374,ipc_command_func_00110374,ipc_handle_slot_alpha

B func_00118594
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr ip,.Lpool_func_00118594;mov r3,#0;str ip,[r4,#128]!
add lr,r4,#4;str r0,[r4,#16];ldr r0,.Lpool_func_00118594+4
stm lr,{r1,r2,r3};ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP2 func_00118594,ipc_command_func_00118594,ipc_handle_slot_kappa

B func_0011BA30
push {r4,r5,r6,r7,r8,lr};mrc p15,0,r5,c13,c0,3
mov r1,#(8 << 16);str r1,[r5,#128]!
mrc p15,0,r1,c13,c0,3;add r4,r1,#384
ldr r1,.Lpool_func_0011BA30;ldrd r6,[r4];str r0,[r4,#4]
ldr r0,.Lpool_func_0011BA30+4;str r1,[r4];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;strd r6,[r4]
ldrge r0,[r5,#4];pop {r4,r5,r6,r7,r8,pc}
EP2 func_0011BA30,ipc_aux_func_0011BA30_tls_descriptor,ipc_handle_slot_lambda

B func_00124838
mov r0,r0;push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_00124838;str r1,[r4,#128]!;str r0,[r4,#4]
ldr r0,.Lpool_func_00124838+4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_00124838
ldrd r0,[r4,#8];strd r0,[r5];ldr r0,[r4,#4]
.Lret_00124838:pop {r4,r5,r6,pc}
EP2 func_00124838,ipc_command_func_002C63E4,ipc_handle_slot_nu

B func_00124880
mov r0,r0;push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_00124880;str r3,[r4,#128]!;add ip,r4,#4
stm ip,{r1,r2};mov r2,#12;str r0,[r4,#16]
ldr r0,.Lpool_func_00124880+4;orr r1,r2,r1,lsl #4;str r1,[r4,#12]
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EP2 func_00124880,ipc_command_func_001338B8,ipc_handle_slot_nu

B func_00124FE0
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(1 << 16 | 32 << 6);str r0,[r4,#128]!
add r0,r4,#4;mov r2,#128;bl func_00144D28
ldr r0,[r5];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,r5,r6,pc}
E func_00124FE0

B func_00125584
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr ip,.Lpool_func_00125584;str ip,[r4,#128]!;add lr,r4,#4
stm lr,{r1,r2,r3};mov r2,#12;str r0,[r4,#20]
ldr r0,.Lpool_func_00125584+4;orr r1,r2,r1,lsl #5;str r1,[r4,#16]
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EP2 func_00125584,ipc_command_func_002C8F10,ipc_handle_slot_omicron

B func_001266B4
push {r4,r5,r6,lr};mov r5,r0;mov r6,r1;mrc p15,0,r4,c13,c0,3
mov r0,#(68 << 16);str r0,[r4,#128]!
ldr r0,.Lpool_func_001266B4;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_001266B4
ldr r0,[r4,#8];str r0,[r6];ldr r0,[r4,#16];str r0,[r5]
ldr r0,[r4,#4]
.Lret_001266B4:pop {r4,r5,r6,pc}
EP1 func_001266B4,ipc_handle_slot_alpha

B func_00133918
push {r0,r1,r2,r4,r5,lr};mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_00133918;mov r2,#0;str r3,[r4,#128]!
ldrb r3,[sp,#8];strb r3,[r4,#4];str r1,[r4,#12];str r2,[r4,#8]
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];add sp,sp,#12;pop {r4,r5,pc}
EP1 func_00133918,ipc_command_func_00133918

B func_00133C10
push {r4,r5,r6,r7,r8,lr};add r4,sp,#24;ldm r4,{r5,ip}
mrc p15,0,r4,c13,c0,3;ldr r7,.Lpool_func_00133C10;mov r6,#0
str r7,[r4,#128]!;add r8,r4,#4;stm r8,{r0,r1,r2,r5,r6,ip}
orr r0,r6,r5,lsl #14;add r6,r4,#28;orr r0,r0,#2
stm r6,{r0,r3};ldr r0,.Lpool_func_00133C10+4;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,pc}
EP2 func_00133C10,ipc_command_func_00133C10,ipc_handle_slot_alpha

B func_00133CBC
push {r0,r1,r2,r3,r4,r5,r6,lr};ldr r5,[sp,#32]
mrc p15,0,r4,c13,c0,3;ldr r0,.Lpool_func_00133CBC
str r0,[r4,#128]!;ldrb r0,[sp];strb r0,[r4,#4]
str r1,[r4,#8];ldrb r0,[sp,#8];strb r0,[r4,#12]
ldr r0,.Lpool_func_00133CBC+4;str r3,[r4,#16];ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_00133CBC
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_00133CBC:add sp,sp,#16;pop {r4,r5,r6,pc}
EP2 func_00133CBC,ipc_command_func_00133CBC,ipc_handle_slot_alpha

B func_001342C8
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(5 << 16);str r0,[r4,#128]!
ldr r0,.Lpool_func_001342C8;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_001342C8
add r0,r4,#8;ldm r0,{r1,r2,r3};ldr r0,[r4,#20]
str r0,[r5,#12];stm r5,{r1,r2,r3};ldr r0,[r4,#4]
.Lret_001342C8:pop {r4,r5,r6,pc}
EP1 func_001342C8,ipc_handle_slot_lambda

B func_0015F308
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_0015F308;mov r1,#0;str r2,[r4,#128]!
mov r2,#32;str r0,[r4,#16];ldr r0,.Lpool_func_0015F308+4
str r1,[r4,#12];str r2,[r4,#4];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP2 func_0015F308,ipc_command_func_0015F308,ipc_handle_slot_iota

B func_0016FF3C
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_0016FF3C;str r1,[r4,#128]!;str r0,[r4,#4]
mov r0,#32;str r0,[r4,#8];ldr r0,.Lpool_func_0016FF3C+4
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_0016FF3C
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_0016FF3C:pop {r4,r5,r6,pc}
EP2 func_0016FF3C,ipc_command_func_0016FF3C,ipc_handle_slot_iota

B func_00174400
push {r4,r5,r6,r7,r8,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
mov r1,#(24 << 16);str r1,[r4,#128]!;ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_00174400
add r0,r4,#8;add r6,r4,#24;ldm r0,{r1,r2,r3,ip}
ldr r0,[r4,#36];ldm r6,{r6,r7,r8};str r0,[r5,#28]
stm r5,{r1,r2,r3,ip};add r5,r5,#16;stm r5,{r6,r7,r8}
ldr r0,[r4,#4]
.Lret_00174400:pop {r4,r5,r6,r7,r8,pc}
E func_00174400

B func_00174450
push {r4,r5,r6,lr};mov r5,r3;ldr r6,[sp,#16]
mrc p15,0,r4,c13,c0,3;ldr ip,.Lpool_func_00174450;mov r3,#0
str ip,[r4,#128]!;str r1,[r4,#12];strd r2,[r4,#4]
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_00174450
ldr r0,[r4,#8];str r0,[r6];ldr r0,[r4,#16];str r0,[r5]
ldr r0,[r4,#4]
.Lret_00174450:pop {r4,r5,r6,pc}
EP1 func_00174450,ipc_command_func_00174450

B func_001F1474
push {r4,lr};mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_001F1474;mov r2,#0;str r3,[r4,#128]!
mov r3,#32;str r1,[r4,#16];str r2,[r4,#12]
str r3,[r4,#4];str r0,[r4,#24]
ldr r1,.Lpool_func_001F1474+4;ldr r0,.Lpool_func_001F1474+8
str r1,[r4,#20];ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
EP3 func_001F1474,ipc_command_func_001F1474,ipc_aux_func_001F1474_static_descriptor,ipc_handle_slot_iota

B func_001F14CC
push {r4,r5,r6,r7,r8,lr};mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_001F14CC;str r3,[r4,#128]!;str r2,[r4,#4]
ldr r2,.Lpool_func_001F14CC+4;str r0,[r4,#12];str r2,[r4,#8]
mrc p15,0,r0,c13,c0,3;add r5,r0,#384;ldrd r6,[r5]
str r2,[r0,#384]!;str r1,[r0,#4]
ldr r0,.Lpool_func_001F14CC+8;ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;strd r6,[r5]
ldrge r0,[r4,#4];pop {r4,r5,r6,r7,r8,pc}
EP3 func_001F14CC,ipc_command_func_001F14CC,ipc_aux_func_001F16F8_static_descriptor,ipc_handle_slot_iota

B func_001F15DC
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F15DC;str r1,[r4,#128]!
ldr r1,.Lpool_func_001F15DC+4;str r0,[r4,#8]
ldr r0,.Lpool_func_001F15DC+8;str r1,[r4,#4];ldr r0,[r0];svc #50
ands r1,r0,#0x80000000;bmi .Lret_001F15DC
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_001F15DC:pop {r4,r5,r6,pc}
EP3 func_001F15DC,ipc_command_func_001F15DC,ipc_aux_func_001F1474_static_descriptor,ipc_handle_slot_iota

B func_001F709C
push {r4,r5,r6,r7,r8,r9,sl,fp,ip,lr};add r4,sp,#40
ldm r4,{r5,r6,r7,r8,r9,ip};mrc p15,0,r4,c13,c0,3
ldr sl,.Lpool_func_001F709C;mov fp,#0;str sl,[r4,#128]!
add lr,r4,#4;add sl,r4,#40;stm lr,{r1,r2,r5,r6,r7,r8,r9,ip}
ldrb r1,[sp,#64];strb r1,[r4,#36]
orr r1,fp,r5,lsl #14;orr r1,r1,#2;stm sl,{r1,r3}
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,r5,r6,r7,r8,r9,sl,fp,ip,pc}
EP1 func_001F709C,ipc_command_func_001F709C

B func_001F7164
push {r4,r5,r6,r7,r8,r9,sl,lr};add r4,sp,#32
ldm r4,{r5,r6,r7,ip};mrc p15,0,r4,c13,c0,3
ldr r9,.Lpool_func_001F7164;mov r8,#0;str r9,[r4,#128]!
add sl,r4,#4;stm sl,{r1,r2,r3,r5,r7}
orr r1,r8,r7,lsl #14;add r8,r4,#28;orr r1,r1,#2
str ip,[r4,#24];stm r8,{r1,r6};ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,r9,sl,pc}
EP1 func_001F7164,ipc_command_func_001F7164

B func_001F7298
push {r4,r5,r6,r7,r8,r9,sl,lr};add r4,sp,#32
ldm r4,{r5,r6,r7,ip};mrc p15,0,r4,c13,c0,3
ldr r8,.Lpool_func_001F7298;str r8,[r4,#128]!
ldrd r8,[r1];ldr r1,[r1,#8];add sl,r4,#20;str r1,[r4,#12]
stm sl,{r2,r3,r5,r6,ip};mov r1,#10;add sl,r4,#40
orr r1,r1,ip,lsl #4;stm sl,{r1,r7};strd r8,[r4,#4]
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,r5,r6,r7,r8,r9,sl,pc}
EP1 func_001F7298,ipc_command_func_001F7298
```

## Semantic identity ledger

The nineteen command-header pool occurrences form nineteen classes. Four reuse
established classes (`ipc_command_func_002C6378`,
`ipc_command_func_002C63E4`, `ipc_command_func_001338B8`, and
`ipc_command_func_002C8F10`); the remaining fifteen classes are new and use the
function-derived symbols shown above.

The four auxiliary pool occurrences form three classes: the new TLS descriptor
for `func_0011BA30`, the new static descriptor shared by `func_001F1474` and
`func_001F15DC`, and established
`ipc_aux_func_001F16F8_static_descriptor`. The seventeen handle slots comprise
six `alpha`, one `kappa`, two `lambda`, two `nu`, one new `omicron`, and five
`iota` occurrences. Physical private-target comparison confirms the stated
bijection. This batch therefore contributes exactly 40 post-body literal slots
and 18 new identity/value classes. Across IPC batches 12, 13, and 15 through
29, exactly 431 post-body slots form 216 identity/value classes.

There are five inline-header occurrences. Existing no-parameter inline IDs 8
and 5 are reused. New identities are ID 1 with 32 normal words, no-parameter
ID 68, and no-parameter ID 24. Inline identities have no pool slot or
relocation.

## Probe evidence, overlap audit, and validator requirements

The ignored probe `build/AS_EUR_REV2/probes/ipc_templates29_probe.S` has
SHA-256 `2452eeb6eb644ba8a6b35fdd675c7f6bd5f0c3017b73731f2aa27924839ecb70`;
its assembled object has SHA-256
`a613e1d997bbe1e6ab7562ea92b8ee884769be455b7db173571a7ec9df719bd2`.
Size-bounded independent extraction proves all twenty-four complete executable
schedules exact, with the named call relocation normalized symbolically:
24/24 functions and 1,748/1,748 code bytes.

The selection was intersected with the current objdiff unmatched inventory,
every IPC manifest/specification through batch 28, duplicate batches through
30, and concurrent runtime batch 30 (`func_002E6E14`, `func_002E6E40`,
`func_002E6E8C`, `func_002E9A1C`, and `func_002EDAEC`). Every selected function
was unmatched and absent from those sets. The 24 body ranges and 40 post-body
slots are mutually disjoint and do not overlap an inventoried function or a
concurrent selection.

A deterministic validator must pin source and manifest hashes; enforce all 24
names, ARM mode, declared sizes, complete literal mnemonic sequences,
body/pool boundaries, the named call relocation, all 40 pool relocations and
their identity assignments, all five inline command identities, the new
`omicron` handle identity, and the 431-slot/216-class cumulative bijection; and
reject raw instruction directives, numeric pool words, register substitution,
rescheduling, unnamed calls, and missing or extra instructions. It must
independently compare every complete body against the verified target.
