# Probe-verified ARM controller wrappers 81

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function report, neutral global-symbol
  inventory, bounded private-target control/data-flow inspection, physical
  literal equality analysis, direct-transfer resolution, whole-text entry
  auditing, and isolated GNU Arm schedule probes.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.
- Implementation source SHA-256: `a6c1dc12f2b75f12c4da8bb75c9eb25a9ea3d8559e7b124cef99fa48c6686dee`.
- Normalized normative-schedule SHA-256: `a6c1dc12f2b75f12c4da8bb75c9eb25a9ea3d8559e7b124cef99fa48c6686dee`.

This batch covers eight contiguous still-unmatched ARM controller command
bodies. The executable bodies total exactly 1,128 bytes (282 instructions).
Selection was collision-audited against every current config, including
runtime, duplicate, template, and IPC cohorts. None is already owned as a
configured primary body, alias, secondary entry, literal code entry, or
material owner. Three selected entries are referenced by earlier matched
wrappers, but those references establish only their external entry identity.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_00179E88` | `.text.func_00179E88` | 104 | `func_00179EF4` at +108 | Resolve the peer controller record, store one indexed halfword command field, and publish the channel-specific state bit. |
| `func_00179EF4` | `.text.func_00179EF4` | 100 | `func_00179F5C` at +104 | Resolve the active controller record, store a byte command and its optional companion byte, and publish the command-state bit. |
| `func_00179F5C` | `.text.func_00179F5C` | 92 | `func_00179FBC` at +96 | Preserve a scalar VFP argument, resolve the active record, store it, and publish the corresponding command-state bit. |
| `func_00179FBC` | `.text.func_00179FBC` | 224 | `func_0017A0A0` at +228 | Apply a flag-selected halfword/word descriptor to one peer record lane and publish the lane-specific state bit. |
| `func_0017A0A0` | `.text.func_0017A0A0` | 108 | `func_0017A110` at +112 | Preserve a scalar VFP argument, store it in one peer record lane, and publish the lane-specific high state bit. |
| `func_0017A110` | `.text.func_0017A110` | 324 | `func_0017A25C` at +332 | Apply a larger flag-selected descriptor to a table-selected peer lane and publish its lane-specific state bit. |
| `func_0017A25C` | `.text.func_0017A25C` | 84 | `func_0017A2B4` at +88 | Store one active-record halfword field and publish its command-state bit. |
| `func_0017A2B4` | `.text.func_0017A2B4` | 92 | `func_0017A314` at +96 | Store two active-record halfword fields and publish their shared command-state bit. |

Every body owns the reached word immediately after its executable symbol;
`func_0017A110` owns two reached words. There is no padding or other material
between an owned pool and the following global. Thus the batch owns exactly
1,128 executable bytes and 36 adjacent literal bytes, with no private string,
asset, or unrelated material.

All eight authoritative report entries lack `fuzzy_match_percent`, and their
reported sizes agree with the neutral inventory. Every complete body byte
string is unique among current global ARM bodies. A whole-text direct-branch
scan found fifteen external transfers to selected official entries and no
transfer from outside a selected body into any selected interior.

## Literal positional and equality contract

There are exactly nine physical literal slots in three semantic identity
classes. Four active-selector slots reuse the identity established in IPC77.
Four peer-selector slots share one new identity, and one record-table slot is
a second new identity.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_00179E88` | +104 | +28 | `ipc_controller_peer_selector_offset_81` | New shared class. |
| `func_00179EF4` | +100 | +32 | `ipc_controller_selector_offset_77` | Reused from IPC77. |
| `func_00179F5C` | +92 | +32 | `ipc_controller_selector_offset_77` | Same reused class. |
| `func_00179FBC` | +224 | +28 | `ipc_controller_peer_selector_offset_81` | Same new peer-selector class. |
| `func_0017A0A0` | +108 | +32 | `ipc_controller_peer_selector_offset_81` | Same new peer-selector class. |
| `func_0017A110` | +324 | +28 | `ipc_controller_peer_selector_offset_81` | Same new peer-selector class. |
| `func_0017A110` | +328 | +52 | `ipc_controller_record_table_offset_81` | New singleton class. |
| `func_0017A25C` | +84 | +28 | `ipc_controller_selector_offset_77` | Same reused class. |
| `func_0017A2B4` | +92 | +32 | `ipc_controller_selector_offset_77` | Same reused class. |

