# Probe-verified ARM controller wrappers 82

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
- Implementation source SHA-256: `a921f7d6df22d0d6bd3805602435f11302fa917186909c2dc7b80278049bc088`.
- Normalized normative-schedule SHA-256: `a921f7d6df22d0d6bd3805602435f11302fa917186909c2dc7b80278049bc088`.

This batch covers five contiguous still-unmatched ARM controller/state bodies.
The executable bodies total exactly 636 bytes (159 instructions). Selection
was collision-audited against every current config, including runtime,
duplicate, template, and IPC cohorts. None is already owned as a configured
primary body, alias, secondary entry, literal code entry, or material owner.
Several selected official entries are referenced by existing code, but those
references establish only their external entry identities.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_0017A314` | `.text.func_0017A314` | 112 | `func_0017A388` at +116 | Resolve the active controller record, store five halfword command fields, and publish their state bit. |
| `func_0017A388` | `.text.func_0017A388` | 228 | `func_0017A470` at +232 | Scale three four-component rows from an input record, then submit the transformed stack record through a shared controller owner. |
| `func_0017A470` | `.text.func_0017A470` | 56 | `func_0017A4A8` at +56 | Query one controller value through an established secondary entry and publish the returned value only on non-error status. |
| `func_0017A4A8` | `.text.func_0017A4A8` | 112 | `func_0017A528` at +128 | Lazily initialize a fixed-size scalar matrix and return its state object. |
| `func_0017A528` | `.text.func_0017A528` | 128 | `func_0017A5B8` at +144 | Lazily initialize the extended scalar matrix and return its state object. |

The first two bodies each own the reached word immediately after their
executable symbols. The third has no adjacent owned material. The final two
bodies each own four reached words. There is no padding or unrelated material
between an owned pool and the following global. Thus the batch owns exactly
636 executable bytes and 40 adjacent literal bytes, with no private string,
asset, or unrelated material.

All five authoritative report entries lack `fuzzy_match_percent`, and their
reported sizes agree with the neutral inventory. Every complete body byte
string is unique among current global ARM bodies. A whole-text direct-branch
scan found thirty-eight external transfers to selected official entries and
no transfer from outside a selected body into any selected interior.

## Literal positional and equality contract

There are exactly ten physical literal slots in eight semantic identity
classes. Four classes reuse identities established by earlier IPC cohorts;
the four controller-matrix guard/state classes are new and pairwise distinct.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_0017A314` | +112 | +40 | `ipc_controller_selector_offset_77` | Reused from IPC77. |
| `func_0017A388` | +228 | +212 | `ipc_shared_control_owner_72` | Reused from IPC72. |
| `func_0017A4A8` | +112 | +0, +20, +96 | `ipc_controller_matrix_guard_82` | New singleton class. |
| `func_0017A4A8` | +116 | +40 | `ipc_unit_scalar_54` | Reused from IPC54. |
| `func_0017A4A8` | +120 | +44 | `service_zero_scalar_51` | Reused from IPC51. |
| `func_0017A4A8` | +124 | +36, +104 | `ipc_controller_matrix_state_82` | New singleton class. |
| `func_0017A528` | +128 | +0, +20, +112 | `ipc_controller_extended_matrix_guard_82` | New singleton class. |
| `func_0017A528` | +132 | +40 | `ipc_unit_scalar_54` | Same reused unit-scalar class. |
| `func_0017A528` | +136 | +44 | `service_zero_scalar_51` | Same reused zero-scalar class. |
| `func_0017A528` | +140 | +36, +120 | `ipc_controller_extended_matrix_state_82` | New singleton class. |

All eight identity classes are pairwise distinct. The unit-scalar and
zero-scalar classes each span two physical slots. Starting from the
IPC81 totals of 802 physical slots in 420 classes, this batch advances the
cumulative totals to exactly 812 slots in 424 classes.

## Direct-transfer and entry contract

