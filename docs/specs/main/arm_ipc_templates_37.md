# Probe-verified ARM service/IPC wrappers 37

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

This batch covers seven still-unmatched ARM-state service adapters totaling
exactly 556 executable bytes. The set contains an acquire/operate/release
result adapter, a frame-restoring failure tail transfer, a packed stack-record
forwarder, two stack-output adapters, a status-normalizing adapter, and a
callback-gated IPC adapter.

The selection is disjoint from every function named by the existing neutral
template manifests. Every selected function is reported as unmatched in the
current target report.

## Function and behavior inventory

All functions and direct external destinations are ARM mode, four-byte aligned
primary entries. None of these functions has an ordered literal pool.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_001260E8` | 84 | none | Preserve four entry arguments, acquire, invoke `func_00133CBC` with a fifth stack argument pointing to an output byte, report a negative status, release, and return the output byte sign-extended. |
| `func_00170868` | 40 | none | Invoke `func_00118AE4`; return normally for a nonnegative result, otherwise restore the frame and tail-transfer the unchanged result to `func_00124FB0`. |
| `func_001F48EC` | 92 | none | Build a zero-initialized four-byte stack record plus two stack words, obtain a service word, and forward the record, service cell, and four entry arguments to `func_001F73F4`. |
| `func_001FAF1C` | 116 | none | Invoke `func_001FB610` with four stack output words, report a negative status, and copy each word to its corresponding non-null entry pointer. |
| `func_001FAF90` | 72 | none | Query a replacement word through `func_001FB670`, report a negative status, close the old nonzero word with service call 35, then install the replacement. |
| `func_0036C428` | 60 | none | Invoke `func_001F4188` with entry `r2` as its first argument and the truth value of entry `r3` as its third; return zero on a nonnegative result, otherwise report failure and return six. |
| `func_004E61F4` | 92 | none | Invoke the object callback at word offset 16; when it succeeds, call `func_001F48EC` with the remaining entry arguments, return one for a nonnegative result, and otherwise report failure and return zero. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, stack operation, service-call immediate, and local branch
destination. In particular, the two leading `mov r0,r0` instructions are the
legacy move encoding and must not be replaced by the architecturally
equivalent `nop` mnemonic.

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

.global func_001260B4,func_00133CBC,func_00124BA4,func_00126414
.global func_00118AE4,func_00124FB0,func_001240C4,func_001F73F4
.global func_001FB610,func_001FB670,func_001F4188

BEGIN func_001260E8
push {r4,r5,r6,r7,lr}
sub sp,sp,#12
mov r4,r0
mov r5,r1
mov r6,r2
mov r7,r3
bl func_001260B4
add ip,sp,#4
mov r3,r7
mov r2,r6
mov r1,r5
mov r0,r4
str ip,[sp]
bl func_00133CBC
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
bl func_00126414
ldrsb r0,[sp,#4]
add sp,sp,#12
pop {r4,r5,r6,r7,pc}
END func_001260E8

BEGIN func_00170868
push {r4,lr}
bl func_00118AE4
ands r1,r0,#0x80000000
bpl .Lreturn_00170868
mov r1,pc
lsrs r2,r0,#31
beq .Lreturn_00170868
pop {r4,lr}
b func_00124FB0
.Lreturn_00170868:
pop {r4,pc}
END func_00170868

BEGIN func_001F48EC
push {r4,r5,r6,lr}
sub sp,sp,#24
mov r5,r1
mov r1,#0
mov r4,r0
strh r1,[sp,#6]
mov r0,#0x48000
strb r1,[sp,#4]
mov r6,r2
strb r1,[sp,#5]
str r0,[sp,#12]
str r3,[sp,#8]
bl func_001240C4
str r0,[sp,#16]
add r0,sp,#4
str r0,[sp]
mov r3,r6
mov r2,r5
mov r1,r4
add r0,sp,#16
bl func_001F73F4
add sp,sp,#24
pop {r4,r5,r6,pc}
END func_001F48EC

BEGIN func_001FAF1C
mov r0,r0
push {r4,r5,r6,r7,lr}
sub sp,sp,#20
mov r4,r0
mov r5,r1
mov r6,r2
mov r7,r3
add r3,sp,#12
add r2,sp,#4
add r1,sp,#8
mov r0,sp
bl func_001FB610
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
cmp r4,#0
ldrne r0,[sp]
strne r0,[r4]
cmp r5,#0
ldrne r0,[sp,#8]
strne r0,[r5]
cmp r6,#0
ldrne r0,[sp,#4]
strne r0,[r6]
cmp r7,#0
ldrne r0,[sp,#12]
strne r0,[r7]
add sp,sp,#20
pop {r4,r5,r6,r7,pc}
END func_001FAF1C

BEGIN func_001FAF90
mov r0,r0
push {r3,r4,r5,lr}
mov r4,r0
mov r5,#0
mov r0,sp
str r5,[sp]
bl func_001FB670
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[r4]
cmp r0,#0
beq .Linstall_001FAF90
svc #0x23
str r5,[r4]
.Linstall_001FAF90:
ldr r0,[sp]
str r0,[r4]
pop {r3,r4,r5,pc}
END func_001FAF90

BEGIN func_0036C428
cmp r3,#0
mov r0,r2
movne r2,#1
moveq r2,#0
push {r4,lr}
bl func_001F4188
and r1,r0,#0x80000000
cmp r1,#0
movge r0,#0
bge .Lreturn_0036C428
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
mov r0,#6
.Lreturn_0036C428:
pop {r4,pc}
END func_0036C428

BEGIN func_004E61F4
push {r4,r5,r6,lr}
mov r4,r1
ldr r1,[r0]
mov r5,r2
mov r6,r3
ldr r1,[r1,#16]
blx r1
cmp r0,#0
beq .Lreturn_004E61F4
mov r3,#0xf0000001
mov r2,r6
mov r1,r5
mov r0,r4
bl func_001F48EC
and r1,r0,#0x80000000
cmp r1,#0
movge r0,#1
bge .Lreturn_004E61F4
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
mov r0,#0
.Lreturn_004E61F4:
pop {r4,r5,r6,pc}
END func_004E61F4
```

