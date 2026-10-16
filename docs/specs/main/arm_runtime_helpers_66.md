# Probe-verified ARM runtime/helper batch 66

## Scope and provenance

This clean-room specification covers fifteen currently unmatched ARM-state,
call-free helpers totaling 2,596 executable body bytes. Evidence was limited
to the current unmatched report, the neutral symbol inventory, bounded
private-target control/data-flow inspection, and independently assembled
exact-schedule probes. Candidate selection was restricted to the disjoint
address interval 0x00200000..0x003FFFFF and excludes all earlier configured
functions plus duplicate batch 66 and IPC batch 62 reservations.

The functions contain no calls, external branches, relocations, literal-pool
loads, PC-relative address calculations, adjacent data, opaque absolute
addresses, or private strings/assets. No selected body belongs to an exact-
duplicate family. Independent ARMv6K assembly comparison against target
revision `AS_EUR_REV2` on 2026-10-16 matched all fifteen complete bodies
(2,596 bytes / 649 instructions).

## Semantic summary

- `func_002A1E48` (224 bytes) computes an eight-bit additive checksum over a
  byte span, consuming aligned words in a paired loop before folding the tail
  bytes and the accumulated word lanes into the result.
- `func_002E1B38` (212 bytes) reconciles related capability bits across three
  flag words, rejects mutually unsupported combinations, then clears or
  promotes the corresponding mode bits in the accepted state.
- `func_0037A278` (200 bytes) reserves the first available index in a bounded
  bitmap, appends a caller record to a compact pointer array, marks the bit,
  stores the selected index, and returns whether allocation succeeded.
- `func_003EA730` (196 bytes) compares two compact scalar/vector records using
  a caller-provided floating tolerance, first validating their discriminants
  and then checking every active component for bounded absolute difference.
- `func_003B206C` (184 bytes) inserts a halfword identifier into a small recent-
  value set, suppresses duplicates, appends while capacity remains, and
  otherwise shifts the retained window before placing the new value.
- `func_002FCFA4` (176 bytes) expands relative record offsets into pointers,
  counts records carrying a marker byte, resolves a trailing table descriptor,
  and copies its entries into an indexed destination cache.
- `func_003A72C0` (172 bytes) walks a variable-width halfword token stream,
  skips nested payloads, locates a requested token, and returns the relative
  halfword displacement or zero when no valid match exists.
- `func_0031AEC8` (164 bytes) scans a relative descriptor array, counts entry
  classes and their variable payload widths, and returns the aligned storage
  requirement for the resulting compact representation.
- `func_002FC97C` (164 bytes) initializes a state structure, clears two
  caller-sized pointer arrays, establishes sentinel fields, and enables the
  structure's initial validity flags.
- `func_0032053C` (160 bytes) decodes one indexed descriptor into an output
  record, resolves its relative payload pointer, skips an empty marker record,
  advances the owning cursor, and reports success or exhaustion.
- `func_003C8988` (156 bytes) installs one of two payload descriptors into the
  current slot of a fixed ring, records its type and value fields, and advances
  the slot index with signed-safe modulo reduction.
- `func_003A747C` (152 bytes) compares two variable-width halfword records,
  including their nested payload tokens, and returns a Boolean equality result.
- `func_00201B1C` (148 bytes) searches a linked free-region list for the
  smallest aligned span capable of satisfying a requested allocation size and
  returns the selected usable size.
- `func_0039C1D0` (144 bytes) walks a bounded collection of relative records,
  validates each record's mode mask and optional nested state, and writes a
  Boolean flag selected by the caller.
- `func_00328E4C` (144 bytes) clears a requested tail range in a packed table,
  updates its encoded active count, and clears the corresponding validity bit.

## Exact schedules

The following is the complete independently assembled artifact. Every
function has a zero-byte adjacent-data schedule. Local labels may be renamed
consistently. Preserve every mnemonic, operand, condition, memory mode,
instruction order, and function boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_002A1E48,"ax",%progbits
.balign 4
.global func_002A1E48
.type func_002A1E48, %function
func_002A1E48:
.Lfunc_002A1E48_0:
	push	{r3, r4, r5, r6, r7}
.Lfunc_002A1E48_4:
	mov	ip, #0
.Lfunc_002A1E48_8:
	lsrs	r5, r1, #2
