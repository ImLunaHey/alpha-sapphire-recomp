# Probe-verified ARM service/IPC wrappers 36

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, branch-target resolution, and an independent
  GNU Arm disassembly/schedule check.
- Probe toolchain: GNU Arm objdump 2.45.1.20251203 from Arm GNU Toolchain
  15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers seven still-unmatched ARM-state service adapters totaling
exactly 324 executable bytes. They are thin lifecycle, stack-result, and
argument-forwarding wrappers around already specified IPC operations. The set
contains two acquire/operate/release adapters, three stack-cell adapters, one
five-argument forwarder, and two sign-bit failure-reporting adapters.

The selection is disjoint from IPC batch 35 and from the independently
selected duplicate and runtime-helper batches 36. Every selected function is
reported as unmatched in the current target report.

## Function and behavior inventory

All functions and external destinations are ARM mode, four-byte aligned
primary entries. None of these functions has an ordered literal pool.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_00109C40` | 36 | none | Acquire, invoke `func_001103C0` with entry `r0`, release, and return the operation result preserved across release. |
| `func_0010EC48` | 52 | none | Obtain a word from `func_001182C0`, place it in a stack cell, submit the cell and both entry arguments through `func_00118300`, and invoke `func_00146000` only when the returned status is negative. |
| `func_001456E4` | 32 | none | Obtain a word from `func_001240C4`, place it in a stack cell, and invoke `func_00160078` with the cell and entry `r0`. |
| `func_001487E8` | 52 | none | Invoke `func_00164F74`, then forward the four entry-register arguments and the entry stack argument to `func_00164EE4`. |
| `func_00148E3C` | 44 | none | Acquire, invoke `func_0016516C` with both entry arguments, release, and return the operation result preserved across release. |
| `func_001F4204` | 52 | none | Obtain a word from `func_001240C4`, invoke `func_001F70F4` with that stack cell and a stack byte output, report a negative status, and return the output byte sign-extended. |
| `func_001F4238` | 56 | none | Use the same stack-cell/status pattern as `func_001F4204`, but invoke `func_001F712C`; the leading legacy self-move is observable in the schedule. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, stack operation, and local branch destination. In
particular, the leading `mov r0,r0` is the legacy move encoding and must not be
replaced by the architecturally equivalent `nop` mnemonic.

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

.global func_001260B4,func_001103C0,func_00126414
.global func_001182C0,func_00118300,func_00146000
.global func_001240C4,func_00160078,func_00164F74,func_00164EE4
.global func_0016516C,func_001F70F4,func_001F712C,func_00124FB0

BEGIN func_00109C40
push {r4,lr}
mov r4,r0
bl func_001260B4
mov r0,r4
bl func_001103C0
mov r4,r0
bl func_00126414
mov r0,r4
pop {r4,pc}
END func_00109C40

BEGIN func_0010EC48
push {r3,r4,r5,lr}
mov r5,r0
mov r4,r1
bl func_001182C0
str r0,[sp]
mov r2,r5
mov r3,r4
mov r1,#4096
mov r0,sp
bl func_00118300
lsrs r0,r0,#31
blne func_00146000
pop {r3,r4,r5,pc}
END func_0010EC48

BEGIN func_001456E4
push {r3,r4,r5,lr}
mov r4,r0
bl func_001240C4
str r0,[sp]
mov r1,r4
mov r0,sp
bl func_00160078
pop {r3,r4,r5,pc}
END func_001456E4

BEGIN func_001487E8
mov r0,r0
push {r3,r4,r5,r6,r7,lr}
mov r5,r0
mov r6,r1
mov r7,r2
mov r4,r3
bl func_00164F74
mov r3,r7
mov r2,r6
mov r1,r5
str r4,[sp]
bl func_00164EE4
pop {r3,r4,r5,r6,r7,pc}
END func_001487E8

BEGIN func_00148E3C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl func_001260B4
mov r1,r5
mov r0,r4
bl func_0016516C
mov r4,r0
bl func_00126414
mov r0,r4
pop {r4,r5,r6,pc}
END func_00148E3C

BEGIN func_001F4204
push {lr}
sub sp,sp,#12
bl func_001240C4
str r0,[sp]
add r1,sp,#4
mov r0,sp
bl func_001F70F4
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrsb r0,[sp,#4]
add sp,sp,#12
pop {pc}
END func_001F4204

BEGIN func_001F4238
mov r0,r0
push {lr}
sub sp,sp,#12
bl func_001240C4
str r0,[sp]
add r1,sp,#4
mov r0,sp
bl func_001F712C
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrsb r0,[sp,#4]
add sp,sp,#12
pop {pc}
END func_001F4238
```

