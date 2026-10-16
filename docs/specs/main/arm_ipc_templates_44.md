# Probe-verified ARM service/IPC wrappers 44

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
exactly 648 executable bytes. They release reference-counted state, stop an
owned worker, unlink queued state, wait with caller-supplied policy, replace
an owned handle, and close a group of owned handles.

The selection is disjoint from every function named by the existing neutral
IPC-template manifests. Every selected function is reported as unmatched in
the current target report.

## Function and behavior inventory

All functions are ARM mode and four-byte aligned. Nine of the ten direct
external destinations are primary ARM entries. The one explicitly named
secondary destination is also a four-byte-aligned ARM entry but has no
standalone function-start row in the neutral inventory.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_00160594` | 100 | `service_reference_state_44` at +0x64; `ipc_handle_slot_nu` at +0x68; `service_handle_replacement_41_b` at +0x6c | Decrement the reference count when positive and return while references remain. When the active byte is set, clear it, close the shared handle if present, report a negative close result, and install the established replacement handle. |
| `func_00166FE4` | 112 | none | When byte +21 is set, mark shutdown in progress, invoke two preparation destinations, wait indefinitely on the owned handle and report a negative result, mark completion, invoke delegated finalization, close and clear the handle, set word +16 to all ones, and clear byte +21. |
| `func_001780E8` | 104 | `service_unlink_context_44` at +0x68 | When handle +20 exists, clear paired state at +8/+12 or invoke service 32 according to byte +24. Report a negative service result, unlink the object from a symbolic context, then close and clear handle +20. |
| `func_0018C62C` | 128 | `service_completion_code_40` at +0x80; `service_thread_completion_counts_43` at +0x84 | Lock state +8, wait on handle +0 with the caller's `r2:r3` policy, report a negative result, and return whether the transformed result differs from the established completion code. On a differing result, invoke service 25, report a negative result, and increment the established indexed completion byte before unlocking. |
| `func_002DDD28` | 104 | `service_acquisition_input_44` at +0x68 | Acquire a replacement handle into a stack output using the symbolic input and forwarded arguments, report a negative acquisition result, close and clear the old owned handle when present, and install the acquired handle. |
| `func_0042D5E0` | 100 | `service_cleanup_vtable_44` at +0x64 | Install a symbolic vtable-like identity, finalize member +88 and clear it, close and clear the three optional handles at +100, +96, and +92, and return the original object. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; each following
pool belongs to the preceding section but is outside that function's body
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, stack operation, service-call
immediate, and local branch destination. In particular, the leading self-move
in `func_00160594` is a literal schedule entry.

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

.global func_00146000,func_00174DD0,service_mark_ready_secondary_44
.global func_001603A0,func_001781F0,func_0017E324
.global func_001602B8,func_00160380,func_002DE7D4,func_001397B8
.global service_reference_state_44,ipc_handle_slot_nu
.global service_handle_replacement_41_b,service_unlink_context_44
.global service_completion_code_40,service_thread_completion_counts_43
.global service_acquisition_input_44,service_cleanup_vtable_44

BEGIN func_00160594
mov r0,r0
ldr r0,.Lpool_00160594
ldr r1,[r0,#4]
cmp r1,#0
subgt r1,r1,#1
strgt r1,[r0,#4]
cmp r1,#0
bxne lr
ldrb r1,[r0]
cmp r1,#0
bxeq lr
push {r4,lr}
mov r1,#0
ldr r4,.Lpool_00160594+4
strb r1,[r0]
ldr r0,[r4]
cmp r0,#0
beq .Lfinish_00160594
svc #0x23
lsrs r0,r0,#31
blne func_00146000
ldr r0,.Lpool_00160594+8
ldr r0,[r0]
str r0,[r4]
.Lfinish_00160594:
pop {r4,pc}
END func_00160594
.Lpool_00160594:
.word service_reference_state_44
.word ipc_handle_slot_nu
.word service_handle_replacement_41_b

BEGIN func_00166FE4
push {r4,r5,r6,lr}
mov r4,r0
ldrb r0,[r0,#21]
cmp r0,#0
beq .Lfinish_00166FE4
mov r6,#1
strb r6,[r4,#20]
bl func_00174DD0
bl service_mark_ready_secondary_44
mvn r2,#0
ldr r0,[r4]
mov r5,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
mov r0,r4
strb r6,[r4,#4]
bl func_001781F0
ldr r0,[r4]
cmp r0,#0
beq .Lclear_00166FE4
svc #0x23
str r5,[r4]
.Lclear_00166FE4:
mvn r0,#0
str r0,[r4,#16]
strb r5,[r4,#21]
.Lfinish_00166FE4:
pop {r4,r5,r6,pc}
END func_00166FE4

BEGIN func_001780E8
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#20]
cmp r0,#0
beq .Lfinish_001780E8
ldr r1,[r4,#8]
mov r5,#0
cmp r1,#0
beq .Lclose_001780E8
ldrb r2,[r4,#24]
cmp r2,#0
streq r5,[r4,#8]
streq r5,[r4,#12]
beq .Lclose_001780E8
svc #0x20
lsrs r1,r0,#31
blne func_001603A0
ldr r0,.Lpool_001780E8
mov r1,r4
bl func_0017E324
.Lclose_001780E8:
ldr r0,[r4,#20]!
cmp r0,#0
beq .Lfinish_001780E8
svc #0x23
str r5,[r4]
.Lfinish_001780E8:
pop {r4,r5,r6,pc}
END func_001780E8
.Lpool_001780E8:
.word service_unlink_context_44

BEGIN func_0018C62C
push {r4,r5,r6,r7,r8,lr}
mov r6,r0
add r7,r0,#8
mov r4,r2
mov r5,r3
mov r0,r7
bl func_001602B8
ldr r0,[r6]
mov r2,r4
mov r3,r5
svc #0x24
lsrs r1,r0,#31
mov r4,r0
blne func_001603A0
ldr r0,.Lpool_0018C62C
cmp r0,r4,lsl #22
movne r4,#1
moveq r4,#0
beq .Lunlock_0018C62C
ldr r0,[r6]
svc #0x19
lsrs r1,r0,#31
blne func_001603A0
ldr r0,.Lpool_0018C62C+4
mov r1,r0
ldrb r0,[r0,r6]
add r0,r0,#1
strb r0,[r1,r6]
.Lunlock_0018C62C:
mov r0,r7
bl func_00160380
mov r0,r4
pop {r4,r5,r6,r7,r8,pc}
END func_0018C62C
.Lpool_0018C62C:
.word service_completion_code_40
.word service_thread_completion_counts_43

BEGIN func_002DDD28
push {r4,r5,lr}
mov r12,r1
ldr r1,.Lpool_002DDD28
sub sp,sp,#12
mov r5,#0
str r5,[sp,#8]
ldr r1,[r1]
mov r4,r0
ldr r0,[sp,#24]
str r3,[sp]
mov r3,r2
str r0,[sp,#4]
mov r2,r12
add r0,sp,#8
bl func_002DE7D4
lsrs r0,r0,#31
blne func_00146000
ldr r0,[r4]
cmp r0,#0
beq .Lreplace_002DDD28
svc #0x23
str r5,[r4]
.Lreplace_002DDD28:
ldr r0,[sp,#8]
str r0,[r4]
add sp,sp,#12
pop {r4,r5,pc}
END func_002DDD28
.Lpool_002DDD28:
.word service_acquisition_input_44

BEGIN func_0042D5E0
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,.Lpool_0042D5E0
str r0,[r4]
ldr r0,[r4,#88]
bl func_001397B8
mov r5,#0
str r5,[r4,#88]
ldr r0,[r4,#100]!
cmp r0,#0
beq .Lsecond_0042D5E0
svc #0x23
str r5,[r4]
.Lsecond_0042D5E0:
ldr r0,[r4,#-4]!
cmp r0,#0
beq .Lthird_0042D5E0
svc #0x23
str r5,[r4]
.Lthird_0042D5E0:
ldr r0,[r4,#-4]!
cmp r0,#0
beq .Lreturn_0042D5E0
svc #0x23
str r5,[r4]
.Lreturn_0042D5E0:
sub r0,r4,#92
pop {r4,r5,r6,pc}
END func_0042D5E0
.Lpool_0042D5E0:
.word service_cleanup_vtable_44
```

