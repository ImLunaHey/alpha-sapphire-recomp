# Probe-verified ARM runtime/leaf-helper batch 36

## Scope and provenance

This clean-room specification covers five still-unmatched ARM-state runtime
and leaf helpers totaling 684 executable bytes. The complete schedules below
were independently assembled with GNU Arm Embedded 15.2 for ARMv6K and
compared against target revision `AS_EUR_REV2` on 2026-10-16. All five
complete bodies and all 684 bytes matched directly, without normalization.

The evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and an
independent exact-schedule probe. These helpers have no direct external
branches, relocations, literal pools, adjacent data, or embedded private data
identities. No private absolute address, raw byte sequence, instruction
encoding, proprietary source, or private data value is recorded here.

All schedules are ARM state under this common preamble:

```asm
.syntax unified
.arch armv6k
.arm
```

## `func_002F39D4` — aligned two-region layout update

This 116-byte leaf updates three words at offsets 0, 4, and 8 of the object
in entry `r0`. Entry `r1` supplies an element count. The helper forms a region
size as twice that count plus 16. It computes any padding needed to bring the
old offset-4 value up to 32, rounds that padding and the first region boundary
to 32-byte alignment, and advances the offset-0 word from its own aligned
boundary by the resulting two-region span. Offset 4 is restored to its entry
value after a temporary store of 32. Offset 8 is first raised to at least 32
and is finally raised again to at least the entry offset-4 value, using
unsigned comparisons.

### Complete exact body schedule

```asm
lsl r2,r1,#1
ldr r1,[r0,#4]
mov r3,#0
add r2,r2,#16
cmp r1,#32
rsbcc r3,r1,#32
add r3,r3,#31
bic r3,r3,#31
add r3,r3,r2
add r3,r3,#31
bic r3,r3,#31
add r3,r3,r2
mov r2,#32
str r2,[r0,#4]
ldr r12,[r0,#8]
cmp r12,#32
movcs r2,r12
str r2,[r0,#8]
ldr r2,[r0]
str r1,[r0,#4]
add r2,r2,#31
bic r2,r2,#31
add r2,r2,r3
str r2,[r0]
ldr r2,[r0,#8]
cmp r2,r1
movcs r1,r2
str r1,[r0,#8]
bx lr
```

Preserve both unsigned conditional moves and the temporary offset-4 store.
The two distinct align-up sequences and their ordering are part of the exact
contract; do not algebraically consolidate them.

## `func_002F3ED8` — sparse selected-slot invalidation

This 140-byte leaf interprets entry `r1` as a selection mask. For each listed
bit that is present, it writes the all-ones sentinel to the corresponding word
slot relative to entry `r0`. Unselected slots retain their prior contents. The
slot order is normative: the selections for 2048 and 1024 are processed in
that order even though their numeric order is reversed.

The bit-to-slot mapping is:

| Selection bit | Destination offset |
| ---: | ---: |
| 1 | 0 |
| 2 | 4 |
| 4 | 8 |
| 8 | 12 |
| 16 | 16 |
| 32 | 20 |
| 128 | 24 |
| 256 | 28 |
| 512 | 32 |
| 2048 | 36 |
| 1024 | 40 |

### Complete exact body schedule

```asm
mov r3,#1
bics r3,r3,r1
mvn r2,#0
mov r3,#2
streq r2,[r0]
bics r3,r3,r1
mov r3,#4
streq r2,[r0,#4]
bics r3,r3,r1
mov r3,#8
streq r2,[r0,#8]
bics r3,r3,r1
mov r3,#16
streq r2,[r0,#12]
bics r3,r3,r1
mov r3,#32
streq r2,[r0,#16]
bics r3,r3,r1
mov r3,#128
streq r2,[r0,#20]
bics r3,r3,r1
mov r3,#256
streq r2,[r0,#24]
bics r3,r3,r1
mov r3,#512
streq r2,[r0,#28]
bics r3,r3,r1
mov r3,#2048
streq r2,[r0,#32]
bics r3,r3,r1
mov r3,#1024
streq r2,[r0,#36]
bics r1,r3,r1
streq r2,[r0,#40]
bx lr
```

