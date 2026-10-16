# Probe-verified ARM runtime/helper batch 82

Source SHA-256: `3f219d55e8c0ded5afcea25f05562dccce676505c4a474bafd35af4349d1c8f1`

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 768 executable body bytes (192 instructions). Evidence
was limited to the current unmatched report, the neutral symbol inventory,
bounded private-target control/data-flow inspection, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; the probe
used GNU Arm binutils 2.44 in ARMv6K/VFPv2 mode on 2026-10-16. Selection
recursively excluded every ownership and reference string in all 212 pre-existing
JSON configs, including runtime batch 81, as well as configured address intervals,
branch destinations, direct-transfer symbols, aliases, owners, and secondary-entry
identities.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Each body is byte-unique in the complete
10,440-function target section inventory, so no member belongs to an
exact-duplicate family. The authoritative report records zero-percent matches for
all twenty-four selected names and accounts for exactly 768 selected bytes.
Private inspection artifacts used for selection are ignored and are not part of
this specification. Independent assembly comparison matched all twenty-four
complete target bodies (768 bytes / 192 instructions), with a zero-byte exact
diff.

## Structural and boundary inventory

| Function | Section | Mode | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `func_002C3128` | `.text.func_002C3128` | ARM | 32 | 8 | 1 | 3 | 1 | `func_002C3268` |
| `func_002C3320` | `.text.func_002C3320` | ARM | 32 | 8 | 0 | 3 | 1 | `func_002C3340` |
| `func_002C3364` | `.text.func_002C3364` | ARM | 32 | 8 | 0 | 5 | 1 | `func_002C3404` |
| `func_002C8880` | `.text.func_002C8880` | ARM | 32 | 8 | 0 | 5 | 1 | `func_002C88A0` |
| `func_002CACA0` | `.text.func_002CACA0` | ARM | 32 | 8 | 1 | 1 | 1 | `func_002CB020` |
| `func_00322440` | `.text.func_00322440` | ARM | 32 | 8 | 0 | 6 | 1 | `func_00322574` |
| `func_0032F118` | `.text.func_0032F118` | ARM | 32 | 8 | 0 | 1 | 1 | `func_0032F138` |
| `func_00330488` | `.text.func_00330488` | ARM | 32 | 8 | 1 | 4 | 1 | `func_003304A8` |
| `func_003315DC` | `.text.func_003315DC` | ARM | 32 | 8 | 1 | 4 | 1 | `func_003315FC` |
| `func_003315FC` | `.text.func_003315FC` | ARM | 32 | 8 | 1 | 4 | 1 | `func_0033161C` |
| `func_003316D4` | `.text.func_003316D4` | ARM | 32 | 8 | 1 | 4 | 1 | `func_003316F4` |
| `func_003316F4` | `.text.func_003316F4` | ARM | 32 | 8 | 0 | 4 | 1 | `func_00331714` |
| `func_0033612C` | `.text.func_0033612C` | ARM | 32 | 8 | 0 | 4 | 1 | `func_0033614C` |
| `func_0033C1A4` | `.text.func_0033C1A4` | ARM | 32 | 8 | 2 | 2 | 1 | `func_0033C1C4` |
| `func_00387350` | `.text.func_00387350` | ARM | 32 | 8 | 0 | 5 | 1 | `func_00387544` |
| `func_00396454` | `.text.func_00396454` | ARM | 32 | 8 | 0 | 6 | 1 | `func_003964E8` |
| `func_003B7E60` | `.text.func_003B7E60` | ARM | 32 | 8 | 2 | 2 | 1 | `func_003B7E80` |
| `func_003C4E48` | `.text.func_003C4E48` | ARM | 32 | 8 | 0 | 5 | 1 | `func_003C4E68` |
| `func_003C88C0` | `.text.func_003C88C0` | ARM | 32 | 8 | 0 | 6 | 1 | `func_003C88F0` |
| `func_004108EC` | `.text.func_004108EC` | ARM | 32 | 8 | 0 | 2 | 1 | `func_0041090C` |
| `func_0045ECC0` | `.text.func_0045ECC0` | ARM | 32 | 8 | 0 | 2 | 1 | `func_0045ED8C` |
| `func_004623DC` | `.text.func_004623DC` | ARM | 32 | 8 | 0 | 4 | 1 | `func_004623FC` |
| `func_004C0728` | `.text.func_004C0728` | ARM | 32 | 8 | 1 | 2 | 1 | `func_004C0748` |
| `func_004C22F0` | `.text.func_004C22F0` | ARM | 32 | 8 | 1 | 2 | 1 | `func_004C2430` |

