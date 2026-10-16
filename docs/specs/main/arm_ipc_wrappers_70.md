# Probe-verified ARM service/data wrappers 70

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function inventory, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  equality analysis, and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, target hashes, private literal values, private strings, assets,
  implementation, or proprietary source are present.
- Implementation source SHA-256: `b3a6dd722b089ef5abc32300d2a932dfd3f87a0a182dae933381aec6c647a455`.

This batch covers four consecutive still-unmatched ARM endpoint initialization,
wait, dispatch, and slot-registration bodies totaling exactly 432 executable
bytes. It is disjoint from every earlier IPC cohort and from the pending runtime
73-74 and duplicate 72-73 cohorts.

## Function, extent, and semantic contract

| Function | Section | Body | Next global | Contract |
|---|---|---:|---|---|
| `func_0018B220` | `.text.func_0018B220` | 124 | `func_0018B2AC` at +140 | Initialize an endpoint object with two dispatch identities, its state identity, synchronization member, owner value, and availability flag. |
| `func_0018B2AC` | `.text.func_0018B2AC` | 140 | `func_0018B348` at +156 | Validate endpoint state, report a fixed failure when already active, otherwise start the endpoint and wait at the established timing scale until its completion byte changes. |
| `func_0018B348` | `.text.func_0018B348` | 76 | `func_0018B394` at +76 | Check whether a supplied span fits configured bounds, dispatch the accepted span, and invoke the endpoint completion callback. |
| `func_0018B394` | `.text.func_0018B394` | 92 | `func_0018B3F4` at +96 | Install an entry into one of fourteen vacant slots, reporting the established contextual failure on an invalid or occupied slot. |

## Positional identity and transfer contract

`func_0018B220` has four physical post-body literals at +124, +128, +132,
and +136, reached respectively by loads at +8, +12, +48, and +76. The first
three establish `ipc_endpoint_primary_vtable_70`,
`ipc_endpoint_secondary_vtable_70`, and `ipc_endpoint_state_table_70`; the
fourth reuses `ipc_allocator_dispatch_owner_68`. `func_0018B2AC` has four
post-body literals at +140, +144, +148, and +152. Loads at +12, +40, +44, and
+100 reach them respectively. The first reuses
`ipc_allocator_dispatch_owner_68`, the middle pair establish
`ipc_wait_error_code_70` and `ipc_wait_log_context_70`, and the last reuses
`service_timing_scale_46`. `func_0018B394` has one post-body literal at +92,
shared by loads at +12 and +64, and establishes `ipc_slot_error_context_70`.
Private equality analysis found all six new identities pairwise distinct and
unequal to every earlier IPC literal identity. Starting from the IPC69 baseline
of 729 slots in 381 classes, this batch therefore requires 738 physical slots
in 387 classes.

There are exactly seven symbolic direct-transfer sites, all calls to primary
ARM entries. The three sites targeting `func_00178974` share one destination
identity class. The other four destinations are singletons, and all five
destination classes are pairwise distinct. The register-indirect call in
`func_0018B348` remains register-indirect and creates no symbolic relocation.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0018B220` | +44 | `R_ARM_CALL` | `bl` | `func_00132C04` |
| `func_0018B2AC` | +56 | `R_ARM_CALL` | `bl` | `func_00178974` |
| `func_0018B2AC` | +88 | `R_ARM_CALL` | `bl` | `func_0018DCA8` |
| `func_0018B2AC` | +116 | `R_ARM_CALL` | `bl` | `func_00188878` |
| `func_0018B348` | +48 | `R_ARM_CALL` | `bl` | `func_0018B9B4` |
| `func_0018B394` | +28 | `R_ARM_CALL` | `bl` | `func_00178974` |
| `func_0018B394` | +80 | `R_ARM_CALL` | `bl` | `func_00178974` |

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` fixes the executable body size. Each `.word`
is adjacent data outside the preceding declared body. Labels and directives
occupy no executable bytes. Preserve every mnemonic, operand, condition,
addressing mode, immediate, local branch, direct-transfer form, pool position,
and pool order.

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

.global func_00132C04,func_00178974,func_0018DCA8,func_00188878,func_0018B9B4
.global ipc_endpoint_primary_vtable_70,ipc_endpoint_secondary_vtable_70
.global ipc_endpoint_state_table_70,ipc_allocator_dispatch_owner_68
.global ipc_wait_error_code_70,ipc_wait_log_context_70
.global service_timing_scale_46,ipc_slot_error_context_70

