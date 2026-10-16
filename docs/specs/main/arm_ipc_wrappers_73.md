# Probe-verified ARM service/data wrappers 73

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function inventory, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  analysis, and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, target hashes, private literal values, private strings, assets,
  implementation, or proprietary source are present.
- Implementation source SHA-256: `cab4b9194808515de2cfe76beb24f8321ee64cc6c8cede1d098e48866af6f7db`.

This batch covers six still-unmatched ARM synchronization, resource-reset, and
service-cleanup bodies totaling exactly 428 executable bytes. It is disjoint
from every earlier configured primary body and from the pending runtime 79 and
duplicate 74 cohorts.

## Function, extent, and semantic contract

| Function | Section | Body | Next global | Contract |
|---|---|---:|---|---|
| `func_0018C888` | `.text.func_0018C888` | 88 | `func_0018C8E0` at +88 | Enter the object's synchronization region, mark an indexed record active, publish that record into its selected list, signal the shared wait object, and leave the synchronization region. |
| `func_0018CA98` | `.text.func_0018CA98` | 104 | `func_0018CB00` at +104 | If the collection is active, release every non-null indexed member, clear its count, perform the collection-level release sequence, and clear the active flag. |
| `func_0018CB00` | `.text.func_0018CB00` | 92 | `func_0018CB5C` at +92 | If member shutdown is enabled, request shutdown for each non-null indexed member, then clear the shutdown and publication state flags. |
| `func_0018CD00` | `.text.func_0018CD00` | 100 | `func_0018CD64` at +100 | Prepare cleanup, notify every marked node in the linked resource chain, destroy every node in a second pass, and clear the chain head and active flag. |
| `func_0018CD64` | `.text.func_0018CD64` | 24 | `func_0018CD7C` at +24 | If the pointed-to node exists, replace the caller's head pointer with that node's successor. |
| `func_0018CD7C` | `.text.func_0018CD7C` | 20 | `func_0018CD90` at +20 | Return immediately when the state byte is set; otherwise tail-transfer to the established service-state handler. |

Every body ends exactly at its nearest following global, so this batch owns no
interstitial padding, trailing pool material, or unnamed secondary body.

## Positional identity and transfer contract

None of the six bodies has a PC-relative literal load or physical literal slot.
Consequently `literalIdentities`, `reusedLiteralIdentities`, and
`newLiteralIdentities` are all empty, and there are no semantic literal-equality
classes to preserve. Starting from the IPC72 baseline of 751 physical slots in
398 classes, this batch therefore remains at 751 slots in 398 classes.

There are exactly thirteen symbolic direct-transfer sites: nine unconditional
calls, two conditional call-form jump relocations, and two tail jumps. Every
destination is an aligned primary global entry, all thirteen destination
classes are pairwise distinct, and there are no secondary entry identities or
secondary positional relations in this batch. All other conditional transfers
remain local and create no symbolic relocation.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0018C888` | +24 | `R_ARM_CALL` | `bl` | `func_001602B8` |
| `func_0018C888` | +32 | `R_ARM_CALL` | `bl` | `func_00132A14` |
| `func_0018C888` | +60 | `R_ARM_CALL` | `bl` | `func_0017A8E8` |
| `func_0018C888` | +72 | `R_ARM_CALL` | `bl` | `func_0016F454` |
| `func_0018C888` | +84 | `R_ARM_JUMP24` | `b` | `func_00160380` |
| `func_0018CA98` | +52 | `R_ARM_CALL` | `bl` | `func_0018EC24` |
| `func_0018CA98` | +80 | `R_ARM_CALL` | `bl` | `func_00188184` |
| `func_0018CA98` | +92 | `R_ARM_CALL` | `bl` | `func_0018F3B4` |
| `func_0018CB00` | +52 | `R_ARM_JUMP24` | `blne` | `func_0018ECF0` |
| `func_0018CD00` | +8 | `R_ARM_CALL` | `bl` | `func_0018EFAC` |
| `func_0018CD00` | +36 | `R_ARM_JUMP24` | `blne` | `func_0018F3F8` |
| `func_0018CD00` | +68 | `R_ARM_CALL` | `bl` | `func_0018F3E0` |
| `func_0018CD7C` | +12 | `R_ARM_JUMP24` | `b` | `func_0017E858` |

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` fixes the executable body size. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
condition, addressing mode, immediate, local branch, and direct-transfer form.

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

