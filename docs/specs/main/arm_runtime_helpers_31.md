# Probe-verified ARM runtime/helper batch 31

## Scope and provenance

This clean-room specification covers five currently unmatched ARM-state
runtime wrappers totaling 160 executable bytes. The complete schedules below
were independently assembled with GNU Arm Embedded 15.2 for ARMv6K and
compared against target revision `AS_EUR_REV2` on 2026-10-16. After
abstracting the ten audited branch sites as the symbolic relocations named
below, all five bodies and all 160 bytes matched. Every non-relocation byte
also matched directly before normalization.

The wrappers have no literal pools, adjacent data, or embedded private
constants. Six external code identities are recorded only by instruction
mode, minimum alignment, equality or relative-entry relationship, relocation
form, and call-site-visible traffic. No callee address, implementation, raw
target instruction encoding, proprietary source, or private data value is
recorded here.

## `func_002DDA5C` — word-output pair query

This 36-byte wrapper accepts two payload words in entry `r0-r1`. It copies
entry `r1` to call argument `r2`, copies entry `r0` to call argument `r1`,
saves entry `r3` with LR, and passes the address of the saved-`r3` stack word
as call argument `r0`. Call argument `r3` remains the entry value. It then
calls the opaque ARM identity `runtime_pair_out_query_31`.

The call result is shifted right by 31 with flags, leaving its sign bit as
zero or one in `r0`. When that bit is one, the wrapper conditionally calls
`runtime_failure_raise_entry_31` with that one in `r0`. Whether the failure
call is skipped or returns, the wrapper loads the output word from the stack
slot into `r0` and returns while discarding that slot and restoring PC from
the saved LR word.

### Complete exact body schedule

```asm
mov r2,r1
mov r1,r0
push {r3,lr}
mov r0,sp
bl runtime_pair_out_query_31
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
ldr r0,[sp]
pop {r3,pc}
```

The operation call at body offset `+0x10` is an `R_ARM_CALL` relocation. The
conditional failure call at `+0x18` is an `R_ARM_JUMP24` relocation as emitted
by the pinned GNU assembler.

Exact-schedule cautions:

- Preserve the two argument moves in the displayed order before saving the
  stack slot.
- The output pointer is exactly the current SP after `push {r3,lr}`; do not
  allocate a separate local or save a different register set.
- The sign test is the destructive, flag-setting `lsrs r0,r0,#31`, not a
  comparison or bit test. The failure identity therefore sees `r0 == 1`.
- Keep the conditional transfer as linked `blne`. The output load still
  follows it and is observable if that identity returns.

## `func_002DDBAC` — zero-argument status wrapper alpha

This 28-byte wrapper saves `r4` and LR, calls the opaque ARM identity
`runtime_zero_arg_query_alpha_31`, and reduces the returned status to its sign
bit with a flag-setting shift. A nonnegative status returns zero after
restoring `r4` and PC. A negative status restores `r4` and LR and tail-branches
to `runtime_failure_raise_entry_31` with one in `r0`, allowing that identity
to return directly to this wrapper's caller. The wrapper performs no explicit
argument setup before the operation call.

### Complete exact body schedule

```asm
push {r4,lr}
bl runtime_zero_arg_query_alpha_31
lsrs r0,r0,#31
beq return_success
pop {r4,lr}
b runtime_failure_raise_entry_31
return_success:
pop {r4,pc}
```

The operation call at body offset `+0x04` is an `R_ARM_CALL` relocation; the
failure tail branch at `+0x14` is an `R_ARM_JUMP24` relocation.

Exact-schedule cautions:

- Do not replace the sign-bit shift with `cmp`, and do not preserve the
  operation's original status value.
- The failure path must restore LR explicitly and use an unlinked tail branch.
- The success path uses the separate `pop {r4,pc}` at the local branch target.

## `func_002DDBC8` — zero-argument status wrapper beta

This 28-byte wrapper is instruction-for-instruction the same shape as
`func_002DDBAC`, but its first call targets the distinct opaque ARM identity
`runtime_zero_arg_query_beta_31`. The two operation identities must not be
merged. Its sign reduction, success return, and shared failure tail dispatch
are otherwise identical.

### Complete exact body schedule

```asm
push {r4,lr}
bl runtime_zero_arg_query_beta_31
lsrs r0,r0,#31
beq return_success
pop {r4,lr}
b runtime_failure_raise_entry_31
return_success:
pop {r4,pc}
```

The operation call at body offset `+0x04` is an `R_ARM_CALL` relocation; the
failure tail branch at `+0x14` is an `R_ARM_JUMP24` relocation. The exact
schedule cautions for the alpha wrapper apply unchanged.

## `func_002DE3CC` — five-argument status wrapper

This 36-byte wrapper preserves entry `r0-r3` as the first four call arguments
and forwards the caller's first stacked word as the fifth argument. It saves
entry `r3` with LR, loads the word at `sp + 8` after that push, and writes it
over the saved-`r3` word at current `sp`. It then calls the opaque ARM identity
`runtime_five_arg_query_31`.

The operation result is reduced to its sign bit in `r0`. A nonnegative result
returns zero. A negative result restores LR and tail-branches to
`runtime_failure_raise_entry_31` with one in `r0`. On either local exit path,
the restored `r3` is the forwarded fifth-argument word rather than entry
`r3`; `r3` is caller-saved under the ABI.

### Complete exact body schedule

```asm
push {r3,lr}
ldr r12,[sp,#8]
str r12,[sp]
bl runtime_five_arg_query_31
lsrs r0,r0,#31
beq return_success
pop {r3,lr}
b runtime_failure_raise_entry_31
return_success:
pop {r3,pc}
```

