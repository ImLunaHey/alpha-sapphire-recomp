# Probe-verified ARM service/data wrappers 71

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function inventory, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  equality analysis, and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, target hashes, private literal values, private strings, assets,
  implementation, or proprietary source are present.
- Implementation source SHA-256: `99caf0aefb769a3c02d06a16c2bfc99c6b38c055302fff9b559d8d7a3911d101`.

This batch covers four still-unmatched ARM allocation, initialization, owned-text,
and service-lookup bodies totaling exactly 632 executable bytes. It is disjoint
from every earlier IPC cohort and from the pending runtime 76 and duplicate 74
cohorts.

## Function, extent, and semantic contract

| Function | Section | Body | Next global | Contract |
|---|---|---:|---|---|
| `func_0018BD3C` | `.text.func_0018BD3C` | 84 | `func_0018BD90` at +84 | Clear a six-word owner, initialize its subordinate allocation, and establish a 112-byte intrusive range whose head and tail initially reference the allocated base. |
| `func_0018BD90` | `.text.func_0018BD90` | 396 | `func_0018BF20` at +400 | Initialize a dispatch owner, allocate and link two fixed-capacity subordinate records when possible, then allocate an optional final work area and publish all resulting members. |
| `func_0018BF64` | `.text.func_0018BF64` | 92 | `func_0018BFC4` at +96 | Initialize an owned-text object; when the input has a non-null text pointer, measure it, allocate a length-prefixed destination, and copy the text into the owned payload. |
| `func_0018BFC4` | `.text.func_0018BFC4` | 60 | `func_0018C008` at +68 | Derive an optional dispatch value from allocator state, look up a service record in the established registry, and return its result member when present. |

## Positional identity and transfer contract

`func_0018BD90` has one physical post-body literal at +396, reached only by
the load at +12, and establishes `ipc_dispatch_owner_vtable_71`.
`func_0018BF64` has one physical post-body literal at +92, reached only by the
load at +8, and establishes `ipc_text_owner_vtable_71`. `func_0018BFC4` has
two physical post-body literals at +60 and +64. The loads at +0 and +36 reach
them respectively; the former reuses `ipc_allocator_dispatch_owner_68`, while
the latter establishes `ipc_service_registry_owner_71`. Private equality
analysis found the three new identities pairwise distinct and unequal to every
earlier IPC literal identity. Starting from the IPC70 baseline of 738 slots in
387 classes, this batch therefore requires 742 physical slots in 390 classes.

