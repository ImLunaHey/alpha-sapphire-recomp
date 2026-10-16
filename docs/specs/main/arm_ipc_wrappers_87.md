# Probe-verified ARM service helpers 87

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Evidence: the authoritative unmatched-function report, neutral global-symbol
  inventory, recursive public ownership manifests, bounded private-target
  control/data-flow inspection, physical literal equality analysis,
  mode-aware direct-transfer resolution, whole-text ARM entry auditing, and
  isolated GNU Arm schedule probes.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.
- Implementation source SHA-256: `8b8f66b00cdd0163b8b6d452a25f2e1eec79b1c982795767f24a3e092a24bc95`.
- Normalized normative-schedule SHA-256: `39dccd77f98d66adb751b5d97484ebb6757870ed7336ba88d81986b6566bca13`.

This batch covers five still-unmatched ARM ownership, channel teardown, flag,
and transfer helpers in the service/controller neighborhood following IPC86.
Their executable bodies total exactly 768 bytes (192 instructions). Selection
was collision-audited against every current config, including runtime,
duplicate, template, Thumb, and IPC cohorts. None is already owned as a
configured primary body, alias, secondary entry, literal code entry, or
material owner. Earlier public references to selected official entries are
external identity references only.

The immediately preceding `func_0017F448` is deliberately excluded because it
directly addresses text-like post-body material. The large intervening
`func_0017F584` is also deferred; neither its body nor its mixed neighboring
material is claimed here. Unnamed code and data between the selected global
boundaries are excluded unless a selected body reaches the exact word as a
literal slot.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_0017F4A4` | `.text.func_0017F4A4` | 144 | `func_0017F584` at +224 | Replace one owned variable-length member with a deep copy of another, invoking its release callback when present and returning the destination owner. |
| `func_0017FB04` | `.text.func_0017FB04` | 200 | `func_0017FBE4` at +224 | Tear down an active channel record through backend zero, preserve its current selector state when required, and clear the record fields. |
| `func_0017FBE4` | `.text.func_0017FBE4` | 200 | `func_0017FEEC` at +776 | Perform the paired channel teardown through backend one, preserve its current selector state when required, and clear the record fields. |
| `func_0017FEEC` | `.text.func_0017FEEC` | 32 | `func_0017FFB8` at +204 | Set or clear the second status bit and tail-apply the resulting byte to the associated service member. |
| `func_0017FFB8` | `.text.func_0017FFB8` | 192 | `func_0018007C` at +196 | When the controller predicate succeeds, select a destination record, copy three fixed halfword groups into it, mark it pending, and report success. |

Only three reached post-body words are owned: one after each teardown body and
one after the transfer body. `func_0017F4A4` and `func_0017FEEC` own no
adjacent word. In particular, bytes +144 through +223 after `func_0017F4A4`,
bytes +204 through +223 after `func_0017FB04`, bytes +204 through +775 after
`func_0017FBE4`, and bytes +32 through +203 after `func_0017FEEC` remain
unowned. The batch therefore owns exactly 768 executable bytes and 12 adjacent
literal bytes, with no private string, asset, padding, unnamed helper, or
unrelated material.

All five authoritative report entries lack `fuzzy_match_percent`, and their
reported sizes agree with the neutral inventory. Every complete body byte
string is unique among current global ARM bodies. A mode-aware whole-text
direct-transfer scan found 51 transfers from outside the selected bodies to
selected official entries and none into a selected interior.

## Literal positional and equality contract

There are exactly three physical literal slots in two semantic identity
classes. Both classes reuse previously established public identities, so this
batch introduces no new class and no private value is normative.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_0017FB04` | +200 | +132 | `arm_duplicate_templates_19_byte_window_state` | Reused from duplicate-template batch 19. |
| `func_0017FBE4` | +200 | +132 | `arm_duplicate_templates_19_byte_window_state` | Same reused class as the preceding slot. |
| `func_0017FFB8` | +192 | +28 | `ipc_controller_selector_offset_77` | Reused from IPC77. |

