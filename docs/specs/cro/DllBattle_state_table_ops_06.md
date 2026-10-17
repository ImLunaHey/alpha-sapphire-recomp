# DllBattle state and table operations batch 06

This clean-room batch reconstructs eleven public ARM functions from
`cro/DllBattle` for `AS_EUR_REV2`. The functions release optional owned
objects through their public virtual interfaces, normalize small state values,
clear and initialize bounded record tables, scan paired records, and pack
normalized values. It claims 1,700 bytes (425 ARM instructions) and no data,
literal pools, relocations, or imports.

The public boundaries are:

- `func_0004EB74` — 212 bytes, release seven optional owned slots;
- `func_0004ED84` — 116 bytes, normalize an index according to its mode;
- `func_0004EE5C` — 176 bytes, release one selected group of owned slots;
- `func_00058470` — 96 bytes, release an owner and clear six records;
- `func_0006F6DC` — 196 bytes, search paired halfword records;
- `func_0007275C` — 148 bytes, count packed variable-length records;
- `func_00073808` — 136 bytes, initialize an eleven-record table;
- `func_00075894` — 164 bytes, test membership in three normalized kinds;
- `func_00075B70` — 140 bytes, find an index in paired word records;
- `func_00076890` — 140 bytes, normalize and pack three kinds; and
- `func_0007A1A0` — 176 bytes, initialize a variable-record cursor.

`scripts/validate-cro-dll-battle-state-table-ops-06.mjs` pins the source and
per-function SHA-256 hashes, public inventory boundaries, instruction counts,
section order and metadata, mapping and function symbols, and the absence of
relocations, undefined globals, allocated data, opaque byte directives, and
private/ROM paths. With `--target`, it compares every authored section with
the ignored authoritative split target. `--composite` permits unrelated
sections in the linked `DllBattle.o` while continuing to require an exact,
unique, relocation-free section for every function in this batch.

Hostile fixtures reject bad ELF identity and machine values, truncation,
resource-limit violations, instruction changes, section growth, allocated
foreign data in standalone mode, undefined globals, relocation sections, and
duplicate ownership. The suite also links and accepts a foreign executable
section larger than this entire batch in explicit composite mode, guarding
against validators that accidentally require this batch to own the whole CRO.

The authoritative comparison passes all eleven functions at exactly 1,700 of
1,700 bytes. This is function-code credit only. `cro/DllBattle` remains
incomplete, and all data and unclaimed code remain unmatched.

For integration, append `{ "path":
"src/cro/DllBattle/state_table_ops_06.S", "mode": "arm" }` and the eleven
manifest function entries (using `name`, `address`, `size`, and `semantics`)
to the existing sorted `DllBattle` entry in `config/cro-sources.json`. Retain
all prior ownership and do not mark the unit complete. Register the validator
after batch 05, run its standalone hostile test, and validate the linked
`build/AS_EUR_REV2/base/cro-code/DllBattle.o` with `--composite`.
