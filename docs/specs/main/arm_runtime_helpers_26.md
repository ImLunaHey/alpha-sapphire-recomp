# Probe-verified ARM runtime/helper batch 26

## Scope and provenance

This clean-room specification covers two currently unmatched ARM-state
helpers totaling 108 executable bytes. Both complete bodies were independently
assembled from the schedules below, linked with symbolic ARM call
relocations, and compared byte-for-byte with target revision `AS_EUR_REV2`.
All 108 body bytes matched.

The two external callees are opaque code identities. They are specified only
by symbolic identity, instruction mode, alignment, equality, and the argument
traffic visible at each call site. No callee address or implementation is part
of this specification. Neither function has a literal pool or adjacent data.

## `func_002DBE58` — stacked fourth-argument adapter

This 28-byte wrapper preserves the entry values of `r0-r3` in one four-word
stack block, then preserves `r4` and LR in a second block. It calls
`runtime_stacked_argument_helper_26` with:

```text
r0 = entry r0
r1 = entry r1
r2 = entry r2, reloaded from the saved argument block
r3 = pointer to saved entry r3
```

The pointer in `r3` also makes caller-supplied stack arguments beyond `r3`
contiguous after that saved word. The wrapper returns the callee's `r0`
unchanged. Its unusual epilogue restores `r4` first, then loads PC from the
saved LR while discarding the remaining saved-argument block in the same
post-indexed load.

### Complete exact body schedule

```asm
push {r0-r3}
push {r4,lr}
add r3,sp,#20
ldr r2,[sp,#16]
bl runtime_stacked_argument_helper_26
pop {r4}
ldr pc,[sp],#20
```

The call at body offset `+0x10` is an `R_ARM_CALL` relocation to
`runtime_stacked_argument_helper_26`.

Exact-schedule cautions:

- Keep the two pushes separate and in this order; the stack offsets depend on
  the second push.
- Do not reload `r0` or `r1`; pushing them does not alter their live values.
- Form `r3` before reloading `r2`.
- Preserve the single-register `pop {r4}` followed by the post-indexed PC
  load. A conventional multi-register pop does not encode the same epilogue.

## `func_002DBE74` — staged three-row record expansion

This 80-byte helper takes an owner record in `r0` and a source pointer in
`r1`. It allocates 40 bytes of temporary stack storage and invokes
`runtime_record_expander_26` with:

```text
r0 = entry source pointer
r1 = owner + 24
r2 = temporary stack record
```

The callee may write the first three words of the expanded record directly at
owner offset 24 and writes the remaining words into the temporary record.
After the call, this function copies three ordered groups of three 32-bit
words from temporary offsets 0, 12, and 24 to owner offsets 36, 48, and 60.
The final four bytes of the 40-byte temporary area are not read here. The
callee return value is ignored; the wrapper does not define a distinct return
value after its copy sequence.

### Complete exact body schedule

```asm
push {r4,lr}
mov r4,r0
sub sp,sp,#40
mov r0,r1
mov r2,sp
add r1,r4,#24
bl runtime_record_expander_26
ldm sp,{r0,r1,r2}
add r3,r4,#36
stm r3,{r0,r1,r2}
add r3,sp,#12
ldm r3,{r0,r1,r2}
add r3,r4,#48
add r4,r4,#60
stm r3,{r0,r1,r2}
add r3,sp,#24
ldm r3,{r0,r1,r2}
stm r4,{r0,r1,r2}
add sp,sp,#40
pop {r4,pc}
```

The call at body offset `+0x18` is an `R_ARM_CALL` relocation to
`runtime_record_expander_26`.

Exact-schedule cautions:

- Allocate exactly 40 bytes even though this wrapper reads only 36 of them.
- Move the entry source into `r0` before forming `r2` and `r1`, in the shown
  order.
- Use non-writeback `ldm` and `stm` forms throughout.
- Preserve the interleaving of temporary-source and owner-destination address
  calculations. In particular, advance saved owner register `r4` to offset 60
  before storing the offset-48 group.
- Use `r0-r2` as the three-word transfer set and `r3` as the address scratch.

## Symbolic call identity ledger

| Identity | Relocation site | Mode/alignment | Equality class | Permitted visible contract |
| --- | --- | --- | --- | --- |
| `runtime_stacked_argument_helper_26` | `func_002DBE58 + 0x10` | ARM code, 4-byte aligned | one batch-local call target; distinct from the record expander | called with entry `r0-r2` and `r3` pointing at the saved fourth argument; result forwarded in `r0` |
| `runtime_record_expander_26` | `func_002DBE74 + 0x18` | ARM code, 4-byte aligned | one batch-local call target; distinct from the stacked-argument helper | called with source, owner+24, and a writable 40-byte temporary record |

An implementation may teach the audited target-object generator to normalize
only these two observed branch sites to the named `R_ARM_CALL` relocations.
It must verify that the two observed destinations are distinct ARM targets and
must not generalize normalization to other branches.

## Exact-probe and overlap audit

| Function | Mode | Body size | Calls | Adjacent words | Probe result |
| --- | --- | ---: | ---: | ---: | --- |
| `func_002DBE58` | ARM | 28 | 1 | 0 | exact body after symbolic call link |
| `func_002DBE74` | ARM | 80 | 1 | 0 | exact body after symbolic call link |
| **Total** |  | **108** | **2** | **0** | **2 / 2 exact; 108 / 108 bytes** |

The current objdiff report lists both functions as unmatched. A full public
spec/config inventory contains no earlier implementation naming either one.
Neither appears in the concurrent batch-26 duplicate set
(`func_001AE6D0`, `func_001B4CD0`, `func_001BB2D0`, `func_001B047C`,
`func_001B6A7C`, `func_001BD07C`), and neither belongs to the concurrently
selected IPC family. The two functions are distinct from each other, giving
zero known overlap with existing or concurrent work.