Memory-operation counts include scalar loads/stores, VFP transfers, and stack
transfers. Return transfers are excluded from the local-branch column. The
per-function counts total 12 direct function-local B-family sites, all
conditional, 24 separately validated return transfers, and 86 memory operations.
There are no unconditional local branches.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`7ada484f59eb8d6ee0008db333f1b55af83550e1a5e1672f62680af45d287e4c`. The canonical direct-branch schedule SHA-256 is
`80a1698f9bbb8131b61923d8611548dcda37c333329c2a1b4c123289bda940fb`. The canonical return-transfer schedule SHA-256 is
`d4b4814485e6603dcfa04abc5ddd020d90549b620c06d844db345c86db1213a4`. All three digests were independently reproduced from the
bounded target sections and from the assembled exact-schedule probe. Canonical
entries use `name:offset:mnemonic:operands` for the full schedule,
`name:offset:mnemonic:target` for direct branches, and
`name:offset:mnemonic:operands` for returns, joined by newlines without a
terminal newline. Offsets and direct targets are lowercase hexadecimal without
an `0x` prefix.

The “next global” column is a boundary cross-check from the neutral symbol
inventory; it does not assert that the next global is address-contiguous. Each
owned section ends exactly at its stated body size. Intervening unowned bytes,
where present, are outside this batch, and every function has a zero-byte
adjacent-data schedule.

## Uniqueness, collision, and reference audit

The twenty-four exported names are pairwise distinct and absent from all 15,481
string leaves (5,560 distinct strings) in the 212 pre-existing JSON configs. A
recursive audit resolved 2,909 configured strings to neutral symbols and checked
their full address intervals; none overlaps a selected interval. The same audit
covered function owners, branch destinations, direct-transfer symbols, identity
class members, aliases, next-global annotations, and secondary-entry relations.
The neutral inventory contains no alternate symbol at any selected start address
and no nested global entry within a selected interval. Selected intervals are
pairwise disjoint.

All selected report entries are present at zero percent, so none is already
source-owned by the current build. Hashing each complete symbol-bounded body
against all 10,440 target function sections produced multiplicity one for every
selected body. Section-scoped relocation audits of both the target object and the
independently assembled probe found no relocation for any selected function.

## Exact schedules

The following is the complete independently assembled artifact. Local labels may
be renamed consistently. Preserve every mnemonic, operand, condition, memory
mode, instruction order, section name, mode, alignment, and function boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_002C3128,"ax",%progbits
.balign 4
.global func_002C3128
.type func_002C3128, %function
func_002C3128:
.Lfunc_002C3128_0:
	ldrb	r1, [r0]
.Lfunc_002C3128_4:
	cmp	r1, #0
.Lfunc_002C3128_8:
	beq	.Lfunc_002C3128_1c
.Lfunc_002C3128_c:
	mvn	r2, #0
.Lfunc_002C3128_10:
	mov	r1, #0
