# ARM scalar literal returns

## Provenance

- Target: `AS_EUR_REV2`
- Evidence source: independently observed function-boundary behavior and direct-caller use in the verified private target
- Analysis tools: GNU Arm Embedded `15.2.Rel1` disassembly and assembly probes
- Analysis date: 2026-10-15
- Analyst role: behavior/specification only; no implementation source was consulted

## Scope and classification

This audit covers seven input-independent ARM routines whose result is derived from
an adjacent PC-relative scalar literal. It includes the four scalar cases excluded
from `arm_opaque_address_returns_07.md`. None of the literal values below belongs to
a declared process-image segment, and none is an address identity.

The integer signedness of a bare 32-bit return cannot be recovered from the callee
alone. The specification therefore uses exact-width bit patterns except where the
caller proves a wider return convention. Direct callers store or forward the first
two packed values as ordinary fields, forward `0x00002370` as a size-like argument,
and compare `0x0000270F` with a positive counter. This corroborates scalar, rather
than address, behavior without assigning speculative domain names.

| Function | Mode | Function size | Observable result |
| --- | --- | ---: | --- |
| `func_0020B92C` | ARM | 8 bytes | Return the 32-bit bit pattern `0x00030003` in `r0`; ignore all arguments. |
| `func_0020B938` | ARM | 8 bytes | Return the 32-bit bit pattern `0x00080004` in `r0`; ignore all arguments. |
| `func_002CD4CC` | ARM | 8 bytes | Return the 32-bit value `9072` (`0x00002370`) in `r0`; ignore all arguments. |
| `func_0045CECC` | ARM | 8 bytes | Return the 32-bit value `9999` (`0x0000270F`) in `r0`; ignore all arguments. |
| `func_0010945C` | ARM | 12 bytes | Return the 64-bit value `0x00000000000011C5`, low word in `r0` and high word in `r1`; ignore all arguments. A direct caller stores the `r0:r1` pair as one doubleword. |
| `func_00188538` | ARM/VFP | 12 bytes | Load the exact binary32 bit pattern `0x10000000` into `s0`, multiply `s0` by itself using VFP binary32 arithmetic, and return the resulting `s0` value. Arguments are ignored; normal VFP status/exception effects of the multiply remain observable. |
| `func_00195AE0` | ARM/VFP | 12 bytes | Load the exact binary64 bit pattern `0x1000000000000000` into `d0`, multiply `d0` by itself using VFP binary64 arithmetic, and return the resulting `d0` value. Arguments are ignored; normal VFP status/exception effects of the multiply remain observable. |

The VFP return classification is corroborated by direct callers that consume `s0`
or `d0` immediately after the call. It is intentionally stated as a register-level
interface rather than assuming a public soft-float C ABI.

## Exact assembly constraints

The four eight-byte functions use this independently assembled mnemonic shape,
with the table's function name and 32-bit constant substituted:

```asm
.section .text.<function>,"ax",%progbits
.balign 4
.arm
.global <function>
.type <function>, %function
<function>:
    ldr r0, .Lliteral_<function>
    bx lr
.size <function>, .-<function>
.Lliteral_<function>:
    .word <constant>
```

`func_0010945C` has this twelve-byte function extent:

```asm
func_0010945C:
    ldr r0, .Lliteral_func_0010945C
    mov r1, #0
    bx lr
.size func_0010945C, .-func_0010945C
.Lliteral_func_0010945C:
    .word 0x000011C5
```

The two VFP functions have these mnemonic bodies and adjacent data layouts:

```asm
func_00188538:
    vldr s0, .Lliteral_func_00188538
    vmul.f32 s0, s0, s0
    bx lr
.size func_00188538, .-func_00188538
.Lliteral_func_00188538:
    .word 0x10000000

func_00195AE0:
    vldr d0, .Lliteral_func_00195AE0
    vmul.f64 d0, d0, d0
    bx lr
.size func_00195AE0, .-func_00195AE0
.balign 8, 0
.Lliteral_func_00195AE0:
    .word 0x00000000
    .word 0x10000000
```

Each `.size` ends before its literal pool (and before the explicit alignment word
for the binary64 case), so adjacent data must not increase matched-code accounting.
An ignored assembler probe confirmed that these textual mnemonics produce the
observed instruction forms, PC-relative distances, function sizes, and zero-filled
binary64 alignment slot without embedding target instruction words in this spec.

## Exclusions

The same bounded scan found `func_0010420C`, a four-byte Thumb adjacent-literal
return, but its word is an in-segment address and is excluded from this scalar spec.
Routines that load a hardware or process-image address and then dereference it are
also excluded. Other routines that merely use PC-relative constants internally are
not constant-return functions and are outside this batch.
