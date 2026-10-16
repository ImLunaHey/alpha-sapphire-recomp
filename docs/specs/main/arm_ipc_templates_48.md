# Probe-verified ARM service/IPC wrappers 48

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, branch-target resolution, physical literal
  identity comparison, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objdump, objcopy, and readelf 2.44.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers six still-unmatched ARM-state service adapters totaling
exactly 492 executable bytes. They serialize access to two service-state
objects, register or submit queue entries, publish a returned token, test
session availability, and query two forms of session status.

The selection is disjoint from every function named by the existing neutral
IPC manifests, from duplicate batch 52, and from runtime batch 52. Every
selected function is reported as unmatched in the current target report.

## Function and behavior inventory

All functions and direct destinations are ARM mode and four-byte aligned.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_00165B84` | 48 | new queue-core identity at +0x30 | Lock the queue core, register a caller object, and tail-release the lock. |
| `func_00165BB8` | 108 | queue-core identity followed by one new result identity | Lock the queue core, submit a request with two explicit zero arguments, publish the returned token, unlock, and map a null token to a fixed result identity. |
| `func_00165C2C` | 92 | queue-core identity at +0x5c | Lock the queue core, submit the reduced request form with two explicit zero arguments, unlock, and return the service result. |
| `func_00165C8C` | 92 | new session-lock identity followed by new session-state identity | Check whether a shared session is installed under its lock; otherwise require service readiness, query a byte-sized status, and suppress failed queries. |
| `func_00165CF0` | 52 | session-lock identity followed by session-state identity | Return a locked boolean indicating whether the shared session is installed. |
| `func_00165D30` | 100 | session-lock identity followed by session-state identity | Check whether a shared session is installed under its lock; otherwise require service readiness, query a word-sized status, and suppress failed queries. |

The 10 physical pool slots form four distinct identities. No identity is
equal to an established literal class. The queue-core identity occupies
three slots, the queue result identity one slot, and the two session
identities three slots each. The cumulative contract is therefore 622 slots
in 316 classes.

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; each following
pool belongs to the preceding section but is outside that function's body
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, stack operation, local branch
destination, and pool order.

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

.global func_001602B8,func_001608E4,func_00160380,func_00170A3C
.global func_0014967C,func_00174848,func_001342C8
.global service_queue_core_state_48,service_queue_submit_error_48
.global service_session_lock_48,service_session_state_48

BEGIN func_00165B84
push {r4,r5,r6,lr}
mov r5,r0
ldr r6,.Lpool_00165B84
add r4,r6,#88
mov r0,r4
bl func_001602B8
mov r1,r5
mov r0,r6
bl func_001608E4
mov r0,r4
pop {r4,r5,r6,lr}
b func_00160380
END func_00165B84
.Lpool_00165B84:
.word service_queue_core_state_48

BEGIN func_00165BB8
push {r4,r5,r6,r7,r8,r9,r10,r11,lr}
sub sp,sp,#12
mov r5,r1
mov r10,r0
mov r11,#0
ldr r7,.Lpool_00165BB8
mov r6,r2
mov r8,r11
add r4,r7,#88
mov r9,r11
mov r0,r4
bl func_001602B8
mov r3,r11
mov r2,r6
mov r1,r5
mov r0,r7
strd r8,[sp]
bl func_00170A3C
mov r5,r0
mov r0,r4
bl func_00160380
cmp r5,#0
str r5,[r10]
add sp,sp,#12
ldreq r0,.Lpool_00165BB8+4
movne r0,#0
pop {r4,r5,r6,r7,r8,r9,r10,r11,pc}
END func_00165BB8
.Lpool_00165BB8:
.word service_queue_core_state_48
.word service_queue_submit_error_48

BEGIN func_00165C2C
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r5,r0
sub sp,sp,#8
mov r10,#0
ldr r7,.Lpool_00165C2C
mov r6,r1
mov r8,r10
add r4,r7,#88
mov r9,r10
mov r0,r4
bl func_001602B8
mov r3,r10
mov r2,r6
mov r1,r5
mov r0,r7
strd r8,[sp]
bl func_00170A3C
mov r5,r0
mov r0,r4
bl func_00160380
add sp,sp,#8
mov r0,r5
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00165C2C
.Lpool_00165C2C:
.word service_queue_core_state_48

BEGIN func_00165C8C
push {r3,r4,r5,lr}
ldr r4,.Lpool_00165C8C
mov r0,r4
bl func_001602B8
ldr r0,.Lpool_00165C8C+4
ldr r0,[r0,#4]
cmp r0,#0
movne r5,#1
moveq r5,#0
mov r0,r4
bl func_00160380
cmp r5,#0
bne .Lquery_00165C8C
bl func_0014967C
cmp r0,#0
beq .Lreturn_00165C8C
.Lquery_00165C8C:
mov r0,sp
bl func_00174848
and r0,r0,#0x80000000
cmp r0,#0
ldrsbge r0,[sp]
movlt r0,#0
.Lreturn_00165C8C:
pop {r3,r4,r5,pc}
END func_00165C8C
.Lpool_00165C8C:
.word service_session_lock_48
.word service_session_state_48

BEGIN func_00165CF0
push {r4,r5,r6,lr}
ldr r4,.Lpool_00165CF0
mov r0,r4
bl func_001602B8
ldr r0,.Lpool_00165CF0+4
ldr r0,[r0,#4]
cmp r0,#0
movne r5,#1
moveq r5,#0
mov r0,r4
bl func_00160380
mov r0,r5
pop {r4,r5,r6,pc}
END func_00165CF0
.Lpool_00165CF0:
.word service_session_lock_48
.word service_session_state_48

BEGIN func_00165D30
push {r4,r5,lr}
sub sp,sp,#20
ldr r4,.Lpool_00165D30
mov r0,r4
bl func_001602B8
ldr r0,.Lpool_00165D30+4
ldr r0,[r0,#4]
cmp r0,#0
movne r5,#1
moveq r5,#0
mov r0,r4
bl func_00160380
cmp r5,#0
bne .Lquery_00165D30
bl func_0014967C
cmp r0,#0
beq .Lreturn_00165D30
.Lquery_00165D30:
mov r0,sp
bl func_001342C8
and r0,r0,#0x80000000
cmp r0,#0
ldrge r0,[sp]
movlt r0,#0
.Lreturn_00165D30:
add sp,sp,#20
pop {r4,r5,pc}
END func_00165D30
.Lpool_00165D30:
.word service_session_lock_48
.word service_session_state_48
```

## Relocation and identity contract

The manifest is normative for relocation offsets, relocation kinds, direct
branch identities, body sizes, and pool identities. The six calls to
`func_001602B8`, six transfers to `func_00160380`, two calls to
`func_00170A3C`, and two calls to `func_0014967C` each resolve to one shared
physical destination. The remaining three direct destinations are singleton
classes. All seven branch classes are pairwise distinct.

The physical target was cross-compared at every pool slot. All three
`service_queue_core_state_48` slots are equal; the result slot differs from
that class and every established class; all three `service_session_lock_48`
slots are equal; all three `service_session_state_48` slots are equal; and
the two session classes differ from one another, the queue classes, and every
established class. No claimed reused equality is present in this batch.

The independent probe reproduced all 492 non-relocation body bytes exactly.
Its relocation table also reproduced every offset, kind, mnemonic, and
symbolic identity recorded in the manifest. `sourceSha256` is intentionally
left as `IMPLEMENTER_TO_FILL`; the clean-room implementer must replace it with
the digest of the independently authored source before validation.
