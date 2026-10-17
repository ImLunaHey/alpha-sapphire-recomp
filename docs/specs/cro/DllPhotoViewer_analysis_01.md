# DllPhotoViewer: boundary contracts and evidence, analysis 01

## Status, scope, and provenance

This is an **analysis-role handoff for review**, confined to Pokémon Alpha
Sapphire `AS_EUR_REV2`, unit `cro/DllPhotoViewer`. It records neutral interface
and behavioral observations for an independent C implementation. It is not an
approval of new implementation, a reconstruction of original source, or a claim
that the entire module is understood. No implementation or configuration was
changed during this analysis.

- Observation date: 2026-10-17.
- Repository baseline: `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.
- Target: Europe, card revision 2, product code `CTR-P-ECLA`, title ID
  `000400000011C500`, configured title version 3.3.0 (3120).
- Module container: 16,384 bytes; SHA-256
  `3c5f3ff7ce2749738458edd72f63648c64587abc0cd67a27fede1572176386f2`.
  The privately inspected input agrees with the public unit manifest.
- Tools actually used: Node.js 24.21.0; GNU ARM objdump 2.44, with explicit
  ARMv6K decoding for manual analysis; repository CRO parser/converter and
  inventory, partition, and semantic validators at the baseline above.
- Existing boundary discovery convention: Ghidra 12.0.2, as pinned by the
  repository. Ghidra was not rerun in this analysis. Existing boundaries were
  independently rechecked against the target with the repository validators.
- Evidence: public manifest, public CSV and partition, public report, current
  unit source claim, and private static inspection of this module only.
  Parsing validated the module's four embedded hash regions. Re-conversion
  reproduced the existing structural target ELF exactly. No runtime execution
  or hardware behavior was measured.

The analysis followed [the clean-room protocol](../../CLEAN_ROOM.md),
[unit conventions](../../CRO_UNITS.md), and
[target-object conventions](../../CRO_TARGET_OBJECTS.md). All platform/ABI facts
below are observations or explicitly stated models of this target, rather than
claims copied from public platform documentation. No proprietary header or SDK
source was used. The implementation role should receive this document and
public repository metadata, without private inspection outputs.

## Address convention and accepted boundaries

All module code addresses here are offsets within the original `.text`, whose
extent is `[0x0000, 0x1508)`. Data references explicitly name their segment.
They are not runtime virtual addresses or the report's flattened object
addresses. The authoritative identities are in
[the CSV](../../../symbols/cro/DllPhotoViewer.csv) and
[the complete partition](../../../symbols/cro-partitions/DllPhotoViewer.json).

| Neutral identity | Entry | Exclusive end | Body size | Mode | Entry evidence |
| --- | ---: | ---: | ---: | --- | --- |
| `func_00000F20` | `0x0F20` | `0x1174` | 596 (`0x254`) | ARM | Direct call from code at `0x02A4` |
| `func_0000133C` | `0x133C` | `0x1344` | 8 (`0x8`) | ARM | Module export |

Both bodies passed instruction tiling, terminal-flow, bounds, partition, and
relocation exclusion checks. These are the **only accepted function extents**.
The import veneers and the local helper named below remain partition gaps;
reference to their entries does not establish additional accepted functions.
There is another exported entry at `0x1458`, still without an accepted extent.
Do not derive an extent from its export or the next pool.

## Common interface model

The observed target uses 32-bit little-endian words and pointers, ARM entry
mode, and core-register arguments in `r0` through `r3`, followed by word
arguments on the stack. A scalar/pointer result is in `r0`. Model opaque
machine words with a 32-bit integer type on hosts whose pointers are wider.
The use of floating-point registers for local copies does not establish a
floating-point argument convention.

The following names are analysis aliases, not recovered proprietary names:

- `E_xxxx`: the imported service reached through the veneer at `.text+0xxxx`.
  Its relocation slot is four bytes after that entry. The veneer tail-forwards
  arguments and results to the loader-supplied destination.
- `H_0AC8`: a local entry at `.text+0x0AC8`, whose extent remains unaccepted.
- `W(p,n)`: the 32-bit word at byte offset `n` from pointer `p`.
- `B(p,n)`: the byte at that offset.

Aliases preserve observable calls without guessing the imported services'
source-level types, ownership rules, or implementations. A return value marked
unused below is not evidence that the service has a `void` ABI. Preserve the
call and its side effects. Do not turn unused returns or arbitrary residual
caller-saved registers into extra arguments. Argument lists below identify the
deliberately supplied positions visible in this caller; they do not prove a
callee's complete prototype or whether it consumes additional residual stack
or register state. One particularly important unprepared call is identified
in step 6. Resolving that ambiguity requires a separate interface contract,
not inspection of another unit by the implementation role.

## Contract: func_0000133C

Inputs are a writable base pointer in `r0` and a value in `r1`. Write the low
eight bits of the value to byte offset 217 (`0xD9`) and return to the caller.
There are no calls, other memory accesses, null checks, or relocations in the
body. Model the source-level result as `void`; the surviving input pointer in
the result register is not evidence of a promised pointer return.

The caller must supply writable storage including that byte. All other bytes
remain unchanged. No relationship between this base object's type and the
object initialized by `func_00000F20` has been established.

This is the existing `store-u8` claim in `config/cro-sources.json`, already
expressed by `src/cro/DllPhotoViewer.c`. The tracked report credits exactly
8/8 bytes for this function. This analysis does not establish the provenance
of an earlier contribution beyond the repository's recorded contract.

## Contract: func_00000F20

### Purpose and arguments

Observed behavior is an object-initialization sequence followed by conditional
construction of an auxiliary allocation. “Initializer” describes behavior;
original class names and constructor spellings are not established.

Inputs are `(storage, context, initial_word)` in `r0`, `r1`, and `r2`.
`initial_word` is an uninterpreted 32-bit value. The result is the object pointer
returned by the initial base service, even if it differs from `storage`.
There is no direct use of an incoming fourth argument or stack argument.

The base service and context must be valid. This routine does not check for a
null base-service result, a null context, or null results from services later
dereferenced. Allocation failure is the sole explicitly handled null result.
The direct object writes reach byte offset 151; this is a lower bound on the
storage involved, not proof of the full object size.

### Opaque resource references

Use symbolic references with these relocation identities. The contents and
extents of these resources are outside this contract; none is a byte array to
copy from the target.

| Alias | Identity | Use |
| --- | --- | --- |
| `dispatch_ref` | `.rodata+0x354` | Installed as the object's first word |
| `config_a` | `.rodata+0x174` | Configuration argument |
| `config_b` | `.rodata+0x1B0` | Configuration argument |
| `attach_a` | `.rodata+0x010` | First attachment argument |
| `attach_b` | `.rodata+0x018` | Second attachment argument |

The directly following pool `[0x1174,0x1180)` supplies `dispatch_ref`,
`config_b`, and a floating-point positive zero. Its first two words have
internal absolute relocations to the specified read-only segment offsets.
The other resource references are address arithmetic relative to `config_b`.
An independent implementation may name the references separately while
preserving those link identities. No dispatch table contents are specified.

### Initialization and service sequence

Preserve this order; services may have side effects. `object` means the pointer
returned by step 1. Uses of `W(object,...)` below mean reads at that stage,
not permanent cached values. `context` without that notation means the
original input context.

1. Call `E_0158(storage, context, 0, 0)` and retain its pointer result as
   `object`.
2. Install `dispatch_ref` at offset 0, store the original `context` at offset
   116, and perform the following direct initialization. Unlisted bytes are
   not directly initialized by this step.

   | Offset | Width | Value |
   | ---: | ---: | --- |
   | 120 | 1 | 0 |
   | 128 | 4 | 0 |
   | 132, 133, 134 | 1 each | 0 |
   | 136 | 4 | `initial_word` |
   | 140, 144, 148 | 4 each | 0 |

3. Call `E_0160(object, context, 1)`; its result is unused.
4. Call `E_0168(object, context, 0, 2, config_a, 3, config_b, 2, 91, 1, 0, 9)`.
   This is a sequence of twelve word arguments: the first four in core
   argument registers, the remaining eight on the stack. Its result is unused.
5. Call `H_0AC8(object, 0)`. This local dependency must
   be preserved, not replaced with a no-op. Its private control flow includes
   a mode selection and resource-dependent service calls; its implementation
   and referenced resource contents remain outside this accepted-boundary
   contract.
6. Enter `E_0070` immediately after `H_0AC8`, without preparing arguments.
   Consequently its incoming result/first-argument register retains the local
   helper's result. It is unresolved whether `E_0070` is argument-free or
   consumes that value; preserve this potential dependency in a boundary
   harness instead of assigning a definitive zero-argument prototype.
   Pass the result of `E_0070` to `E_0170`. Pass that result as the
   second argument of
   `E_0178(W(object,92), result, 0, attach_a, W(object,116), 0)`.
   The final result is unused.
7. Call `E_0180(object)`, then call
   `E_0188(W(object,92), result, 0, 0, attach_b, W(object,116), 0)`.
   The final result is unused.
8. Perform these four pairs of calls in the displayed order. Each second
   call receives the result of its immediately preceding selector call:

   | Selector | Following service |
   | --- | --- |
   | `E_0190(object,1)` | `E_0198(result,1)` |
   | `E_0190(object,0)` | `E_0198(result,0)` |
   | `E_0190(object,1)` | `E_01A0(result,0)` |
   | `E_0190(object,0)` | `E_01A0(result,0)` |

9. Call `E_01A8(W(object,92), 0, 0, 1, 1)`; its result is unused.
10. Prepare the descriptor specified below. Obtain its first word by calling
    `E_0180(object)` and its second by calling `E_01B0(object)`.
    Call `E_01B8(W(object,92),0)` and copy exactly 36 bytes from its returned
    pointer into descriptor offsets 8 through 43. The returned pointer is
    dereferenced without a null check.
11. Invoke `E_01C0` with an explicit 12-byte output buffer, `object`, 0, and
    42 (`0x2A`). The output buffer is the first core-register argument, followed
    by the other three arguments. Copy those 12 result bytes into descriptor
    offsets 44 through 55. This can be modeled as an explicit-output helper;
    whether the original source used a hidden aggregate result parameter is
    unresolved. Set descriptor byte 72 to zero.
12. Call `E_0008(128, W(W(object,116),4))` and retain its result as
    `allocation`. If it is nonzero, replace it with the result of
    `E_01C8(allocation, descriptor_address)`. If it is zero, skip `E_01C8`.
    Store the resulting value, including zero or a different pointer returned
    by `E_01C8`, at object offset 128.
13. Return `object`. There is no cleanup or error-return branch in this body.

The words at offsets 92 and 116 are reloaded when used. In particular, the
original context is used in steps 1–4; later reads through offset 116 can
observe changes made by intervening services. The descriptor's context fields
are read before its accessor/copy/output-helper calls. The allocator's context
field is read again afterward.

### Temporary descriptor passed to E_01C8

Offsets below are relative to the descriptor's beginning. A representation
covering 84 bytes accommodates the observed fields and word alignment; the
callee's full read extent is not proved by the caller. Use separately modeled
fields and opaque subobjects rather than importing a proprietary type.

| Offset | Size | Observed initialization/final value |
| ---: | ---: | --- |
| 0 | 4 | Result of the descriptor-building call to `E_0180(object)` |
| 4 | 4 | Result of `E_01B0(object)` |
| 8 | 36 | Exact copy from `E_01B8(W(object,92),0)` |
| 44 | 12 | Initially three positive-zero single-precision values; subsequently replaced by the 12-byte output of `E_01C0` |
| 56 | 4 | `W(W(object,116),4)` |
| 60 | 4 | `W(W(object,116),8)` |
| 64 | 4 | `W(W(object,116),16)` |
| 68 | 4 | 16 |
| 72 | 1 | Initially 1, subsequently 0 before allocation |
| 73 | 3 | Unspecified padding; no direct initialization observed |
| 76 | 4 | All bits set, interpreted here as an uninterpreted 32-bit value |
| 80 | 1 | 1 |
| 81 | 1 | 1 |
| 82 | 2 | Unspecified padding; no direct initialization observed |

The scalar defaults, context-field values, and initial zero triple are prepared
before the descriptor accessors and 36-byte copy. The word at offset 68 is
assigned 16 again before completion. No pointer to the descriptor is passed to
the earlier services. Preserve specified fields and service ordering without
treating padding values as an API requirement. There is no evidence here for
the meaning, ownership, or lifetime of the copied 36-byte subobject.

### Link binding for opaque services

These are neutral anonymous-import destinations, all in segment 0 of the
loader's static module. The numeric identities allow a separate linker or
validator to bind authored declarations without recovering names. Do not
inspect those destinations to implement this unit under this handoff.

| Local veneer alias | Static segment-relative destination |
| --- | ---: |
| `E_0008` | `0x0023480` |
| `E_0070` | `0x004E348` |
| `E_0158` | `0x023DF9C` |
| `E_0160` | `0x023DA5C` |
| `E_0168` | `0x023DDAC` |
| `E_0170` | `0x000E088` |
| `E_0178` | `0x0262508` |
| `E_0180` | `0x03C4C04` |
| `E_0188` | `0x02619F0` |
| `E_0190` | `0x03C4BDC` |
| `E_0198` | `0x0271C10` |
| `E_01A0` | `0x0271BF8` |
| `E_01A8` | `0x02611D8` |
| `E_01B0` | `0x03C4BF0` |
| `E_01B8` | `0x02623D8` |
| `E_01C0` | `0x03C4B48` |
| `E_01C8` | `0x025C448` |

The generated target object's anonymous import identities, rather than these
short aliases, remain authoritative for relocation comparison. The local
`H_0AC8` binding is within this module, not an import. Linking these entries is
distinct from claiming their veneer instructions as reconstructed functions.

## Relocations, data, and unclaimed coverage

The complete `.text` partition accounts for all 5,384 bytes without holes:

| Classification | Ranges | Bytes |
| --- | ---: | ---: |
| Accepted functions | 2 | 604 |
| Unclaimed executable gaps | 86 | 3,944 |
| Literal/data pools | 81 | 444 |
| Objectively unknown residue | 11 | 392 |

The first 496 text bytes comprise 62 import-veneer instruction words alternating
with 62 four-byte relocation slots. These remain gaps and pools, respectively,
not accepted functions. The other 19 pools account for 196 bytes. There are
100 text relocation words in total, all wholly pool-owned, leaving 44 pool
bytes without relocation outputs. Neither accepted body contains a relocation
output word; the larger function nevertheless depends on the following pool
and on imported/local call destinations.

The parsed module has 186 absolute type-2 relocation outputs: 81 import
references and 105 internal segment references. Their distribution is:

| Output segment | Imported target | Internal text | Internal rodata | Internal data | Internal BSS | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `.text` | 62 | 12 | 23 | 1 | 2 | 100 |
| `.rodata` | 19 | 54 | 13 | 0 | 0 | 86 |

There are 76 distinct imported identities and two exports. No relocation
outputs occur in `.data` or `.bss`. Preserve relocation identities and wrapping
32-bit addends; do not substitute guessed runtime addresses. The converter
rejects unsupported relocation forms rather than silently discarding them.

Other segment sizes are `.rodata` 932 bytes, `.data` 4 bytes, and zero-initialized
`.bss` 76 bytes. None is independently reconstructed by this handoff. Their
contents, including dispatch/resource tables, must stay unmatched. The combined
data denominator is 1,456 bytes: 444 pool bytes plus these three segments.

Unknown text intervals remain exactly as follows; all ends are exclusive:

| Start | End | Bytes |
| ---: | ---: | ---: |
| `0x067C` | `0x069C` | 32 |
| `0x0728` | `0x0730` | 8 |
| `0x078C` | `0x079C` | 16 |
| `0x07E4` | `0x07EC` | 8 |
| `0x0824` | `0x0880` | 92 |
| `0x0888` | `0x0890` | 8 |
| `0x0898` | `0x08A8` | 16 |
| `0x093C` | `0x0964` | 40 |
| `0x13A4` | `0x1428` | 132 |
| `0x142C` | `0x144C` | 32 |
| `0x1450` | `0x1458` | 8 |

A code-looking fragment, possible control-flow table, export, or adjacent pool
is not sufficient evidence to reclassify any unknown interval. Retain the
partition's isolation of this residue and the payload-free base placeholders.

The checked-in report has two functions, 604 accepted code bytes, eight matched
code bytes, one matched function, no matched data, and `complete: false`.
Its displayed `.text` section size of 4,548 is accepted bodies plus executable
gaps; it is not the accepted-function denominator. Report function addresses
are not the original CRO offsets. No additional matching claim follows from
this document.

## Validation performed and implementation recommendations

Performed, read-only, on this unit:

- Input identity/hash validation and deterministic structural conversion
  comparison: passed.
- `validate-cro-symbols.mjs` against the public CSV and verified structural
  object: passed, two functions and 604 body bytes.
- `validate-cro-function-semantics.mjs` against that object and the checked-in
  partition using GNU ARM objdump 2.44: passed, 81 pools and 100 text relocations.
- Independent comparison of partition sums, relocation ownership/counts,
  accepted entries, service arguments, and descriptor field accesses.

For an implementation role working from this specification:

1. Keep the existing leaf claim separate. Its current store validator pins a
   one-function source shape and relocation-free object; adding the initializer
   to that file without adapting the validator will fail for structural reasons.
   Test the leaf with sentinels around offset 217 and values exercising byte
   truncation. Assert that no surrounding byte changes.
2. Implement the initializer using original C, explicit-width fields, and
   declarations bound to the neutral dependencies above. Keep `H_0AC8` and
   resource references unresolved until independently specified or supplied by
   an appropriate link boundary. Do not fabricate their implementations or
   data to obtain a passing build.
3. Use a recording service harness to verify the complete call order and word
   arguments. Exercise allocation failure, successful allocation returning an
   unchanged pointer, a different pointer returned by `E_01C8`, and a zero
   result returned by that constructor. Every case returns `object`; the final
   value stored at offset 128 follows the specified service results.
4. Have the initial service return a pointer different from `storage`. Have
   intervening services mutate object fields 92 and 116 to verify the later
   reloads. Check original-context arguments separately from reads through
   the object. Check initialization timing and each direct store's width.
5. Supply distinct sentinel patterns for the 36-byte copied subobject and
   12-byte output. Inspect defined descriptor fields at `E_01C8`; do not assert
   padding contents or impose guessed interpretations on opaque words.
6. Build with the repository's freestanding C11 ARMv6K/MPCore ARM settings
   (`-Os`, soft floating-point ABI, function/data sections, no builtins, PIC,
   unwind tables, or stack protector), then compare an authored object with
   the independently verified split target. These are the current repository
   compilation settings, not evidence that GCC was the original compiler.
   Behavior equivalence and compiler-output matching are separate gates.
7. Validate symbol sizes, modes, section identities, calls, literal references,
   and relocations before claiming a match. Exact matching of the initializer
   will also require independently authored handling of its adjacent literal
   pool and link references; a body-only or unresolved-resource scaffold is
   insufficient evidence. Check the current builder/report interfaces before
   extending claims; this analysis does not change them.
8. Keep all gaps, unknown residue, and unimplemented data unmatched. Run the
   clean-repository check and inspect authored artifacts for private-path or
   string leakage before any eventual commit. Approval, implementation
   provenance, and progress-report changes belong to later work.

Unresolved matters are the complete object types and ownership rules, imported
callee implementations and source-level signatures (including possible result
forwarding into `E_0070`), the local helper's accepted
extent and full contract, resource/dispatch contents and extents, the other
exported entry, all remaining code boundaries, and runtime/device behavior.
These do not justify invented functions, table contents, data credit, or a
completed-unit claim.
