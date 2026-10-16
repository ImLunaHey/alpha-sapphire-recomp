# Probe-verified ARM service/lifecycle wrappers 68

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function inventory, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  equality analysis, and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, target hashes, private literal values, private strings, assets,
  implementation, or proprietary source are present.
- Implementation source SHA-256: `2fd6bdebe246629d9628b2c20020414baa552fa11af8a731659e751668a2b6c3`.

This batch covers eight still-unmatched ARM allocation, state-transition, and
lifecycle bodies totaling exactly 632 executable bytes. It is disjoint from all
earlier IPC work and from the pending runtime/duplicate batch 71 cohorts.

## Function, extent, and semantic contract

| Function | Section | Body | Next global | Contract |
|---|---|---:|---|---|
| `func_00184990` | `.text.func_00184990` | 72 | `func_001849DC` at +76 | Align and extend an allocation request, dispatch through an optional allocator entry or the established fallback, publish the owner callback in the allocation header, and return the payload after the header. |
| `func_00186A54` | `.text.func_00186A54` | 88 | `func_00186AAC` at +88 | Validate a two-state selector against object readiness, acquire the established subordinate object, submit the selector, and publish it only on success. |
| `func_00188090` | `.text.func_00188090` | 244 | `func_00188184` at +244 | Reuse or release an existing queued record when possible, otherwise initialize a replacement record with the supplied scalar arguments and publish it into the owner. |
| `func_00188228` | `.text.func_00188228` | 124 | `func_001882A4` at +124 | Tear down an optional active resource, then visit at most sixteen occupied resource slots and release each through the current indirect interface. |
| `func_001882F8` | `.text.func_001882F8` | 16 | `func_00188308` at +16 | Adjust both intrusive-link operands by one word and tail-transfer to the established link helper. |
| `func_00188308` | `.text.func_00188308` | 28 | `func_00188324` at +28 | Acquire the established shared list object, reset a secondary list subobject, and return the original owner. |
| `func_00188324` | `.text.func_00188324` | 16 | `func_00188338` at +20 | Insert one intrusive link at the front of another. The four bytes after the body are anonymous material, not a reached literal slot. |
| `func_0018850C` | `.text.func_0018850C` | 44 | `func_00188538` at +44 | Classify a halfword from its high, middle, and low bit groups and normalize one singleton class. |

## Positional identity and transfer contract

`func_00184990` has one physical post-body literal at +72, reached only by the
load at +4. It establishes the new `ipc_allocator_dispatch_owner_68` identity.
Private equality analysis found no equality with any earlier IPC literal
identity. Starting from the IPC67 baseline of 723 slots in 376 classes, this
batch therefore requires 724 physical slots in 377 classes.

There are exactly thirteen symbolic direct-transfer sites: eleven calls to
primary ARM entries, one tail jump, and one call to a secondary ARM entry. The secondary identity
`service_list_reset_secondary_68` lies +608 bytes into owner
`func_0017A640`, eight bytes before the next global `func_0017A8A8`.
All thirteen transfer identity classes are pairwise distinct. The `blx r1` in
`func_00184990` and `blx r6` in `func_00188090` remain register-indirect calls
and do not create symbolic relocations.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_00184990` | +48 | `R_ARM_CALL` | `bl` | `func_002FECF8` |
| `func_00186A54` | +56 | `R_ARM_CALL` | `bl` | `func_00186EB8` |
| `func_00186A54` | +68 | `R_ARM_CALL` | `bl` | `func_0018C008` |
| `func_00188090` | +104 | `R_ARM_CALL` | `bl` | `func_0018CB00` |
| `func_00188090` | +112 | `R_ARM_CALL` | `bl` | `func_0018CA98` |
| `func_00188090` | +176 | `R_ARM_CALL` | `bl` | `func_0018CB5C` |
| `func_00188090` | +208 | `R_ARM_CALL` | `bl` | `func_00191024` |
| `func_00188228` | +24 | `R_ARM_CALL` | `bl` | `func_0017541C` |
| `func_00188228` | +32 | `R_ARM_CALL` | `bl` | `func_0018CCF4` |
| `func_00188228` | +80 | `R_ARM_CALL` | `bl` | `func_0018CD00` |
| `func_001882F8` | +12 | `R_ARM_JUMP24` | `b` | `func_0017A8E8` |
| `func_00188308` | +8 | `R_ARM_CALL` | `bl` | `func_001882A4` |
| `func_00188308` | +16 | `R_ARM_CALL` | `bl` | `service_list_reset_secondary_68` |

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` fixes the executable body size. The `.word`
after `func_00184990` is adjacent data outside the declared 72-byte body.
Labels and directives occupy no executable bytes. Preserve every mnemonic,
operand, condition, addressing mode, immediate, local branch, direct-transfer
form, pool position, and pool order.

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

.global func_002FECF8,func_00186EB8,func_0018C008
.global func_0018CB00,func_0018CA98,func_0018CB5C,func_00191024
.global func_0017541C,func_0018CCF4,func_0018CD00,func_0017A8E8
.global func_001882A4,service_list_reset_secondary_68
.global ipc_allocator_dispatch_owner_68