The operation call at body offset `+0x0c` is an `R_ARM_CALL` relocation; the
failure tail branch at `+0x1c` is an `R_ARM_JUMP24` relocation.

Exact-schedule cautions:

- Use `r12` for the stacked-word load and preserve the precise load-then-store
  sequence. Do not address the caller's stack before the push.
- The store intentionally replaces the saved `r3`; do not allocate a new
  stack word or attempt to preserve entry `r3` across the wrapper.
- Keep the same destructive sign shift and split pop/branch failure epilogue
  used by the two preceding wrappers.

## `func_002DEEEC` — signed-byte output query

This 32-byte wrapper accepts one payload word in entry `r0`. It copies that
word to call argument `r1`, saves entry `r3` with LR, and passes the address of
the saved-`r3` word as call argument `r0`; entry `r2-r3` remain otherwise
unchanged. It calls the opaque ARM identity `runtime_signed_byte_query_31`.

The operation result is reduced to its sign bit with flags. When the bit is
one, the wrapper conditionally calls the same shared ARM identity
`runtime_failure_raise_entry_31` used by the other four wrappers. It then
signed-loads the low byte of the output stack word into `r0` and returns by
restoring PC while discarding the slot.

### Complete exact body schedule

```asm
mov r1,r0
push {r3,lr}
mov r0,sp
bl runtime_signed_byte_query_31
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
ldrsb r0,[sp]
pop {r3,pc}
```

The operation call at body offset `+0x0c` is an `R_ARM_CALL` relocation. The
conditional failure call at `+0x14` is an `R_ARM_JUMP24` relocation as emitted
by the pinned GNU assembler.

Exact-schedule cautions:

- Copy entry `r0` before the push, and form the output pointer only afterward.
- Keep the destructive sign shift and linked conditional failure transfer.
- The final result is a sign-extending byte load (`ldrsb`), not a word load or
  zero-extending byte load.
- This wrapper's conditional linked transfer resolves to exactly the same
  destination as all four other failure transfers in this batch.

## Symbolic code identity ledger

| Identity | Relocation sites | Mode/alignment | Equality or relation | Permitted visible contract |
| --- | --- | --- | --- | --- |
| `runtime_pair_out_query_31` | `func_002DDA5C + 0x10` | ARM code, 4-byte aligned | unique operation identity | receives output-word pointer in `r0`, entry `r0-r1` remapped to `r1-r2`, and entry `r3` retained |
| `runtime_zero_arg_query_alpha_31` | `func_002DDBAC + 0x04` | ARM code, 4-byte aligned | distinct from beta and every other operation identity | called without explicit argument shaping; returns a status tested only for its sign |
| `runtime_zero_arg_query_beta_31` | `func_002DDBC8 + 0x04` | ARM code, 4-byte aligned | distinct from alpha and every other operation identity | same call-site-visible traffic as alpha, but a distinct destination |
| `runtime_five_arg_query_31` | `func_002DE3CC + 0x0c` | ARM code, 4-byte aligned | unique operation identity | receives entry `r0-r3` and the caller's first stacked word as its fifth argument |
| `runtime_signed_byte_query_31` | `func_002DEEEC + 0x0c` | ARM code, 4-byte aligned | unique operation identity | receives output-byte pointer in `r0`, entry `r0` in `r1`, and entry `r2-r3` retained |
| `runtime_failure_raise_entry_31` | `func_002DDA5C + 0x18`; `func_002DDBAC + 0x14`; `func_002DDBC8 + 0x14`; `func_002DE3CC + 0x1c`; `func_002DEEEC + 0x14` | ARM code, 4-byte aligned | one shared identity at all five sites | receives the extracted sign bit one in `r0`; conditionally linked from both output wrappers and tail-called by the three status wrappers |

An implementation may teach the audited target-object generator to normalize
only these ten observed branch sites to the named relocations. It must verify
the observed ARM mode and alignment at every site and the five-site equality
of the shared failure entry. There is no distinct related body entry in this
batch. It must not generalize normalization to any other branch.

## Exact-probe and overlap audit

| Function | Mode | Body size | Symbolic branches | Adjacent words | Probe result |
| --- | --- | ---: | ---: | ---: | --- |
| `func_002DDA5C` | ARM | 36 | 1 ARM call + 1 conditional ARM call | 0 | exact complete body after symbolic relocation normalization |
| `func_002DDBAC` | ARM | 28 | 1 ARM call + 1 ARM tail branch | 0 | exact complete body after symbolic relocation normalization |
| `func_002DDBC8` | ARM | 28 | 1 ARM call + 1 ARM tail branch | 0 | exact complete body after symbolic relocation normalization |
| `func_002DE3CC` | ARM | 36 | 1 ARM call + 1 ARM tail branch | 0 | exact complete body after symbolic relocation normalization |
| `func_002DEEEC` | ARM | 32 | 1 ARM call + 1 conditional ARM call | 0 | exact complete body after symbolic relocation normalization |
| **Total** |  | **160** | **10** | **0** | **5 / 5 exact; 160 / 160 bytes** |

The current objdiff report lists all five functions as unmatched. A complete
tracked specification/configuration inventory contains no earlier batch
naming any of them beyond the neutral project symbol inventory. None appears
in concurrent IPC batch 29 or concurrent duplicate batch 31. The selected
function names and extents are pairwise distinct, so there is zero function or
byte overlap with existing or concurrent work.
