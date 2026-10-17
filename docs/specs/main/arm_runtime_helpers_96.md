# Probe-verified ARM runtime/helper batch 96

Source SHA-256: `84462cd7af1d3b7452a82219de83e209d255b274e862b8dac4d00f560ace8f4f`

## Scope and provenance

This clean-room analysis specification covers twelve currently unmatched,
ARM-state, call-bearing symbol entries totaling 192 executable body bytes (48
instructions). Evidence was limited to the current unmatched report, neutral
symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, semantic literal
equality auditing, and an independently assembled and linked exact-schedule
probe. The target is revision `AS_EUR_REV2`; GNU Arm binutils 2.45.1 was used
in ARMv6K/VFPv2 mode on 2026-10-17.

Every selected entry has a complete 16-byte inventory/report extent, exactly
one direct call, no body overlap, no embedded private string or asset, and no
owned adjacent data. Two entries return within their owned extent; the other
ten end at their call site and deliberately claim none of the unowned gap
before the next global symbol. One entry performs a PC-relative read from an
unowned word 64 bytes from its start. A semantic equality audit proves that
word belongs to the established `ipc_callback_table_65` identity, which must
be reused; its resolved representation is neither emitted nor recorded here.

Independent assembly followed by placement at the neutral inventory addresses
and resolution against the four canonical call-target symbols reproduced all
192 selected target bytes with a zero-byte exact diff. The resulting
relocatable probe contains exactly twelve `R_ARM_CALL` relocations and no data
relocation. The cohort exhausts the call-bearing 16-byte ARM residual following
batch 95; the remaining residual entries are direct-transfer wrappers,
indirect-transfer stubs, a conditional transfer/return entry, and a plain leaf
whose body has a duplicate occurrence.

## Structural and boundary inventory

