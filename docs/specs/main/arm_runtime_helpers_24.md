# Probe-verified ARM CRC-32 helper batch 24

## Scope and provenance

This clean-room specification covers one currently unmatched ARM-state leaf,
`func_002DC7A0`, totaling 204 executable bytes. It was observed in target
revision `AS_EUR_REV2` on 2026-10-16. The target body and its one adjacent
public-constant word were compared against an independently assembled semantic
probe using GNU Arm Embedded 15.2.Rel1; all 204 body bytes and the adjacent
word matched exactly.

The function has no calls, external branches, symbolic relocations, or opaque
data dependencies. Its sole literal is the standard reflected CRC-32
polynomial `0xEDB88320`, a public algorithm constant. This document contains
no target instruction encodings, private addresses, or proprietary data.

## `func_002DC7A0` — generated-table reflected CRC-32 update

Inputs are byte buffer `r0`, unsigned byte count `r1`, and initial CRC
accumulator `r2`. The function returns the bitwise complement of the updated
accumulator in `r0`.

It saves exactly `r4-r8`, allocates 1040 bytes of stack space, copies the new
SP to `r8`, and uses the 256 words beginning at SP+4 as a temporary CRC table.
`r8` is deliberately not read again. For each table index `i=0..255`, it starts
with `value=i` and performs eight reflected CRC steps:

```text
value = (value >> 1) XOR (value bit 0 ? 0xEDB88320 : 0)
```

The body expresses those eight steps as four loop iterations with two steps
per iteration. It stores the resulting word at `SP+4+4*i`.

After table construction it copies the table base to `r3` and stores the
initial accumulator at SP+0. A zero byte count skips all input reads. For a
nonzero count it first changes the buffer register to `buffer-1`. If the
original count is odd, it consumes one byte with a pre-indexed `+1` load. It
then halves the remaining count and processes two bytes per loop iteration.
Each consumed byte applies:

```text
crc = table[(byte XOR crc) & 255] XOR (crc >> 8)
```

The pair loop uses one non-writeback load at current pointer +1 followed by a
writeback load at current pointer +2. At completion it again stores the CRC at
SP+0, releases the 1040-byte allocation, complements `r2` into `r0`, restores
`r4-r8`, and returns. The two SP+0 stores are observable schedule requirements
even though no subsequent load consumes them.

The contract assumes a readable buffer of `r1` bytes when `r1` is nonzero.
There is no pointer validation. The count is treated through bit tests,
logical shift, and zero termination; no signed comparison is used.

### Complete exact body schedule

Labels below are local only. Register choices, condition codes, addressing
modes, instruction order, and branch targets are exact requirements.

```asm
push {r4-r8}
sub sp,sp,#1040
mov r8,sp
ldr r5,crc32_polynomial_24
mov r6,#0
add r7,sp,#4
table_outer:
mov r3,r6
mov r4,#4
table_inner:
tst r3,#1
eorne r12,r5,r3,lsr#1
lsreq r12,r3,#1
tst r12,#1
eorne r3,r5,r12,lsr#1
lsreq r3,r12,#1
subs r4,r4,#1
bne table_inner
str r3,[r7,r6,lsl#2]
add r6,r6,#1
cmp r6,#256
bcc table_outer
cmp r1,#0
mov r3,r7
str r2,[sp]
beq finish
tst r1,#1
sub r0,r0,#1
beq even_pairs
ldrb r12,[r0,#1]!
eor r12,r12,r2
and r12,r12,#255
ldr r12,[r3,r12,lsl#2]
eor r2,r12,r2,lsr#8
even_pairs:
lsrs r1,r1,#1
beq finish
pair_loop:
ldrb r12,[r0,#1]
subs r1,r1,#1
eor r4,r12,r2
and r4,r4,#255
ldrb r12,[r0,#2]!
ldr r4,[r3,r4,lsl#2]
eor r2,r4,r2,lsr#8
eor r12,r12,r2
and r12,r12,#255
ldr r12,[r3,r12,lsl#2]
eor r2,r12,r2,lsr#8
bne pair_loop
finish:
str r2,[sp]
add sp,sp,#1040
mvn r0,r2
pop {r4-r8}
bx lr
```

### Body boundary and literal placement

The first instruction is at relative `+0x00`, the final `bx lr` is at
`+0xC8`, and the 204-byte function ends at `+0xCC`. One adjacent word at
`+0xCC`, outside the function symbol, is `crc32_polynomial_24` with the public
value `0xEDB88320`. The `ldr` at body `+0x0C` addresses that exact word. The
word requires four-byte alignment and has no relocation.

### Exact-schedule cautions

- Preserve the otherwise-unused `mov r8,sp`; do not reduce the save set or
  stack allocation.
- The table loop is two conditionally selected CRC steps per iteration and
  four iterations per entry. Both conditional shifts are `lsreq`, not moves
  expressed with a shifted operand.
- Use unsigned `bcc` for the 256-entry outer loop.
- Store `r2` at SP+0 both before the zero-length branch and at `finish`.
- Subtract one from `r0` even on the even-length path; retain the precise
  pre-index/writeback byte-load pattern.
- `lsrs r1,r1,#1` supplies the flags for the empty-pair branch. Within the pair
  loop, `subs r1,r1,#1` occurs immediately after the first byte load and its
  flags survive every following instruction through the bottom `bne`.
- The first byte in each pair uses `r4` for its table index/result, while the
  second uses `r12`; changing scratch allocation changes the body.
- Place the public polynomial immediately after `.size` rather than counting
  it in the 204-byte function symbol.

## Exact-probe and overlap audit

| Function | Mode | Body size | Calls | Adjacent data | Probe result |
| --- | --- | ---: | ---: | --- | --- |
| `func_002DC7A0` | ARM | 204 | 0 | public CRC polynomial at `+0xCC` | exact body and pool |

The current report lists `func_002DC7A0` as unmatched. A repository-wide
specification/config audit found no prior implementation batch naming this
function. Batch-24 duplicate and IPC inventories also do not name it, so this
selection has zero known overlap with current or concurrently prepared work.
