# Probe-verified ARM service/IPC wrappers 39

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, branch-target resolution, literal-identity
  comparison, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, linker, objcopy, objdump, and readelf
  2.45.1.20251203 from Arm GNU Toolchain 15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers six still-unmatched ARM-state service adapters totaling
exactly 364 executable bytes. The set contains a transfer-result normalizer,
two lazy or fallback service-state accessors, a size-selecting service
dispatcher, and a pair of required-handle accessors.

The selection is disjoint from every function named by the existing neutral
template manifests. Every selected function is reported as unmatched in the
current target report.

## Function and behavior inventory

All functions and direct external destinations are ARM mode, four-byte aligned
primary entries.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_001F461C` | 108 | `service_result_normalization_39` at +0x6c | Build a small transfer record around the entry doubleword, obtain a service word, submit the record, map one bounded result-code family to the symbolic normalization value, and otherwise return zero for nonnegative status or the unchanged negative status. |
| `func_001F78E8` | 28 | `lazy_service_cell_39` at +0x1c | Read a symbolic service cell, invoke the failure helper when it is zero, then reload and return the cell. |
| `func_001FAFD8` | 76 | `service_default_word_39` at +0x4c; `service_fallback_state_39` at +0x50 | Seed a stack word from a symbolic default. With a non-null entry argument, query a replacement and report negative status; with a null argument, load the replacement through symbolic fallback state. Return the selected word. |
| `func_001FB388` | 80 | `service_filtered_status_39` at +0x50 | Dispatch requests of at most 252 bytes to one service helper and larger requests to another, preserve the result, and report negative statuses except for the schedule's filtered status family and symbolic exception. |
| `func_004A7960` | 36 | `required_handle_error_39` at +0x24 | Return object word +4; if it is zero, report the shared symbolic required-handle failure first, then reload it. |
| `func_004A79A8` | 36 | `required_handle_error_39` at +0x24 | Same required-handle accessor schedule as `func_004A7960`, with the same literal identity. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; each following
pool belongs to the preceding section but is outside that function's body
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, stack operation, and local branch
destination. In particular, the leading `mov r0,r0` in `func_001FAFD8` is the
legacy move encoding, while the `nop` in `func_001FB388` is the architectural
hint instruction; they are not interchangeable.

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

.global func_001240C4,func_001F72F4,func_00146000,func_001FB6AC
.global func_00124FB0,func_001FB6F8,func_001FB4CC
.global service_result_normalization_39,lazy_service_cell_39
.global service_default_word_39,service_fallback_state_39
.global service_filtered_status_39,required_handle_error_39

BEGIN func_001F461C
push {lr}
sub sp,sp,#20
mov r3,#0
mov r2,#1
strh r3,[sp,#2]
strb r2,[sp]
strb r3,[sp,#1]
strd r0,[sp,#4]
bl func_001240C4
str r0,[sp,#12]
mov r1,sp
add r0,sp,#12
bl func_001F72F4
and r1,r0,#0x3fc00
lsr r1,r1,#10
cmp r1,#17
bne .Lnormalize_001F461C
lsl r1,r0,#22
lsr r1,r1,#22
cmp r1,#220
blt .Lnormalize_001F461C
cmp r1,#229
ldrle r0,.Lpool_001F461C
.Lnormalize_001F461C:
add sp,sp,#20
lsrs r1,r0,#31
moveq r0,#0
pop {pc}
END func_001F461C
.Lpool_001F461C:
.word service_result_normalization_39

BEGIN func_001F78E8
push {r4,lr}
ldr r4,.Lpool_001F78E8
ldr r0,[r4]
cmp r0,#0
bleq func_00146000
ldr r0,[r4]
pop {r4,pc}
END func_001F78E8
.Lpool_001F78E8:
.word lazy_service_cell_39

BEGIN func_001FAFD8
mov r0,r0
ldr r1,.Lpool_001FAFD8
push {r3,lr}
cmp r0,#0
str r1,[sp]
beq .Lfallback_001FAFD8
mov r1,r0
mov r0,sp
bl func_001FB6AC
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
pop {r3,pc}
.Lfallback_001FAFD8:
ldr r0,.Lpool_001FAFD8+4
ldr r0,[r0,#12]
ldr r0,[r0]
str r0,[sp]
pop {r3,pc}
END func_001FAFD8
.Lpool_001FAFD8:
.word service_default_word_39
.word service_fallback_state_39

BEGIN func_001FB388
cmp r1,#252
push {r4,lr}
bhi .Llarge_001FB388
bl func_001FB6F8
b .Lstatus_001FB388
.Llarge_001FB388:
nop
bl func_001FB4CC
.Lstatus_001FB388:
lsrs r1,r0,#31
mov r4,r0
beq .Lreturn_001FB388
tst r0,#0x80000000
lsr r1,r0,#27
subne r1,r1,#32
cmn r1,#7
ldrne r1,.Lpool_001FB388
cmpne r0,r1
movne r1,pc
blne func_00124FB0
.Lreturn_001FB388:
mov r0,r4
pop {r4,pc}
END func_001FB388
.Lpool_001FB388:
.word service_filtered_status_39

BEGIN func_004A7960
push {r4,lr}
mov r4,r0
ldr r0,[r0,#4]
cmp r0,#0
ldreq r0,.Lpool_004A7960
moveq r1,pc
bleq func_00124FB0
ldr r0,[r4,#4]
pop {r4,pc}
END func_004A7960
.Lpool_004A7960:
.word required_handle_error_39

BEGIN func_004A79A8
push {r4,lr}
mov r4,r0
ldr r0,[r0,#4]
cmp r0,#0
ldreq r0,.Lpool_004A79A8
moveq r1,pc
bleq func_00124FB0
ldr r0,[r4,#4]
pop {r4,pc}
END func_004A79A8
.Lpool_004A79A8:
.word required_handle_error_39
```

