# CRO contract 10

Contract 10 adds one exact ARM function to eight genuine CRO units, with all battle modules and all contract-09 units excluded. It owns 2,612 code bytes (653 instructions) and no data, literal pools, padding, or neighboring bytes.

| Unit | Function | Address | Size |
| --- | --- | ---: | ---: |
| `DllCommWait` | `func_00000808` | `0x0808` | 328 |
| `DllFieldEventSecretBaseMyBasePc` | `func_00003644` | `0x3644` | 368 |
| `DllFieldEventSlopeSlip` | `func_00000308` | `0x0308` | 344 |
| `DllStartMenu` | `func_000014D4` | `0x14D4` | 416 |
| `DllUSAreaTenji` | `func_0000007C` | `0x007C` | 292 |
| `DllUSGymFighting` | `func_000006FC` | `0x06FC` | 152 |
| `DllUSGymFire` | `func_00000DCC` | `0x0DCC` | 224 |
| `DllUSPassage` | `func_000019F4` | `0x19F4` | 488 |

Names, addresses, sizes, and ARM mode come from the public neutral CSV inventories. The source uses readable mnemonics and contains no encoded instruction or data directives. Each emitted section was compared byte-for-byte with its authoritative private reference and is pinned in the validator by SHA-256. The validator also requires exact public ownership, one global symbol and executable section, zero relocations, and no extra allocated bytes.

`DllCommWait`, `DllFieldEventSecretBaseMyBasePc`, `DllStartMenu`, and `DllUSPassage` retain unclaimed accepted functions. The other four units each have one accepted public function, so this contract completes their accepted-function inventory, but it deliberately claims no data and therefore does not claim a fully linked unit.

Four isolated-object semantic diff scores are reduced by references to deliberately unowned neighboring literals or external sections: `DllFieldEventSecretBaseMyBasePc` 94.78261%, `DllFieldEventSlopeSlip` 97.209305%, `DllUSAreaTenji` 94.246574%, and `DllUSPassage` 99.508194%. Their owned section bytes nevertheless match exactly. The remaining four functions score 100% in isolated semantic comparison.

## Validation and integration

Before integration, compile the eight sources with the pinned ARM toolchain into a staging directory, then run:

```sh
node scripts/validate-cro-contract-10.mjs \
  --manifest config/cro-contract-10-proposal.json \
  --object-directory <staging-directory> \
  --readelf <pinned-arm-readelf>
```

Merge each proposal unit unchanged into the alphabetically sorted `units` array in `config/cro-sources.json`, register the validator in the normal package and build validation flows, and rebuild. After integration, run the validator without `--manifest` so it checks the standard configuration. The proposal remains the machine-readable batch ownership record.
