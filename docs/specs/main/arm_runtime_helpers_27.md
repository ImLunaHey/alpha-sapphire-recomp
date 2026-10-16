# Probe-verified ARM runtime/helper batch 27

## Scope and provenance

This clean-room specification covers two currently unmatched ARM-state
runtime leaves totaling 88 executable bytes. Each complete body was
independently assembled from the schedules below and compared byte-for-byte
with target revision `AS_EUR_REV2`; all 88 body bytes matched.

The four adjacent words are opaque symbolic identities. They are specified
only by symbolic identity, function-relative placement, alignment, equality,
and visible use. No private value, absolute address, or target instruction
encoding is recorded here. The independent probe represents every adjacent
word with an `R_ARM_ABS32` relocation. Neither function calls nor branches to
external code.

## `func_002DF13C` — idempotent one-byte enable

This 24-byte leaf loads the address of a writable one-byte state through the
symbolic identity `runtime_once_flag_27`. If the current byte is zero, it
writes one; a nonzero byte is left unchanged. It returns without saving any
registers. On return, `r0` still holds the state address and `r1` holds either
the observed nonzero byte or one on the zero path.

### Complete exact body schedule

```asm
ldr r0,.Lruntime_once_flag_27
ldrb r1,[r0]
cmp r1,#0
moveq r1,#1
strbeq r1,[r0]
bx lr
```

The body ends at relative `+0x18`. One four-byte-aligned adjacent word at
`+0x18` contains an `R_ARM_ABS32` reference to `runtime_once_flag_27`. The
identity denotes writable byte-addressable storage and its observed address
is four-byte aligned. This function accesses only byte offset zero.

Exact-schedule cautions:

- Keep the address in `r0` and the byte in `r1`; there is no scratch-register
  interchange or prologue.
- Both the move and store are conditional on equality. Do not express the
  operation as an unconditional store or a branch.
- Use a byte load and byte store. The surrounding bytes are not part of the
  visible contract.

## `func_002DFB0C` — complemented scalar record initializer

Input `r0` is a writable record base. The helper clears three words, installs
three opaque scalar values and the bitwise complements of two of them, and
returns with `r0` advanced to entry base plus 80. It preserves exactly
`r4-r5`; LR is not saved.

With entry base called `owner`, and the three symbolic scalar words called
`A`, `B`, and `C`, the final visible record values are:

```text
owner[68].u32 = 0
owner[72].u32 = 0
owner[76].u32 = 0
owner[80].u32 = A
owner[84].u32 = B
owner[88].u32 = bitwise_not(A)
owner[92].u32 = bitwise_not(B)
owner[96].u32 = C
return r0 = owner + 80
```

The physical store order is deliberately different from that sorted summary:
offsets 72, 76, 68, 92, 96, then the three-word transfer to offsets 80, 84,
and 88.

### Complete exact body schedule

```asm
push {r4,r5}
mov r1,#0
ldr r5,.Lruntime_initializer_value_b_27
str r1,[r0,#72]
str r1,[r0,#76]
ldr r2,.Lruntime_initializer_value_c_27
str r1,[r0,#68]!
mvn r3,r5
ldr r4,.Lruntime_initializer_value_a_27
str r3,[r0,#24]
str r2,[r0,#28]
add r0,r0,#12
mvn r12,r4
stm r0,{r4,r5,r12}
pop {r4,r5}
bx lr
```

The 64-byte body ends at relative `+0x40`. Three four-byte-aligned adjacent
words follow it in this exact order:

| Relative slot | Symbolic identity | Load/use |
| --- | --- | --- |
| `+0x40` | `runtime_initializer_value_a_27` | loaded into `r4`, stored directly at owner+80 and complemented into owner+88 |
| `+0x44` | `runtime_initializer_value_b_27` | loaded into `r5`, stored directly at owner+84 and complemented into owner+92 |
| `+0x48` | `runtime_initializer_value_c_27` | loaded into `r2`, stored directly at owner+96 |

Each slot contains an `R_ARM_ABS32` relocation to its named opaque scalar
identity. The three observed scalar identities are pairwise distinct and are
also distinct from `runtime_once_flag_27`. They are treated only as integer
words: this helper never branches through or dereferences them. No semantic
alignment of the scalar values is asserted beyond the four-byte alignment of
their adjacent storage slots.

Exact-schedule cautions:

- Preserve only `r4-r5` and do not save LR.
- Load `B` before the first two stores, load `C` before the writeback store,
  and load `A` only after complementing `B`.
- The clear at offset 68 is pre-indexed with writeback. Every following
  offset before the `add` is relative to `owner+68`.
- Complement `B` into `r3` and `A` into `r12`; do not materialize either
  complement in a callee-saved register.
- Keep the non-writeback `stm r0,{r4,r5,r12}` and its ascending-register
  placement. The advanced `r0` is the observable return value.

## Symbolic data identity ledger

| Identity | Placement | Slot alignment | Equality class | Permitted visible contract |
| --- | --- | ---: | --- | --- |
| `runtime_once_flag_27` | `func_002DF13C + 0x18` | 4 | one unique batch-local address identity | writable byte at offset zero; observed address four-byte aligned |
| `runtime_initializer_value_a_27` | `func_002DFB0C + 0x40` | 4 | unique, distinct from all other batch identities | opaque scalar copied once and complemented once |
| `runtime_initializer_value_b_27` | `func_002DFB0C + 0x44` | 4 | unique, distinct from all other batch identities | opaque scalar copied once and complemented once |
| `runtime_initializer_value_c_27` | `func_002DFB0C + 0x48` | 4 | unique, distinct from all other batch identities | opaque scalar copied once |

An implementation may teach the audited target-object generator to normalize
only these four observed function-relative slots to the named `R_ARM_ABS32`
relocations. It must verify the observed pairwise-distinct equality class and
slot placement before replacement, and must not generalize normalization to
other adjacent words.

## Exact-probe and overlap audit

| Function | Mode | Body size | Calls | Adjacent words | Probe result |
| --- | --- | ---: | ---: | ---: | --- |
| `func_002DF13C` | ARM | 24 | 0 | 1 | exact body; symbolic address slot audited |
| `func_002DFB0C` | ARM | 64 | 0 | 3 | exact body; three symbolic scalar slots audited |
| **Total** |  | **88** | **0** | **4** | **2 / 2 exact; 88 / 88 bytes** |

The current objdiff report lists both functions as unmatched. A complete
tracked specification/config inventory contains no earlier batch naming
either function. Neither appears in the concurrent batch-27 duplicate set,
and the concurrent IPC-27 analyst confirmed that its SVC-wrapper selection
contains neither function. The two selected functions are distinct from each
other, giving zero known overlap with existing or concurrent work.
