# Probe-verified ARM runtime/helper batch 32

## Scope and provenance

This clean-room specification covers six currently unmatched ARM-state
runtime wrappers totaling 332 executable bytes. The complete schedules below
were independently assembled with GNU Arm Embedded 15.2 for ARMv6K and
compared against target revision `AS_EUR_REV2` on 2026-10-16. After
abstracting the sixteen audited external branch sites as the symbolic
relocations named below, all six bodies and all 332 bytes matched. Every
non-relocation byte also matched directly before normalization.

The wrappers have no literal pools, adjacent data, or embedded private data
values. Eleven external ARM code identities are recorded only by mode,
alignment, equality, relocation form, and call-site-visible traffic. One is
the already specified shared failure entry from runtime batch 31. No callee
address, implementation, raw target instruction encoding, proprietary
source, or private data value is recorded here.

## `func_002DD8FC` — guarded status-to-Boolean wrapper

This 52-byte wrapper saves entry `r3-r5` and LR, retains the current SP in
`r5`, and materializes 276 in `r4`. It first calls the opaque ARM identity
`runtime_guard_enter_32` without explicitly changing `r0-r3`. The return from
that call is ignored.

It then calls `runtime_guarded_operation_32` with 276 in `r0`, 17 in `r1`,
and the current SP in `r2`. It does not explicitly restore `r3` after the
enter call. The SP address initially points to the saved entry-`r3` word, so
the operation can read or replace that word, and the resulting word is later
restored into caller-saved `r3`. The operation result is preserved in `r4`
while `runtime_guard_leave_32` is called with no explicit argument shaping.
The leave-call result is ignored.

Finally, the signed operation result is converted to one when nonnegative and
zero when negative by arithmetic-shifting it right by 31 and adding one.

### Complete exact body schedule

```asm
push {r3,r4,r5,lr}
mov r5,sp
mov r4,#276
bl runtime_guard_enter_32
mov r2,r5
mov r1,#17
mov r0,r4
bl runtime_guarded_operation_32
mov r4,r0
bl runtime_guard_leave_32
asr r0,r4,#31
add r0,r0,#1
pop {r3,r4,r5,pc}
```

The three calls at body offsets `+0x0c`, `+0x1c`, and `+0x24` are
`R_ARM_CALL` relocations in that order.

Exact-schedule cautions:

- Capture SP immediately after the push, and use that saved pointer as the
  third argument of the operation call.
- Materialize 276 before the enter call and 17 only after it; do not assume
  the enter call preserves caller-saved registers beyond what the observed
  schedule explicitly re-establishes.
- Preserve the operation result across the leave call in `r4`.
- Use the displayed arithmetic shift and add, not a comparison or conditional
  move sequence.

## `func_002DD9C4` — aligned stacked-word forwarder

This 56-byte wrapper retains entry `r0`, allocates a 16-byte outgoing stack
area after saving `r4` and LR, and calls the opaque ARM identity
`runtime_aligned_word_forward_32`. Its visible call traffic is:

```text
r0       = entry r0
r1       = 5
r2       = entry r1
r3       = entry r2
stack +0 = entry r3
stack +4 = not written by this wrapper
stack +8 = caller's first stacked word
stack+12 = caller's second stacked word
```

The helper returns the callee's `r0` unchanged. It uses LR as a temporary
address register before the call; the saved return address remains on the
stack.

### Complete exact body schedule

```asm
push {r4,lr}
sub sp,sp,#16
add lr,sp,#24
mov r4,r2
ldm lr,{r2,r12}
add lr,sp,#8
str r3,[sp]
mov r3,r4
stm lr,{r2,r12}
mov r2,r1
mov r1,#5
bl runtime_aligned_word_forward_32
add sp,sp,#16
pop {r4,pc}
```

The call at body offset `+0x2c` is an `R_ARM_CALL` relocation.

Exact-schedule cautions:

- Form the caller-stack address as current `sp + 24`, load both words with
  one `ldm`, and form the outgoing pair address as current `sp + 8`.
