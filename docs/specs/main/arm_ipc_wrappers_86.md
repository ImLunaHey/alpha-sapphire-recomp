# Probe-verified ARM service helpers 86

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function report, neutral global-symbol
  inventory, bounded private-target control/data-flow inspection, physical
  literal equality analysis, direct-transfer resolution, whole-text ARM entry
  auditing, and isolated GNU Arm schedule probes.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.
- Implementation source SHA-256:
  `4163763ad1730df836d3de4327f32315938c59b1ac512d9d30cbe714d3634225`.
- Normalized normative-schedule SHA-256:
  `c46dddd5babc34919067cb07421d8226061ef6440b45fad32512c19ffb28353d`.

This batch covers four still-unmatched ARM linked-node, query, context lookup,
and lazy-initialization helpers from the service/controller neighborhood that
follows IPC85. Their executable bodies total exactly 856 bytes (214
instructions). Selection was collision-audited against every current config,
including runtime, duplicate, template, and IPC cohorts. None is already owned
as a configured primary body, alias, secondary entry, literal code entry, or
material owner. Existing references to selected official entries establish
only their external identities.

`func_0017EF74`, between the second and third selected functions, is
deliberately excluded: it directly addresses text-like adjacent material,
which is outside this batch's clean-room public surface. Its body, pool, and
post-body material remain wholly unowned by this specification.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_0017ECB0` | `.text.func_0017ECB0` | 148 | `func_0017ED4C` at +156 | Initialize a linked service node and, when the allocator-backed owner is active, append it to the owner's list under the established synchronization pair. |
| `func_0017ED4C` | `.text.func_0017ED4C` | 544 | `func_0017EF74` at +552 | Traverse service records, identify records matching the requested keys, dispatch the query operation, advance through the ordered structure, and release temporary results. |
| `func_0017F0D8` | `.text.func_0017F0D8` | 60 | `func_0017F11C` at +68 | Resolve the current service context through the allocator-backed registry and return its stored payload when present. |
| `func_0017F11C` | `.text.func_0017F11C` | 104 | `func_0017F188` at +108 | Initialize the service subsystem, lazily allocate or retain the shared runtime singleton, and tail-publish its registration identity. |

Each selected body owns every reached word between its executable end and the
following global, and no other adjacent material. The respective reached pools
are 8, 8, 8, and 4 bytes. Thus the batch owns exactly 856 executable bytes and
28 adjacent literal bytes, with no private string, asset, padding, unnamed
helper, or unrelated material.

All four authoritative report entries lack `fuzzy_match_percent`, and their
reported sizes agree with the neutral inventory. Every complete body byte
string is unique among current global ARM bodies. A whole-text ARM
direct-transfer scan found 328 transfers from outside the selected bodies to
selected official entries and none into a selected interior.

## Literal positional and equality contract

There are exactly seven physical literal slots in six pairwise-distinct
semantic identity classes. Two classes reuse identities established by IPC68
and IPC71; the other four classes are new. No private value is normative.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_0017ECB0` | +148 | +12 | `service_linked_node_vtable_86` | New singleton class. |
| `func_0017ECB0` | +152 | +20 | `ipc_allocator_dispatch_owner_68` | Reused from IPC68. |
| `func_0017ED4C` | +544 | +36 | `service_query_flags_86` | New singleton class. |
| `func_0017ED4C` | +548 | +40 | `service_query_context_86` | New singleton class. |
| `func_0017F0D8` | +60 | +0 | `ipc_allocator_dispatch_owner_68` | Reused from IPC68 and equal to the +152 slot above. |
| `func_0017F0D8` | +64 | +36 | `ipc_service_registry_owner_71` | Reused from IPC71. |
| `func_0017F11C` | +104 | +0, +60 | `service_runtime_singleton_86` | New singleton class. |

Starting from the IPC85 totals of 837 physical slots in 440 classes, this
batch advances the cumulative totals to exactly 844 slots in 444 classes.

## Direct-transfer and entry contract

