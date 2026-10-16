# Probe-verified ARM service/IPC wrappers 41

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, branch-target resolution, physical literal
  identity comparison, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objcopy, objdump, and readelf 2.45.1.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers six still-unmatched ARM-state service adapters totaling
exactly 424 executable bytes. They close or replace owned service handles,
tear down synchronized state, finalize guarded state, and initialize a
close-aware object.

The selection is disjoint from every function named by the existing neutral
IPC-template manifests. Every selected function is reported as unmatched in
the current target report.

## Function and behavior inventory

All functions and all nine direct external destinations are ARM mode,
four-byte aligned primary entries.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_0010FF44` | 64 | `ipc_handle_slot_alpha` at +0x40; `service_absent_result_41_a` at +0x44; `service_handle_replacement_41_a` at +0x48 | If the shared handle is absent, select a symbolic result. Otherwise close it and replace the shared word from a symbolic source. Report a negative result and return it unchanged. |
| `func_00132EE8` | 60 | `service_absent_result_41_b` at +0x3c; `service_handle_replacement_41_b` at +0x40 | If the caller-owned handle is absent, return a symbolic result. Otherwise close it, report a negative close result, replace the caller word from a symbolic source, and return the close result. |
| `func_0013ADA8` | 92 | none | Enter synchronization for state +536, release the service object at +516, and report a negative result. If the byte at +528 was set, clear it, leave synchronization, and tail-transfer to the cleanup destination; otherwise leave synchronization and return zero. |
| `func_0013B0A8` | 80 | none | Run a preparation helper, close the handle at +8 when present, destroy the object at +24 through vtable slot +4 when present, and clear the words at +24, +28, and +32. |
| `func_00165A60` | 68 | `service_guard_state_41` at +0x44; `service_owned_handle_41` at +0x48; `service_finalize_token_41` at +0x4c | Clear a symbolic guard byte, pass the guard's following word to a helper, close and clear a symbolic owned handle when present, then finalize using a symbolic token. |
| `func_001FBE68` | 60 | `service_cleanup_vtable_41` at +0x3c | Install a symbolic vtable-like identity. If the handle at +4 is present, clear +12, close the handle, and clear +4. Return the original object. |

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

.global func_00124BA4,func_00146000,func_00150874
.global func_001602B8,func_00160380,func_001603A0
.global func_00145550,func_00174748,func_0017080C
.global ipc_handle_slot_alpha
.global service_absent_result_41_a,service_handle_replacement_41_a
.global service_absent_result_41_b,service_handle_replacement_41_b
.global service_guard_state_41,service_owned_handle_41
.global service_finalize_token_41,service_cleanup_vtable_41

BEGIN func_0010FF44
push {r4,lr}
ldr r4,.Lpool_0010FF44
ldr r0,[r4]
cmp r0,#0
ldreq r0,.Lpool_0010FF44+4
beq .Lfinish_0010FF44
svc #0x23
ldr r1,.Lpool_0010FF44+8
ldr r1,[r1]
str r1,[r4]
.Lfinish_0010FF44:
mov r4,r0
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
mov r0,r4
pop {r4,pc}
END func_0010FF44
.Lpool_0010FF44:
.word ipc_handle_slot_alpha
.word service_absent_result_41_a
.word service_handle_replacement_41_a

BEGIN func_00132EE8
push {r4,r5,r6,lr}
mov r5,r0
ldr r0,[r0]
cmp r0,#0
ldreq r4,.Lpool_00132EE8
beq .Lfinish_00132EE8
svc #0x23
mov r4,r0
lsrs r0,r0,#31
blne func_00146000
ldr r0,.Lpool_00132EE8+4
ldr r0,[r0]
str r0,[r5]
.Lfinish_00132EE8:
mov r0,r4
pop {r4,r5,r6,pc}
END func_00132EE8
.Lpool_00132EE8:
.word service_absent_result_41_b
.word service_handle_replacement_41_b

BEGIN func_0013ADA8
push {r4,r5,r6,lr}
mov r4,r0
add r5,r0,#536
mov r0,r5
bl func_001602B8
ldr r0,[r4,#516]
svc #0x19
lsrs r1,r0,#31
blne func_001603A0
ldrb r0,[r4,#528]
cmp r0,#0
beq .Lclear_return_0013ADA8
mov r0,#0
strb r0,[r4,#528]
mov r0,r5
bl func_00160380
pop {r4,r5,r6,lr}
b func_00145550
.Lclear_return_0013ADA8:
mov r4,#0
mov r0,r5
bl func_00160380
mov r0,r4
pop {r4,r5,r6,pc}
END func_0013ADA8

BEGIN func_0013B0A8
push {r4,r5,r6,lr}
mov r4,r0
bl func_00150874
ldr r0,[r4,#8]
mov r6,#0
add r5,r4,#8
cmp r0,#0
beq .Lskip_handle_0013B0A8
svc #0x23
str r6,[r5]
.Lskip_handle_0013B0A8:
ldr r0,[r4,#24]
cmp r0,#0
beq .Lclear_state_0013B0A8
ldr r1,[r0]
ldr r1,[r1,#4]
blx r1
str r6,[r4,#24]
.Lclear_state_0013B0A8:
str r6,[r4,#28]
str r6,[r4,#32]
pop {r4,r5,r6,pc}
END func_0013B0A8

BEGIN func_00165A60
ldr r0,.Lpool_00165A60
push {r3,r4,r5,lr}
mov r5,#0
strb r5,[r0]
ldr r0,[r0,#4]
str r0,[sp]
mov r0,sp
bl func_00174748
ldr r4,.Lpool_00165A60+4
ldr r0,[r4]
cmp r0,#0
beq .Lskip_close_00165A60
svc #0x23
str r5,[r4]
.Lskip_close_00165A60:
ldr r0,.Lpool_00165A60+8
bl func_0017080C
pop {r3,r4,r5,pc}
END func_00165A60
.Lpool_00165A60:
.word service_guard_state_41
.word service_owned_handle_41
.word service_finalize_token_41

BEGIN func_001FBE68
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,.Lpool_001FBE68
str r0,[r4]
ldr r0,[r4,#4]
cmp r0,#0
beq .Lfinish_001FBE68
mov r6,#0
str r6,[r4,#12]
ldr r0,[r4,#4]
add r5,r4,#4
svc #0x23
str r6,[r5]
.Lfinish_001FBE68:
mov r0,r4
pop {r4,r5,r6,pc}
END func_001FBE68
.Lpool_001FBE68:
.word service_cleanup_vtable_41
```

