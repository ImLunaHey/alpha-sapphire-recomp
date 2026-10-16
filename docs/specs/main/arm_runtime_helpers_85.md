# Probe-verified ARM runtime/helper batch 85

Source SHA-256: `b57ec6839183d05f1509b2d53ed91c47b90c479b6f0834343872eca0ab1656f1`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
ARM-state, call-free helpers totaling 576 executable body bytes (144
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.44 was used in ARMv6K/VFPv2 mode on 2026-10-16.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 576 target bytes with a
zero-byte exact diff. The exact implementation artifact below has the recorded
source SHA-256.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_001960C8` | `.text.func_001960C8` | 24 | 6 | 0 | 4 | 1 | `func_00196218` |
| `func_0019B628` | `.text.func_0019B628` | 24 | 6 | 0 | 5 | 1 | `func_0019B65C` |
| `func_001C2524` | `.text.func_001C2524` | 24 | 6 | 0 | 4 | 1 | `func_001C253C` |
| `func_001E86B4` | `.text.func_001E86B4` | 24 | 6 | 0 | 1 | 1 | `func_001E8900` |
| `func_001F46DC` | `.text.func_001F46DC` | 24 | 6 | 0 | 4 | 1 | `func_001F46F4` |
| `func_002C2360` | `.text.func_002C2360` | 24 | 6 | 0 | 1 | 1 | `func_002C2378` |
| `func_002C6820` | `.text.func_002C6820` | 24 | 6 | 0 | 1 | 1 | `func_002C6840` |
| `func_002C9504` | `.text.func_002C9504` | 24 | 6 | 0 | 1 | 1 | `func_002C951C` |
| `func_00320988` | `.text.func_00320988` | 24 | 6 | 0 | 3 | 1 | `func_003209A0` |
| `func_0032AD88` | `.text.func_0032AD88` | 24 | 6 | 0 | 3 | 1 | `func_0032ADB0` |
| `func_0032E364` | `.text.func_0032E364` | 24 | 6 | 0 | 1 | 1 | `func_0032E37C` |
| `func_00331258` | `.text.func_00331258` | 24 | 6 | 0 | 2 | 1 | `func_00331270` |
| `func_003361D4` | `.text.func_003361D4` | 24 | 6 | 0 | 4 | 1 | `func_003361EC` |
| `func_003700F0` | `.text.func_003700F0` | 24 | 6 | 0 | 2 | 1 | `func_00370284` |
| `func_00370284` | `.text.func_00370284` | 24 | 6 | 0 | 2 | 1 | `func_003705F4` |
| `func_00371BB8` | `.text.func_00371BB8` | 24 | 6 | 0 | 3 | 1 | `func_00371C04` |
| `func_00371CAC` | `.text.func_00371CAC` | 24 | 6 | 0 | 3 | 1 | `func_00371CF4` |
| `func_003964E8` | `.text.func_003964E8` | 24 | 6 | 0 | 4 | 1 | `func_00396510` |
| `func_00398724` | `.text.func_00398724` | 24 | 6 | 0 | 2 | 1 | `func_0039873C` |
| `func_003A1ECC` | `.text.func_003A1ECC` | 24 | 6 | 0 | 3 | 1 | `func_003A1EE4` |
| `func_003A1EE4` | `.text.func_003A1EE4` | 24 | 6 | 0 | 3 | 1 | `func_003A1EFC` |
| `func_003B7E80` | `.text.func_003B7E80` | 24 | 6 | 0 | 2 | 1 | `func_003B7E98` |
| `func_003F8F40` | `.text.func_003F8F40` | 24 | 6 | 0 | 1 | 1 | `func_003F9178` |
| `func_0040B0DC` | `.text.func_0040B0DC` | 24 | 6 | 0 | 2 | 1 | `func_0040B0F4` |

Memory-operation counts include scalar and VFP loads/stores and multiple
transfers. Returns are excluded from the local-branch count. Totals are 144
instructions, zero local branches, 24 `bx lr` returns, and 61 memory
operations. There are no unconditional or conditional direct branches.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`93e2c0c506c285cd93272516e2336f89f404a7811f115e387a6f5abd61cf4f6a`.
The canonical direct-branch schedule is empty and has SHA-256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The canonical return-transfer schedule SHA-256 is
`c5d1aff086dab89d37c482a3b01a35ed26fd98559f9fcfe176d906567a1d8878`.
Canonical entries are `name:offset:mnemonic:operands` for the full and return
schedules and `name:offset:mnemonic:target` for direct branches, joined with
newlines and no terminal newline. Offsets are lowercase hexadecimal without an
`0x` prefix. All three hashes were reproduced from the bounded target sections
and the independent probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule. GNU objdump renders the
traditional ARM no-op in `func_00331258` as `nop @ (mov r0, r0)` for the
canonical schedule; the implementation must use `mov r0, r0`, because the
architectural `nop` mnemonic assembles to a different instruction.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 16,337 string
leaves (5,840 distinct strings) in the 216 pre-existing top-level JSON configs.
The audit resolved 6,463 string occurrences (3,095 distinct symbols) through
the neutral inventory and expanded each to its complete symbol interval; none
overlaps a selected interval. The audit includes owners, aliases, branch
destinations, direct-transfer symbols, identity members, next-global
annotations, and secondary-entry identities. The neutral inventory has no
alternate symbol at a selected start and no nested global entry in a selected
interval. Selected intervals are pairwise disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member; the selected bodies are therefore also
pairwise byte-distinct. Section-scoped relocation audits of both target and
probe found zero relocations. The authoritative report accounts for all 576
selected bytes as unmatched.

## Exact schedules

The following is the complete independently assembled artifact. Preserve every
mnemonic, operand, condition, memory mode, instruction order, section name,
mode, alignment, and boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001960C8,"ax",%progbits
.balign 4
.global func_001960C8
.type func_001960C8, %function
func_001960C8:
	vldmia	r1, {s0-s11}
	mov	r2, r0
	vstmia	r2!, {s0-s2}
	vstmia	r2!, {s4-s6}
	vstmia	r2, {s8-s10}
	bx	lr
.size func_001960C8, .-func_001960C8

.section .text.func_0019B628,"ax",%progbits
.balign 4
.global func_0019B628
.type func_0019B628, %function
func_0019B628:
	vldmia	r1!, {s0-s3}
	vstr	s0, [r0, #12]
	vstr	s1, [r0, #8]
	vstr	s2, [r0, #4]
	vstr	s3, [r0]
	bx	lr
.size func_0019B628, .-func_0019B628

.section .text.func_001C2524,"ax",%progbits
.balign 4
.global func_001C2524
.type func_001C2524, %function
func_001C2524:
	ldrb	r3, [r0, #38]
	str	r1, [r0, #4]
	str	r2, [r0]
	orr	r1, r3, #8
	strb	r1, [r0, #38]
	bx	lr
.size func_001C2524, .-func_001C2524

.section .text.func_001E86B4,"ax",%progbits
.balign 4
.global func_001E86B4
.type func_001E86B4, %function
func_001E86B4:
	ldrb	r0, [r0, #409]
	cmp	r0, #1
	cmpne	r0, #2
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_001E86B4, .-func_001E86B4

.section .text.func_001F46DC,"ax",%progbits
.balign 4
.global func_001F46DC
.type func_001F46DC, %function
func_001F46DC:
	mov	ip, #0
	strh	ip, [r0, #2]
	strb	r1, [r0]
	strb	ip, [r0, #1]
	strd	r2, [r0, #4]
	bx	lr
.size func_001F46DC, .-func_001F46DC

.section .text.func_002C2360,"ax",%progbits
.balign 4
.global func_002C2360
.type func_002C2360, %function
func_002C2360:
	ldr	r0, [r0]
	and	r0, r0, #261120
	cmp	r0, #83968
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_002C2360, .-func_002C2360

.section .text.func_002C6820,"ax",%progbits
.balign 4
.global func_002C6820
.type func_002C6820, %function
func_002C6820:
	ldrh	r2, [r0, #4]
	cmp	r2, r1
	addhi	r0, r0, r1, lsl #3
	addhi	r0, r0, #12
	movls	r0, #0
	bx	lr
.size func_002C6820, .-func_002C6820

.section .text.func_002C9504,"ax",%progbits
.balign 4
.global func_002C9504
.type func_002C9504, %function
func_002C9504:
	movs	r1, r0
	mov	r0, #1
	ldrbne	r1, [r1]
	cmpne	r1, #0
	moveq	r0, #0
	bx	lr
.size func_002C9504, .-func_002C9504

.section .text.func_00320988,"ax",%progbits
.balign 4
.global func_00320988
.type func_00320988, %function
func_00320988:
	mov	r2, #6
	mov	r1, #0
	strb	r2, [r0, #731]
	strb	r1, [r0, #733]
	strb	r1, [r0, #732]
	bx	lr
.size func_00320988, .-func_00320988

.section .text.func_0032AD88,"ax",%progbits
.balign 4
.global func_0032AD88
.type func_0032AD88, %function
func_0032AD88:
	mov	r1, #0
	mov	r2, #47
	str	r1, [r0, #4]
	strb	r2, [r0, #12]
	strb	r1, [r0, #13]
	bx	lr
.size func_0032AD88, .-func_0032AD88

.section .text.func_0032E364,"ax",%progbits
.balign 4
.global func_0032E364
.type func_0032E364, %function
func_0032E364:
	cmp	r1, #0
	addne	r0, r0, #48
	moveq	r0, #0
	stmne	r0, {r1, r2}
	movne	r0, #1
	bx	lr
.size func_0032E364, .-func_0032E364

.section .text.func_00331258,"ax",%progbits
.balign 4
.global func_00331258
.type func_00331258, %function
func_00331258:
	add	r0, r0, #4
	mov	r0, r0
	mov	r1, #0
	str	r1, [r0]
	str	r1, [r0, #4]
	bx	lr
.size func_00331258, .-func_00331258

.section .text.func_003361D4,"ax",%progbits
.balign 4
.global func_003361D4
.type func_003361D4, %function
func_003361D4:
	vstr	s0, [r0, #352]
	mov	r3, #0
	str	r1, [r0, #360]
	str	r3, [r0, #356]
	strb	r2, [r0, #307]
	bx	lr
.size func_003361D4, .-func_003361D4

.section .text.func_003700F0,"ax",%progbits
.balign 4
.global func_003700F0
.type func_003700F0, %function
func_003700F0:
	add	r0, r0, r1, lsl #2
	mov	r3, #1
	ldr	r1, [r0, #72]
	orr	r1, r1, r3, lsl r2
	str	r1, [r0, #72]
	bx	lr
.size func_003700F0, .-func_003700F0

.section .text.func_00370284,"ax",%progbits
.balign 4
.global func_00370284
.type func_00370284, %function
func_00370284:
	add	r0, r0, r1, lsl #2
	mov	r3, #1
	ldr	r1, [r0, #72]
	bic	r1, r1, r3, lsl r2
	str	r1, [r0, #72]
	bx	lr
.size func_00370284, .-func_00370284

.section .text.func_00371BB8,"ax",%progbits
.balign 4
.global func_00371BB8
.type func_00371BB8, %function
func_00371BB8:
	ldr	r0, [r0, #4]
	mov	r3, #0
	add	ip, r0, #160
	stm	ip, {r1, r2}
	strb	r3, [r0, #6]
	bx	lr
.size func_00371BB8, .-func_00371BB8

.section .text.func_00371CAC,"ax",%progbits
.balign 4
.global func_00371CAC
.type func_00371CAC, %function
func_00371CAC:
	ldr	r0, [r0, #4]
	ldrb	r2, [r0, #156]
	bic	r2, r2, #4
	orr	r1, r2, r1, lsl #2
	strb	r1, [r0, #156]
	bx	lr
.size func_00371CAC, .-func_00371CAC

.section .text.func_003964E8,"ax",%progbits
.balign 4
.global func_003964E8
.type func_003964E8, %function
func_003964E8:
	ldrd	r2, [r1]
	ldr	r1, [r1, #8]
	str	r1, [r0, #312]
	add	r0, r0, #304
	stm	r0, {r2, r3}
	bx	lr
.size func_003964E8, .-func_003964E8

.section .text.func_00398724,"ax",%progbits
.balign 4
.global func_00398724
.type func_00398724, %function
func_00398724:
	add	r1, r1, r1, lsl #4
	ldr	r0, [r0, #48]
	add	r1, r1, r1, lsl #2
	add	r0, r0, r1, lsl #2
	strh	r2, [r0, #32]
	bx	lr
.size func_00398724, .-func_00398724

.section .text.func_003A1ECC,"ax",%progbits
.balign 4
.global func_003A1ECC
.type func_003A1ECC, %function
func_003A1ECC:
	cmp	r1, #0
	ldreq	r0, [r0, #56]
	ldrne	r0, [r0, #60]
	add	r0, r0, r2, lsl #2
	ldr	r0, [r0, #76]
	bx	lr
.size func_003A1ECC, .-func_003A1ECC

.section .text.func_003A1EE4,"ax",%progbits
.balign 4
.global func_003A1EE4
.type func_003A1EE4, %function
func_003A1EE4:
	cmp	r1, #0
	ldreq	r0, [r0, #56]
	ldrne	r0, [r0, #60]
	add	r0, r0, r2, lsl #2
	ldr	r0, [r0, #84]
	bx	lr
.size func_003A1EE4, .-func_003A1EE4

.section .text.func_003B7E80,"ax",%progbits
.balign 4
.global func_003B7E80
.type func_003B7E80, %function
func_003B7E80:
	ldr	r1, [r0, #-4]
	tst	r1, #1
	subne	r0, r1, #1
	subeq	r0, r0, #16
	ldr	r0, [r0, #8]
	bx	lr
.size func_003B7E80, .-func_003B7E80

.section .text.func_003F8F40,"ax",%progbits
.balign 4
.global func_003F8F40
.type func_003F8F40, %function
func_003F8F40:
	add	r0, r0, #2304
	ldrh	r0, [r0, #246]
	cmp	r0, #3
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_003F8F40, .-func_003F8F40

.section .text.func_0040B0DC,"ax",%progbits
.balign 4
.global func_0040B0DC
.type func_0040B0DC, %function
func_0040B0DC:
	ldr	r2, [r0, #48]
	bic	r2, r2, #267386880
	bic	r2, r2, #1044480
	orr	r1, r2, r1, lsl #12
	str	r1, [r0, #48]
	bx	lr
.size func_0040B0DC, .-func_0040B0DC

```

## Implementation contract

- Create exactly `src/main/arm_runtime_helpers_85.S` from the fenced artifact,
  including the final newline; its SHA-256 must equal the config value.
- Keep one allocatable executable `%progbits` section per function, aligned to
  four bytes, with a global `%function` symbol at offset zero and exact `.size`.
- Assemble in ARMv6K ARM state with VFPv2 enabled. Do not substitute Thumb
  state, literal pools, macros, aliases that change encoding, compiler output,
  raw instruction words, or generated target material.
- Preserve all condition codes, VFP register ranges, writeback markers,
  immediate values, scalar widths, multiple-transfer register lists, and the
  `mov r0, r0` legacy no-op spelling.
- The object must contain exactly 24 owned executable sections totaling 576
  bytes, 144 instructions, 61 memory operations, zero calls, zero local or
  external branches, 24 returns, zero relocations, zero PC-relative data
  accesses, and zero adjacent bytes.
- Validate the isolated object and a composite object against the full, branch,
  and return schedule hashes. A hostile extra executable section or defined
  global must be rejected.
