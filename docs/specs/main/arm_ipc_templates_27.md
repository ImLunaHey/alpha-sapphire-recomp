# Probe-verified ARM IPC templates 27

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

This batch covers twenty-two previously unspecified and unmatched ARM-state
IPC response wrappers totaling exactly 1,208 code bytes. Public CTR
conventions identify TPIDRURO plus 128 as the command buffer and SVC 50 as
SendSyncRequest. The twenty inline headers all have zero normal words and zero
translated words. The two literal headers also have zero normal words and zero
translated words.

## Function and relocation inventory

| Function | Mode | Size | Request-header identity | Handle source | Successful output |
| --- | --- | ---: | --- | --- | --- |
| `func_0010F828` | ARM | 56 | existing inline ID 2 | existing `ipc_handle_slot_delta`, pool at +0x38 | word 3 to entry `r0` |
| `func_00118C94` | ARM | 56 | existing inline ID 2 | new `ipc_handle_slot_nu`, pool at +0x38 | byte in word 2 to entry `r0` |
| `func_00119F20` | ARM | 56 | new inline ID 11 | existing `ipc_handle_slot_delta`, pool at +0x38 | word 2 to entry `r0` |
| `func_0012696C` | ARM | 56 | new inline ID 60 | existing `ipc_handle_slot_beta`, pool at +0x38 | byte in word 2 to entry `r0` |
| `func_001269E4` | ARM | 56 | new inline ID 59 | existing `ipc_handle_slot_beta`, pool at +0x38 | byte in word 2 to entry `r0` |
| `func_00174848` | ARM | 56 | new inline ID 1 | existing `ipc_handle_slot_lambda`, pool at +0x38 | byte in word 2 to entry `r0` |
| `func_001F7630` | ARM | 52 | new literal `ipc_command_func_001F7630`, ID 2060, pool at +0x34 | pointer in entry `r0` | word 3 to entry `r1` |
| `func_001F7798` | ARM | 52 | existing literal `ipc_command_func_001F7800`, ID 2052, pool at +0x34 | pointer in entry `r0` | words 2-3 to entry `r1` |
| `func_001FB40C` | ARM | 56 | new inline ID 11 | existing `ipc_handle_slot_epsilon`, pool at +0x38 | word 3 to entry `r0` |
| `func_001FB514` | ARM | 56 | existing inline ID 10 | existing `ipc_handle_slot_epsilon`, pool at +0x38 | word 3 to entry `r0` |
| `func_001FB670` | ARM | 56 | existing inline ID 12 | existing `ipc_handle_slot_epsilon`, pool at +0x38 | word 3 to entry `r0` |
| `func_00202CF8` | ARM | 56 | new inline ID 6 | existing `ipc_handle_slot_zeta`, pool at +0x38 | byte in word 2 to entry `r0` |
| `func_002030EC` | ARM | 56 | existing inline ID 3 | new `ipc_handle_slot_xi`, pool at +0x38 | word 2 to entry `r0` |
| `func_002C5514` | ARM | 52 | new inline ID 26 | pointer in entry `r0`; no pool | byte in word 2 to entry `r1` |
| `func_002C5A20` | ARM | 52 | new inline ID 35 | pointer in entry `r0`; no pool | halfword in word 2 to entry `r1` |
| `func_002C6480` | ARM | 56 | new inline ID 40 | existing `ipc_handle_slot_gamma`, pool at +0x38 | byte in word 2 to entry `r0` |
| `func_002C6534` | ARM | 56 | new inline ID 15 | existing `ipc_handle_slot_gamma`, pool at +0x38 | word 3 to entry `r0` |
| `func_002C6570` | ARM | 56 | existing inline ID 25 | existing `ipc_handle_slot_gamma`, pool at +0x38 | byte in word 2 to entry `r0` |
| `func_002C65AC` | ARM | 56 | existing inline ID 20 | existing `ipc_handle_slot_gamma`, pool at +0x38 | byte in word 2 to entry `r0` |
| `func_002DED74` | ARM | 56 | new inline ID 54 | existing `ipc_handle_slot_beta`, pool at +0x38 | byte in word 2 to entry `r0` |
| `func_002E24B4` | ARM | 52 | new inline ID 6 | pointer in entry `r0`; no pool | word 2 to entry `r1` |
| `func_002E4424` | ARM | 52 | existing inline ID 22 | pointer in entry `r0`; no pool | word 2 to entry `r1` |

There are no direct calls, external branches, or call relocations. Each
displayed pool entry is the only post-body word belonging to that function.
The two new handle slots are distinct, four-byte-aligned identities in the
writable initialized-data segment; neither aliases any established handle
slot.