## Branch identity and relocation ledger

There are exactly ten symbolic external ARM branch sites: six `R_ARM_CALL`
sites and four `R_ARM_JUMP24` sites. The register-indirect `blx r1` in
`func_0013B0A8` is part of the schedule but has no relocation.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_0010FF44` | (+0x34, JUMP24, `blne`, `func_00124BA4`) |
| `func_00132EE8` | (+0x24, JUMP24, `blne`, `func_00146000`) |
| `func_0013ADA8` | (+0x10, CALL, `bl`, `func_001602B8`); (+0x20, JUMP24, `blne`, `func_001603A0`); (+0x3c, CALL, `bl`, `func_00160380`); (+0x44, JUMP24, `b`, `func_00145550`); (+0x50, CALL, `bl`, `func_00160380`) |
| `func_0013B0A8` | (+0x08, CALL, `bl`, `func_00150874`) |
| `func_00165A60` | (+0x1c, CALL, `bl`, `func_00174748`); (+0x3c, CALL, `bl`, `func_0017080C`) |
| `func_001FBE68` | none |

`func_00160380` is the sole shared destination class, with two sites. The
other eight destination identities are singleton classes, and all nine
destination classes are pairwise distinct.

## Literal identity ledger and cumulative counts

The nine ordered pool slots form nine physical equality classes. One class,
`ipc_handle_slot_alpha`, is reused from earlier IPC-template batches. The
remaining eight identities are new singleton classes, pairwise distinct from
one another and from every earlier IPC-template literal identity.

| Identity | Ordered sites | Semantic role |
| --- | --- | --- |
| `ipc_handle_slot_alpha` | `func_0010FF44 + 0x40` | Established shared service-handle word. |
| `service_absent_result_41_a` | `func_0010FF44 + 0x44` | Result selected when the shared handle is absent. |
| `service_handle_replacement_41_a` | `func_0010FF44 + 0x48` | Source whose word replaces the closed shared handle. |
| `service_absent_result_41_b` | `func_00132EE8 + 0x3c` | Result selected when the caller-owned handle is absent. |
| `service_handle_replacement_41_b` | `func_00132EE8 + 0x40` | Source whose word replaces the caller-owned handle. |
| `service_guard_state_41` | `func_00165A60 + 0x44` | Guard byte and adjacent helper input. |
| `service_owned_handle_41` | `func_00165A60 + 0x48` | Optional handle closed and cleared during finalization. |
| `service_finalize_token_41` | `func_00165A60 + 0x4c` | Token passed to the finalization helper. |
| `service_cleanup_vtable_41` | `func_001FBE68 + 0x3c` | Vtable-like identity installed into the initialized object. |

Consequently:

- reused earlier IPC literal identities: one;
- new literal identities: eight;
- cumulative ordered pool slots: 545;
- cumulative literal identity classes: 271.

## Acceptance contract

An implementation is acceptable only when all of the following hold:

1. It defines exactly the six ARM functions above with the stated body sizes,
   four-byte alignment, global function symbols, and ARM mapping symbols.
2. Each function follows its complete normative mnemonic schedule exactly.
3. The object has exactly the ten ordered symbolic branch relocations and nine
   ordered `R_ARM_ABS32` pool relocations listed above.
4. The `ipc_handle_slot_alpha` slot reuses the established earlier identity;
   the remaining eight literal identities are new singleton classes, pairwise
   distinct from one another and from all earlier IPC-template classes.
5. The batch extends the cumulative contract from 536 slots / 263 classes to
   exactly 545 slots / 271 classes.
6. The functions remain disjoint from all earlier neutral template manifests.

