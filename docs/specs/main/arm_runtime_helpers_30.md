# Probe-verified ARM runtime/helper batch 30

## Scope and provenance

This clean-room specification covers five currently unmatched ARM-state
helpers totaling 180 executable bytes. The complete schedules below were
independently assembled with GNU Arm Embedded 15.2 for ARMv6K and compared
against target revision `AS_EUR_REV2` on 2026-10-16. After abstracting the
four audited branch sites as the symbolic relocations named below, all five
bodies and all 180 bytes matched. All non-relocation bytes also matched
directly before normalization.

The helpers have no literal pools or adjacent data. Four external code
identities are recorded only by instruction mode, minimum alignment,
equality, relocation form, and call-site-visible traffic. No callee address,
implementation, raw target instruction encoding, proprietary source, or
private data value is recorded here.

## `func_002E6E14` — install an all-ones sentinel

This 12-byte leaf takes a writable word pointer in entry `r0`, stores the
all-ones sentinel to offset zero, and returns with the same sentinel still in
`r1`. It does not alter `r0`, save registers, call another function, or
produce a separately materialized result in `r0`.

### Complete exact body schedule

```asm
mvn r1,#0
str r1,[r0]
bx lr
```

Exact-schedule caution: form the sentinel with `mvn r1,#0`; do not substitute
a literal load or materialize it in `r0`.

## `func_002E6E40` — bounded variadic forwarder, save-after-count form

This 44-byte wrapper interprets entry `r2` as a zero-based bound and entry
`r1` as an unsigned requested count. It retains entry `r0` as the first call
argument, copies entry `r2` to `r12`, saves entry `r0-r3`, increments `r12`,
then saves `r4` and LR. Entry `r3` is recovered from the saved register area
into call argument `r2`; call argument `r3` becomes the entry stack pointer,
which exposes the caller's stacked arguments. If unsigned entry `r1` is
greater than `entry_r2 + 1`, call argument `r1` is clamped to that bound.
Otherwise it remains unchanged.

The helper calls the opaque Thumb identity
`runtime_variadic_forward_alpha_30`. Its result in `r0` is returned unchanged.
The epilogue restores `r4`, loads PC from the saved LR word, and advances SP
by twenty bytes in one post-indexed load, thereby discarding the saved entry
`r0-r3` rather than restoring them.

### Complete exact body schedule

```asm
mov r12,r2
push {r0-r3}
add r12,r12,#1
push {r4,lr}
cmp r1,r12
ldr r2,[sp,#20]
add r3,sp,#24
movhi r1,r12
blx runtime_variadic_forward_alpha_30
pop {r4}
ldr pc,[sp],#20
```

The call at body offset `+0x20` is an `R_ARM_CALL` relocation to
`runtime_variadic_forward_alpha_30`.

Exact-schedule cautions:

- Copy entry `r2` before the first push, and increment `r12` only after that
  push. This ordering distinguishes the helper from the next wrapper.
- Keep the unsigned `movhi` clamp. Do not branch around an unconditional
  move or use a signed condition.
- Preserve the exact `r2` stack load and `r3` entry-stack-pointer formation.
- The external transfer is immediate `blx` to a Thumb identity.
- The final instruction is a post-indexed `ldr pc,[sp],#20`, not a
  multi-register pop.

## `func_002E6E8C` — bounded variadic forwarder, save-before-count form

This 44-byte wrapper has the same externally visible argument shaping,
unsigned clamp, Thumb call, return value, and epilogue as
`func_002E6E40`. Its exact distinction is that it saves entry `r0-r3` before
copying entry `r2` to `r12`. It calls the distinct opaque Thumb identity
`runtime_variadic_forward_beta_30`.

### Complete exact body schedule

```asm
push {r0-r3}
mov r12,r2
add r12,r12,#1
push {r4,lr}
cmp r1,r12
ldr r2,[sp,#20]
add r3,sp,#24
movhi r1,r12
blx runtime_variadic_forward_beta_30
pop {r4}
ldr pc,[sp],#20
```

The call at body offset `+0x20` is an `R_ARM_CALL` relocation to
`runtime_variadic_forward_beta_30`.

Exact-schedule cautions:

- Preserve the first two instructions in this order even though entry `r2`
  is unchanged by the push.
- The two variadic-forward identities are distinct; they must not be merged.
- The unsigned clamp, stack offsets, immediate Thumb call, and unusual final
  PC load have the same exact requirements as the preceding wrapper.

## `func_002E9A1C` — conditional loaded-value tail dispatch

This 28-byte helper discards entry `r0` and treats entry `r1` as a record
pointer. It copies that pointer to `r0`, executes an explicit self-move, and
loads the word at record offset 76. A zero word is returned directly. A
nonzero word is passed in `r0` by tail branch to the opaque ARM identity
`runtime_nonzero_dispatch_30`; that identity returns directly to this
helper's caller.

### Complete exact body schedule

