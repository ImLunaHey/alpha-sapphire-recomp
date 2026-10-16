# Probe-verified ARM MT19937 array seeding helper batch 22

## Scope and provenance

This clean-room specification covers one previously unspecified, unmatched
ARM-state runtime leaf totaling 308 bytes. It uses the publicly documented
MT19937 initialization algorithm and public constants. It contains no raw
instruction encodings, extracted data, private addresses, or proprietary
source. The complete body was independently assembled and compared over its
full symbol extent and was byte-exact. It has no calls or external branches.

## `func_002DAE74` — initialization by key array

`func_002DAE74` (308 bytes, ARM) takes MT state record `r0`, key-word array
`r1`, and signed key length `r2`. State offset 0 is a control word and the
word array begins at offset 4. It implements an MT19937 `init_by_array`-style
construction with the exact index convention below.

It preserves `r4-r9` using a six-register push/pop and otherwise uses no
stack. It returns with `r0` still identifying the state record; no explicit
status is produced.

### Phase 1: fixed-seed expansion

Let `W[k]` be the word at state offset `4 + 4*k`. It stores public seed
`19650218` into `W[0]`, then for `k=0..622` performs:

```text
W[k+1] = 1812433253 * (W[k] XOR (W[k] >> 30)) + (k+1)
```

The exact loop register allocation is: `r3=i`, `r4=remaining`, `r6=623`,
`r7=1812433253/result`, `r8=previous`, and `r12=i-1`. Each iteration computes
the recurrence with `eor`, one `mla`, then stores before its bottom-tested
`subs`/`bne` control.

### Phase 2: key mixing

It sets state offset 0 to zero. Let `iterations = max(key_length,624)` using a
signed comparison. Starting with internal `i=623`, `j=0`, repeat
`iterations` times. The body uses `W[i]` and `W[i+1]`, then increments `i`:

```text
W[i+1] = (W[i+1] XOR
         ((W[i] XOR (W[i] >> 30)) * 1664525))
        + key[j] + j
i++
if i >= 623:
    W[0] = W[623]
    i = 0
j++
if j >= key_length: j = 0
```

Instruction-level details are observable:

- `iterations` is held in `r7`, the completed count in `r4`, `i` in `r3`,
  and `j` in `r12`.
- The previous state value is loaded before the current value.
- Multiplication uses `mul r5,r5,r9`; key index and key word are added in two
  separate `add` instructions, index first.
- The current word is stored before either wrap check.
- The `i` wrap uses signed `blt`; `j` wrap uses signed `movge`.
- A nonpositive `iterations` count skips this phase entirely.

### Phase 3: final tempering mix

It resets a loop counter to zero and performs 623 iterations, continuing from
the current `i` value:

```text
W[i+1] = (W[i+1] XOR
         ((W[i] XOR (W[i] >> 30)) * 1566083941)) - (i+1)
i++
if i >= 623:
    W[0] = W[623]
    i = 0
```

The exact loop head begins by recomputing `r2 = r0 + 4` and reloading
`r4 = 1566083941` on every iteration. The bottom `blt` branches to those two
instructions, not to the first state load. The order inside the loop is:

```asm
add r2, r0, #4
ldr r4, =1566083941
ldr r12, [r2, r3, lsl #2]
add r5, r2, r3, lsl #2
add r3, r3, #1
ldr r2, [r5, #4]
eor r12, r12, r12, lsr #30
cmp r3, r6
mul r12, r12, r4
eor r2, r2, r12
add r12, r0, r3, lsl #2
sub r2, r2, r3
str r2, [r12, #4]
blt no_i_wrap
ldr r2, [r0, #2496]
mov r3, #0
str r2, [r0, #4]
no_i_wrap:
add r1, r1, #1
cmp r1, r6
blt loop_head
```

Finally it stores `0x80000000` to `W[0]`, restores `r4-r9`, and returns.

### Literal layout and edge contract

Five adjacent words immediately after the 308-byte symbol hold, in load
order, the public MT19937 values `19650218`, `623`, `1812433253`, `1664525`,
and `1566083941`. Pin the pool in that order.

The public algorithm assumes a valid key pointer and positive key length.
This body performs no pointer validation. Its signed comparisons and modulo
reset behavior, rather than a strengthened input contract, must be retained.

### Complete exact body schedule

The phase descriptions are not a substitute for this register and branch
schedule. Labels name only local targets; the five `ldr =constant` operations
must address the adjacent pool described above.

