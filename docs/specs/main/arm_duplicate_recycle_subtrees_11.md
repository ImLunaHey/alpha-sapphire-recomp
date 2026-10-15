# Probe-verified duplicate ARM subtree recyclers 11

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-15.
- Evidence: the evidence-gated Ghidra 12.0.2 function inventory plus local
  control-flow and data-flow analysis of the private target executable.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document records behavior
  and neutral ABI/code-generation facts. It contains no target bytes, encoded
  instruction words, extracted assets, or proprietary source.

This bounded batch covers 37 previously unspecified and unmatched functions.
Every member is an ARM-state, 60-byte function. Their complete inventoried
bodies are identical. Each member's recursive call targets that same member,
not one shared implementation.

## Functions

- `func_0018A080`
- `func_00192AE0`
- `func_005504D4`
- `func_00550CAC`
- `func_005516E8`
- `func_0055227C`
- `func_00552CCC`
- `func_005531F4`
- `func_0055388C`
- `func_0055670C`
- `func_00557C70`
- `func_005588EC`
- `func_0055943C`
- `func_00559948`
- `func_00559FE0`
- `func_0055AB38`
- `func_0055B2E0`
- `func_0055BDF4`
- `func_0055C938`
- `func_0055D4E8`
- `func_0055E1BC`
- `func_0055EE08`
- `func_0055FF78`
- `func_00560A9C`
- `func_00561C08`
- `func_005622A4`
- `func_00562CB8`
- `func_00563450`
- `func_00563F64`
- `func_00564A78`
- `func_0056548C`
- `func_00565FA0`
- `func_005676A0`
- `func_005680CC`
- `func_00568AE4`
- `func_00569180`
- `func_00569958`

## Interface and behavior

The following layout names are descriptive interoperability labels. Only the
listed offsets are established; the fields before offset 8 and all unlisted
owner fields remain opaque.

```c
struct RecycleOwner {
    unsigned char opaque_00[4];
    struct RecycleNode *free_head; /* offset 4 */
};

struct RecycleNode {
    unsigned char opaque_00[8];
    struct RecycleNode *next;      /* offset 8 */
    struct RecycleNode *child;     /* offset 12 */
};

void function(struct RecycleOwner *owner, struct RecycleNode *head);
```

If `head` is null, return immediately without touching memory or saving
registers. Otherwise, process the list beginning at `head` in this order for
each node:

1. Recursively call the same function with `owner` and the node's current
   `child`, including when that child is null.
2. Read and retain the node's current `next`.
3. Read `owner->free_head`.
4. Store that old free-list head into the node's `child` field.
5. Store the node into `owner->free_head`.
6. Continue iteratively with the retained `next`, or return when it is null.

Thus the routine recycles a finite tree/forest into a singly linked free list
whose link is the former `child` field. The `next` field is read but never
modified. No allocator, destructor, or external helper is called. Behavior is
defined only for a finite acyclic graph through `next` and `child` whose
accessed fields and `owner->free_head` are valid naturally aligned 32-bit
storage. Aliasing that mutates an unread traversal edge through a free-list
write is outside this specification.

## Exact semantic assembly template

For each listed function, substitute that function's own symbol for
`<self>`. The local loop label is private to the function. This is the exact
instruction sequence and register choreography; the text contains public ARM
mnemonics only, not target encodings.

```asm
cmp r1, #0
bxeq lr
push {r4, r5, lr}
mov r5, r0
mov r4, r1
.Lloop:
mov r0, r5
ldr r1, [r4, #12]
bl <self>
ldr r1, [r5, #4]
ldr r0, [r4, #8]
str r1, [r4, #12]
str r4, [r5, #4]
movs r4, r0
bne .Lloop
pop {r4, r5, pc}
```

The initial null return is conditional `bx`, before the stack save. Preserve
the exact `r5 = owner`, `r4 = node` assignment, issue the recursive call before
reading either the owner's old free head or the node's next pointer, and use
the flag-setting move into `r4` to control the loop. The recursive branch must
resolve to the start of the containing function. Do not tail-call a common
helper or merge these independently named bodies.

## Probe result

An isolated ARM assembly probe spelling the template above with a local alias
for `<self>` assembled to exactly 60 bytes and matched the complete body of
`func_0018A080`. A separate inventory-and-target comparison checked all 37
listed intervals: every entry is ARM mode, exactly 60 bytes, byte-identical to
the representative across its complete inventoried body, absent from all
earlier specifications, and not already reported as a 100% match. The
template therefore accounts for 37 functions and 2,220 target code bytes.

No clean-room implementation is included in this analysis document.