The active-selector, peer-selector, and record-table identities are pairwise
distinct. The peer-selector and record-table identities are unequal to every
previously configured literal identity. Starting from the IPC80 totals of 793
physical slots in 418 classes, this batch advances the cumulative totals to
exactly 802 slots in 420 classes.

## Direct-transfer and entry contract

There are exactly eight symbolic direct-transfer relocations. Every one is an
ARM `R_ARM_CALL` to the same aligned primary entry, `func_0017E4D8`; there are
no secondary entries or singleton destination classes.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_00179E88` | +16 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_00179EF4` | +20 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_00179F5C` | +20 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_00179FBC` | +16 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_0017A0A0` | +20 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_0017A110` | +16 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_0017A25C` | +16 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_0017A2B4` | +20 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |

The remaining twenty-two B-family instructions target local labels and must
produce no symbolic relocation. Each body has exactly one return site.

## Complete normative mnemonic schedules

The schedule is complete and literal. `BEGIN` emits only the standard ARM
section/function header; `END` fixes executable symbol size before each owned
pool. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, condition, addressing mode, immediate, local target,
transfer form, VFP register, pool position, and equality identity.

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

.global func_0017E4D8
.global ipc_controller_selector_offset_77
.global ipc_controller_peer_selector_offset_81
.global ipc_controller_record_table_offset_81

