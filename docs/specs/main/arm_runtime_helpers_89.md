# Probe-verified ARM runtime/helper batch 89

Source SHA-256: `9c432537a6c4deb2b5f22112b99264be6aa83f0d44c58c4099433f4a11c3bacd`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
ARM-state, call-free helpers totaling 384 executable body bytes (96
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.45.1 was used in ARMv6K/VFPv2 mode on 2026-10-16.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 384 target bytes with a
zero-byte exact diff.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00170C70` | `.text.func_00170C70` | 16 | 4 | 0 | 1 | 1 | `func_00170C80` |
| `func_001783A8` | `.text.func_001783A8` | 16 | 4 | 0 | 2 | 1 | `func_001783B8` |
| `func_0017850C` | `.text.func_0017850C` | 16 | 4 | 0 | 2 | 1 | `func_0017851C` |
| `func_00179CF4` | `.text.func_00179CF4` | 16 | 4 | 0 | 2 | 1 | `func_00179D04` |
| `func_001808D0` | `.text.func_001808D0` | 16 | 4 | 0 | 1 | 1 | `func_00180968` |
| `func_001E51C8` | `.text.func_001E51C8` | 16 | 4 | 0 | 1 | 1 | `func_001E5234` |
| `func_001FBC00` | `.text.func_001FBC00` | 16 | 4 | 0 | 2 | 1 | `func_001FBC10` |
| `func_00205BFC` | `.text.func_00205BFC` | 16 | 4 | 0 | 2 | 1 | `func_00205C3C` |
| `func_00228F30` | `.text.func_00228F30` | 16 | 4 | 0 | 2 | 1 | `func_00228F90` |
| `func_00235514` | `.text.func_00235514` | 16 | 4 | 0 | 2 | 1 | `func_00235524` |
| `func_002538D0` | `.text.func_002538D0` | 16 | 4 | 0 | 3 | 1 | `func_002538E0` |
| `func_002AD614` | `.text.func_002AD614` | 16 | 4 | 0 | 2 | 1 | `func_002AD63C` |
| `func_002C0C58` | `.text.func_002C0C58` | 16 | 4 | 0 | 1 | 1 | `func_002C0C68` |
| `func_002C6D64` | `.text.func_002C6D64` | 16 | 4 | 0 | 2 | 1 | `func_002C6D7C` |
| `func_00321B48` | `.text.func_00321B48` | 16 | 4 | 0 | 2 | 1 | `func_00321B58` |
| `func_0032ECB0` | `.text.func_0032ECB0` | 16 | 4 | 0 | 1 | 1 | `func_0032EDC8` |
| `func_0033953C` | `.text.func_0033953C` | 16 | 4 | 0 | 2 | 1 | `func_0033965C` |
| `func_00389348` | `.text.func_00389348` | 16 | 4 | 0 | 2 | 1 | `func_00389448` |
| `func_0038A8D0` | `.text.func_0038A8D0` | 16 | 4 | 0 | 2 | 1 | `func_0038AECC` |
| `func_003962E4` | `.text.func_003962E4` | 16 | 4 | 0 | 1 | 1 | `func_00396454` |
| `func_003E8280` | `.text.func_003E8280` | 16 | 4 | 0 | 2 | 1 | `func_003E8290` |
| `func_003F4910` | `.text.func_003F4910` | 16 | 4 | 0 | 2 | 1 | `func_003F4920` |
| `func_0040AA8C` | `.text.func_0040AA8C` | 16 | 4 | 0 | 0 | 1 | `func_0040AA9C` |
| `func_0040CC88` | `.text.func_0040CC88` | 16 | 4 | 0 | 0 | 1 | `func_0040D6F8` |

Memory-operation counts include scalar, multiple, VFP, and stack transfers.
Returns are excluded from the local-branch count. Totals are 96 instructions,
0 local branches, 24 return sites, and 39 memory operations. There are no
direct branch sites, external transfers, calls, or PC-relative data accesses.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`70f3d5a608ef3b1b7a998e06f6d03dcbc005ecfb2804ab4f66970155a64a5b9c`.
The canonical direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The canonical return-transfer schedule SHA-256 is
`29a60bc5b819072c96069a4764e20468f2e37a5927b43d83c233505afebce6d4`.
Canonical entries are `name:offset:mnemonic:operands` for instructions and
returns, and `name:offset:mnemonic:target` for direct branches, joined with
newlines and no terminal newline. Offsets are lowercase hexadecimal without an
`0x` prefix. All three hashes were reproduced independently from the bounded
target sections and the exact-schedule probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 18,072 string
leaves (6,562 distinct strings) in the 228 pre-existing top-level JSON configs.
The audit resolved 7,011 string occurrences (3,323 distinct symbols) through
the neutral inventory and expanded each to its complete symbol interval; none
overlaps a selected interval. The audit includes owners, aliases, branch
destinations, direct-transfer symbols, identity members, next-global
annotations, and secondary-entry identities. The neutral inventory has no
alternate symbol at a selected start and no nested global entry in a selected
interval. Selected intervals are pairwise disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member; the selected bodies are therefore also
pairwise byte-distinct. Section-scoped relocation audits of both target and
probe found zero relocations. The authoritative report accounts for all 384
selected bytes as unmatched.

## Exact schedules

The following is the complete independently assembled artifact. Preserve every
mnemonic, operand, condition, memory mode, instruction order, section name,
mode, alignment, local label, and boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00170C70,"ax",%progbits
.balign 4
.global func_00170C70
.type func_00170C70, %function
func_00170C70:
.Lfunc_00170C70_0:
	mov	r0, r1
.Lfunc_00170C70_4:
	mov	r0, r0
.Lfunc_00170C70_8:
	ldr	r0, [r0, #-12]
.Lfunc_00170C70_c:
	bx	lr
.size func_00170C70, .-func_00170C70

.section .text.func_001783A8,"ax",%progbits
.balign 4
.global func_001783A8
.type func_001783A8, %function
func_001783A8:
.Lfunc_001783A8_0:
	add	r2, r0, #36
.Lfunc_001783A8_4:
	ldrh	r0, [r0, #52]
.Lfunc_001783A8_8:
	strh	r1, [r2, #16]
.Lfunc_001783A8_c:
	bx	lr
.size func_001783A8, .-func_001783A8

.section .text.func_0017850C,"ax",%progbits
.balign 4
.global func_0017850C
.type func_0017850C, %function
func_0017850C:
.Lfunc_0017850C_0:
	add	r2, r0, #36
.Lfunc_0017850C_4:
	ldrsb	r0, [r0, #56]
.Lfunc_0017850C_8:
	strb	r1, [r2, #20]
.Lfunc_0017850C_c:
	bx	lr
.size func_0017850C, .-func_0017850C

.section .text.func_00179CF4,"ax",%progbits
.balign 4
.global func_00179CF4
.type func_00179CF4, %function
func_00179CF4:
.Lfunc_00179CF4_0:
	ldr	r2, [r0, #44]
.Lfunc_00179CF4_4:
	orr	r1, r1, r2
.Lfunc_00179CF4_8:
	str	r1, [r0, #44]
.Lfunc_00179CF4_c:
	bx	lr
.size func_00179CF4, .-func_00179CF4

.section .text.func_001808D0,"ax",%progbits
.balign 4
.global func_001808D0
.type func_001808D0, %function
func_001808D0:
.Lfunc_001808D0_0:
	add	r0, r0, r1, lsl #1
.Lfunc_001808D0_4:
	add	r0, r0, #256
.Lfunc_001808D0_8:
	strh	r2, [r0, #12]
.Lfunc_001808D0_c:
	bx	lr
.size func_001808D0, .-func_001808D0

.section .text.func_001E51C8,"ax",%progbits
.balign 4
.global func_001E51C8
.type func_001E51C8, %function
func_001E51C8:
.Lfunc_001E51C8_0:
	ldr	r0, [r0, #2792]
.Lfunc_001E51C8_4:
	cmp	r0, #0
.Lfunc_001E51C8_8:
	movlt	r0, #0
.Lfunc_001E51C8_c:
	bx	lr
.size func_001E51C8, .-func_001E51C8

.section .text.func_001FBC00,"ax",%progbits
.balign 4
.global func_001FBC00
.type func_001FBC00, %function
func_001FBC00:
.Lfunc_001FBC00_0:
	mrc	15, 0, r2, c13, c0, 3
.Lfunc_001FBC00_4:
	ldr	r0, [r0]
.Lfunc_001FBC00_8:
	str	r1, [r2, r0, lsl #2]
.Lfunc_001FBC00_c:
	bx	lr
.size func_001FBC00, .-func_001FBC00

.section .text.func_00205BFC,"ax",%progbits
.balign 4
.global func_00205BFC
.type func_00205BFC, %function
func_00205BFC:
.Lfunc_00205BFC_0:
	ldr	r2, [r0, #12]
.Lfunc_00205BFC_4:
	bic	r1, r2, r1
.Lfunc_00205BFC_8:
	str	r1, [r0, #12]
.Lfunc_00205BFC_c:
	bx	lr
.size func_00205BFC, .-func_00205BFC

.section .text.func_00228F30,"ax",%progbits
.balign 4
.global func_00228F30
.type func_00228F30, %function
func_00228F30:
.Lfunc_00228F30_0:
	ldr	r0, [r0, #16]
.Lfunc_00228F30_4:
	cmp	r0, #0
.Lfunc_00228F30_8:
	strne	r1, [r0, #60]
.Lfunc_00228F30_c:
	bx	lr
.size func_00228F30, .-func_00228F30

.section .text.func_00235514,"ax",%progbits
.balign 4
.global func_00235514
.type func_00235514, %function
func_00235514:
.Lfunc_00235514_0:
	ldrb	r2, [r0, #159]
.Lfunc_00235514_4:
	cmp	r2, #0
.Lfunc_00235514_8:
	strbne	r1, [r0, #168]
.Lfunc_00235514_c:
	bx	lr
.size func_00235514, .-func_00235514

.section .text.func_002538D0,"ax",%progbits
.balign 4
.global func_002538D0
.type func_002538D0, %function
func_002538D0:
.Lfunc_002538D0_0:
	str	r1, [r0, #72]
.Lfunc_002538D0_4:
	ldr	r1, [r2]
.Lfunc_002538D0_8:
	str	r1, [r0, #76]
.Lfunc_002538D0_c:
	bx	lr
.size func_002538D0, .-func_002538D0

.section .text.func_002AD614,"ax",%progbits
.balign 4
.global func_002AD614
.type func_002AD614, %function
func_002AD614:
.Lfunc_002AD614_0:
	mov	r1, #1
.Lfunc_002AD614_4:
	strb	r1, [r0, #528]
.Lfunc_002AD614_8:
	strb	r1, [r0, #531]
.Lfunc_002AD614_c:
	bx	lr
.size func_002AD614, .-func_002AD614

.section .text.func_002C0C58,"ax",%progbits
.balign 4
.global func_002C0C58
.type func_002C0C58, %function
func_002C0C58:
.Lfunc_002C0C58_0:
	add	r0, r0, #4096
.Lfunc_002C0C58_4:
	add	r0, r0, #340
.Lfunc_002C0C58_8:
	stm	r0, {r1, r2}
.Lfunc_002C0C58_c:
	bx	lr
.size func_002C0C58, .-func_002C0C58

.section .text.func_002C6D64,"ax",%progbits
.balign 4
.global func_002C6D64
.type func_002C6D64, %function
func_002C6D64:
.Lfunc_002C6D64_0:
	mov	r1, #0
.Lfunc_002C6D64_4:
	strh	r1, [r0, #6]
.Lfunc_002C6D64_8:
	str	r1, [r0, #8]
.Lfunc_002C6D64_c:
	bx	lr
.size func_002C6D64, .-func_002C6D64

.section .text.func_00321B48,"ax",%progbits
.balign 4
.global func_00321B48
.type func_00321B48, %function
func_00321B48:
.Lfunc_00321B48_0:
	ldrd	r0, [r0]
.Lfunc_00321B48_4:
	ldr	r0, [r0]
.Lfunc_00321B48_8:
	add	r0, r0, r1
.Lfunc_00321B48_c:
	bx	lr
.size func_00321B48, .-func_00321B48

.section .text.func_0032ECB0,"ax",%progbits
.balign 4
.global func_0032ECB0
.type func_0032ECB0, %function
func_0032ECB0:
.Lfunc_0032ECB0_0:
	ldr	r0, [r0, #12]
.Lfunc_0032ECB0_4:
	cmp	r0, #0
.Lfunc_0032ECB0_8:
	movne	r0, #1
.Lfunc_0032ECB0_c:
	bx	lr
.size func_0032ECB0, .-func_0032ECB0

.section .text.func_0033953C,"ax",%progbits
.balign 4
.global func_0033953C
.type func_0033953C, %function
func_0033953C:
.Lfunc_0033953C_0:
	mov	r1, #0
.Lfunc_0033953C_4:
	str	r1, [r0, #1656]
.Lfunc_0033953C_8:
	str	r1, [r0, #1660]
.Lfunc_0033953C_c:
	bx	lr
.size func_0033953C, .-func_0033953C

.section .text.func_00389348,"ax",%progbits
.balign 4
.global func_00389348
.type func_00389348, %function
func_00389348:
.Lfunc_00389348_0:
	ldr	r0, [r0, #80]
.Lfunc_00389348_4:
	cmp	r0, #0
.Lfunc_00389348_8:
	strbne	r1, [r0, #36]
.Lfunc_00389348_c:
	bx	lr
.size func_00389348, .-func_00389348

.section .text.func_0038A8D0,"ax",%progbits
.balign 4
.global func_0038A8D0
.type func_0038A8D0, %function
func_0038A8D0:
.Lfunc_0038A8D0_0:
	ldr	r0, [r0, #80]
.Lfunc_0038A8D0_4:
	cmp	r0, #0
.Lfunc_0038A8D0_8:
	vstrne	s0, [r0, #32]
.Lfunc_0038A8D0_c:
	bx	lr
.size func_0038A8D0, .-func_0038A8D0

.section .text.func_003962E4,"ax",%progbits
.balign 4
.global func_003962E4
.type func_003962E4, %function
func_003962E4:
.Lfunc_003962E4_0:
	mov	r1, #1
.Lfunc_003962E4_4:
	mov	r2, #4
.Lfunc_003962E4_8:
	stm	r0, {r1, r2}
.Lfunc_003962E4_c:
	bx	lr
.size func_003962E4, .-func_003962E4

.section .text.func_003E8280,"ax",%progbits
.balign 4
.global func_003E8280
.type func_003E8280, %function
func_003E8280:
.Lfunc_003E8280_0:
	ldr	r0, [r0, #380]
.Lfunc_003E8280_4:
	mov	r1, #1
.Lfunc_003E8280_8:
	strb	r1, [r0, #1]
.Lfunc_003E8280_c:
	bx	lr
.size func_003E8280, .-func_003E8280

.section .text.func_003F4910,"ax",%progbits
.balign 4
.global func_003F4910
.type func_003F4910, %function
func_003F4910:
.Lfunc_003F4910_0:
	ldr	r2, [r0, #8]
.Lfunc_003F4910_4:
	orr	r1, r1, r2
.Lfunc_003F4910_8:
	str	r1, [r0, #8]
.Lfunc_003F4910_c:
	bx	lr
.size func_003F4910, .-func_003F4910

.section .text.func_0040AA8C,"ax",%progbits
.balign 4
.global func_0040AA8C
.type func_0040AA8C, %function
func_0040AA8C:
.Lfunc_0040AA8C_0:
	add	r0, r1, r0, lsl #4
.Lfunc_0040AA8C_4:
	add	r0, r0, #55
.Lfunc_0040AA8C_8:
	bic	r0, r0, #31
.Lfunc_0040AA8C_c:
	bx	lr
.size func_0040AA8C, .-func_0040AA8C

.section .text.func_0040CC88,"ax",%progbits
.balign 4
.global func_0040CC88
.type func_0040CC88, %function
func_0040CC88:
.Lfunc_0040CC88_0:
	add	r1, r1, r1, lsl #3
.Lfunc_0040CC88_4:
	add	r0, r0, r1, lsl #1
.Lfunc_0040CC88_8:
	add	r0, r0, #8
.Lfunc_0040CC88_c:
	bx	lr
.size func_0040CC88, .-func_0040CC88
```

## Implementation contract

- Build exactly the assembly artifact above as
  `src/main/arm_runtime_helpers_89.S`; its UTF-8 bytes, including the terminal
  newline, hash to the source SHA-256 at the top of this document.
- Keep every helper in its named allocatable executable PROGBITS section with
  four-byte alignment, one global ARM function symbol at value zero, and the
  exact 16-byte symbol size.
- Do not add calls, relocations, literals, adjacent words, aliases, secondary
  entries, or generated-target mappings. This is a zero-relocation runtime
  batch and must not be added to `scripts/generate-target-object.mjs`.
- A validator should enforce 24 functions, 384 body bytes, 96 instructions,
  zero local branches, 24 returns, 39 memory operations, the three schedule
  hashes above, zero owned-section relocations, and exact owned symbol/section
  identities. Candidate-object checks must remain bounded while accepting
  unrelated foreign sections in composite objects.
