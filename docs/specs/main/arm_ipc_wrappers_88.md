# Probe-verified ARM service helpers 88

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
- Implementation source SHA-256: `8c18622b775980a8b065beef87ff281f204f468ebcbce082984100865671ee59`.
- Normalized normative-schedule SHA-256: `c3480b7012ccbc72aa885ab885135b205d04c79045ab9fd9376279321a5588ab`.

This batch covers the next five still-unmatched ARM state, curve, exponent,
and lookup helpers after IPC87. The intervening `func_0018007C` is excluded
because runtime batch 71 already owns and exactly matches it. The selected
executable bodies total exactly 756 bytes (189 instructions). A repository-wide
ownership scan found none of the five names or any selected interior already
owned as a configured primary body, alias, secondary entry, literal code
entry, or material owner.

The anonymous state-machine code between the first selected body and
`func_001803E0`, and the two anonymous reset helpers between `func_001803E0`
and `func_0018043C`, remain unowned. Only literal words reached by a selected
body are included. No text-like material, string, asset, jump table, padding,
or unrelated unnamed helper is part of this batch.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_001801CC` | `.text.func_001801CC` | 248 | `func_001803E0` at +532 | Store an optional service record, then obtain and publish up to two derived attributes through a shared query/open sequence. |
| `func_001803E0` | `.text.func_001803E0` | 40 | `func_0018043C` at +92 | Initialize a compact scalar state record with its baseline, initial limit, empty owner, enabled marker, and cleared flags. |
| `func_0018043C` | `.text.func_0018043C` | 124 | `func_001804D4` at +152 | Clamp a scalar to a bounded domain and map its interior interval through a halfword curve table, with fixed endpoint results. |
| `func_001804D4` | `.text.func_001804D4` | 272 | `func_00180600` at +300 | Decompose a signed fixed-point exponent into coarse and fine components and evaluate it with squaring plus two lookup tables. |
| `func_00180600` | `.text.func_00180600` | 72 | `func_00180658` at +88 | Clamp an angle-like scalar, quantize its table index, and return the corresponding lookup value. |

The first body owns three reached words at offsets +248, +252, and +256;
offsets +260 through +531 remain excluded. The second body owns two reached
words at +40 and +44; offsets +48 through +91 remain excluded. The remaining
three bodies own their complete contiguous reached pools of 28, 28, and 16
bytes respectively. The batch therefore owns exactly 756 executable bytes and
92 adjacent literal bytes.

All five authoritative report entries lack `fuzzy_match_percent`; their
reported sizes and modes agree with the neutral inventory. Each complete body
byte string is unique among all global ARM bodies. A mode-aware whole-text
direct-transfer audit found eight transfers from outside the selected bodies
to selected official entries and none into a selected interior. Those entry
references do not expand ownership.

## Literal positional and equality contract

There are exactly 23 physical literal slots in twenty semantic identity
classes. Four classes reuse established public identities; sixteen classes are
new. The identities are normative, while their private words are not.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_001801CC` | +248 | +52 | `service_record_domain_88` | New. |
| `func_001801CC` | +252 | +68 | `service_record_attribute_88` | New. |
| `func_001801CC` | +256 | +152 | `service_record_fallback_domain_88` | New. |
| `func_001803E0` | +40 | +0 | `service_zero_scalar_51` | Reused from IPC51. |
| `func_001803E0` | +44 | +4 | `service_state_initial_limit_88` | New. |
| `func_0018043C` | +124 | +8 | `service_curve_lower_threshold_88` | New. |
| `func_0018043C` | +128 | +0 | `ipc_unit_scalar_54` | Reused from IPC54. |
| `func_0018043C` | +132 | +4 | `service_zero_scalar_51` | Reused from IPC51. |
| `func_0018043C` | +136 | +64 | `service_curve_upper_threshold_88` | New. |
| `func_0018043C` | +140 | +88 | `service_curve_lower_threshold_88` | Same new class as +124. |
| `func_0018043C` | +144 | +92 | `service_curve_index_scale_88` | New. |
| `func_0018043C` | +148 | +84 | `service_curve_halfword_table_88` | New. |
| `func_001804D4` | +272 | +0 | `service_exponent_period_limit_88` | New. |
| `func_001804D4` | +276 | +4 | `service_exponent_signed_reciprocal_88` | New. |
| `func_001804D4` | +280 | +100 | `ipc_unit_scalar_54` | Reused from IPC54. |
| `func_001804D4` | +284 | +136 | `ipc_upper_clamp_74` | Reused from IPC74. |
| `func_001804D4` | +288 | +176 | `arm_duplicate_templates_17_scale_b` | Reused from duplicate-template 17. |
| `func_001804D4` | +292 | +228 | `service_exponent_coarse_table_88` | New. |
| `func_001804D4` | +296 | +252 | `service_exponent_fine_table_88` | New. |
| `func_00180600` | +72 | +0 | `service_angle_upper_limit_88` | New. |
| `func_00180600` | +76 | +4 | `service_angle_lower_limit_88` | New. |
| `func_00180600` | +80 | +36 | `service_angle_index_scale_88` | New. |
| `func_00180600` | +84 | +40 | `service_angle_lookup_table_88` | New. |