| Function | Section | Body | Instructions | Calls | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00136740` | `.text.func_00136740` | 16 | 4 | 1 | 2 | 0 | `func_00136874` |
| `func_00176610` | `.text.func_00176610` | 16 | 4 | 1 | 3 | 1 | `func_00176620` |
| `func_001D6C74` | `.text.func_001D6C74` | 16 | 4 | 1 | 1 | 0 | `func_001D6CD8` |
| `func_001F02C4` | `.text.func_001F02C4` | 16 | 4 | 1 | 1 | 0 | `func_001F02E0` |
| `func_0038CD1C` | `.text.func_0038CD1C` | 16 | 4 | 1 | 2 | 1 | `func_0038CD2C` |
| `func_003A38A4` | `.text.func_003A38A4` | 16 | 4 | 1 | 1 | 0 | `func_003A4238` |
| `func_0040ECC4` | `.text.func_0040ECC4` | 16 | 4 | 1 | 1 | 0 | `func_0040ECE8` |
| `func_00410BD0` | `.text.func_00410BD0` | 16 | 4 | 1 | 1 | 0 | `func_00410BFC` |
| `func_0043D504` | `.text.func_0043D504` | 16 | 4 | 1 | 1 | 0 | `func_0043D6E8` |
| `func_00441C68` | `.text.func_00441C68` | 16 | 4 | 1 | 1 | 0 | `func_00441DE4` |
| `func_0045BECC` | `.text.func_0045BECC` | 16 | 4 | 1 | 1 | 0 | `func_0045BFF8` |
| `func_0052A420` | `.text.func_0052A420` | 16 | 4 | 1 | 1 | 0 | `func_0052A540` |

Stack transfers are counted as memory operations. Calls and returns are counted
separately. Totals are 48 instructions, 16 memory operations, twelve calls,
two return sites, one PC-relative data access, zero local branches, and zero
owned adjacent bytes. The “next global” values are boundary cross-checks from
the neutral inventory; they do not assert address contiguity or transfer
ownership to any intervening byte.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`ed3af746409cee0e8a1f16c1ebe0c05dadecfb8841d53d9891f1a03b0d4ec3cb`.
The direct-call schedule SHA-256 is
`c10dadd6cb664723a16b99fbd04ac8398791c2734e55d566e9a3d330a08e0431`.
The return-transfer schedule SHA-256 is
`66c6700322abb4750ce919bc0851bada143a1de444425e2a43c2e1cb33a609cc`.
The PC-relative access schedule SHA-256 is
`f1d99ee4d9eddab2ee1bd4699474525a8af45771a46812941466cf6b913852a4`.
The relocation schedule SHA-256 is
`32a2cd247676a7a4192bc528ed74ab2fe8d3ae59a457529b64c5dd7cc18e4691`.

Instruction and return entries use `name:offset:mnemonic:operands`. Call
entries use `name:offset:mnemonic:symbol`; PC-relative entries use
`name:offset:mnemonic:targetOffset:symbol`; relocation entries use
`name:offset:type:symbol`. Entries are joined with newlines and no terminal
newline. Offsets and target offsets are lowercase hexadecimal without `0x`.

## Call and identity contract

The twelve calls resolve to four pairwise-distinct, 4-byte-aligned ARM primary
entries. `func_00301FBC` has seven sites, `func_0014E348` has three sites,
and `func_00178A6C` and `func_003918E8` each have one site. None is a secondary
entry or Thumb target. The first three names reuse identities already present
in the public configuration reference graph. `func_003918E8` is a canonical
neutral-inventory primary entry newly referenced by this configuration; it is
not an invented alias. There are no new data identities. The only data
identity reference reuses `ipc_callback_table_65` at the unowned external
PC-relative target of `func_00136740`.

The relocation schedule is:

| Function | Offset | Type | Symbol |
| --- | ---: | --- | --- |
| `func_00136740` | 12 | `R_ARM_CALL` | `func_00301FBC` |
| `func_00176610` | 4 | `R_ARM_CALL` | `func_00178A6C` |
| `func_001D6C74` | 12 | `R_ARM_CALL` | `func_00301FBC` |
| `func_001F02C4` | 12 | `R_ARM_CALL` | `func_00301FBC` |
| `func_0038CD1C` | 4 | `R_ARM_CALL` | `func_003918E8` |
| `func_003A38A4` | 12 | `R_ARM_CALL` | `func_00301FBC` |
| `func_0040ECC4` | 12 | `R_ARM_CALL` | `func_00301FBC` |
| `func_00410BD0` | 12 | `R_ARM_CALL` | `func_00301FBC` |
| `func_0043D504` | 12 | `R_ARM_CALL` | `func_0014E348` |
| `func_00441C68` | 12 | `R_ARM_CALL` | `func_0014E348` |
| `func_0045BECC` | 12 | `R_ARM_CALL` | `func_0014E348` |
| `func_0052A420` | 12 | `R_ARM_CALL` | `func_00301FBC` |

## Exact independently assembled artifact

The following is the complete canonical source. Preserve its whitespace and
terminal newline so that the source hash remains stable.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.global func_0014E348
.global func_00178A6C
.global func_00301FBC
.global func_003918E8

.section .text.func_00136740,"ax",%progbits
.balign 4
.global func_00136740
.type func_00136740, %function
func_00136740:
.Lfunc_00136740_0:
	ldr	r0, [pc, #56]
.Lfunc_00136740_4:
	mov	r1, #512
.Lfunc_00136740_8:
	push	{r4, lr}
.Lfunc_00136740_c:
	bl	func_00301FBC
.size func_00136740, .-func_00136740

.section .text.func_00176610,"ax",%progbits
.balign 4
.global func_00176610
.type func_00176610, %function
func_00176610:
.Lfunc_00176610_0:
	push	{r4, lr}
.Lfunc_00176610_4:
	bl	func_00178A6C
.Lfunc_00176610_8:
	ldr	r0, [r0, #12]
.Lfunc_00176610_c:
	pop	{r4, pc}
.size func_00176610, .-func_00176610

.section .text.func_001D6C74,"ax",%progbits
.balign 4
.global func_001D6C74
.type func_001D6C74, %function
func_001D6C74:
.Lfunc_001D6C74_0:
	push	{r4, lr}
.Lfunc_001D6C74_4:
	mov	r4, r0
.Lfunc_001D6C74_8:
	mov	r1, #536
.Lfunc_001D6C74_c:
	bl	func_00301FBC
.size func_001D6C74, .-func_001D6C74

.section .text.func_001F02C4,"ax",%progbits
.balign 4
.global func_001F02C4
.type func_001F02C4, %function
func_001F02C4:
.Lfunc_001F02C4_0:
	push	{r4, lr}
.Lfunc_001F02C4_4:
	mov	r4, r0
.Lfunc_001F02C4_8:
	mov	r1, #120
.Lfunc_001F02C4_c:
	bl	func_00301FBC
.size func_001F02C4, .-func_001F02C4

.section .text.func_0038CD1C,"ax",%progbits
.balign 4
.global func_0038CD1C
.type func_0038CD1C, %function
func_0038CD1C:
.Lfunc_0038CD1C_0:
	push	{r4, lr}
.Lfunc_0038CD1C_4:
	bl	func_003918E8
.Lfunc_0038CD1C_8:
	mov	r0, #1
.Lfunc_0038CD1C_c:
	pop	{r4, pc}
.size func_0038CD1C, .-func_0038CD1C

.section .text.func_003A38A4,"ax",%progbits
.balign 4
.global func_003A38A4
.type func_003A38A4, %function
func_003A38A4:
.Lfunc_003A38A4_0:
	push	{r4, r5, r6, lr}
.Lfunc_003A38A4_4:
	mov	r4, r0
.Lfunc_003A38A4_8:
	mov	r1, #9216
.Lfunc_003A38A4_c:
	bl	func_00301FBC
.size func_003A38A4, .-func_003A38A4

.section .text.func_0040ECC4,"ax",%progbits
.balign 4
.global func_0040ECC4
.type func_0040ECC4, %function
func_0040ECC4:
.Lfunc_0040ECC4_0:
	push	{r4, lr}
.Lfunc_0040ECC4_4:
	mov	r4, r0
.Lfunc_0040ECC4_8:
	mov	r1, #80
.Lfunc_0040ECC4_c:
	bl	func_00301FBC
.size func_0040ECC4, .-func_0040ECC4

.section .text.func_00410BD0,"ax",%progbits
.balign 4
.global func_00410BD0
.type func_00410BD0, %function
func_00410BD0:
.Lfunc_00410BD0_0:
	push	{r4, lr}
.Lfunc_00410BD0_4:
	mov	r4, r0
.Lfunc_00410BD0_8:
	mov	r1, #108
.Lfunc_00410BD0_c:
	bl	func_00301FBC
.size func_00410BD0, .-func_00410BD0

.section .text.func_0043D504,"ax",%progbits
.balign 4
.global func_0043D504
.type func_0043D504, %function
func_0043D504:
.Lfunc_0043D504_0:
	push	{r4, r5, r6, lr}
.Lfunc_0043D504_4:
	sub	sp, sp, #16
.Lfunc_0043D504_8:
	mov	r4, r0
.Lfunc_0043D504_c:
	bl	func_0014E348
.size func_0043D504, .-func_0043D504

.section .text.func_00441C68,"ax",%progbits
.balign 4
.global func_00441C68
.type func_00441C68, %function
func_00441C68:
.Lfunc_00441C68_0:
	push	{r4, r5, r6, lr}
.Lfunc_00441C68_4:
	mov	r4, r0
.Lfunc_00441C68_8:
	mov	r5, r1
.Lfunc_00441C68_c:
	bl	func_0014E348
.size func_00441C68, .-func_00441C68

.section .text.func_0045BECC,"ax",%progbits
.balign 4
.global func_0045BECC
.type func_0045BECC, %function
func_0045BECC:
.Lfunc_0045BECC_0:
	push	{r4, r5, r6, r7, lr}
.Lfunc_0045BECC_4:
	sub	sp, sp, #1024
.Lfunc_0045BECC_8:
	sub	sp, sp, #580
.Lfunc_0045BECC_c:
	bl	func_0014E348
.size func_0045BECC, .-func_0045BECC

.section .text.func_0052A420,"ax",%progbits
.balign 4
.global func_0052A420
.type func_0052A420, %function
func_0052A420:
.Lfunc_0052A420_0:
	push	{r4, lr}
.Lfunc_0052A420_4:
	mov	r4, r0
.Lfunc_0052A420_8:
	mov	r1, #88
.Lfunc_0052A420_c:
	bl	func_00301FBC
.size func_0052A420, .-func_0052A420
```