Private physical-equality checks prove that the two teardown slots equal both
duplicate-template-19 `byteWindowState` slots. The transfer slot equals the
IPC77 selector slot and every later public reuse of that class. The two classes
are distinct. Starting from the IPC86 totals of 844 physical slots in 444
classes, this batch advances the cumulative totals to exactly 847 slots while
remaining at 444 classes.

## Direct-transfer and entry contract

There are exactly fourteen symbolic direct-transfer relocations: thirteen
unconditional calls using `R_ARM_CALL` and one unconditional tail using
`R_ARM_JUMP24`. Two calls use the `blx` mnemonic and target Thumb primary
entries; every other primary destination is ARM. The tail targets one ARM
secondary entry 32 bytes inside `func_001873D8`. All ten destination identity
classes are pairwise distinct.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0017F4A4` | +64 | `R_ARM_CALL` | `bl` | `func_00302108` |
| `func_0017F4A4` | +92 | `R_ARM_CALL` | `blx` | `func_001003E8` |
| `func_0017F4A4` | +108 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0017F4A4` | +132 | `R_ARM_CALL` | `blx` | `func_001003CC` |
| `func_0017FB04` | +96 | `R_ARM_CALL` | `bl` | `func_00186EB8` |
| `func_0017FB04` | +108 | `R_ARM_CALL` | `bl` | `func_0018C238` |
| `func_0017FB04` | +148 | `R_ARM_CALL` | `bl` | `func_00186EB8` |
| `func_0017FB04` | +160 | `R_ARM_CALL` | `bl` | `func_00186EC4` |
| `func_0017FBE4` | +96 | `R_ARM_CALL` | `bl` | `func_00186EB8` |
| `func_0017FBE4` | +108 | `R_ARM_CALL` | `bl` | `func_0018C2D4` |
| `func_0017FBE4` | +148 | `R_ARM_CALL` | `bl` | `func_00186EB8` |
| `func_0017FBE4` | +160 | `R_ARM_CALL` | `bl` | `func_00186EC4` |
| `func_0017FEEC` | +28 | `R_ARM_JUMP24` | `b` | `service_flag_apply_secondary_87` |
| `func_0017FFB8` | +16 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |

`service_flag_apply_secondary_87` is at owner offset +32 in the 52-byte ARM
body `func_001873D8`; 44 bytes remain before `func_00187424`. It is not a
global primary entry and must not be silently retargeted to its owner. The
selected bodies additionally contain nineteen local direct branches, one
register-indirect call, four stack-return sites, and one external tail site.
No other direct transfer escapes a selected body.

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

.global func_00302108
.global func_001003E8
.global func_00184990
.global func_001003CC
.global func_00186EB8
.global func_0018C238
.global func_00186EC4
.global func_0018C2D4
.global service_flag_apply_secondary_87
.global func_0017E4D8
.global arm_duplicate_templates_19_byte_window_state
.global ipc_controller_selector_offset_77

