# Probe-verified ARM service/state wrappers 67

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function inventory, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  equality analysis, and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.
- Source SHA-256: `b2365ca6075733886325a4d2fd89550848954c5a1b3f66e0d990792a078ad630`.

This batch covers two still-unmatched ARM service/state bodies totaling exactly
812 executable bytes. Seven adjacent literal regions total 28 additional
non-body bytes. Function boundaries and sizes come from the authoritative
inventory, and the selected set is disjoint from every earlier IPC batch and
the reserved duplicate/runtime batch 70 cohorts.

## Semantic contract

- `func_00182918` extends a linked sequence of 72-byte records until it can
  publish the requested count of one-based record indices. It reuses available
  spans, allocates missing records through the established indirect allocator,
  initializes successful allocations through one established direct entry, and
  terminates the resulting chain.
- `func_00182B50` accepts one of three normalized resource kinds, finds the
  current record, releases an existing backing allocation through an indirect
  callback when necessary, refreshes the record through one direct service
  entry, obtains replacement backing storage through the established allocator,
  publishes the normalized kind, and marks shared state dirty.

## Identity and accounting contract

There are seven physical post-body literal slots in five classes. Two slots
reuse `ipc_record_tree_owner_66`, two reuse `ipc_allocator_owner_65`, and one
reuses `ipc_dirty_flag_owner_66`. The remaining slots establish the distinct
`ipc_record_tag_67` and `ipc_release_callback_owner_67` identities. Both new
identities are distinct from one another and every earlier IPC literal identity.
Starting from the required 716-slot / 374-class IPC66 baseline, the cumulative
contract is therefore 723 physical slots in 376 classes.

There are exactly five symbolic inter-section transfer sites. Four conditional
calls in `func_00182918` target the same four-byte-aligned primary ARM inventory
entry `func_00301FBC`. The unconditional call in `func_00182B50` targets the
distinct primary ARM inventory entry `func_0017D1D4`. All other branches are
local, and every register-indirect `blx`/`bx` remains an indirect transfer
rather than a symbolic identity.

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

.global func_00301FBC,func_0017D1D4
.global ipc_allocator_owner_65,ipc_record_tree_owner_66,ipc_dirty_flag_owner_66
.global ipc_record_tag_67,ipc_release_callback_owner_67

