# Probe-verified ARM service/state helpers 63

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative symbol inventory, bounded private-target
  disassembly, direct-transfer resolution, physical literal equality analysis,
  and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.

This batch covers 12 still-unmatched ARM service/state bodies totaling exactly
820 executable bytes. The four adjacent literal regions total 16 additional
non-body bytes. Function boundaries and sizes are the authoritative inventory
boundaries; no body borrows instructions from a predecessor or successor.

## Semantic contract

- `func_0017E644` selects either the first owner word or a halfword-selected
  indexed word and returns it.
- `func_0017F188`, `func_0017F224`, `func_0017F2C0`, and `func_0017F35C`
  initialize four fixed-block owners. Each clears the owner, obtains a
  descriptor and backing region through the same allocator entry, links the
  descriptor, advances the cursor, initializes the first sentinel, and returns
  the owner. Their backing-region sizes are 1,024, 896, 768, and 768 bytes;
  their element strides are 32, 28, 24, and 24 bytes.
- `func_0017F3F8` compares nullable text identities. Equal pointers succeed;
  a null operand is replaced with the shared empty-text literal and comparison
  restarts; otherwise the Thumb comparison entry determines equality.
- `func_00180E24` stores a scalar float and a state byte. `func_00180E30`
  stores a scalar float into an indexed lane.
- `func_001819C0`, `func_00181A5C`, and `func_00181B4C` load distinct doubleword
  pairs from one shared owner and invoke the same three-argument service entry.
  Their adjacent literal slots therefore share one identity.
- `func_00181B40` stores a halfword into an indexed owner lane.

## Identity and accounting contract

There are four physical literal slots in two new classes. The slot following
`func_0017F3F8` is `ipc_empty_text_63`. The slots following `func_001819C0`,
`func_00181A5C`, and `func_00181B4C` are all
`ipc_shared_owner_63`. Both classes are distinct from all earlier IPC literal
classes and from one another. Starting from the required 686-slot / 364-class
baseline, the cumulative IPC contract is therefore 690 physical slots in 366
classes.