- Leave outgoing stack offset 4 untouched. Do not compact or clear the stack
  area.
- Preserve entry `r2` in `r4` before the `ldm` overwrites `r2`.
- Keep the `r3` store before its replacement and the final two argument moves
  in the displayed order.

## `func_002DDE18` — zero-argument status wrapper gamma

This 28-byte wrapper calls `runtime_zero_arg_query_gamma_32` without explicit
argument shaping and destructively reduces its result to the sign bit. A
nonnegative result returns zero after restoring `r4` and PC. A negative result
restores `r4` and LR and tail-branches with one in `r0` to the exact shared
failure identity already named `runtime_failure_raise_entry_31`.

### Complete exact body schedule

```asm
push {r4,lr}
bl runtime_zero_arg_query_gamma_32
lsrs r0,r0,#31
beq return_success
pop {r4,lr}
b runtime_failure_raise_entry_31
return_success:
pop {r4,pc}
```

The operation call at `+0x04` is an `R_ARM_CALL` relocation. The failure tail
branch at `+0x14` is an `R_ARM_JUMP24` relocation. The local success target is
body offset `+0x18`.

Exact-schedule caution: preserve the destructive flag-setting shift and the
split failure epilogue. This wrapper has the same status-reduction shape as
the batch-31 alpha and beta wrappers, but its operation identity is distinct
from both.

## `func_002DE38C` — replace acquired resource, alpha

This 64-byte wrapper receives a writable resource-word pointer in entry `r0`.
It preserves that pointer in `r4`, uses the saved-`r3` stack word as a
zero-initialized output slot, and calls the opaque ARM identity
`runtime_resource_acquire_alpha_32` with the slot address in `r0`. Entry
`r1-r3` are not explicitly reshaped before that call.

The acquisition status is reduced to its sign bit. On a negative status the
wrapper conditionally calls `runtime_failure_raise_entry_31` with one in
`r0`; if that identity returns, execution continues. The wrapper then loads
the old resource word through the entry pointer. If nonzero, it issues SVC 35
with that old word in `r0` and explicitly clears the destination word. It
then installs the acquired output word from the stack slot. A zero old word
branches directly to the installation step. The final pop restores `r3` from
the acquired-output slot rather than restoring entry `r3`.

### Complete exact body schedule

```asm
push {r3,r4,r5,lr}
mov r4,r0
mov r5,#0
mov r0,sp
str r5,[sp]
bl runtime_resource_acquire_alpha_32
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
ldr r0,[r4]
cmp r0,#0
beq install
svc #35
str r5,[r4]
install:
ldr r0,[sp]
str r0,[r4]
pop {r3,r4,r5,pc}
```

The acquisition call at `+0x14` is an `R_ARM_CALL` relocation. The
conditional failure call at `+0x1c` is an `R_ARM_JUMP24` relocation. The
body-local installation target is `+0x34`.

Exact-schedule cautions:

- Zero the saved-`r3` word after forming its address in `r0`; do not allocate
  a separate local word.
- Keep the old-resource load and zero comparison after the conditional
  failure call.
- The SVC is issued only for a nonzero old word. Preserve the explicit clear
  before the unconditional installation load and store.

## `func_002DE490` — replace acquired resource, beta

This 64-byte wrapper is instruction-for-instruction the same local shape as
`func_002DE38C`, including the zero-initialized saved-`r3` output slot, sign
reduction, shared conditional failure call, conditional SVC 35, explicit old
word clear, and final installation. Its acquisition call targets the
distinct opaque ARM identity `runtime_resource_acquire_beta_32`.

### Complete exact body schedule

```asm
push {r3,r4,r5,lr}
mov r4,r0
mov r5,#0
mov r0,sp
str r5,[sp]
bl runtime_resource_acquire_beta_32
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
ldr r0,[r4]
cmp r0,#0
beq install
svc #35
str r5,[r4]
install:
ldr r0,[sp]
str r0,[r4]
pop {r3,r4,r5,pc}
```

