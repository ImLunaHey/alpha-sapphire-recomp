# Probe-verified ARM service/IPC wrappers 35

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, physical literal identity comparison, and an
  independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objcopy, objdump, and readelf
  2.45.1.20251203 from Arm GNU Toolchain 15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers thirteen still-unmatched ARM-state thin service adapters
totaling exactly 448 executable bytes. Each reaches an already specified IPC
operation directly or through the same small lifecycle layer. The set includes
checked status adapters, stack-result adapters, two acquire/operate/release
wrappers, two frame-restoring failure tail transfers, one guarded IPC tail
transfer, and two result-copy adapters.

The batch is disjoint from duplicate batch 39 (`func_001628A0`,
`func_00163AA4`, `func_00172534`, `func_00173064`, `func_00270F44`,
`func_00278924`, `func_00287E00`, `func_0028F9E0`, `func_002914EC`,
`func_002948AC`, `func_0029DB3C`, and `func_0029FAC4`) and runtime batch 39
(`func_00337AB8`, `func_003AACD8`, `func_003C8BC4`, `func_004AAFAC`,
`func_004AB108`, and `func_004C2430`).

## Function, pool, and behavior inventory

All functions and external destinations are ARM mode, four-byte aligned
primary entries. Pool offsets are relative to the executable body.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_0010EC28` | 32 | none | Obtain one word from `func_001240C4`, place it in a stack cell, and invoke `func_001182D0` with the cell and entry `r0`. |
| `func_0010F1F4` | 32 | none | Zero a stack byte, invoke `func_00118C94` on it, and return the resulting unsigned byte. |
| `func_00118294` | 36 | `service_state_slot_35` at +0x24; `service_request_kind_35` at +0x28 | Store entry `r0` both at state offset +16 and in a stack cell, submit the cell with the request identity, and return zero. |
| `func_00118578` | 28 | none | Invoke `func_00125584`; return normally when its sign bit is clear, otherwise restore the frame and tail-transfer to `func_00146000`. |
| `func_0011B11C` | 44 | none | Run acquire, `func_001266B4`, and release in order while preserving the IPC result across release. |
| `func_0011B818` | 44 | none | Run acquire/setup, invoke `func_001266FC` with entry `r0` as its second argument, report a negative status, and tail-transfer to release. |
| `func_0012437C` | 32 | none | Query one stack byte with `func_00145FC0`, report a negative status, and return the byte sign-extended. |
| `func_00125DC0` | 36 | `service_initialized_byte_35` at +0x24; `service_session_object_35` at +0x28 | Return immediately when the initialization byte is zero; otherwise tail-transfer to `func_00125E50` with the shared session object and zero. |
| `func_001265DC` | 36 | none | Run acquire/setup, invoke `func_00133ECC`, report a negative status, and tail-transfer to release. |
| `func_00178238` | 40 | none | Invoke `func_00124838` with a stack output pair, report a negative status, and return the complete doubleword. |
| `func_0020282C` | 20 | none | Preserve entry `r0` across `func_002028C4` and return that original value. |
| `func_00203050` | 40 | none | Query a stack word with `func_002030EC`; on nonnegative status copy its low byte to entry `r0` and return zero, otherwise preserve the status. |
| `func_002C669C` | 28 | none | Invoke `func_002C6660`; return normally when its sign bit is clear, otherwise restore the frame and tail-transfer to `func_00146000`. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body before any
ordered symbolic pool words. Labels and directives occupy no executable bytes.
Preserve every mnemonic, operand, register, condition, stack operation, local
branch destination, and pool order. In particular, the two leading
`mov r0,r0` instructions are the legacy move encoding and must not be replaced
by the architecturally equivalent `nop` mnemonic.

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

.global func_001240C4,func_001182D0,func_00118C94,func_0012408C
.global func_00125584,func_00146000,func_001260B4,func_001266B4
.global func_00126414,func_00126000,func_001266FC,func_00124BA4
.global func_00145FC0,func_00124FB0,func_00125E50,func_00133ECC
.global func_00124838,func_002028C4,func_002030EC,func_002C6660
.global service_state_slot_35,service_request_kind_35
.global service_initialized_byte_35,service_session_object_35

BEGIN func_0010EC28
push {r3,r4,r5,lr}
mov r4,r0
bl func_001240C4
str r0,[sp]
mov r1,r4
mov r0,sp
bl func_001182D0
pop {r3,r4,r5,pc}
END func_0010EC28

BEGIN func_0010F1F4
mov r0,r0
push {r3,lr}
mov r0,#0
strb r0,[sp]
mov r0,sp
bl func_00118C94
ldrb r0,[sp]
pop {r3,pc}
END func_0010F1F4

BEGIN func_00118294
ldr r1,.Lpool_00118294
push {r3,lr}
str r0,[r1,#16]
str r0,[sp]
ldr r1,.Lpool_00118294+4
mov r0,sp
bl func_0012408C
mov r0,#0
pop {r3,pc}
END func_00118294
.Lpool_00118294:
.word service_state_slot_35
.word service_request_kind_35

BEGIN func_00118578
push {r4,lr}
bl func_00125584
lsrs r0,r0,#31
beq .Lreturn_00118578
pop {r4,lr}
b func_00146000
.Lreturn_00118578:
pop {r4,pc}
END func_00118578

BEGIN func_0011B11C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl func_001260B4
mov r1,r5
mov r0,r4
bl func_001266B4
mov r4,r0
bl func_00126414
mov r0,r4
pop {r4,r5,r6,pc}
END func_0011B11C

BEGIN func_0011B818
push {r4,lr}
mov r4,r0
bl func_001260B4
bl func_00126000
mov r1,r4
bl func_001266FC
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
pop {r4,lr}
b func_00126414
END func_0011B818

BEGIN func_0012437C
push {r3,lr}
mov r0,sp
bl func_00145FC0
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrsb r0,[sp]
pop {r3,pc}
END func_0012437C

BEGIN func_00125DC0
mov r0,r0
ldr r0,.Lpool_00125DC0
ldrb r0,[r0]
cmp r0,#0
beq .Lreturn_00125DC0
ldr r0,.Lpool_00125DC0+4
mov r1,#0
b func_00125E50
.Lreturn_00125DC0:
bx lr
END func_00125DC0
.Lpool_00125DC0:
.word service_initialized_byte_35
.word service_session_object_35

BEGIN func_001265DC
push {r4,lr}
bl func_001260B4
bl func_00126000
bl func_00133ECC
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
pop {r4,lr}
b func_00126414
END func_001265DC

BEGIN func_00178238
push {lr}
sub sp,sp,#12
mov r1,sp
bl func_00124838
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrd r0,[sp]
add sp,sp,#12
pop {pc}
END func_00178238

BEGIN func_0020282C
push {r4,lr}
mov r4,r0
bl func_002028C4
mov r0,r4
pop {r4,pc}
END func_0020282C

BEGIN func_00203050
push {r3,r4,r5,lr}
mov r4,r0
mov r0,sp
bl func_002030EC
lsrs r1,r0,#31
bne .Lreturn_00203050
ldr r0,[sp]
strb r0,[r4]
mov r0,#0
.Lreturn_00203050:
pop {r3,r4,r5,pc}
END func_00203050

BEGIN func_002C669C
push {r4,lr}
bl func_002C6660
lsrs r0,r0,#31
beq .Lreturn_002C669C
pop {r4,lr}
b func_00146000
.Lreturn_002C669C:
pop {r4,pc}
END func_002C669C
```

