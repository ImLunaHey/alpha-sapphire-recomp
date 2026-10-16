# Probe-verified ARM runtime/helper batch 25

## Scope and provenance

This clean-room specification covers three currently unmatched ARM-state
leaves totaling 192 executable bytes. Each complete body was independently
assembled from the schedules below and compared byte-for-byte with target
revision `AS_EUR_REV2`; all 192 body bytes matched. The public numeric literal
words described below also matched exactly.

Three adjacent words are opaque symbolic identities. They are intentionally
specified only by symbolic identity, placement, alignment, equality, and use;
neither their target values nor any underlying opaque data are recorded here.
The probe represents those words with `R_ARM_ABS32` relocations. There are no
calls or external branches in this batch.

## `func_002DAC28` — two related descriptor initializers

Input `r0` is a writable owner record. The function initializes two related
embedded records and leaves `r0` advanced to the owner field at offset 2708.
It preserves only `r4`, using a single-word pre-decrement store and matching
post-increment load rather than a push/pop alias.

The stores, in semantic terms, are:

```text
owner[2720].u32 = 1

record_a = owner + 2772
record_a[0].u32  = 4
record_a[4].ptr  = runtime_descriptor_25
record_a[8].u16  = 45056
owner[2782].u8   = 7

record_b = owner + 2784
record_b[0].u32  = 4
record_b[4].ptr  = owner + 2708
record_b[8].u16  = 45057
record_b[10].u8  = 4
```

The apparent one-bit difference between the two halfword tags is formed by an
arithmetic right shift of register `r2` followed by `orr`; retain that exact
expression even though `r2` is known to contain four.

### Complete exact body schedule

```asm
mov r1,#1
str r4,[sp,#-4]!
str r1,[r0,#2720]
add r1,r0,#2048
add r1,r1,#724
mov r12,#45056
ldr r3,.Lruntime_descriptor_25
strh r12,[r1,#8]
mov r2,#4
mov r4,#7
strb r4,[r0,#2782]
strd r2,r3,[r1]
add r1,r0,#2784
orr r12,r12,r2,asr#2
add r0,r0,#2048
strh r12,[r1,#8]
add r0,r0,#660
strb r2,[r1,#10]
str r0,[r1,#4]
str r2,[r1]
ldr r4,[sp],#4
bx lr
```

The 88-byte function ends at relative `+0x58`. Immediately following it at
`+0x58` is one four-byte-aligned word containing an `R_ARM_ABS32`-style
reference to `runtime_descriptor_25`. The load at body `+0x18` addresses that
word. The identity is distinct from `runtime_interpolation_table_25`; this
function only copies it into the owner and never dereferences it.

Exact-schedule cautions:

- The save occurs after `mov r1,#1`; do not move or alias it as `push`.
- Form the first record pointer in two adds, 2048 then 724.
- Store the byte 7 before the paired `strd r2,r3`.
- Form the second record pointer directly from the original `r0` before
  advancing `r0` itself in two adds, 2048 then 660.
- Preserve the store order after the second `strh`: byte, pointer, then word.
- Return with the advanced value in `r0`; this is not a void-style initializer
  that restores the original pointer.

## `func_002DAFBC` — six-word PRNG state initializer

Input `r0` is a writable six-word state record. Inputs `r2` and `r3` are the
first two state words. The function installs them as a pair, installs three
public PRNG constants, clears the final word, and returns with `r0` unchanged.
It saves exactly `r4-r5` and does not save LR.

The three adjacent literal words are placed directly after the function at
relative offsets `+0x30`, `+0x34`, and `+0x38`. The first two, in load order,
are the public MT-family constants `1812433253` and `1566083941`. The third is
the opaque scalar identity `runtime_prng_parameter_c_25`; its value is not
specified. It is loaded as an integer word and copied to state offset 16.

### Complete exact body schedule

```asm
ldr r1,.Lprng_constant_a_25
push {r4,r5}
ldr r12,.Lprng_constant_b_25
ldr r5,.Lprng_constant_c_25
str r1,[r0,#8]
mov r4,#0
str r12,[r0,#12]
str r4,[r0,#20]
str r5,[r0,#16]
strd r2,r3,[r0]
pop {r4,r5}
bx lr
```

Exact-schedule cautions:

- The first literal load precedes the push.
- Keep the non-monotonic store order: offsets 8, 12, 20, 16, then the pair at
  0 and 4.
