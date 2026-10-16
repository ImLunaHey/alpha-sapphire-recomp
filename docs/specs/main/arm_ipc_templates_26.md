# Probe-verified ARM IPC templates 26

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: evidence-gated symbols, the current objdiff report, bounded
  private-target control/data-flow inspection, physical literal-pool identity
  comparison, and independent GNU Arm probes.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, encoded
  instruction words, private addresses, private pool values, implementation,
  assets, or proprietary source are present.

This batch covers seventeen previously unspecified and unmatched ARM-state
no-parameter IPC wrappers totaling exactly 720 code bytes. Public CTR
conventions identify TPIDRURO plus 128 as the command buffer and SVC 50 as
SendSyncRequest. Every command header is formed inline from its public command
ID with zero normal words and zero translated words.

## Function and relocation inventory

| Function | Mode | Size | Inline command identity | Handle source / post-body pool |
| --- | --- | ---: | --- | --- |
| `func_00125E28` | ARM | 40 | new `ipc_inline_command_id_23_no_params` | entry `r0`, none |
| `func_001644DC` | ARM | 40 | new `ipc_inline_command_id_57_no_params` | entry `r0`, none |
| `func_00174748` | ARM | 40 | new `ipc_inline_command_id_25_no_params` | entry `r0`, none |
| `func_0017A618` | ARM | 40 | new `ipc_inline_command_id_12_no_params` | entry `r0`, none |
| `func_0017A640` | ARM | 40 | new `ipc_inline_command_id_20_no_params` | entry `r0`, none |
| `func_002C5640` | ARM | 40 | new `ipc_inline_command_id_8_no_params` | entry `r0`, none |
| `func_002C5744` | ARM | 40 | existing `ipc_inline_command_id_10_no_params` | entry `r0`, none |
| `func_001FB3DC` | ARM | 44 | new `ipc_inline_command_id_9_no_params` | existing `ipc_handle_slot_epsilon` at +0x2c |
| `func_001FB550` | ARM | 44 | existing `ipc_inline_command_id_3_no_params` | existing `ipc_handle_slot_epsilon` at +0x2c |
| `func_00202894` | ARM | 44 | new `ipc_inline_command_id_17_no_params` | existing `ipc_handle_slot_mu` at +0x2c |
| `func_002028C4` | ARM | 44 | new `ipc_inline_command_id_18_no_params` | existing `ipc_handle_slot_mu` at +0x2c |
| `func_00202D78` | ARM | 44 | new `ipc_inline_command_id_5_no_params` | existing `ipc_handle_slot_zeta` at +0x2c |
| `func_002C6348` | ARM | 44 | new `ipc_inline_command_id_44_no_params` | existing `ipc_handle_slot_gamma` at +0x2c |
| `func_002C63B4` | ARM | 44 | new `ipc_inline_command_id_39_no_params` | existing `ipc_handle_slot_gamma` at +0x2c |
| `func_002C6420` | ARM | 44 | new `ipc_inline_command_id_38_no_params` | existing `ipc_handle_slot_gamma` at +0x2c |
| `func_002DE8C0` | ARM | 44 | new `ipc_inline_command_id_58_no_params` | existing `ipc_handle_slot_beta` at +0x2c |
| `func_002DE9C8` | ARM | 44 | existing-in-batch `ipc_inline_command_id_57_no_params` | existing `ipc_handle_slot_beta` at +0x2c |

There are no direct calls or call relocations. Each displayed global-handle
slot is the only literal after that function and occurs in the exact physical
position shown.

## Complete normative mnemonic sequences

The following sequence is complete and literal. `B` emits only the standard
ARM section/function header. `E` closes an entry-handle function at its
declared size. `EH` closes a global-handle executable body before emitting the
one displayed neutral symbolic pool entry. Labels and macro directives occupy
no bytes. Every other line is an instruction in exact physical order. An
implementation must preserve every mnemonic, operand, register, condition,
and pool identity.

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
.macro EH f,h
 .size \f,.-\f
.Lh_\f:.word \h
.endm