.Lfunc_002C3128_14:
	str	r2, [r0, #60]
.Lfunc_002C3128_18:
	strb	r1, [r0]
.Lfunc_002C3128_1c:
	bx	lr
.size func_002C3128, .-func_002C3128

.section .text.func_002C3320,"ax",%progbits
.balign 4
.global func_002C3320
.type func_002C3320, %function
func_002C3320:
.Lfunc_002C3320_0:
	ldr	r0, [r0, #104]
.Lfunc_002C3320_4:
	mov	r0, r0
.Lfunc_002C3320_8:
	ldrh	r2, [r0, #30]
.Lfunc_002C3320_c:
	and	r1, r1, #3
.Lfunc_002C3320_10:
	bic	r2, r2, #3
.Lfunc_002C3320_14:
	orr	r1, r1, r2
.Lfunc_002C3320_18:
	strh	r1, [r0, #30]
.Lfunc_002C3320_1c:
	bx	lr
.size func_002C3320, .-func_002C3320

.section .text.func_002C3364,"ax",%progbits
.balign 4
.global func_002C3364
.type func_002C3364, %function
func_002C3364:
.Lfunc_002C3364_0:
	strb	r1, [r0, #5]
.Lfunc_002C3364_4:
	ldr	r0, [r0, #104]
.Lfunc_002C3364_8:
	mov	r0, r0
.Lfunc_002C3364_c:
	ldrh	r2, [r0, #108]
.Lfunc_002C3364_10:
	strb	r1, [r0, #14]
.Lfunc_002C3364_14:
	orr	r1, r2, #32
.Lfunc_002C3364_18:
	strh	r1, [r0, #108]
.Lfunc_002C3364_1c:
	bx	lr
.size func_002C3364, .-func_002C3364

.section .text.func_002C8880,"ax",%progbits
.balign 4
.global func_002C8880
.type func_002C8880, %function
func_002C8880:
.Lfunc_002C8880_0:
	mov	ip, #0
.Lfunc_002C8880_4:
	str	r1, [r0, #12]
.Lfunc_002C8880_8:
	str	ip, [r0, #16]
.Lfunc_002C8880_c:
	str	ip, [r0, #32]
.Lfunc_002C8880_10:
	str	ip, [r0, #36]
.Lfunc_002C8880_14:
	str	ip, [r0, #20]
.Lfunc_002C8880_18:
	mov	r0, ip
.Lfunc_002C8880_1c:
	bx	lr
.size func_002C8880, .-func_002C8880

.section .text.func_002CACA0,"ax",%progbits
.balign 4
.global func_002CACA0
.type func_002CACA0, %function
func_002CACA0:
.Lfunc_002CACA0_0:
	mov	r2, r0
.Lfunc_002CACA0_4:
	mov	r0, #0
.Lfunc_002CACA0_8:
	ldrb	r3, [r2, r0]
.Lfunc_002CACA0_c:
	cmp	r3, #0
.Lfunc_002CACA0_10:
	cmpne	r1, r0
.Lfunc_002CACA0_14:
	addhi	r0, r0, #1
.Lfunc_002CACA0_18:
	bhi	.Lfunc_002CACA0_8
.Lfunc_002CACA0_1c:
	bx	lr
.size func_002CACA0, .-func_002CACA0

.section .text.func_00322440,"ax",%progbits
.balign 4
.global func_00322440
.type func_00322440, %function
func_00322440:
.Lfunc_00322440_0:
	ldrd	r2, [r1]
.Lfunc_00322440_4:
	ldr	r1, [r1, #8]
.Lfunc_00322440_8:
	str	r1, [r0, #48]
.Lfunc_00322440_c:
	strd	r2, [r0, #40]
.Lfunc_00322440_10:
	ldrb	r1, [r0, #183]
.Lfunc_00322440_14:
	and	r1, r1, #207
.Lfunc_00322440_18:
	strb	r1, [r0, #183]
.Lfunc_00322440_1c:
	bx	lr
.size func_00322440, .-func_00322440

.section .text.func_0032F118,"ax",%progbits
.balign 4
.global func_0032F118
.type func_0032F118, %function
func_0032F118:
.Lfunc_0032F118_0:
	add	r1, r1, #1
.Lfunc_0032F118_4:
	mul	r1, r1, r1
.Lfunc_0032F118_8:
	asr	r2, r1, #31
.Lfunc_0032F118_c:
	add	r1, r1, r2, lsr #30
.Lfunc_0032F118_10:
	lsl	r1, r1, #14
.Lfunc_0032F118_14:
	lsr	r1, r1, #16
.Lfunc_0032F118_18:
	strh	r1, [r0, #20]
.Lfunc_0032F118_1c:
	bx	lr
.size func_0032F118, .-func_0032F118

.section .text.func_00330488,"ax",%progbits
.balign 4
.global func_00330488
.type func_00330488, %function
func_00330488:
.Lfunc_00330488_0:
	ldrb	r1, [r0, #8]
.Lfunc_00330488_4:
	cmp	r1, #0
.Lfunc_00330488_8:
	beq	.Lfunc_00330488_1c
.Lfunc_00330488_c:
	mov	r1, #0
.Lfunc_00330488_10:
	str	r1, [r0]
.Lfunc_00330488_14:
	str	r1, [r0, #4]
.Lfunc_00330488_18:
	strb	r1, [r0, #8]
.Lfunc_00330488_1c:
	bx	lr
.size func_00330488, .-func_00330488

.section .text.func_003315DC,"ax",%progbits
.balign 4
.global func_003315DC
.type func_003315DC, %function
func_003315DC:
.Lfunc_003315DC_0:
	ldrb	r2, [r0, #44]
.Lfunc_003315DC_4:
	cmp	r2, r1
.Lfunc_003315DC_8:
	beq	.Lfunc_003315DC_1c
.Lfunc_003315DC_c:
	ldrh	r2, [r0, #32]
.Lfunc_003315DC_10:
	strb	r1, [r0, #44]
.Lfunc_003315DC_14:
	orr	r1, r2, #8
.Lfunc_003315DC_18:
	strh	r1, [r0, #32]
.Lfunc_003315DC_1c:
	bx	lr
.size func_003315DC, .-func_003315DC

.section .text.func_003315FC,"ax",%progbits
.balign 4
.global func_003315FC
.type func_003315FC, %function
func_003315FC:
.Lfunc_003315FC_0:
	ldrb	r2, [r0, #45]
.Lfunc_003315FC_4:
	cmp	r2, r1
.Lfunc_003315FC_8:
	beq	.Lfunc_003315FC_1c
.Lfunc_003315FC_c:
	ldrh	r2, [r0, #32]
.Lfunc_003315FC_10:
	strb	r1, [r0, #45]
.Lfunc_003315FC_14:
	orr	r1, r2, #8
.Lfunc_003315FC_18:
	strh	r1, [r0, #32]
.Lfunc_003315FC_1c:
	bx	lr
.size func_003315FC, .-func_003315FC

.section .text.func_003316D4,"ax",%progbits
.balign 4
.global func_003316D4
.type func_003316D4, %function
func_003316D4:
.Lfunc_003316D4_0:
	ldrsb	r2, [r0, #23]
.Lfunc_003316D4_4:
	cmp	r2, r1
.Lfunc_003316D4_8:
	beq	.Lfunc_003316D4_1c
.Lfunc_003316D4_c:
	ldrh	r2, [r0, #32]
.Lfunc_003316D4_10:
	strb	r1, [r0, #23]
.Lfunc_003316D4_14:
	orr	r1, r2, #2
.Lfunc_003316D4_18:
	strh	r1, [r0, #32]
.Lfunc_003316D4_1c:
	bx	lr
.size func_003316D4, .-func_003316D4

.section .text.func_003316F4,"ax",%progbits
.balign 4
.global func_003316F4
.type func_003316F4, %function
func_003316F4:
.Lfunc_003316F4_0:
	ldrh	r2, [r0, #32]
.Lfunc_003316F4_4:
	mov	r3, #1
.Lfunc_003316F4_8:
	mov	r1, #0
.Lfunc_003316F4_c:
	strb	r3, [r0, #21]
.Lfunc_003316F4_10:
	orr	r2, r2, #1
.Lfunc_003316F4_14:
	strb	r1, [r0, #23]
.Lfunc_003316F4_18:
	strh	r2, [r0, #32]
.Lfunc_003316F4_1c:
	bx	lr
.size func_003316F4, .-func_003316F4

.section .text.func_0033612C,"ax",%progbits
.balign 4
.global func_0033612C
.type func_0033612C, %function
func_0033612C:
.Lfunc_0033612C_0:
	ldr	r3, [r0, #356]
.Lfunc_0033612C_4:
	ldr	r2, [r0, #360]
.Lfunc_0033612C_8:
	add	r1, r1, r3
.Lfunc_0033612C_c:
	cmp	r1, r2
.Lfunc_0033612C_10:
	str	r1, [r0, #356]
.Lfunc_0033612C_14:
	movgt	r1, r2
.Lfunc_0033612C_18:
	str	r1, [r0, #356]
.Lfunc_0033612C_1c:
	bx	lr
.size func_0033612C, .-func_0033612C

.section .text.func_0033C1A4,"ax",%progbits
.balign 4
.global func_0033C1A4
.type func_0033C1A4, %function
func_0033C1A4:
.Lfunc_0033C1A4_0:
	ldr	r1, [r0, #44]
.Lfunc_0033C1A4_4:
	cmn	r1, #1
.Lfunc_0033C1A4_8:
	bne	.Lfunc_0033C1A4_18
.Lfunc_0033C1A4_c:
	ldr	r0, [r0, #48]
.Lfunc_0033C1A4_10:
	ands	r0, r0, #1073741824
.Lfunc_0033C1A4_14:
	beq	.Lfunc_0033C1A4_1c
.Lfunc_0033C1A4_18:
	mov	r0, #1
.Lfunc_0033C1A4_1c:
	bx	lr
.size func_0033C1A4, .-func_0033C1A4

.section .text.func_00387350,"ax",%progbits
.balign 4
.global func_00387350
.type func_00387350, %function
func_00387350:
.Lfunc_00387350_0:
	mov	r3, #2
.Lfunc_00387350_4:
	mov	r2, #0
.Lfunc_00387350_8:
	strb	r3, [r0]
.Lfunc_00387350_c:
	str	r2, [r0, #4]
.Lfunc_00387350_10:
	str	r2, [r0, #8]
.Lfunc_00387350_14:
	str	r2, [r0, #12]
.Lfunc_00387350_18:
	strb	r1, [r0, #1]
.Lfunc_00387350_1c:
	bx	lr
.size func_00387350, .-func_00387350

.section .text.func_00396454,"ax",%progbits
.balign 4
.global func_00396454
.type func_00396454, %function
func_00396454:
.Lfunc_00396454_0:
	ldrd	r2, [r1]
.Lfunc_00396454_4:
	ldr	r1, [r1, #8]
.Lfunc_00396454_8:
	str	r1, [r0, #252]
.Lfunc_00396454_c:
	strd	r2, [r0, #244]
.Lfunc_00396454_10:
	ldr	r1, [r0, #228]
.Lfunc_00396454_14:
	orr	r1, r1, #4
.Lfunc_00396454_18:
	str	r1, [r0, #228]
.Lfunc_00396454_1c:
	bx	lr
.size func_00396454, .-func_00396454

.section .text.func_003B7E60,"ax",%progbits
.balign 4
.global func_003B7E60
.type func_003B7E60, %function
func_003B7E60:
.Lfunc_003B7E60_0:
	cmp	r1, #0
.Lfunc_003B7E60_4:
	ble	.Lfunc_003B7E60_1c
.Lfunc_003B7E60_8:
	cmp	r2, #0
.Lfunc_003B7E60_c:
	beq	.Lfunc_003B7E60_1c
.Lfunc_003B7E60_10:
	mov	r3, #0
.Lfunc_003B7E60_14:
	str	r3, [r0], #4
.Lfunc_003B7E60_18:
	stm	r0, {r1, r2}
.Lfunc_003B7E60_1c:
	bx	lr
.size func_003B7E60, .-func_003B7E60

.section .text.func_003C4E48,"ax",%progbits
.balign 4
.global func_003C4E48
.type func_003C4E48, %function
func_003C4E48:
.Lfunc_003C4E48_0:
	ldr	r2, [r0, #8]
.Lfunc_003C4E48_4:
	mov	r1, #0
.Lfunc_003C4E48_8:
	str	r1, [r0, #20]
.Lfunc_003C4E48_c:
	strb	r1, [r0, #28]
.Lfunc_003C4E48_10:
	strb	r1, [r0, #29]
.Lfunc_003C4E48_14:
	add	r1, r2, #16
.Lfunc_003C4E48_18:
	str	r1, [r0, #12]
.Lfunc_003C4E48_1c:
	bx	lr
.size func_003C4E48, .-func_003C4E48

.section .text.func_003C88C0,"ax",%progbits
.balign 4
.global func_003C88C0
.type func_003C88C0, %function
func_003C88C0:
.Lfunc_003C88C0_0:
	vldmia	r1, {s0-s7}
.Lfunc_003C88C0_4:
	add	r2, r0, #16
.Lfunc_003C88C0_8:
	vstmia	r2, {s0-s7}
.Lfunc_003C88C0_c:
	ldrd	r2, [r1, #32]
.Lfunc_003C88C0_10:
	ldr	r1, [r1, #40]
.Lfunc_003C88C0_14:
	str	r1, [r0, #56]
.Lfunc_003C88C0_18:
	strd	r2, [r0, #48]
.Lfunc_003C88C0_1c:
	bx	lr
.size func_003C88C0, .-func_003C88C0

.section .text.func_004108EC,"ax",%progbits
.balign 4
.global func_004108EC
.type func_004108EC, %function
func_004108EC:
.Lfunc_004108EC_0:
	ldr	r2, [r0]
.Lfunc_004108EC_4:
	lsl	r1, r1, #14
.Lfunc_004108EC_8:
	lsr	r1, r1, #14
.Lfunc_004108EC_c:
	lsr	r2, r2, #18
.Lfunc_004108EC_10:
	lsl	r2, r2, #18
.Lfunc_004108EC_14:
	orr	r1, r1, r2
.Lfunc_004108EC_18:
	str	r1, [r0]
.Lfunc_004108EC_1c:
	bx	lr
.size func_004108EC, .-func_004108EC

.section .text.func_0045ECC0,"ax",%progbits
.balign 4
.global func_0045ECC0
.type func_0045ECC0, %function
func_0045ECC0:
.Lfunc_0045ECC0_0:
	ldrb	r1, [r0, #11]
.Lfunc_0045ECC0_4:
	add	r1, r1, #1
.Lfunc_0045ECC0_8:
	and	r1, r1, #255
.Lfunc_0045ECC0_c:
	cmp	r1, #10
.Lfunc_0045ECC0_10:
	strb	r1, [r0, #11]
.Lfunc_0045ECC0_14:
	movcs	r0, #0
.Lfunc_0045ECC0_18:
	movcc	r0, #1
.Lfunc_0045ECC0_1c:
	bx	lr
.size func_0045ECC0, .-func_0045ECC0

.section .text.func_004623DC,"ax",%progbits
.balign 4
.global func_004623DC
.type func_004623DC, %function
func_004623DC:
.Lfunc_004623DC_0:
	ldrb	r2, [r0, #1089]
.Lfunc_004623DC_4:
	orr	r2, r2, #128
.Lfunc_004623DC_8:
	strb	r2, [r0, #1089]
.Lfunc_004623DC_c:
	ldrb	r1, [r0, #1090]
.Lfunc_004623DC_10:
	cmp	r1, #30
.Lfunc_004623DC_14:
	moveq	r1, #31
.Lfunc_004623DC_18:
	strbeq	r1, [r0, #1090]
.Lfunc_004623DC_1c:
	bx	lr
.size func_004623DC, .-func_004623DC

.section .text.func_004C0728,"ax",%progbits
.balign 4
.global func_004C0728
.type func_004C0728, %function
func_004C0728:
.Lfunc_004C0728_0:
	ldr	r0, [r0]
.Lfunc_004C0728_4:
	cmp	r0, #0
.Lfunc_004C0728_8:
	beq	.Lfunc_004C0728_1c
.Lfunc_004C0728_c:
	ldrb	r0, [r0, #4]
.Lfunc_004C0728_10:
	cmp	r0, #0
.Lfunc_004C0728_14:
	moveq	r0, #1
.Lfunc_004C0728_18:
	movne	r0, #0
.Lfunc_004C0728_1c:
	bx	lr
.size func_004C0728, .-func_004C0728

.section .text.func_004C22F0,"ax",%progbits
.balign 4
.global func_004C22F0
.type func_004C22F0, %function
func_004C22F0:
.Lfunc_004C22F0_0:
	ldr	r2, [r0, #20]!
.Lfunc_004C22F0_4:
	cmp	r2, r1
.Lfunc_004C22F0_8:
	movls	r0, #0
.Lfunc_004C22F0_c:
	bls	.Lfunc_004C22F0_1c
.Lfunc_004C22F0_10:
	add	r1, r0, r1, lsl #3
.Lfunc_004C22F0_14:
	ldr	r1, [r1, #8]
.Lfunc_004C22F0_18:
	add	r0, r0, r1
.Lfunc_004C22F0_1c:
	bx	lr
.size func_004C22F0, .-func_004C22F0
```

## Implementation contract

Implement this artifact in `src/main/arm_runtime_helpers_82.S` without access
to the private target, disassembly, report, symbol inventory, probe products, or
other authored implementation sources. Assemble as ARMv6K with VFPv2 enabled.
The implementation exports exactly the twenty-four named functions in their
owned executable sections, produces no relocations or adjacent data, and
matches the sizes and schedules above. Its source SHA-256 is recorded above
and in the neutral config.