There are exactly five symbolic direct-transfer relocations: three ARM calls
and two immediate interworking calls to one Thumb primary. The Thumb primary
is shared by the two matrix initializers; every other destination is a
singleton class.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0017A314` | +28 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_0017A388` | +216 | `R_ARM_CALL` | `bl` | `func_0017FFB8` |
| `func_0017A470` | +24 | `R_ARM_CALL` | `bl` | `controller_query_secondary_82` |
| `func_0017A4A8` | +24 | `R_ARM_CALL` | `blx` | `func_00302F52` |
| `func_0017A528` | +24 | `R_ARM_CALL` | `blx` | `func_00302F52` |

`controller_query_secondary_82` is the aligned ARM entry at +292 from
`func_00133760`, 52 bytes before the next global `func_001338B8`. The selected
bodies contain five local conditional branches and exactly five return sites.

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
.global func_0017FFB8
.global controller_query_secondary_82
.global func_00302F52
.global ipc_controller_selector_offset_77
.global ipc_shared_control_owner_72
.global ipc_controller_matrix_guard_82
.global ipc_unit_scalar_54
.global service_zero_scalar_51
.global ipc_controller_matrix_state_82
.global ipc_controller_extended_matrix_guard_82
.global ipc_controller_extended_matrix_state_82

