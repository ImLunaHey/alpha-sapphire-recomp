# Probe-verified ARM service/state helpers 65

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function inventory, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  equality analysis, and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.

This batch covers eight still-unmatched ARM service/state bodies totaling exactly
1,060 executable bytes. Nine adjacent literal regions total 36 additional
non-body bytes. Function boundaries and sizes come from the authoritative
inventory, and the selected set is disjoint from every earlier IPC, duplicate,
and runtime batch.

## Semantic contract

- `func_00181E14` initializes a 16-slot callback owner from a descriptor. It
  counts selected slots, obtains each selected callback object indirectly,
  records its slot index and owner state, and falls back through an owner
  virtual entry if the descriptor cannot be represented.
- `func_00181EE0` refreshes an initialized owner: it optionally tears down prior
  state, configures four embedded lanes, sets readiness fields, initializes a
  service, and links an embedded node. A missing primary callback object is
  handled through the owner fallback entry.
- `func_001820E4` advances a bounded state counter and updates a fractional
  single-precision accumulator using two private scaling identities. It records
  initialization and carry state in adjacent byte fields.
- `func_00182290` performs a guarded lookup in a pointer vector and returns the
  matching 16-bit index, or zero when absent. The same guard-release entry is
  used at both exits.
- `func_0018230C` derives a single-precision scale from owner state, using a
  private gain identity only when either of two activation conditions holds.
- `func_001823AC` selects and invokes an optional floating-point callback from a
  five-entry table, applies owner and byte scales, and preserves one callback
  result in the distinguished lane case.
- `func_00182458` clears a two-word plus halfword state record.
- `func_0018246C` obtains and zero-initializes a ten-word state record through
  an indirect allocator owner, returning null when the allocator is absent or
  refuses the request.

## Identity and accounting contract

There are nine physical literal slots in seven classes. Three slots reuse
`service_zero_scalar_51`; one slot reuses `ipc_unit_scalar_54`. The remaining
five slots establish the pairwise-distinct `ipc_step_scalar_a_65`,
`ipc_step_scalar_b_65`, `ipc_gain_scalar_65`, `ipc_callback_table_65`, and
`ipc_allocator_owner_65` classes. All five new classes are distinct from every
earlier IPC literal identity. Starting from the required 700-slot / 367-class
IPC64 baseline, the cumulative contract is therefore 709 physical slots in 372
classes.