The acquisition call at `+0x14` is an `R_ARM_CALL` relocation. The
conditional failure call at `+0x1c` is an `R_ARM_JUMP24` relocation. The
body-local installation target is `+0x34`. All exact-schedule cautions from
the alpha wrapper apply unchanged. The alpha and beta acquisition identities
must not be merged.

## `func_002E0B9C` — three-stage status sequence

This 68-byte wrapper preserves entry `r0-r1` in `r4-r5`, saves the otherwise
unused `r6`, and performs three ordered operation calls. It first calls
`runtime_sequence_begin_32` with no explicit argument shaping. It then
re-establishes entry `r0-r1` and calls `runtime_sequence_apply_32`. Finally it
calls `runtime_sequence_finish_32` without explicit argument shaping after
the preceding sign test.

After each operation, the returned status is destructively reduced to its
sign bit. Negative results from the first two operations conditionally call
`runtime_failure_raise_entry_31` with one in `r0`; execution continues if the
failure identity returns. A nonnegative final status returns zero locally. A
negative final status restores `r4-r6` and LR and tail-branches to the same
failure identity with one in `r0`.

Only `r0-r1` are explicitly restored before the apply call. The wrapper makes
no promise about caller-saved `r2-r3` traffic after a preceding external call.

### Complete exact body schedule

```asm
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl runtime_sequence_begin_32
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
mov r1,r5
mov r0,r4
bl runtime_sequence_apply_32
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
bl runtime_sequence_finish_32
lsrs r0,r0,#31
beq return_success
pop {r4,r5,r6,lr}
b runtime_failure_raise_entry_31
return_success:
pop {r4,r5,r6,pc}
```

The operation calls at `+0x0c`, `+0x20`, and `+0x2c` are `R_ARM_CALL`
relocations. The conditional failure calls at `+0x14` and `+0x28`, and the
failure tail branch at `+0x3c`, are `R_ARM_JUMP24` relocations. The local
success target is `+0x40`.

Target re-audit note: the apply transfer at `+0x20` is an unconditional ARM
`bl`, not an interworking `blx` or a conditional transfer. Its destination is
a four-byte-aligned ARM secondary code entry that does not have a standalone
function-start row in the neutral symbol inventory. GNU assembly must still
spell this transfer `bl runtime_sequence_apply_32`, producing `R_ARM_CALL`.
A target-side audit must not reject this one identity merely because the
secondary entry lacks its own inventory row; the instruction form, aligned
destination, and surrounding ARM instruction stream establish its mode.

Exact-schedule cautions:

- Re-establish `r1` before `r0` for the apply call.
- Do not restore `r0-r1` before the finish call; it follows the second
  destructive sign extraction directly.
- Preserve all three distinct operation identities and the exact mixture of
  linked conditional failure transfers and the final unlinked tail transfer.
- The two local epilogues differ: failure restores LR and branches, while
  success restores PC directly.

## Symbolic code identity ledger

