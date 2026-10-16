# Probe-verified ARM service/IPC wrappers 45

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control-flow inspection, branch-target resolution, and an independent GNU
  Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objdump, objcopy, and readelf 2.44.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers six still-unmatched ARM-state service adapters totaling
exactly 1,044 executable bytes. They stop and reset an owned worker, drain two
intrusive queues, wait before virtual dispatch, tear down an owned interface,
finish an asynchronous transaction, and reset a live session.

The selection is disjoint from every function named by the existing neutral
IPC-template manifests. Every selected function is reported as unmatched in
the current target report.

## Function and behavior inventory

All functions and all direct external destinations are ARM mode and
four-byte aligned. Three explicitly named secondary destinations have no
standalone function-start row in the neutral inventory. This batch has no
literal-pool slots.

| Function | Size | Visible behavior |
| --- | ---: | --- |
| `func_00174314` | 236 | Signal and wait for an owned worker, close two handles, finalize embedded members, clear state fields, unlock, and install the all-ones idle marker. |
| `func_001745F8` | 268 | Lock embedded state, drain two intrusive queues, unlink every node, close and clear each optional node handle, decrement both queue counts, and tail-unlock. |
| `func_0019B5B0` | 120 | Dispatch directly when requested; otherwise wait indefinitely on the object handle, report a negative result, normalize flags, restore forwarded arguments, and dispatch virtually. |
| `func_002BC2F8` | 172 | Quiesce and release an optional owned interface, report a negative service result, finalize three embedded members, and clear scalar state. |
| `func_0042F6BC` | 96 | Invoke service 25 on an owned handle, report a negative result, run two completion stages, and mark protected state ready when both stages succeed. |
| `func_00430818` | 152 | If active, finalize session state, close and clear an owned handle, release an optional interface, clear related fields, reset delegated state, and clear the active byte on success. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` terminates the executable body. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, stack operation, service-call immediate, no-op form, and
local branch destination. In particular, `nop {0}` and `mov r0,r0` are
distinct required schedule entries.

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

.global func_001603A0,func_001781F0,func_001602B8,func_00164F74
.global func_0017A640,func_0017A5B8,func_001780E8,func_00160380
.global func_00177FF0,func_0017048C,func_00132A14,func_002C23C8
.global func_002C5C4C,func_002C2454,service_result_wait_secondary_45
.global service_payload_submit_secondary_45,service_session_reset_secondary_45
.global func_00150874,func_002E6CA4

BEGIN func_00174314
push {r4,r5,r6,lr}
mov r6,#1
mov r4,r0
strb r6,[r0,#119]
ldr r0,[r0,#44]
svc #0x18
lsrs r1,r0,#31
blne func_001603A0
mvn r2,#0
ldr r0,[r4,#108]
mov r5,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
add r0,r4,#108
strb r6,[r4,#112]
bl func_001781F0
ldr r0,[r4,#108]
add r6,r4,#108
cmp r0,#0
beq .Lafter_worker_close_00174314
svc #0x23
str r5,[r6]
.Lafter_worker_close_00174314:
mov r0,r4
bl func_001602B8
nop {0}
nop {0}
bl func_00164F74
nop {0}
nop {0}
bl func_0017A640
add r0,r4,#88
nop {0}
bl func_0017A5B8
str r5,[r4,#48]
str r5,[r4,#52]
str r5,[r4,#92]
add r0,r4,#56
str r5,[r4,#96]
bl func_001780E8
ldr r0,[r4,#44]
add r6,r4,#44
cmp r0,#0
beq .Lafter_primary_close_00174314
svc #0x23
str r5,[r6]
.Lafter_primary_close_00174314:
str r5,[r4,#16]
str r5,[r4,#20]
str r5,[r4,#24]
str r5,[r4,#28]
str r5,[r4,#32]
str r5,[r4,#36]
mov r0,r4
str r5,[r4,#40]
bl func_00160380
mvn r0,#0
str r0,[r4,#8]
pop {r4,r5,r6,pc}
END func_00174314

BEGIN func_001745F8
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
add r0,r0,#16
mov r6,r0
bl func_001602B8
mov r0,#1
strb r0,[r4,#66]
add r0,r4,#28
bl func_00177FF0
mov r5,#0
.Lfirst_loop_001745F8:
ldr r1,[r4,#8]
cmp r1,#0
beq .Lsecond_loop_001745F8
ldr r3,[r1]
add r0,r4,#8
cmp r3,r1
streq r5,[r0]
beq .Lfirst_unlinked_001745F8
ldr r2,[r1,#4]
str r2,[r0]
ldm r1,{r0,r2}
str r0,[r2]
ldm r1,{r0,r2}
str r2,[r0,#4]
.Lfirst_unlinked_001745F8:
str r5,[r1,#4]
str r5,[r1]
ldr r0,[r1,#8]
add r7,r1,#8
cmp r0,#0
beq .Lfirst_count_001745F8
svc #0x23
str r5,[r7]
.Lfirst_count_001745F8:
ldr r0,[r4,#44]
sub r0,r0,#1
str r0,[r4,#44]
b .Lfirst_loop_001745F8
.Lsecond_loop_001745F8:
ldr r0,[r4,#12]
cmp r0,#0
beq .Lfinish_001745F8
ldr r3,[r4,#40]
mov r1,r0
add r2,r4,#12
sub r3,r3,#1
str r3,[r4,#40]
ldr r3,[r0]
cmp r3,r1
streq r5,[r2]
beq .Lsecond_unlinked_001745F8
ldr r0,[r0,#4]
str r0,[r2]
ldm r1,{r0,r2}
str r0,[r2]
ldm r1,{r0,r2}
str r2,[r0,#4]
.Lsecond_unlinked_001745F8:
str r5,[r1,#4]
str r5,[r1]
ldr r0,[r1,#8]
add r7,r1,#8
cmp r0,#0
beq .Lsecond_loop_001745F8
svc #0x23
str r5,[r7]
nop {0}
b .Lsecond_loop_001745F8
.Lfinish_001745F8:
mov r0,r6
pop {r4,r5,r6,r7,r8,lr}
b func_00160380
END func_001745F8

BEGIN func_0019B5B0
push {r4,r5,r6,lr}
mov r4,r0
cmp r3,#0
ldreq r0,[r4,#4]
mov r6,r1
mov r5,r2
beq .Lwait_0019B5B0
ldr r0,[r4]
ldr r2,[r0,#16]
mov r0,r4
pop {r4,r5,r6,lr}
bx r2
.Lwait_0019B5B0:
mvn r2,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
nop {0}
blne func_001603A0
ldr r0,[r4,#12]
mov r3,r5
mov r1,r6
bic r2,r0,#7
mov r0,r4
pop {r4,r5,r6,lr}
mov r0,r0
mov sp,r2
mov lr,r3
ldr r2,[r0]
ldr r2,[r2,#16]
bx r2
END func_0019B5B0

BEGIN func_002BC2F8
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#88]
mov r6,#0
cmp r0,#0
beq .Lmembers_002BC2F8
ldr r1,[r0]
ldr r2,[r1,#24]
mov r1,#0
blx r2
add r0,r4,#92
bl func_0017048C
ldr r0,[r4,#84]
svc #0x18
lsrs r1,r0,#31
blne func_001603A0
ldr r0,[r4,#88]
ldr r1,[r0]
ldr r1,[r1,#28]
blx r1
add r0,r4,#92
bl func_00132A14
ldr r0,[r4,#88]
cmp r0,#0
beq .Lclear_002BC2F8
ldr r1,[r0]
ldr r1,[r1,#4]
blx r1
.Lclear_002BC2F8:
str r6,[r4,#88]
.Lmembers_002BC2F8:
add r5,r4,#156
mov r0,r5
bl func_002C23C8
nop {0}
nop {0}
bl func_002C5C4C
mov r0,r5
nop {0}
bl func_002C2454
mov r0,#0
mov r1,r0
strh r6,[r4,#4]
strd r0,[r4,#16]
pop {r4,r5,r6,pc}
END func_002BC2F8

BEGIN func_0042F6BC
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#516]
svc #0x19
lsrs r1,r0,#31
blne func_001603A0
add r0,r4,#516
bl service_result_wait_secondary_45
ands r1,r0,#0x80000000
bmi .Lfinish_0042F6BC
add r0,r4,#4
bl service_payload_submit_secondary_45
mov r6,r0
ands r0,r0,#0x80000000
bmi .Lreturn_saved_0042F6BC
add r5,r4,#536
mov r0,r5
bl func_001602B8
mov r0,#1
strb r0,[r4,#528]
mov r0,r5
bl func_00160380
.Lreturn_saved_0042F6BC:
mov r0,r6
.Lfinish_0042F6BC:
pop {r4,r5,r6,pc}
END func_0042F6BC

BEGIN func_00430818
push {r4,r5,r6,lr}
mov r4,r0
mov r0,#0
ldrb r1,[r4,#4]
cmp r1,#0
beq .Lfinish_00430818
mov r0,r4
bl func_00150874
ldr r0,[r4,#8]
mov r6,#0
add r5,r4,#8
cmp r0,#0
beq .Lmember_00430818
svc #0x23
str r6,[r5]
.Lmember_00430818:
ldr r0,[r4,#24]
cmp r0,#0
beq .Lfields_00430818
ldr r1,[r0]
ldr r1,[r1,#4]
blx r1
str r6,[r4,#24]
.Lfields_00430818:
str r6,[r4,#28]
str r6,[r4,#32]
ldr r0,[r4,#8]
add r5,r4,#8
cmp r0,#0
beq .Lreset_00430818
svc #0x23
str r6,[r5]
.Lreset_00430818:
nop {0}
bl service_session_reset_secondary_45
nop {0}
nop {0}
bl func_002E6CA4
cmp r0,#0
strbeq r6,[r4,#4]
.Lfinish_00430818:
pop {r4,r5,r6,pc}
END func_00430818
```

## Branch and identity contract

All direct external branches and their offsets are listed in the companion
manifest. Primary entries use their evidence-gated names. The three secondary
entries are symbolic identities for distinct four-byte-aligned ARM targets
without standalone inventory rows. All branch classes are pairwise distinct
except for the explicitly repeated classes in the manifest. Register-indirect
virtual calls do not create branch relocations.

There are no literal identities in this batch. Consequently the cumulative
literal contract remains 572 slots in 286 physical-equality classes.

## Independent verification

The exact schedules above were assembled independently. Function sizes and
all non-relocated instruction words were compared against the bounded target
bodies; every comparison was exact. Readelf confirmed the 27 direct external
branch relocations, including condition-specific `R_ARM_JUMP24` sites and the
tail branch. The current objdiff report independently confirms that all six
selected functions remain unmatched.