Each `bics` both computes `bit & ~mask` and supplies the condition for the
following store. Retain the intervening materialization of the next bit: it
does not alter flags. The final test deliberately writes its result to `r1`
rather than `r3`.

## `func_002F9230` — commit staged record words

This 128-byte leaf first stores entry `r1` into the offset-8 field of the
object in entry `r0`. It then commits 15 staged words within the entry-`r1`
record by copying each word to the word immediately following it. The copy
order is exact and is not monotonically increasing: the offset-108 through
offset-172 group precedes the offset-76 and offset-92 pair.

### Complete exact body schedule

```asm
str r1,[r0,#8]
ldr r0,[r1,#12]
str r0,[r1,#16]
ldr r0,[r1,#28]
str r0,[r1,#32]
ldr r0,[r1,#44]
str r0,[r1,#48]
ldr r0,[r1,#60]
str r0,[r1,#64]
ldr r0,[r1,#108]
str r0,[r1,#112]
ldr r0,[r1,#124]
str r0,[r1,#128]
ldr r0,[r1,#140]
str r0,[r1,#144]
ldr r0,[r1,#156]
str r0,[r1,#160]
ldr r0,[r1,#172]
str r0,[r1,#176]
ldr r0,[r1,#76]
str r0,[r1,#80]
ldr r0,[r1,#92]
str r0,[r1,#96]
ldr r0,[r1,#188]
str r0,[r1,#192]
ldr r0,[r1,#204]
str r0,[r1,#208]
ldr r0,[r1,#220]
str r0,[r1,#224]
ldr r0,[r1,#236]
str r0,[r1,#240]
bx lr
```

The entry `r0` value is intentionally destroyed by the first staged-word
load. Preserve the scalar load/store pairs and the displayed ordering rather
than replacing them with a loop or multiple-transfer sequence.

## `func_002FF24C` — unsigned two-word divide-by-ten primitive

This 152-byte arithmetic runtime helper accepts an unsigned two-word value in
entry `r1:r0`. It returns the quotient by ten in `r1:r0` and the remainder in
`r3:r2`. The implementation obtains an approximate quotient through a fixed
sequence of cross-word shifts and additions, doubles five times the quotient
candidate to form ten times that candidate, and corrects either the remainder
or the quotient depending on the signed result of the final two-word
subtraction. The early conditional return and its restoration set are
normative.

### Complete exact body schedule

```asm
push {r4,r5,lr}
subs r2,r0,#10
lsr lr,r0,#2
sbcs r3,r1,#0
orr lr,lr,r1,lsl #30
subs r0,r0,lr
sbc r1,r1,r1,lsr #2
lsr lr,r0,#4
orr lr,lr,r1,lsl #28
adds r0,r0,lr
adc r1,r1,r1,lsr #4
lsr lr,r0,#8
orr lr,lr,r1,lsl #24
adds r0,r0,lr
adc r1,r1,r1,lsr #8
lsr lr,r0,#16
orr lr,lr,r1,lsl #16
adds r0,r0,lr
adc r1,r1,r1,lsr #16
adds r0,r0,r1
adc r1,r1,#0
lsr r0,r0,#3
orr r0,r0,r1,lsl #29
lsr r1,r1,#3
adds r5,r0,r0,lsl #2
lsl r4,r1,#2
orr r4,r4,r0,lsr #30
adc r4,r4,r1
adds r5,r5,r5
adc r4,r4,r4
subs r2,r2,r5
sbcs r3,r3,r4
mov r3,#0
addmi r2,r2,#10
popmi {r4,r5,pc}
adds r0,r0,#1
adc r1,r1,#0
pop {r4,r5,pc}
```

Flag propagation across every low/high word pair is essential. In particular,
the non-flag-setting `sbc` operations in the approximation phase and the
flag-setting `sbcs` in the correction phase must remain distinct. The
unconditional zeroing of `r3` occurs before either return path.

