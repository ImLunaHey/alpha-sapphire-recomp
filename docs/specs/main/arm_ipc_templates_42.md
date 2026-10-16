# Probe-verified ARM service/IPC wrappers 42

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
exactly 428 executable bytes. They acquire and close a temporary resource,
wait on shared state before delegated cleanup, tear down owned handles, and
dispatch close-aware state through a guarded shared service object.

The selection is disjoint from every function named by the existing neutral
IPC-template manifests. Every selected function is reported as unmatched in
the current target report.

## Function and behavior inventory

All functions and all five direct external destinations are ARM mode,
four-byte aligned primary entries.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_0010703C` | 80 | `service_resource_state_42` at +0x50 | Initialize two stack words from symbolic resource state, acquire a temporary handle through the output-handle helper, invoke service 58 with the resulting stack arguments, close the temporary handle, and return the service-produced stack word. |
| `func_001260B4` | 48 | `service_wait_handle_42` at +0x30 | When the symbolic handle is present, invoke service 36 with two all-ones policy words and report a negative result. In every case, tail-transfer to the cleanup destination. |
| `func_003BAF98` | 56 | `service_cleanup_vtable_42_a` at +0x38 | Install a symbolic vtable-like identity, close and clear the handle at +16 when present, then tail-transfer the original object to the base cleanup destination. |
| `func_002BC658` | 80 | `service_cleanup_vtable_42_b` at +0x50 | Install a symbolic vtable-like identity, clear word +40, preserve the target's exact pointer-adjustment sequence, close and clear the handle at +84 when present, and return the original object. |
| `func_002CC8D0` | 80 | `service_nonpositive_result_42` at +0x50; `service_dispatch_state_42` at +0x54; `service_unavailable_result_42` at +0x58 | Return a symbolic result when count +4 is nonpositive. Otherwise close handle +8; if shared dispatch is unavailable, clear the count and return a second symbolic result. If available, dispatch the count through state +44, clear the count, and return the helper result. |
| `func_002CC9F8` | 84 | `service_cleanup_vtable_42_c` at +0x54; `service_dispatch_state_42` at +0x58 | Install a symbolic vtable-like identity. For a positive count at +4, close handle +8, conditionally dispatch the count through shared state +44, and clear the count. Return the original object. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; each following
pool belongs to the preceding section but is outside that function's body
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, stack operation, service-call
immediate, and local branch destination. In particular, the two self-moves in
`func_002BC658` are literal schedule entries rather than assembler `nop`
aliases.

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

.global func_00108808,func_001603A0,func_001103FC
.global func_003BD0B8,func_002CCD5C
.global service_resource_state_42,service_wait_handle_42
.global service_cleanup_vtable_42_a,service_cleanup_vtable_42_b
.global service_nonpositive_result_42,service_dispatch_state_42
.global service_unavailable_result_42,service_cleanup_vtable_42_c

BEGIN func_0010703C
push {lr}
sub sp,sp,#20
mov r0,#0
str r0,[sp,#8]
ldr r0,.Lpool_0010703C
ldr r1,[r0,#8]
str r1,[sp,#12]
ldr r1,[r0]
add r0,sp,#8
bl func_00108808
ldr r1,[sp,#8]
mov r3,#1
add r2,sp,#12
mov r0,sp
svc #0x3a
ldr r0,[sp,#8]
svc #0x23
ldr r0,[sp]
add sp,sp,#20
pop {pc}
END func_0010703C
.Lpool_0010703C:
.word service_resource_state_42

BEGIN func_001260B4
ldr r0,.Lpool_001260B4
push {r4,lr}
ldr r0,[r0]
cmp r0,#0
beq .Lfinish_001260B4
mvn r2,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
.Lfinish_001260B4:
pop {r4,lr}
b func_001103FC
END func_001260B4
.Lpool_001260B4:
.word service_wait_handle_42

BEGIN func_003BAF98
push {r4,r5,r6,lr}
mov r5,r0
ldr r0,.Lpool_003BAF98
add r4,r5,#16
str r0,[r5]
ldr r0,[r5,#16]
cmp r0,#0
beq .Ltail_003BAF98
svc #0x23
mov r0,#0
str r0,[r4]
.Ltail_003BAF98:
mov r0,r5
pop {r4,r5,r6,lr}
b func_003BD0B8
END func_003BAF98
.Lpool_003BAF98:
.word service_cleanup_vtable_42_a

BEGIN func_002BC658
ldr r1,.Lpool_002BC658
push {r4,r5,r6,lr}
mov r6,#0
str r1,[r0]
str r6,[r0,#40]
add r0,r0,#4096
add r0,r0,#324
mov r0,r0
sub r0,r0,#4096
sub r0,r0,#168
mov r0,r0
sub r5,r0,#156
sub r4,r0,#72
ldr r0,[r0,#-72]
cmp r0,#0
beq .Lfinish_002BC658
svc #0x23
str r6,[r4]
.Lfinish_002BC658:
mov r0,r5
pop {r4,r5,r6,pc}
END func_002BC658
.Lpool_002BC658:
.word service_cleanup_vtable_42_b

BEGIN func_002CC8D0
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#4]
mov r5,#0
cmp r0,#0
ldrle r0,.Lpool_002CC8D0
ble .Lreturn_002CC8D0
ldr r0,[r4,#8]
svc #0x23
ldr r0,.Lpool_002CC8D0+4
ldrb r1,[r0,#4]
cmp r1,#0
ldreq r0,.Lpool_002CC8D0+8
addne r0,r0,#44
streq r5,[r4,#4]
beq .Lreturn_002CC8D0
ldr r1,[r4,#4]
bl func_002CCD5C
str r5,[r4,#4]
.Lreturn_002CC8D0:
pop {r4,r5,r6,pc}
END func_002CC8D0
.Lpool_002CC8D0:
.word service_nonpositive_result_42
.word service_dispatch_state_42
.word service_unavailable_result_42

BEGIN func_002CC9F8
push {r4,r5,r6,lr}
mov r4,r0
ldr r1,[r0,#4]
ldr r0,.Lpool_002CC9F8
cmp r1,#0
str r0,[r4]
ble .Lfinish_002CC9F8
ldr r0,[r4,#8]
svc #0x23
ldr r0,.Lpool_002CC9F8+4
mov r5,#0
ldrb r1,[r0,#4]
cmp r1,#0
addne r0,r0,#44
streq r5,[r4,#4]
beq .Lfinish_002CC9F8
ldr r1,[r4,#4]
bl func_002CCD5C
str r5,[r4,#4]
.Lfinish_002CC9F8:
mov r0,r4
pop {r4,r5,r6,pc}
END func_002CC9F8
.Lpool_002CC9F8:
.word service_cleanup_vtable_42_c
.word service_dispatch_state_42
```

