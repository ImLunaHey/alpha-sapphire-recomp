# Probe-verified ARM service helpers 91

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Evidence: the authoritative unmatched-function report, neutral global-symbol
  inventory, recursive public ownership manifests, bounded private-target
  control/data-flow inspection, physical literal equality analysis,
  mode-aware direct-transfer resolution, whole-text entry auditing, and an
  isolated placed GNU Arm schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, target-body hashes, private literal values, private strings,
  assets, implementation, or proprietary source are present.
- Implementation source SHA-256: `a5bb6a09dd98c635eb0b7d482c168f0db716c325eba190de02f000ec79e326d4`.
- Normalized normative-schedule SHA-256: `daa52c9b7dd3803bebec835f0c812b839c0e84fe5f4c5e44e3ed1985e0dca3e6`.

This batch covers the next four still-unmatched public ARM service helpers
after IPC90. Their executable bodies total exactly 576 bytes (144
instructions). A recursive repository-wide ownership scan found neither a
selected public entry nor any selected interior already owned as a configured
primary body, alias, secondary entry, literal code entry, or material owner.

The final selected helper is followed by its one-word reached pool and then by
two unowned executable helpers before the next global symbol. Those helpers are
not part of this batch. No text-like material, string, asset, jump table,
padding, or unrelated unnamed helper is owned here.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_00180968` | `.text.func_00180968` | 60 | `func_001809A4` at +60 | Initialize a destination subobject from a source record and, when the source exists, release its prior attachment before installing it as a tail operation. |
| `func_001809A4` | `.text.func_001809A4` | 108 | `func_00180A18` at +116 | Select a bounded state-record count from an optional input or current indexed state, then apply it with the neutral scalar default. |
| `func_00180A18` | `.text.func_00180A18` | 204 | `func_00180AE8` at +208 | Prepare one indexed state channel, validate three conditions on a candidate, and store the candidate with its active flag only when all conditions hold. |
| `func_00180AE8` | `.text.func_00180AE8` | 204 | `func_00180C80` at +408 | Prepare the paired indexed state channel, validate its corresponding three conditions, and store the candidate with its active flag only when all conditions hold. |

The last three bodies own complete reached pools of 8, 4, and 4 bytes. The
batch therefore owns exactly 576 executable bytes and 16 adjacent literal
bytes. All four authoritative report entries omit `fuzzy_match_percent`, and
their sizes and modes agree with the neutral inventory.

Each complete selected body byte string has multiplicity one among all 10,440
global function bodies. A mode-aware whole-text audit found three transfers
from outside the cohort, all to the official `func_00180968` entry, and none to
any selected interior. Those references do not expand ownership.

## Literal positional and equality contract

There are exactly four physical literal slots in three semantic identity
classes. Two classes reuse established public identities and one class is new.
The symbolic identities and equality partition are normative; their private
words are not.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_001809A4` | +108 | +16 | `service_zero_scalar_51` | Reused from IPC51. |
| `func_001809A4` | +112 | +24 | `service_stride_reciprocal_91` | New singleton class. |
| `func_00180A18` | +204 | +76 | `ipc_unit_scalar_54` | Reused from IPC54. |
| `func_00180AE8` | +204 | +76 | `ipc_unit_scalar_54` | Reused from IPC54 and equal to the preceding slot. |

Private equality checks prove both unit-scalar slots equal every prior
`ipc_unit_scalar_54` slot, and the zero-scalar slot equal every prior
`service_zero_scalar_51` slot. The new reciprocal identity is distinct from
both reused identities and from all previously established classes. Starting
from IPC90's 877 physical slots in 460 classes, this batch adds four slots and
one class, yielding exact cumulative totals of 881 slots and 461 classes.

## Direct-transfer and entry contract

There are exactly eighteen symbolic direct-transfer relocations: seventeen
ARM `bl` calls using `R_ARM_CALL` and one ARM `b` tail using `R_ARM_JUMP24`.
Ten destinations are four-byte-aligned ARM primary entries. Two destinations
are distinct four-byte-aligned ARM secondary entries:

- `service_index_secondary_91` is at +92 relative to bounding global
  `func_00187078`, 16 bytes before `func_001870E4`.
- `service_peer_secondary_91` is at +140 relative to bounding global
  `func_00186AAC`, 896 bytes before `func_00186EB8`.

