# Probe-verified ARM service helpers 90

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Evidence: the authoritative unmatched-function report, neutral global-symbol
  inventory, recursive public ownership manifests, bounded private-target
  control/data-flow inspection, physical literal equality analysis,
  mode-aware direct-transfer resolution, whole-text ARM entry auditing, and
  isolated GNU Arm schedule probes.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, target-body hashes, private literal values, private strings,
  assets, implementation, or proprietary source are present.
- Implementation source SHA-256: `722c34ca0723741e510c155d1012bdd987e479be3cb619e726fe028d972d6104`.
- Normalized normative-schedule SHA-256: `df36366b0d78387b99b64c88944124d22a745b0b7bed2fb58aef75ea9395d069`.

This batch covers the next three still-unmatched ARM state-application helpers
after IPC89. The intervening `func_00180838` is excluded because the earlier
VFP-memory batch already owns and exactly matches it. The selected executable
bodies total exactly 304 bytes (76 instructions). A repository-wide ownership
scan found neither selected name nor any selected interior already owned as a
configured primary body, alias, secondary entry, literal code entry, or
material owner.

Each body is followed immediately by its complete one-word reached pool. No
text-like material, string, asset, jump table, padding, or unrelated unnamed
helper is part of this batch.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_00180770` | `.text.func_00180770` | 196 | `func_00180838` at +200 | Initialize a stack-resident twelve-word state record, populate it for each indexed non-null recipient, and apply the populated state to that recipient. |
| `func_0018085C` | `.text.func_0018085C` | 56 | `func_00180898` at +60 | Clamp a scalar to a lower bound, update one indexed state field when changed, and raise its shared dirty flag. |
| `func_00180898` | `.text.func_00180898` | 52 | `func_001808D0` at +56 | Clamp a scalar to a lower bound, update a state field when changed, and raise its dedicated dirty flag. |

The bodies own reached words at offsets +196, +56, and +52 respectively. The
batch therefore owns exactly 304 executable bytes and 12 adjacent literal
bytes.

All three authoritative report entries lack `fuzzy_match_percent`; their
reported sizes and modes agree with the neutral inventory. Each complete body
byte string is unique among all global ARM bodies. A mode-aware whole-text
direct-transfer audit found six transfers from outside the selected bodies to
selected official entries and none into a selected interior. Those entry
references do not expand ownership.

## Literal positional and equality contract

There are exactly three physical literal slots in one semantic identity class.
The class reuses an established public identity; there is no new identity. The
identity is normative, while its private word is not.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_00180770` | +196 | +8 | `service_zero_scalar_51` | Reused from IPC51. |
| `func_0018085C` | +56 | +0 | `service_zero_scalar_51` | Reused from IPC51. |
| `func_00180898` | +52 | +0 | `service_zero_scalar_51` | Reused from IPC51. |

Private equality checks prove all three slots equal every prior
`service_zero_scalar_51` slot. Starting from IPC89's 874 physical slots in 460
classes, this batch adds three slots and no classes, yielding exact cumulative
totals of 877 slots and 460 classes.

## Direct-transfer and entry contract

