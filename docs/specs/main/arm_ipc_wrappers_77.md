# Probe-verified ARM service/controller wrappers 77

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
- Implementation source SHA-256: `c3c138063b173940bc56fe0ee3ce72eff13cd94a2b12f349d53da3fa938d10c3`.
- Normalized normative-schedule SHA-256: `c3c138063b173940bc56fe0ee3ce72eff13cd94a2b12f349d53da3fa938d10c3`.

This batch covers five still-unmatched ARM validation, character-normalization,
active-record removal, controller-update, and controller-query bodies. The
executable bodies total exactly 460 bytes (115 instructions). Selection was
collision-audited against every current config, including pending runtime,
duplicate, template, and IPC cohorts. None of the five names occurs as a
configured primary body, alias, secondary entry, branch destination, literal
code entry, or material owner.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_0018EE20` | `.text.func_0018EE20` | 84 | `func_0018EFAC` at +396 | Validate a two-part service request, resolve its indexed record, and report whether the selected status bits are clear. |
| `func_00190084` | `.text.func_00190084` | 52 | `func_00190348` at +708 | Normalize one input character/index across three bounded ranges and return the invalid sentinel outside all accepted ranges. |
| `func_00190348` | `.text.func_00190348` | 184 | `func_00190400` at +184 | Remove an active linked controller record, run its optional transition, repair both links and occupancy state, then release the synchronization guard. |
| `func_00190410` | `.text.func_00190410` | 88 | `func_0019046C` at +92 | Validate a controller selector, locate its indexed slot, clear a packed status byte, and publish the corresponding state bit. |
| `func_0019046C` | `.text.func_0019046C` | 52 | `func_00190568` at +252 | Validate a controller selector, resolve its indexed slot, and return the slot's halfword identifier or the failure sentinel. |

`func_00190348` ends exactly at its following global. `func_00190410` owns its
one reached word at +88 and therefore ends exactly at the following global.
`func_0018EE20` has a 312-byte gap after its body. `func_00190084` owns reached
words at +52 and +56, followed by a 648-byte gap. `func_0019046C` owns its
reached word at +52, followed by a 196-byte gap. Those gaps are outside this
batch and must not be emitted or claimed. Thus the batch owns 460 executable
bytes and 16 adjacent literal bytes, with no padding, private string, asset, or
unrelated material.

All five report entries lack `fuzzy_match_percent`, and report sizes agree with
the neutral symbol inventory. Their complete body byte strings are each unique
among current ARM global bodies. A fresh all-config audit found no ownership or
reference collision for any selected name.

## Literal positional and equality contract

There are exactly four physical literal slots in four new semantic identity
classes.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_00190084` | +52 | +12 | `ipc_character_range_bias_a_77` | New. |
| `func_00190084` | +56 | +32 | `ipc_character_range_bias_b_77` | New. |
| `func_00190410` | +88 | +24 | `ipc_controller_selector_offset_77` | New. |
| `func_0019046C` | +52 | +24 | `ipc_controller_slot_offset_77` | New. |

The four classes are pairwise unequal and unequal to every previously
configured literal identity. Starting from the IPC76 totals of 777 physical
slots in 410 classes, this batch advances the cumulative totals to exactly 781
slots in 414 classes.

## Direct-transfer and entry contract

There are exactly seven symbolic direct-transfer relocations in six primary
entry classes. All destinations are aligned ARM entries; there are no new
secondary entries.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0018EE20` | +36 | `R_ARM_CALL` | `bl` | `func_00190D00` |
| `func_0018EE20` | +52 | `R_ARM_CALL` | `bl` | `func_002FEDF0` |
| `func_00190348` | +52 | `R_ARM_CALL` | `bl` | `func_0018ECF0` |
| `func_00190348` | +64 | `R_ARM_CALL` | `bl` | `func_001602B8` |
| `func_00190348` | +160 | `R_ARM_JUMP24` | `b` | `func_00160380` |
| `func_00190410` | +12 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_0019046C` | +8 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |

`func_0017E4D8` is the sole shared destination class, with two sites. The
other five destinations are singleton classes, and all six destination classes
are pairwise distinct. Every other B-family instruction in the schedule targets
a local label and produces no symbolic relocation.

## Complete normative mnemonic schedules

The schedule is complete and literal. `BEGIN` emits only the standard ARM
section/function header; `END` fixes executable symbol size before each owned
pool. Labels and directives occupy no executable bytes. Preserve every
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

.global func_00190D00,func_002FEDF0,func_0018ECF0
.global func_001602B8,func_00160380,func_0017E4D8
.global ipc_character_range_bias_a_77,ipc_character_range_bias_b_77
.global ipc_controller_selector_offset_77,ipc_controller_slot_offset_77

