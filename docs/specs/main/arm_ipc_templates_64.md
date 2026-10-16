# Probe-verified ARM callback/state helpers 64

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function inventory, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  equality analysis, and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.

This batch covers 13 still-unmatched ARM callback/state bodies totaling exactly
1,000 executable bytes. Ten adjacent literal regions total 40 additional
non-body bytes. Function boundaries and sizes come from the authoritative
inventory, and the selected set is disjoint from every earlier IPC batch and
from duplicate/runtime batch 68.

## Semantic contract

- `func_0018196C` copies a three-word descriptor and two vector ranges into an
  owner, marks two readiness bytes, initializes the owner through a primary
  service call, and links its embedded node through a secondary ARM entry.
- `func_001819D8`, `func_00181AB8`, `func_00181B78`, `func_00181C14`,
  `func_00181CB0`, and `func_00181D40` iterate a 16-bit selection mask over a
  16-slot callback owner. Each skips absent slots, resolves a callback through
  a shared descriptor, and invokes it indirectly with the helper-specific
  argument shape. The first, third, fourth, and sixth helpers share the same
  three-argument shape; the second supplies two caller payload arguments; the
  fifth preserves one floating-point argument. `func_00181B78` additionally
  rejects an unavailable indexed lane and returns a success flag.
- `func_00181A74` bounds-checks a 16-slot index and returns either its owner
  pointer or null.
- `func_00181A88`, `func_00181AA0`, and `func_00181C98` load three distinct
  doubleword pairs from the shared owner and call one common service entry.
- `func_00181B64` writes a halfword to an indexed standalone owner.
- `func_00181DC4` stores a two-word pair into an embedded owner field.

## Identity and accounting contract

There are ten physical literal slots in two classes. Nine slots reuse the
established `ipc_shared_owner_63` identity. The sole slot following
`func_00181B64` establishes the new, distinct `ipc_halfword_owner_64` class.
Starting from the required 690-slot / 366-class IPC63 baseline, the cumulative
contract is therefore 700 physical slots in 367 classes.

