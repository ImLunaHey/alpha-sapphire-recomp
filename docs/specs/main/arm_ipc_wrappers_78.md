# Probe-verified ARM service/controller wrappers 78

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
- Implementation source SHA-256: `a3c0563ad2a52cbd3b82d618bea5c0f0e809e55b03d94bca72debd9b5a7f048f`.
- Normalized normative-schedule SHA-256: `a3c0563ad2a52cbd3b82d618bea5c0f0e809e55b03d94bca72debd9b5a7f048f`.

This batch covers five still-unmatched ARM notification, packet-consumption,
record-initialization, service-configuration, and state-update bodies. The
executable bodies total exactly 552 bytes (138 instructions). Selection was
collision-audited against every current config, including pending runtime,
duplicate, template, and IPC cohorts. None of the five names occurs as a
configured primary body, alias, secondary entry, branch destination, literal
code entry, or material owner. The mention of `func_00190CD8` as the following
global after previously described material does not claim or reference its
body.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_00190A7C` | `.text.func_00190A7C` | 56 | `func_00190AB8` at +60 | If a pending-notification bit is set, publish the record's index and signed selector through the shared controller owner, then clear the bit. |
| `func_00190AB8` | `.text.func_00190AB8` | 360 | `func_00190C20` at +360 | Resolve an indexed record, consume a matching packet, rotate its payload, update or detach pending linked records under a synchronization guard, publish their terminal states, and store the packet-result flag. |
| `func_00190CD8` | `.text.func_00190CD8` | 36 | `func_00190D00` at +40 | Publish a record's low-byte selector through the shared controller owner and mark the record complete. |
| `func_00190FCC` | `.text.func_00190FCC` | 88 | `func_00191024` at +88 | Store a service mode, initialize the service state, and in the active mode enable each non-null configured record. |
| `func_00191080` | `.text.func_00191080` | 12 | `func_00191090` at +16 | Store one floating-point state value and its associated byte flag. |

`func_00190AB8` and `func_00190FCC` end exactly at their following globals.
`func_00190A7C` and `func_00190CD8` each own the single reached word immediately
after the body and therefore end exactly at the following global.
`func_00191080` is followed by four bytes of unreferenced alignment before the
next global; that padding is outside this batch and must not be emitted or
claimed. Thus the batch owns 552 executable bytes and eight adjacent literal
bytes, with no padding, private string, asset, or unrelated material.

All five report entries lack `fuzzy_match_percent`, and report sizes agree with
the neutral symbol inventory. Their complete body byte strings are each unique
among current ARM global bodies. A fresh all-config audit found no ownership or
reference collision for any selected body. A whole-text direct-branch scan
found no external transfer into the interior of any selected body.

## Literal positional and equality contract

There are exactly two physical literal slots, both in the previously defined
`ipc_shared_control_owner_72` semantic identity class.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_00190A7C` | +56 | +32 | `ipc_shared_control_owner_72` | Reused from IPC72, IPC74, and IPC75. |
| `func_00190CD8` | +36 | +16 | `ipc_shared_control_owner_72` | Same reused class. |

The two slots are equal to one another and to all four prior physical slots in
this class. Starting from the IPC77 totals of 781 physical slots in 414
classes, this batch advances the cumulative totals to exactly 783 slots in 414
classes.

## Direct-transfer and entry contract