.Lfunc_002A1E48_c:
	ldr	r3, [r0, #0xc]
.Lfunc_002A1E48_10:
	ldr	r0, [r0, #0x18]
.Lfunc_002A1E48_14:
	str	ip, [sp]
.Lfunc_002A1E48_18:
	add	ip, r3, r0
.Lfunc_002A1E48_1c:
	beq	.Lfunc_002A1E48_70
.Lfunc_002A1E48_20:
	tst	r5, #1
.Lfunc_002A1E48_24:
	sub	r0, ip, #4
.Lfunc_002A1E48_28:
	beq	.Lfunc_002A1E48_34
.Lfunc_002A1E48_2c:
	ldr	r3, [r0, #4]!
.Lfunc_002A1E48_30:
	str	r3, [sp]
.Lfunc_002A1E48_34:
	lsrs	r3, r5, #1
.Lfunc_002A1E48_38:
	mov	r4, #0
.Lfunc_002A1E48_3c:
	beq	.Lfunc_002A1E48_60
.Lfunc_002A1E48_40:
	ldr	r6, [r0, #4]
.Lfunc_002A1E48_44:
	ldr	r7, [sp]
.Lfunc_002A1E48_48:
	subs	r3, r3, #1
.Lfunc_002A1E48_4c:
	add	r6, r6, r7
.Lfunc_002A1E48_50:
	str	r6, [sp]
.Lfunc_002A1E48_54:
	ldr	r6, [r0, #8]!
.Lfunc_002A1E48_58:
	add	r4, r4, r6
.Lfunc_002A1E48_5c:
	bne	.Lfunc_002A1E48_40
.Lfunc_002A1E48_60:
	ldr	r0, [sp]
.Lfunc_002A1E48_64:
	add	ip, ip, r5, lsl #2
.Lfunc_002A1E48_68:
	add	r0, r0, r4
.Lfunc_002A1E48_6c:
	str	r0, [sp]
.Lfunc_002A1E48_70:
	ands	r1, r1, #3
.Lfunc_002A1E48_74:
	beq	.Lfunc_002A1E48_b4
.Lfunc_002A1E48_78:
	tst	r1, #1
.Lfunc_002A1E48_7c:
	sub	r0, ip, #1
.Lfunc_002A1E48_80:
	beq	.Lfunc_002A1E48_90
.Lfunc_002A1E48_84:
	ldrb	r3, [r0, #1]!
.Lfunc_002A1E48_88:
	add	r2, r2, r3
.Lfunc_002A1E48_8c:
	and	r2, r2, #0xff
.Lfunc_002A1E48_90:
	lsrs	r1, r1, #1
.Lfunc_002A1E48_94:
	beq	.Lfunc_002A1E48_b4
.Lfunc_002A1E48_98:
	ldrb	r3, [r0, #1]
.Lfunc_002A1E48_9c:
	ldrb	ip, [r0, #2]!
.Lfunc_002A1E48_a0:
	subs	r1, r1, #1
.Lfunc_002A1E48_a4:
	add	r2, r2, r3
.Lfunc_002A1E48_a8:
	add	r2, r2, ip
.Lfunc_002A1E48_ac:
	and	r2, r2, #0xff
.Lfunc_002A1E48_b0:
	bne	.Lfunc_002A1E48_98
.Lfunc_002A1E48_b4:
	ldrb	r0, [sp]
.Lfunc_002A1E48_b8:
	ldrb	ip, [sp, #1]
.Lfunc_002A1E48_bc:
	ldrb	r3, [sp, #2]
.Lfunc_002A1E48_c0:
	add	r0, r0, r2
.Lfunc_002A1E48_c4:
	ldrb	r1, [sp, #3]
.Lfunc_002A1E48_c8:
	add	r0, r0, ip
.Lfunc_002A1E48_cc:
	add	r0, r0, r3
.Lfunc_002A1E48_d0:
	pop	{r3, r4, r5, r6, r7}
.Lfunc_002A1E48_d4:
	add	r0, r0, r1
.Lfunc_002A1E48_d8:
	and	r0, r0, #0xff
.Lfunc_002A1E48_dc:
	bx	lr
.size func_002A1E48, .-func_002A1E48

.section .text.func_002E1B38,"ax",%progbits
.balign 4
.global func_002E1B38
.type func_002E1B38, %function
func_002E1B38:
.Lfunc_002E1B38_0:
	add	r2, r0, #8
.Lfunc_002E1B38_4:
	add	r1, r0, #4
.Lfunc_002E1B38_8:
	mov	r0, r0
.Lfunc_002E1B38_c:
	str	r4, [sp, #-4]!
.Lfunc_002E1B38_10:
	ldr	r3, [r1]
.Lfunc_002E1B38_14:
	mov	ip, #0xc
.Lfunc_002E1B38_18:
	bics	r4, ip, r3
.Lfunc_002E1B38_1c:
	beq	.Lfunc_002E1B38_c4
.Lfunc_002E1B38_20:
	tst	r3, #4
.Lfunc_002E1B38_24:
	beq	.Lfunc_002E1B38_34
.Lfunc_002E1B38_28:
	ldr	r4, [r0]
.Lfunc_002E1B38_2c:
	tst	r4, #8
.Lfunc_002E1B38_30:
	beq	.Lfunc_002E1B38_c4
.Lfunc_002E1B38_34:
	tst	r3, #8
.Lfunc_002E1B38_38:
	beq	.Lfunc_002E1B38_48
.Lfunc_002E1B38_3c:
	ldr	r4, [r0]
.Lfunc_002E1B38_40:
	tst	r4, #4
.Lfunc_002E1B38_44:
	beq	.Lfunc_002E1B38_c4
.Lfunc_002E1B38_48:
	bic	r3, r3, #8
.Lfunc_002E1B38_4c:
	str	r3, [r1]
.Lfunc_002E1B38_50:
	ldr	r3, [r2]
.Lfunc_002E1B38_54:
	bics	ip, ip, r3
.Lfunc_002E1B38_58:
	beq	.Lfunc_002E1B38_cc
.Lfunc_002E1B38_5c:
	tst	r3, #4
.Lfunc_002E1B38_60:
	beq	.Lfunc_002E1B38_70
.Lfunc_002E1B38_64:
	ldr	ip, [r0]
.Lfunc_002E1B38_68:
	tst	ip, #8
.Lfunc_002E1B38_6c:
	beq	.Lfunc_002E1B38_cc
.Lfunc_002E1B38_70:
	tst	r3, #8
.Lfunc_002E1B38_74:
	beq	.Lfunc_002E1B38_84
.Lfunc_002E1B38_78:
	ldr	ip, [r0]
.Lfunc_002E1B38_7c:
	tst	ip, #4
.Lfunc_002E1B38_80:
	beq	.Lfunc_002E1B38_cc
.Lfunc_002E1B38_84:
	bic	r3, r3, #8
.Lfunc_002E1B38_88:
	str	r3, [r2]
.Lfunc_002E1B38_8c:
	ldr	r3, [r0]
.Lfunc_002E1B38_90:
	tst	r3, #4
.Lfunc_002E1B38_94:
	beq	.Lfunc_002E1B38_a4
.Lfunc_002E1B38_98:
	bic	r3, r3, #4
.Lfunc_002E1B38_9c:
	orr	r3, r3, #8
.Lfunc_002E1B38_a0:
	str	r3, [r0]
.Lfunc_002E1B38_a4:
	ldr	r0, [r1]
.Lfunc_002E1B38_a8:
	bic	r0, r0, #4
.Lfunc_002E1B38_ac:
	str	r0, [r1]
.Lfunc_002E1B38_b0:
	ldr	r0, [r2]
.Lfunc_002E1B38_b4:
	bic	r0, r0, #4
.Lfunc_002E1B38_b8:
	str	r0, [r2]
.Lfunc_002E1B38_bc:
	pop	{r4}
.Lfunc_002E1B38_c0:
	bx	lr
.Lfunc_002E1B38_c4:
	orr	r3, r3, #8
.Lfunc_002E1B38_c8:
	b	.Lfunc_002E1B38_4c
.Lfunc_002E1B38_cc:
	orr	r3, r3, #8
.Lfunc_002E1B38_d0:
	b	.Lfunc_002E1B38_88
.size func_002E1B38, .-func_002E1B38

.section .text.func_0037A278,"ax",%progbits
.balign 4
.global func_0037A278
.type func_0037A278, %function
func_0037A278:
.Lfunc_0037A278_0:
	push	{r4, r5, r6, r7, r8, sb}
.Lfunc_0037A278_4:
	ldrb	r2, [r0, #8]
.Lfunc_0037A278_8:
	strb	r2, [r1, #0x1c]
.Lfunc_0037A278_c:
	ldr	r3, [r0, #0xc]
.Lfunc_0037A278_10:
	ldr	r4, [r0, #4]
.Lfunc_0037A278_14:
	ldr	r6, [r3, #8]
.Lfunc_0037A278_18:
	cmp	r4, r6
.Lfunc_0037A278_1c:
	bls	.Lfunc_0037A278_60
.Lfunc_0037A278_20:
	cmp	r4, #0
.Lfunc_0037A278_24:
	ldrhi	r5, [r0, #0x10]
.Lfunc_0037A278_28:
	mov	r2, #0
.Lfunc_0037A278_2c:
	ldrhi	r7, [r5]
.Lfunc_0037A278_30:
	bls	.Lfunc_0037A278_60
.Lfunc_0037A278_34:
	cmp	r7, r2
.Lfunc_0037A278_38:
	bls	.Lfunc_0037A278_6c
.Lfunc_0037A278_3c:
	ldr	r8, [r5, #4]
.Lfunc_0037A278_40:
	and	sb, r2, #7
.Lfunc_0037A278_44:
	ldrb	ip, [r8, r2, lsr #3]
.Lfunc_0037A278_48:
	lsr	ip, ip, sb
.Lfunc_0037A278_4c:
	tst	ip, #1
.Lfunc_0037A278_50:
	beq	.Lfunc_0037A278_6c
.Lfunc_0037A278_54:
	add	r2, r2, #1
.Lfunc_0037A278_58:
	cmp	r4, r2
.Lfunc_0037A278_5c:
	bhi	.Lfunc_0037A278_34
.Lfunc_0037A278_60:
	pop	{r4, r5, r6, r7, r8, sb}
.Lfunc_0037A278_64:
	mov	r0, #0
.Lfunc_0037A278_68:
	bx	lr
.Lfunc_0037A278_6c:
	ldr	ip, [r3]
.Lfunc_0037A278_70:
	cmp	ip, #0
.Lfunc_0037A278_74:
	ldrne	r4, [r3, #4]
.Lfunc_0037A278_78:
	cmpne	r4, r6
.Lfunc_0037A278_7c:
	bls	.Lfunc_0037A278_90
.Lfunc_0037A278_80:
	str	r1, [ip, r6, lsl #2]
.Lfunc_0037A278_84:
	ldr	ip, [r3, #8]
.Lfunc_0037A278_88:
	add	ip, ip, #1
.Lfunc_0037A278_8c:
	str	ip, [r3, #8]
.Lfunc_0037A278_90:
	ldr	r0, [r0, #0x10]
.Lfunc_0037A278_94:
	ldr	r3, [r0]
.Lfunc_0037A278_98:
	cmp	r3, r2
.Lfunc_0037A278_9c:
	bls	.Lfunc_0037A278_b8
.Lfunc_0037A278_a0:
	ldr	r0, [r0, #4]
.Lfunc_0037A278_a4:
	and	r4, r2, #7
.Lfunc_0037A278_a8:
	mov	ip, #1
.Lfunc_0037A278_ac:
	ldrb	r3, [r0, r2, lsr #3]
.Lfunc_0037A278_b0:
	orr	r3, r3, ip, lsl r4
.Lfunc_0037A278_b4:
	strb	r3, [r0, r2, lsr #3]
.Lfunc_0037A278_b8:
	str	r2, [r1, #4]
.Lfunc_0037A278_bc:
	pop	{r4, r5, r6, r7, r8, sb}
.Lfunc_0037A278_c0:
	mov	r0, #1
.Lfunc_0037A278_c4:
	bx	lr
.size func_0037A278, .-func_0037A278

.section .text.func_003EA730,"ax",%progbits
.balign 4
.global func_003EA730
.type func_003EA730, %function
func_003EA730:
.Lfunc_003EA730_0:
	ldrh	r3, [r1]
.Lfunc_003EA730_4:
	ldrh	r2, [r0]
.Lfunc_003EA730_8:
	cmp	r2, r3
.Lfunc_003EA730_c:
	bne	.Lfunc_003EA730_bc
.Lfunc_003EA730_10:
	cmp	r2, #0
.Lfunc_003EA730_14:
	beq	.Lfunc_003EA730_68
.Lfunc_003EA730_18:
	ldr	r2, [r0, #4]
.Lfunc_003EA730_1c:
	ldr	r3, [r1, #4]
.Lfunc_003EA730_20:
	cmp	r2, r3
.Lfunc_003EA730_24:
	bne	.Lfunc_003EA730_bc
.Lfunc_003EA730_28:
	vldr	s2, [r0, #0xc]
.Lfunc_003EA730_2c:
	vldr	s0, [r1, #0xc]
.Lfunc_003EA730_30:
	vsub.f32	s0, s2, s0
.Lfunc_003EA730_34:
	vabs.f32	s0, s0
.Lfunc_003EA730_38:
	vcmpe.f32	s0, s1
.Lfunc_003EA730_3c:
	vmrs	apsr_nzcv, fpscr
.Lfunc_003EA730_40:
	bhi	.Lfunc_003EA730_bc
.Lfunc_003EA730_44:
	vldr	s0, [r0, #0x10]
.Lfunc_003EA730_48:
	vldr	s2, [r1, #0x10]
.Lfunc_003EA730_4c:
	vsub.f32	s0, s0, s2
.Lfunc_003EA730_50:
	vabs.f32	s0, s0
.Lfunc_003EA730_54:
	vcmpe.f32	s0, s1
.Lfunc_003EA730_58:
	vmrs	apsr_nzcv, fpscr
.Lfunc_003EA730_5c:
	bhi	.Lfunc_003EA730_bc
.Lfunc_003EA730_60:
	mov	r0, #1
.Lfunc_003EA730_64:
	bx	lr
.Lfunc_003EA730_68:
	vldr	s3, [r0, #4]
.Lfunc_003EA730_6c:
	vldr	s2, [r1, #4]
.Lfunc_003EA730_70:
	vsub.f32	s2, s3, s2
.Lfunc_003EA730_74:
	vabs.f32	s2, s2
.Lfunc_003EA730_78:
	vcmpe.f32	s2, s1
.Lfunc_003EA730_7c:
	vmrs	apsr_nzcv, fpscr
.Lfunc_003EA730_80:
	bhi	.Lfunc_003EA730_bc
.Lfunc_003EA730_84:
	vldr	s3, [r0, #8]
.Lfunc_003EA730_88:
	vldr	s2, [r1, #8]
.Lfunc_003EA730_8c:
	vsub.f32	s2, s3, s2
.Lfunc_003EA730_90:
	vabs.f32	s2, s2
.Lfunc_003EA730_94:
	vcmpe.f32	s2, s0
.Lfunc_003EA730_98:
	vmrs	apsr_nzcv, fpscr
.Lfunc_003EA730_9c:
	bhi	.Lfunc_003EA730_bc
.Lfunc_003EA730_a0:
	vldr	s0, [r0, #0xc]
.Lfunc_003EA730_a4:
	vldr	s2, [r1, #0xc]
.Lfunc_003EA730_a8:
	vsub.f32	s0, s0, s2
.Lfunc_003EA730_ac:
	vabs.f32	s0, s0
.Lfunc_003EA730_b0:
	vcmpe.f32	s0, s1
.Lfunc_003EA730_b4:
	vmrs	apsr_nzcv, fpscr
.Lfunc_003EA730_b8:
	bls	.Lfunc_003EA730_60
.Lfunc_003EA730_bc:
	mov	r0, #0
.Lfunc_003EA730_c0:
	bx	lr
.size func_003EA730, .-func_003EA730

.section .text.func_003B206C,"ax",%progbits
.balign 4
.global func_003B206C
.type func_003B206C, %function
func_003B206C:
.Lfunc_003B206C_0:
	cmp	r1, #0
.Lfunc_003B206C_4:
	str	r4, [sp, #-4]!
.Lfunc_003B206C_8:
	beq	.Lfunc_003B206C_8c
.Lfunc_003B206C_c:
	ldr	r3, [r0, #0x38]
.Lfunc_003B206C_10:
	cmp	r3, #0
.Lfunc_003B206C_14:
	beq	.Lfunc_003B206C_78
.Lfunc_003B206C_18:
	and	r2, r3, #1
.Lfunc_003B206C_1c:
	cmp	r2, #0
.Lfunc_003B206C_20:
	mov	ip, #0
.Lfunc_003B206C_24:
	bls	.Lfunc_003B206C_44
.Lfunc_003B206C_28:
	add	r4, r0, ip, lsl #1
.Lfunc_003B206C_2c:
	ldrh	r4, [r4, #0x3c]
.Lfunc_003B206C_30:
	cmp	r4, r1
.Lfunc_003B206C_34:
	beq	.Lfunc_003B206C_8c
.Lfunc_003B206C_38:
	add	ip, ip, #1
.Lfunc_003B206C_3c:
	cmp	r2, ip
.Lfunc_003B206C_40:
	bhi	.Lfunc_003B206C_28
.Lfunc_003B206C_44:
	cmp	r2, r3
.Lfunc_003B206C_48:
	bhs	.Lfunc_003B206C_70
.Lfunc_003B206C_4c:
	add	ip, r0, r2, lsl #1
.Lfunc_003B206C_50:
	ldrh	r4, [ip, #0x3c]
.Lfunc_003B206C_54:
	cmp	r4, r1
.Lfunc_003B206C_58:
	ldrhne	ip, [ip, #0x3e]
.Lfunc_003B206C_5c:
	cmpne	ip, r1
.Lfunc_003B206C_60:
	beq	.Lfunc_003B206C_8c
.Lfunc_003B206C_64:
	add	r2, r2, #2
.Lfunc_003B206C_68:
	cmp	r3, r2
.Lfunc_003B206C_6c:
	bhi	.Lfunc_003B206C_4c
.Lfunc_003B206C_70:
	cmp	r3, #4
.Lfunc_003B206C_74:
	bhs	.Lfunc_003B206C_94
.Lfunc_003B206C_78:
	add	r2, r0, r3, lsl #1
.Lfunc_003B206C_7c:
	strh	r1, [r2, #0x3c]
.Lfunc_003B206C_80:
	ldr	r1, [r0, #0x38]
.Lfunc_003B206C_84:
	add	r1, r1, #1
.Lfunc_003B206C_88:
	str	r1, [r0, #0x38]
.Lfunc_003B206C_8c:
	pop	{r4}
.Lfunc_003B206C_90:
	bx	lr
.Lfunc_003B206C_94:
	ldrh	r2, [r0, #0x3e]
.Lfunc_003B206C_98:
	ldrh	r3, [r0, #0x40]
.Lfunc_003B206C_9c:
	ldrh	ip, [r0, #0x42]
.Lfunc_003B206C_a0:
	strh	r2, [r0, #0x3c]
.Lfunc_003B206C_a4:
	strh	r3, [r0, #0x3e]
.Lfunc_003B206C_a8:
	strh	ip, [r0, #0x40]
.Lfunc_003B206C_ac:
	strh	r1, [r0, #0x42]
.Lfunc_003B206C_b0:
	pop	{r4}
.Lfunc_003B206C_b4:
	bx	lr
.size func_003B206C, .-func_003B206C

.section .text.func_002FCFA4,"ax",%progbits
.balign 4
.global func_002FCFA4
.type func_002FCFA4, %function
func_002FCFA4:
.Lfunc_002FCFA4_0:
	str	r4, [sp, #-4]!
.Lfunc_002FCFA4_4:
	ldr	r1, [r0]
.Lfunc_002FCFA4_8:
	ldr	r2, [r1, #4]!
.Lfunc_002FCFA4_c:
	add	r1, r1, #4
.Lfunc_002FCFA4_10:
	cmp	r2, #0
.Lfunc_002FCFA4_14:
	str	r2, [r0, #4]
.Lfunc_002FCFA4_18:
	mov	r2, #0
.Lfunc_002FCFA4_1c:
	bls	.Lfunc_002FCFA4_60
.Lfunc_002FCFA4_20:
	ldr	r3, [r0]
.Lfunc_002FCFA4_24:
	ldr	ip, [r1]
.Lfunc_002FCFA4_28:
	add	r4, r0, r2, lsl #2
.Lfunc_002FCFA4_2c:
	add	r3, r3, ip
.Lfunc_002FCFA4_30:
	str	r3, [r4, #8]
.Lfunc_002FCFA4_34:
	ldrb	r3, [r3, #6]
.Lfunc_002FCFA4_38:
	cmp	r3, #0
.Lfunc_002FCFA4_3c:
	beq	.Lfunc_002FCFA4_4c
.Lfunc_002FCFA4_40:
	ldr	r3, [r0, #0x294]
.Lfunc_002FCFA4_44:
	add	r3, r3, #1
.Lfunc_002FCFA4_48:
	str	r3, [r0, #0x294]
.Lfunc_002FCFA4_4c:
	ldr	r3, [r0, #4]
.Lfunc_002FCFA4_50:
	add	r2, r2, #1
.Lfunc_002FCFA4_54:
	add	r1, r1, #4
.Lfunc_002FCFA4_58:
	cmp	r3, r2
.Lfunc_002FCFA4_5c:
	bhi	.Lfunc_002FCFA4_20
.Lfunc_002FCFA4_60:
	ldr	r3, [r1, #8]
.Lfunc_002FCFA4_64:
	add	r3, r3, r1
.Lfunc_002FCFA4_68:
	str	r3, [r0, #0x88]
.Lfunc_002FCFA4_6c:
	ldr	r3, [r1, #0xc]
.Lfunc_002FCFA4_70:
	str	r3, [r0, #0x8c]
.Lfunc_002FCFA4_74:
	ldr	r2, [r1, #0x14]
.Lfunc_002FCFA4_78:
	ldr	r3, [r1, #0x10]
.Lfunc_002FCFA4_7c:
	cmp	r2, #0
.Lfunc_002FCFA4_80:
	add	r1, r1, r3
.Lfunc_002FCFA4_84:
	movne	r3, #0
.Lfunc_002FCFA4_88:
	str	r2, [r0, #0x290]
.Lfunc_002FCFA4_8c:
	beq	.Lfunc_002FCFA4_a8
.Lfunc_002FCFA4_90:
	ldr	ip, [r1], #8
.Lfunc_002FCFA4_94:
	add	r4, r0, r3, lsl #2
.Lfunc_002FCFA4_98:
	subs	r2, r2, #1
.Lfunc_002FCFA4_9c:
	add	r3, r3, #1
.Lfunc_002FCFA4_a0:
	str	ip, [r4, #0x90]
.Lfunc_002FCFA4_a4:
	bne	.Lfunc_002FCFA4_90
.Lfunc_002FCFA4_a8:
	pop	{r4}
.Lfunc_002FCFA4_ac:
	bx	lr
.size func_002FCFA4, .-func_002FCFA4

.section .text.func_003A72C0,"ax",%progbits
.balign 4
.global func_003A72C0
.type func_003A72C0, %function
func_003A72C0:
.Lfunc_003A72C0_0:
	cmp	r1, #0
.Lfunc_003A72C0_4:
	beq	.Lfunc_003A72C0_60
.Lfunc_003A72C0_8:
	ldrh	r2, [r0]
.Lfunc_003A72C0_c:
	cmp	r2, #0
.Lfunc_003A72C0_10:
	beq	.Lfunc_003A72C0_a4
.Lfunc_003A72C0_14:
	uxth	r2, r2
.Lfunc_003A72C0_18:
	cmp	r2, #0xa
.Lfunc_003A72C0_1c:
	beq	.Lfunc_003A72C0_30
.Lfunc_003A72C0_20:
	cmp	r2, #0x10
.Lfunc_003A72C0_24:
	addne	r0, r0, #2
.Lfunc_003A72C0_28:
	beq	.Lfunc_003A72C0_40
.Lfunc_003A72C0_2c:
	b	.Lfunc_003A72C0_4c
.Lfunc_003A72C0_30:
	subs	r1, r1, #1
.Lfunc_003A72C0_34:
	add	r0, r0, #2
.Lfunc_003A72C0_38:
	beq	.Lfunc_003A72C0_60
.Lfunc_003A72C0_3c:
	b	.Lfunc_003A72C0_4c
.Lfunc_003A72C0_40:
	ldrh	r2, [r0, #2]
.Lfunc_003A72C0_44:
	add	r2, r2, #2
.Lfunc_003A72C0_48:
	add	r0, r0, r2, lsl #1
.Lfunc_003A72C0_4c:
	ldrh	r2, [r0]
.Lfunc_003A72C0_50:
	cmp	r2, #0
.Lfunc_003A72C0_54:
	bne	.Lfunc_003A72C0_14
.Lfunc_003A72C0_58:
	cmp	r1, #0
.Lfunc_003A72C0_5c:
	bne	.Lfunc_003A72C0_a4
.Lfunc_003A72C0_60:
	cmp	r0, #0
.Lfunc_003A72C0_64:
	movne	r2, r0
.Lfunc_003A72C0_68:
	beq	.Lfunc_003A72C0_a4
.Lfunc_003A72C0_6c:
	b	.Lfunc_003A72C0_88
.Lfunc_003A72C0_70:
	cmp	r1, #0x10
.Lfunc_003A72C0_74:
	addne	r0, r0, #2
.Lfunc_003A72C0_78:
	bne	.Lfunc_003A72C0_88
.Lfunc_003A72C0_7c:
	ldrh	r1, [r0, #2]
.Lfunc_003A72C0_80:
	add	r1, r1, #2
.Lfunc_003A72C0_84:
	add	r0, r0, r1, lsl #1
.Lfunc_003A72C0_88:
	ldrh	r1, [r0]
.Lfunc_003A72C0_8c:
	cmp	r1, #0
.Lfunc_003A72C0_90:
	cmpne	r1, #0xa
.Lfunc_003A72C0_94:
	bne	.Lfunc_003A72C0_70
.Lfunc_003A72C0_98:
	sub	r0, r0, r2
.Lfunc_003A72C0_9c:
	asr	r0, r0, #1
.Lfunc_003A72C0_a0:
	bx	lr
.Lfunc_003A72C0_a4:
	mov	r0, #0
.Lfunc_003A72C0_a8:
	bx	lr
.size func_003A72C0, .-func_003A72C0

.section .text.func_0031AEC8,"ax",%progbits
.balign 4
.global func_0031AEC8
.type func_0031AEC8, %function
func_0031AEC8:
.Lfunc_0031AEC8_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_0031AEC8_4:
	mov	r2, #0
.Lfunc_0031AEC8_8:
	mov	ip, r2
.Lfunc_0031AEC8_c:
	ldr	r5, [r0, #0x38]
.Lfunc_0031AEC8_10:
	mov	r3, r2
.Lfunc_0031AEC8_14:
	cmp	r5, #0
.Lfunc_0031AEC8_18:
	movle	r0, #6
.Lfunc_0031AEC8_1c:
	ble	.Lfunc_0031AEC8_98
.Lfunc_0031AEC8_20:
	ldr	r4, [r0, #0x3c]
.Lfunc_0031AEC8_24:
	mov	r6, #0
.Lfunc_0031AEC8_28:
	add	r1, r0, #0x3c
.Lfunc_0031AEC8_2c:
	cmp	r4, #0
.Lfunc_0031AEC8_30:
	addne	r1, r1, r4
.Lfunc_0031AEC8_34:
	moveq	r1, r6
.Lfunc_0031AEC8_38:
	add	r7, r1, r3, lsl #2
.Lfunc_0031AEC8_3c:
	ldr	r1, [r7]
.Lfunc_0031AEC8_40:
	cmp	r1, #0
.Lfunc_0031AEC8_44:
	addne	r1, r1, r7
.Lfunc_0031AEC8_48:
	moveq	r1, r6
.Lfunc_0031AEC8_4c:
	ldr	r7, [r1, #8]
.Lfunc_0031AEC8_50:
	tst	r7, #1
.Lfunc_0031AEC8_54:
	addne	r2, r2, #1
.Lfunc_0031AEC8_58:
	bne	.Lfunc_0031AEC8_70
.Lfunc_0031AEC8_5c:
	tst	r7, #2
.Lfunc_0031AEC8_60:
	ldrne	r1, [r1, #0x28]
.Lfunc_0031AEC8_64:
	add	ip, ip, #2
.Lfunc_0031AEC8_68:
	addne	r2, r2, r1
.Lfunc_0031AEC8_6c:
	addeq	r2, r2, #1
.Lfunc_0031AEC8_70:
	add	r3, r3, #1
.Lfunc_0031AEC8_74:
	cmp	r3, r5
.Lfunc_0031AEC8_78:
	blt	.Lfunc_0031AEC8_28
.Lfunc_0031AEC8_7c:
	sub	r1, r2, #1
.Lfunc_0031AEC8_80:
	cmp	r1, #0
.Lfunc_0031AEC8_84:
	add	r0, ip, #6
.Lfunc_0031AEC8_88:
	ble	.Lfunc_0031AEC8_98
.Lfunc_0031AEC8_8c:
	add	r1, r2, r2, lsl #1
.Lfunc_0031AEC8_90:
	add	r0, r0, r1, lsl #1
.Lfunc_0031AEC8_94:
	sub	r0, r0, #6
.Lfunc_0031AEC8_98:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_0031AEC8_9c:
	lsl	r0, r0, #2
.Lfunc_0031AEC8_a0:
	bx	lr
.size func_0031AEC8, .-func_0031AEC8

.section .text.func_002FC97C,"ax",%progbits
.balign 4
.global func_002FC97C
.type func_002FC97C, %function
func_002FC97C:
.Lfunc_002FC97C_0:
	push	{r4, r5}
.Lfunc_002FC97C_4:
	mov	r3, #0
.Lfunc_002FC97C_8:
	mvn	r4, #0
.Lfunc_002FC97C_c:
	str	r3, [r0]
.Lfunc_002FC97C_10:
	mov	ip, #1
.Lfunc_002FC97C_14:
	str	r4, [r0, #0x9c]
.Lfunc_002FC97C_18:
	strb	ip, [r0, #0xa9]
.Lfunc_002FC97C_1c:
	str	r3, [r0, #4]
.Lfunc_002FC97C_20:
	strb	ip, [r0, #0xab]
.Lfunc_002FC97C_24:
	ldr	r2, [r0, #0xa4]
.Lfunc_002FC97C_28:
	mov	r1, r3
.Lfunc_002FC97C_2c:
	cmp	r2, #0
.Lfunc_002FC97C_30:
	ble	.Lfunc_002FC97C_50
.Lfunc_002FC97C_34:
	ldr	r5, [r0, #0x24]
.Lfunc_002FC97C_38:
	mov	r2, r1
.Lfunc_002FC97C_3c:
	add	r1, r1, #1
.Lfunc_002FC97C_40:
	str	r3, [r5, r2, lsl #2]
.Lfunc_002FC97C_44:
	ldr	r2, [r0, #0xa4]
.Lfunc_002FC97C_48:
	cmp	r2, r1
.Lfunc_002FC97C_4c:
	bgt	.Lfunc_002FC97C_34
.Lfunc_002FC97C_50:
	str	r3, [r0, #0xa4]
.Lfunc_002FC97C_54:
	strb	ip, [r0, #0xa8]
.Lfunc_002FC97C_58:
	ldr	r2, [r0, #0xa0]
.Lfunc_002FC97C_5c:
	mov	r1, #0
.Lfunc_002FC97C_60:
	cmp	r2, #0
.Lfunc_002FC97C_64:
	ble	.Lfunc_002FC97C_84
.Lfunc_002FC97C_68:
	ldr	r5, [r0, #0xc]
.Lfunc_002FC97C_6c:
	mov	r2, r1
.Lfunc_002FC97C_70:
	add	r1, r1, #1
.Lfunc_002FC97C_74:
	str	r3, [r5, r2, lsl #2]
.Lfunc_002FC97C_78:
	ldr	r2, [r0, #0xa0]
.Lfunc_002FC97C_7c:
	cmp	r2, r1
.Lfunc_002FC97C_80:
	bgt	.Lfunc_002FC97C_68
.Lfunc_002FC97C_84:
	str	r3, [r0, #0xa0]
.Lfunc_002FC97C_88:
	strb	ip, [r0, #0xaa]
.Lfunc_002FC97C_8c:
	str	r3, [r0, #0x60]
.Lfunc_002FC97C_90:
	strb	ip, [r0, #0xac]
.Lfunc_002FC97C_94:
	str	r3, [r0, #0x64]!
.Lfunc_002FC97C_98:
	str	r4, [r0, #0x14]
.Lfunc_002FC97C_9c:
	pop	{r4, r5}
.Lfunc_002FC97C_a0:
	bx	lr
.size func_002FC97C, .-func_002FC97C

.section .text.func_0032053C,"ax",%progbits
.balign 4
.global func_0032053C
.type func_0032053C, %function
func_0032053C:
.Lfunc_0032053C_0:
	push	{r4, r5, r6}
.Lfunc_0032053C_4:
	ldr	ip, [r0]
.Lfunc_0032053C_8:
	ldr	r2, [r0, #8]
.Lfunc_0032053C_c:
	ldr	r3, [ip, #4]
.Lfunc_0032053C_10:
	ldr	r4, [r0, #4]
.Lfunc_0032053C_14:
	cmp	r4, r2
.Lfunc_0032053C_18:
	ldrlo	r4, [r0, #0xc]
.Lfunc_0032053C_1c:
	cmplo	r2, r4
.Lfunc_0032053C_20:
	blo	.Lfunc_0032053C_30
.Lfunc_0032053C_24:
	pop	{r4, r5, r6}
.Lfunc_0032053C_28:
	mov	r0, #0
.Lfunc_0032053C_2c:
	bx	lr
.Lfunc_0032053C_30:
	add	r4, r2, r2, lsl #1
.Lfunc_0032053C_34:
	str	r2, [r1, #4]
.Lfunc_0032053C_38:
	str	ip, [r1]
.Lfunc_0032053C_3c:
	ldr	r5, [r3, r4, lsl #2]
.Lfunc_0032053C_40:
	ands	r5, r5, #0xff000000
.Lfunc_0032053C_44:
	movne	r5, #1
.Lfunc_0032053C_48:
	strb	r5, [r1, #0xc]
.Lfunc_0032053C_4c:
	ldr	r6, [r3, r4, lsl #2]
.Lfunc_0032053C_50:
	ldr	r5, [ip, #0x10]
.Lfunc_0032053C_54:
	bic	r6, r6, #0xff000000
.Lfunc_0032053C_58:
	add	r5, r5, r6
.Lfunc_0032053C_5c:
	str	r5, [r1, #8]
.Lfunc_0032053C_60:
	ldrh	r6, [r5]
.Lfunc_0032053C_64:
	cmp	r6, #0x2e
.Lfunc_0032053C_68:
	ldrheq	r5, [r5, #2]
.Lfunc_0032053C_6c:
	cmpeq	r5, #0
.Lfunc_0032053C_70:
	addeq	r2, r2, #1
.Lfunc_0032053C_74:
	beq	.Lfunc_0032053C_10
.Lfunc_0032053C_78:
	add	r1, r2, r2, lsl #1
.Lfunc_0032053C_7c:
	ldr	r1, [r3, r1, lsl #2]
.Lfunc_0032053C_80:
	tst	r1, #0xff000000
.Lfunc_0032053C_84:
	addne	r1, r3, r4, lsl #2
.Lfunc_0032053C_88:
	ldrne	r1, [r1, #8]
.Lfunc_0032053C_8c:
	addeq	r1, r2, #1
.Lfunc_0032053C_90:
	str	r1, [r0, #8]
.Lfunc_0032053C_94:
	pop	{r4, r5, r6}
.Lfunc_0032053C_98:
	mov	r0, #1
.Lfunc_0032053C_9c:
	bx	lr
.size func_0032053C, .-func_0032053C

.section .text.func_003C8988,"ax",%progbits
.balign 4
.global func_003C8988
.type func_003C8988, %function
func_003C8988:
.Lfunc_003C8988_0:
	str	r4, [sp, #-4]!
.Lfunc_003C8988_4:
	ldr	r4, [r0, #0xa10]
.Lfunc_003C8988_8:
	cmp	r2, #0
.Lfunc_003C8988_c:
	add	ip, r0, #0xa10
.Lfunc_003C8988_10:
	add	r4, r0, r4, lsl #4
.Lfunc_003C8988_14:
	str	r1, [r4, #0x810]
.Lfunc_003C8988_18:
	beq	.Lfunc_003C8988_4c
.Lfunc_003C8988_1c:
	ldr	r3, [r0, #0xa10]
.Lfunc_003C8988_20:
	mov	r1, #0
.Lfunc_003C8988_24:
	add	r3, r0, r3, lsl #4
.Lfunc_003C8988_28:
	str	r2, [r3, #0x81c]
.Lfunc_003C8988_2c:
	ldr	r3, [ip]
.Lfunc_003C8988_30:
	ldr	r2, [r2]
.Lfunc_003C8988_34:
	add	r3, r0, r3, lsl #4
.Lfunc_003C8988_38:
	str	r2, [r3, #0x814]
.Lfunc_003C8988_3c:
	ldr	r2, [ip]
.Lfunc_003C8988_40:
	add	r2, r0, r2, lsl #4
.Lfunc_003C8988_44:
	str	r1, [r2, #0x818]
.Lfunc_003C8988_48:
	b	.Lfunc_003C8988_78
.Lfunc_003C8988_4c:
	ldr	r2, [r0, #0xa10]
.Lfunc_003C8988_50:
	mov	r1, #1
.Lfunc_003C8988_54:
	add	r2, r0, r2, lsl #4
.Lfunc_003C8988_58:
	str	r3, [r2, #0x81c]
.Lfunc_003C8988_5c:
	ldr	r2, [ip]
.Lfunc_003C8988_60:
	ldr	r3, [r3]
.Lfunc_003C8988_64:
	add	r2, r0, r2, lsl #4
.Lfunc_003C8988_68:
	str	r3, [r2, #0x814]
.Lfunc_003C8988_6c:
	ldr	r2, [ip]
.Lfunc_003C8988_70:
	add	r2, r0, r2, lsl #4
.Lfunc_003C8988_74:
	str	r1, [r2, #0x818]
.Lfunc_003C8988_78:
	ldr	r0, [r0, #0xa10]
.Lfunc_003C8988_7c:
	add	r0, r0, #1
.Lfunc_003C8988_80:
	asr	r1, r0, #0x1f
.Lfunc_003C8988_84:
	add	r1, r0, r1, lsr #27
.Lfunc_003C8988_88:
	bic	r1, r1, #0x1f
.Lfunc_003C8988_8c:
	sub	r0, r0, r1
.Lfunc_003C8988_90:
	str	r0, [ip]
.Lfunc_003C8988_94:
	pop	{r4}
.Lfunc_003C8988_98:
	bx	lr
.size func_003C8988, .-func_003C8988

.section .text.func_003A747C,"ax",%progbits
.balign 4
.global func_003A747C
.type func_003A747C, %function
func_003A747C:
.Lfunc_003A747C_0:
	push	{r4, r5}
.Lfunc_003A747C_4:
	ldrh	r2, [r0]
.Lfunc_003A747C_8:
	ldrh	r3, [r1]
.Lfunc_003A747C_c:
	cmp	r2, r3
.Lfunc_003A747C_10:
	moveq	ip, #1
.Lfunc_003A747C_14:
	bne	.Lfunc_003A747C_80
.Lfunc_003A747C_18:
	uxth	r2, r2
.Lfunc_003A747C_1c:
	cmp	r2, #0x10
.Lfunc_003A747C_20:
	bne	.Lfunc_003A747C_64
.Lfunc_003A747C_24:
	ldrh	r2, [r0, #2]
.Lfunc_003A747C_28:
	add	r2, r2, #2
.Lfunc_003A747C_2c:
	add	r2, r0, r2, lsl #1
.Lfunc_003A747C_30:
	sub	r3, r2, r0
.Lfunc_003A747C_34:
	mov	r2, #1
.Lfunc_003A747C_38:
	add	r4, ip, r3, asr #1
.Lfunc_003A747C_3c:
	cmp	r4, #1
.Lfunc_003A747C_40:
	addgt	r3, ip, r3, asr #1
.Lfunc_003A747C_44:
	ble	.Lfunc_003A747C_70
.Lfunc_003A747C_48:
	ldrh	r4, [r0, #2]!
.Lfunc_003A747C_4c:
	ldrh	r5, [r1, #2]!
.Lfunc_003A747C_50:
	cmp	r4, r5
.Lfunc_003A747C_54:
	bne	.Lfunc_003A747C_80
.Lfunc_003A747C_58:
	add	r2, r2, #1
.Lfunc_003A747C_5c:
	cmp	r3, r2
.Lfunc_003A747C_60:
	bgt	.Lfunc_003A747C_48
.Lfunc_003A747C_64:
	ldrh	r2, [r0]
.Lfunc_003A747C_68:
	cmp	r2, #0
.Lfunc_003A747C_6c:
	beq	.Lfunc_003A747C_8c
.Lfunc_003A747C_70:
	ldrh	r2, [r0, #2]!
.Lfunc_003A747C_74:
	ldrh	r3, [r1, #2]!
.Lfunc_003A747C_78:
	cmp	r2, r3
.Lfunc_003A747C_7c:
	beq	.Lfunc_003A747C_18
.Lfunc_003A747C_80:
	pop	{r4, r5}
.Lfunc_003A747C_84:
	mov	r0, #0
.Lfunc_003A747C_88:
	bx	lr
.Lfunc_003A747C_8c:
	pop	{r4, r5}
.Lfunc_003A747C_90:
	mov	r0, #1
.Lfunc_003A747C_94:
	bx	lr
.size func_003A747C, .-func_003A747C

.section .text.func_00201B1C,"ax",%progbits
.balign 4
.global func_00201B1C
.type func_00201B1C, %function
func_00201B1C:
.Lfunc_00201B1C_0:
	add	r0, r0, #0x18
.Lfunc_00201B1C_4:
	mov	r0, r0
.Lfunc_00201B1C_8:
	add	r2, r0, #0x24
.Lfunc_00201B1C_c:
	push	{r4, r5, r6}
.Lfunc_00201B1C_10:
	cmp	r1, #0
.Lfunc_00201B1C_14:
	ldr	r2, [r2]
.Lfunc_00201B1C_18:
	rsblt	r1, r1, #0
.Lfunc_00201B1C_1c:
	mov	r0, #0
.Lfunc_00201B1C_20:
	cmp	r2, #0
.Lfunc_00201B1C_24:
	mvn	ip, #0
.Lfunc_00201B1C_28:
	subne	r5, r1, #1
.Lfunc_00201B1C_2c:
	beq	.Lfunc_00201B1C_8c
.Lfunc_00201B1C_30:
	ldr	r4, [r2, #4]
.Lfunc_00201B1C_34:
	add	r3, r2, r1
.Lfunc_00201B1C_38:
	add	r6, r2, #0x10
.Lfunc_00201B1C_3c:
	add	r3, r3, #0xf
.Lfunc_00201B1C_40:
	bic	r3, r3, r5
.Lfunc_00201B1C_44:
	add	r6, r6, r4
.Lfunc_00201B1C_48:
	cmp	r6, r3
.Lfunc_00201B1C_4c:
	bls	.Lfunc_00201B1C_80
.Lfunc_00201B1C_50:
	add	r6, r4, r2
.Lfunc_00201B1C_54:
	sub	r4, r3, r2
.Lfunc_00201B1C_58:
	sub	r3, r6, r3
.Lfunc_00201B1C_5c:
	add	r3, r3, #0x10
.Lfunc_00201B1C_60:
	cmp	r0, r3
.Lfunc_00201B1C_64:
	sub	r4, r4, #0x10
.Lfunc_00201B1C_68:
	blo	.Lfunc_00201B1C_78
.Lfunc_00201B1C_6c:
	bne	.Lfunc_00201B1C_80
.Lfunc_00201B1C_70:
	cmp	ip, r4
.Lfunc_00201B1C_74:
	bls	.Lfunc_00201B1C_80
.Lfunc_00201B1C_78:
	mov	r0, r3
.Lfunc_00201B1C_7c:
	mov	ip, r4
.Lfunc_00201B1C_80:
	ldr	r2, [r2, #0xc]
.Lfunc_00201B1C_84:
	cmp	r2, #0
.Lfunc_00201B1C_88:
	bne	.Lfunc_00201B1C_30
.Lfunc_00201B1C_8c:
	pop	{r4, r5, r6}
.Lfunc_00201B1C_90:
	bx	lr
.size func_00201B1C, .-func_00201B1C

.section .text.func_0039C1D0,"ax",%progbits
.balign 4
.global func_0039C1D0
.type func_0039C1D0, %function
func_0039C1D0:
.Lfunc_0039C1D0_0:
	push	{r4, r5}
.Lfunc_0039C1D0_4:
	ldr	r0, [r0, #0x8c]
.Lfunc_0039C1D0_8:
	add	r0, r0, #4
.Lfunc_0039C1D0_c:
	ldm	r0, {r0, r4}
.Lfunc_0039C1D0_10:
	cmp	r0, r4
.Lfunc_0039C1D0_14:
	movne	r5, #0x40000006
.Lfunc_0039C1D0_18:
	beq	.Lfunc_0039C1D0_88
.Lfunc_0039C1D0_1c:
	ldr	r2, [r0]
.Lfunc_0039C1D0_20:
	ldr	ip, [r2, #0x180]
.Lfunc_0039C1D0_24:
	cmp	ip, #0
.Lfunc_0039C1D0_28:
	bne	.Lfunc_0039C1D0_6c
.Lfunc_0039C1D0_2c:
	ldr	r2, [r2, #8]
.Lfunc_0039C1D0_30:
	cmp	r2, #0
.Lfunc_0039C1D0_34:
	beq	.Lfunc_0039C1D0_48
.Lfunc_0039C1D0_38:
	ldr	r3, [r2]
.Lfunc_0039C1D0_3c:
	bics	r3, r5, r3
.Lfunc_0039C1D0_40:
	moveq	r3, r2
.Lfunc_0039C1D0_44:
	beq	.Lfunc_0039C1D0_4c
.Lfunc_0039C1D0_48:
	mov	r3, #0
.Lfunc_0039C1D0_4c:
	cmp	r3, #0
.Lfunc_0039C1D0_50:
	beq	.Lfunc_0039C1D0_6c
.Lfunc_0039C1D0_54:
	cmp	r2, #0
.Lfunc_0039C1D0_58:
	beq	.Lfunc_0039C1D0_68
.Lfunc_0039C1D0_5c:
	ldr	r3, [r2]
.Lfunc_0039C1D0_60:
	bics	r3, r5, r3
.Lfunc_0039C1D0_64:
	movne	r2, #0
.Lfunc_0039C1D0_68:
	add	ip, r2, #0xc0
.Lfunc_0039C1D0_6c:
	cmp	r1, #0
.Lfunc_0039C1D0_70:
	movne	r2, #1
.Lfunc_0039C1D0_74:
	moveq	r2, #0
.Lfunc_0039C1D0_78:
	add	r0, r0, #4
.Lfunc_0039C1D0_7c:
	cmp	r0, r4
.Lfunc_0039C1D0_80:
	strb	r2, [ip, #0x14]
.Lfunc_0039C1D0_84:
	bne	.Lfunc_0039C1D0_1c
.Lfunc_0039C1D0_88:
	pop	{r4, r5}
.Lfunc_0039C1D0_8c:
	bx	lr
.size func_0039C1D0, .-func_0039C1D0

.section .text.func_00328E4C,"ax",%progbits
.balign 4
.global func_00328E4C
.type func_00328E4C, %function
func_00328E4C:
.Lfunc_00328E4C_0:
	cmp	r1, #0
.Lfunc_00328E4C_4:
	push	{r4, r5}
.Lfunc_00328E4C_8:
	beq	.Lfunc_00328E4C_64
.Lfunc_00328E4C_c:
	ldr	r2, [r0, #0x2c]
.Lfunc_00328E4C_10:
	ldr	r3, [r0, #0x34]
.Lfunc_00328E4C_14:
	lsl	r4, r2, #0x1c
.Lfunc_00328E4C_18:
	lsl	ip, r2, #0x1e
.Lfunc_00328E4C_1c:
	lsr	r2, r4, #0x1e
.Lfunc_00328E4C_20:
	lsr	ip, ip, #0x19
.Lfunc_00328E4C_24:
	add	r2, r2, r2, lsl #2
.Lfunc_00328E4C_28:
	add	r2, ip, r2, lsl #2
.Lfunc_00328E4C_2c:
	add	ip, r3, r2
.Lfunc_00328E4C_30:
	ldr	r2, [r0, #0x30]
.Lfunc_00328E4C_34:
	lsl	r2, r2, #0x1a
.Lfunc_00328E4C_38:
	lsr	r2, r2, #0x1e
.Lfunc_00328E4C_3c:
	cmp	r1, r2
.Lfunc_00328E4C_40:
	bls	.Lfunc_00328E4C_64
.Lfunc_00328E4C_44:
	adds	r3, ip, r2, lsl #2
.Lfunc_00328E4C_48:
	beq	.Lfunc_00328E4C_58
.Lfunc_00328E4C_4c:
	mov	r5, #0
.Lfunc_00328E4C_50:
	strb	r5, [r3]
.Lfunc_00328E4C_54:
	strb	r5, [r3, #1]
.Lfunc_00328E4C_58:
	add	r2, r2, #1
.Lfunc_00328E4C_5c:
	cmp	r2, r1
.Lfunc_00328E4C_60:
	blo	.Lfunc_00328E4C_44
.Lfunc_00328E4C_64:
	ldr	r2, [r0, #0x30]
.Lfunc_00328E4C_68:
	mov	r3, #0x30
.Lfunc_00328E4C_6c:
	and	r1, r3, r1, lsl #4
.Lfunc_00328E4C_70:
	bic	r2, r2, #0x30
.Lfunc_00328E4C_74:
	orr	r1, r1, r2
.Lfunc_00328E4C_78:
	str	r1, [r0, #0x30]
.Lfunc_00328E4C_7c:
	ldrb	r1, [r0, #0x4d]
.Lfunc_00328E4C_80:
	and	r1, r1, #0xfb
.Lfunc_00328E4C_84:
	strb	r1, [r0, #0x4d]
.Lfunc_00328E4C_88:
	pop	{r4, r5}
.Lfunc_00328E4C_8c:
	bx	lr
.size func_00328E4C, .-func_00328E4C
```

## Clean-room handoff constraints

- Implement only these fifteen named functions in
  `src/main/arm_runtime_helpers_66.S`.
- Copy the exact schedules above without adding literal pools or adjacent data.
- Preserve ARM state, ARMv6K/VFPv2 selection, dedicated executable sections,
  symbol types, and exact `.size` boundaries.
- The final object must contain no relocations in any selected function body.
- Do not use this zero-relocation manifest as positional input to the target
  object generator.