## Branch identity and relocation ledger

There are exactly fourteen symbolic external ARM branch sites: eight
`R_ARM_CALL` sites and six `R_ARM_JUMP24` sites.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_00160594` | (+0x50, JUMP24, `blne`, `func_00146000`) |
| `func_00166FE4` | (+0x1c, CALL, `bl`, `func_00174DD0`); (+0x20, CALL, `bl`, `service_mark_ready_secondary_44`); (+0x3c, JUMP24, `blne`, `func_001603A0`); (+0x48, CALL, `bl`, `func_001781F0`) |
| `func_001780E8` | (+0x40, JUMP24, `blne`, `func_001603A0`); (+0x4c, CALL, `bl`, `func_0017E324`) |
| `func_0018C62C` | (+0x18, CALL, `bl`, `func_001602B8`); (+0x34, JUMP24, `blne`, `func_001603A0`); (+0x58, JUMP24, `blne`, `func_001603A0`); (+0x74, CALL, `bl`, `func_00160380`) |
| `func_002DDD28` | (+0x38, CALL, `bl`, `func_002DE7D4`); (+0x40, JUMP24, `blne`, `func_00146000`) |
| `func_0042D5E0` | (+0x14, CALL, `bl`, `func_001397B8`) |

`func_00146000` is a two-site destination class and `func_001603A0` is a
four-site destination class. The other eight destination identities are
singletons, and all ten classes are pairwise distinct.

`service_mark_ready_secondary_44` begins at the aligned ARM entry immediately
following the inventoried body that contains its preceding code and has no
standalone function-start row. It is a direct `bl` destination, not a BLX
transfer, veneer, or alias of a primary entry. Every other destination,
including `func_0017E324`, is a four-byte-aligned primary ARM entry.

## Literal identity ledger and cumulative counts

The eight ordered pool slots form eight distinct IPC-template literal equality
classes. Four reuse established identities; the remaining four are new,
mutually distinct, and distinct from every earlier IPC-template identity.

| Identity | Ordered sites | Status and semantic role |
| --- | --- | --- |
| `service_reference_state_44` | `func_00160594 + 0x64` | New active byte and adjacent reference count. |
| `ipc_handle_slot_nu` | `func_00160594 + 0x68` | Reused shared handle slot. |
| `service_handle_replacement_41_b` | `func_00160594 + 0x6c` | Reused source for the replacement handle. |
| `service_unlink_context_44` | `func_001780E8 + 0x68` | New context passed with the object to the unlink destination. |
| `service_completion_code_40` | `func_0018C62C + 0x80` | Reused transformed completion-result comparison identity. |
| `service_thread_completion_counts_43` | `func_0018C62C + 0x84` | Reused byte table indexed by the completed object. |
| `service_acquisition_input_44` | `func_002DDD28 + 0x68` | New source word forwarded to the acquisition helper. |
| `service_cleanup_vtable_44` | `func_0042D5E0 + 0x64` | New vtable-like identity installed during cleanup. |

Consequently:

- reused earlier IPC literal identities: four;
- new literal identities: four;
- cumulative ordered pool slots: 572;
- cumulative literal identity classes: 286.

## Acceptance contract

An implementation is acceptable only when all of the following hold:

1. It defines exactly the six ARM functions above with the stated body sizes,
   four-byte alignment, global function symbols, and ARM mapping symbols.
2. Each function follows its complete normative mnemonic schedule exactly.
3. The object has exactly the fourteen ordered symbolic branch relocations and
   eight ordered `R_ARM_ABS32` pool relocations listed above.
4. The named secondary branch identity remains an aligned ARM direct-call
   destination without being conflated with a primary function entry;
   `func_0017E324` remains a primary entry with no relocation addend.
5. All eight literal sites are distinct classes. The four named reused
   identities retain their earlier physical identities; the four new
   identities are pairwise distinct and distinct from all earlier classes.
6. The batch extends the cumulative contract from 564 slots / 282 classes to
   exactly 572 slots / 286 classes.
7. The functions remain disjoint from all earlier neutral template manifests.