```asm
push {r4-r9}
mov r12, #0
ldr r3, =19650218
ldr r6, =623
str r3, [r0, #4]
mov r3, #1
mov r4, r6
seed_loop:
add r5, r0, r12, lsl #2
ldr r7, =1812433253
ldr r8, [r5, #4]
subs r4, r4, #1
add r12, r12, #1
eor r8, r8, r8, lsr #30
mla r7, r7, r8, r3
add r3, r3, #1
str r7, [r5, #8]
bne seed_loop
mov r12, #0
cmp r2, #624
mov r3, r12
str r12, [r0]
movle r7, #624
movgt r7, r2
mov r12, #0
cmp r7, #0
mov r4, r12
ble mix2_begin
mix1_loop:
add r5, r0, #4
add r8, r5, r3, lsl #2
ldr r5, [r5, r3, lsl #2]
ldr r9, =1664525
ldr r8, [r8, #4]
add r3, r3, #1
eor r5, r5, r5, lsr #30
cmp r3, r6
mul r5, r5, r9
add r9, r0, r3, lsl #2
eor r5, r5, r8
ldr r8, [r1, r12, lsl #2]
add r5, r5, r12
add r5, r5, r8
str r5, [r9, #4]
blt mix1_no_i_wrap
ldr r5, [r0, #2496]
mov r3, #0
str r5, [r0, #4]
mix1_no_i_wrap:
add r12, r12, #1
cmp r12, r2
movge r12, #0
add r4, r4, #1
cmp r4, r7
blt mix1_loop
mix2_begin:
mov r1, #0
mix2_loop:
add r2, r0, #4
ldr r4, =1566083941
ldr r12, [r2, r3, lsl #2]
add r5, r2, r3, lsl #2
add r3, r3, #1
ldr r2, [r5, #4]
eor r12, r12, r12, lsr #30
cmp r3, r6
mul r12, r12, r4
eor r2, r2, r12
add r12, r0, r3, lsl #2
sub r2, r2, r3
str r2, [r12, #4]
blt mix2_no_i_wrap
ldr r2, [r0, #2496]
mov r3, #0
str r2, [r0, #4]
mix2_no_i_wrap:
add r1, r1, #1
cmp r1, r6
blt mix2_loop
mov r1, #0x80000000
str r1, [r0, #4]
pop {r4-r9}
bx lr
```

Body/pool boundaries are exact: the first instruction is at relative `+0x00`,
the final `bx lr` at `+0x130`, and the 308-byte symbol ends at `+0x134`.
The five adjacent literal words occupy `+0x134`, `+0x138`, `+0x13C`, `+0x140`,
and `+0x144` in the stated constant order; they are outside the symbol.

### Current-artifact mismatch audit

The current base artifact's exact instruction runs are the entry push at
`+0x00`, isolated instructions at `+0x84`, `+0xA8`, `+0xB0`, and `+0xB8`, the
short run `+0xC0..+0xC8`, the entire second-mix block `+0xD0..+0x120`, and
the restore/return at `+0x12C..+0x130`. Its pool positions and values at
`+0x134..+0x144` are also correct. Every other instruction offset in the
308-byte body differs. The semantic mismatch facts are:

- At `+0x04..+0x3C`, it uses a canonical seed loop (`r5` seed, `r3` index,
  pre-incremented index, and one-time multiplier load). The target starts with
  `r12=0`, loads the seed into `r3`, reloads the multiplier into `r7` inside
  the loop, decrements remaining count before incrementing `r12`, and uses
  `mla r7,r7,r8,r3`.
- At `+0x40..+0x6C`, it derives the maximum count through copied key-length
  registers and `623+1`. The target zeros state/control first and uses direct
  `cmp r2,#624`, `movle r7,#624`, `movgt r7,r2`, with `r3` copied from zeroed
  `r12` before the loop setup.
- At `+0x70..+0xCC`, its first mixing loop assigns different registers, loads
  current/previous state in a different order, keeps multiplier `1664525`
  outside the loop, adds key word after key index through different operands,
  and branches back to `+0x70`. The target schedule above reloads the
  multiplier at `+0x78` each iteration and branches to `+0x6C`.
- At `+0x124` and `+0x128`, the artifact materializes/stores the final high
  bit through `r2`; the target uses `r1`. Those are the only mismatches after
  the second-mix loop.

## Exact-probe manifest

| Function | Mode | Size | Complete-body probe |
| --- | --- | ---: | --- |
| `func_002DAE74` | ARM | 308 | exact |
| **Total** |  | **308** | **1 / 1 exact** |

Implementation cautions: preserve signed loop comparisons, store-before-wrap
ordering, separate key-index/key-word additions, the phase-two maximum-count
selection, the phase-three back edge that reloads base and multiplier, the
six-register save set, and the adjacent public-constant pool.
