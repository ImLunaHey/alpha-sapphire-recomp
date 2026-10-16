# Probe-verified ARM IPC templates 25

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: evidence-gated symbols, the current objdiff report, bounded
  private-target control/data-flow inspection, physical literal-pool identity
  comparison, and independent GNU Arm probes.
- Probe toolchain: GNU Arm assembler and objcopy 2.44.
- Clean-room role: analysis/specification only. No target bytes, encoded
  instruction words, private addresses, private pool values, implementation,
  assets, or proprietary source are present.

This batch covers eight previously unspecified and unmatched ARM-state IPC
wrappers in eight schedules totaling exactly 728 code bytes. Public CTR
conventions identify TPIDRURO plus 128 as the command buffer, TPIDRURO plus
384 as the thread-static-buffer area, and SVC 50 as SendSyncRequest.

## Function and relocation inventory

| Function | Mode | Size | Command form and ordered post-body pool |
| --- | --- | ---: | --- |
| `func_00164EE4` | ARM | 92 | new command `ipc_command_func_00164EE4` at +0x5c |
| `func_001F6E74` | ARM | 92 | new command `ipc_command_func_001F6E74` at +0x5c |
| `func_001F76EC` | ARM | 92 | new command `ipc_command_func_001F76EC` at +0x5c |
| `func_001FB610` | ARM | 92 | inline `ipc_inline_command_id_22_no_params`; existing handle `ipc_handle_slot_epsilon` at +0x5c |
| `func_002C5668` | ARM | 92 | existing command `ipc_command_func_0016511C` at +0x5c, then existing auxiliary identity `ipc_aux_func_002C59AC_word1` at +0x60 |
| `func_002C576C` | ARM | 92 | new command `ipc_command_func_002C576C` at +0x5c |
| `func_001747EC` | ARM | 88 | new command `ipc_command_func_001747EC` at +0x58 |
| `func_001F6D38` | ARM | 88 | new command `ipc_command_func_001F6D38` at +0x58 |

There are no direct calls or call relocations. Pool entries occur in the exact
physical order shown. The inline command is the public IPC header for command
ID 22 with zero normal and zero translated words.

## Complete normative mnemonic sequences

The following sequence is complete and literal. `B` emits only the standard
ARM section/function header. `E1` and `EH` close the executable body at the
declared size before emitting the displayed neutral symbolic pool entries.
Labels occupy no bytes. Every other line is an instruction in exact physical
order. An implementation must preserve every mnemonic, operand, register,
width, condition, frame offset, multiregister grouping, label, and branch
destination.

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
.macro EH f,h
 .size \f,.-\f
.Lh_\f:.word \h
.endm

B func_00164EE4
push {r4,r5,r6,lr};ldr r12,[sp,#16];mrc p15,0,r4,c13,c0,3
ldr r6,.Lc_func_00164EE4;mov r5,#0;str r6,[r4,#128]!
add lr,r4,#4;stm lr,{r1,r12};orr r1,r5,r12,lsl #14
add r5,r4,#12;orr r1,r1,#2;stm r5,{r1,r2};mov r1,#1024
orr r1,r1,r12,lsl #14;add r5,r4,#20;orr r1,r1,#2
stm r5,{r1,r3};ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];pop {r4,r5,r6,pc}
E1 func_00164EE4,ipc_command_func_00164EE4

