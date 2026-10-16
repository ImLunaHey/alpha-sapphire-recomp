# Probe-verified ARM service/state helpers 62

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  identity comparison, and an independent GNU Arm normalized-exact schedule
  probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.

This batch covers 15 still-unmatched ARM service/state helpers totaling exactly
864 executable bytes. Every exact function and every function named by an
existing implementation contract was excluded. The selection is disjoint from
the concurrent duplicate and runtime reservations confirmed by the
coordinating agent.

## Semantic contract

- `func_0017CEC0` searches the two embedded typed records at owner
  displacements 20 and 32 for the shared record-tag identity, follows the
  selected relative word at displacement four, and returns the owner-relative
  address.
- `func_0017CEF4` performs the same search and returns the selected record's
  relative word at displacement four.
- `func_0017CF24` searches those same two records for the inline class tag and
  returns the selected record's relative word at displacement four.
- `func_0017CF4C` follows the table at owner displacement 52 after removing an
  index's class byte, bounds-checks that index, and returns its entry-relative
  pointer or null.
- `func_0017CF78` is the class-five typed version of that table lookup, using
  the table at owner displacement 28. A class or bounds failure returns null.
- `func_0017CFC0` asks the shared packed-field helper for field one of the
  record at displacement eight and returns the produced word on success.
- `func_0017CFE0`, `func_0017D00C`, and `func_0017D030` classify a leading
  halfword among absent and two adjacent record kinds. They respectively
  resolve only the second kind's relative payload, map the accepted kinds to
  zero or one with fallback two, and resolve only the first kind's payload.
- `func_0017D058` reads a packed optional-word record. It counts set presence
  bits through the requested field, writes the corresponding packed word when
  that field exists, and returns a Boolean. Field all-bits-one selects the
  first stored word when present.
- `func_0017D0D4` scans twelve-byte records beginning at displacement 20 for
  the inline record kind and returns the owner-relative payload when nonzero;
  otherwise it returns null.
- `func_0017D140` copies the six-word block reached through displacement eight
  from one owner to another, then copies their halfword at displacement four.
- `func_0017D184` copies the 404-byte region beginning at displacement eight
  through the symbolic memory-copy helper, then copies the word at
  displacement four.
- `func_0017D1AC` copies 36 bytes between the regions reached through the two
  owners' displacement-eight pointers, then copies the halfword at
  displacement four.
- `func_0017D720` consumes one byte from a bounded stream when more than one
  byte remains, advances the cursor, and returns true. Otherwise it marks the
  stream exhausted, writes a zero output byte, and returns false.

## Identity and accounting contract

There are exactly two physical post-body literal slots. Both share the one new
neutral identity `service_record_tag_62`, which is distinct from every prior
IPC literal identity. The cumulative IPC literal-pool contract is therefore
686 physical slots in 364 value classes.