There are exactly 12 symbolic inter-section transfer sites. Eight allocator
calls share `func_00184990`; three service calls share `func_00188A8C`; and the
single ARM-to-Thumb comparison call targets `func_0010046E`. All three are
primary inventory entries and are pairwise distinct. Branches wholly inside
`func_0017F3F8`, including both restart branches, resolve within that function's
section and are not inter-section transfer identities.

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` terminates the executable body. Each `.word`
after an `END` is an adjacent physical literal outside the declared function
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, addressing mode, immediate,
direct-transfer form, pool position, and pool order.

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

.global func_00184990,func_0010046E,func_00188A8C
.global ipc_empty_text_63,ipc_shared_owner_63

BEGIN func_0017E644
cmp r1,#0
ldreq r0,[r0]
ldrhne r0,[r0,#10]
addne r1,r1,#4
ldrne r0,[r0,r1]
bx lr
END func_0017E644

BEGIN func_0017F188
push {r3,r4,r5,r6,r7,lr}
mov r4,r0
mov r7,#0
str r7,[r0]
str r7,[r0,#16]
str r7,[r0,#20]
strb r7,[r0,#24]
strb r0,[r0,#25]
str r7,[r0,#12]
str r7,[r0,#8]
str r7,[r0,#4]
mov r6,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#1024
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
add r1,r4,#8
stm r5,{r0,r6}
str r5,[r4]
ldr r0,[r5,#8]
add r2,r0,#1024
stm r1,{r0,r2}
ldr r0,[r4,#8]
add r2,r0,#32
str r2,[r4,#8]
str r7,[r0,#8]
str r7,[r0,#12]
strb r7,[r0]
str r0,[r4,#16]
str r7,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
mov r0,r4
pop {r3,r4,r5,r6,r7,pc}
END func_0017F188

BEGIN func_0017F224
push {r3,r4,r5,r6,r7,lr}
mov r4,r0
mov r7,#0
str r7,[r0]
str r7,[r0,#16]
str r7,[r0,#20]
strb r7,[r0,#24]
strb r0,[r0,#25]
str r7,[r0,#12]
str r7,[r0,#8]
str r7,[r0,#4]
mov r6,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#896
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
add r1,r4,#8
stm r5,{r0,r6}
str r5,[r4]
ldr r0,[r5,#8]
add r2,r0,#896
stm r1,{r0,r2}
ldr r0,[r4,#8]
add r2,r0,#28
str r2,[r4,#8]
str r7,[r0,#8]
str r7,[r0,#12]
strb r7,[r0]
str r0,[r4,#16]
str r7,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
mov r0,r4
pop {r3,r4,r5,r6,r7,pc}
END func_0017F224

BEGIN func_0017F2C0
push {r3,r4,r5,r6,r7,lr}
mov r4,r0
mov r7,#0
str r7,[r0]
str r7,[r0,#16]
str r7,[r0,#20]
strb r7,[r0,#24]
strb r0,[r0,#25]
str r7,[r0,#12]
str r7,[r0,#8]
str r7,[r0,#4]
mov r6,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#768
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
add r1,r4,#8
stm r5,{r0,r6}
str r5,[r4]
ldr r0,[r5,#8]
add r2,r0,#768
stm r1,{r0,r2}
ldr r0,[r4,#8]
add r2,r0,#24
str r2,[r4,#8]
str r7,[r0,#8]
str r7,[r0,#12]
strb r7,[r0]
str r0,[r4,#16]
str r7,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
mov r0,r4
pop {r3,r4,r5,r6,r7,pc}
END func_0017F2C0

BEGIN func_0017F35C
push {r3,r4,r5,r6,r7,lr}
mov r4,r0
mov r7,#0
str r7,[r0]
str r7,[r0,#16]
str r7,[r0,#20]
strb r7,[r0,#24]
strb r0,[r0,#25]
str r7,[r0,#12]
str r7,[r0,#8]
str r7,[r0,#4]
mov r6,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#768
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
add r1,r4,#8
stm r5,{r0,r6}
str r5,[r4]
ldr r0,[r5,#8]
add r2,r0,#768
stm r1,{r0,r2}
ldr r0,[r4,#8]
add r2,r0,#24
str r2,[r4,#8]
str r7,[r0,#8]
str r7,[r0,#12]
strb r7,[r0]
str r0,[r4,#16]
str r7,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
mov r0,r4
pop {r3,r4,r5,r6,r7,pc}
END func_0017F35C

BEGIN func_0017F3F8
.Lcompare_63:
cmp r0,r1
push {r4,lr}
beq .Lsuccess_63
cmp r0,#0
beq .Lnull_left_63
cmp r1,#0
beq .Lnull_right_63
blx func_0010046E
cmp r0,#0
movne r0,#0
bne .Lreturn_63
.Lsuccess_63:
mov r0,#1
.Lreturn_63:
pop {r4,pc}
.Lnull_left_63:
ldr r0,.Lempty_text_63
pop {r4,lr}
b .Lcompare_63
.Lnull_right_63:
ldr r1,.Lempty_text_63
pop {r4,lr}
b .Lcompare_63
END func_0017F3F8
.Lempty_text_63:
.word ipc_empty_text_63

BEGIN func_00180E24
vstr s0,[r0,#40]
strb r1,[r0,#44]
bx lr
END func_00180E24

BEGIN func_00180E30
add r0,r0,r1,lsl #2
vstr s0,[r0,#56]
bx lr
END func_00180E30

BEGIN func_001819C0
ldr r2,.Lshared_owner_63_a
push {r4,lr}
ldrd r2,[r2,#32]
bl func_00188A8C
pop {r4,pc}
END func_001819C0
.Lshared_owner_63_a:
.word ipc_shared_owner_63

BEGIN func_00181A5C
ldr r2,.Lshared_owner_63_b
push {r4,lr}
ldrd r2,[r2,#24]
bl func_00188A8C
pop {r4,pc}
END func_00181A5C
.Lshared_owner_63_b:
.word ipc_shared_owner_63

BEGIN func_00181B40
add r0,r0,r1,lsl #1
strh r2,[r0,#208]
bx lr
END func_00181B40

BEGIN func_00181B4C
ldr r2,.Lshared_owner_63_c
push {r4,lr}
ldrd r2,[r2,#64]
bl func_00188A8C
pop {r4,pc}
END func_00181B4C
.Lshared_owner_63_c:
.word ipc_shared_owner_63
```

`totalBodySize` is the sum of declared function sizes only; adjacent literal
slots are intentionally excluded. `sourceSha256` remains
`PENDING_IMPLEMENTATION` until the clean-room implementer materializes this
corrected schedule and the coordinator pins the resulting source digest.