B func_00125E28
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r1,#(23 << 16)
str r1,[r4,#128]!;ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
E func_00125E28

B func_001644DC
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r1,#(57 << 16)
str r1,[r4,#128]!;ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
E func_001644DC

B func_00174748
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r1,#(25 << 16)
str r1,[r4,#128]!;ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
E func_00174748

B func_0017A618
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r1,#(12 << 16)
str r1,[r4,#128]!;ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
E func_0017A618

B func_0017A640
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r1,#(20 << 16)
str r1,[r4,#128]!;ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
E func_0017A640

B func_002C5640
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r1,#(8 << 16)
str r1,[r4,#128]!;ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
E func_002C5640

B func_002C5744
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r1,#(10 << 16)
str r1,[r4,#128]!;ldr r0,[r0];svc #50;and r1,r0,#0x80000000
cmp r1,#0;ldrge r0,[r4,#4];pop {r4,pc}
E func_002C5744

B func_001FB3DC
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(9 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_001FB3DC;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_001FB3DC,ipc_handle_slot_epsilon

B func_001FB550
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(3 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_001FB550;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_001FB550,ipc_handle_slot_epsilon

B func_00202894
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(17 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_00202894;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_00202894,ipc_handle_slot_mu

B func_002028C4
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(18 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_002028C4;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_002028C4,ipc_handle_slot_mu

B func_00202D78
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(5 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_00202D78;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_00202D78,ipc_handle_slot_zeta

B func_002C6348
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(44 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_002C6348;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_002C6348,ipc_handle_slot_gamma

B func_002C63B4
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(39 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_002C63B4;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_002C63B4,ipc_handle_slot_gamma

B func_002C6420
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(38 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_002C6420;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_002C6420,ipc_handle_slot_gamma

B func_002DE8C0
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(58 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_002DE8C0;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_002DE8C0,ipc_handle_slot_beta

B func_002DE9C8
push {r4,lr};mrc p15,0,r4,c13,c0,3;mov r0,#(57 << 16)
str r0,[r4,#128]!;ldr r0,.Lh_func_002DE9C8;ldr r0,[r0]
svc #50;and r1,r0,#0x80000000;cmp r1,#0
ldrge r0,[r4,#4];pop {r4,pc}
EH func_002DE9C8,ipc_handle_slot_beta
```

## Semantic behavior summary

All seventeen functions write a no-parameter IPC header to command-buffer
word 0, issue SendSyncRequest, preserve an error result, and return response
word 1 when the result's sign bit is clear. The seven 40-byte functions load
the service handle through entry `r0`; the ten 44-byte functions load it
through the named global handle slot. The schedules intentionally use `r1`
for the inline header in entry-handle wrappers and `r0` in global-handle
wrappers.

## Literal identity and relocation ledger

The ten global-handle functions contribute exactly ten post-body literal
slots and no new literal class:

- `ipc_handle_slot_epsilon`: two slots;
- `ipc_handle_slot_mu`: two slots;
- `ipc_handle_slot_zeta`: one slot;
- `ipc_handle_slot_gamma`: three slots; and
- `ipc_handle_slot_beta`: two slots.

Physical private-target comparison confirms the five classes are mutually
distinct, each occurrence agrees with its established class, and no class is
split or accidentally merged. Across IPC batches 12, 13, and 15 through 26,
exactly 337 post-body slots form 177 identity/value classes.

This batch has seventeen inline-header occurrences forming sixteen semantic
inline-command identities. IDs 3 and 10 reuse established identities; ID 57
is new and occurs twice in this batch; IDs 5, 8, 9, 12, 17, 18, 20, 23, 25,
38, 39, 44, and 58 are also new. Inline command identities have no pool slot
or relocation. There are no direct-code relocations.

## Probe evidence, overlap audit, and validator requirements

The ignored probe `build/AS_EUR_REV2/probes/ipc_templates26_probe.S` has
SHA-256 `671edc6b94828a7cb9c3df82ade580d5fcc5167ed6e1b775fd636db79a040be1`;
its assembled object has SHA-256
`d0863b9457018d9361d3b52b0a3aa52f113bc4fa57a01490333fe339e0d8760e`.
Size-bounded independent extraction proved all seventeen complete executable
bodies byte-exact at their declared sizes: 17/17 functions and 720/720 code
bytes.

The selection was intersected with the current objdiff unmatched inventory,
all manifests and specifications through batch 25, the concurrently staged
batch-26 duplicate specification, and the completed batch-25 runtime set.
Every selected function was unmatched and absent from those sets. The
seventeen body ranges and ten post-body slots are mutually disjoint, do not
overlap an inventoried function, and do not overlap the concurrent selection.

A deterministic validator must pin source and manifest hashes; enforce all
seventeen names, ARM mode, declared sizes, complete literal mnemonic
sequences, body/pool boundaries, all ten pool relocations and their five
identity assignments, all sixteen inline command identities, and the
337-slot/177-class cumulative bijection; and reject raw instruction
directives, numeric pool words, register substitution, rescheduling, direct
calls, and missing or extra instructions. It must independently compare every
complete body against the verified target.
