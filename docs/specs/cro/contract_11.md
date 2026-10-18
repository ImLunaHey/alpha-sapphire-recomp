# CRO contract 11

Contract 11 adds exact, independently scoped ARM functions to the listed
low-credit non-battle CRO units. It deliberately owns no data, literal pools,
padding, or neighboring function bytes.

| Unit | Function | Address | Size | Behavior |
| --- | --- | ---: | ---: | --- |
| `DllField` | `func_0006B434` | `0x6B434` | 20 | optional callback tail-call |
| `DllGts` | `func_0000BED0` | `0x0BED0` | 60 | linked-list transfer |
| `DllKawaigari` | `func_00000C78` | `0x00C78` | 12 | default dispatch |
| `DllSangoZukan` | `func_0002A830` | `0x2A830` | 24 | eight-byte fill |
| `DllSkyTrip` | `func_00008048` | `0x08048` | 60 | three-component vector normalization |
| `DllTitle` | `func_0001C3C8` | `0x1C3C8` | 20 | title-global clear |

Names, addresses, sizes, and ARM mode come from the repository's public neutral CSV inventories. Every source uses readable mnemonics and contains no encoded instruction or data directive. Calls, tail-calls, and literal references outside an owned boundary retain their exact PC-relative encodings without importing or relocating the referenced bytes.

Each retained emitted section in the table was compared byte-for-byte with its authoritative private reference section. The validator pins those bytes by SHA-256, verifies the exact public boundary and disjoint ownership, requires one global function symbol per claim, rejects relocations and extra allocated sections, and confirms that every retained listed unit has additional unclaimed functions. Every retained listed unit therefore remains incomplete, and data remains unmatched.

## Validation and integration

Compile the listed sources with the pinned ARM toolchain into a staging directory, then run:

```sh
node scripts/validate-cro-contract-11.mjs \
  --manifest config/cro-contract-11-proposal.json \
  --object-directory <staging-directory> \
  --readelf <pinned-arm-readelf>
```

For integration, merge each proposal source and function into its existing unit in the alphabetically sorted `units` array of `config/cro-sources.json`. Preserve all existing unit claims and copy the proposal entries unchanged. Register the validator in the normal package and build validation flows, rebuild, then run the validator without `--manifest` against the standard configuration. The proposal remains the machine-readable batch ownership record.

`DllPokeList` is excluded because its former source and ownership claim lacked
auditable strict two-party provenance. See `DllPokeList_blocker.md`.