BEGIN func_0017F4A4
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
ldr r0,[r0,#4]
ldr r1,[r1,#4]
cmp r0,r1
beq .Lreturn_0017F4A4
cmp r0,#0
subsne r0,r0,#4
beq .Lrelease_done_0017F4A4
ldr r1,[r0,#-8]!
cmp r1,#0
beq .Lmissing_release_0017F4A4
blx r1
b .Lrelease_done_0017F4A4
.Lmissing_release_0017F4A4:
nop
bl func_00302108
.Lrelease_done_0017F4A4:
ldr r6,[r5,#4]
cmp r6,#0
moveq r0,#0
streq r0,[r4,#4]
beq .Lreturn_0017F4A4
mov r0,r6
blx func_001003E8
add r5,r0,#1
mov r0,#4
add r0,r0,r5,lsl #1
bl func_00184990
mov r1,r0
add r0,r0,#4
str r5,[r1]
mov r1,r6
str r0,[r4,#4]
blx func_001003CC
.Lreturn_0017F4A4:
mov r0,r4
pop {r4,r5,r6,pc}
END func_0017F4A4

BEGIN func_0017FB04
push {r4,r5,r6,r7,lr}
mov r5,r0
sub sp,sp,#20
ldrb r0,[r0,#12]
cmp r0,#0
beq .Lreturn_0017FB04
ldrsb r0,[r5,#13]
mov r4,r5
cmp r0,#0
cmpne r0,#1
bne .Lclear_0017FB04
cmp r0,#0
cmpne r0,#1
mov r6,#0
bne .Lfinalize_0017FB04
ldr r0,[r4]
cmp r0,#0
ldrne r0,[r4,#8]
cmpne r0,#0
beq .Lfinalize_0017FB04
mov r0,#1
strh r6,[sp,#2]
strh r0,[sp]
ldrsb r7,[r4,#13]
bl func_00186EB8
mov r2,sp
mov r1,r7
bl func_0018C238
bics r0,r6,r0
strbeq r6,[r4,#14]
ldrb r0,[r4,#14]
cmp r0,#0
bne .Lfinalize_0017FB04
ldr r0,.Lwindow_state_0017FB04
ldrb r1,[r0,#25]
strb r1,[r4,#15]
.Lfinalize_0017FB04:
ldrsb r6,[r4,#13]
bl func_00186EB8
mov r2,r6
mov r1,#0
bl func_00186EC4
mov r0,#255
strb r0,[r4,#13]
.Lclear_0017FB04:
mov r0,#0
str r0,[r5]
str r0,[r5,#4]
str r0,[r5,#8]
strb r0,[r5,#12]
.Lreturn_0017FB04:
add sp,sp,#20
pop {r4,r5,r6,r7,pc}
END func_0017FB04
.Lwindow_state_0017FB04:
.word arm_duplicate_templates_19_byte_window_state

BEGIN func_0017FBE4
push {r4,r5,r6,r7,lr}
mov r5,r0
sub sp,sp,#52
ldrb r0,[r0,#12]
cmp r0,#0
beq .Lreturn_0017FBE4
ldrsb r0,[r5,#13]
mov r4,r5
cmp r0,#0
cmpne r0,#1
bne .Lclear_0017FBE4
cmp r0,#0
cmpne r0,#1
mov r6,#0
bne .Lfinalize_0017FBE4
ldr r0,[r4]
cmp r0,#0
ldrne r0,[r4,#8]
cmpne r0,#0
beq .Lfinalize_0017FBE4
mov r0,#1
strh r6,[sp,#2]
strh r0,[sp]
ldrsb r7,[r4,#13]
bl func_00186EB8
mov r2,sp
mov r1,r7
bl func_0018C2D4
bics r0,r6,r0
strbeq r6,[r4,#14]
ldrb r0,[r4,#14]
cmp r0,#0
bne .Lfinalize_0017FBE4
ldr r0,.Lwindow_state_0017FBE4
ldrb r1,[r0,#25]
strb r1,[r4,#15]
.Lfinalize_0017FBE4:
ldrsb r6,[r4,#13]
bl func_00186EB8
mov r2,r6
mov r1,#1
bl func_00186EC4
mov r0,#255
strb r0,[r4,#13]
.Lclear_0017FBE4:
mov r0,#0
str r0,[r5]
str r0,[r5,#4]
str r0,[r5,#8]
strb r0,[r5,#12]
.Lreturn_0017FBE4:
add sp,sp,#52
pop {r4,r5,r6,r7,pc}
END func_0017FBE4
.Lwindow_state_0017FBE4:
.word arm_duplicate_templates_19_byte_window_state

BEGIN func_0017FEEC
cmp r1,#0
ldrb r1,[r0,#7]
orrne r1,r1,#2
biceq r1,r1,#2
strb r1,[r0,#7]
ldr r0,[r0,#104]
and r1,r1,#255
b service_flag_apply_secondary_87
END func_0017FEEC

BEGIN func_0017FFB8
push {r4,r5,r6,lr}
mov r5,r0
mov r6,r1
mov r4,r2
bl func_0017E4D8
cmp r0,#0
beq .Lreturn_0017FFB8
ldr r0,.Lselector_offset_0017FFB8
mov r3,#4
ldrh r0,[r0,r5]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r5,r0,lsl #5
add r0,r0,r6,lsl #2
add r0,r0,#4096
ldr r12,[r0,#176]
sub r0,r4,#2
add r2,r12,#4
add r1,r12,#2
.Lcopy_first_0017FFB8:
ldrh r14,[r0,#2]
subs r3,r3,#1
strh r14,[r1,#2]
ldrh r14,[r0,#4]!
strh r14,[r1,#4]!
bne .Lcopy_first_0017FFB8
add r0,r4,#14
add r1,r2,#14
mov r3,#4
.Lcopy_second_0017FFB8:
ldrh r14,[r0,#2]
subs r3,r3,#1
strh r14,[r1,#2]
ldrh r14,[r0,#4]!
strh r14,[r1,#4]!
bne .Lcopy_second_0017FFB8
add r1,r2,#30
add r0,r4,#30
mov r2,#4
.Lcopy_third_0017FFB8:
ldrh r3,[r0,#2]
subs r2,r2,#1
strh r3,[r1,#2]
ldrh r3,[r0,#4]!
strh r3,[r1,#4]!
bne .Lcopy_third_0017FFB8
ldr r0,[r12]
orr r0,r0,#234881024
str r0,[r12]
mov r0,#1
.Lreturn_0017FFB8:
pop {r4,r5,r6,pc}
END func_0017FFB8
.Lselector_offset_0017FFB8:
.word ipc_controller_selector_offset_77
```

## Required validator contract

The isolated implementation validator must fail closed and check all of the
following:

1. Parse only a regular file of at most 64 MiB, with at most 16 MiB in any
   section, at most 16,384 sections, at most 1,000,000 symbols, and at most
   1,000,000 relocations. Reject malformed ELF, duplicate or missing configured
   sections, duplicate global definitions, executable `NOBITS`, and unexpected
   executable sections or mapping-symbol states.
2. Require exactly five configured ARM sections and exactly one global
   `STT_FUNC` definition at offset zero in each. Require body sizes 144, 200,
   200, 32, and 192 bytes and full section sizes 144, 204, 204, 32, and 196
   bytes. Do not absorb any excluded inter-global material.
3. Require exactly fourteen branch relocations at the configured body offsets,
   with the configured `R_ARM_CALL`/`R_ARM_JUMP24` kinds, symbols, ARM/Thumb
   destination modes, and `bl`/`blx`/`b` mnemonic forms. Require exactly three
   `R_ARM_ABS32` pool relocations at the configured adjacent offsets and reject
   any additional relocation.
4. Check the complete instruction schedule, all nineteen local branch
   destinations, the register-indirect call, four returns, external tail,
   literal-load sites, pool placement, and the ARM mapping-symbol contract.
   Reject any interior `$d` state in an executable body.
5. Prove that the two teardown slots are equal to each other and to the
   established duplicate-template-19 byte-window class, and that the transfer
   slot uses the distinct established IPC77 selector class. Never make a
   private literal value normative.
6. Prove the secondary-entry relation at owner offset +32, preserve its ARM
   mode, and prove it is distinct from all nine primary destinations. Reject
   aliases, owner-entry substitution, wrong-mode calls, and any unlisted
   transfer target.
7. Recompute total body size 768, adjacent size 12, physical slots 3, identity
   classes 2, new classes 0, branch relocations 14, local branches 19,
   indirect calls 1, return sites 4, and external tails 1 from parsed evidence
   rather than trusting manifest totals.
8. Enforce source and normalized-schedule hashes after the implementer replaces
   both `PENDING` fields. The source path must remain exactly
   `src/main/arm_ipc_wrappers_87.S` and must stay inside the repository.
9. Include deterministic positive and hostile self-tests, including a valid
   composite with more than 12,000 sections and mutations of a body
   instruction, local branch, indirect call, every branch relocation field,
   every pool relocation field, literal identity equality, secondary-entry
   relation and mode, section size, function symbol, and mapping-symbol state.