There are exactly twenty symbolic direct-transfer relocations. Sixteen
unconditional calls use `R_ARM_CALL`; three conditional link transfers and one
tail jump use `R_ARM_JUMP24`. All sixteen destination identity classes are
singleton ARM primary entries.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0017ECB0` | +60 | `R_ARM_CALL` | `bl` | `func_0017EA3C` |
| `func_0017ECB0` | +136 | `R_ARM_JUMP24` | `blne` | `func_0017EA90` |
| `func_0017ED4C` | +152 | `R_ARM_CALL` | `bl` | `func_0017F0D8` |
| `func_0017ED4C` | +172 | `R_ARM_CALL` | `bl` | `func_001720A4` |
| `func_0017ED4C` | +188 | `R_ARM_CALL` | `bl` | `func_0018A438` |
| `func_0017ED4C` | +304 | `R_ARM_CALL` | `bl` | `func_00178604` |
| `func_0017ED4C` | +344 | `R_ARM_CALL` | `bl` | `func_00302108` |
| `func_0017ED4C` | +448 | `R_ARM_CALL` | `bl` | `func_0017F0D8` |
| `func_0017ED4C` | +460 | `R_ARM_CALL` | `bl` | `func_00172044` |
| `func_0017ED4C` | +472 | `R_ARM_JUMP24` | `blne` | `func_00160BA8` |
| `func_0017ED4C` | +532 | `R_ARM_CALL` | `bl` | `func_00302108` |
| `func_0017F0D8` | +28 | `R_ARM_CALL` | `bl` | `func_001888A8` |
| `func_0017F0D8` | +44 | `R_ARM_CALL` | `bl` | `func_00171324` |
| `func_0017F11C` | +8 | `R_ARM_CALL` | `bl` | `func_001602B8` |
| `func_0017F11C` | +12 | `R_ARM_CALL` | `bl` | `func_0017EAE4` |
| `func_0017F11C` | +16 | `R_ARM_CALL` | `bl` | `func_0017F0D8` |
| `func_0017F11C` | +28 | `R_ARM_CALL` | `bl` | `func_0017F0D8` |
| `func_0017F11C` | +68 | `R_ARM_JUMP24` | `b` | `func_00160380` |
| `func_0017F11C` | +76 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0017F11C` | +88 | `R_ARM_JUMP24` | `blne` | `func_00185F88` |

The selected bodies additionally contain thirty-three local direct branches,
two register-indirect calls, four stack-return sites, and one external tail
site. No other direct transfer escapes a selected body.

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

.global func_0017EA3C
.global func_0017EA90
.global func_0017F0D8
.global func_001720A4
.global func_0018A438
.global func_00178604
.global func_00302108
.global func_00172044
.global func_00160BA8
.global func_001888A8
.global func_00171324
.global func_001602B8
.global func_0017EAE4
.global func_00160380
.global func_00184990
.global func_00185F88
.global service_linked_node_vtable_86
.global ipc_allocator_dispatch_owner_68
.global service_query_flags_86
.global service_query_context_86
.global ipc_service_registry_owner_71
.global service_runtime_singleton_86