BEGIN func_00184990
push {r4,lr}
ldr r4,.Lpool_00184990_owner
rsb r1,r0,#4
and r1,r1,#3
add r0,r0,r1
ldr r1,[r4,#88]
add r0,r0,#8
cmp r1,#0
beq .Lfallback_00184990
blx r1
b .Lallocated_00184990
.Lfallback_00184990:
nop
bl func_002FECF8
.Lallocated_00184990:
ldr r2,[r4,#92]
mov r1,r0
add r0,r0,#8
str r2,[r1]
pop {r4,pc}
END func_00184990
.Lpool_00184990_owner:
.word ipc_allocator_dispatch_owner_68

BEGIN func_00186A54
push {r4,r5,r6,lr}
mov r5,r0
ldrb r0,[r0,#12]
mov r4,r1
cmp r0,#0
beq .Lreject_00186A54
ldrsb r0,[r5,#13]
cmn r0,#1
beq .Lselector_00186A54
.Lreject_00186A54:
mov r0,#0
pop {r4,r5,r6,pc}
.Lselector_00186A54:
cmp r4,#0
cmpne r4,#1
bne .Lreject_00186A54
bl func_00186EB8
mov r2,r4
mov r1,#1
bl func_0018C008
cmp r0,#0
movne r0,#1
strbne r4,[r5,#13]
pop {r4,r5,r6,pc}
END func_00186A54

BEGIN func_00188090
push {r4,r5,r6,r7,r8,r9,sl,fp,lr}
mov r4,r0
mov r7,r2
mov sl,r1
add r1,r4,#28
mov fp,r3
vpush {d8}
sub sp,sp,#4
ldm r1,{r1,r2}
ldr r0,[r0,#16]
vldr s16,[sp,#48]
sub r1,r1,r2
cmp r1,r0
blt .Linitialize_00188090
ldr r0,[r4,#4]
cmp r0,#0
beq .Lfail_00188090
ldr r0,[r4,#8]
sub r5,r0,#88
ldr r1,[r0,#-24]
cmp r1,r7
bgt .Lfail_00188090
add r6,r5,#12
ldr r8,[r5,#8]
ldm r6,{r6,r9}
mov r0,r5
bl func_0018CB00
mov r0,r5
bl func_0018CA98
cmp r6,#0
beq .Lreleased_00188090
mov r2,r9
mov r1,#2
mov r0,r5
blx r6
.Lreleased_00188090:
cmp r8,#0
beq .Lfail_00188090
.Linitialize_00188090:
ldr r0,[r4,#20]
vstr s16,[sp]
mov r3,fp
sub r5,r0,#88
mov r2,r7
mov r1,sl
mov r0,r5
bl func_0018CB5C
cmp r0,#0
nop
beq .Lreturn_00188090
and r0,r7,#255
str r0,[r5,#64]
mov r1,r5
mov r0,r4
bl func_00191024
mov r0,r5
.Lreturn_00188090:
add sp,sp,#4
vpop {d8}
pop {r4,r5,r6,r7,r8,r9,sl,fp,pc}
.Lfail_00188090:
add sp,sp,#4
mov r0,#0
vpop {d8}
pop {r4,r5,r6,r7,r8,r9,sl,fp,pc}
END func_00188090

BEGIN func_00188228
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
mov r7,#0
ldrb r0,[r0,#358]
cmp r0,#0
beq .Lslots_00188228
bl func_0017541C
add r1,r5,#80
bl func_0018CCF4
strb r7,[r5,#358]
.Lslots_00188228:
ldrb r0,[r5,#13]
mov r4,#0
cmp r0,#0
strbne r7,[r5,#13]
.Lloop_00188228:
cmp r4,#15
bgt .Lnext_00188228
add r6,r5,r4,lsl #2
ldr r0,[r6,#144]
cmp r0,#0
beq .Lnext_00188228
bl func_0018CD00
ldr r0,[r5,#132]
ldr r1,[r6,#144]
ldr r2,[r0]
ldr r2,[r2,#12]
blx r2
str r7,[r6,#144]
.Lnext_00188228:
add r4,r4,#1
cmp r4,#16
blt .Lloop_00188228
pop {r4,r5,r6,r7,r8,pc}
END func_00188228

BEGIN func_001882F8
mov r2,r1
add r1,r0,#4
add r2,r2,#4
b func_0017A8E8
END func_001882F8

BEGIN func_00188308
push {r4,lr}
mov r4,r0
bl func_001882A4
add r1,r4,#128
bl service_list_reset_secondary_68
mov r0,r4
pop {r4,pc}
END func_00188308

BEGIN func_00188324
ldr r2,[r0]
str r2,[r1]
str r1,[r0]
bx lr
END func_00188324

BEGIN func_0018850C
lsl r1,r0,#1
lsls r0,r1,#8
movne r0,#4
lsrs r2,r1,#24
orrne r0,r0,#1
mov r2,#-16777216
bics r1,r2,r1
orreq r0,r0,#2
cmp r0,#1
moveq r0,#5
bx lr
END func_0018850C
```

## Independent probe result

The normative schedule was assembled independently for ARMv6K/VFPv2. After
normalizing only the thirteen direct-transfer relocation fields, all 158 body
instructions and all 632 executable bytes matched the bounded target bodies.
The probe also confirmed one `R_ARM_ABS32` slot at `func_00184990 + 72`, the
declared direct-transfer ordering and kinds, the 72-byte declared size despite
the adjacent literal, and the exact eight section names.