## Branch identity and relocation ledger

There are exactly sixteen symbolic external ARM branch sites: ten
`R_ARM_CALL` sites and six `R_ARM_JUMP24` sites. Five jump relocations are
conditional `blne` calls and one is an unconditional frame-restoring tail
transfer. `func_004E61F4` additionally contains one register-indirect `blx`
that has no symbolic relocation.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_001260E8` | (+0x18, CALL, `bl`, `func_001260B4`); (+0x34, CALL, `bl`, `func_00133CBC`); (+0x40, JUMP24, `blne`, `func_00124BA4`); (+0x44, CALL, `bl`, `func_00126414`) |
| `func_00170868` | (+0x04, CALL, `bl`, `func_00118AE4`); (+0x20, JUMP24, `b`, `func_00124FB0`) |
| `func_001F48EC` | (+0x30, CALL, `bl`, `func_001240C4`); (+0x50, CALL, `bl`, `func_001F73F4`) |
| `func_001FAF1C` | (+0x2c, CALL, `bl`, `func_001FB610`); (+0x38, JUMP24, `blne`, `func_00124FB0`) |
| `func_001FAF90` | (+0x18, CALL, `bl`, `func_001FB670`); (+0x24, JUMP24, `blne`, `func_00124FB0`) |
| `func_0036C428` | (+0x14, CALL, `bl`, `func_001F4188`); (+0x30, JUMP24, `blne`, `func_00124FB0`) |
| `func_004E61F4` | (+0x34, CALL, `bl`, `func_001F48EC`); (+0x50, JUMP24, `blne`, `func_00124FB0`) |

The twelve destination equality classes account for all sixteen symbolic
sites. `func_00124FB0` is one shared class of five sites. Each of
`func_001260B4`, `func_00133CBC`, `func_00124BA4`, `func_00126414`,
`func_00118AE4`, `func_001240C4`, `func_001F73F4`, `func_001FB610`,
`func_001FB670`, `func_001F4188`, and `func_001F48EC` is a singleton class.
All twelve classes are pairwise distinct. Function-symbol names identify
primary entries, not secondary or interior entries.

## Literal identity and cumulative-count contract

This batch has no literal-pool slots and therefore introduces no literal
identity or equality class. The cumulative ARM IPC-template totals remain
exactly **523 ordered pool slots** and **253 distinct physical literal
classes** through batch 37.

## CFG and verification contract

- `func_001260E8` has a single return and no local branch. Release occurs
  after the checked operation on every path.
- `func_00170868` has a normal-return block and a frame-restoring failure tail
  transfer. Preserve both sign tests and their distinct local edges.
- `func_001F48EC` and `func_001FAF1C` are single-block adapters. Stack cells,
  output-word ordering, and the fifth outgoing argument are exactly as shown.
- `func_001FAF90` branches locally around service call 35 when the old word is
  zero. Its checked IPC call remains before the replacement sequence.
- `func_0036C428` normalizes the IPC status through one shared return block;
  its failure-report call is predicated and creates no local CFG edge.
- `func_004E61F4` has an early shared return after its register-indirect
  callback, a nonnegative-result edge returning one, and a negative-result
  reporting path returning zero.
- Exact verification requires body size, complete instruction schedule,
  local CFG, branch-site offset, relocation kind, branch mnemonic,
  destination identity, ARM mode, and four-byte entry alignment to agree with
  this specification.