There are exactly 13 symbolic inter-section transfer sites in 12 destination
classes. The two conditional release calls in `func_00182290` share
`func_0017EA90`; every other destination is used once. Eleven destinations are
primary, four-byte-aligned ARM inventory entries. `service_link_secondary_64`
is the established distinct secondary ARM entry immediately after the 44-byte
body of `func_0017A8A8`. All 12 destination identities are pairwise distinct.
All other branches are local, and register-indirect `blx`/`bx` instructions
remain indirect transfers rather than symbolic identities.

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` terminates the executable body. Each `.word`
after an `END` is an adjacent physical literal outside the declared function
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, addressing mode, immediate, local
branch, direct-transfer form, pool position, and pool order.

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

.global func_00188228,func_00187838,func_00187DA0,func_00187DB0
.global func_0018773C,func_00187790,func_001882A4,func_001882F8
.global func_0017541C,service_link_secondary_64,func_0017EA3C,func_0017EA90
.global service_zero_scalar_51,ipc_unit_scalar_54
.global ipc_step_scalar_a_65,ipc_step_scalar_b_65,ipc_gain_scalar_65
.global ipc_callback_table_65,ipc_allocator_owner_65

BEGIN func_00181E14
push {r4,r5,r6,r7,r8,lr}
mov r6,r1
mov r8,r0
ldr r0,[r1,#8]
mov r4,#0
str r0,[r8,#128]
ldr r0,[r1,#4]
cmp r0,#0
beq .Lcount_done_00181E14
.Lcount_00181E14:
tst r0,#1
addne r4,r4,#1
lsrs r0,r0,#1
bne .Lcount_00181E14
.Lcount_done_00181E14:
ldr r0,[r6]
ldr r1,[r0]
ldr r1,[r1,#16]
blx r1
cmp r4,r0
ble .Lpopulate_00181E14
ldr r0,[r8]
ldr r1,[r0,#12]
mov r0,r8
pop {r4,r5,r6,r7,r8,lr}
bx r1
.Lpopulate_00181E14:
ldr r4,[r6,#4]
mov r5,#0
.Lpopulate_loop_00181E14:
cmp r4,#0
beq .Lfinish_00181E14
.Lpopulate_iter_00181E14:
tst r4,#1
beq .Lnext_00181E14
ldr r0,[r6]
ldr r1,[r0]
ldr r2,[r1,#8]
mov r1,r8
blx r2
cmp r5,#15
mov r7,r0
mov r1,r5
bgt .Lnext_00181E14
add r0,r8,r1,lsl #2
str r7,[r0,#144]
mov r0,r7
strb r1,[r0,#4]
ldrb r0,[r8,#46]
strb r0,[r7,#121]
.Lnext_00181E14:
lsrs r4,r4,#1
add r5,r5,#1
bne .Lpopulate_iter_00181E14
.Lfinish_00181E14:
ldr r0,[r6]
str r0,[r8,#132]
pop {r4,r5,r6,r7,r8,pc}
END func_00181E14

BEGIN func_00181EE0
push {r4,r5,r6,r7,lr}
mov r5,r0
sub sp,sp,#12
ldrb r0,[r0,#12]
mov r6,r1
cmp r0,#0
movne r0,r5
blne func_00188228
ldr r4,[r5,#144]
cmp r4,#0
beq .Lfallback_00181EE0
ldr r1,[r6]
mov r0,sp
bl func_00187838
mov r0,sp
ldr r0,[r0,#4]
mov r1,r0
ldr r2,[r6,#40]
mov r0,r4
bl func_00187DA0
mov r0,r4
bl func_00187DB0
mov r4,#0
.Llane_loop_00181EE0:
add r0,r4,r4,lsl #1
add r7,r6,r4,lsl #2
add r0,r5,r0,lsl #2
ldr r1,[r7,#4]
add r0,r0,#308
bl func_0018773C
add r1,r6,r4
add r0,r5,r4,lsl #4
ldrsb r2,[r1,#36]
ldr r1,[r7,#20]
add r0,r0,#244
bl func_00187790
add r4,r4,#1
cmp r4,#4
bcc .Llane_loop_00181EE0
mov r0,#3
mov r4,#1
strb r0,[r5,#356]
strb r4,[r5,#12]
bl func_001882A4
add r1,r5,#68
nop
bl func_001882F8
nop
nop
bl func_0017541C
add r1,r5,#80
nop
bl service_link_secondary_64
strb r4,[r5,#358]
add sp,sp,#12
pop {r4,r5,r6,r7,pc}
.Lfallback_00181EE0:
ldr r0,[r5]
ldr r1,[r0,#12]
add sp,sp,#12
mov r0,r5
pop {r4,r5,r6,r7,lr}
bx r1
END func_00181EE0

BEGIN func_001820E4
ldr r2,[r0,#8]
ldr r3,[r0,#16]
cmp r3,r2
bcs .Ladvance_001820E4
add ip,r3,r1
cmp ip,r2
strls ip,[r0,#16]
bls .Lreturn_001820E4
sub r3,r2,r3
sub r1,r1,r3
str r2,[r0,#16]
.Ladvance_001820E4:
vldr s1,[r0,#4]
vldr s0,.Lpool_001820E4_zero
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
ble .Lreturn_001820E4
ldrb r3,[r0,#28]
mov r2,#1
cmp r3,#0
bne .Laccumulate_001820E4
ldrb r3,[r0,#14]
vldr s2,.Lpool_001820E4_step_a
strb r2,[r0,#28]
vmov s0,r3
vcvt.f32.u32 s0,s0
vmul.f32 s0,s0,s2
vstr s0,[r0,#20]
.Laccumulate_001820E4:
vmov s2,r1
vldr s3,.Lpool_001820E4_step_b
vldr s0,[r0,#20]
vcvt.f32.s32 s2,s2
vmul.f32 s2,s2,s3
vmla.f32 s0,s1,s2
vmov r1,s0
vcvt.s32.f32 s1,s0
vstr s0,[r0,#20]
cmp r1,#1065353216
movlt r1,#0
strbge r2,[r0,#29]
strblt r1,[r0,#29]
vcvt.f32.s32 s1,s1
vsub.f32 s0,s0,s1
vstr s0,[r0,#20]
.Lreturn_001820E4:
bx lr
END func_001820E4
.Lpool_001820E4_zero:
.word service_zero_scalar_51
.Lpool_001820E4_step_a:
.word ipc_step_scalar_a_65
.Lpool_001820E4_step_b:
.word ipc_step_scalar_b_65

BEGIN func_00182290
push {r4,r5,r6,r7,r8,lr}
bic r2,r0,#255
mov r4,r0
add r6,r0,#4
mov r5,r1
orr r7,r2,#1
mov r0,r6
bl func_0017EA3C
ldrh r0,[r4,#64]
mov r8,#0
.Lsearch_00182290:
cmp r0,r8
bls .Lsearch_done_00182290
ldr r1,[r4,#56]
ldr r1,[r1,r8,lsl #2]
cmp r1,r5
addne r1,r8,#1
uxthne r8,r1
bne .Lsearch_00182290
.Lsearch_done_00182290:
cmp r0,r8
sxtb r0,r7
bne .Lfound_00182290
cmp r0,#0
movne r0,r6
blne func_0017EA90
mov r0,#0
pop {r4,r5,r6,r7,r8,pc}
.Lfound_00182290:
cmp r0,#0
movne r0,r6
blne func_0017EA90
mov r0,r8
pop {r4,r5,r6,r7,r8,pc}
END func_00182290

BEGIN func_0018230C
ldrb r1,[r0]
cmp r1,#0
bne .Lscaled_0018230C
vldr s1,[r0,#16]
vldr s0,.Lpool_0018230C_zero
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
beq .Lreturn_0018230C
.Lscaled_0018230C:
vldr s0,[r0,#4]
vldr s1,.Lpool_0018230C_gain
vmul.f32 s0,s0,s1
.Lreturn_0018230C:
bx lr
END func_0018230C
.Lpool_0018230C_zero:
.word service_zero_scalar_51
.Lpool_0018230C_gain:
.word ipc_gain_scalar_65

BEGIN func_001823AC
vldr s1,[r0]
vldr s0,.Lpool_001823AC_zero
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
bxeq lr
push {r4,lr}
mov r4,r0
ldr r0,[r0,#16]
ldr r1,[r4,#8]
cmp r1,r0
bhi .Lreturn_001823AC
ldrb r1,[r4,#13]
ldr r0,.Lpool_001823AC_table
ldr r0,[r0,r1,lsl #2]
cmp r0,#0
vldreq s0,.Lpool_001823AC_unit
beq .Lapply_001823AC
cmp r1,#4
beq .Lspecial_001823AC
vldr s0,[r4,#20]
blx r0
b .Lapply_001823AC
.Lspecial_001823AC:
ldrb r1,[r4,#29]
cmp r1,#0
vldreq s0,[r4,#24]
beq .Lapply_001823AC
vldr s0,[r4,#20]
blx r0
vstr s0,[r4,#24]
.Lapply_001823AC:
vldr s1,[r4]
ldrb r0,[r4,#12]
vmul.f32 s0,s1,s0
vmov s1,r0
vcvt.f32.u32 s1,s1
vmul.f32 s0,s1,s0
.Lreturn_001823AC:
pop {r4,pc}
END func_001823AC
.Lpool_001823AC_zero:
.word service_zero_scalar_51
.Lpool_001823AC_table:
.word ipc_callback_table_65
.Lpool_001823AC_unit:
.word ipc_unit_scalar_54

BEGIN func_00182458
mov r1,#0
str r1,[r0]
str r1,[r0,#4]
strh r1,[r0,#8]
bx lr
END func_00182458

BEGIN func_0018246C
ldr r0,.Lpool_0018246C_owner
push {r4,lr}
ldr ip,[r0]
cmp ip,#0
moveq r0,#0
beq .Lreturn_0018246C
mov r3,#40
mov r2,#0
mov r1,#256
mov r0,#65536
blx ip
cmp r0,#0
beq .Lreturn_0018246C
mov r1,#0
str r1,[r0]
str r1,[r0,#4]
str r1,[r0,#8]
str r1,[r0,#12]
str r1,[r0,#16]
str r1,[r0,#20]
str r1,[r0,#24]
str r1,[r0,#28]
str r1,[r0,#32]
str r1,[r0,#36]
.Lreturn_0018246C:
pop {r4,pc}
END func_0018246C
.Lpool_0018246C_owner:
.word ipc_allocator_owner_65
```

## Independent verification record

- All eight schedules assemble in ARM mode with GNU Arm Embedded using the
  declared architecture and VFP mode.
- Each emitted executable body has the authoritative byte length and exact
  instruction count; all local branch destinations remain inside its owner.
- After normalizing only the 13 declared direct-transfer immediates and nine
  declared adjacent literal words, every emitted schedule compares exactly to
  the corresponding bounded private-target region.
- The 13 transfer offsets resolve to the declared 12 identities. All primary
  destinations are exact inventory entries; the single secondary destination
  is the established aligned entry described above.
- Literal equality was checked across all nine physical slots and against the
  cumulative IPC64 identity inventory: the four reused slots match only their
  declared classes, and the five new classes are mutually distinct and distinct
  from every prior class.
- Selected executable ranges, adjacent literal slots, and symbolic transfer
  sites are boundary-valid, non-overlapping, and disjoint from earlier batches.
