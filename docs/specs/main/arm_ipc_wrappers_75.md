# Probe-verified ARM service/data wrappers 75

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function report, neutral global-symbol
  inventory, bounded private-target control/data-flow inspection, physical
  literal equality analysis, direct-transfer resolution, and independent GNU
  Arm assembly and normalized exact-target comparison.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.
- Implementation source SHA-256: `3dc6df1e646475226164c631b1b346cd823532640bdab0b341644bede9bcfec9`.
- Normalized normative-schedule SHA-256: `4cc927a474cbc01cfe2a3abc27aeee62478ca6205e5fda873f96cd5d69717627`.

This batch covers seven still-unmatched ARM linked-record teardown, circular
buffer update, shared-service state publication, resource reset, and packed-flag
update bodies. The executable bodies total exactly 484 bytes (121 instructions).
Selection was collision-audited against every current config, including pending
runtime, duplicate, template, and IPC cohorts. None of the seven names occurs as
a pre-existing configured primary body, alias, secondary entry, branch
destination, literal code entry, or material owner.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_0018D0F0` | `.text.func_0018D0F0` | 88 | `func_0018D148` at +88 | Walk a linked service-record chain recursively, release both embedded resources, and relink the owner as records unwind. |
| `func_0018D148` | `.text.func_0018D148` | 72 | `func_0018D190` at +72 | Walk the companion record chain recursively, release its embedded resource, and relink the owner as records unwind. |
| `func_0018E8C0` | `.text.func_0018E8C0` | 64 | `func_0018E980` at +192 | Copy a requested word span into the circular service buffer, advance its cursor, and wrap the cursor to zero at the capacity bound. |
| `func_0018E980` | `.text.func_0018E980` | 96 | `func_0018E9E4` at +100 | Reset an embedded resource, publish one indexed enable state through the shared controller, then finish or tail-transfer through the paired resource helper. |
| `func_0018EC4C` | `.text.func_0018EC4C` | 108 | `func_0018ECB8` at +108 | Reset an embedded resource, mark every linked member inactive, clear counters, finalize the resource, and advance the owner generation fields. |
| `func_0018ECB8` | `.text.func_0018ECB8` | 28 | `func_0018ECD4` at +28 | Replace packed flag bit 4 in the selected embedded service record. |
| `func_0018ECD4` | `.text.func_0018ECD4` | 28 | `func_0018EDA8` at +212 | Replace packed flag bit 6 in the selected embedded service record. |

The first, second, fifth, and sixth bodies end exactly at the following global.
`func_0018E980` owns its one reached literal word at +96 and no other adjacent
material. The 128 bytes from `func_0018E8C0` +64 through +191 and the 184 bytes
from `func_0018ECD4` +28 through +211 are explicit gaps outside this batch;
they are not reached literal pools and must not be emitted or claimed by the
implementation. Thus the batch owns 484 executable bytes and four adjacent
literal bytes, with no padding, private string, asset, or unrelated material.

All seven report entries lack `fuzzy_match_percent`, and report sizes agree with
the neutral symbol inventory. Their complete body byte strings are each unique
among current ARM global bodies. A fresh all-config audit found no ownership or
reference collision for any selected name.

## Literal positional and equality contract

There is exactly one physical literal slot and no new semantic identity class.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_0018E980` | +96 | +48 | `ipc_shared_control_owner_72` | Reused; equal to all established slots of this identity. |

The slot is unequal to every other configured literal identity. Starting from
the IPC74 totals of 770 physical slots in 406 classes, this batch advances the
cumulative totals to exactly 771 slots in 406 classes.

## Direct-transfer and entry contract

