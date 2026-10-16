# Probe-verified ARM service/controller wrappers 79

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
- Implementation source SHA-256: `bdb443def8fb845132c4301a89fafc6b50a05ce3af09bd667279efe263a259b3`.
- Normalized normative-schedule SHA-256: `bdb443def8fb845132c4301a89fafc6b50a05ce3af09bd667279efe263a259b3`.

This batch covers five still-unmatched ARM scalar access, variadic dispatch,
controller publication, and word population-count bodies. The executable
bodies total exactly 260 bytes (65 instructions). Selection was
collision-audited against every current config, including pending runtime,
duplicate, template, and IPC cohorts. None of the five names is already owned
as a configured primary body, alias, secondary entry, literal code entry, or
material owner. `func_00192BF8` and `func_00192C4C` occur only as previously
declared direct-transfer destinations in IPC78; those references do not claim
their bodies.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_0019125C` | `.text.func_0019125C` | 12 | `func_001919DC` at +1920 | Return the floating-point scalar at the selected four-byte-stride record slot. |
| `func_001919DC` | `.text.func_001919DC` | 28 | `func_001919F8` at +28 | Preserve the incoming register arguments, construct the stacked variadic cursor, and dispatch the request through the primary service formatter. |
| `func_00192BF8` | `.text.func_00192BF8` | 80 | `func_00192C4C` at +84 | If the controller selector is valid, resolve its active record, mark the record pending, and raise its enable-state bit. |
| `func_00192C4C` | `.text.func_00192C4C` | 84 | `func_00192EA4` at +600 | If the controller selector is valid, resolve its active record, publish a halfword payload, raise the corresponding notification bit, and report success. |
| `func_00192EA4` | `.text.func_00192EA4` | 56 | `func_00192EE8` at +68 | Count the set bits of one word with parallel pair, lane, nibble, byte, and halfword reductions. |

`func_001919DC` ends exactly at its following global. `func_00192BF8` and
`func_00192C4C` each own one reached word immediately after the body.
`func_00192EA4` owns its three reached words and ends exactly at the following
global. The 1,908-byte gap after `func_0019125C` and the 512-byte gap after the
owned word of `func_00192C4C` are outside this batch and must not be emitted or
claimed. Thus the batch owns 260 executable bytes and 20 adjacent literal
bytes, with no padding, private string, asset, or unrelated material.

All five authoritative report entries lack `fuzzy_match_percent`, and their
reported sizes agree with the neutral symbol inventory. Their complete body
byte strings are each unique among current ARM global bodies. A whole-text
direct-branch scan found no transfer from outside a selected body into its
interior.

## Literal positional and equality contract

There are exactly five physical literal slots in four semantic identity
classes. The two controller slots reuse one established identity, while the
three population-count masks define distinct new identities.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_00192BF8` | +80 | +24 | `ipc_controller_selector_offset_77` | Reused from IPC77. |
| `func_00192C4C` | +84 | +28 | `ipc_controller_selector_offset_77` | Same reused class. |
| `func_00192EA4` | +56 | +0 | `ipc_popcount_pair_mask_79` | New. |
| `func_00192EA4` | +60 | +4 | `ipc_popcount_lane_mask_79` | New. |
| `func_00192EA4` | +64 | +24 | `ipc_popcount_nibble_mask_79` | New. |

The first two slots are equal to each other and to the prior IPC77 slot. The
three new classes are pairwise unequal and unequal to every previously
configured literal identity. Starting from the IPC78 totals of 783 physical
slots in 414 classes, this batch advances the cumulative totals to exactly 788
slots in 417 classes.

## Direct-transfer and entry contract

There are exactly three symbolic direct-transfer relocations in two primary
entry classes. All destinations are aligned ARM entries; there are no new
secondary entries.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_001919DC` | +16 | `R_ARM_CALL` | `bl` | `func_00193C68` |
| `func_00192BF8` | +12 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_00192C4C` | +16 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |

`func_0017E4D8` is the sole shared destination class, with two sites.
`func_00193C68` is a singleton class, and the two classes are distinct. Every
other B-family instruction in the schedule targets a local label and produces
no symbolic relocation.

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

.global func_00193C68,func_0017E4D8
.global ipc_controller_selector_offset_77
.global ipc_popcount_pair_mask_79,ipc_popcount_lane_mask_79
.global ipc_popcount_nibble_mask_79

BEGIN func_0019125C
add r0,r0,r1,lsl #2
vldr s0,[r0,#56]
bx lr
END func_0019125C

BEGIN func_001919DC
push {r0,r1,r2,r3}
push {r4,lr}
add r3,sp,#20
ldr r2,[sp,#16]
bl func_00193C68
pop {r4}
ldr pc,[sp],#20
END func_001919DC

BEGIN func_00192BF8
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl func_0017E4D8
cmp r0,#0
beq .Lpublish_done_00192BF8
ldr r0,.Lselector_offset_00192BF8
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r1,[r0,#176]
mov r0,#1
strb r0,[r1,#160]
ldr r2,[r1]
orr r2,r2,#65536
str r2,[r1]
.Lpublish_done_00192BF8:
pop {r4,r5,r6,pc}
END func_00192BF8
.Lselector_offset_00192BF8:
.word ipc_controller_selector_offset_77

BEGIN func_00192C4C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
mov r6,r2
bl func_0017E4D8
cmp r0,#0
beq .Lnotify_done_00192C4C
ldr r0,.Lselector_offset_00192C4C
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
strh r6,[r0,#162]
ldr r1,[r0]
orr r1,r1,#268435456
str r1,[r0]
mov r0,#1
.Lnotify_done_00192C4C:
pop {r4,r5,r6,pc}
END func_00192C4C
.Lselector_offset_00192C4C:
.word ipc_controller_selector_offset_77

BEGIN func_00192EA4
ldr r2,.Lpair_mask_00192EA4
ldr r1,.Llane_mask_00192EA4
and r2,r2,r0,lsr #1
sub r0,r0,r2
and r2,r0,r1
and r0,r1,r0,lsr #2
ldr r1,.Lnibble_mask_00192EA4
add r0,r0,r2
add r0,r0,r0,lsr #4
and r0,r0,r1
add r0,r0,r0,lsr #8
add r0,r0,r0,lsr #16
and r0,r0,#63
bx lr
END func_00192EA4
.Lpair_mask_00192EA4:
.word ipc_popcount_pair_mask_79
.Llane_mask_00192EA4:
.word ipc_popcount_lane_mask_79
.Lnibble_mask_00192EA4:
.word ipc_popcount_nibble_mask_79
```

## Acceptance checks

- Exactly five global `STT_FUNC` symbols exist in the named sections, in the
  documented order and with sizes `12, 28, 80, 84, 56`.
- Each section contains only its body and documented owned words; both explicit
  interstitial gaps remain unowned and un-emitted.
- Exactly three branch relocations and five literal-word relocations occur at
  the documented offsets, kinds, and symbols; no other relocations occur.
- The two controller slots use the prior
  `ipc_controller_selector_offset_77` identity; the three new masks are
  pairwise distinct; and the two direct-transfer classes obey the documented
  shared/singleton partition.
- Normalized disassembly is exactly 65 ARM instructions and follows the
  complete schedule above, including every conditional form and local edge.
- Per-section body bytes and owned literal values compare exactly against the
  authoritative target; hostile substituted literal and destination identities
  must fail validation.