There is no Thumb destination or register-indirect call. The bodies contain
thirteen local direct branches, four return sites, and one external tail.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_00180968` | +20 | `R_ARM_CALL` | `bl` | `func_0017A8A8` |
| `func_00180968` | +36 | `R_ARM_CALL` | `bl` | `func_00188308` |
| `func_00180968` | +52 | `R_ARM_JUMP24` | `b` | `func_00188324` |
| `func_001809A4` | +48 | `R_ARM_CALL` | `bl` | `func_00182C60` |
| `func_001809A4` | +64 | `R_ARM_CALL` | `bl` | `func_00187DEC` |
| `func_001809A4` | +96 | `R_ARM_CALL` | `bl` | `func_00182C60` |
| `func_00180A18` | +72 | `R_ARM_CALL` | `bl` | `func_00187DEC` |
| `func_00180A18` | +92 | `R_ARM_CALL` | `bl` | `func_00182C60` |
| `func_00180A18` | +108 | `R_ARM_CALL` | `bl` | `service_index_secondary_91` |
| `func_00180A18` | +120 | `R_ARM_CALL` | `bl` | `func_001867D0` |
| `func_00180A18` | +144 | `R_ARM_CALL` | `bl` | `func_001868EC` |
| `func_00180A18` | +168 | `R_ARM_CALL` | `bl` | `func_00186860` |
| `func_00180AE8` | +72 | `R_ARM_CALL` | `bl` | `func_00187DEC` |
| `func_00180AE8` | +92 | `R_ARM_CALL` | `bl` | `func_00182C60` |
| `func_00180AE8` | +108 | `R_ARM_CALL` | `bl` | `service_index_secondary_91` |
| `func_00180AE8` | +120 | `R_ARM_CALL` | `bl` | `func_00186A54` |
| `func_00180AE8` | +144 | `R_ARM_CALL` | `bl` | `service_peer_secondary_91` |
| `func_00180AE8` | +168 | `R_ARM_CALL` | `bl` | `func_00186AAC` |

## Complete normative mnemonic schedules

The schedule is complete and literal. `BEGIN` emits only the standard ARM
section/function header; `END` fixes executable symbol size before each owned
pool. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, condition, addressing mode, immediate, local target, pool
position, and symbolic identity. This exact source assembled and linked at the
four configured virtual addresses with zero differing bytes across every body
and owned pool.

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

.global func_0017A8A8
.global func_00188308
.global func_00188324
.global func_00182C60
.global func_00187DEC
.global service_index_secondary_91
.global func_001867D0
.global func_001868EC
.global func_00186860
.global func_00186A54
.global service_peer_secondary_91
.global func_00186AAC
.global service_zero_scalar_51
.global ipc_unit_scalar_54
.global service_stride_reciprocal_91

BEGIN func_00180968
push {r4,r5,r6,lr}
mov r5,r0
mov r4,r1
add r0,r0,#4
add r1,r1,#428
bl func_0017A8A8
cmp r4,#0
beq .Lreturn_00180968
mov r0,r4
bl func_00188308
mov r1,r4
mov r0,r5
pop {r4,r5,r6,lr}
b func_00188324
.Lreturn_00180968:
pop {r4,r5,r6,pc}
END func_00180968

BEGIN func_001809A4
push {r4,lr}
cmp r2,#0
vpush {d8}
add r4,r0,r1,lsl #4
vldr s16,.Lzero_001809A4
beq .Lnull_001809A4
ldr r0,.Lreciprocal_001809A4
add r1,r2,#4
vmov.f32 s0,s16
umull r1,r0,r0,r1
lsr r1,r0,#2
add r0,r4,#20
bl func_00182C60
.Lreturn_001809A4:
vpop {d8}
pop {r4,pc}
.Lnull_001809A4:
nop
bl func_00187DEC
add r0,r4,#20
ldrd r0,[r0,#8]
cmp r1,r0
blt .Lreturn_001809A4
vmov.f32 s0,s16
add r0,r4,#20
mov r1,#0
bl func_00182C60
vpop {d8}
pop {r4,pc}
END func_001809A4
.Lzero_001809A4:
.word service_zero_scalar_51
.Lreciprocal_001809A4:
.word service_stride_reciprocal_91

BEGIN func_00180A18
push {r4,r5,r6,r7,r8,lr}
mov r6,r1
mov ip,r0
add r5,r0,r6,lsl #4
vpush {d8}
mov r7,r2
ldrb r0,[r5,#660]
mov r8,r3
add r4,r5,#656
cmp r0,#0
movne r0,#0
bne .Lreturn_00180A18
add r0,r5,#20
ldrd r0,[r0,#8]
cmp r1,r0
bge .Lready_00180A18
mov r1,r6
mov r0,ip
bl func_00187DEC
.Lready_00180A18:
vldr s16,.Lunit_00180A18
add r0,r5,#20
mov r1,#0
vmov.f32 s0,s16
bl func_00182C60
vmov.f32 s0,s16
sxtb r0,r6
mov r5,r0
bl service_index_secondary_91
mov r1,r5
mov r0,r7
bl func_001867D0
cmp r0,#0
nop
beq .Lreturn_00180A18
mov r1,r8
mov r0,r7
bl func_001868EC
cmp r0,#0
nop
beq .Lreturn_00180A18
mov r1,#1
mov r0,r7
bl func_00186860
cmp r0,#0
nop
beq .Lreturn_00180A18
mov r0,#1
str r7,[r4]
strb r0,[r4,#4]
.Lreturn_00180A18:
vpop {d8}
pop {r4,r5,r6,r7,r8,pc}
END func_00180A18
.Lunit_00180A18:
.word ipc_unit_scalar_54

BEGIN func_00180AE8
push {r4,r5,r6,r7,r8,lr}
mov r6,r1
mov ip,r0
add r5,r0,r6,lsl #4
vpush {d8}
mov r7,r2
ldrb r0,[r5,#668]
mov r8,r3
add r4,r5,#664
cmp r0,#0
movne r0,#0
bne .Lreturn_00180AE8
add r0,r5,#20
ldrd r0,[r0,#8]
cmp r1,r0
bge .Lready_00180AE8
mov r1,r6
mov r0,ip
bl func_00187DEC
.Lready_00180AE8:
vldr s16,.Lunit_00180AE8
add r0,r5,#20
mov r1,#0
vmov.f32 s0,s16
bl func_00182C60
vmov.f32 s0,s16
sxtb r0,r6
mov r5,r0
bl service_index_secondary_91
mov r1,r5
mov r0,r7
bl func_00186A54
cmp r0,#0
nop
beq .Lreturn_00180AE8
mov r1,r8
mov r0,r7
bl service_peer_secondary_91
cmp r0,#0
nop
beq .Lreturn_00180AE8
mov r1,#1
mov r0,r7
bl func_00186AAC
cmp r0,#0
nop
beq .Lreturn_00180AE8
mov r0,#1
str r7,[r4]
strb r0,[r4,#4]
.Lreturn_00180AE8:
vpop {d8}
pop {r4,r5,r6,r7,r8,pc}
END func_00180AE8
.Lunit_00180AE8:
.word ipc_unit_scalar_54
```

