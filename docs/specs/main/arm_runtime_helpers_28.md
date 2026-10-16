# Probe-verified ARM runtime/helper batch 28

## Scope and provenance

This clean-room specification covers two currently unmatched ARM-state
helpers totaling 312 executable bytes. Each complete body was independently
assembled from the schedules below and compared byte-for-byte with target
revision `AS_EUR_REV2`; both bodies and all 312 bytes matched.

Neither helper calls nor branches to external code, and neither has a literal
pool or adjacent data word. The specification uses only ordinary record,
buffer-size, and integer-alignment semantics. It records no raw instruction
encoding, private address, extracted data value, or proprietary source.

## `func_002D0318` — guarded fixed-size nested-record extraction

This 156-byte leaf takes a wrapper pointer in entry `r0` and a writable
20-byte output buffer in entry `r1`. It has no stack frame and preserves no
callee-saved register because it uses only `r0-r3`.

Call the wrapper `wrapper`, the pointer stored at `wrapper+0` `owner`, and the
nested record at `owner+8196` `nested`. Success requires every one of these
conditions, in this order:

1. byte `wrapper+4` is nonzero;
2. byte `owner+68` is zero;
3. byte `owner+74` is nonzero;
4. byte `nested+35` is nonzero; and
5. word `nested+24` equals 20.

Any failure returns zero without writing the output buffer. On success, the
source pointer is loaded from `nested+28`; five consecutive words are copied
to output offsets 0, 4, 8, 12, and 16 in that exact load/store order. Output
byte 19 is then overwritten with zero, so the final byte of the 20-byte
result is always terminated even if the copied source byte was nonzero. The
helper returns 20.

### Complete exact body schedule

```asm
mov r2,r1
ldrb r1,[r0,#4]
cmp r1,#0
beq fail_early
ldr r1,[r0]
ldrb r0,[r1,#68]
cmp r0,#0
beq owner_ok
fail_early:
mov r0,#0
bx lr
owner_ok:
mov r0,r2
mov r0,r0
ldrb r2,[r1,#74]
add r1,r1,#8192
add r1,r1,#4
cmp r2,#0
ldrbne r2,[r1,#35]
cmpne r2,#0
beq fail
ldr r2,[r1,#24]
cmp r2,#20
beq copy
fail:
mov r0,#0
bx lr
copy:
ldr r2,[r1,#28]
mov r1,#0
ldr r3,[r2]
str r3,[r0]
ldr r3,[r2,#4]
str r3,[r0,#4]
ldr r3,[r2,#8]
str r3,[r0,#8]
ldr r3,[r2,#12]
str r3,[r0,#12]
ldr r2,[r2,#16]
str r2,[r0,#16]
strb r1,[r0,#19]
mov r0,#20
bx lr
```

Exact-schedule cautions:

- The wrapper byte at +4 is tested before loading the owner pointer. The owner
  byte at +68 has the opposite polarity: zero permits progress.
- Preserve the two separate `add` instructions that form `owner+8196`.
- Keep the conditional byte load and conditional compare at nested offset 35;
  do not replace them with an unconditional load or split control flow.
- The `mov r0,r0` is the legacy ARM move encoding used as the deliberate
  no-op. Assembling the architectural `nop` mnemonic may select a different
  encoding.
- Use five alternating word loads and stores, then the byte store at output
  offset 19. Do not use a multiple-register transfer or clear the byte before
  copying the final word.

## `func_002DCC60` — page-rounded maximum workspace calculation

This 156-byte helper takes a record pointer in `r0` and two boolean selectors
in `r1` and `r2`. It returns either an early status or an unsigned workspace
size rounded upward to 4096 bytes. The calculation path preserves exactly
`r4-r5`; LR is not saved because the helper makes no calls.

First it reads control word `record+16`. When that word is nonzero, it returns
zero for unsigned values below three and all-ones for unsigned values three
or greater. No other record field is read on this early-return path.

When the control word is zero, define:

```text
a = unsigned_halfword(record+32)
b = unsigned_halfword(record+34)
base_a = align_down(5 + 2*a, 4)
candidate = align_down(3 + 2*(83*b), 4) + base_a
if entry_r1 != 0: candidate += 68
flags_candidate = base_a
flags = word(record+28)
if flags bit 0 is set: flags_candidate += 68
if entry_r2 != 0: candidate += 42092
if flags bit 1 is set: flags_candidate += 42092
selected = unsigned_max(candidate, flags_candidate)
return align_down(selected + 4095, 4096)
```

All arithmetic is 32-bit wrapping ARM integer arithmetic. In particular, the
final add can wrap; the implementation must retain the two shifts rather than
strengthening the operation into a wider or saturating alignment helper.

### Complete exact body schedule

```asm
ldr r3,[r0,#16]
cmp r3,#0
ldrheq r3,[r0,#32]
beq compute
cmp r3,#3
mvncs r0,#0
movcc r0,#0
bx lr
compute:
push {r4,r5}
ldrh r4,[r0,#34]
mov r5,#83
mov r12,#5
add r12,r12,r3,lsl #1
mul r4,r4,r5
mov r3,#3
bic r12,r12,#3
cmp r1,#0
add r3,r3,r4,lsl #1
bic r3,r3,#3
add r3,r3,r12
addne r3,r3,#68
ldr r0,[r0,#28]
cmp r2,#0
addne r3,r3,#41984
addne r3,r3,#108
tst r0,#1
mov r1,r12
addne r1,r12,#68
tst r0,#2
addne r1,r1,#41984
addne r1,r1,#108
cmp r3,r1
movcs r1,r3
add r0,r1,#3840
add r0,r0,#255
pop {r4,r5}
lsr r0,r0,#12
lsl r0,r0,#12
bx lr
```

Exact-schedule cautions:

- Keep the conditional halfword load before the branch. It is executed only
  when the control word is zero and supplies `a` directly in `r3`.
- The early comparison is unsigned (`cs`/`cc`), not signed, and the all-ones
  result is formed with `mvncs r0,#0`.
- Preserve the split additions `41984` then `108` in both candidates. They
  must not be folded into a literal or replaced by a pool load.
- The option in entry `r1` affects only `candidate`; after that use, `r1` is
  deliberately repurposed for `flags_candidate`.
- The maximum comparison is unsigned and uses conditional move `movcs`.
- Preserve only `r4-r5`, without LR, and keep the pop before the two final
  shifts.

## Exact-probe and overlap audit

| Function | Mode | Body size | Calls | Adjacent words | Probe result |
| --- | --- | ---: | ---: | ---: | --- |
| `func_002D0318` | ARM | 156 | 0 | 0 | exact complete body |
| `func_002DCC60` | ARM | 156 | 0 | 0 | exact complete body |
| **Total** |  | **312** | **0** | **0** | **2 / 2 exact; 312 / 312 bytes** |

The current objdiff report lists both functions as unmatched. A search of the
tracked specification and configuration inventory found no earlier batch
naming either function. Neither appears in the concurrent IPC batch 27, and
the concurrent duplicate batch 28 analyst confirmed a disjoint nine-function
selection. The two functions are also distinct from each other, giving zero
known overlap with existing or concurrent work.