There are exactly five symbolic inter-section transfer sites. Three wrapper
calls share the primary `func_00188A8C` entry. `func_0017541C` is a distinct
primary entry used once. `service_link_secondary_64` is a distinct, four-byte
aligned secondary ARM entry used once; it begins immediately after the
44-byte declared body of `func_0017A8A8`, before the next primary inventory
entry. These three destination identities are
pairwise distinct. All other branches are local to their function, and all
register-indirect `blx` instructions remain indirect calls rather than symbolic
transfer identities.

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` terminates the executable body. Each `.word`
after an `END` is an adjacent physical literal outside the declared function
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, addressing mode, immediate, local
branch, direct-transfer form, pool position, and pool order.

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

.global func_0017541C,service_link_secondary_64,func_00188A8C
.global ipc_shared_owner_63,ipc_halfword_owner_64

BEGIN func_0018196C
push {r4,r5,r6,lr}
mov r4,r0
ldm r1,{r0,r3}
add r5,r4,#360
ldr r1,[r1,#8]
str r1,[r4,#368]
stm r5,{r0,r3}
add r0,r4,#380
mov r5,#1
vldmia r2,{s0-s7}
add r2,r2,#32
vstmia r0,{s0-s7}
add r0,r4,#412
vldmia r2,{s0-s4}
vstmia r0,{s0-s4}
strb r5,[r4,#356]
bl func_0017541C
add r1,r4,#80
bl service_link_secondary_64
strb r5,[r4,#358]
pop {r4,r5,r6,pc}
END func_0018196C

BEGIN func_001819D8
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r9,r2
ldr r0,.Lpool_001819D8
mov r5,#0
ldr r7,[r0,#4]
ldr r8,[r0]
.Lloop_001819D8:
cmp r4,#0
beq .Lreturn_001819D8
tst r4,#1
beq .Lnext_001819D8
cmp r5,#15
bgt .Lnext_001819D8
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_001819D8
add r2,r0,r7,asr #1
tst r7,#1
ldrne r0,[r2]
moveq r0,r8
mov r1,r9
ldrne r0,[r0,r8]
mov r3,r0
mov r0,r2
blx r3
.Lnext_001819D8:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_001819D8
.Lreturn_001819D8:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_001819D8
.Lpool_001819D8:
.word ipc_shared_owner_63

BEGIN func_00181A74
cmp r1,#15
addle r0,r0,r1,lsl #2
movgt r0,#0
ldrle r0,[r0,#144]
bx lr
END func_00181A74

BEGIN func_00181A88
ldr r2,.Lpool_00181A88
push {r4,lr}
ldrd r2,[r2,#16]
bl func_00188A8C
pop {r4,pc}
END func_00181A88
.Lpool_00181A88:
.word ipc_shared_owner_63

BEGIN func_00181AA0
ldr r2,.Lpool_00181AA0
push {r4,lr}
ldrd r2,[r2,#48]
bl func_00188A8C
pop {r4,pc}
END func_00181AA0
.Lpool_00181AA0:
.word ipc_shared_owner_63

BEGIN func_00181AB8
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r10,r2
ldr r0,.Lpool_00181AB8
mov r9,r3
mov r5,#0
ldr r8,[r0,#8]!
ldr r7,[r0,#4]
.Lloop_00181AB8:
cmp r4,#0
beq .Lreturn_00181AB8
tst r4,#1
beq .Lnext_00181AB8
cmp r5,#15
bgt .Lnext_00181AB8
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181AB8
add r0,r0,r7,asr #1
tst r7,#1
ldrne r1,[r0]
moveq r1,r8
mov r2,r9
ldrne r1,[r1,r8]
mov r3,r1
mov r1,r10
blx r3
.Lnext_00181AB8:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181AB8
.Lreturn_00181AB8:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181AB8
.Lpool_00181AB8:
.word ipc_shared_owner_63

BEGIN func_00181B64
ldr r2,.Lpool_00181B64
add r0,r2,r0,lsl #1
strh r1,[r0]
bx lr
END func_00181B64
.Lpool_00181B64:
.word ipc_halfword_owner_64

BEGIN func_00181B78
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r4,r1
mov r9,r2
add r1,r2,r9,lsl #1
add r1,r0,r1,lsl #2
ldrb r1,[r1,#316]
cmp r1,#0
moveq r0,#0
beq .Lreturn_00181B78
mov r6,r0
ldr r0,.Lpool_00181B78
mov r5,#0
ldr r8,[r0,#72]!
ldr r7,[r0,#4]
.Lloop_00181B78:
cmp r4,#0
beq .Lsuccess_00181B78
tst r4,#1
beq .Lnext_00181B78
cmp r5,#15
bgt .Lnext_00181B78
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181B78
add r0,r0,r7,asr #1
tst r7,#1
ldrne r1,[r0]
moveq r1,r8
ldrne r1,[r1,r8]
mov r2,r1
mov r1,r9
blx r2
.Lnext_00181B78:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181B78
.Lsuccess_00181B78:
mov r0,#1
.Lreturn_00181B78:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181B78
.Lpool_00181B78:
.word ipc_shared_owner_63

BEGIN func_00181C14
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r9,r2
ldr r0,.Lpool_00181C14
mov r5,#0
ldr r8,[r0,#80]!
ldr r7,[r0,#4]
.Lloop_00181C14:
cmp r4,#0
beq .Lreturn_00181C14
tst r4,#1
beq .Lnext_00181C14
cmp r5,#15
bgt .Lnext_00181C14
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181C14
add r2,r0,r7,asr #1
tst r7,#1
ldrne r0,[r2]
moveq r0,r8
mov r1,r9
ldrne r0,[r0,r8]
mov r3,r0
mov r0,r2
blx r3
.Lnext_00181C14:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181C14
.Lreturn_00181C14:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181C14
.Lpool_00181C14:
.word ipc_shared_owner_63

BEGIN func_00181C98
ldr r2,.Lpool_00181C98
push {r4,lr}
ldrd r2,[r2,#40]
bl func_00188A8C
pop {r4,pc}
END func_00181C98
.Lpool_00181C98:
.word ipc_shared_owner_63

BEGIN func_00181CB0
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r9,r2
ldr r0,.Lpool_00181CB0
mov r5,#0
vpush {d8}
vmov.f32 s16,s0
ldr r8,[r0,#56]!
ldr r7,[r0,#4]
.Lloop_00181CB0:
cmp r4,#0
beq .Lrestore_00181CB0
tst r4,#1
beq .Lnext_00181CB0
cmp r5,#15
bgt .Lnext_00181CB0
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181CB0
add r0,r0,r7,asr #1
tst r7,#1
ldrne r1,[r0]
moveq r1,r8
vmov.f32 s0,s16
ldrne r1,[r1,r8]
mov r2,r1
mov r1,r9
blx r2
.Lnext_00181CB0:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181CB0
.Lrestore_00181CB0:
vpop {d8}
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181CB0
.Lpool_00181CB0:
.word ipc_shared_owner_63

BEGIN func_00181D40
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r9,r2
ldr r0,.Lpool_00181D40
mov r5,#0
ldr r8,[r0,#88]!
ldr r7,[r0,#4]
.Lloop_00181D40:
cmp r4,#0
beq .Lreturn_00181D40
tst r4,#1
beq .Lnext_00181D40
cmp r5,#15
bgt .Lnext_00181D40
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181D40
add r2,r0,r7,asr #1
tst r7,#1
ldrne r0,[r2]
moveq r0,r8
mov r1,r9
ldrne r0,[r0,r8]
mov r3,r0
mov r0,r2
blx r3
.Lnext_00181D40:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181D40
.Lreturn_00181D40:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181D40
.Lpool_00181D40:
.word ipc_shared_owner_63

BEGIN func_00181DC4
add r0,r0,#136
stm r0,{r1,r2}
bx lr
END func_00181DC4
```

## Probe result

GNU Arm assembled all 13 schedules to the required body sizes. After
normalizing only the five declared inter-section transfer words and ten
declared literal words, every emitted instruction word, local branch target,
body boundary, and adjacent pool position matched the corresponding bounded
target region exactly. The target inventory confirmed ARM mode, four-byte
alignment, non-overlap, and all primary/secondary destination classifications.
