# CRO contract 09

Contract 09 retains one exact ARM function in each of six genuine CRO units that had no prior source credit. The proposal owns 1,408 code bytes (352 instructions) and intentionally owns no data, literal pools, padding, or neighboring function bytes.

| Unit | Function | Address | Size | Role |
| --- | --- | ---: | ---: | --- |
| `DllDendouPC` | `func_00001840` | `0x1840` | 172 | record finalization |
| `DllDialogCommon` | `func_000002C0` | `0x02C0` | 332 | dialog state update |
| `DllFieldEventFishing` | `func_00001058` | `0x1058` | 192 | fishing object setup |
| `DllFieldEventPokeRideAction` | `func_00000494` | `0x0494` | 304 | ride-action update |
| `DllLangSelect` | `func_00000EB0` | `0x0EB0` | 168 | language-layout update |
| `DllPssAssistPower` | `func_0000081C` | `0x081C` | 240 | assist-power lifecycle |

The names, addresses, sizes, ARM mode, and section ownership come from the repository's public neutral CSV inventories. Each assembly function uses readable mnemonics; no encoded instruction or data directive is used. Calls outside an owned boundary and references to unowned neighboring literals use fixed PC-relative encodings without creating relocations or importing those bytes.

Every emitted function section was compared byte-for-byte with its corresponding private reference section. The validator pins the resulting bytes by SHA-256, requires one exact global function symbol and executable section per unit, rejects relocations and any extra nonempty allocated section, and confirms that each public inventory contains additional functions. Consequently, none of these units is claimed function-complete, and no data completeness is claimed.

## Validation before integration

Compile the six `contract_09.S` files into a staging directory with the repository's pinned ARM toolchain. Then run:

```sh
node scripts/validate-cro-contract-09.mjs \
  --manifest config/cro-contract-09-proposal.json \
  --object-directory <staging-directory> \
  --readelf <pinned-arm-readelf>
```

The manifest-only form validates the proposal, public boundaries, source ownership, incomplete-unit invariant, and repository hygiene:

```sh
node scripts/validate-cro-contract-09.mjs --manifest config/cro-contract-09-proposal.json
```

## Integration

Merge each proposal unit into the alphabetically sorted `units` array in `config/cro-sources.json`. Each new unit receives its one `sources` entry and one `functions` entry unchanged. Register the validator in the normal CRO validation flow and add the six source paths to the CRO object build input. After integration, the validator's default manifest is `config/cro-sources.json`.

The proposal file remains the machine-readable ownership record. It must not be used to imply full linking: all six units retain unclaimed functions, and their data remains unmatched.

`DllGameClearSave` is excluded from this contract. Its former assembly body encoded a target-derived instruction schedule without a distinct-role, independently implementable behavioral specification. The source and ownership claim are quarantined; see `DllGameClearSave_blocker.md`.
