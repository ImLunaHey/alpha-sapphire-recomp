# ARM runtime/helper batch 115

## Scope and provenance

Analysis and original assembly implementation for AS_EUR_REV2, observed on
2026-10-17 with GNU Arm binutils 2.44 and Node.js 24.21.0. Evidence is the
ignored private executable, ignored authoritative target ELF and local objdiff
report, public neutral function inventory, and recursive source/config ownership
scan. No SDK, proprietary source, assets, or game text is used. This combined
analysis/implementation is clean-room-ready work, not a two-party clean-room
claim.

Three source-unowned, report-unmatched, unique ARM leaves have entries in
`[0x00540000, 0x00580000)`. Own 436 instruction bytes and 16 adjacent numeric
literal bytes (452 total), with 109 ARM instructions, ten internal branches,
five return sites, and no calls, indirect dispatch, symbolic identities, aliases,
or relocations. The leaves preserve all modified callee-saved core registers.

| Function | Body | Owned | Next global | Adjacent numeric words |
| --- | ---: | ---: | --- | --- |
| `func_00540704` | 92 | 100 | `func_00540768` | +92: float 2^-23; +96: float zero |
| `func_00548C14` | 180 | 184 | `func_0054971C` | +180: float 32 |
| `func_00572B94` | 164 | 168 | `func_00572C3C` | +164: signed division multiplier `0x2AAAAAAB` |

Only these intervals are owned. In particular, the large gap after the second
interval is excluded. Literal pools immediately follow each function's declared
size and are data, never additional ARM instructions or independent entries.

## Behavior and exact schedules

The configuration records every instruction's offset and operation. All widths
are four bytes. Preserve the recorded register assignments, order, signed versus
unsigned comparisons, condition codes, flag updates, rounding, shifts, and
multiply destination order. Local branches must retain their exact target
offsets; no instruction may be replaced with an equivalent sequence.

`func_00540704` computes the single-precision difference `s0 - s1` in `s2`,
loads positive zero into `s4` and 2^-23 into `s3`, and compares the difference
with zero using an exceptional VFP comparison followed by a transfer of FPSCR
flags. It next compares `s0` with zero; the conditional negation of `s2` at
+24 uses the previous core flags, before the next FPSCR transfer at +28.
Negate `s0` under carry-clear, multiply by the tolerance, and compare it with
`s2`. Branch on signed greater-or-equal from +48 to +84. Otherwise compare
`s1` with zero, transfer flags, conditionally negate `s1`, multiply it by the
tolerance into `s0`, compare with `s2`, and transfer flags again. Set `r0` to
zero under signed less-than at +76 and branch under that condition to the
return at +88. The remaining path sets `r0` to one at +84. Preserve exceptional
comparison and unordered/NaN behavior through the exact flag sequence.

`func_00548C14` loads a float from `r0 + 24`, float 32 from its pool, and a
record pointer from `r0 + 32`. Divide input `s0` by the loaded float, multiply
by 32, convert toward zero to signed integer in `s1`, and transfer to `r1`.
Compare the first unsigned halfword with `r1`; unsigned-higher returns the
record pointer immediately at +40. Otherwise save `r4` in four stack bytes,
load the halfword count at `r0 + 14`, form the last six-byte record address,
and compare its unsigned halfword with `r1`. Unsigned-higher-or-same selects
that address and branches to +148. Otherwise derive an initial record index
with single-precision signed conversion, two multiplies, unsigned conversion,
and scaled address arithmetic. A comparison at +128 selects the forward scan
at +156 under carry-set. The backward scan at +136 pre-decrements the pointer
by six and continues under unsigned-higher; the forward scan pre-increments
by six and continues under unsigned-lower-or-same. The backward exit restores
`r4` and returns at +152. The forward exit restores `r4`, subtracts six from
the pointer, and returns at +176. Preserve the early return before the save.

`func_00572B94` saves `r4`–`r7` in 16 stack bytes, reads the end pointer from
`r0 + 4` and beginning pointer from `r0`, and copies the end pointer to `r5`.
Equal pointers branch from +20 to the restore at +156. Otherwise load the
signed reciprocal multiplier, copy the beginning pointer to `r3`, and compare
end against `r3`. Under unsigned-lower-or-same set `r1` to zero and skip to
+64. The alternate path subtracts the pointers, performs signed long multiply
into low `r6`/high `r1`, shifts high right arithmetically by one, subtracts its
sign extension, and retains the low bit. From +64, repeat the signed division
schedule into low `r7`/high `r6`, increment the quotient and `r1`, and compare
signed. Signed-less-or-equal branches to +128. Otherwise recompute the quotient
using low `r6`/high `r3`; increment it and advance `r1` by two until signed
less-or-equal (the loop repeats under signed greater-than). At +128 recompute
the original pointer difference and quotient into low `r3`/high `r1`, form
`r1 - (r1 << 2)`, add four times that result to the original end pointer,
and store at `r0 + 4`. Restore `r4`–`r7` and return at +160. Keep the
apparently redundant arithmetic and the unused copy into `r5`.

## Evidence and ownership audits

Before writing the lane, each complete body was checked against all 10,440
inventory bodies: each has exactly one occurrence. Source definitions and
aliases were scanned recursively, and every configured function's body/adjacent
interval was checked for overlap. All selected entries lack a source owner and
have a local report entry below 100% match. The target ELF's function size,
zero ARM entry value, `$a` mapping, and bytes agree with the private executable.
Independent assembly must reproduce all 452 owned bytes, including literals.

Scan every inventoried ARM/Thumb body for direct branches/calls (including
Thumb BL/BLX), PC-relative core/VFP literal loads, and address formation. Also
scan aligned executable-container words as conservative possible pointers.
The only external direct reference found is from `func_00423D84 + 64` to
`func_00572B94 + 0` in ARM state. All other detected inbound references are
this lane's ten internal branches and four literal loads. No external interior
entry or shared adjacent literal was found. These finite static audits do not
claim to resolve dynamically computed addresses.

## Object and validation contract

ELF32 little-endian ARM ET_REL, version one, System V identification, exactly
EABI5 `0x05000000`, no entry point or program headers. Exact ARM attributes:
CPU `6K`, architecture v6K, ARM ISA, Thumb-1 ISA, VFPv2. Each unique
`.text.<function>` section is SHT_PROGBITS, flags exactly ALLOC|EXECINSTR,
address zero, alignment four, and the owned size above. Each has exactly one
canonical local section symbol, local `$a` at zero, local `$d` at body end,
and default-visible global STT_FUNC at zero with body size. The null symbol
is canonical, and the global set is exactly the three functions. No extra
symbols, REL/RELA sections (even empty), DYNSYM, or foreign nonempty executable
payload is allowed. No section payload overlaps headers, another payload, or
the section table. Local labels resolve within sections without relocation.

Pin the exact source, raw and normalized configuration, and specification.
Reject byte/metadata/state/pool/branch/return changes, extra ownership, aliases,
and malformed ELF. Cap file bytes at 64 MiB before reading, executable bytes
at 16 MiB, sections at 16,384, aggregate SYMTAB+DYNSYM entries at 1,000,000,
and aggregate REL+RELA entries at 1,000,000. Hostile self-tests must exercise
all caps through the parser, altered instructions/literals/mappings/symbols,
ELF headers/attributes/sections, unexpected relocation forms, truncation and
out-of-bounds/overlapping payloads. Accept a valid fixture with 12,000 unrelated
empty executable sections. Finish with standalone validation, authoritative
private byte comparison, renewed ownership audit, and `git diff --check`.