## Uniqueness, collision, and reference audit

The twelve exported names are pairwise distinct and absent from all 25,452
string leaves (7,963 distinct strings) in the 251 pre-existing top-level JSON
configs. The recursive audit includes owners, aliases, branch destinations,
direct-transfer symbols, identity members, next-global annotations, and
secondary-entry identities; no referenced configured interval overlaps a
selected body. The neutral inventory has no alternate symbol at a selected
start and no nested global entry in a selected body. Selected intervals are
pairwise disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member, and all selected bodies are pairwise
distinct. All twelve selected report entries are unmatched at zero percent,
accounting for all 192 selected body bytes. Semantic comparison of the sole
reached external word against every configured owned literal/adjacent slot
found exactly one established equality class: `ipc_callback_table_65`.

The independently assembled relocatable probe contains one `R_ARM_CALL` in
each owned section at the declared offset and no other relocation. Linking the
probe at the neutral inventory addresses with the four declared primary-entry
identities yielded an exact byte match for every section. No proprietary
resolved address, data value, string, or asset is part of this specification.

## Implementation and validator contract

- Use one AX PROGBITS section named `.text.<function>` per entry, aligned to 4,
  with exactly 16 bytes and one default-visible global function symbol spanning
  that section.
- Preserve ARM state, exactly one `$a` mapping symbol at body offset zero, all
  48 instructions, operand spellings/order, frame setup, return sites, section
  names, local labels, and boundaries shown above.
- Emit exactly one `R_ARM_CALL` relocation in every section at the configured
  offset and against the configured canonical ARM primary-entry symbol. Emit no
  secondary-entry alias, Thumb target, or other relocation.
- Preserve the numeric PC-relative displacement in `func_00136740`. Record its
  semantic relation to the reused `ipc_callback_table_65` identity, but do not
  emit, own, relocate, or expose the external word at target offset 64.
- Emit no adjacent word, literal pool, data mapping symbol, alias, nested entry,
  or extra named symbol in an owned section.
- A validator must cap input at 64 MiB, aggregate executable data at 16 MiB,
  sections at 16,384, symbols and relocations independently at 1,000,000, and
  accept a valid composite with at least 12,000 unrelated sections.
- Validate source SHA-256, owned section type/flags/alignment/size, symbol
  binding/type/visibility/span, ARM mapping symbols, exact instruction/call/
  return/PC-relative/relocation schedule hashes, recursive ownership and
  identity collision rules, call-target mode/alignment/class partition,
  completeness, and rejection of hostile schedule, mode, relocation, duplicate,
  truncation, foreign-symbol, secondary-entry, and misplaced-data fixtures.