There are exactly two symbolic direct-transfer relocations, both unconditional
ARM `bl` calls using `R_ARM_CALL`. `func_0018C714` is an ARM primary entry.
`service_state_apply_secondary_90` is a distinct four-byte-aligned ARM
secondary entry at offset +108 relative to the bounding global
`func_001878A8`; it lies 784 bytes before the next global,
`func_00187C24`. There is no Thumb destination, external tail, or
register-indirect call.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_00180770` | +156 | `R_ARM_CALL` | `bl` | `service_state_apply_secondary_90` |
| `func_00180770` | +168 | `R_ARM_CALL` | `bl` | `func_0018C714` |

The bodies additionally contain five local direct branches and three return
sites. No other direct transfer escapes a selected body.

## Complete normative mnemonic schedules

The schedule is complete and literal. `BEGIN` emits only the standard ARM
section/function header; `END` fixes executable symbol size before each owned
pool. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, condition, addressing mode, immediate, local target, pool
position, and equality identity.

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

.global service_state_apply_secondary_90
.global func_0018C714
.global service_zero_scalar_51

BEGIN func_00180770
push {r4,r5,r6,lr}
sub sp,sp,#48
vldr s0,.Lzero_00180770
mov r5,r0
vstr s0,[sp,#32]
vstr s0,[sp,#16]
vstr s0,[sp]
vstr s0,[sp,#36]
vstr s0,[sp,#20]
vstr s0,[sp,#4]
vstr s0,[sp,#40]
vstr s0,[sp,#24]
vstr s0,[sp,#8]
vstr s0,[sp,#44]
vstr s0,[sp,#28]
vstr s0,[sp,#12]
mov r0,#0
str r0,[sp]
str r0,[sp,#4]
str r0,[sp,#8]
str r0,[sp,#12]
str r0,[sp,#16]
str r0,[sp,#20]
str r0,[sp,#24]
str r0,[sp,#28]
str r0,[sp,#32]
str r0,[sp,#36]
str r0,[sp,#40]
str r0,[sp,#44]
ldr r0,[r5,#8]
mov r4,#0
cmp r0,#0
ble .Ldone_00180770
.Lloop_00180770:
ldr r6,[r5,r4,lsl #2]
cmp r6,#0
beq .Lnext_00180770
mov r2,sp
mov r1,r4
mov r0,r5
bl service_state_apply_secondary_90
mov r1,sp
mov r0,r6
bl func_0018C714
.Lnext_00180770:
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bgt .Lloop_00180770
.Ldone_00180770:
add sp,sp,#48
pop {r4,r5,r6,pc}
END func_00180770
.Lzero_00180770:
.word service_zero_scalar_51

BEGIN func_0018085C
vldr s1,.Lzero_0018085C
add r1,r0,r1,lsl #2
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
vldr s1,[r1,#72]
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
beq .Lreturn_0018085C
vstr s0,[r1,#72]
ldrh r1,[r0,#32]
orr r1,r1,#8
strh r1,[r0,#32]
.Lreturn_0018085C:
bx lr
END func_0018085C
.Lzero_0018085C:
.word service_zero_scalar_51

BEGIN func_00180898
vldr s1,.Lzero_00180898
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
vldr s1,[r0,#36]
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
beq .Lreturn_00180898
ldrh r1,[r0,#32]
vstr s0,[r0,#36]
orr r1,r1,#64
strh r1,[r0,#32]
.Lreturn_00180898:
bx lr
END func_00180898
.Lzero_00180898:
.word service_zero_scalar_51
```

## Required validator contract

The isolated implementation validator must fail closed and check all of the
following:

1. Parse only a regular file of at most 64 MiB, with at most 16 MiB in any
   section, at most 16,384 sections, at most 1,000,000 symbols, and at most
   1,000,000 relocations. Reject malformed ELF, duplicate or missing configured
   sections, duplicate global definitions, executable `NOBITS`, duplicated
   selected bodies, and unexpected mapping-symbol states. Accept bounded
   unrelated executable sections in repository composites.
2. Require exactly three configured ARM sections and one global `STT_FUNC`
   definition at offset zero in each. Require body sizes 196, 56, and 52 bytes
   and full section sizes 200, 60, and 56 bytes.
3. Require exactly two `R_ARM_CALL` relocations at the configured call sites
   and three `R_ARM_ABS32` relocations at the configured pool offsets. Preserve
   both distinct call-target identities, all three repeated literal targets,
   and reject any additional relocation in a configured section.
4. Check the complete 76-instruction schedule, all five local branch targets,
   all three returns, every literal-load site, exact pool placement, and the
   ARM mapping-symbol contract. Reject an interior `$d` state in an executable
   body or an executable mapping state in an owned pool.
5. Prove the stated prior-identity reuse and exact three-slot/one-class
   bijection. Never make a private literal value normative.
6. Reject aliases, secondary-entry substitution, wrong-mode definitions,
   interior-entry retargeting, and any unlisted transfer target. Validate the
   secondary-entry relation independently of its public symbolic name.
7. Recompute total body size 304, adjacent size 12, physical slots 3, identity
   classes 1, reused classes 1, new classes 0, branch relocations 2, local
   branches 5, indirect calls 0, return sites 3, and external tails 0 from
   parsed evidence rather than trusting manifest totals.
8. Enforce the source and normalized-schedule hashes. The source path must
   remain exactly `src/main/arm_ipc_wrappers_90.S` and must stay inside the
   repository.
9. Include deterministic positive and hostile self-tests, including a valid
   foreign-executable composite with more than 12,000 sections and mutations
   of a body instruction, each local branch, each call relocation field and target,
   every pool relocation field, repeated and reused literal equality, section
   size, function symbol, and mapping-symbol state.