There are exactly eleven symbolic direct-transfer relocations in seven primary
entry classes. Nine sites leave their body and two are intra-batch recursive
calls. All destinations are aligned ARM entries; there are no secondary entries.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0018D0F0` | +28 | `R_ARM_CALL` | `bl` | `func_0018D0F0` |
| `func_0018D0F0` | +56 | `R_ARM_CALL` | `bl` | `func_001862FC` |
| `func_0018D0F0` | +68 | `R_ARM_CALL` | `bl` | `func_001862FC` |
| `func_0018D148` | +28 | `R_ARM_CALL` | `bl` | `func_0018D148` |
| `func_0018D148` | +52 | `R_ARM_CALL` | `bl` | `func_001862FC` |
| `func_0018E8C0` | +28 | `R_ARM_CALL` | `bl` | `func_00300B28` |
| `func_0018E980` | +24 | `R_ARM_CALL` | `bl` | `func_001602B8` |
| `func_0018E980` | +56 | `R_ARM_CALL` | `bl` | `func_00179E88` |
| `func_0018E980` | +68 | `R_ARM_JUMP24` | `b` | `func_00160380` |
| `func_0018EC4C` | +16 | `R_ARM_CALL` | `bl` | `func_001602B8` |
| `func_0018EC4C` | +76 | `R_ARM_CALL` | `bl` | `func_00160380` |

`func_001862FC`, `func_001602B8`, and `func_00160380` are shared classes with
three, two, and two sites respectively. `func_00300B28` and `func_00179E88`
are singleton classes, as are the two self-recursive entries. The seven classes
are pairwise distinct. Every other B-family instruction in the schedule targets
a local label and produces no symbolic relocation.

## Complete normative mnemonic schedules

The schedule is complete and literal. `BEGIN` emits only the standard ARM
section/function header; `END` fixes executable symbol size before the owned
pool word. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, condition, addressing mode, immediate, local target,
transfer form, pool position, and equality identity.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro BEGIN f
 .section .text.\f,"ax",%progbits
 .balign 4
 .arm
 .global \f
 .type \f,%function
\f:
.endm
.macro END f
 .size \f,.-\f
.endm

.global func_001862FC,func_00300B28,func_001602B8,func_00179E88
.global func_00160380,ipc_shared_control_owner_72

BEGIN func_0018D0F0
cmp r1,#0
bxeq lr
push {r4,r5,r6,r7,r8,lr}
mov r6,r0
mov r4,r1
.Lrecord_recurse_0018D0F0:
mov r0,r6
ldr r1,[r4,#12]
bl func_0018D0F0
ldr r0,[r6,#4]
mov r5,r4
add r7,r4,#16
ldr r4,[r4,#8]
str r0,[r5,#12]
add r0,r7,#8
bl func_001862FC
mov r0,r7
nop
bl func_001862FC
cmp r4,#0
str r5,[r6,#4]
bne .Lrecord_recurse_0018D0F0
pop {r4,r5,r6,r7,r8,pc}
END func_0018D0F0

BEGIN func_0018D148
cmp r1,#0
bxeq lr
push {r4,r5,r6,lr}
mov r6,r0
mov r4,r1
.Lrecord_recurse_0018D148:
mov r0,r6
ldr r1,[r4,#12]
bl func_0018D148
ldr r1,[r6,#4]
mov r5,r4
add r0,r4,#16
ldr r4,[r4,#8]
str r1,[r5,#12]
bl func_001862FC
cmp r4,#0
str r5,[r6,#4]
bne .Lrecord_recurse_0018D148
pop {r4,r5,r6,pc}
END func_0018D148

BEGIN func_0018E8C0
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0]
ldr r3,[r4,#12]
mov r5,r2
lsl r2,r2,#2
add r0,r0,r3,lsl #2
bl func_00300B28
ldr r0,[r4,#12]
ldr r1,[r4,#4]
add r0,r0,r5
cmp r0,r1
str r0,[r4,#12]
movge r0,#0
strge r0,[r4,#12]
pop {r4,r5,r6,pc}
END func_0018E8C0

BEGIN func_0018E980
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
add r4,r0,#52
mov r6,r1
mov r7,r2
mov r0,r4
bl func_001602B8
add r0,r5,r6
cmp r7,#0
strb r7,[r0,#48]
beq .Ldisabled_0018E980
.Lpublish_0018E980:
mov r2,#1
.Lload_control_0018E980:
ldr r0,.Lshared_control_0018E980
mov r1,r6
bl func_00179E88
mov r0,r4
pop {r4,r5,r6,r7,r8,lr}
b func_00160380
.Ldisabled_0018E980:
add r0,r5,r6,lsl #2
ldr r0,[r0,#20]
cmp r0,#0
moveq r2,#0
bne .Lpublish_0018E980
b .Lload_control_0018E980
END func_0018E980
.Lshared_control_0018E980:
.word ipc_shared_control_owner_72

BEGIN func_0018EC4C
push {r4,r5,r6,lr}
mov r4,r0
add r0,r0,#112
mov r5,r0
bl func_001602B8
ldr r0,[r4,#48]
cmp r0,#0
movne r1,#3
beq .Lmembers_done_0018EC4C
.Lmember_loop_0018EC4C:
mov r2,r0
ldr r0,[r0,#20]
strb r1,[r2,#17]
cmp r0,#0
bne .Lmember_loop_0018EC4C
.Lmembers_done_0018EC4C:
mov r0,#0
str r0,[r4,#48]
strh r0,[r4,#52]
strh r0,[r4,#54]
mov r0,r5
bl func_00160380
ldrh r1,[r4,#108]
ldrh r0,[r4,#4]
orr r1,r1,#32768
add r0,r0,#1
strh r1,[r4,#108]
strh r0,[r4,#4]
pop {r4,r5,r6,pc}
END func_0018EC4C

BEGIN func_0018ECB8
ldr r0,[r0,#104]
mov r0,r0
ldrh r2,[r0,#30]
bic r2,r2,#16
orr r1,r2,r1,lsl #4
strh r1,[r0,#30]
bx lr
END func_0018ECB8

BEGIN func_0018ECD4
ldr r0,[r0,#104]
mov r0,r0
ldrh r2,[r0,#30]
bic r2,r2,#64
orr r1,r2,r1,lsl #6
strh r1,[r0,#30]
bx lr
END func_0018ECD4
```

## Verification and implementation handoff

Independent ARMv6K/VFPv2 assembly and normalized comparison matched all seven
complete executable bodies, all eleven relocation sites and seven classes,
the one physical literal slot, and the literal equality relation against the
target. The unmatched/collision audit covered every report entry and current
config; body uniqueness was checked over all complete ARM global bodies.

Implement this artifact as `src/main/arm_ipc_wrappers_75.S` without access to
the private target, disassembly, unmatched report, symbol inventory, or probe
products. The implementation source SHA-256 must match in this specification
and the neutral config.
