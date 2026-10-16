# Probe-verified duplicate ARM templates 19

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function inventory plus private
  target complete-body grouping, control-flow, data-flow, indirect-call, and
  physical post-body literal-layout analysis.
- Probe toolchain: GNU Arm assembler, linker, and objcopy 2.45.1.20251203 from
  GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, literal values, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every function already exact in the current report and every function named by
an earlier or current specification/manifest was excluded before grouping.
This bounded batch contains six complete-body groups: exactly 14 ARM-state
functions and 904 code bytes.

## Vtable-setting atomic member release

These ARM-state functions are 100 bytes and identical over their complete
bodies:

- `func_00170CC0`
- `func_002AFCCC`

The object is in `r0`. Install the function's named vtable identity at object
offset 0. The member pointer at offset 8 names a reference-counted object whose
count is at member offset 4 and release-in-progress byte is at offset 8.
Atomically decrement the count with an `ldrex`/`strex` retry loop. When the new
count is zero and the byte is still zero, set that byte to one and call member
vtable slot byte offset 4 indirectly with the member as `r0`. In every case,
clear the member pointer at object offset 8 and return the original object.
Preserve the conditional instruction chain: a nonzero count or a pre-set byte
skips the indirect release call.

One vtable-identity literal slot follows each body at relative offset 100; its
load begins at body offset 8. The two vtable identities are distinct. There
are no direct calls.

```asm
push {r4, lr}
mov r4, r0
ldr r0, <object-vtable-identity>
mvn r2, #0
str r0, [r4]
ldr r0, [r4, #8]
add r3, r0, #4
.Latomic:
ldrex r1, [r3]
add r1, r1, r2
strex r12, r1, [r3]
cmp r12, #0
bne .Latomic
cmp r1, #0
ldrbeq r1, [r0, #8]
cmpeq r1, #0
moveq r1, #1
strbeq r1, [r0, #8]
bne .Lclear
ldr r1, [r0]
ldr r1, [r1, #4]
blx r1
.Lclear:
mov r0, #0
str r0, [r4, #8]
mov r0, r4
pop {r4, pc}
```

## Allocated 8-byte typed pair from allocator in `r1`

These ARM-state functions are 52 bytes and identical over their bodies:

- `func_002FC244`
- `func_00302C5C`
- `func_00305720`

The allocator is in `r1`; incoming `r0` is not used. Call allocator vtable slot
byte offset 8 indirectly as `allocate(allocator, 8, 4)`. Return null unchanged
on failure. On success, load the function's named type identity and store that
identity and the original allocator at object offsets 0 and 4 with one
two-register store.

Each function has one type-identity literal slot immediately after its body at
relative offset 52; its load begins at body offset 40. All three identities
are distinct. There are no direct calls.

```asm
push {r4, lr}
ldr r0, [r1]
mov r4, r1
mov r2, #4
mov r1, #8
ldr r3, [r0, #8]
mov r0, r4
blx r3
cmp r0, #0
beq .Lreturn
ldr r1, <type-identity>
stm r0, {r1, r4}
.Lreturn:
pop {r4, pc}
```

## Local/global byte-window predicate

These ARM-state functions are 68 bytes and identical over their bodies:

- `func_00179D28`
- `func_00179D70`

The input object is in `r0` and the Boolean result is returned in `r0`. Return
true immediately when object byte offset 14 is nonzero. Otherwise load the
named global state. Return false when global byte offset 24 is zero. When it is
nonzero, subtract object byte offset 15 from global byte offset 25, truncate
the difference to signed 8-bit, and return whether that signed value is less
than or equal to 2. Preserve the signed narrowing before the comparison.

One global-state literal follows each body at relative offset 68; its load
begins at body offset 16. The global identity is equal in both functions,
forming one equality class. There are no calls.

```asm
ldrb r1, [r0, #14]
cmp r1, #0
bne .Ltrue
ldr r1, <global-state>
ldrb r2, [r1, #24]
cmp r2, #0
beq .Lfalse
ldrb r1, [r1, #25]
ldrb r0, [r0, #15]
sub r0, r1, r0
sxtb r0, r0
cmp r0, #2
ble .Ltrue
.Lfalse:
mov r0, #0
bx lr
.Ltrue:
mov r0, #1
bx lr
```

## Four-global active-entry count

These ARM-state functions are 72 bytes and identical over their bodies:

- `func_0042875C`
- `func_0042CAA0`

