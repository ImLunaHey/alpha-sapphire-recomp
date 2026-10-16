# Probe-verified ARM service/IPC wrappers 40

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, branch-target resolution, physical literal
  identity comparison, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objdump, and readelf 2.44.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers six still-unmatched ARM-state service adapters totaling
exactly 380 executable bytes. The set contains three wait-result classifiers,
one service-state acquisition adapter, and two guarded wait/state-transition
adapters.

The selection is disjoint from every function named by the existing neutral
IPC-template manifests. Every selected function is reported as unmatched in
the current target report.

## Function and behavior inventory

All functions and both direct external destinations are ARM mode, four-byte
aligned primary entries.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_0010EE40` | 44 | `service_completion_code_40` at +0x2c | Invoke service 36 on the object's leading word, report a negative result, then return whether the transformed result differs from the symbolic completion code. |
| `func_0010EEEC` | 72 | `service_name_token_40` at +0x48; `service_event_state_40` at +0x4c | Ask the service helper for a word using a symbolic name token. On success, issue service 31 from symbolic state and fixed policy arguments; on second success, publish the acquired word into that state and return zero. Otherwise return the unchanged failing status. |
| `func_0013F2F0` | 72 | `service_completion_code_40` at +0x48 | Return zero when object word +4 is absent. Otherwise invoke service 36 with zero policy words, report a negative result, and return whether the transformed result equals the shared symbolic completion code. |
| `func_001781F0` | 56 | none | If the byte at +4 is clear, invoke service 36 on the leading handle with two all-ones policy words, report a negative result, and set the byte. Return with the byte nonzero. |
| `func_002BEAAC` | 60 | `service_wait_pair_40` at +0x3c; `service_completion_code_40` at +0x40 | Select a deeply nested handle, load a policy pair from a symbolic object, invoke service 36, report a negative result, and return whether the transformed result differs from the shared symbolic completion code. |
| `func_003BB84C` | 76 | none | Return state +116 unchanged when it is zero or four. Otherwise wait on the indirectly held handle with all-ones policy words, report a negative result, mark the referenced object, set state +116 to four, and return four. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; each following
pool belongs to the preceding section but is outside that function's body
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, stack operation, service-call
immediate, and local branch destination.

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

.global func_001603A0,func_0011B11C
.global service_completion_code_40,service_name_token_40
.global service_event_state_40,service_wait_pair_40

BEGIN func_0010EE40
push {r4,lr}
ldr r0,[r0]
svc #0x24
lsrs r1,r0,#31
mov r4,r0
blne func_001603A0
ldr r0,.Lpool_0010EE40
cmp r0,r4,lsl #22
movne r0,#1
moveq r0,#0
pop {r4,pc}
END func_0010EE40
.Lpool_0010EE40:
.word service_completion_code_40

BEGIN func_0010EEEC
push {r3,r4,r5,lr}
mov r1,sp
ldr r0,.Lpool_0010EEEC
bl func_0011B11C
lsrs r1,r0,#31
bne .Lreturn_0010EEEC
ldr r4,.Lpool_0010EEEC+4
mov r3,#0x10000000
mov r2,#1
mov r1,#0
ldr r0,[r4,#4]
svc #0x1f
lsrs r1,r0,#31
bne .Lreturn_0010EEEC
ldr r0,[sp]
str r0,[r4]
mov r0,#0
.Lreturn_0010EEEC:
pop {r3,r4,r5,pc}
END func_0010EEEC
.Lpool_0010EEEC:
.word service_name_token_40
.word service_event_state_40

BEGIN func_0013F2F0
ldr r1,[r0,#4]
cmp r1,#0
moveq r0,#0
bxeq lr
mov r2,#0
mov r3,r2
mov r0,r1
push {r4,lr}
svc #0x24
lsrs r1,r0,#31
mov r4,r0
blne func_001603A0
ldr r0,.Lpool_0013F2F0
cmp r0,r4,lsl #22
movne r0,#1
moveq r0,#0
eor r0,r0,#1
pop {r4,pc}
END func_0013F2F0
.Lpool_0013F2F0:
.word service_completion_code_40

BEGIN func_001781F0
push {r4,lr}
mov r4,r0
ldrb r0,[r0,#4]
cmp r0,#0
ldreq r0,[r4]
bne .Lreturn_001781F0
mvn r2,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
mov r0,#1
strb r0,[r4,#4]
.Lreturn_001781F0:
pop {r4,pc}
END func_001781F0

BEGIN func_002BEAAC
ldr r1,.Lpool_002BEAAC
add r0,r0,#0x2c00
add r0,r0,#0x2d8
push {r4,lr}
ldrd r2,[r1]
ldr r0,[r0]
svc #0x24
lsrs r1,r0,#31
mov r4,r0
blne func_001603A0
ldr r0,.Lpool_002BEAAC+4
cmp r0,r4,lsl #22
movne r0,#1
moveq r0,#0
pop {r4,pc}
END func_002BEAAC
.Lpool_002BEAAC:
.word service_wait_pair_40
.word service_completion_code_40

BEGIN func_003BB84C
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#116]
cmp r0,#0
cmpne r0,#4
ldrne r5,[r4,#120]
ldrne r0,[r5]
beq .Lreturn_003BB84C
mvn r2,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
mov r0,#1
strb r0,[r5,#4]
mov r0,#4
str r0,[r4,#116]
ldr r0,[r4,#116]
.Lreturn_003BB84C:
pop {r4,r5,r6,pc}
END func_003BB84C
```

