# Probe-verified ARM controller helpers 83

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function report, neutral global-symbol
  inventory, bounded private-target control/data-flow inspection, physical
  literal equality analysis, whole-text entry auditing, and isolated GNU Arm
  schedule probes.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.
- Implementation source SHA-256: `2984e4b8a6e0c08867792f222ea99cd3107ebea5f23df78e958e6c2639c54e4f`.
- Normalized normative-schedule SHA-256: `2984e4b8a6e0c08867792f222ea99cd3107ebea5f23df78e958e6c2639c54e4f`.

This batch covers four still-unmatched ARM controller-state helpers. Their
executable bodies total exactly 584 bytes (146 instructions). Selection was
collision-audited against every current config, including runtime, duplicate,
template, and IPC cohorts. None is already owned as a configured primary body,
alias, secondary entry, literal code entry, or material owner. Existing calls
to three selected official entries establish only their external identities.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_0017A8A8` | `.text.func_0017A8A8` | 44 | `func_0017A8E8` at +64 | Unlink a two-word node, decrement the owning count, and clear the detached node. |
| `func_0017A8E8` | `.text.func_0017A8E8` | 36 | `func_0017AA68` at +384 | Insert a two-word node before an existing link, increment the owning count, and return the inserted node. |
| `func_0017AA68` | `.text.func_0017AA68` | 316 | `func_0017ABB8` at +336 | Initialize a controller record, select its default tag, and resolve an optional nested record pointer. |
| `func_0017ABB8` | `.text.func_0017ABB8` | 188 | `func_0017B42C` at +2164 | Initialize a controller-state record with its identity, scalar defaults, and cleared fields. |

The first two bodies own no adjacent material. Their 20-byte and 348-byte
post-body gaps are not referenced by either body and remain explicitly
unowned. `func_0017AA68` owns the five reached words immediately after its
body, exactly through the following global. `func_0017ABB8` owns only its
three reached post-body words; the remaining 1,964 bytes before the following
global are unrelated and unowned. The batch therefore owns exactly 584
executable bytes and 32 adjacent literal bytes, with no private string, asset,
or unrelated material.

All four authoritative report entries lack `fuzzy_match_percent`, and their
reported sizes agree with the neutral inventory. Every complete body byte
string is unique among current global ARM bodies. A whole-text direct-transfer
scan found ninety external transfers to selected official entries and no
transfer from outside a selected body into any selected interior.

## Literal positional and equality contract

There are exactly eight physical literal slots in eight pairwise-distinct
semantic identity classes. Four classes reuse identities established by
earlier IPC cohorts, and four controller record/state classes are new.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_0017AA68` | +316 | +8 | `ipc_controller_record_vtable_83` | New singleton class. |
| `func_0017AA68` | +320 | +80 | `ipc_default_flags_54` | Reused from IPC54. |
| `func_0017AA68` | +324 | +92 | `ipc_layout_record_tag_55` | Reused from IPC55. |
| `func_0017AA68` | +328 | +104 | `ipc_controller_variant_tag_83` | New singleton class. |
| `func_0017AA68` | +332 | +116 | `ipc_controller_fallback_tag_83` | New singleton class. |
| `func_0017ABB8` | +188 | +0 | `ipc_controller_state_vtable_83` | New singleton class. |
| `func_0017ABB8` | +192 | +4 | `ipc_unit_scalar_54` | Reused from IPC54. |
| `func_0017ABB8` | +196 | +8 | `service_zero_scalar_51` | Reused from IPC51. |

Starting from the IPC82 totals of 812 physical slots in 424 classes, this
batch advances the cumulative totals to exactly 820 slots in 428 classes.

## Direct-transfer and entry contract

The selected bodies contain no symbolic direct-transfer relocation. The third
body contains sixteen local conditional or unconditional direct branches; no
branch escapes its body. The other three bodies have no direct branch. There
are exactly four return sites, all encoded as `bx lr` after any required
register restoration. The branch identity contract is therefore deliberately
empty: there are no primary, secondary, shared, or singleton destination
classes to synthesize.

## Complete normative mnemonic schedules

The schedule is complete and literal. `BEGIN` emits only the standard ARM
section/function header; `END` fixes executable symbol size before each owned
pool. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, condition, addressing mode, immediate, local target, VFP
register, pool position, and equality identity.

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

.global ipc_controller_record_vtable_83
.global ipc_default_flags_54
.global ipc_layout_record_tag_55
.global ipc_controller_variant_tag_83
.global ipc_controller_fallback_tag_83
.global ipc_controller_state_vtable_83
.global ipc_unit_scalar_54
.global service_zero_scalar_51