## `func_0030F584` — derive and install a four-bit linked-record field

This 148-byte leaf resolves a relative link rooted at the object reached
through entry `r0`. It reads the low byte of that root object's offset-8 word
as a mode. A null first link, or mode zero or one, selects the default derived
value zero. For other modes, the linked record is used directly unless its
header has the distinguished indirect-record tag; that tag causes a second
relative link at offset 28 to be resolved. The word at offset 40 of the final
record is decremented to obtain the derived value.

Finally, the helper updates the word at offset 40 of the first resolved
record: bits 16 through 19 are cleared and replaced by the low four bits of
the derived value. All other bits are preserved. The relative links use the
address of their own displacement word as the base, and a zero displacement
resolves to null.

### Complete exact body schedule

```asm
push {r4}
ldr r1,[r0]
mov r12,#0
mov r3,r12
ldr r0,[r0]
ldr r2,[r1,#4]!
cmp r2,#0
addne r2,r2,r1
moveq r2,r3
ldr r0,[r0,#8]
ldr r4,[r2,#8]
add r1,r2,#8
and r0,r0,#255
cmp r4,#0
addne r1,r1,r4
moveq r1,r3
cmp r1,#0
cmpne r0,#1
cmpne r0,#0
beq 1f
ldr r0,[r1]
cmp r0,#0x20000004
bne 2f
ldr r0,[r1,#28]!
cmp r0,#0
addne r3,r0,r1
mov r1,r3
2:
ldr r0,[r1,#40]
sub r12,r0,#1
1:
add r0,r2,#16
lsl r2,r12,#28
ldr r1,[r0,#24]
bic r1,r1,#0xf0000
orr r1,r1,r2,lsr #12
str r1,[r0,#24]
pop {r4}
bx lr
```

Preserve both duplicated entry-root loads, the destructive pre-indexed link
loads, and the three-comparison gate. The shift pair is the exact mechanism
that truncates the derived value to four bits before positioning it.

## Branch, data, and equality ledger

There are no direct external branch sites in this batch and therefore no
`R_ARM_CALL`, `R_ARM_JUMP24`, or interworking relocation identities to name.
Every branch is body-local, and every ordinary exit is a local `bx lr` or a
register-list return to the saved LR value.

There are no PC-relative literal loads, embedded words, adjacent pool slots,
or data relocations in any of the five sections. Consequently this batch
introduces no symbolic data equality classes and asserts no cross-batch data
identity. The masks, offsets, alignment quantities, divisors, and tag shown in
the schedules are instruction operands, not target data identities.

## Exact-probe and overlap audit

| Function | Mode | Body bytes | External relocations | Probe result |
| --- | --- | ---: | ---: | --- |
| `func_002F39D4` | ARM | 116 | 0 | exact complete body |
| `func_002F3ED8` | ARM | 140 | 0 | exact complete body |
| `func_002F9230` | ARM | 128 | 0 | exact complete body |
| `func_002FF24C` | ARM | 152 | 0 | exact complete body |
| `func_0030F584` | ARM | 148 | 0 | exact complete body |
| **Total** |  | **684** | **0** | **5 / 5 exact; 684 / 684 bytes** |

The probe emitted one independently assembled section per helper. Direct
section comparison found zero differences across all 684 executable bytes,
and readelf reported no relocations anywhere in the probe object. The sizes
above exactly equal the function extents in the current report; no trailing
data was included or omitted.

The current objdiff report lists all five helpers as zero-percent matched.
The complete tracked inventory contains none of their names, and their body
extents are pairwise disjoint. Duplicate batch 37 and IPC batch 33 explicitly
reserved different candidates and excluded all five names above. Existing
runtime batch 35, duplicate batch 36, IPC batch 32, and all earlier tracked
specifications contain none of these functions. Thus there is zero known
function, executable-byte, or adjacent-data overlap with another clean-room
batch.
