# CRO target batch

The public CRO inventory is the authority for the private target-object batch. Generate all 145 structural target objects with:

```sh
node scripts/generate-cro-target-objects.mjs
```

The driver reads `progress/units/AS_EUR_REV2.cro.json` and requires an exact corresponding set of `Dll*.cro` files beneath `$DECOMP_PRIVATE/cro-modules`. It rejects missing or extra modules, non-regular files, size differences, SHA-256 differences, invalid manifest fields, and a CRO whose internal module name differs from its public unit name beyond ASCII letter case. The case allowance preserves the cartridge's sole `DllEshop.cro`/`DllEShop` spelling difference without weakening whole-file identity. `static.crs`, `static.crr`, and the private inventory are allowed support files but are not target units.

Every private module is verified before conversion starts. Outputs are built in a new staging directory and published as the complete `build/AS_EUR_REV2/target/cro` directory only after all conversions succeed. A failed conversion removes the staging directory and preserves the previously published batch. Both the CRO files and generated ELF objects remain ignored private artifacts.

Verify that the published batch is complete and byte-for-byte deterministic without changing it:

```sh
node scripts/generate-cro-target-objects.mjs --check
```

`--check` rejects missing, extra, symlinked, or stale target objects. It reconverts every manifest-approved module in memory and compares the result with the published object.

The ROM-free regression suite uses three synthetic byte strings and an injected deterministic converter to exercise the manifest, set, hash, stale-output, module-identity, and transactional-publication gates:

```sh
node --check scripts/generate-cro-target-objects.mjs
node --check scripts/test-generate-cro-target-objects.mjs
node scripts/test-generate-cro-target-objects.mjs
```

These structural objects preserve real module sections, exports, imports, and relocations, but do not by themselves prove function boundaries or matching progress. See `docs/CRO_TARGET_OBJECTS.md` for the converter's format contract and progress limitations.