.global func_001602B8,func_00132A14,func_0017A8E8,func_0016F454
.global func_00160380,func_0018EC24,func_00188184,func_0018F3B4
.global func_0018ECF0,func_0018EFAC,func_0018F3F8,func_0018F3E0
.global func_0017E858

BEGIN func_0018C888
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
add r6,r0,#44
mov r4,r1
mov r7,r2
mov r0,r6
bl func_001602B8
add r0,r4,#12
bl func_00132A14
mov r0,#1
strb r0,[r4,#20]
add r0,r7,r7,lsl #1
add r2,r4,#4
add r0,r5,r0,lsl #2
add r1,r0,#4
bl func_0017A8E8
mov r1,#0
add r0,r5,#56
bl func_0016F454
mov r0,r6
pop {r4,r5,r6,r7,r8,lr}
b func_00160380
END func_0018C888

BEGIN func_0018CA98
push {r4,r5,r6,lr}
mov r5,r0
ldrb r0,[r0,#20]
cmp r0,#0
beq .Lreturn_0018CA98
ldr r0,[r5,#8]
mov r6,#0
mov r4,r6
cmp r0,#0
ble .Lcleared_0018CA98
.Lrelease_loop_0018CA98:
ldr r0,[r5,r4,lsl #2]
cmp r0,#0
beq .Lrelease_next_0018CA98
bl func_0018EC24
str r6,[r5,r4,lsl #2]
.Lrelease_next_0018CA98:
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bgt .Lrelease_loop_0018CA98
.Lcleared_0018CA98:
str r6,[r5,#8]
bl func_00188184
mov r1,r5
nop
bl func_0018F3B4
strb r6,[r5,#20]
.Lreturn_0018CA98:
pop {r4,r5,r6,pc}
END func_0018CA98

BEGIN func_0018CB00
push {r4,r5,r6,lr}
mov r5,r0
ldrb r0,[r0,#22]
mov r6,#0
cmp r0,#0
beq .Lflags_0018CB00
ldr r0,[r5,#8]
mov r4,#0
cmp r0,#0
ble .Ldisable_0018CB00
.Ldisable_loop_0018CB00:
ldr r0,[r5,r4,lsl #2]
cmp r0,#0
movne r1,#1
blne func_0018ECF0
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bgt .Ldisable_loop_0018CB00
.Ldisable_0018CB00:
strb r6,[r5,#22]
.Lflags_0018CB00:
strb r6,[r5,#24]
strb r6,[r5,#23]
strb r6,[r5,#21]
pop {r4,r5,r6,pc}
END func_0018CB00

BEGIN func_0018CD00
push {r4,r5,r6,lr}
mov r5,r0
bl func_0018EFAC
ldr r4,[r5,#304]
cmp r4,#0
beq .Ldestroy_loop_0018CD00
.Lnotify_loop_0018CD00:
ldrb r0,[r4,#305]
cmp r0,#0
movne r0,r4
blne func_0018F3F8
ldr r4,[r4,#424]
cmp r4,#0
bne .Lnotify_loop_0018CD00
.Ldestroy_loop_0018CD00:
ldr r4,[r5,#304]
cmp r4,#0
beq .Lclear_0018CD00
.Ldestroy_next_0018CD00:
mov r0,r4
bl func_0018F3E0
ldr r4,[r4,#424]
cmp r4,#0
bne .Ldestroy_next_0018CD00
.Lclear_0018CD00:
mov r0,#0
str r0,[r5,#304]
strb r0,[r5,#5]
pop {r4,r5,r6,pc}
END func_0018CD00

BEGIN func_0018CD64
mov r1,r0
ldr r0,[r0]
cmp r0,#0
ldrne r2,[r0]
strne r2,[r1]
bx lr
END func_0018CD64

BEGIN func_0018CD7C
ldrb r1,[r0,#100]
cmp r1,#0
bne .Lreturn_0018CD7C
b func_0017E858
.Lreturn_0018CD7C:
bx lr
END func_0018CD7C
```

## Independent probe result

The normative schedule was independently assembled with GNU Arm Embedded
15.2.Rel1 in ARMv6K/VFPv2 mode. Section-scoped comparison against the private
target confirmed all 107 executable instructions, every local-control target,
all thirteen symbolic transfer sites, all six function sizes, the absence of
literal reaches, and all six nearest-next-global boundaries. The comparison
normalizes only direct-transfer relocation payload fields; opcode, condition,
register, addressing-mode, immediate, and local-displacement bits remain exact.
The implementation source SHA-256 is
`cab4b9194808515de2cfe76beb24f8321ee64cc6c8cede1d098e48866af6f7db`.
