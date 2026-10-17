# Probe-verified ARM service helpers 89

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
- Implementation source SHA-256: `add87794407b2386bfd1256b8c0085b5a10d8074bc5bebdbc9af2702af9c7a34`.
- Normalized normative-schedule SHA-256: `6e89083902376e755a6f1b1897f452527382d404a4daaa87961d5b79914c5124`.

This batch covers the next two still-unmatched ARM scalar-state setters after
IPC88. The intervening `func_00180658`, `func_001806C0`, and
`func_0018074C` are excluded because the earlier VFP-memory batch already
owns and exactly matches them. The selected executable bodies total exactly
156 bytes (39 instructions). A repository-wide ownership scan found neither
selected name nor any selected interior already owned as a configured primary
body, alias, secondary entry, literal code entry, or material owner.

Each body is followed immediately by its complete two-word reached pool. No
text-like material, string, asset, jump table, padding, or unrelated unnamed
helper is part of this batch.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_0018067C` | `.text.func_0018067C` | 60 | `func_001806C0` at +68 | Bias an input scalar, clamp it to a lower bound, and update a state field plus its dirty flag only when the resulting value changes. |
| `func_001806E4` | `.text.func_001806E4` | 96 | `func_0018074C` at +104 | Clamp a scalar to a bounded interval, update a byte selector and scalar field conditionally, and raise a shared dirty flag when either changes. |

The first body owns reached words at offsets +60 and +64. The second owns
reached words at offsets +96 and +100. The batch therefore owns exactly 156
executable bytes and 16 adjacent literal bytes.

Both authoritative report entries lack `fuzzy_match_percent`; their reported
sizes and modes agree with the neutral inventory. Each complete body byte
string is unique among all global ARM bodies. A mode-aware whole-text
direct-transfer audit found four transfers from outside the selected bodies to
selected official entries and none into a selected interior. Those entry
references do not expand ownership.

## Literal positional and equality contract

There are exactly four physical literal slots in two semantic identity
classes. Both classes reuse established public identities; there is no new
identity. The identities are normative, while their private words are not.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_0018067C` | +60 | +0 | `ipc_unit_scalar_54` | Reused from IPC54. |
| `func_0018067C` | +64 | +4 | `service_zero_scalar_51` | Reused from IPC51. |
| `func_001806E4` | +96 | +0 | `ipc_unit_scalar_54` | Reused from IPC54. |
| `func_001806E4` | +100 | +4 | `service_zero_scalar_51` | Reused from IPC51. |

Private equality checks prove both unit slots equal every prior
`ipc_unit_scalar_54` slot and both zero slots equal every prior
`service_zero_scalar_51` slot. The two identities are distinct. Starting from
IPC88's 870 physical slots in 460 classes, this batch adds four slots and no
classes, yielding exact cumulative totals of 874 slots and 460 classes.

## Direct-transfer and entry contract

There is no symbolic direct-transfer relocation, external tail, register-
indirect call, secondary entry, or cross-mode destination. The bodies contain
exactly three local direct branches and two return sites. No direct transfer
escapes either selected body.

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

.global ipc_unit_scalar_54
.global service_zero_scalar_51

BEGIN func_0018067C
vldr s1,.Lunit_0018067C
vldr s2,.Lzero_0018067C
vadd.f32 s1,s0,s1
vcmpe.f32 s1,s2
vmrs APSR_nzcv,fpscr
vldr s0,[r0,#68]
vmovcc.f32 s1,s2
vcmp.f32 s0,s1
vmrs APSR_nzcv,fpscr
beq .Lreturn_0018067C
ldrh r1,[r0,#32]
vstr s1,[r0,#68]
orr r1,r1,#8
strh r1,[r0,#32]
.Lreturn_0018067C:
bx lr
END func_0018067C
.Lunit_0018067C:
.word ipc_unit_scalar_54
.Lzero_0018067C:
.word service_zero_scalar_51

BEGIN func_001806E4
vldr s2,.Lunit_001806E4
vldr s1,.Lzero_001806E4
vcmpe.f32 s0,s2
vmrs APSR_nzcv,fpscr
vmovgt.f32 s0,s2
bgt .Lcompare_001806E4
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
.Lcompare_001806E4:
ldrb r3,[r0,#34]
mov r2,#0
cmp r3,r1
strbne r1,[r0,#34]
vldr s1,[r0,#60]
movne r2,#1
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
vstrne s0,[r0,#60]
cmpeq r2,#0
beq .Lreturn_001806E4
ldrh r1,[r0,#32]
orr r1,r1,#32
strh r1,[r0,#32]
.Lreturn_001806E4:
bx lr
END func_001806E4
.Lunit_001806E4:
.word ipc_unit_scalar_54
.Lzero_001806E4:
.word service_zero_scalar_51
```

## Required validator contract

The isolated implementation validator must fail closed and check all of the
following:

1. Parse only a regular file of at most 64 MiB, with at most 16 MiB in any
   section, at most 16,384 sections, at most 1,000,000 symbols, and at most
   1,000,000 relocations. Reject malformed ELF, duplicate or missing configured
   sections, duplicate global definitions, executable `NOBITS`, unexpected
   executable sections, and unexpected mapping-symbol states.
2. Require exactly two configured ARM sections and one global `STT_FUNC`
   definition at offset zero in each. Require body sizes 60 and 96 bytes and
   full section sizes 68 and 104 bytes.
3. Require exactly four `R_ARM_ABS32` relocations at the configured pool
   offsets and no direct-transfer relocation. Preserve both repeated target
   identities and reject any additional relocation.
4. Check the complete 39-instruction schedule, all three local branch targets,
   both returns, every literal-load site, exact pool placement, and the ARM
   mapping-symbol contract. Reject an interior `$d` state in an executable body
   or an executable mapping state in an owned pool.
5. Prove both stated prior-identity reuses, distinction of the two identities,
   and the exact four-slot/two-class bijection. Never make a private literal
   value normative.
6. Reject aliases, secondary-entry substitution, wrong-mode definitions,
   interior-entry retargeting, and any unlisted transfer target.
7. Recompute total body size 156, adjacent size 16, physical slots 4, identity
   classes 2, reused classes 2, new classes 0, branch relocations 0, local
   branches 3, indirect calls 0, return sites 2, and external tails 0 from
   parsed evidence rather than trusting manifest totals.
8. Enforce the source and normalized-schedule hashes. The source path must
   remain exactly `src/main/arm_ipc_wrappers_89.S` and must stay inside the
   repository.
9. Include deterministic positive and hostile self-tests, including a valid
   composite with more than 12,000 sections and mutations of a body
   instruction, each local branch, every pool relocation field, repeated and
   reused literal equality, section size, function symbol, and mapping-symbol
   state.