There are exactly eight symbolic direct-transfer relocations in seven identity
classes: six primary global entries and one new secondary entry.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_00190A7C` | +36 | `R_ARM_CALL` | `bl` | `func_00192C4C` |
| `func_00190AB8` | +100 | `R_ARM_CALL` | `bl` | `func_001602B8` |
| `func_00190AB8` | +168 | `R_ARM_CALL` | `bl` | `func_00160380` |
| `func_00190AB8` | +328 | `R_ARM_CALL` | `bl` | `func_00160380` |
| `func_00190CD8` | +20 | `R_ARM_CALL` | `bl` | `func_00192BF8` |
| `func_00190FCC` | +12 | `R_ARM_CALL` | `bl` | `func_00188184` |
| `func_00190FCC` | +20 | `R_ARM_CALL` | `bl` | `func_001935F4` |
| `func_00190FCC` | +64 | `R_ARM_JUMP24` | `blne` | `service_record_enable_secondary_78` |

`func_00160380` is the sole shared destination class, with two sites. The
other six destinations are singleton classes, and all seven classes are
pairwise distinct. The conditional call at `func_00190FCC:+64` targets the ARM
secondary entry `service_record_enable_secondary_78`, located 72 bytes after
the global owner `func_001947D8` and 52 bytes before the next global
`func_00194854`. Every other B-family instruction in the schedule targets a
local label and produces no symbolic relocation.

## Complete normative mnemonic schedules

The schedule is complete and literal. `BEGIN` emits only the standard ARM
section/function header; `END` fixes executable symbol size before each owned
pool. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, condition, addressing mode, immediate, local target,
transfer form, pool position, and equality identity. In particular, the
`mov r0,r0` at `func_00190AB8:+24` and the two architectural `nop` instructions
at +172 and +176 are deliberately distinct encodings selected by their
mnemonics.

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

.global func_00192C4C,func_001602B8,func_00160380,func_00192BF8
.global func_00188184,func_001935F4,service_record_enable_secondary_78
.global ipc_shared_control_owner_72

BEGIN func_00190A7C
push {r4,lr}
mov r4,r0
ldrh r0,[r0,#108]
tst r0,#32768
beq .Lnotify_done_00190A7C
ldr r0,[r4]
ldrsh r2,[r4,#4]
and r1,r0,#255
ldr r0,.Lshared_owner_00190A7C
bl func_00192C4C
ldrh r0,[r4,#108]
bic r0,r0,#32768
strh r0,[r4,#108]
.Lnotify_done_00190A7C:
pop {r4,pc}
END func_00190A7C
.Lshared_owner_00190A7C:
.word ipc_shared_control_owner_72

BEGIN func_00190AB8
add r0,r0,r1,lsl #2
add r0,r0,#5120
add r0,r0,#476
mov r1,r2
ldr r0,[r0]
ldr r0,[r0,#104]
mov r0,r0
push {r4,r5,r6,r7,r8,r9,lr}
mov r4,r0
mov r6,r1
sub sp,sp,#20
ldrsh r0,[r1,#2]
ldrsh r1,[r4,#4]
cmp r0,r1
bne .Lpacket_done_00190AB8
ldr r0,[r6,#4]
ror r0,r0,#16
str r0,[r4,#8]
ldrh r0,[r6]
tst r0,#65280
beq .Lpacket_done_00190AB8
add r5,r4,#112
ldrh r7,[r6,#8]
ldrh r8,[r6,#10]
mov r0,r5
bl func_001602B8
ldr r2,[r4,#48]
cmp r2,#0
beq .Lempty_pending_00190AB8
ldrh r3,[r4,#52]
add r0,r4,#52
mov ip,sp
cmp r3,#0
mov r1,#0
beq .Lfinish_pending_00190AB8
.Lscan_pending_00190AB8:
ldrh r3,[r2,#18]
cmp r3,r7
bne .Lunlink_pending_00190AB8
mov r3,#2
strb r3,[r2,#17]
b .Lfinish_pending_00190AB8
.Lempty_pending_00190AB8:
mov r0,r5
bl func_00160380
nop
nop
b .Lpacket_done_00190AB8
.Lunlink_pending_00190AB8:
ldrh r3,[r0]
cmp r7,#0
sub r3,r3,#1
sxth r9,r3
strh r9,[r0]
str r2,[ip,r1,lsl #2]
add r1,r1,#1
beq .Lmatch_terminal_00190AB8
.Ladvance_default_00190AB8:
mov r3,#0
.Ladvance_pending_00190AB8:
ldr r2,[r2,#20]
cmp r3,#0
bne .Lfinish_pending_00190AB8
b .Lcheck_pending_count_00190AB8
.Lmatch_terminal_00190AB8:
ldrh r3,[r2,#18]
cmp r3,r8
cmpne r8,#0
moveq r3,#1
beq .Ladvance_pending_00190AB8
b .Ladvance_default_00190AB8
.Lcheck_pending_count_00190AB8:
cmp r9,#0
bne .Lscan_pending_00190AB8
.Lfinish_pending_00190AB8:
cmp r7,#0
mov r3,#0
strheq r3,[r0]
mcr p15,0,r3,c7,c10,5
cmp r1,#0
mov r0,#0
movgt r3,#3
ble .Lpublish_pending_00190AB8
.Lmark_pending_00190AB8:
ldr r7,[ip,r0,lsl #2]
add r0,r0,#1
cmp r1,r0
strb r3,[r7,#17]
bgt .Lmark_pending_00190AB8
.Lpublish_pending_00190AB8:
mov r0,r5
str r2,[r4,#48]
bl func_00160380
.Lpacket_done_00190AB8:
ldrh r0,[r6]
and r0,r0,#255
cmp r0,#1
movne r0,#0
strb r0,[r4,#12]
add sp,sp,#20
pop {r4,r5,r6,r7,r8,r9,pc}
END func_00190AB8

BEGIN func_00190CD8
push {r4,lr}
mov r4,r0
ldr r0,[r0]
and r1,r0,#255
ldr r0,.Lshared_owner_00190CD8
bl func_00192BF8
mov r0,#1
strb r0,[r4,#12]
pop {r4,pc}
END func_00190CD8
.Lshared_owner_00190CD8:
.word ipc_shared_control_owner_72

BEGIN func_00190FCC
push {r4,r5,r6,lr}
mov r5,r0
str r1,[r0,#64]
bl func_00188184
mov r1,r5
bl func_001935F4
ldr r0,[r5,#64]
cmp r0,#1
bne .Lconfigure_done_00190FCC
ldr r0,[r5,#8]
mov r4,#0
cmp r0,#0
ble .Lconfigure_done_00190FCC
.Lconfigure_each_00190FCC:
ldr r0,[r5,r4,lsl #2]
cmp r0,#0
movne r1,#1
blne service_record_enable_secondary_78
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bgt .Lconfigure_each_00190FCC
.Lconfigure_done_00190FCC:
pop {r4,r5,r6,pc}
END func_00190FCC

BEGIN func_00191080
vstr s0,[r0,#332]
strb r1,[r0,#310]
bx lr
END func_00191080
```

## Acceptance checks

- Exactly five global `STT_FUNC` symbols exist in the named sections, in the
  documented order and with sizes `56, 360, 36, 88, 12`.
- Each section contains only its body and documented owned words; the four-byte
  alignment gap after `func_00191080` remains unowned and un-emitted.
- Exactly eight branch relocations and two literal-word relocations occur at
  the documented offsets, kinds, and symbols; no other relocations occur.
- Both literal slots use the prior `ipc_shared_control_owner_72` identity; the
  seven direct-transfer classes obey the primary/secondary and
  shared/singleton partitions above.
- Normalized disassembly is exactly 138 ARM instructions and follows the
  complete schedule above, including every conditional form and local edge.
- Per-section body bytes and owned literal values compare exactly against the
  authoritative target; hostile substituted literal and destination identities
  must fail validation.
