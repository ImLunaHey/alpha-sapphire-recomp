# Probe-verified Thumb batch 03

## Provenance

- Target: `AS_EUR_REV2`
- Analyst observation date: 2026-10-15
- Evidence: remaining Thumb-mode functions in the evidence-gated inventory, independently inspected from the privately held executable
- Search range: every previously unspecified Thumb routine from 8 through 100 bytes, prioritizing arithmetic, accessors, and leaf routines
- Validation: a temporary portable-C probe compiled with GCC 15 for ARMv6K Thumb mode produced an exact function match

No disassembly, target bytes, proprietary symbols, or SDK material are included in this specification.

## Unsigned-key maximum selection

### `func_002FFE4A`

- Inventory size: 12 bytes.
- Signature shape: accepts two pointers to objects whose first field is an unsigned 32-bit key and returns one of those object pointers.
- Behavior: returns the second object only when the first object's key is strictly less than the second object's key. Ties retain the first object.
- Signedness: compare both keys as unsigned 32-bit values.
- Effects: reads the first 32-bit field of each object; performs no writes and makes no helper calls.
- Exact probe status: verified byte-for-byte with GCC 15.2 using the repository's ARMv6K Thumb compilation preset.

### Required portable source shape

The exact probe used a minimal structure containing only an unsigned 32-bit first field. Both parameters and the return type were mutable pointers to that same structure type.

Express the selection as one direct conditional-expression return, with the comparison oriented from the first argument to the second:

```c
return first->key < second->key ? second : first;
```

Keep the true result as the second argument and the false result as the first argument. Although reversing the comparison or spelling the selection as separate `if` and `return` statements is behaviorally equivalent, GCC 15.2 chooses a different control-flow and return-register shape for those forms under this preset.

## Acceptance criteria

- Implement the named routine in portable C with an explicit unsigned 32-bit key field.
- Preserve the first argument on equal keys.
- Use the direct conditional-expression form and comparison orientation documented above.
- Do not use inline assembly, embedded target bytes, proprietary names, or SDK declarations.
- Compile as Thumb code for ARMv6K with optimization enabled and validate the routine independently with objdiff.