```asm
mov r0,r1
mov r0,r0
ldr r0,[r0,#76]
cmp r0,#0
beq return_zero
b runtime_nonzero_dispatch_30
return_zero:
bx lr
```

The tail branch at body offset `+0x14` is an `R_ARM_JUMP24` relocation to
`runtime_nonzero_dispatch_30`.

Exact-schedule cautions:

- Retain the explicit `mov r0,r0`; it is a real scheduled instruction even
  if a disassembler presents it as a no-op alias.
- Load through the copied `r0`, not directly through `r1`.
- The zero path uses the local `bx lr`; the nonzero path is an ordinary ARM
  tail branch with no link.

## `func_002EDAEC` — zero-filled stack-record forwarder

This 52-byte wrapper accepts a readable word pointer in entry `r0` and two
payload words in entry `r1-r2`; entry `r3` is ignored. It saves only LR and
allocates a 20-byte stack record. The five record words, in ascending offset
order, are:

```text
+0   word loaded from entry_r0 + 0
+4   entry r1
+8   entry r2
+12  zero
+16  zero
```

It then calls the opaque ARM identity `runtime_stack_record_forward_30` with
the original entry `r0` retained and `r1-r3` all zero. The call result in
`r0` is returned unchanged after releasing the record and restoring PC from
the separately saved LR word.

### Complete exact body schedule

```asm
push {lr}
sub sp,sp,#20
add r12,sp,#4
mov r3,#0
stm r12,{r1-r3}
mov r2,r3
str r3,[sp,#16]
ldr r1,[r0]
str r1,[sp]
mov r1,r3
bl runtime_stack_record_forward_30
add sp,sp,#20
pop {pc}
```

The call at body offset `+0x28` is an `R_ARM_CALL` relocation to
`runtime_stack_record_forward_30`.

Exact-schedule cautions:

- Save LR before allocating the 20-byte record; do not combine the two stack
  operations.
- Use `r12 = sp + 4` followed by one `stm r12,{r1-r3}`. The zero in entry
  `r3` is written by that transfer before being reused for other zeros.
- Keep the store at stack offset 16 before the load through entry `r0`, and
  keep the loaded word's store before clearing call argument `r1`.
- Do not overwrite `r0`; the callee sees the original pointer as well as the
  dereferenced word in the stack record.

## Symbolic code identity ledger

| Identity | Relocation site | Mode/alignment | Equality class | Permitted visible contract |
| --- | --- | --- | --- | --- |
| `runtime_variadic_forward_alpha_30` | `func_002E6E40 + 0x20` | Thumb code, 2-byte aligned | unique; distinct from every other batch-30 identity | receives entry `r0`, a possibly clamped unsigned count in `r1`, entry `r3` in `r2`, and the entry stack pointer in `r3`; returns through the wrapper |
| `runtime_variadic_forward_beta_30` | `func_002E6E8C + 0x20` | Thumb code, 2-byte aligned | unique; distinct from alpha and every other batch-30 identity | same call-site-visible traffic as alpha, but a distinct destination |
| `runtime_nonzero_dispatch_30` | `func_002E9A1C + 0x14` | ARM code, 4-byte aligned | unique; distinct from every other batch-30 identity | tail-called only when the loaded record word is nonzero, with that word in `r0` |
| `runtime_stack_record_forward_30` | `func_002EDAEC + 0x28` | ARM code, 4-byte aligned | unique; distinct from every other batch-30 identity | called with original pointer in `r0`, zeros in `r1-r3`, and the described five-word stack record; result is returned unchanged |

An implementation may teach the audited target-object generator to normalize
only these four observed branch sites to the named relocations. It must verify
the observed destination mode and alignment at each site and must not
generalize normalization to any other branch.

## Exact-probe and overlap audit

| Function | Mode | Body size | Symbolic branches | Adjacent words | Probe result |
| --- | --- | ---: | ---: | ---: | --- |
| `func_002E6E14` | ARM | 12 | 0 | 0 | exact complete body |
| `func_002E6E40` | ARM | 44 | 1 Thumb call | 0 | exact complete body after symbolic relocation normalization |
| `func_002E6E8C` | ARM | 44 | 1 Thumb call | 0 | exact complete body after symbolic relocation normalization |
| `func_002E9A1C` | ARM | 28 | 1 ARM tail branch | 0 | exact complete body after symbolic relocation normalization |
| `func_002EDAEC` | ARM | 52 | 1 ARM call | 0 | exact complete body after symbolic relocation normalization |
| **Total** |  | **180** | **4** | **0** | **5 / 5 exact; 180 / 180 bytes** |

The current objdiff report lists all five functions as unmatched. A complete
tracked specification and configuration inventory contains no earlier batch
naming any of them beyond the neutral project symbol inventory. None appears
in concurrent IPC batch 28 or in concurrent duplicate batch 30. The five
selected bodies are distinct from one another, giving zero known overlap with
existing or concurrent work.