BEGIN func_00182918
cmp r0,#0
bxeq lr
push {r4,r5,r6,r7,r8,r9,sl,fp,ip,lr}
mov r5,r0
mov sl,r1
ldr r8,.Lpool_00182918_tree
ldr r7,.Lpool_00182918_allocator
ldr r0,[r8]
ldr r0,[r0,#4]
cmp r0,#0
beq .Lempty_00182918
ldr r0,[r0,#64]
mov r9,#0
mov r6,#2
cmp r0,#1
beq .Lload_head_00182918
ldr ip,[r7]
cmp ip,#0
moveq r4,#0
beq .Lpublish_first_00182918
mov r3,#72
mov r2,#0
mov r1,#256
mov r0,#65536
blx ip
movs r4,r0
movne r1,#72
blne func_00301FBC
.Lpublish_first_00182918:
mov r0,#1
str r0,[sl]
mov r9,r0
str r0,[r4,#64]
ldr r0,[r8]
sub r5,r5,#1
ldr r1,[r0,#4]
str r1,[r4,#68]
str r4,[r0,#4]
.Lload_head_00182918:
ldr r0,[r8]
ldr r4,[r0,#4]
b .Lwalk_next_00182918
.Lempty_00182918:
mov r6,#0
cmp r5,#0
mov r4,r6
bls .Lreturn_a_00182918
.Linitial_allocate_00182918:
ldr ip,[r7]
cmp ip,#0
moveq r9,#0
beq .Linitial_link_00182918
mov r3,#72
mov r2,#0
mov r1,#256
mov r0,#65536
blx ip
movs r9,r0
movne r1,#72
blne func_00301FBC
.Linitial_link_00182918:
cmp r6,#0
ldreq r1,[r8]
mov r0,r9
strne r0,[r6,#68]
mov r6,r0
streq r0,[r1,#4]
add r1,r4,#1
str r1,[sl,r4,lsl #2]
add r4,r4,#1
cmp r4,r5
str r1,[r0,#64]
bcc .Linitial_allocate_00182918
.Lreturn_a_00182918:
pop {r4,r5,r6,r7,r8,r9,sl,fp,ip,pc}
.Lspan_check_00182918:
ldr r0,[r8,#64]
cmp r0,r6
movhi fp,#0
bhi .Lspan_loop_00182918
b .Ladvance_00182918
.Lspan_allocate_00182918:
ldr r0,.Lpool_00182918_allocator
ldr ip,[r0]
cmp ip,#0
moveq r7,#0
beq .Lspan_link_00182918
mov r3,#72
mov r2,#0
mov r1,#256
mov r0,#65536
blx ip
movs r7,r0
movne r1,#72
blne func_00301FBC
.Lspan_link_00182918:
add r0,fp,r6
str r0,[r7,#64]
str r0,[sl,r9,lsl #2]
str r7,[r4,#68]
sub r5,r5,#1
add fp,fp,#1
add r9,r9,#1
mov r4,r7
str r8,[r7,#68]
.Lspan_loop_00182918:
ldr r0,[r8,#64]
sub r0,r0,r6
cmp r0,fp
bls .Lspan_done_00182918
cmp r5,#0
bne .Lspan_allocate_00182918
.Lspan_done_00182918:
ldr r6,[r8,#64]
.Ladvance_00182918:
mov r4,r8
add r6,r6,#1
.Lwalk_next_00182918:
ldr r8,[r4,#68]
cmp r8,#0
beq .Lappend_00182918
cmp r5,#0
bne .Lspan_check_00182918
pop {r4,r5,r6,r7,r8,r9,sl,fp,ip,pc}
.Lappend_00182918:
cmp r5,#0
ldrhi fp,.Lpool_00182918_allocator
movne r8,#0
beq .Lreturn_a_00182918
bls .Lterminate_00182918
.Lappend_loop_00182918:
ldr ip,[fp]
cmp ip,#0
moveq r7,#0
beq .Lappend_link_00182918
mov r3,#72
mov r2,#0
mov r1,#256
mov r0,#65536
blx ip
movs r7,r0
movne r1,#72
blne func_00301FBC
.Lappend_link_00182918:
str r7,[r4,#68]
str r6,[r7,#64]
str r6,[sl,r9,lsl #2]
add r8,r8,#1
cmp r8,r5
mov r4,r7
add r6,r6,#1
add r9,r9,#1
bcc .Lappend_loop_00182918
.Lterminate_00182918:
mov r0,#0
str r0,[r4,#68]
pop {r4,r5,r6,r7,r8,r9,sl,fp,ip,pc}
END func_00182918
.Lpool_00182918_tree:
.word ipc_record_tree_owner_66
.Lpool_00182918_allocator:
.word ipc_allocator_owner_65

BEGIN func_00182B50
push {r4,r5,r6,r7,r8,r9,sl,fp,lr}
lsr r5,r0,#16
sub sp,sp,#12
lsls r5,r5,#16
mov r7,r1
ldr r0,.Lpool_00182B50_dirty
mov r8,r2
mov r9,r3
moveq r5,#131072
ldr r6,[r0]
beq .Lkind_ready_00182B50
cmp r5,#131072
cmpne r5,#196608
bne .Lreturn_00182B50
.Lkind_ready_00182B50:
ldr r0,.Lpool_00182B50_tree
ldr fp,.Lpool_00182B50_tag
mov sl,#0
ldr r0,[r0]
ldr r4,[r0,#12]
ldr r3,[r4]
cmp r3,#0
beq .Lrefresh_00182B50
ldr r0,[r4,#20]
cmp r0,r7
ldreq r0,[r4,#12]
cmpeq r0,r8
ldreq r0,[r4,#16]
cmpeq r0,r9
beq .Lreturn_00182B50
ldr r0,.Lpool_00182B50_release
ldr ip,[r0]
cmp ip,#0
beq .Lclear_00182B50
add r0,r4,#60
mov r1,fp
ldm r0,{r0,r2}
blx ip
.Lclear_00182B50:
str sl,[r4]
.Lrefresh_00182B50:
mov r0,#1
str r4,[sp,#8]
stm sp,{r0,sl}
mov r3,#0
mov r2,r7
mov r1,r9
mov r0,r8
bl func_0017D1D4
ldr r0,.Lpool_00182B50_allocator
ldr ip,[r0]
cmp ip,#0
moveq r0,#0
beq .Lpublish_00182B50
ldr r2,[r4,#64]
ldr r3,[r4,#32]
mov r1,fp
mov r0,r5
blx ip
.Lpublish_00182B50:
str r0,[r4],#60
str r5,[r4]
ldr r0,[r6]
orr r0,r0,#1
str r0,[r6]
.Lreturn_00182B50:
add sp,sp,#12
pop {r4,r5,r6,r7,r8,r9,sl,fp,pc}
END func_00182B50
.Lpool_00182B50_dirty:
.word ipc_dirty_flag_owner_66
.Lpool_00182B50_tree:
.word ipc_record_tree_owner_66
.Lpool_00182B50_tag:
.word ipc_record_tag_67
.Lpool_00182B50_release:
.word ipc_release_callback_owner_67
.Lpool_00182B50_allocator:
.word ipc_allocator_owner_65
```

## Independent probe results

- Both selected inventory entries are ARM, four-byte aligned, still unmatched,
  and have exact body sizes 560 and 252 bytes.
- Independent GNU Arm assembly reproduces every non-symbolic instruction word,
  local-branch displacement, PC-relative literal load, and physical pool offset.
- Relocation inspection confirms four `R_ARM_JUMP24` sites to
  `func_00301FBC`, one `R_ARM_CALL` site to `func_0017D1D4`, and seven
  `R_ARM_ABS32` pool sites in the declared order.
- The selected executable ranges, adjacent pool ranges, and direct targets are
  disjoint from all earlier committed batches and the reserved batch 70 sets.