BEGIN func_0017ECB0
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
mov r1,#0
ldr r0,.Lnode_vtable_0017ECB0
strd r0,[r5]
ldr r0,.Lallocator_owner_0017ECB0
str r1,[r5,#8]
ldr r4,[r0,#360]
ldrb r0,[r0,#6]
cmp r0,#0
beq .Ldone_0017ECB0
bic r2,r2,#255
add r6,r4,#24
orr r7,r2,#1
mov r0,r6
bl func_0017EA3C
ldr r0,[r4,#8]
ldr r1,[r4,#16]
cmp r0,r1
beq .Linsert_empty_0017ECB0
ldr r1,[r4,#12]
str r5,[r1,#4]
ldr r1,[r4,#12]
str r1,[r5,#8]
str r5,[r4,#12]
b .Linsert_done_0017ECB0
.Linsert_empty_0017ECB0:
str r5,[r4,#8]
str r5,[r4,#12]
.Linsert_done_0017ECB0:
ldr r0,[r4,#20]
add r0,r0,#1
str r0,[r4,#20]
sxtb r0,r7
cmp r0,#0
movne r0,r6
blne func_0017EA90
.Ldone_0017ECB0:
mov r0,r5
pop {r4,r5,r6,r7,r8,pc}
END func_0017ECB0
.Lnode_vtable_0017ECB0:
.word service_linked_node_vtable_86
.Lallocator_owner_0017ECB0:
.word ipc_allocator_dispatch_owner_68

BEGIN func_0017ED4C
push {r4,r5,r6,r7,r8,r9,r10,r11,lr}
sub sp,sp,#36
mov r8,#0
mov r5,r0
mov r6,r1
str r8,[sp,#20]
str r8,[sp,#24]
str r8,[sp,#28]
ldr r0,[r0,#48]
ldr r9,.Lquery_flags_0017ED4C
ldr r10,.Lquery_context_0017ED4C
mov r7,r2
ldr r4,[r0,#8]
mov r11,#111
.Lscan_0017ED4C:
ldr r0,[r5,#48]
cmp r4,r0
beq .Lscan_exhausted_0017ED4C
ldr r0,[r4,#20]
ldrb r1,[r0,#16]
cmp r1,#1
beq .Lcheck_key_0017ED4C
b .Ladvance_tree_0017ED4C
.Lscan_exhausted_0017ED4C:
ldr r0,[sp,#24]
ldr r4,[sp,#20]
cmp r0,r4
bne .Lprocess_match_0017ED4C
b .Lcleanup_0017ED4C
.Lcheck_key_0017ED4C:
ldr r1,[r0,#72]
cmp r1,r6
beq .Lcandidate_0017ED4C
cmp r7,#0
beq .Ladvance_tree_0017ED4C
ldr r0,[r0,#76]
cmp r0,r7
bne .Ladvance_tree_0017ED4C
.Lcandidate_0017ED4C:
str r8,[sp,#8]
str r8,[sp,#12]
str r8,[sp,#16]
bl func_0017F0D8
ldr r1,[r4,#20]
ldr r0,[r0,#16]
add r2,sp,#8
ldr r1,[r1,#68]
bl func_001720A4
ldr r1,[sp,#24]
ldrd r2,[sp,#8]
add r0,sp,#20
bl func_0018A438
ldr r0,[r4,#12]
mov r1,r4
cmp r0,#0
beq .Lsuccessor_up_0017ED4C
.Lsuccessor_right_0017ED4C:
mov r4,r0
ldr r0,[r0,#8]
cmp r0,#0
bne .Lsuccessor_right_0017ED4C
b .Ldispatch_0017ED4C
.Lsuccessor_up_0017ED4C:
ldr r0,[r4,#4]
ldr r3,[r0,#12]
cmp r1,r3
bne .Lsuccessor_ready_0017ED4C
.Lsuccessor_climb_0017ED4C:
mov r4,r0
ldr r0,[r0,#4]
ldr r2,[r0,#12]
cmp r4,r2
beq .Lsuccessor_climb_0017ED4C
.Lsuccessor_ready_0017ED4C:
ldr r2,[r4,#12]
cmp r2,r0
movne r4,r0
.Ldispatch_0017ED4C:
ldr r0,[r1,#20]
mov r1,#1
str r1,[sp,#4]
mov r2,r9
mov r3,r10
mov r1,#3
str r11,[sp]
bl func_00178604
ldr r0,[sp,#8]
cmp r0,#0
beq .Lscan_0017ED4C
ldr r1,[r0,#-8]!
cmp r1,#0
beq .Lmissing_cleanup_0017ED4C
blx r1
b .Lscan_0017ED4C
.Lmissing_cleanup_0017ED4C:
nop
bl func_00302108
nop
nop
b .Lscan_0017ED4C
.Ladvance_tree_0017ED4C:
ldr r0,[r4,#12]
cmp r0,#0
beq .Ladvance_up_0017ED4C
.Ladvance_right_0017ED4C:
mov r4,r0
ldr r0,[r0,#8]
cmp r0,#0
bne .Ladvance_right_0017ED4C
b .Lscan_0017ED4C
.Ladvance_up_0017ED4C:
ldr r0,[r4,#4]
ldr r2,[r0,#12]
cmp r4,r2
bne .Ladvance_ready_0017ED4C
.Ladvance_climb_0017ED4C:
mov r4,r0
ldr r0,[r0,#4]
ldr r1,[r0,#12]
cmp r4,r1
beq .Ladvance_climb_0017ED4C
.Ladvance_ready_0017ED4C:
ldr r1,[r4,#12]
cmp r1,r0
movne r4,r0
b .Lscan_0017ED4C
.Lprocess_match_0017ED4C:
nop
bl func_0017F0D8
ldr r1,[r4]
ldr r0,[r0,#16]
bl func_00172044
cmp r0,#0
movne r1,#4
blne func_00160BA8
ldr r0,[sp,#24]
add r4,r4,#4
cmp r0,r4
bne .Lprocess_match_0017ED4C
.Lcleanup_0017ED4C:
ldr r0,[sp,#20]
cmp r0,#0
beq .Lreturn_0017ED4C
ldr r1,[r0,#-8]!
cmp r1,#0
beq .Lmissing_final_cleanup_0017ED4C
blx r1
.Lreturn_0017ED4C:
add sp,sp,#36
pop {r4,r5,r6,r7,r8,r9,r10,r11,pc}
.Lmissing_final_cleanup_0017ED4C:
nop
bl func_00302108
add sp,sp,#36
pop {r4,r5,r6,r7,r8,r9,r10,r11,pc}
END func_0017ED4C
.Lquery_flags_0017ED4C:
.word service_query_flags_86
.Lquery_context_0017ED4C:
.word service_query_context_86

BEGIN func_0017F0D8
ldr r0,.Lallocator_owner_0017F0D8
push {r4,lr}
ldrb r1,[r0,#13]
cmp r1,#0
moveq r2,#0
beq .Llookup_0017F0D8
ldr r0,[r0,#148]
bl func_001888A8
ldr r2,[r0]
.Llookup_0017F0D8:
ldr r0,.Lregistry_owner_0017F0D8
mov r1,#3
bl func_00171324
cmp r0,#0
ldrne r0,[r0,#12]
pop {r4,pc}
END func_0017F0D8
.Lallocator_owner_0017F0D8:
.word ipc_allocator_dispatch_owner_68
.Lregistry_owner_0017F0D8:
.word ipc_service_registry_owner_71

BEGIN func_0017F11C
ldr r0,.Lruntime_singleton_0017F11C
push {r4,lr}
bl func_001602B8
bl func_0017EAE4
bl func_0017F0D8
cmp r0,#0
beq .Lallocate_0017F11C
bl func_0017F0D8
mov r1,#1
add r0,r0,#4
.Latomic_retry_0017F11C:
ldrex r2,[r0]
add r2,r2,r1
strex r3,r2,[r0]
cmp r3,#0
bne .Latomic_retry_0017F11C
.Lpublish_0017F11C:
ldr r0,.Lruntime_singleton_0017F11C
pop {r4,lr}
b func_00160380
.Lallocate_0017F11C:
mov r0,#128
bl func_00184990
cmp r0,#0
nop
blne func_00185F88
nop
nop
b .Lpublish_0017F11C
END func_0017F11C
.Lruntime_singleton_0017F11C:
.word service_runtime_singleton_86
```

## Required validator contract

The isolated implementation validator must fail closed and check all of the
following:

1. Parse only a regular file of at most 64 MiB, with at most 16 MiB in any
   section, at most 16,384 sections, at most 1,000,000 symbols, and at most
   1,000,000 relocations. Reject malformed ELF, duplicate or missing configured
   sections, duplicate global definitions, executable `NOBITS`, and unexpected
   executable sections or mapping-symbol states.
2. Require exactly four configured ARM sections and exactly one global
   `STT_FUNC` definition at offset zero in each. Require body sizes 148, 544,
   60, and 104 bytes and full section sizes 156, 552, 68, and 108 bytes.
3. Require exactly twenty branch relocations at the configured body offsets,
   with the configured `R_ARM_CALL`/`R_ARM_JUMP24` kinds, symbols, and mnemonic
   forms. Require exactly seven `R_ARM_ABS32` pool relocations at the configured
   adjacent offsets and reject any additional relocation.
4. Check the complete instruction schedule, local branch destinations,
   register-indirect calls, returns, external tail, literal-load sites, pool
   placement, literal equality classes, and the ARM mapping-symbol contract.
   Reject any interior `$d` state in an executable body.
5. Prove that the two `ipc_allocator_dispatch_owner_68` slots are equal, that
   the IPC71 registry slot uses its established identity, and that the four new
   identities are pairwise distinct from each other and from both reused
   classes. Never make a private literal value normative.
6. Recompute total body size 856, adjacent size 28, physical slots 7, identity
   classes 6, branch relocations 20, local branches 33, indirect calls 2,
   return sites 4, and external tails 1 from parsed evidence rather than
   trusting manifest totals.
7. Enforce source and normalized-schedule hashes after the implementer replaces
   both `PENDING` fields. The source path must remain exactly
   `src/main/arm_ipc_wrappers_86.S` and must stay inside the repository.
8. Include deterministic positive and hostile self-tests, including a valid
   composite with more than 12,000 sections and mutations of a body
   instruction, a local branch, each branch relocation field, each pool
   relocation field, literal identity equality, section size, function symbol,
   and mapping-symbol state.

The implementer must work from this public schedule and config only. It must
not inspect the target object, ROM, ignored reports, private analysis artifacts,
or another implementation source.
