# Probe-verified duplicate ARM templates 82

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `a2cf8d851d65faa9e4d329fa6296adbe210e2d3c97d2e7b5590487ef86a55ae1`.
- Probe tool: GNU assembler from Arm GNU Toolchain 15.2.Rel1, binutils
  2.45.1.20251203.
- Evidence: the current objdiff report, the evidence-gated symbol inventory,
  repository-wide ownership exclusion, direct-transfer-normalized complete-body
  grouping, bounded target control-flow and post-body inspection, branch
  resolution, and an independent assembly probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  values, extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function name already
owned by configuration was excluded. At this point the remaining exact
duplicate inventory is nearly exhausted. The larger residual 148-byte pair,
the residual 28-byte pair, and all residual 8- or 12-byte call cohorts were
rejected because each inventoried body ends on a link call and therefore does
not prove a complete independently returnable body. The selected two ARM-state
functions are still unmatched, pairwise non-overlapping, and form one complete
two-member tail-transfer template. They comprise 16 executable and owned bytes
and four instructions.

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Fixed mode-five tail | 2 | 8 | 16 |

The schedule contains two symbolic direct tail transfers. It contains no
calls, local branches, indirect transfers, returns, literal loads, literal
slots, post-body address references, or adjacent owned data.

## Function map and boundaries

| Function | Body | Next global | Relative offset | Ownership |
| --- | ---: | --- | ---: | --- |
| `func_0029F368` | 8 | `func_0029F370` | +8 | body only |
| `func_0029F40C` | 8 | `func_0029F418` | +12 | body only; +8..+11 unowned |

Both body-ending branches are unconditional non-link transfers to the same
four-byte-aligned primary ARM entry, `func_0013335C`. That destination class
was already used by the fixed-mode template in duplicate batch 80; this batch
adds no destination identity. The four bytes between the second body and its
next global are unreachable from the selected body and explicitly remain
unowned. There are no secondary-entry or address-identity relations.

## Complete normalized schedule

Equivalent formatting is allowed, but the operands, instruction order,
relocation kind, symbolic destination, function size, and ownership boundary
are exact.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

@ Fixed mode-five tail (8 bytes; two members)
    mov r1, #5
    b {tail}
```

## Per-function transfer schedule

| Function | Offset | Kind | Mnemonic | Symbolic destination | Role |
| --- | ---: | --- | --- | --- | --- |
| `func_0029F368` | +4 | `R_ARM_JUMP24` | `b` | `func_0013335C` | `tail` |
| `func_0029F40C` | +4 | `R_ARM_JUMP24` | `b` | `func_0013335C` | `tail` |

## Canonical schedules

Canonical records use configuration function order, increasing decimal
offsets, resolved symbolic roles, LF joining, and a final LF. Empty schedules
hash one final LF. The record formats are normative in the neutral config.

| Schedule | Records | SHA-256 |
| --- | ---: | --- |
| Instruction | 4 | `075fb9c67b82d5d90bcc173cc6e77e5d2d289778c57c4f10aa4a3606bc2ad485` |
| Local transfer | 0 | `01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b` |
| Relocation | 2 | `4f01570d944d05f8ee1eeee58ee20ab44fd6aa5ae21c32ef1c8cbabeda7bbbd9` |
| Literal identity | 0 | `01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b` |

## Independent verification and implementation contract

The mnemonic schedule was assembled independently with GNU `as`. Both probe
sections were exactly eight bytes, each exposed one `R_ARM_JUMP24` relocation
at +4 to the stated symbol, and the two probe bodies were byte-identical. A
bounded target audit confirmed the exact body schedules, unconditional branch
destinations, symbol boundaries, next-global boundaries, and the absence of
owned post-body material. The current report marks both functions unmatched,
and a repository-wide configuration scan found no prior ownership collision.

Implement `src/main/arm_duplicate_templates_82.S` without access to the
private target, report, symbol inventory, disassembly, probe products, other
authored implementation sources, or ROM-derived artifacts. Export exactly the
two named global function symbols, one per executable function section, with
eight-byte function sizes and the schedule above. Emit no literal pool or
adjacent data. The implementation source SHA-256 recorded above must remain
identical in this specification and the neutral config.