BEGIN func_0018B220
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,.Lpool_0018B220_primary
ldr r2,.Lpool_0018B220_secondary
mov r6,#0
mov r5,r1
stm r4,{r0,r2,r6}
mvn r2,#0
str r2,[r4,#16]
add r0,r4,#8
str r6,[r4,#12]
bl func_00132C04
ldr r1,.Lpool_0018B220_state
str r1,[r4,#20]
add r1,r4,#28
strb r6,[r4,#24]
stm r1,{r5,r6}
str r5,[r4,#40]
str r6,[r4,#36]
ldr r0,.Lpool_0018B220_owner
ldrb r0,[r0,#4]
cmp r0,#0
bne .Ldisable_0018B220
ldr r0,[r4,#40]
cmp r0,#1073741824
movne r0,#1
bne .Lpublish_0018B220
.Ldisable_0018B220:
mov r0,#0
.Lpublish_0018B220:
strb r0,[r4,#44]
mov r0,r4
pop {r4,r5,r6,pc}
END func_0018B220
.Lpool_0018B220_primary:
.word ipc_endpoint_primary_vtable_70
.Lpool_0018B220_secondary:
.word ipc_endpoint_secondary_vtable_70
.Lpool_0018B220_state:
.word ipc_endpoint_state_table_70
.Lpool_0018B220_owner:
.word ipc_allocator_dispatch_owner_68

BEGIN func_0018B2AC
push {r4,r5,r6,lr}
cmp r1,#0
mov r4,r0
ldreq r0,.Lpool_0018B2AC_owner
ldreq r1,[r0,#104]
str r1,[r4,#24]
ldr r0,[r4,#12]
ldr r0,[r0]
cmp r0,#0
beq .Lstart_0018B2AC
ldr r1,.Lpool_0018B2AC_error
ldr r0,.Lpool_0018B2AC_context
mov r3,#0
mov r2,#-536870898
bl func_00178974
mov r0,#0
pop {r4,r5,r6,pc}
.Lstart_0018B2AC:
mov r1,#0
mov r0,#1
strb r1,[r4,#29]
strb r0,[r4,#28]
mov r0,r4
bl func_0018DCA8
ldrb r0,[r4,#29]
cmp r0,#0
ldreq r5,.Lpool_0018B2AC_scale
bne .Lsuccess_0018B2AC
.Lwait_0018B2AC:
mov r0,r5
mov r1,#0
bl func_00188878
ldrb r0,[r4,#29]
cmp r0,#0
beq .Lwait_0018B2AC
.Lsuccess_0018B2AC:
mov r0,#1
pop {r4,r5,r6,pc}
END func_0018B2AC
.Lpool_0018B2AC_owner:
.word ipc_allocator_dispatch_owner_68
.Lpool_0018B2AC_error:
.word ipc_wait_error_code_70
.Lpool_0018B2AC_context:
.word ipc_wait_log_context_70
.Lpool_0018B2AC_scale:
.word service_timing_scale_46

BEGIN func_0018B348
push {r4,lr}
mov r4,r0
ldr r0,[r1,#16]
ldr r2,[r1,#12]
sub r0,r0,r2
ldr r2,[r4,#32]
cmp r0,r2
ldrcs r2,[r4,#36]
cmpcs r2,r0
movcc r0,#0
bcc .Lreturn_0018B348
add r0,r4,#8
bl func_0018B9B4
ldr r0,[r4]
ldr r1,[r0,#28]
mov r0,r4
blx r1
mov r0,#1
.Lreturn_0018B348:
pop {r4,pc}
END func_0018B348

BEGIN func_0018B394
cmp r2,#14
push {r4,lr}
bcc .Linspect_0018B394
ldr r0,.Lpool_0018B394_context
mov r3,#0
mov r2,#-536870909
mov r1,#62
bl func_00178974
mov r0,#0
.Learly_return_0018B394:
pop {r4,pc}
.Linspect_0018B394:
add r0,r0,r2,lsl #2
ldr r2,[r0,#4]
cmp r2,#0
streq r1,[r0,#4]
moveq r0,#1
beq .Learly_return_0018B394
ldr r0,.Lpool_0018B394_context
mov r3,#0
mov r2,#-536870897
mov r1,#68
bl func_00178974
mov r0,#0
.Lreturn_0018B394:
pop {r4,pc}
END func_0018B394
.Lpool_0018B394_context:
.word ipc_slot_error_context_70
```

## Independent probe result

The normative schedule was independently assembled with the pinned GNU Arm
toolchain in ARMv6K/VFPv2 mode. Section-scoped comparison against the private
target confirmed all 108 executable instructions, all local-control targets,
all nine literal reaches and their physical order, all seven symbolic transfer
sites, all four function sizes, and all four next-global boundaries. The
comparison normalizes only relocation payload fields; opcode, condition,
register, addressing-mode, immediate, and local-displacement bits remain exact.