## Branch identity and relocation ledger

There are exactly 28 external ARM branch sites: nineteen `R_ARM_CALL` sites
and nine `R_ARM_JUMP24` sites. The jump relocations comprise four conditional
`blne` calls and five unconditional tail branches. Local `beq` and `bne`
transfers are not relocations.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_0010EC28` | (+0x08, CALL, `bl`, `func_001240C4`); (+0x18, CALL, `bl`, `func_001182D0`) |
| `func_0010F1F4` | (+0x14, CALL, `bl`, `func_00118C94`) |
| `func_00118294` | (+0x18, CALL, `bl`, `func_0012408C`) |
| `func_00118578` | (+0x04, CALL, `bl`, `func_00125584`); (+0x14, JUMP24, `b`, `func_00146000`) |
| `func_0011B11C` | (+0x0c, CALL, `bl`, `func_001260B4`); (+0x18, CALL, `bl`, `func_001266B4`); (+0x20, CALL, `bl`, `func_00126414`) |
| `func_0011B818` | (+0x08, CALL, `bl`, `func_001260B4`); (+0x0c, CALL, `bl`, `func_00126000`); (+0x14, CALL, `bl`, `func_001266FC`); (+0x20, JUMP24, `blne`, `func_00124BA4`); (+0x28, JUMP24, `b`, `func_00126414`) |
| `func_0012437C` | (+0x08, CALL, `bl`, `func_00145FC0`); (+0x14, JUMP24, `blne`, `func_00124FB0`) |
| `func_00125DC0` | (+0x1c, JUMP24, `b`, `func_00125E50`) |
| `func_001265DC` | (+0x04, CALL, `bl`, `func_001260B4`); (+0x08, CALL, `bl`, `func_00126000`); (+0x0c, CALL, `bl`, `func_00133ECC`); (+0x18, JUMP24, `blne`, `func_00124BA4`); (+0x20, JUMP24, `b`, `func_00126414`) |
| `func_00178238` | (+0x0c, CALL, `bl`, `func_00124838`); (+0x18, JUMP24, `blne`, `func_00124FB0`) |
| `func_0020282C` | (+0x08, CALL, `bl`, `func_002028C4`) |
| `func_00203050` | (+0x0c, CALL, `bl`, `func_002030EC`) |
| `func_002C669C` | (+0x04, CALL, `bl`, `func_002C6660`); (+0x14, JUMP24, `b`, `func_00146000`) |

The twenty destination equality classes account for all 28 sites:

| Destination identity | Equal sites and exact forms |
| --- | --- |
| `func_001260B4` | three `bl` / CALL |
| `func_00126414` | one `bl` / CALL and two `b` / JUMP24 |
| `func_00126000` | two `bl` / CALL |
| `func_00124BA4` | two `blne` / JUMP24 |
| `func_00124FB0` | two `blne` / JUMP24 |
| `func_00146000` | two `b` / JUMP24 |
| `func_001240C4`, `func_001182D0`, `func_00118C94`, `func_0012408C`, `func_00125584`, `func_001266B4`, `func_001266FC`, `func_00145FC0`, `func_00125E50`, `func_00133ECC`, `func_00124838`, `func_002028C4`, `func_002030EC`, `func_002C6660` | one `bl` / CALL each, except `func_00125E50`, which is one `b` / JUMP24 |

Target-side entry re-audit proves all twenty classes are pairwise distinct
four-byte-aligned primary ARM entries. No site targets a secondary entry or
interworking veneer, and there are no BLX or indirect transfers.

## Semantic branch contracts

- `func_00118578` and `func_002C669C` deliberately use a local `beq` around a
  frame-restoring pop and unconditional tail transfer. They must not become
  conditional external calls.
- `func_0011B11C` preserves the result of `func_001266B4` in `r4` while
  `func_00126414` runs, then returns that preserved result.
- `func_0011B818` and `func_001265DC` always restore their frames and
  tail-transfer to `func_00126414`, including after a reported negative
  operation status.
- `func_0012437C` returns a sign-extended byte; `func_0010F1F4` returns an
  unsigned byte; and `func_00178238` returns both words of its result.
- `func_00125DC0` tests the initialization byte before loading the session
  object. Its enabled path is a tail transfer with `r1` explicitly zero.
- `func_00203050` treats only a clear sign bit as success. Its success path
  truncates the stack word to a byte and replaces the return value with zero;
  its failure path leaves the operation status unchanged.

## Literal equality and cumulative contract

There are exactly four ordered `R_ARM_ABS32` pool slots in four equality
classes:

| Identity | Site | Semantic contract |
| --- | --- | --- |
| `service_state_slot_35` | `func_00118294 + 0x24` | Address of the state object whose word +16 receives entry `r0`. |
| `service_request_kind_35` | `func_00118294 + 0x28` | Opaque request identity passed as the second argument to `func_0012408C`. |
| `service_initialized_byte_35` | `func_00125DC0 + 0x24` | Address of the byte that guards the service tail transfer. |
| `service_session_object_35` | `func_00125DC0 + 0x28` | Shared object passed as the first argument to `func_00125E50`. |

Direct physical target comparison proves the four identities are pairwise
unequal and unequal to every prior cumulative IPC literal class. Adding four
slots and four classes to batches 12, 13, and 15 through 34 yields exactly
**523 ordered pool slots in 253 equality classes**. Pool words remain symbolic;
their private values are neither required nor permitted in an implementation.

## Exact-probe evidence

The independent probe assembled the complete schedules above as thirteen
separate aligned ARM sections. `readelf` reported exactly 32 relocations:
nineteen `R_ARM_CALL`, nine `R_ARM_JUMP24`, and four `R_ARM_ABS32`, with the
precise offsets, identities, conditions, equality, and pool order in the
ledgers above.

For every function, the probe section was compared with the bounded private
target extent after normalizing only its external branch words and excluding
its symbolic pool words. All remaining body bytes, including local branch
displacements, leading legacy moves, stack schedules, and result widths, were
exactly equal:

| Function | Exact body bytes |
| --- | ---: |
| `func_0010EC28` | 32 |
| `func_0010F1F4` | 32 |
| `func_00118294` | 36 |
| `func_00118578` | 28 |
| `func_0011B11C` | 44 |
| `func_0011B818` | 44 |
| `func_0012437C` | 32 |
| `func_00125DC0` | 36 |
| `func_001265DC` | 36 |
| `func_00178238` | 40 |
| `func_0020282C` | 20 |
| `func_00203050` | 40 |
| `func_002C669C` | 28 |
| **Total** | **448** |

The normalized external branch words were independently decoded from the
target and resolved to the exact ordered ARM identities above. Direct target
pool comparison independently established the four classes and their stated
cross-batch inequalities. The current objdiff report identifies all thirteen
function bodies as unmatched before this batch.

## Implementation constraints

- Implement exactly the thirteen schedules above in one ARM assembly unit.
- Preserve function order, body sizes, local branch destinations, stack
  layouts, conditions, result widths, leading legacy moves, and pool order.
- Preserve all three failure mechanisms as distinct identities:
  `func_00124BA4`, `func_00124FB0`, and `func_00146000`.
- Preserve the frame-restoring failure tails and the unconditional release
  tails; do not convert them into ordinary calls.
- Keep all four pool words symbolic and distinct. Do not introduce raw target
  bytes, instruction encodings, anonymous data words, or private addresses.