B func_001F6E74
push {r4,r5,r6,r7,r8,lr};mov r5,r1;ldr r1,[sp,#28]
ldr r12,[sp,#24];mrc p15,0,r4,c13,c0,3
ldr r7,.Lc_func_001F6E74;mov r6,#0;str r7,[r4,#128]!
str r1,[r4,#12];orr r1,r6,r1,lsl #14;add r6,r4,#16
orr r1,r1,#2;stm r6,{r1,r12};strd r2,[r4,#4];ldr r0,[r0]
svc #50;ands r1,r0,#0x80000000;bmi 1f;add r1,r4,#8
ldrd r0,[r1];strd r0,[r5];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_001F6E74,ipc_command_func_001F6E74

B func_001F76EC
push {r4,r5,r6,r7,r8,lr};add r4,sp,#28;mov r5,r1
ldm r4,{r1,r6};ldr r12,[sp,#24];mrc p15,0,r4,c13,c0,3
ldr r7,.Lc_func_001F76EC;str r7,[r4,#128]!;add r7,r4,#20
str r1,[r4,#12];strd r2,[r4,#4];mov r2,#10
orr r1,r2,r1,lsl #4;str r6,[r4,#16];stm r7,{r1,r12}
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_001F76EC,ipc_command_func_001F76EC

B func_001FB610
push {r4,r5,r6,r7,r8,lr};mov r5,r0;mov r6,r1;mov r7,r2
mov r8,r3;mrc p15,0,r4,c13,c0,3;mov r0,#(22 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_001FB610;ldr r0,[r0]
svc #50;ands r1,r0,#0x80000000;bmi 1f;ldr r0,[r4,#8]
str r0,[r5];ldr r0,[r4,#12];str r0,[r6];ldr r0,[r4,#16]
str r0,[r7];ldr r0,[r4,#20];str r0,[r8];ldr r0,[r4,#4]
1:pop {r4,r5,r6,r7,r8,pc}
EH func_001FB610,ipc_handle_slot_epsilon

B func_002C5668
push {r0,r1,r2,r3,r4,r5,r6,lr};ldr r2,[sp,#32]
mrc p15,0,r4,c13,c0,3;ldr r5,.Lc_func_002C5668;mov r12,#0
str r5,[r4,#128]!;ldrb r5,[sp,#8];add r6,r4,#8
strb r5,[r4,#4];ldr r5,.La_func_002C5668;str r1,[r4,#16]
orr r1,r12,r2,lsl #14;stm r6,{r2,r5};add r5,r4,#20
orr r1,r1,#2;stm r5,{r1,r3};ldr r0,[r0];svc #50
and r1,r0,#0x80000000;cmp r1,#0;ldrge r0,[r4,#4]
add sp,sp,#16;pop {r4,r5,r6,pc}
.size func_002C5668,.-func_002C5668
.Lc_func_002C5668:.word ipc_command_func_0016511C
.La_func_002C5668:.word ipc_aux_func_002C59AC_word1

B func_002C576C
push {r4,r5,r6,r7,r8,lr};mov r6,r2;mrc p15,0,r5,c13,c0,3
ldr r12,.Lc_func_002C576C;mov r2,#0;str r12,[r5,#128]!
str r3,[r5,#4];mrc p15,0,r12,c13,c0,3;add r4,r12,#384
orr r2,r2,r3,lsl #14;ldm r4,{r7,r8};orr r2,r2,#2
str r2,[r12,#384]!;str r1,[r12,#4];ldr r0,[r0];svc #50
stm r4,{r7,r8};ands r1,r0,#0x80000000;bmi 1f
ldr r0,[r5,#8];str r0,[r6];ldr r0,[r5,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_002C576C,ipc_command_func_002C576C

B func_001747EC
push {r4,r5,r6,r7,r8,lr};mov r6,r1;mrc p15,0,r5,c13,c0,3
ldr r12,.Lc_func_001747EC;mov r1,#0;str r12,[r5,#128]!
str r3,[r5,#4];mrc p15,0,r12,c13,c0,3;add r4,r12,#384
orr r1,r1,r3,lsl #14;ldm r4,{r7,r8};orr r1,r1,#2
stm r4,{r1,r2};ldr r0,[r0];svc #50;stm r4,{r7,r8}
ands r1,r0,#0x80000000;bmi 1f;ldr r0,[r5,#8]
str r0,[r6];ldr r0,[r5,#4]
1:pop {r4,r5,r6,r7,r8,pc}
E1 func_001747EC,ipc_command_func_001747EC

B func_001F6D38
push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr};add r4,sp,#40
ldm r4,{r5,r6,r7,r8,r9,r12};mrc p15,0,r4,c13,c0,3
ldr r10,.Lc_func_001F6D38;mov r11,#0;str r10,[r4,#128]!
add lr,r4,#4;add r10,r4,#36;stm lr,{r1,r2,r3,r5,r7}
orr r1,r11,r7,lsl #14;orr r1,r1,#2;str r8,[r4,#24]
stm r10,{r1,r6};add r10,r4,#28;stm r10,{r9,r12}
ldr r0,[r0];svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
E1 func_001F6D38,ipc_command_func_001F6D38
```

## Semantic behavior summary

- `func_00164EE4` sends one ordinary word and two descriptor/pointer pairs
  through the entry handle, returning response word 1 on success.
- `func_001F6E74` sends two entry words and two stack words, including one
  descriptor/pointer pair. On success it copies response words 2 and 3 through
  entry `r1` and returns response word 1.
- `func_001F76EC` sends two entry words, three stack words, and one counted
  pointer pair. On success it stores response word 2 through entry `r1` and
  returns response word 1.
- `func_001FB610` sends the inline no-parameter command through a global
  handle. On success it writes response words 2 through 5 through entry
  `r0`..`r3` and returns response word 1.
- `func_002C5668` sends an entry byte, two words, a shared auxiliary word, and
  one descriptor/pointer pair through the entry handle; it returns response
  word 1 on success.
- `func_002C576C` temporarily installs a thread-static descriptor/pointer pair,
  restores the saved pair after the request, stores response word 2 through
  entry `r2` on success, and returns response word 1.
- `func_001747EC` is the same static-buffer protocol with a different command
  and register schedule; it stores response word 2 through entry `r1`.
- `func_001F6D38` sends nine ordinary words plus one descriptor/pointer pair
  through the entry handle and returns response word 1 on success.

## Literal identity and relocation ledger

The eight functions contribute exactly nine post-body literal slots. Six
classes are new: the six function-specific command identities named in the
inventory. Three slots reuse established classes:
`ipc_handle_slot_epsilon`, `ipc_command_func_0016511C`, and
`ipc_aux_func_002C59AC_word1`. The six new identities are mutually distinct
and distinct from every earlier identity; no established identity is split.

Across IPC batches 12, 13, and 15 through 25, exactly 327 post-body slots form
177 identity/value classes. Inline command identities remain separately
tracked; this batch adds `ipc_inline_command_id_22_no_params`. There are no
direct-call relocations.

## Probe evidence, overlap audit, and validator requirements

The ignored probe `build/AS_EUR_REV2/probes/ipc_templates25_probe.S` has
SHA-256 `59a90c3e9da5ad07d952d9de5ab814c4e61ee5d3267ecf069cfa1a09b3f52c6b`;
its assembled object has SHA-256
`99db53394383af75fb4ee9cf6fc6de85fed2e4cbe1cd3a1596607c65718b65c7`.
Size-bounded independent extraction proved all eight
complete executable bodies byte-exact at their declared sizes: 8/8 functions
and 728/728 code bytes.

The selection was intersected with the current objdiff unmatched inventory,
all manifests and specifications through batch 24, and the concurrently staged
batch 25 duplicate specification. Every selected function was unmatched and
absent from those sets. The eight body ranges and all nine post-body slots are
mutually disjoint and do not overlap any inventoried function.

A deterministic validator must pin source and manifest hashes; enforce all
eight names, ARM mode, declared sizes, complete literal mnemonic sequences,
branch targets, body/pool boundaries and pool ordering, all nine absolute pool
relocations and identity assignments, and the inline command identity; verify
the 327-slot/177-class cumulative bijection; and reject raw instruction
directives, numeric pool words, register substitution, rescheduling, direct
calls, and missing or extra instructions. It must independently compare every
complete body against the verified target.