## Branch identity and relocation ledger

There are exactly nineteen external ARM branch sites: sixteen `R_ARM_CALL`
sites and three `R_ARM_JUMP24` sites. All three jump relocations are
conditional `blne` calls; there are no unconditional tail branches or local
branch instructions in this batch.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_00109C40` | (+0x08, CALL, `bl`, `func_001260B4`); (+0x10, CALL, `bl`, `func_001103C0`); (+0x18, CALL, `bl`, `func_00126414`) |
| `func_0010EC48` | (+0x0c, CALL, `bl`, `func_001182C0`); (+0x24, CALL, `bl`, `func_00118300`); (+0x2c, JUMP24, `blne`, `func_00146000`) |
| `func_001456E4` | (+0x08, CALL, `bl`, `func_001240C4`); (+0x18, CALL, `bl`, `func_00160078`) |
| `func_001487E8` | (+0x18, CALL, `bl`, `func_00164F74`); (+0x2c, CALL, `bl`, `func_00164EE4`) |
| `func_00148E3C` | (+0x0c, CALL, `bl`, `func_001260B4`); (+0x18, CALL, `bl`, `func_0016516C`); (+0x20, CALL, `bl`, `func_00126414`) |
| `func_001F4204` | (+0x08, CALL, `bl`, `func_001240C4`); (+0x18, CALL, `bl`, `func_001F70F4`); (+0x24, JUMP24, `blne`, `func_00124FB0`) |
| `func_001F4238` | (+0x0c, CALL, `bl`, `func_001240C4`); (+0x1c, CALL, `bl`, `func_001F712C`); (+0x28, JUMP24, `blne`, `func_00124FB0`) |

The fourteen destination equality classes account for all nineteen sites:

| Destination identity | Equal sites and exact forms |
| --- | --- |
| `func_001240C4` | three `bl` / CALL |
| `func_001260B4` | two `bl` / CALL |
| `func_00126414` | two `bl` / CALL |
| `func_00124FB0` | two `blne` / JUMP24 |
| Each of `func_001103C0`, `func_001182C0`, `func_00118300`, `func_00146000`, `func_00160078`, `func_00164F74`, `func_00164EE4`, `func_0016516C`, `func_001F70F4`, and `func_001F712C` | one site in the form shown above |

All fourteen destination classes are pairwise distinct. Function-symbol names
identify primary entries, not secondary or interior entries.

## Literal identity and cumulative-count contract

This batch has no literal-pool slots and therefore introduces no literal
identity or equality class. The cumulative ARM IPC-template totals remain
exactly **523 ordered pool slots** and **253 distinct physical literal
classes** through batch 36.

## CFG and verification contract

- Every function has one entry block and returns through its final `pop`.
- `func_0010EC48`, `func_001F4204`, and `func_001F4238` use predicated
  external calls after the sign-bit test; they do not introduce local CFG
  edges at those sites.
- Entry stack arguments in `func_001487E8` retain their ABI position after the
  six-register push: the original fifth argument is copied to the outgoing
  stack slot immediately before `func_00164EE4`.
- Stack cells are exactly at the offsets shown. The result loads in the two
  final wrappers are signed-byte loads.
- Exact verification requires body size, instruction schedule, branch-site
  offset, relocation kind, branch mnemonic, destination identity, ARM mode,
  and four-byte entry alignment to agree with this specification.