BEGIN func_00179E88
push {r4,r5,r6,lr}
mov r5,r0
mov r4,r1
mov r6,r2
bl func_0017E4D8
cmp r0,#0
beq .Lloc_179EEC
ldr r0,.Lpeer_selector_00179E88
cmp r4,#0
ldrh r0,[r0,r5]
add r0,r5,r0,lsl #2
add r0,r0,#4096
ldr r0,[r0,#160]
add r1,r0,#4
add r1,r1,r4,lsl #1
strh r6,[r1,#36]
ldreq r1,[r0]
orreq r1,r1,#256
beq .Lloc_179EE4
cmp r4,#1
ldreq r1,[r0]
orreq r1,r1,#512
bne .Lloc_179EE8
.Lloc_179EE4:
str r1,[r0]
.Lloc_179EE8:
mov r0,#1
.Lloc_179EEC:
pop {r4,r5,r6,pc}
END func_00179E88
.Lpeer_selector_00179E88:
.word ipc_controller_peer_selector_offset_81

BEGIN func_00179EF4
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
mov r5,r1
mov r6,r2
mov r7,r3
bl func_0017E4D8
cmp r0,#0
beq .Lloc_179F54
ldr r0,.Lselector_00179EF4
cmp r6,#0
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
add r1,r0,#4
strb r6,[r0,#56]
strbeq r7,[r1,#53]
ldr r1,[r0]
orr r1,r1,#131072
str r1,[r0]
mov r0,#1
.Lloc_179F54:
pop {r4,r5,r6,r7,r8,pc}
END func_00179EF4
.Lselector_00179EF4:
.word ipc_controller_selector_offset_77

BEGIN func_00179F5C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
vpush {d8}
vmov.f32 s16,s0
bl func_0017E4D8
cmp r0,#0
beq .Lloc_179FB0
ldr r0,.Lselector_00179F5C
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
vstr s16,[r0,#52]
ldr r1,[r0]
orr r1,r1,#262144
str r1,[r0]
mov r0,#1
.Lloc_179FB0:
vpop {d8}
pop {r4,r5,r6,pc}
END func_00179F5C
.Lselector_00179F5C:
.word ipc_controller_selector_offset_77

BEGIN func_00179FBC
push {r4,r5,r6,lr}
mov r6,r0
mov r5,r1
mov r4,r2
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A098
ldr r0,.Lpeer_selector_00179FBC
ldrh r1,[r4]
add r2,r5,r5,lsl #2
ldrh r0,[r0,r6]
tst r1,#1
add r0,r6,r0,lsl #2
add r0,r0,#4096
ldr r0,[r0,#160]
add r3,r0,#4
beq .Lloc_17A00C
ldrh r1,[r4,#2]
add ip,r3,r2,lsl #2
strh r1,[ip,#42]
.Lloc_17A00C:
ldrh r1,[r4]
tst r1,#4
beq .Lloc_17A044
ldrh r1,[r4,#6]
add ip,r3,r2,lsl #2
strh r1,[ip,#46]
ldrh r1,[r4,#12]
strh r1,[ip,#52]
ldrh r1,[r4,#14]
strh r1,[ip,#54]
ldrh r1,[r4,#16]
strh r1,[ip,#56]
ldrh r1,[r4,#18]
strh r1,[ip,#58]
.Lloc_17A044:
ldrh r1,[r4]
tst r1,#2
beq .Lloc_17A05C
ldr r1,[r4,#8]
add ip,r3,r2,lsl #2
str r1,[ip,#48]
.Lloc_17A05C:
add r1,r3,r2,lsl #2
ldrh r2,[r4]
ldrh r3,[r1,#40]
cmp r5,#0
orr r2,r2,r3
strh r2,[r1,#40]
ldreq r1,[r0]
orreq r1,r1,#1024
beq .Lloc_17A090
cmp r5,#1
ldreq r1,[r0]
orreq r1,r1,#2048
bne .Lloc_17A094
.Lloc_17A090:
str r1,[r0]
.Lloc_17A094:
mov r0,#1
.Lloc_17A098:
pop {r4,r5,r6,pc}
END func_00179FBC
.Lpeer_selector_00179FBC:
.word ipc_controller_peer_selector_offset_81

BEGIN func_0017A0A0
push {r4,r5,r6,lr}
mov r5,r0
mov r4,r1
vpush {d8}
vmov.f32 s16,s0
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A104
ldr r0,.Lpeer_selector_0017A0A0
cmp r4,#0
ldrh r0,[r0,r5]
add r0,r5,r0,lsl #2
add r0,r0,#4096
ldr r0,[r0,#160]
add r1,r0,#4
add r1,r1,r4,lsl #2
vstr s16,[r1,#4]
ldreq r1,[r0]
orreq r1,r1,#16777216
beq .Lloc_17A100
cmp r4,#1
ldreq r1,[r0]
orreq r1,r1,#33554432
bne .Lloc_17A104
.Lloc_17A100:
str r1,[r0]
.Lloc_17A104:
vpop {d8}
pop {r4,r5,r6,pc}
END func_0017A0A0
.Lpeer_selector_0017A0A0:
.word ipc_controller_peer_selector_offset_81

BEGIN func_0017A110
push {r4,r5,r6,lr}
mov r6,r0
mov r5,r1
mov r4,r2
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A250
ldr r0,.Lpeer_selector_0017A110
ldrh r2,[r4]
add r1,r5,r5,lsl #2
add ip,r1,r5,lsl #3
ldrh r0,[r0,r6]
tst r2,#1
ldr r2,.Lrecord_table_0017A110
add r3,r6,r0,lsl #2
ldr r2,[r2,r3]
add r3,r2,#4
beq .Lloc_17A164
ldrh r0,[r4,#2]
add r1,r3,ip,lsl #2
strh r0,[r1,#82]
.Lloc_17A164:
ldrh r0,[r4]
tst r0,#4
beq .Lloc_17A1DC
ldrh r1,[r4,#6]
add r0,r3,ip,lsl #2
strh r1,[r0,#86]
ldrh r1,[r4,#28]
strh r1,[r0,#108]
ldrh r1,[r4,#30]
strh r1,[r0,#110]
ldrh r1,[r4,#32]
strh r1,[r0,#112]
ldrh r1,[r4,#34]
strh r1,[r0,#114]
ldrh r1,[r4,#36]
strh r1,[r0,#116]
ldrh r1,[r4,#38]
strh r1,[r0,#118]
ldrh r1,[r4,#40]
strh r1,[r0,#120]
ldrh r1,[r4,#42]
strh r1,[r0,#122]
ldrh r1,[r4,#44]
strh r1,[r0,#124]
ldrh r1,[r4,#46]
strh r1,[r0,#126]
ldrh r1,[r4,#48]
strh r1,[r0,#128]
ldrh r1,[r4,#50]
strh r1,[r0,#130]
.Lloc_17A1DC:
ldrh r0,[r4]
tst r0,#2
beq .Lloc_17A214
ldr r1,[r4,#8]
add r0,r3,ip,lsl #2
str r1,[r0,#88]
ldr r1,[r4,#12]
str r1,[r0,#92]
ldr r1,[r4,#16]
str r1,[r0,#96]
ldr r1,[r4,#20]
str r1,[r0,#100]
ldr r1,[r4,#24]
str r1,[r0,#104]
.Lloc_17A214:
add r0,r3,ip,lsl #2
ldrh r1,[r4]
ldrh r3,[r0,#80]
cmp r5,#0
orr r1,r1,r3
strh r1,[r0,#80]
ldreq r0,[r2]
orreq r0,r0,#4096
beq .Lloc_17A248
cmp r5,#1
ldreq r0,[r2]
orreq r0,r0,#8192
bne .Lloc_17A24C
.Lloc_17A248:
str r0,[r2]
.Lloc_17A24C:
mov r0,#1
.Lloc_17A250:
pop {r4,r5,r6,pc}
END func_0017A110
.Lpeer_selector_0017A110:
.word ipc_controller_peer_selector_offset_81
.Lrecord_table_0017A110:
.word ipc_controller_record_table_offset_81

BEGIN func_0017A25C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
mov r6,r2
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A2AC
ldr r0,.Lselector_0017A25C
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
strh r6,[r0,#58]
ldr r1,[r0]
orr r1,r1,#4194304
str r1,[r0]
mov r0,#1
.Lloc_17A2AC:
pop {r4,r5,r6,pc}
END func_0017A25C
.Lselector_0017A25C:
.word ipc_controller_selector_offset_77

BEGIN func_0017A2B4
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
mov r5,r1
mov r6,r2
mov r7,r3
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A30C
ldr r0,.Lselector_0017A2B4
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
strh r6,[r0,#60]
strh r7,[r0,#62]
ldr r1,[r0]
orr r1,r1,#8388608
str r1,[r0]
mov r0,#1
.Lloc_17A30C:
pop {r4,r5,r6,r7,r8,pc}
END func_0017A2B4
.Lselector_0017A2B4:
.word ipc_controller_selector_offset_77
```

## Implementation and validation contract

Implement this artifact in `src/main/arm_ipc_wrappers_81.S` without access to
the private target, disassembly, report, symbol inventory, probe products, or
other authored implementation sources. Assemble as ARMv6K with VFPv2 enabled.
The implementation must export exactly the eight named function symbols with
the declared executable sizes, own exactly the nine adjacent words, emit the
eight specified call relocations and nine literal relocations, and emit no
other relocation or material.

Validation must compare every selected executable body and owned adjacent word
against the authoritative target, verify section/symbol/relocation structure,
confirm all twenty-two local branches and eight return sites, enforce literal
position and equality classes, and reject foreign ownership. Both manifest
hash fields now record the independently materialized implementation source.