| Identity | Relocation sites | Mode/alignment | Equality or relation | Permitted visible contract |
| --- | --- | --- | --- | --- |
| `runtime_guard_enter_32` | `func_002DD8FC + 0x0c` | ARM code, 4-byte aligned | unique | called before the guarded operation; no explicit `r0-r3` shaping |
| `runtime_guarded_operation_32` | `func_002DD8FC + 0x1c` | ARM code, 4-byte aligned | unique | receives 276, 17, and current SP in `r0-r2`; `r3` is not restored after enter; status retained across leave call |
| `runtime_guard_leave_32` | `func_002DD8FC + 0x24` | ARM code, 4-byte aligned | unique | called after the guarded operation without explicit argument shaping |
| `runtime_aligned_word_forward_32` | `func_002DD9C4 + 0x2c` | ARM code, 4-byte aligned | unique | receives the exact register and outgoing-stack layout described above; result returned unchanged |
| `runtime_zero_arg_query_gamma_32` | `func_002DDE18 + 0x04` | ARM code, 4-byte aligned | unique; distinct from batch-31 alpha and beta queries | called without explicit argument shaping; status tested only for sign |
| `runtime_resource_acquire_alpha_32` | `func_002DE38C + 0x14` | ARM code, 4-byte aligned | distinct from beta and every other batch-32 operation | receives zeroed output-slot pointer in `r0`; entry `r1-r3` not explicitly changed |
| `runtime_resource_acquire_beta_32` | `func_002DE490 + 0x14` | ARM code, 4-byte aligned | distinct from alpha and every other batch-32 operation | same call-site-visible traffic as alpha, but a distinct destination |
| `runtime_sequence_begin_32` | `func_002E0B9C + 0x0c` | ARM code, 4-byte aligned | unique | first ordered operation; no explicit entry-argument shaping |
| `runtime_sequence_apply_32` | `func_002E0B9C + 0x20` | ARM secondary code entry, 4-byte aligned | unique; no standalone function-start inventory row | second ordered operation; receives entry `r0-r1` explicitly restored |
| `runtime_sequence_finish_32` | `func_002E0B9C + 0x2c` | ARM code, 4-byte aligned | unique | third ordered operation; called directly after the second sign extraction |
| `runtime_failure_raise_entry_31` | `func_002DDE18 + 0x14`; `func_002DE38C + 0x1c`; `func_002DE490 + 0x1c`; `func_002E0B9C + 0x14`, `+0x28`, `+0x3c` | ARM code, 4-byte aligned | one shared identity at all six sites; exactly the batch-31 failure identity | receives extracted sign bit one in `r0`; four conditional linked calls and two tail branches in this batch |

The ten new operation identities are pairwise distinct and distinct from the
shared failure identity. An implementation may normalize only the sixteen
observed external branch sites to these named relocations. It must preserve
their displayed order, verify ARM mode and four-byte alignment at every site,
and verify the six-site equality with the already specified batch-31 failure
identity. It must not generalize normalization to other branches. The two SVC
instructions and all body-local branches remain ordinary exact instructions,
not symbolic relocations.

## Exact-probe and overlap audit

| Function | Mode | Body size | Symbolic branches | Local transfers | Probe result |
| --- | --- | ---: | ---: | ---: | --- |
| `func_002DD8FC` | ARM | 52 | 3 ARM calls | 0 | exact complete body after symbolic relocation normalization |
| `func_002DD9C4` | ARM | 56 | 1 ARM call | 0 | exact complete body after symbolic relocation normalization |
| `func_002DDE18` | ARM | 28 | 1 ARM call + 1 ARM tail branch | 1 | exact complete body after symbolic relocation normalization |
| `func_002DE38C` | ARM | 64 | 1 ARM call + 1 conditional ARM call | 1 | exact complete body after symbolic relocation normalization |
| `func_002DE490` | ARM | 64 | 1 ARM call + 1 conditional ARM call | 1 | exact complete body after symbolic relocation normalization |
| `func_002E0B9C` | ARM | 68 | 3 ARM calls + 2 conditional ARM calls + 1 ARM tail branch | 1 | exact complete body after symbolic relocation normalization |
| **Total** |  | **332** | **16** | **4** | **6 / 6 exact; 332 / 332 bytes** |

The independent probe produced exact expected section sizes for all six
functions and zero non-relocation differences over all 332 bytes. GNU
readelf reported `R_ARM_CALL` for each ordinary operation call and
`R_ARM_JUMP24` for every conditional linked failure transfer and unlinked
failure tail branch, matching the required forms above.

The current objdiff report lists all six functions as unmatched. A complete
tracked specification/configuration inventory contains no earlier batch
naming any of them beyond the neutral project symbol inventory. None appears
in concurrent duplicate batch 32 or concurrent IPC batch 30. The six selected
extents are pairwise distinct, so there is zero function or byte overlap with
existing or concurrent work.
