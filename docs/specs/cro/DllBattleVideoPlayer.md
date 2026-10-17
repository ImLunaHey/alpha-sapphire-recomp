# DllBattleVideoPlayer tree recycling specification

## Scope, classification, and provenance

Classification: **target-aware analysis and behavioral/interface specification
only**, prepared on **2026-10-17** for Pokémon Alpha Sapphire
**AS_EUR_REV2** (Europe, card revision 2, title version 3120). This is an
analysis-role handoff for a separate implementation role, not an implementation
or a complete-unit claim.

The public unit is `cro/DllBattleVideoPlayer`: container size 77,824 bytes,
SHA-256 `3ca80cd3d0bcd9fbed5fc4053e1d0880adfc308a6893ede971fcc401d3e92143`.
Its identity was checked against the ignored private module. Lawful input
provenance is the project owner's game-card image recorded in
[PROVENANCE.md](../../PROVENANCE.md); analysis follows
[CLEAN_ROOM.md](../../CLEAN_ROOM.md). No implementation source or implementation
history was consulted, and no proprietary SDK material or copied source was
used.

Evidence comprises the public unit manifest, accepted function inventory,
text partition, current objdiff report, and bounded inspection of the ignored
private target. Public metadata and repository tools were read at commit
`11fd5dba4e818135af7d676aa6038738452be0f9`.
The repository CRO converter validated the private module and reproduced the
inspected structural ELF exactly in memory. Analysis used **GNU Arm objdump
2.44**, explicitly selecting ARMv6K, and **Node.js v24.21.0** for ELF/relocation
inspection, SHA-256 computation, and an ephemeral bounded behavioral interpreter.
No game runtime execution was performed.

## Selected public boundaries

Addresses below are offsets in the original module `.text`, not report-layout
addresses. Both functions are accepted ARM bodies and currently unmatched.

| Function | Public address | Size |
| --- | ---: | ---: |
| `func_0000DCEC` | `0x0000DCEC` | 60 bytes |
| `func_0000E494` | `0x0000E494` | 60 bytes |

The pair has identical body SHA-256:
`b59ca3ef039222756d61c51c1e3ba34b47cfb7a40325b4aaacb88419a5cec2c2`.
This is identity metadata, not an encoding recipe.

The pre-existing exact **`func_0000D950`**, at `0x0000D950`, size eight bytes,
is explicitly **outside new implementation scope**.
The remaining 76-byte and two 80-byte candidates were screened but deferred
to keep this handoff focused on a self-contained pair with one shared behavior.

## Shared interface and behavior

Each selected function takes an opaque recycling context in `r0` and a nullable
tree-root pointer in `r1`. There is no meaningful return-value contract.
The neutral names below describe observed storage roles, not original types.

- The context has a writable, 32-bit pointer field `head` at byte offset `+4`.
- A node has 32-bit pointer fields `left` at `+8` and `right_or_next` at `+12`.
  The latter initially denotes a right child and becomes a recycled-list link.
- For a non-null root, the context and reached fields must be accessible and
  aligned. The input tree is finite, acyclic, and has uniquely owned nodes;
  it is disjoint from the context and any existing recycled list. Behavior for
  cycles, shared nodes, overlapping structures, or invalid pointers is outside
  this contract.

A null root does nothing: it makes no memory access, including no context
access. Thus a null context is harmless specifically when the root is null.

For a non-null root, recycle its original right subtree through the same
function and the same context. Then prepend the current node to the context's
recycled list: its `right_or_next` becomes the current `head`, and `head`
becomes this node. Continue with the node's original left child. That left
continuation is iterative; right-subtree processing is recursive.

Consequently the processing order is right subtree, node, left subtree.
Following the final `right_or_next` chain yields the original tree's nodes in
left subtree, node, right subtree order, followed by the pre-existing list.
This is structural traversal order; no comparison or sorting of node payloads
occurs. Empty child pointers are permitted.

Only the context's `head` and each reached node's `right_or_next` change.
Left-child fields, other node/context fields, and pre-existing list nodes are
preserved. There is no allocation, deallocation, payload destruction, global
state access, or external helper call.

## Structural facts and verification limits

Each body has one self-call site, used once per reached node to process its
right child, including when that child is null. Each function must retain its
own callable identity and recurse to that identity. Neither body contains a
relocation output or owns a literal pool; neither depends on an imported
helper or initialized target data. No helper aliases are needed for this pair.

An ephemeral interpreter of the two target bodies agreed with an independent
abstract tree/list model on **522 bounded cases** in total. Cases covered a
null root with inaccessible context, singleton and varied tree shapes, empty
and nonempty prior lists, preserved fields, self-call counts, and callee
register/stack preservation. This corroborates the contract within that
interpreter's coverage; it is not native execution or proof for malformed
graphs.

The shared behavior is sufficient for fresh source implementation without
missing helper semantics or target data. The small identical bodies make this
pair a tractable exact-match candidate, but compiler identity and exact output
have not been established by this analysis. The implementing role must use
this specification alone; any target comparison should disclose only opaque
pass/fail and must not supply target instruction layout for revision.

## Unit-wide completeness blocker

The current public report credits one of 56 accepted functions and eight of
23,588 accepted code bytes. Matching this pair would still leave 53 accepted
functions unmatched. The public partition also retains 33,440 executable gap
bytes and 493 unknown text bytes, while the report credits none of its 6,476
data bytes. Those remaining code boundaries, data semantics, and references
lack a complete approved reconstruction. **`metadata.complete` must remain
`false`**; this specification supplies neither a complete partition expansion
nor the missing data contents.