There are exactly thirteen symbolic direct-transfer sites. Eleven are ARM
calls and two are interworking calls to Thumb entries. Seven sites share the
`func_00184990` identity; each other destination is a singleton, and all seven
destination classes are pairwise distinct. All local conditional transfers
remain local and create no symbolic relocation.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0018BD3C` | +44 | `R_ARM_CALL` | `bl` | `func_0018D65C` |
| `func_0018BD90` | +32 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0018BD90` | +144 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0018BD90` | +156 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0018BD90` | +272 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0018BD90` | +284 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0018BD90` | +368 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0018BD90` | +380 | `R_ARM_JUMP24` | `blne` | `func_0018DB10` |
| `func_0018BF64` | +40 | `R_ARM_CALL` | `blx` | `func_001003E8` |
| `func_0018BF64` | +56 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0018BF64` | +80 | `R_ARM_CALL` | `blx` | `func_001003CC` |
| `func_0018BFC4` | +28 | `R_ARM_CALL` | `bl` | `func_001888A8` |
| `func_0018BFC4` | +44 | `R_ARM_CALL` | `bl` | `func_00171324` |

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` fixes the executable body size. Each `.word`
is adjacent data outside the preceding declared body. Labels and directives
occupy no executable bytes. Preserve every mnemonic, operand, condition,
addressing mode, immediate, local branch, direct-transfer form, pool position,
and pool order.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
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

.global func_0018D65C,func_00184990,func_0018DB10
.global func_001003E8,func_001003CC,func_001888A8,func_00171324
.global ipc_dispatch_owner_vtable_71,ipc_text_owner_vtable_71
.global ipc_allocator_dispatch_owner_68,ipc_service_registry_owner_71

BEGIN func_0018BD3C
push {r4,lr}
mov r4,r0
mov r0,#0
str r0,[r4]
str r0,[r4,#4]
str r0,[r4,#8]
str r0,[r4,#12]
str r0,[r4,#16]
str r0,[r4,#20]
mov r1,#1
mov r0,r4
bl func_0018D65C
ldr r0,[r4,#8]
add r2,r0,#112
str r0,[r4,#16]
str r2,[r4,#8]
str r0,[r0]
ldr r0,[r4,#16]
str r0,[r0,#4]
mov r0,r4
pop {r4,pc}
END func_0018BD3C

BEGIN func_0018BD90
push {r3,r4,r5,r6,r7,r8,r9,lr}
mov r6,r0
mov r9,#0
ldr r0,.Lpool_0018BD90_vtable
str r0,[r6]
strb r9,[r6,#4]
mov r0,#60
strb r9,[r6,#5]
bl func_00184990
cmp r0,#0
moveq r7,#0
beq .Lfinal_allocation_0018BD90
str r9,[r0]
str r9,[r0,#8]
str r9,[r0,#12]
str r9,[r0,#16]
str r9,[r0,#28]
str r9,[r0,#32]
str r9,[r0,#36]
str r9,[r0,#40]
str r9,[r0,#44]
str r9,[r0,#48]
str r9,[r0,#52]
str r9,[r0,#56]
str r9,[r0,#4]
str r9,[r0,#20]
str r9,[r0,#24]
strb r9,[r0,#28]
strb r1,[r0,#29]
str r9,[r0,#16]
str r9,[r0,#12]
mov r7,r0
add r4,r0,#4
str r9,[r0,#8]
mov r8,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#1664
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
stm r5,{r0,r8}
str r5,[r4]
ldr r0,[r5,#8]
add r5,r7,#32
add r1,r0,#1664
strd r0,[r4,#8]
add r1,r0,#52
str r1,[r4,#8]
str r9,[r0,#8]
str r9,[r0,#12]
strb r9,[r0]
str r0,[r4,#16]
str r9,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
str r9,[r7,#32]
str r9,[r7,#48]
str r9,[r7,#52]
strb r9,[r7,#56]
strb r0,[r7,#57]
str r9,[r7,#44]
str r9,[r7,#40]
mov r0,#12
str r9,[r7,#36]
bl func_00184990
mov r4,r0
mov r0,#1664
bl func_00184990
str r0,[r4,#8]
ldr r0,[r5]
stm r4,{r0,r8}
str r4,[r5]
ldr r0,[r4,#8]
add r1,r0,#1664
strd r0,[r5,#8]
add r1,r0,#52
str r1,[r5,#8]
str r9,[r0,#8]
str r9,[r0,#12]
strb r9,[r0]
str r0,[r5,#16]
str r9,[r0,#4]
ldr r0,[r5,#16]
str r0,[r0,#8]
ldr r0,[r5,#16]
str r0,[r0,#12]
.Lfinal_allocation_0018BD90:
mov r0,#192
str r7,[r6,#8]
bl func_00184990
cmp r0,#0
nop
blne func_0018DB10
str r0,[r6,#12]
mov r0,r6
pop {r3,r4,r5,r6,r7,r8,r9,pc}
END func_0018BD90
.Lpool_0018BD90_vtable:
.word ipc_dispatch_owner_vtable_71

BEGIN func_0018BF64
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,.Lpool_0018BF64_vtable
str r0,[r4]
ldr r6,[r1,#4]
cmp r6,#0
moveq r0,#0
streq r0,[r4,#4]
beq .Lreturn_0018BF64
mov r0,r6
blx func_001003E8
add r5,r0,#1
mov r0,#4
add r0,r0,r5,lsl #1
bl func_00184990
mov r1,r0
add r0,r0,#4
str r5,[r1]
mov r1,r6
str r0,[r4,#4]
blx func_001003CC
.Lreturn_0018BF64:
mov r0,r4
pop {r4,r5,r6,pc}
END func_0018BF64
.Lpool_0018BF64_vtable:
.word ipc_text_owner_vtable_71

BEGIN func_0018BFC4
ldr r0,.Lpool_0018BFC4_allocator
push {r4,lr}
ldrb r1,[r0,#13]
cmp r1,#0
moveq r2,#0
beq .Llookup_0018BFC4
ldr r0,[r0,#148]
bl func_001888A8
ldr r2,[r0]
.Llookup_0018BFC4:
ldr r0,.Lpool_0018BFC4_registry
mov r1,#1
bl func_00171324
cmp r0,#0
ldrne r0,[r0,#12]
pop {r4,pc}
END func_0018BFC4
.Lpool_0018BFC4_allocator:
.word ipc_allocator_dispatch_owner_68
.Lpool_0018BFC4_registry:
.word ipc_service_registry_owner_71
```

## Independent probe result

The normative schedule was independently assembled with the pinned GNU Arm
toolchain in ARMv6K/VFPv2 mode. Section-scoped comparison against the private
target confirmed all 158 executable instructions, all local-control targets,
all four literal reaches and their physical order, all thirteen symbolic
transfer sites, all four function sizes, and all four next-global boundaries.
The comparison normalizes only relocation payload fields; opcode, condition,
register, addressing-mode, immediate, and local-displacement bits remain exact.