BEGIN func_0017A314
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r4,r0
add r0,sp,#32
mov r10,r1
ldm r0,{r7,r8,r9}
mov r5,r2
mov r6,r3
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A380
ldr r0,.Lselector_0017A314
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r10,lsl #2
add r0,r0,#4096
ldr r1,[r0,#176]
strh r9,[r1,#64]
strh r8,[r1,#66]
strh r7,[r1,#68]
strh r6,[r1,#70]
strh r5,[r1,#72]
ldr r0,[r1]
orr r0,r0,#16777216
str r0,[r1]
mov r0,#1
.Lloc_17A380:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_0017A314
.Lselector_0017A314:
.word ipc_controller_selector_offset_77

BEGIN func_0017A388
push {r4,r5,r6,r7,lr}
add r1,r0,#56
add r4,r0,#72
ldm r1,{r1,r2,r3,r12}
sub sp,sp,#52
add lr,sp,#32
ldm r4,{r4,r5,r6,r7}
stm sp,{r1,r2,r3,r12}
add r1,sp,#16
vmov s2,r4
stm r1,{r4,r5,r6,r7}
add r1,r0,#88
vmov s6,r5
ldm r1,{r1,r2,r3,r12}
vmov s3,r6
vmov s11,r7
vmov s4,r1
vmov s7,r2
stm lr,{r1,r2,r3,r12}
vmov s9,r3
vmov s12,r12
vldr s0,[r0,#104]
vldr s1,[sp]
vldr s5,[sp,#4]
vmul.f32 s2,s2,s0
vmul.f32 s1,s1,s0
vmul.f32 s4,s4,s0
vldr s8,[sp,#8]
vmul.f32 s5,s5,s0
vmul.f32 s6,s6,s0
vmul.f32 s7,s7,s0
vldr s10,[sp,#12]
vmul.f32 s8,s8,s0
vmul.f32 s3,s3,s0
vmul.f32 s9,s9,s0
vmul.f32 s10,s10,s0
vstr s1,[sp]
vmul.f32 s11,s11,s0
vstr s2,[sp,#16]
vmul.f32 s0,s12,s0
vstr s4,[sp,#32]
vstr s5,[sp,#4]
vstr s6,[sp,#20]
vstr s7,[sp,#36]
vstr s8,[sp,#8]
vstr s3,[sp,#24]
vstr s9,[sp,#40]
vstr s10,[sp,#12]
vstr s11,[sp,#28]
vstr s0,[sp,#44]
ldr r0,[r0]
mov r2,sp
and r1,r0,#255
ldr r0,.Lshared_owner_0017A388
bl func_0017FFB8
add sp,sp,#52
pop {r4,r5,r6,r7,pc}
END func_0017A388
.Lshared_owner_0017A388:
.word ipc_shared_control_owner_72

BEGIN func_0017A470
push {r3,r4,r5,lr}
mov r4,r0
mov r0,#0
mov r3,r0
str r0,[sp]
mov r0,sp
bl controller_query_secondary_82
mov r1,r0
and r0,r0,#0x80000000
cmp r0,#0
ldrge r0,[sp]
strge r0,[r4]
mov r0,r1
pop {r3,r4,r5,pc}
END func_0017A470

BEGIN func_0017A4A8
ldr r0,.Lmatrix_guard_0017A4A8
push {r4,lr}
ldr r0,[r0]
tst r0,#1
bne .Lloc_17A510
ldr r0,.Lmatrix_guard_0017A4A8
blx func_00302F52
cmp r0,#0
beq .Lloc_17A510
ldr r0,.Lmatrix_state_0017A4A8
vldr s1,.Lunit_0017A4A8
vldr s0,.Lzero_0017A4A8
add r1,r0,#16
vstr s1,[r0]
vstr s0,[r0,#4]
vstr s0,[r0,#8]
vstr s0,[r0,#12]
vstmia r1,{s0-s1}
add r1,r0,#36
vstr s0,[r0,#24]
vstr s0,[r0,#28]
vstr s0,[r0,#32]
vstmia r1,{s0-s1}
vstr s0,[r0,#44]
ldr r0,.Lmatrix_guard_0017A4A8
mov r0,r0
.Lloc_17A510:
ldr r0,.Lmatrix_state_0017A4A8
pop {r4,pc}
END func_0017A4A8
.Lmatrix_guard_0017A4A8:
.word ipc_controller_matrix_guard_82
.Lunit_0017A4A8:
.word ipc_unit_scalar_54
.Lzero_0017A4A8:
.word service_zero_scalar_51
.Lmatrix_state_0017A4A8:
.word ipc_controller_matrix_state_82

BEGIN func_0017A528
ldr r0,.Lmatrix_guard_0017A528
push {r4,lr}
ldr r0,[r0]
tst r0,#1
bne .Lloc_17A5A0
ldr r0,.Lmatrix_guard_0017A528
blx func_00302F52
cmp r0,#0
beq .Lloc_17A5A0
ldr r0,.Lmatrix_state_0017A528
vldr s1,.Lunit_0017A528
vldr s0,.Lzero_0017A528
add r1,r0,#16
vstr s1,[r0]
vstr s0,[r0,#4]
vstr s0,[r0,#8]
vstr s0,[r0,#12]
vstmia r1,{s0-s1}
add r1,r0,#36
vstr s0,[r0,#24]
vstr s0,[r0,#28]
vstr s0,[r0,#32]
vstmia r1,{s0-s1}
vstr s0,[r0,#44]
vstr s0,[r0,#48]
vstr s0,[r0,#52]
add r0,r0,#56
vstmia r0,{s0-s1}
ldr r0,.Lmatrix_guard_0017A528
mov r0,r0
.Lloc_17A5A0:
ldr r0,.Lmatrix_state_0017A528
pop {r4,pc}
END func_0017A528
.Lmatrix_guard_0017A528:
.word ipc_controller_extended_matrix_guard_82
.Lunit_0017A528:
.word ipc_unit_scalar_54
.Lzero_0017A528:
.word service_zero_scalar_51
.Lmatrix_state_0017A528:
.word ipc_controller_extended_matrix_state_82
```

## Implementation and validation contract

Implement this artifact in `src/main/arm_ipc_wrappers_82.S` without access to
the private target, disassembly, report, symbol inventory, probe products, or
other authored implementation sources. Assemble as ARMv6K with VFPv2 enabled.
The implementation must export exactly the five named function symbols with
the declared executable sizes, own exactly the ten adjacent words, emit the
five specified call relocations and ten literal relocations, and emit no other
relocation or material.

Validation must compare every selected executable body and owned adjacent word
against the authoritative target, verify section/symbol/relocation structure,
confirm all five local branches and five return sites, enforce literal position
and equality classes, and reject foreign ownership. Both manifest hash fields
record the independently materialized implementation source.
