# Probe-verified ARM service/IPC wrappers 38

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, branch-target resolution, and an independent
  GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, linker, objcopy, objdump, and readelf
  2.45.1.20251203 from Arm GNU Toolchain 15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers nine still-unmatched ARM-state service adapters totaling
exactly 328 executable bytes. The set contains five kernel-state capture or
initialization adapters, one handle-closing state adapter, and three
failure-tail service wrappers.

The selection is disjoint from every function named by the existing neutral
template manifests. Every selected function is reported as unmatched in the
current target report.

## Function and behavior inventory

All functions and the sole direct external destination are ARM mode,
four-byte aligned primary entries. None of these functions has an ordered
literal pool.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_0010E86C` | 48 | none | When the object's leading flag is nonzero, invoke kernel service 40 and replace three adjacent state regions with the returned pair plus zeroed bookkeeping. |
| `func_001E70E0` | 52 | none | Mark an object active, clear four words beginning at offset eight, invoke kernel service 40, and store the returned pair at offset 24. |
| `func_001FBDEC` | 52 | none | Preserve the word at offset 12 as the return value; when the handle at offset four is nonzero, clear the saved word, close the handle with service 35, and clear the handle cell. |
| `func_002BDCA4` | 28 | none | Store an entry byte at offset four, invoke kernel service 40, and store the returned pair at offset 344. |
| `func_002C2B9C` | 20 | none | Invoke kernel service 40 and store its returned pair at the entry pointer. |
| `func_003BAF34` | 32 | none | Invoke service 24 with the word at offset 16; return on success, or restore the frame and tail-transfer the unchanged failure to `func_001603A0`. |
| `func_003BAFD4` | 40 | none | Invoke service 36 with the word at offset 16 and two all-ones arguments; return on success, or restore the frame and tail-transfer the unchanged failure to `func_001603A0`. |
| `func_003BAFFC` | 32 | none | Invoke service 20 with the word at offset 16; return on success, or restore the frame and tail-transfer the unchanged failure to `func_001603A0`. |
| `func_003BCEB0` | 24 | none | Invoke kernel service 40, store its returned pair at the entry pointer, and return that pointer. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, stack operation, service-call immediate, and local branch
destination.

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

.global func_001603A0

BEGIN func_0010E86C
push {r4,lr}
mov r4,r0
ldrb r0,[r0]
cmp r0,#0
beq .Lreturn_0010E86C
svc #0x28
mov r3,#0
str r3,[r4,#20]
strd r0,[r4,#24]
add r4,r4,#8
stm r4,{r0,r1,r3}
.Lreturn_0010E86C:
pop {r4,pc}
END func_0010E86C

BEGIN func_001E70E0
push {r4,lr}
mov r4,r0
mov r0,#0
mov ip,#1
strb ip,[r4]
add ip,r4,#8
mov r1,r0
mov r2,r0
mov r3,r0
stm ip,{r0,r1,r2,r3}
svc #0x28
strd r0,[r4,#24]
pop {r4,pc}
END func_001E70E0

BEGIN func_001FBDEC
push {r4,r5,r6,lr}
ldr r1,[r0,#4]
ldr r5,[r0,#12]
cmp r1,#0
beq .Lreturn_saved_001FBDEC
mov r4,#0
add r6,r0,#4
str r4,[r0,#12]
mov r0,r1
svc #0x23
str r4,[r6]
.Lreturn_saved_001FBDEC:
mov r0,r5
pop {r4,r5,r6,pc}
END func_001FBDEC

BEGIN func_002BDCA4
push {r4,lr}
mov r4,r0
strb r1,[r0,#4]
svc #0x28
add r4,r4,#0x158
stm r4,{r0,r1}
pop {r4,pc}
END func_002BDCA4

BEGIN func_002C2B9C
push {r4,lr}
mov r4,r0
svc #0x28
strd r0,[r4]
pop {r4,pc}
END func_002C2B9C

BEGIN func_003BAF34
push {r4,lr}
ldr r0,[r0,#16]
svc #0x18
lsrs r1,r0,#31
beq .Lreturn_003BAF34
pop {r4,lr}
b func_001603A0
.Lreturn_003BAF34:
pop {r4,pc}
END func_003BAF34

BEGIN func_003BAFD4
mvn r2,#0
push {r4,lr}
ldr r0,[r0,#16]
mov r3,r2
svc #0x24
lsrs r1,r0,#31
beq .Lreturn_003BAFD4
pop {r4,lr}
b func_001603A0
.Lreturn_003BAFD4:
pop {r4,pc}
END func_003BAFD4

BEGIN func_003BAFFC
push {r4,lr}
ldr r0,[r0,#16]
svc #0x14
lsrs r1,r0,#31
beq .Lreturn_003BAFFC
pop {r4,lr}
b func_001603A0
.Lreturn_003BAFFC:
pop {r4,pc}
END func_003BAFFC

BEGIN func_003BCEB0
push {r4,lr}
mov r4,r0
svc #0x28
strd r0,[r4]
mov r0,r4
pop {r4,pc}
END func_003BCEB0
```

## Branch identity and relocation ledger

There are exactly three symbolic external ARM branch sites, all
`R_ARM_JUMP24` frame-restoring tail transfers to the same destination. Kernel
service instructions and local conditional branches do not carry symbolic
relocations.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_0010E86C` | none |
| `func_001E70E0` | none |
| `func_001FBDEC` | none |
| `func_002BDCA4` | none |
| `func_002C2B9C` | none |
| `func_003BAF34` | (+0x18, JUMP24, `b`, `func_001603A0`) |
| `func_003BAFD4` | (+0x20, JUMP24, `b`, `func_001603A0`) |
| `func_003BAFFC` | (+0x18, JUMP24, `b`, `func_001603A0`) |
| `func_003BCEB0` | none |

The single destination equality class accounts for all three symbolic sites:
`func_001603A0` is one shared class of three sites. There are no singleton
branch classes.

## Literal identity ledger and cumulative counts

This batch adds no literal-pool slots and therefore no literal identities.
The cumulative IPC-template contract remains exactly 523 ordered pool slots
partitioned into 253 literal equality classes. Consequently:

- reused literal identities: none;
- new literal identities: none;
- cumulative ordered pool slots: 523;
- cumulative literal identity classes: 253.

## Acceptance contract

An implementation is acceptable only when all of the following hold:

1. It defines exactly the nine ARM functions above with the stated section
   sizes, four-byte alignment, global function symbols, and ARM mapping
   symbols.
2. Each function follows its complete normative mnemonic schedule exactly.
3. The object has exactly the three ordered symbolic branch relocations listed
   above, all targeting the same aligned ARM primary entry
   `func_001603A0`.
4. None of the nine sections contains a literal-pool slot or data mapping
   symbol.
5. The batch adds no identity to the cumulative 523-slot/253-class literal
   contract.
6. The functions remain disjoint from all earlier neutral template manifests.