- Use `r4` as the explicit zero and `r5` for the third constant.
- The `strd` source pair is exactly `r2,r3`.

## `func_002DB1B0` — periodic table interpolation

Input and output are the single-precision value in `s0`. The function scales
the input by public factor 32.0, converts the scaled value to an unsigned
integer using the non-rounding `vcvt` form, retains its low 16 bits, and uses
that value as an eight-byte table-record index. Each record contains a base
float at offset 0 and a coefficient at offset 4. It returns:

```text
scaled = input * 32.0
index = low16(truncate_unsigned(scaled))
fraction = scaled - float(index)
result = table[index].base + fraction * table[index].coefficient
```

No range or NaN checks are performed. In particular, preserving the low-16
mask after conversion is part of the contract; do not replace it with bounds
logic. No core registers are preserved because only caller-saved `r0-r1` are
used.

### Complete exact body schedule

```asm
vldr s1,.Linterp_scale_25
ldr r1,.Linterp_table_25
vmul.f32 s1,s0,s1
vcvt.u32.f32 s0,s1
vmov r0,s0
uxth r0,r0
vmov s0,r0
add r0,r1,r0,lsl#3
vldr s2,[r0,#4]
vcvt.f32.u32 s0,s0
vsub.f32 s1,s1,s0
vldr s0,[r0]
vmla.f32 s0,s1,s2
bx lr
```

The 56-byte body ends at relative `+0x38`. A four-byte IEEE-754 32.0 literal
is adjacent at `+0x38`, followed at `+0x3C` by a four-byte-aligned
`R_ARM_ABS32`-style reference to `runtime_interpolation_table_25`. The first
two instructions load those exact adjacent words. The table identity is
distinct from `runtime_descriptor_25`; it is read as eight-byte records at
`8*index` and `8*index+4`, with single-precision word accesses and minimum
four-byte alignment. No table contents or extent beyond those dynamically
selected record accesses are specified.

Exact-schedule cautions:

- Load the scale before the table address.
- Reuse `s0` first for the unsigned integer encoding, then move that encoding
  through `r0`, mask it with `uxth`, and move it back to `s0`.
- Load the coefficient before converting the masked index back to float.
- Use `vsub` for the fraction and the fused schedule spelling `vmla.f32` for
  the final accumulate; do not reorder the base load.

## Literal identity and relocation ledger

| Identity | Placement | Alignment | Equality class | Permitted use |
| --- | --- | ---: | --- | --- |
| `runtime_descriptor_25` | `func_002DAC28 + 0x58` | 4 | one batch-local word; distinct from the table identity | copied to owner offset 2776; never read through here |
| public PRNG constants | `func_002DAFBC + 0x30/+0x34` | 4 | two distinct public numeric words | stored at state offsets 8/12 |
| `runtime_prng_parameter_c_25` | `func_002DAFBC + 0x38` | 4 | one batch-local scalar word; distinct from the two address identities | copied to state offset 16; never dereferenced here |
| public scale 32.0 | `func_002DB1B0 + 0x38` | 4 | public numeric word | VFP single-precision scale load |
| `runtime_interpolation_table_25` | `func_002DB1B0 + 0x3C` | 4 | one batch-local word; distinct from descriptor identity | base/coefficient float reads at `8*index` and `8*index+4` |

An implementation may teach the audited target-object generator to normalize
the three private adjacent words to these named symbolic relocations.
That normalization must be limited to the exact function-relative slots above
and must verify each slot's observed equality class before replacement.

## Exact-probe and overlap audit

| Function | Mode | Body size | Calls | Probe result |
| --- | --- | ---: | ---: | --- |
| `func_002DAC28` | ARM | 88 | 0 | exact body; symbolic adjacent address slot audited |
| `func_002DAFBC` | ARM | 48 | 0 | exact body and two public words; symbolic adjacent scalar slot audited |
| `func_002DB1B0` | ARM/VFPv2 | 56 | 0 | exact body and public scale; symbolic adjacent table slot audited |
| **Total** |  | **192** | **0** | **3 / 3 exact** |

The current objdiff report lists all three functions as unmatched. A full
repository spec/config inventory found no earlier implementation naming any
of them. The concurrent batch-25 duplicate and IPC inventories also name none
of them. The selected set is pairwise distinct and therefore has zero known
overlap with existing or concurrently prepared work.