BEGIN func_0017A8A8
mov r2,r0
ldm r1,{r0,r3}
mov r12,#0
str r3,[r0,#4]
str r0,[r3]
ldr r3,[r2]
sub r3,r3,#1
str r3,[r2]
str r12,[r1]
str r12,[r1,#4]
bx lr
END func_0017A8A8

BEGIN func_0017A8E8
ldr r3,[r1,#4]
stm r2,{r1,r3}
str r2,[r1,#4]
str r2,[r3]
ldr r1,[r0]
add r1,r1,#1
str r1,[r0]
mov r0,r2
bx lr
END func_0017A8E8

BEGIN func_0017AA68
push {r4}
str r1,[r0,#4]
ldr r1,.Lrecord_vtable_0017AA68
add r12,r0,#44
str r1,[r0]
mov r1,#0
str r1,[r0,#8]
strb r1,[r0,#36]
str r1,[r0,#28]
str r1,[r0,#32]
str r1,[r0,#40]
vldmia r2,{s0-s5}
vstmia r12,{s0-s5}
str r3,[r0,#68]
ldr r2,[r3,#24]
str r2,[r0,#12]
ldr r2,[r3,#28]
str r2,[r0,#16]
ldr r2,[r3,#52]
cmp r2,#0
ldreq r4,.Ldefault_flags_0017AA68
beq .Lselect_done_0017AA68
cmp r2,#2
ldreq r4,.Llayout_tag_0017AA68
beq .Lselect_done_0017AA68
cmp r2,#3
ldreq r4,.Lvariant_tag_0017AA68
beq .Lselect_done_0017AA68
cmp r2,#4
ldreq r4,.Lfallback_tag_0017AA68
.Lselect_done_0017AA68:
str r1,[r0,#24]
str r4,[r0,#20]
ldr r2,[r3]
cmp r2,#0x20000009
beq .Lcase_20000009_0017AA68
sub r2,r2,#16
subs r2,r2,#0x20000001
beq .Lcase_base_0017AA68
cmp r2,#16
bne .Lreturn_0017AA68
ldr r2,[r3,#56]!
cmp r2,#0
addne r2,r2,r3
moveq r2,r1
ldr r3,[r2,#24]
cmp r3,#0
bne .Luse_r3_0017AA68
b .Ltry_nested_0017AA68
.Lcase_base_0017AA68:
ldr r2,[r3,#56]!
cmp r2,#0
addne r2,r2,r3
moveq r2,r1
ldr r3,[r2,#24]
cmp r3,#0
beq .Ltry_nested_base_0017AA68
.Luse_r3_0017AA68:
mov r1,r3
b .Lstore_0017AA68
.Ltry_nested_base_0017AA68:
ldr r3,[r2,#12]!
cmp r3,#0
beq .Lstore_0017AA68
.Ladd_nested_0017AA68:
add r1,r3,r2
b .Lstore_0017AA68
.Lcase_20000009_0017AA68:
ldr r2,[r3,#56]!
cmp r2,#0
addne r2,r2,r3
moveq r2,r1
ldr r3,[r2,#24]
cmp r3,#0
bne .Luse_r3_0017AA68
ldr r3,[r2,#12]!
cmp r3,#0
bne .Ladd_nested_0017AA68
b .Lstore_0017AA68
.Ltry_nested_0017AA68:
ldr r3,[r2,#12]!
cmp r3,#0
bne .Ladd_nested_0017AA68
.Lstore_0017AA68:
str r1,[r0,#28]
.Lreturn_0017AA68:
pop {r4}
bx lr
END func_0017AA68
.Lrecord_vtable_0017AA68:
.word ipc_controller_record_vtable_83
.Ldefault_flags_0017AA68:
.word ipc_default_flags_54
.Llayout_tag_0017AA68:
.word ipc_layout_record_tag_55
.Lvariant_tag_0017AA68:
.word ipc_controller_variant_tag_83
.Lfallback_tag_0017AA68:
.word ipc_controller_fallback_tag_83

BEGIN func_0017ABB8
ldr r1,.Lstate_vtable_0017ABB8
vldr s1,.Lunit_0017ABB8
vldr s0,.Lzero_0017ABB8
str r1,[r0]
vstr s1,[r0,#48]
vstr s1,[r0,#52]
vstr s0,[r0,#56]
vstr s0,[r0,#60]
vstr s0,[r0,#64]
vstr s0,[r0,#68]
mov r1,#0
vstr s0,[r0,#72]
str r1,[r0,#76]
str r1,[r0,#80]
str r1,[r0,#84]
vstr s1,[r0,#88]
vstr s1,[r0,#92]
vstr s0,[r0,#96]
vstr s0,[r0,#100]
vstr s0,[r0,#104]
str r1,[r0,#108]
str r1,[r0,#112]
vstr s0,[r0,#116]
vstr s0,[r0,#120]
str r1,[r0,#124]
str r1,[r0,#128]
vstr s0,[r0,#132]
vstr s0,[r0,#136]
str r1,[r0,#140]
str r1,[r0,#144]
strb r1,[r0,#155]
vstr s0,[r0,#180]
vstr s0,[r0,#184]
str r1,[r0,#188]
str r1,[r0,#192]
str r1,[r0,#232]
str r1,[r0,#236]
str r1,[r0,#240]
str r1,[r0,#244]
str r1,[r0,#248]
str r1,[r0,#252]
str r1,[r0,#256]
str r1,[r0,#260]
str r1,[r0,#264]
str r1,[r0,#268]
str r1,[r0,#272]
bx lr
END func_0017ABB8
.Lstate_vtable_0017ABB8:
.word ipc_controller_state_vtable_83
.Lunit_0017ABB8:
.word ipc_unit_scalar_54
.Lzero_0017ABB8:
.word service_zero_scalar_51
```

## Isolated probe result

Assembled independently with GNU Arm Embedded binutils for ARM11 MPCore,
ARMv6K, VFPv2, unified syntax. Every executable section matched its bounded
private-target body exactly. The two literal-bearing sections had precisely
the declared five and three `R_ARM_ABS32` relocations, at the configured pool
offsets and against the configured identities. Function symbol sizes were
exactly 44, 36, 316, and 188 bytes. No executable instruction, branch,
literal slot, body extent, or ownership boundary remains inferred.
