# Probe-verified ARM runtime/helper batch 90

Source SHA-256: `9b6623101c06a4f77d67cec0758f0d565c0ec4b0f56e919416ceb05e63584a02`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
ARM-state, call-free helpers totaling 384 executable body bytes (96
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.45.1 was used in ARMv6K/VFPv2 mode on 2026-10-16.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no direct
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 384 target bytes with a
zero-byte exact diff.

The bounded scan found one additional structurally eligible 16-byte helper,
`func_003AB314`, whose complete body duplicates an already matched target
function. It is deliberately excluded so every batch member has target-body
multiplicity one and the cohort remains exactly 24 independently unique
helpers.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_001E5234` | `.text.func_001E5234` | 16 | 4 | 0 | 2 | 1 | `func_001E5244` |
| `func_00410B00` | `.text.func_00410B00` | 16 | 4 | 0 | 3 | 1 | `func_00410B10` |
| `func_00410B10` | `.text.func_00410B10` | 16 | 4 | 0 | 2 | 1 | `func_00410B20` |
| `func_00410B20` | `.text.func_00410B20` | 16 | 4 | 0 | 1 | 1 | `func_00410B30` |
| `func_00410C48` | `.text.func_00410C48` | 16 | 4 | 0 | 1 | 1 | `func_00410C58` |
| `func_00417664` | `.text.func_00417664` | 16 | 4 | 0 | 0 | 1 | `func_00417674` |
| `func_0041B354` | `.text.func_0041B354` | 16 | 4 | 0 | 2 | 1 | `func_0041B364` |
| `func_0043436C` | `.text.func_0043436C` | 16 | 4 | 0 | 1 | 1 | `func_0043437C` |
| `func_0043ED68` | `.text.func_0043ED68` | 16 | 4 | 0 | 2 | 1 | `func_0043ED78` |
| `func_0043ED78` | `.text.func_0043ED78` | 16 | 4 | 0 | 2 | 1 | `func_0043ED88` |
| `func_0045A8B4` | `.text.func_0045A8B4` | 16 | 4 | 0 | 2 | 1 | `func_0045AB24` |
| `func_0045AFEC` | `.text.func_0045AFEC` | 16 | 4 | 0 | 1 | 1 | `func_0045B158` |
| `func_00461228` | `.text.func_00461228` | 16 | 4 | 0 | 1 | 1 | `func_004623DC` |
| `func_004650D0` | `.text.func_004650D0` | 16 | 4 | 0 | 2 | 1 | `func_00465114` |
| `func_00465BA8` | `.text.func_00465BA8` | 16 | 4 | 0 | 1 | 1 | `func_00465BF4` |
| `func_00466AD8` | `.text.func_00466AD8` | 16 | 4 | 0 | 2 | 1 | `func_00466AF8` |
| `func_00466AF8` | `.text.func_00466AF8` | 16 | 4 | 0 | 2 | 1 | `func_00466E00` |
| `func_00472110` | `.text.func_00472110` | 16 | 4 | 0 | 1 | 1 | `func_00472408` |
| `func_00489060` | `.text.func_00489060` | 16 | 4 | 0 | 1 | 1 | `func_00489070` |
| `func_004A95F0` | `.text.func_004A95F0` | 16 | 4 | 0 | 2 | 1 | `func_004A9600` |
| `func_004B1904` | `.text.func_004B1904` | 16 | 4 | 0 | 2 | 1 | `func_004B195C` |
| `func_004B2834` | `.text.func_004B2834` | 16 | 4 | 0 | 2 | 1 | `func_004B287C` |
| `func_004C4E2C` | `.text.func_004C4E2C` | 16 | 4 | 0 | 1 | 1 | `func_004C5074` |
| `func_004D8268` | `.text.func_004D8268` | 16 | 4 | 0 | 2 | 1 | `func_004D82A4` |

Memory-operation counts include scalar, multiple, VFP, and stack transfers.
Returns are excluded from the local-branch count. Totals are 96 instructions,
0 local branches, 24 return sites, and 38 memory operations. There are no
direct branch sites, external transfers, calls, or PC-relative data accesses.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`b86aba348c317d812432ab4e543e69d99eb40ff214568397d779172b3f580ea1`.
The canonical direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The canonical return-transfer schedule SHA-256 is
`9b7608e6bf307f0740b063b9327eff164426ebaa3381682c87c88ab12c3be440`.
Canonical entries are `name:offset:mnemonic:operands` for instructions and
returns, and `name:offset:mnemonic:target` for direct branches, joined with
newlines and no terminal newline. Offsets are lowercase hexadecimal without an
`0x` prefix. All three hashes were reproduced independently from the bounded
target sections and the exact-schedule probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 18,489 string
leaves (6,744 distinct strings) in the 231 pre-existing top-level JSON configs.
The audit resolved 7,174 string occurrences (3,380 distinct symbols) through
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

.section .text.func_001E5234,"ax",%progbits
.balign 4
.global func_001E5234
.type func_001E5234, %function
func_001E5234:
.Lfunc_001E5234_0:
	push	{r4, lr}
.Lfunc_001E5234_4:
	mov	r0, #368
.Lfunc_001E5234_8:
	add	r0, r0, #12
.Lfunc_001E5234_c:
	pop	{r4, pc}
.size func_001E5234, .-func_001E5234

.section .text.func_00410B00,"ax",%progbits
.balign 4
.global func_00410B00
.type func_00410B00, %function
func_00410B00:
.Lfunc_00410B00_0:
	ldm	r1, {r1, r2}
.Lfunc_00410B00_4:
	str	r1, [r0, #64]
.Lfunc_00410B00_8:
	str	r2, [r0, #68]
.Lfunc_00410B00_c:
	bx	lr
.size func_00410B00, .-func_00410B00

.section .text.func_00410B10,"ax",%progbits
.balign 4
.global func_00410B10
.type func_00410B10, %function
func_00410B10:
.Lfunc_00410B10_0:
	mov	r2, #1
.Lfunc_00410B10_4:
	str	r1, [r0, #72]
.Lfunc_00410B10_8:
	strb	r2, [r0, #120]
.Lfunc_00410B10_c:
	bx	lr
.size func_00410B10, .-func_00410B10

.section .text.func_00410B20,"ax",%progbits
.balign 4
.global func_00410B20
.type func_00410B20, %function
func_00410B20:
.Lfunc_00410B20_0:
	cmp	r1, #0
.Lfunc_00410B20_4:
	cmpne	r1, #1
.Lfunc_00410B20_8:
	strbeq	r1, [r0, #10]
.Lfunc_00410B20_c:
	bx	lr
.size func_00410B20, .-func_00410B20

.section .text.func_00410C48,"ax",%progbits
.balign 4
.global func_00410C48
.type func_00410C48, %function
func_00410C48:
.Lfunc_00410C48_0:
	cmp	r1, #0
.Lfunc_00410C48_4:
	cmpne	r1, #1
.Lfunc_00410C48_8:
	strbeq	r1, [r0, #14]
.Lfunc_00410C48_c:
	bx	lr
.size func_00410C48, .-func_00410C48

.section .text.func_00417664,"ax",%progbits
.balign 4
.global func_00417664
.type func_00417664, %function
func_00417664:
.Lfunc_00417664_0:
	cmp	r0, #900
.Lfunc_00417664_4:
	movlt	r0, #1
.Lfunc_00417664_8:
	movge	r0, #0
.Lfunc_00417664_c:
	bx	lr
.size func_00417664, .-func_00417664

.section .text.func_0041B354,"ax",%progbits
.balign 4
.global func_0041B354
.type func_0041B354, %function
func_0041B354:
.Lfunc_0041B354_0:
	mov	r1, #0
.Lfunc_0041B354_4:
	strb	r1, [r0, #50]
.Lfunc_0041B354_8:
	strb	r1, [r0, #49]
.Lfunc_0041B354_c:
	bx	lr
.size func_0041B354, .-func_0041B354

.section .text.func_0043436C,"ax",%progbits
.balign 4
.global func_0043436C
.type func_0043436C, %function
func_0043436C:
.Lfunc_0043436C_0:
	add	r1, r0, #4096
.Lfunc_0043436C_4:
	mov	r0, #0
.Lfunc_0043436C_8:
	str	r0, [r1, #896]
.Lfunc_0043436C_c:
	bx	lr
.size func_0043436C, .-func_0043436C

.section .text.func_0043ED68,"ax",%progbits
.balign 4
.global func_0043ED68
.type func_0043ED68, %function
func_0043ED68:
.Lfunc_0043ED68_0:
	ldr	r1, [r0, #200]
.Lfunc_0043ED68_4:
	orr	r1, r1, #32
.Lfunc_0043ED68_8:
	str	r1, [r0, #200]
.Lfunc_0043ED68_c:
	bx	lr
.size func_0043ED68, .-func_0043ED68

.section .text.func_0043ED78,"ax",%progbits
.balign 4
.global func_0043ED78
.type func_0043ED78, %function
func_0043ED78:
.Lfunc_0043ED78_0:
	ldr	r1, [r0, #200]
.Lfunc_0043ED78_4:
	bic	r1, r1, #32
.Lfunc_0043ED78_8:
	str	r1, [r0, #200]
.Lfunc_0043ED78_c:
	bx	lr
.size func_0043ED78, .-func_0043ED78

.section .text.func_0045A8B4,"ax",%progbits
.balign 4
.global func_0045A8B4
.type func_0045A8B4, %function
func_0045A8B4:
.Lfunc_0045A8B4_0:
	mov	r1, #0
.Lfunc_0045A8B4_4:
	strb	r1, [r0, #1593]
.Lfunc_0045A8B4_8:
	strb	r1, [r0, #1592]
.Lfunc_0045A8B4_c:
	bx	lr
.size func_0045A8B4, .-func_0045A8B4

.section .text.func_0045AFEC,"ax",%progbits
.balign 4
.global func_0045AFEC
.type func_0045AFEC, %function
func_0045AFEC:
.Lfunc_0045AFEC_0:
	add	r1, r0, #768
.Lfunc_0045AFEC_4:
	mvn	r0, #0
.Lfunc_0045AFEC_8:
	strh	r0, [r1, #40]
.Lfunc_0045AFEC_c:
	bx	lr
.size func_0045AFEC, .-func_0045AFEC

.section .text.func_00461228,"ax",%progbits
.balign 4
.global func_00461228
.type func_00461228, %function
func_00461228:
.Lfunc_00461228_0:
	add	r1, r0, #20480
.Lfunc_00461228_4:
	mov	r0, #0
.Lfunc_00461228_8:
	strb	r0, [r1, #516]
.Lfunc_00461228_c:
	bx	lr
.size func_00461228, .-func_00461228

.section .text.func_004650D0,"ax",%progbits
.balign 4
.global func_004650D0
.type func_004650D0, %function
func_004650D0:
.Lfunc_004650D0_0:
	mov	r1, #0
.Lfunc_004650D0_4:
	str	r1, [r0, #4]
.Lfunc_004650D0_8:
	str	r1, [r0, #8]
.Lfunc_004650D0_c:
	bx	lr
.size func_004650D0, .-func_004650D0

.section .text.func_00465BA8,"ax",%progbits
.balign 4
.global func_00465BA8
.type func_00465BA8, %function
func_00465BA8:
.Lfunc_00465BA8_0:
	ldr	r0, [r0, #1396]
.Lfunc_00465BA8_4:
	ands	r0, r0, r1
.Lfunc_00465BA8_8:
	movne	r0, #1
.Lfunc_00465BA8_c:
	bx	lr
.size func_00465BA8, .-func_00465BA8

.section .text.func_00466AD8,"ax",%progbits
.balign 4
.global func_00466AD8
.type func_00466AD8, %function
func_00466AD8:
.Lfunc_00466AD8_0:
	ldr	r1, [r0, #712]
.Lfunc_00466AD8_4:
	orr	r1, r1, #3
.Lfunc_00466AD8_8:
	str	r1, [r0, #712]
.Lfunc_00466AD8_c:
	bx	lr
.size func_00466AD8, .-func_00466AD8

.section .text.func_00466AF8,"ax",%progbits
.balign 4
.global func_00466AF8
.type func_00466AF8, %function
func_00466AF8:
.Lfunc_00466AF8_0:
	ldr	r1, [r0, #712]
.Lfunc_00466AF8_4:
	bic	r1, r1, #12
.Lfunc_00466AF8_8:
	str	r1, [r0, #712]
.Lfunc_00466AF8_c:
	bx	lr
.size func_00466AF8, .-func_00466AF8

.section .text.func_00472110,"ax",%progbits
.balign 4
.global func_00472110
.type func_00472110, %function
func_00472110:
.Lfunc_00472110_0:
	ldr	r0, [r0, #476]
.Lfunc_00472110_4:
	cmp	r0, #0
.Lfunc_00472110_8:
	movne	r0, #1
.Lfunc_00472110_c:
	bx	lr
.size func_00472110, .-func_00472110

.section .text.func_00489060,"ax",%progbits
.balign 4
.global func_00489060
.type func_00489060, %function
func_00489060:
.Lfunc_00489060_0:
	add	r0, r0, r1, lsl #2
.Lfunc_00489060_4:
	add	r0, r0, #14976
.Lfunc_00489060_8:
	str	r2, [r0]
.Lfunc_00489060_c:
	bx	lr
.size func_00489060, .-func_00489060

.section .text.func_004A95F0,"ax",%progbits
.balign 4
.global func_004A95F0
.type func_004A95F0, %function
func_004A95F0:
.Lfunc_004A95F0_0:
	mrc	15, 0, r1, c13, c0, 3
.Lfunc_004A95F0_4:
	ldr	r0, [r0]
.Lfunc_004A95F0_8:
	ldr	r0, [r1, r0, lsl #2]
.Lfunc_004A95F0_c:
	bx	lr
.size func_004A95F0, .-func_004A95F0

.section .text.func_004B1904,"ax",%progbits
.balign 4
.global func_004B1904
.type func_004B1904, %function
func_004B1904:
.Lfunc_004B1904_0:
	ldr	r2, [r0]
.Lfunc_004B1904_4:
	ldr	r1, [r0, #4]
.Lfunc_004B1904_8:
	mov	r0, r2
.Lfunc_004B1904_c:
	bx	lr
.size func_004B1904, .-func_004B1904

.section .text.func_004B2834,"ax",%progbits
.balign 4
.global func_004B2834
.type func_004B2834, %function
func_004B2834:
.Lfunc_004B2834_0:
	vldr	s1, [r0, #92]
.Lfunc_004B2834_4:
	vldr	s2, [r0, #76]
.Lfunc_004B2834_8:
	vdiv.f32	s0, s1, s2
.Lfunc_004B2834_c:
	bx	lr
.size func_004B2834, .-func_004B2834

.section .text.func_004C4E2C,"ax",%progbits
.balign 4
.global func_004C4E2C
.type func_004C4E2C, %function
func_004C4E2C:
.Lfunc_004C4E2C_0:
	ldrb	r0, [r0, #169]
.Lfunc_004C4E2C_4:
	cmp	r0, #0
.Lfunc_004C4E2C_8:
	movne	r0, #1
.Lfunc_004C4E2C_c:
	bx	lr
.size func_004C4E2C, .-func_004C4E2C

.section .text.func_004D8268,"ax",%progbits
.balign 4
.global func_004D8268
.type func_004D8268, %function
func_004D8268:
.Lfunc_004D8268_0:
	vldmia	r0, {s0-s3}
.Lfunc_004D8268_4:
	mov	r0, r1
.Lfunc_004D8268_8:
	vstmia	r1, {s0-s3}
.Lfunc_004D8268_c:
	bx	lr
.size func_004D8268, .-func_004D8268

```

## Implementation contract

- Build exactly the assembly artifact above as
  `src/main/arm_runtime_helpers_90.S`; its UTF-8 bytes, including the terminal
  newline, hash to the source SHA-256 at the top of this document.
- Keep every helper in its named allocatable executable PROGBITS section with
  four-byte alignment, one global ARM function symbol at value zero, and the
  exact 16-byte symbol size.
- Do not add calls, relocations, literals, adjacent words, aliases, secondary
  entries, or generated-target mappings. This is a zero-relocation runtime
  batch and must not be added to `scripts/generate-target-object.mjs`.
- A validator should enforce 24 functions, 384 body bytes, 96 instructions,
  zero local branches, 24 returns, 38 memory operations, the three schedule
  hashes above, zero owned-section relocations, and exact owned symbol/section
  identities. Candidate-object checks must remain bounded while accepting
  unrelated foreign sections in composite objects.