## Branch identity and relocation ledger

There are exactly six symbolic external ARM branch sites: three `R_ARM_CALL`
sites and three `R_ARM_JUMP24` sites.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_0010703C` | (+0x24, CALL, `bl`, `func_00108808`) |
| `func_001260B4` | (+0x24, JUMP24, `blne`, `func_001603A0`); (+0x2c, JUMP24, `b`, `func_001103FC`) |
| `func_003BAF98` | (+0x34, JUMP24, `b`, `func_003BD0B8`) |
| `func_002BC658` | none |
| `func_002CC8D0` | (+0x44, CALL, `bl`, `func_002CCD5C`) |
| `func_002CC9F8` | (+0x44, CALL, `bl`, `func_002CCD5C`) |

`func_002CCD5C` is the sole shared destination class, with two sites. The
other four destination identities are singleton classes, and all five
destination classes are pairwise distinct.

## Literal identity ledger and cumulative counts

The nine ordered pool slots form eight new IPC-template literal equality
classes. `service_dispatch_state_42` is shared by the two related dispatch
adapters. Every other identity is a singleton, distinct from that shared
identity, from the other identities in this batch, and from all earlier
IPC-template literal identities.

| Identity | Ordered sites | Semantic role |
| --- | --- | --- |
| `service_resource_state_42` | `func_0010703C + 0x50` | Resource state supplying the acquisition input and adjacent policy word. |
| `service_wait_handle_42` | `func_001260B4 + 0x30` | Optional shared handle waited on before delegated cleanup. |
| `service_cleanup_vtable_42_a` | `func_003BAF98 + 0x38` | Vtable-like identity installed by the first cleanup adapter. |
| `service_cleanup_vtable_42_b` | `func_002BC658 + 0x50` | Vtable-like identity installed by the offset-adjusting cleanup adapter. |
| `service_nonpositive_result_42` | `func_002CC8D0 + 0x50` | Result returned when the pending count is nonpositive. |
| `service_dispatch_state_42` | `func_002CC8D0 + 0x54`; `func_002CC9F8 + 0x58` | Shared availability byte and dispatch object. |
| `service_unavailable_result_42` | `func_002CC8D0 + 0x58` | Result returned when shared dispatch is unavailable. |
| `service_cleanup_vtable_42_c` | `func_002CC9F8 + 0x54` | Vtable-like identity installed by the second dispatch adapter. |

Consequently:

- reused earlier IPC literal identities: zero;
- new literal identities: eight;
- cumulative ordered pool slots: 554;
- cumulative literal identity classes: 279.

## Acceptance contract

An implementation is acceptable only when all of the following hold:

1. It defines exactly the six ARM functions above with the stated body sizes,
   four-byte alignment, global function symbols, and ARM mapping symbols.
2. Each function follows its complete normative mnemonic schedule exactly.
3. The object has exactly the six ordered symbolic branch relocations and nine
   ordered `R_ARM_ABS32` pool relocations listed above.
4. `service_dispatch_state_42` is one two-site literal equality class; the
   remaining seven literal identities are singleton classes. All eight are
   new and pairwise distinct from every earlier IPC-template class.
5. The batch extends the cumulative contract from 545 slots / 271 classes to
   exactly 554 slots / 279 classes.
6. The functions remain disjoint from all earlier neutral template manifests.