## Branch identity and relocation ledger

There are exactly six symbolic external ARM branch sites: one `R_ARM_CALL`
and five `R_ARM_JUMP24` conditional calls.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_0010EE40` | (+0x14, JUMP24, `blne`, `func_001603A0`) |
| `func_0010EEEC` | (+0x0c, CALL, `bl`, `func_0011B11C`) |
| `func_0013F2F0` | (+0x2c, JUMP24, `blne`, `func_001603A0`) |
| `func_001781F0` | (+0x28, JUMP24, `blne`, `func_001603A0`) |
| `func_002BEAAC` | (+0x24, JUMP24, `blne`, `func_001603A0`) |
| `func_003BB84C` | (+0x30, JUMP24, `blne`, `func_001603A0`) |

The two destination equality classes account for all six sites.
`func_001603A0` is one shared class of five sites; `func_0011B11C` is a
singleton class, and the two classes are distinct.

## Literal identity ledger and cumulative counts

The six ordered pool slots form four new IPC-template literal equality
classes. The completion-code identity is shared by three functions. Every
other identity is a singleton, distinct from that shared identity, from the
other identities in this batch, and from all earlier IPC-template literal
identities.

| Identity | Ordered sites | Semantic role |
| --- | --- | --- |
| `service_completion_code_40` | `func_0010EE40 + 0x2c`; `func_0013F2F0 + 0x48`; `func_002BEAAC + 0x40` | Shared transformed service-result value classified by three wait adapters. |
| `service_name_token_40` | `func_0010EEEC + 0x48` | Token supplied to the service-word acquisition helper. |
| `service_event_state_40` | `func_0010EEEC + 0x4c` | State used by service 31 and updated after acquisition. |
| `service_wait_pair_40` | `func_002BEAAC + 0x3c` | Pair of service-36 policy words. |

Consequently:

- reused earlier IPC literal identities: none;
- new literal identities: four;
- cumulative ordered pool slots: 536;
- cumulative literal identity classes: 263.

## Acceptance contract

An implementation is acceptable only when all of the following hold:

1. It defines exactly the six ARM functions above with the stated body sizes,
   four-byte alignment, global function symbols, and ARM mapping symbols.
2. Each function follows its complete normative mnemonic schedule exactly.
3. The object has exactly the six ordered symbolic branch relocations and six
   ordered `R_ARM_ABS32` pool relocations listed above.
4. The three completion-code slots share one identity; the remaining three
   identities are singleton classes, pairwise distinct from each other and
   from all earlier IPC-template literal classes.
5. The batch extends the cumulative contract from 530 slots / 259 classes to
   exactly 536 slots / 263 classes.
6. The functions remain disjoint from all earlier neutral template manifests.