There are exactly three direct-call sites. They resolve to the pairwise-distinct
ARM primary-entry identities `func_0017D058`, `func_00144D28`, and
`func_00300B28`, one site each. There are no secondary-entry identities,
external tail branches, branch addends, or immediate ARM-to-Thumb transfers.

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` terminates the executable body. A following
pool belongs to the preceding section but lies outside its function size.
Labels and directives occupy no executable bytes. Preserve every mnemonic,
operand, register, condition, addressing mode, immediate, local branch,
direct-call form, and pool order.

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

.global service_record_tag_62
.global func_0017D058,func_00144D28,func_00300B28

BEGIN func_0017CEC0
ldr r1,.Lpool_0017CEC0
ldrh r2,[r0,#20]
cmp r2,r1
addeq r1,r0,#20
beq .Lfound_0017CEC0
ldrh r2,[r0,#32]
cmp r2,r1
addeq r1,r0,#32
movne r1,#0
.Lfound_0017CEC0:
ldr r1,[r1,#4]
add r0,r0,r1
bx lr
END func_0017CEC0
.Lpool_0017CEC0:
.word service_record_tag_62

BEGIN func_0017CEF4
ldr r1,.Lpool_0017CEF4
ldrh r2,[r0,#20]
cmp r2,r1
addeq r0,r0,#20
beq .Lfound_0017CEF4
ldrh r2,[r0,#32]
cmp r2,r1
addeq r0,r0,#32
movne r0,#0
.Lfound_0017CEF4:
ldr r0,[r0,#4]
bx lr
END func_0017CEF4
.Lpool_0017CEF4:
.word service_record_tag_62

BEGIN func_0017CF24
ldrh r1,[r0,#20]
cmp r1,#26624
addeq r0,r0,#20
beq .Lfound_0017CF24
ldrh r1,[r0,#32]
cmp r1,#26624
addeq r0,r0,#32
movne r0,#0
.Lfound_0017CF24:
ldr r0,[r0,#4]
bx lr
END func_0017CF24

BEGIN func_0017CF4C
ldr r2,[r0,#52]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
movls r0,#0
bls .Ldone_0017CF4C
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
.Ldone_0017CF4C:
bx lr
END func_0017CF4C

BEGIN func_0017CF78
mov r2,#5
cmp r2,r1,lsr #24
bne .Lfalse_0017CF78
ldr r2,[r0,#28]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_0017CF78
.Lfalse_0017CF78:
mov r0,#0
bx lr
.Lentry_0017CF78:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_0017CF78

BEGIN func_0017CFC0
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#8
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
pop {r3,pc}
END func_0017CFC0

BEGIN func_0017CFE0
ldrh r1,[r0]
cmp r1,#0
subne r1,r1,#8192
subsne r1,r1,#524
beq .Lfalse_0017CFE0
cmp r1,#1
ldreq r1,[r0,#4]
addeq r0,r0,r1
beq .Ldone_0017CFE0
.Lfalse_0017CFE0:
mov r0,#0
.Ldone_0017CFE0:
bx lr
END func_0017CFE0

BEGIN func_0017D00C
ldrh r0,[r0]
cmp r0,#0
beq .Lfallback_0017D00C
sub r0,r0,#8192
subs r0,r0,#524
cmpne r0,#1
beq .Ldone_0017D00C
.Lfallback_0017D00C:
mov r0,#2
.Ldone_0017D00C:
bx lr
END func_0017D00C

BEGIN func_0017D030
ldrh r1,[r0]
cmp r1,#0
beq .Lfalse_0017D030
sub r1,r1,#8192
subs r1,r1,#524
ldreq r1,[r0,#4]
addeq r0,r0,r1
beq .Ldone_0017D030
.Lfalse_0017D030:
mov r0,#0
.Ldone_0017D030:
bx lr
END func_0017D030

BEGIN func_0017D058
push {r4,r5,r6,r7,r8}
mov r5,#0
cmn r2,#1
mov r3,r5
mov ip,r5
moveq r3,ip
beq .Lselected_0017D058
ldr r6,[r0]
mov ip,#0
add r4,r2,#1
mov r7,#1
.Lscan_0017D058:
tst r6,r7,lsl ip
beq .Lnext_0017D058
cmp ip,r2
add r3,r3,#1
moveq r5,#1
.Lnext_0017D058:
subs r4,r4,#1
add ip,ip,#1
bne .Lscan_0017D058
cmp r5,#0
beq .Lfalse_0017D058
.Lselected_0017D058:
cmp r3,#0
beq .Lfalse_0017D058
ldr r0,[r0,r3,lsl #2]
str r0,[r1]
pop {r4,r5,r6,r7,r8}
mov r0,#1
bx lr
.Lfalse_0017D058:
pop {r4,r5,r6,r7,r8}
mov r0,#0
bx lr
END func_0017D058

BEGIN func_0017D0D4
push {r4,r5}
ldrh ip,[r0,#16]
add r3,r0,#20
mov r5,r0
mov r0,#0
cmp ip,#0
mov r2,#22528
mov r1,r0
ble .Lreturn_0017D0D4
.Lloop_0017D0D4:
add r4,r1,r1,lsl #1
add r4,r3,r4,lsl #2
ldrh r4,[r4]
cmp r4,r2
bne .Lnext_0017D0D4
add r1,r1,r1,lsl #1
adds r1,r3,r1,lsl #2
ldrne r1,[r1,#4]
cmpne r1,#0
addne r0,r1,r5
beq .Lreturn_0017D0D4
.Lreturn_0017D0D4:
pop {r4,r5}
bx lr
.Lnext_0017D0D4:
add r1,r1,#1
cmp ip,r1
bgt .Lloop_0017D0D4
pop {r4,r5}
bx lr
END func_0017D0D4

BEGIN func_0017D140
ldr r2,[r0,#8]
ldr r3,[r1,#8]
ldr ip,[r2]
str ip,[r3]
ldr ip,[r2,#4]
str ip,[r3,#4]
ldr ip,[r2,#8]
str ip,[r3,#8]
ldr ip,[r2,#12]
str ip,[r3,#12]
ldr ip,[r2,#16]
str ip,[r3,#16]
ldr r2,[r2,#20]
str r2,[r3,#20]
ldrh r0,[r0,#4]
strh r0,[r1,#4]
bx lr
END func_0017D140

BEGIN func_0017D184
push {r4,r5,r6,lr}
mov r5,r1
mov r4,r0
add r1,r0,#8
mov r2,#404
add r0,r5,#8
bl func_00144D28
ldr r0,[r4,#4]
str r0,[r5,#4]
pop {r4,r5,r6,pc}
END func_0017D184

BEGIN func_0017D1AC
push {r4,r5,r6,lr}
mov r5,r1
ldr r1,[r0,#8]
mov r4,r0
ldr r0,[r5,#8]
mov r2,#36
bl func_00300B28
ldrh r0,[r4,#4]
strh r0,[r5,#4]
pop {r4,r5,r6,pc}
END func_0017D1AC

BEGIN func_0017D720
push {r4}
ldrd r2,[r0,#8]
mov ip,#1
ldr r4,[r2,#16]
sub r4,r4,r3
cmp r4,#1
bcc .Lempty_0017D720
ldr ip,[r2,#12]
ldr r2,[r2,#24]
add r2,r2,ip
ldrb r2,[r2,r3]
strb r2,[r1]
ldr r1,[r0,#12]
add r1,r1,#1
str r1,[r0,#12]
pop {r4}
mov r0,#1
bx lr
.Lempty_0017D720:
mov r2,#0
strb ip,[r0,#4]
strb r2,[r1]
pop {r4}
mov r0,r2
bx lr
END func_0017D720
```

## Relocation and size summary

- executable body bytes: 864;
- physical literal slots: 2;
- new literal equality classes: 1;
- cumulative literal slots/classes: 686 / 364;
- direct branch relocations: 3, all `R_ARM_CALL`;
- external tail branches: 0;
- secondary-entry identities and branch addends: none.

The independent probe assembled every schedule with GNU Arm, normalized only
the three symbolic call immediates and two symbolic literal words, and matched
all 864 executable bytes plus both adjacent pool slots exactly. The probe and
all extracted target fragments were deleted after verification.