Private equality checks prove the repeated lower-threshold slots equal each
other; the two zero slots equal every prior `service_zero_scalar_51` slot; and
the unit, upper-clamp, and half-scale slots equal their named established
classes. All sixteen new classes are pairwise distinct and distinct from the
four reused classes. The table identities resolve into bounded non-text data
regions; none addresses a string or asset. Starting from IPC87's 847 physical
slots in 444 classes, this batch adds 23 slots and sixteen classes, yielding
exact cumulative totals of 870 slots and 460 classes.

## Direct-transfer and entry contract

There are exactly eight symbolic direct-transfer relocations, all
unconditional ARM `bl` calls using `R_ARM_CALL`. All four destination classes
are ARM primary entries, pairwise distinct, and aligned to four bytes. There
is no Thumb destination, secondary entry, external tail, or register-indirect
call.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_001801CC` | +64 | `R_ARM_CALL` | `bl` | `func_00188548` |
| `func_001801CC` | +104 | `R_ARM_CALL` | `bl` | `func_00188644` |
| `func_001801CC` | +116 | `R_ARM_CALL` | `bl` | `func_001824D4` |
| `func_001801CC` | +132 | `R_ARM_CALL` | `bl` | `func_00188728` |
| `func_001801CC` | +168 | `R_ARM_CALL` | `bl` | `func_00188644` |
| `func_001801CC` | +200 | `R_ARM_CALL` | `bl` | `func_00188644` |
| `func_001801CC` | +212 | `R_ARM_CALL` | `bl` | `func_001824D4` |
| `func_001801CC` | +228 | `R_ARM_CALL` | `bl` | `func_00188728` |

The bodies additionally contain twenty local direct branches and seven return
sites. No other direct transfer escapes a selected body.

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

.global func_00188548
.global func_00188644
.global func_001824D4
.global func_00188728
.global service_record_domain_88
.global service_record_attribute_88
.global service_record_fallback_domain_88
.global service_zero_scalar_51
.global service_state_initial_limit_88
.global service_curve_lower_threshold_88
.global ipc_unit_scalar_54
.global service_curve_upper_threshold_88
.global service_curve_index_scale_88
.global service_curve_halfword_table_88
.global service_exponent_period_limit_88
.global service_exponent_signed_reciprocal_88
.global ipc_upper_clamp_74
.global arm_duplicate_templates_17_scale_b
.global service_exponent_coarse_table_88
.global service_exponent_fine_table_88
.global service_angle_upper_limit_88
.global service_angle_lower_limit_88
.global service_angle_index_scale_88
.global service_angle_lookup_table_88

BEGIN func_001801CC
cmp r1,#0
mov r3,r1
str r1,[r0]
beq .Lempty_001801CC
add r2,r0,#24
add r1,r0,#20
mov r0,r3
b .Lquery_001801CC
.Lempty_001801CC:
bx lr
.Lquery_001801CC:
push {r4,r5,r6,r7,r8,r9,lr}
mov r5,r1
mov r1,r0
sub sp,sp,#12
ldr r7,.Ldomain_001801CC
mov r4,r2
mov r0,r7
bl func_00188548
ldr r8,.Lattribute_001801CC
cmp r5,#0
sub r9,r7,#111
orr r6,r7,r7,asr #15
beq .Lsecond_001801CC
mov r3,sp
mov r2,r9
sub r1,r6,#97
mov r0,r7
bl func_00188644
ldr r1,[sp]
mov r0,r6
bl func_001824D4
add r2,sp,#4
mov r1,r8
mov r0,r6
bl func_00188728
ldr r0,[sp,#4]
str r0,[r5]
.Lsecond_001801CC:
cmp r4,#0
beq .Ldone_001801CC
ldr r2,.Lfallback_domain_001801CC
mov r3,sp
mov r1,#36096
mov r0,r7
bl func_00188644
ldr r0,[sp]
cmp r0,#0
beq .Lstore_second_001801CC
add r3,sp,#4
mov r2,r9
mov r1,#36096
mov r0,r7
bl func_00188644
ldr r1,[sp,#4]
mov r0,r6
bl func_001824D4
add r2,sp,#8
mov r1,r8
mov r0,r6
bl func_00188728
ldr r0,[sp,#8]
.Lstore_second_001801CC:
str r0,[r4]
.Ldone_001801CC:
add sp,sp,#12
pop {r4,r5,r6,r7,r8,r9,pc}
END func_001801CC
.Ldomain_001801CC:
.word service_record_domain_88
.Lattribute_001801CC:
.word service_record_attribute_88
.Lfallback_domain_001801CC:
.word service_record_fallback_domain_88

BEGIN func_001803E0
vldr s0,.Lzero_001803E0
vldr s1,.Linitial_limit_001803E0
mov r1,#0
vstmia r0,{s0-s1}
mov r2,#1
str r1,[r0,#8]
strb r2,[r0,#12]
strb r1,[r0,#13]
strb r1,[r0,#14]
bx lr
END func_001803E0
.Lzero_001803E0:
.word service_zero_scalar_51
.Linitial_limit_001803E0:
.word service_state_initial_limit_88

BEGIN func_0018043C
vldr s1,.Lunit_0018043C
vldr s2,.Lzero_0018043C
ldr r1,.Llower_bits_0018043C
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovgt.f32 s0,s1
bgt .Lupper_endpoint_0018043C
vmov.f32 s1,s0
vcmpe.f32 s1,s2
vmrs APSR_nzcv,fpscr
bcc .Llower_endpoint_0018043C
vmov r0,s0
cmp r0,r1
bge .Lupper_endpoint_0018043C
.Llower_endpoint_0018043C:
mov r0,#80
.Llower_return_0018043C:
bx lr
.Lupper_endpoint_0018043C:
ldr r1,.Lupper_bits_0018043C
vmov r0,s0
cmp r1,r0
movle r0,#16000
ble .Llower_return_0018043C
ldr r1,.Lcurve_table_0018043C
vldr s1,.Llower_scalar_0018043C
vldr s2,.Lindex_scale_0018043C
vsub.f32 s0,s0,s1
vmul.f32 s0,s0,s2
vcvt.s32.f32 s0,s0
vmov r0,s0
add r0,r1,r0,lsl #1
ldrh r0,[r0]
.Lreturn_0018043C:
bx lr
END func_0018043C
.Llower_bits_0018043C:
.word service_curve_lower_threshold_88
.Lunit_0018043C:
.word ipc_unit_scalar_54
.Lzero_0018043C:
.word service_zero_scalar_51
.Lupper_bits_0018043C:
.word service_curve_upper_threshold_88
.Llower_scalar_0018043C:
.word service_curve_lower_threshold_88
.Lindex_scale_0018043C:
.word service_curve_index_scale_88
.Lcurve_table_0018043C:
.word service_curve_halfword_table_88

BEGIN func_001804D4
ldr r3,.Lperiod_limit_001804D4
ldr r2,.Lsigned_reciprocal_001804D4
mov r1,#0
sub r3,r3,r0
cmp r3,#3072
blt .Lreduce_negative_001804D4
smull r3,r1,r2,r3
asr r3,r1,#9
sub r1,r3,r1,asr #31
add r3,r1,r1,lsl #1
rsb r1,r1,#0
add r0,r0,r3,lsl #10
.Lreduce_negative_001804D4:
rsb r3,r0,#0
smull r12,r3,r2,r3
asr r12,r3,#9
sub r3,r12,r3,asr #31
rsb r3,r3,#0
cmp r3,#0
ble .Lsplit_fraction_001804D4
smull r3,r2,r2,r0
asr r3,r2,#9
sub r2,r3,r2,asr #31
add r1,r1,r2
sub r3,r2,r2,lsl #2
add r0,r0,r3,lsl #10
.Lsplit_fraction_001804D4:
vldr s0,.Lunit_001804D4
asr r2,r0,#31
cmp r1,#0
add r2,r0,r2,lsr #24
asr r2,r2,#8
rsb r3,r2,#0
add r3,r0,r3,lsl #8
ble .Lnegative_power_001804D4
tst r1,#1
vldr s1,.Ldouble_001804D4
vmovne.f32 s0,s1
asrs r0,r1,#1
beq .Lclear_power_001804D4
.Lpositive_loop_001804D4:
subs r0,r0,#1
vmul.f32 s0,s0,s1
vmul.f32 s0,s0,s1
bne .Lpositive_loop_001804D4
.Lclear_power_001804D4:
sub r1,r1,r1
.Lnegative_power_001804D4:
rsb r0,r1,#0
vldr s1,.Lhalf_001804D4
cmp r0,#0
ble .Lcoarse_lookup_001804D4
tst r1,#1
vmulne.f32 s0,s0,s1
asrs r0,r0,#1
beq .Lcoarse_lookup_001804D4
.Lnegative_loop_001804D4:
subs r0,r0,#1
vmul.f32 s0,s0,s1
vmul.f32 s0,s0,s1
bne .Lnegative_loop_001804D4
.Lcoarse_lookup_001804D4:
cmp r2,#0
beq .Lfine_lookup_001804D4
ldr r0,.Lcoarse_table_001804D4
add r0,r0,r2,lsl #2
vldr s1,[r0]
vmul.f32 s0,s1,s0
.Lfine_lookup_001804D4:
cmp r3,#0
beq .Lreturn_001804D4
ldr r0,.Lfine_table_001804D4
add r0,r0,r3,lsl #2
vldr s1,[r0]
vmul.f32 s0,s1,s0
.Lreturn_001804D4:
bx lr
END func_001804D4
.Lperiod_limit_001804D4:
.word service_exponent_period_limit_88
.Lsigned_reciprocal_001804D4:
.word service_exponent_signed_reciprocal_88
.Lunit_001804D4:
.word ipc_unit_scalar_54
.Ldouble_001804D4:
.word ipc_upper_clamp_74
.Lhalf_001804D4:
.word arm_duplicate_templates_17_scale_b
.Lcoarse_table_001804D4:
.word service_exponent_coarse_table_88
.Lfine_table_001804D4:
.word service_exponent_fine_table_88

BEGIN func_00180600
vldr s2,.Lupper_00180600
vldr s1,.Llower_00180600
vcmpe.f32 s0,s2
vmrs APSR_nzcv,fpscr
vmovgt.f32 s0,s2
bgt .Lquantize_00180600
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
.Lquantize_00180600:
vldr s1,.Lscale_00180600
ldr r1,.Ltable_00180600
vmul.f32 s0,s0,s1
vcvt.s32.f32 s0,s0
vmov r0,s0
add r0,r0,#904
add r0,r1,r0,lsl #2
vldr s0,[r0]
bx lr
END func_00180600
.Lupper_00180600:
.word service_angle_upper_limit_88
.Llower_00180600:
.word service_angle_lower_limit_88
.Lscale_00180600:
.word service_angle_index_scale_88
.Ltable_00180600:
.word service_angle_lookup_table_88
```

