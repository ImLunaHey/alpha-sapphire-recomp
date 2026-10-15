# ARM adjacent-literal returns 07

## Provenance

- Target: `AS_EUR_REV2`
- Evidence source: independently observed behavior from the verified private target
- Analysis tools: GNU Arm Embedded `15.2.Rel1` disassembly and compilation, objdiff CLI `2.5.0`
- Analysis date: 2026-10-15
- Analyst role: behavior/specification only; no implementation source was consulted

## Audited common shape

Each of the 42 functions ignores the incoming argument registers, loads one 32-bit
word from the immediately adjacent aligned literal slot, returns that word in `r0`,
and has no other observable side effect. This common instruction shape does **not**
by itself prove that the returned word is an address.

The earlier version of this specification incorrectly described all 42 words as
addresses of storage objects. A second audit classified each word against the
half-open executable segment ranges recorded in
`config/targets/AS_EUR_REV2.json`. Thirty-eight words lie within one declared
process-image segment. Four lie outside every declared segment and are scalar
values, so they must not be converted into synthetic relocations merely to obtain
an objdiff match. Direct-caller inspection corroborated the distinction: sampled
in-segment results are dereferenced or forwarded as addresses, while out-of-segment
results are stored or forwarded as scalar fields and size-like arguments. No literal
word or private address is recorded here.

The 38 address identities are pairwise distinct. Their labels are local neutral
identifiers and do not encode an address. A text identity may designate code, a
linker-defined boundary, or another addressable image location; the audit does not
claim that it is an object pointer.

| Segment class | Function and neutral identity |
| --- | --- |
| text | `func_0010EE70` → `opaque_02`; `func_00124248` → `opaque_06`; `func_001C4624` → `opaque_13` |
| read-only data | `func_001CA790` → `opaque_27`; `func_001CA7B4` → `opaque_28`; `func_001CE5AC` → `opaque_29`; `func_001CE5F0` → `opaque_30`; `func_001CF654` → `opaque_31`; `func_004C4030` → `opaque_42` |
| initialized data | `func_00164F74` → `opaque_07`; `func_001C3E0C` → `opaque_11`; `func_001C3E18` → `opaque_12`; `func_001C4630` → `opaque_14`; `func_001C463C` → `opaque_15`; `func_001C4D94` → `opaque_16`; `func_001C4DA0` → `opaque_17`; `func_001C4DAC` → `opaque_18`; `func_001C4DB8` → `opaque_19`; `func_001C4DC4` → `opaque_20`; `func_001C4DD0` → `opaque_21`; `func_001C4EAC` → `opaque_22`; `func_001C4EB8` → `opaque_23`; `func_001C4EC4` → `opaque_24`; `func_001C4ED0` → `opaque_25`; `func_001C4EDC` → `opaque_26`; `func_0040AC94` → `opaque_39`; `func_00410484` → `opaque_40` |
| zero-initialized data | `func_00109B78` → `opaque_01`; `func_0010F278` → `opaque_03`; `func_0010F284` → `opaque_04`; `func_0010F290` → `opaque_05`; `func_00179DD0` → `opaque_08`; `func_00186EB8` → `opaque_09`; `func_0019523C` → `opaque_10`; `func_00201EDC` → `opaque_32`; `func_002B0D50` → `opaque_35`; `func_002FED78` → `opaque_37`; `func_002FF7EC` → `opaque_38` |

The following four functions are excluded from the address implementation and
relocation mapping. Their exact scalar behavior requires a separate approved
behavior specification; this document intentionally does not expose their private
literal words.

- `func_0020B92C`
- `func_0020B938`
- `func_002CD4CC`
- `func_0045CECC`

## Neutral relocation mapping

The proposed tracked input is
`config/target-literal-identities/AS_EUR_REV2.json` with this minimal schema:

```json
{
  "version": 1,
  "armAdjacentAbsoluteLiterals": {
    "func_00109B78": "opaque_01"
  }
}
```

The production file should contain the 38 audited function-to-identity pairs above
and no scalar entry. Function labels and opaque IDs are neutral relationship facts;
the file must contain no target literal, address, byte sequence, or addend.

At private target-build time, the generator must reject an entry unless all of the
following hold:

1. the inventory entry is ARM mode and eight bytes long;
2. its two instructions have the approved adjacent-literal-return shape;
3. the aligned four-byte slot immediately after the inventory body is in bounds and
   does not overlap another inventoried function;
4. the private word belongs to one of the manifest's declared text, read-only data,
   initialized-data, or zero-initialized-data ranges; and
5. equality of opaque IDs exactly matches equality of private words across all
   configured entries.

For a configured function, target assembly must retain its existing
`.text.<function>` executable section, ARM mode, four-byte alignment, and global
function symbol. It emits the two private instructions, closes the `.size` at eight
bytes, and then emits `.word <opaque-id>` in the same section. The section is 12
bytes, while the function symbol remains the inventoried eight bytes. The adjacent
word has one `R_ARM_ABS32` relocation at section offset 8 against a global undefined
zero-size `NOTYPE` opaque symbol. The private word is never emitted.

The clean-room base implementation should use textual assembly with the same
eight-byte function extent and adjacent relocated word outside that extent. This is
the same representation used for the project's linker veneers and avoids treating
literal-pool data as matched executable code. The build must check the base section,
function size, relocation type, offset, and opaque identity explicitly: objdiff 2.5.0
accepted a representative pair whose relocation target names differed, so a 100%
objdiff score alone does not prove identity preservation.

## Probe and progress-accounting result

A representative three-function C probe generated the intended instructions and
`R_ARM_ABS32` literal relocations, but GCC included the words in 12-byte function
symbols. Against the original eight-byte target symbols it scored 50%. A second
neutral probe placed each relocated word outside matching eight-byte target and base
function extents. All three functions scored 100%, contributing 24 matched code
bytes rather than 36.

An ignored full-inventory prototype then reconstructed the 38 approved relocations
using the outside-extent representation. ELF inspection found 38 eight-byte symbols
and 38 `R_ARM_ABS32` relocations at section offset 8, with no rejected identity or
segment check. The target remains at 10,440 functions and 2,197,028 inventoried code
bytes. Exact implementations contribute eight matched code bytes each; the adjacent
words preserve relocation identity without inflating the code denominator.