Return in `r0` the number of non-null words found at four named global-base
and field-offset pairs, tested in physical order: field offsets 24, 52, 80,
and 108. Initialize the result to zero, set it to one conditionally after the
first test, and conditionally increment it after each remaining test. There
are no calls.

Four literal slots immediately follow each body at relative offsets 72, 76,
80, and 84. Their loads begin at body offsets 0, 16, 32, and 48. Within each
function all four named global-base identities are distinct. Corresponding
slots are equal between the two functions, giving exactly four cross-function
equality classes.

```asm
ldr r1, <global-base-1>
mov r0, #0
ldr r1, [r1, #24]
cmp r1, #0
ldr r1, <global-base-2>
movne r0, #1
ldr r1, [r1, #52]
cmp r1, #0
ldr r1, <global-base-3>
addne r0, r0, #1
ldr r1, [r1, #80]
cmp r1, #0
ldr r1, <global-base-4>
addne r0, r0, #1
ldr r1, [r1, #108]
cmp r1, #0
addne r0, r0, #1
bx lr
```

## Global owned-object release

These ARM-state functions are 44 bytes and identical over their bodies:

- `func_003B0994`
- `func_003B0B80`
- `func_003B14C0`

Each function owns a distinct named global pointer slot. If that slot is null,
return without calling anything. Otherwise call the pointed object's vtable
slot at byte offset 4 indirectly with the object in `r0`, then clear the global
slot to null. The slot is deliberately cleared only after the call returns.

One global-slot-address literal follows each body at relative offset 44; its
load begins at body offset 4. All three global slot identities are distinct.
There are no direct calls.

```asm
push {r4, lr}
ldr r4, <global-pointer-slot>
ldr r0, [r4]
cmp r0, #0
beq .Lreturn
ldr r1, [r0]
ldr r1, [r1, #4]
blx r1
mov r0, #0
str r0, [r4]
.Lreturn:
pop {r4, pc}
```

## Halfword stream XOR with linear-congruential state

These ARM-state functions are 68 bytes and identical over their bodies:

- `func_00168AC8`
- `func_00175F68`

Inputs are a writable byte buffer in `r0`, its byte count in `r1`, and a
32-bit generator state in `r2`. Process exactly `byte_count >> 1` halfwords.
If that count is zero, return before saving registers. For each halfword,
replace the state with `state * multiplier + 0x6073`, XOR the input halfword
with the upper 16 bits of the new state, and store the low 16 bits of the
result. The updated generator state is not returned.

One named multiplier literal follows each body at relative offset 68; its load
begins at body offset 20 and is intentionally reloaded on every iteration. The
multiplier is equal in both functions, forming one equality class. There are
no calls.

```asm
mov r3, #0
cmp r3, r1, lsr #1
bxcs lr
push {r4, r5}
.Lloop:
ldr r12, <generator-multiplier>
mul r2, r2, r12
add r12, r0, r3, lsl #1
add r3, r3, #1
ldrh r5, [r12]
add r2, r2, #0x6000
add r2, r2, #0x73
cmp r3, r1, lsr #1
eor r4, r5, r2, lsr #16
strh r4, [r12]
bcc .Lloop
pop {r4, r5}
bx lr
```

## Independent full-body probe result

The six semantic templates above were independently assembled as ARM state.
Every listed function's complete declared body was compared byte for byte with
the corresponding assembled body. Post-body literal values were excluded from
body comparison and audited separately by physical slot and equality class.

| Template | Functions | Bytes each | Aggregate | Full-body result |
| --- | ---: | ---: | ---: | --- |
| Vtable-setting atomic member release | 2 | 100 | 200 | 2/2 exact |
| Allocated typed pair from `r1` | 3 | 52 | 156 | 3/3 exact |
| Local/global byte-window predicate | 2 | 68 | 136 | 2/2 exact |
| Four-global active-entry count | 2 | 72 | 144 | 2/2 exact |
| Global owned-object release | 3 | 44 | 132 | 3/3 exact |
| Halfword stream XOR | 2 | 68 | 136 | 2/2 exact |
| **Total** | **14** |  | **904** | **14/14 exact** |

Implementation must preserve ARM state, instruction order, conditional
execution, branch topology, the atomic retry loop, signed byte narrowing,
multi-register transfers, early unsaved return, and literal slots at their
stated physical offsets. All identities and the multiplier must be represented
by named symbols or semantic constants; do not encode target values in source.