## Required validator contract

The isolated implementation validator must fail closed and check all of the
following:

1. Parse only a regular file of at most 64 MiB, with at most 16 MiB in any
   section, at most 16,384 sections, at most 1,000,000 symbols, and at most
   1,000,000 relocations. Reject malformed ELF, duplicate or missing configured
   sections, duplicate global definitions, executable `NOBITS`, unexpected
   executable sections, and unexpected mapping-symbol states.
2. Require exactly five configured ARM sections and one global `STT_FUNC`
   definition at offset zero in each. Require body sizes 248, 40, 124, 272,
   and 72 bytes and full section sizes 260, 48, 152, 300, and 88 bytes. Do not
   absorb either excluded anonymous-code interval.
3. Require exactly eight `R_ARM_CALL` relocations at the configured body
   offsets and exactly 23 `R_ARM_ABS32` relocations at the configured pool
   offsets. Require every call to use ARM `bl`, preserve all repeated target
   identities, and reject any additional relocation.
4. Check the complete instruction schedule, all twenty local branch targets,
   seven returns, every literal-load site, exact pool placement, and the ARM
   mapping-symbol contract. Reject an interior `$d` state in an executable
   body or an executable mapping state in an owned pool.
5. Prove the repeated lower-threshold equality, every stated prior-identity
   reuse, pairwise distinction of all sixteen new identities, and the exact
   23-slot/20-class bijection. Never make a private literal value normative.
6. Prove all four branch identities are distinct ARM primary entries. Reject
   aliases, secondary-entry substitution, wrong-mode calls, interior-entry
   retargeting, and any unlisted transfer target.
7. Recompute total body size 756, adjacent size 92, physical slots 23,
   identity classes 20, reused classes 4, new classes 16, branch relocations
   8, local branches 20, indirect calls 0, return sites 7, and external tails
   0 from parsed evidence rather than trusting manifest totals.
8. Enforce source and normalized-schedule hashes after the implementer replaces
   both `PENDING` fields. The source path must remain exactly
   `src/main/arm_ipc_wrappers_88.S` and must stay inside the repository.
9. Include deterministic positive and hostile self-tests, including a valid
   composite with more than 12,000 sections and mutations of a body
   instruction, local branch, every call relocation field, every pool
   relocation field, repeated/reused/new literal equality, section size,
   function symbol, and mapping-symbol state.