## Complete normative mnemonic sequences

The following sequences are complete and literal. `B` emits only the standard
ARM section/function header. `E` closes a function at its declared executable
size. `EP` closes the executable body before emitting the one displayed
neutral symbolic pool entry. Labels and directives occupy no executable bytes.
Every other line is an instruction in exact physical order. An implementation
must preserve every mnemonic, operand, register, condition, branch shape, and
pool identity.

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
.macro EP f,p
 .size \f,.-\f
.Lpool_\f:.word \p
.endm

B func_0010F828
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(2 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_0010F828
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_0010F828
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
.Lret_0010F828:pop {r4,r5,r6,pc}
EP func_0010F828,ipc_handle_slot_delta

B func_00118C94
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(2 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_00118C94
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_00118C94
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_00118C94:pop {r4,r5,r6,pc}
EP func_00118C94,ipc_handle_slot_nu

B func_00119F20
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(11 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_00119F20
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_00119F20
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_00119F20:pop {r4,r5,r6,pc}
EP func_00119F20,ipc_handle_slot_delta

B func_0012696C
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(60 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_0012696C
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_0012696C
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_0012696C:pop {r4,r5,r6,pc}
EP func_0012696C,ipc_handle_slot_beta

B func_001269E4
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(59 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_001269E4
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001269E4
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_001269E4:pop {r4,r5,r6,pc}
EP func_001269E4,ipc_handle_slot_beta

B func_00174848
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(1 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_00174848
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_00174848
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_00174848:pop {r4,r5,r6,pc}
EP func_00174848,ipc_handle_slot_lambda

B func_001F7630
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F7630;str r1,[r4,#128]!;ldr r0,[r0]
svc #50;ands r1,r0,#0x80000000;bmi .Lret_001F7630
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
.Lret_001F7630:pop {r4,r5,r6,pc}
EP func_001F7630,ipc_command_func_001F7630

B func_001F7798
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F7798;str r1,[r4,#128]!;ldr r0,[r0]
svc #50;ands r1,r0,#0x80000000;bmi .Lret_001F7798
ldrd r0,[r4,#8];strd r0,[r5];ldr r0,[r4,#4]
.Lret_001F7798:pop {r4,r5,r6,pc}
EP func_001F7798,ipc_command_func_001F7800

B func_001FB40C
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(11 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_001FB40C
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001FB40C
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
.Lret_001FB40C:pop {r4,r5,r6,pc}
EP func_001FB40C,ipc_handle_slot_epsilon

B func_001FB514
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(10 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_001FB514
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001FB514
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
.Lret_001FB514:pop {r4,r5,r6,pc}
EP func_001FB514,ipc_handle_slot_epsilon

B func_001FB670
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(12 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_001FB670
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_001FB670
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
.Lret_001FB670:pop {r4,r5,r6,pc}
EP func_001FB670,ipc_handle_slot_epsilon

B func_00202CF8
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(6 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_00202CF8
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_00202CF8
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_00202CF8:pop {r4,r5,r6,pc}
EP func_00202CF8,ipc_handle_slot_zeta

B func_002030EC
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(3 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_002030EC
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002030EC
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_002030EC:pop {r4,r5,r6,pc}
EP func_002030EC,ipc_handle_slot_xi

B func_002C5514
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
mov r1,#(26 << 16);str r1,[r4,#128]!;ldr r0,[r0]
svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C5514
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_002C5514:pop {r4,r5,r6,pc}
E func_002C5514

B func_002C5A20
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
mov r1,#(35 << 16);str r1,[r4,#128]!;ldr r0,[r0]
svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C5A20
ldrh r0,[r4,#8];strh r0,[r5];ldr r0,[r4,#4]
.Lret_002C5A20:pop {r4,r5,r6,pc}
E func_002C5A20

B func_002C6480
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(40 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_002C6480
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C6480
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_002C6480:pop {r4,r5,r6,pc}
EP func_002C6480,ipc_handle_slot_gamma

B func_002C6534
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(15 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_002C6534
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C6534
ldr r0,[r4,#12];str r0,[r5];ldr r0,[r4,#4]
.Lret_002C6534:pop {r4,r5,r6,pc}
EP func_002C6534,ipc_handle_slot_gamma

B func_002C6570
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(25 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_002C6570
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C6570
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_002C6570:pop {r4,r5,r6,pc}
EP func_002C6570,ipc_handle_slot_gamma

B func_002C65AC
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(20 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_002C65AC
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002C65AC
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_002C65AC:pop {r4,r5,r6,pc}
EP func_002C65AC,ipc_handle_slot_gamma

B func_002DED74
push {r4,r5,r6,lr};mov r5,r0;mrc p15,0,r4,c13,c0,3
mov r0,#(54 << 16);str r0,[r4,#128]!;ldr r0,.Lpool_func_002DED74
ldr r0,[r0];svc #50;ands r1,r0,#0x80000000;bmi .Lret_002DED74
ldrb r0,[r4,#8];strb r0,[r5];ldr r0,[r4,#4]
.Lret_002DED74:pop {r4,r5,r6,pc}
EP func_002DED74,ipc_handle_slot_beta

B func_002E24B4
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
mov r1,#(6 << 16);str r1,[r4,#128]!;ldr r0,[r0]
svc #50;ands r1,r0,#0x80000000;bmi .Lret_002E24B4
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_002E24B4:pop {r4,r5,r6,pc}
E func_002E24B4

B func_002E4424
push {r4,r5,r6,lr};mov r5,r1;mrc p15,0,r4,c13,c0,3
mov r1,#(22 << 16);str r1,[r4,#128]!;ldr r0,[r0]
svc #50;ands r1,r0,#0x80000000;bmi .Lret_002E4424
ldr r0,[r4,#8];str r0,[r5];ldr r0,[r4,#4]
.Lret_002E4424:pop {r4,r5,r6,pc}
E func_002E4424
```

## Semantic behavior summary

Every function writes its no-parameter request header to command-buffer word
0, issues SendSyncRequest, and returns the SVC error unchanged when its sign
bit is set. On success, each wrapper copies the exact displayed response field
to the caller's output pointer and returns response word 1. The sixteen
global-handle wrappers receive the output pointer in `r0`; the six entry-handle
wrappers receive a pointer to the service handle in `r0` and their output
pointer in `r1`.

The schedules intentionally use `ands` plus `bmi`, retain `r6` in every
four-register save set, and perform the output copy before loading response
word 1. The byte, halfword, word, and doubleword access widths are normative.

## Literal and inline-identity ledger

This batch contributes exactly eighteen post-body literal slots:

- sixteen handle slots: `delta` twice, new `nu` once, `beta` three times,
  `lambda` once, `epsilon` three times, `zeta` once, new `xi` once, and
  `gamma` four times; and
- two command-header slots: new ID-2060 class
  `ipc_command_func_001F7630` once and established ID-2052 class
  `ipc_command_func_001F7800` once.

Physical private-target comparison confirms that the two new handle classes,
the new command class, and every established class assignment form the stated
bijection. Across IPC batches 12, 13, and 15 through 27, exactly 355 post-body
slots form 180 identity/value classes.

There are twenty inline-header occurrences forming seventeen semantic inline
command identities. IDs 2, 3, 10, 12, 20, 22, and 25 reuse established inline
identities. IDs 1, 6, 11, 15, 26, 35, 40, 54, 59, and 60 are new inline
identities; IDs 2, 6, and 11 each occur twice in this batch. Inline identities
have no pool slot or relocation.

## Probe evidence, overlap audit, and validator requirements

The ignored probe `build/AS_EUR_REV2/probes/ipc_templates27_probe.S` has
SHA-256 `936f1f3636cbdc6d79bf73e613665451ac061e34b3dcb8ca161680548e39203c`;
its assembled object has SHA-256
`990df0f5489d12c96a478c7c71e1756e9c9f616cec54f3bbcb986ca77e811932`.
Size-bounded independent extraction proved all twenty-two complete executable
bodies byte-exact at their declared sizes: 22/22 functions and 1,208/1,208
code bytes.

The selection was intersected with the current objdiff unmatched inventory,
every manifest and specification through batch 26, the concurrently staged
batch-27 duplicate specification, and the concurrent runtime batch-27
selection (`func_002DF13C` and `func_002DFB0C`). Every selected function was
unmatched and absent from those sets. The twenty-two body ranges and eighteen
post-body slots are mutually disjoint, do not overlap an inventoried function,
and do not overlap either concurrent selection.

A deterministic validator must pin source and manifest hashes; enforce all
twenty-two names, ARM mode, declared sizes, complete literal mnemonic
sequences, body/pool boundaries, all eighteen pool relocations and their
identity assignments, all seventeen inline command identities, and the
355-slot/180-class cumulative bijection; and reject raw instruction
directives, numeric pool words, register substitution, rescheduling, direct
calls, and missing or extra instructions. It must independently compare every
complete body against the verified target.