## Branch identity and relocation ledger

There are exactly ten symbolic external ARM branch sites: five `R_ARM_CALL`
sites and five `R_ARM_JUMP24` sites. Four jump relocations are conditional
calls to the shared status reporter; the fifth is a conditional call to the
zero-cell failure helper.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_001F461C` | (+0x20, CALL, `bl`, `func_001240C4`); (+0x30, CALL, `bl`, `func_001F72F4`) |
| `func_001F78E8` | (+0x10, JUMP24, `bleq`, `func_00146000`) |
| `func_001FAFD8` | (+0x20, CALL, `bl`, `func_001FB6AC`); (+0x2c, JUMP24, `blne`, `func_00124FB0`) |
| `func_001FB388` | (+0x0c, CALL, `bl`, `func_001FB6F8`); (+0x18, CALL, `bl`, `func_001FB4CC`); (+0x44, JUMP24, `blne`, `func_00124FB0`) |
| `func_004A7960` | (+0x18, JUMP24, `bleq`, `func_00124FB0`) |
| `func_004A79A8` | (+0x18, JUMP24, `bleq`, `func_00124FB0`) |

The seven destination equality classes account for all ten sites.
`func_00124FB0` is one shared class of four sites. Each other destination is a
singleton class, and all seven classes are pairwise distinct.

## Literal identity ledger and cumulative counts

The seven ordered pool slots form six new IPC-template literal equality
classes. The final pair intentionally shares one identity; every other slot is
distinct from it, from every other slot in this batch, and from all earlier
IPC-template literal identities.

| Identity | Ordered sites | Semantic role |
| --- | --- | --- |
| `service_result_normalization_39` | `func_001F461C + 0x6c` | Replacement result for the selected service result-code interval. |
| `lazy_service_cell_39` | `func_001F78E8 + 0x1c` | Address of the lazily required service cell. |
| `service_default_word_39` | `func_001FAFD8 + 0x4c` | Default word used before the optional service query. |
| `service_fallback_state_39` | `func_001FAFD8 + 0x50` | Root of the fallback state pointer chain. |
| `service_filtered_status_39` | `func_001FB388 + 0x50` | Negative status exempted from failure reporting. |
| `required_handle_error_39` | `func_004A7960 + 0x24`; `func_004A79A8 + 0x24` | Shared failure value reported for a missing required handle. |

Consequently:

- reused earlier IPC literal identities: none;
- new literal identities: six;
- cumulative ordered pool slots: 530;
- cumulative literal identity classes: 259.

## Acceptance contract

An implementation is acceptable only when all of the following hold:

1. It defines exactly the six ARM functions above with the stated body sizes,
   four-byte alignment, global function symbols, and ARM mapping symbols.
2. Each function follows its complete normative mnemonic schedule exactly.
3. The object has exactly the ten ordered symbolic branch relocations and
   seven ordered `R_ARM_ABS32` pool relocations listed above.
4. The two required-handle slots share one identity; the remaining five new
   identities are singleton classes, pairwise distinct from each other and
   from all earlier IPC-template literal classes.
5. The batch extends the cumulative contract from 523 slots / 253 classes to
   exactly 530 slots / 259 classes.
6. The functions remain disjoint from all earlier neutral template manifests.