## Required validator contract

The isolated implementation validator must fail closed and check all of the
following:

1. Parse only a regular file of at most 64 MiB, with at most 16 MiB in any
   section, at most 16,384 sections, at most 1,000,000 symbols, and at most
   1,000,000 relocations. Enforce the symbol and relocation caps independently.
   Reject malformed ELF, duplicate or missing configured sections, duplicate
   global definitions, executable `NOBITS`, duplicated selected bodies, and
   unexpected mapping-symbol states. Accept bounded unrelated executable
   sections in repository composites.
2. Require exactly four configured ARM sections and one global `STT_FUNC`
   definition at offset zero in each. Require body sizes 60, 108, 204, and 204
   bytes and full owned-section sizes 60, 116, 208, and 208 bytes.
3. Require exactly seventeen `R_ARM_CALL` relocations, one `R_ARM_JUMP24`
   relocation, and four `R_ARM_ABS32` relocations at the configured sites.
   Preserve every distinct transfer identity, every repeated target class, the
   literal equality partition, and reject any additional relocation in a
   configured section.
4. Check the complete 144-instruction schedule, all thirteen local branch
   targets, all four return sites, the external tail, every literal-load site,
   exact pool placement, and the ARM mapping-symbol contract. Reject an
   interior `$d` state in a body or executable mapping state in an owned pool.
5. Prove the stated two prior-identity reuses, one new identity, and exact
   four-slot/three-class bijection. Never make a private literal value
   normative.
6. Reject aliases, secondary-entry substitution, wrong-mode definitions,
   interior-entry retargeting, and unlisted transfer targets. Validate both
   secondary-entry relations independently of their public symbolic names.
7. Recompute total body size 576, adjacent size 16, physical slots 4,
   identity classes 3, reused classes 2, new classes 1, branch relocations 18,
   local branches 13, indirect calls 0, return sites 4, and external tails 1
   from parsed evidence rather than trusting manifest totals.
8. Enforce the source and normalized-schedule hashes. The source path must
   remain exactly `src/main/arm_ipc_wrappers_91.S` and must stay inside the
   repository.
9. Include deterministic positive and hostile self-tests, including a valid
   foreign-executable composite with more than 12,000 sections and mutations
   of every body instruction, each local branch, each call and tail relocation
   field and target, every pool relocation field and target, repeated and
   reused literal equality, section size, function symbol, mapping-symbol
   state, both secondary relations, and each independent file/section/symbol/
   relocation cap.