BEGIN func_0018EE20
mov r3,r0
movs r0,r1
mov r1,r2
cmpne r1,#0
push {r4,lr}
beq .Linvalid_0018EE20
cmp r3,#2
mvnne r0,#4
bne .Lresult_0018EE20
bl func_00190D00
cmp r0,#0
beq .Linvalid_0018EE20
ldrsb r4,[r0]
bl func_002FEDF0
ldr r0,[r0]
ldrb r0,[r0,r4]
tst r0,#56
moveq r0,#1
beq .Lresult_0018EE20
.Linvalid_0018EE20:
mov r0,#0
.Lresult_0018EE20:
pop {r4,pc}
END func_0018EE20

BEGIN func_00190084
cmp r0,#32
addls r0,r0,#32
bls .Lnormalized_00190084
ldr r1,.Lrange_bias_a_00190084
add r1,r1,r0
cmp r1,#39
addls r0,r1,#24
bls .Lnormalized_00190084
ldr r1,.Lrange_bias_b_00190084
add r0,r0,r1
cmp r0,#64
mvnhi r0,#0
.Lnormalized_00190084:
bx lr
END func_00190084
.Lrange_bias_a_00190084:
.word ipc_character_range_bias_a_77
.Lrange_bias_b_00190084:
.word ipc_character_range_bias_b_77

BEGIN func_00190348
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
mov r6,r1
ldr r0,[r1]
ldr r1,[r4]
mov r7,#1
tst r1,r7,lsl r0
beq .Lremove_done_00190348
ldrb r0,[r6,#4]
cmp r0,#1
beq .Lguard_00190348
mov r1,#1
mov r0,r6
bl func_0018ECF0
.Lguard_00190348:
add r0,r4,#16
mov r5,r0
bl func_001602B8
ldrd r0,r1,[r6,#36]
orrs r2,r0,r1
beq .Lempty_links_00190348
cmp r1,#0
beq .Lrepair_previous_00190348
cmp r0,#0
str r0,[r1,#36]
streq r1,[r4,#4]
.Lrepair_previous_00190348:
cmp r0,#0
beq .Lclear_occupancy_00190348
ldr r1,[r6,#40]
cmp r1,#0
str r1,[r0,#40]
streq r0,[r4,#8]
.Lclear_occupancy_00190348:
ldr r1,[r6]
ldr r0,[r4]
bic r0,r0,r7,lsl r1
str r0,[r4]
ldrh r0,[r4,#12]
sub r0,r0,#1
strh r0,[r4,#12]
mov r0,r5
pop {r4,r5,r6,r7,r8,lr}
b func_00160380
.Lempty_links_00190348:
mov r0,#0
str r0,[r4,#4]
str r0,[r4,#8]
b .Lclear_occupancy_00190348
.Lremove_done_00190348:
pop {r4,r5,r6,r7,r8,pc}
END func_00190348

BEGIN func_00190410
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl func_0017E4D8
cmp r0,#0
beq .Lcontroller_update_done_00190410
ldr r0,.Lselector_offset_00190410
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r1,[r0,#176]
mov r0,#1
ldrh r2,[r1,#160]
bic r2,r2,#255
strh r2,[r1,#160]
ldr r2,[r1]
orr r2,r2,#65536
str r2,[r1]
.Lcontroller_update_done_00190410:
pop {r4,r5,r6,pc}
END func_00190410
.Lselector_offset_00190410:
.word ipc_controller_selector_offset_77

BEGIN func_0019046C
push {r4,lr}
mov r4,r0
bl func_0017E4D8
cmp r0,#0
mvneq r0,#0
beq .Lcontroller_query_done_0019046C
ldr r0,.Lslot_offset_0019046C
ldrh r0,[r0,r4]
add r0,r4,r0,lsl #2
add r0,r0,#4096
ldr r0,[r0,#168]
ldrh r0,[r0,#2]
.Lcontroller_query_done_0019046C:
pop {r4,pc}
END func_0019046C
.Lslot_offset_0019046C:
.word ipc_controller_slot_offset_77
```

## Acceptance checks

- Exactly five global `STT_FUNC` symbols exist in the named sections, in the
  documented order and with sizes `84, 52, 184, 88, 52`.
- Each section contains only its body and documented owned words; the three
  explicit inter-global gaps remain unowned and un-emitted.
- Exactly seven branch relocations and four literal-word relocations occur at
  the documented offsets, kinds, and symbols; no other relocations occur.
- The four literal identities are pairwise distinct and distinct from all prior
  identities; the six direct-transfer classes obey the shared/singleton
  partition above.
- Normalized disassembly is exactly 115 ARM instructions and follows the
  complete schedule above, including every conditional form and local edge.
- Per-section body bytes and owned literal values compare exactly against the
  authoritative target; hostile substituted literal and destination identities
  must fail validation.
