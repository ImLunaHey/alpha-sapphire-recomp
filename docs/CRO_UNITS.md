# CRO units

The title contains 145 independently loadable `Dll*.cro` modules. Each module is a genuine runtime-linking boundary, so it can become an independent objdiff/ByteMatch unit instead of an arbitrary subdivision of `main/code`.

## Private extraction

Configure `ROM_PATH` and `DECOMP_PRIVATE` in the ignored `.env.local`, then run:

```sh
node scripts/extract-cro-modules.mjs
```

The extractor reads the NCSD, NCCH, IVFC, and RomFS metadata directly and copies only the root `Dll*.cro` modules plus `static.crs` and `static.crr`. It writes them beneath `$DECOMP_PRIVATE/cro-modules`; it does not unpack the rest of RomFS. The image, modules, support files, and private inventory must never be committed.

## Public unit inventory

Generate the ROM-free inventory with:

```sh
node scripts/generate-cro-unit-manifest.mjs
```

The generated `progress/units/AS_EUR_REV2.cro.json` contains exactly 145 entries. A private `DllBattle.cro` becomes the stable logical unit name `cro/DllBattle`. The `cro/` namespace identifies the executable format without implying a source-tree directory. Each entry exposes only that name, the container size, and a SHA-256 identity; support files, source paths, timestamps, offsets, and module bytes are omitted.

After regeneration, verify that the checked-in inventory is current and run its ROM-free unit tests:

```sh
node scripts/generate-cro-unit-manifest.mjs --check
node scripts/test-cro-unit-manifest.mjs
bash scripts/check-no-rom.sh
```

The inventory establishes real unit identity and boundaries. It does not claim that a module has been decomposed or linked; that status must come from its eventual objdiff result.

## Publication status

Every manifest-listed CRO is published in the tracked objdiff report. Together
with `main/code`, they expose all known executable link boundaries. Each CRO
contributes only independently accepted neutral inventory to the report
denominator. A CRO without an accepted function boundary is still published as
a genuine incomplete link unit, and no placeholder is synthesized.

Publication is structural progress, not a decompilation claim. DllPhotoSaver
provided the first reviewed clean-room CRO function. Current credit comes from
reviewed source families and focused unit work backed by the publication gates.
DllHologramMail and DllPssMessageWindow source and credit are withdrawn for
insufficient provenance; DllPCMenu is quarantined for the same reason. Their
neutral inventories remain and these units stay blocked and incomplete.
Unclaimed code and all CRO data stay unmatched. Every
CRO remains incomplete and no CRO earns completed-unit credit. Further work
replaces skeleton sections with reviewed clean-room source while keeping each
validated module boundary and neutral partition intact.
