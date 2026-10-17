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

All 145 manifest-listed CROs are published in the tracked objdiff report.
Together with `main/code`, they expose all 146 known executable link
boundaries. The CROs currently contribute 4,400 independently accepted neutral
function boundaries and 1,522,592 accepted function-body bytes to the report
denominator. Forty-four CROs have no accepted function boundary yet; they are
still published as genuine incomplete link units with zero functions, and no
placeholder is synthesized.

Publication is structural progress, not a decompilation claim. DllPhotoSaver
provided the first reviewed clean-room CRO function. The current verified
snapshot credits 255 exact functions and 11,828 code bytes across 96 CRO units:
52 byte-store leaves (including DllPhotoSaver), 29 POD leaves across 14 units,
45 DllBattle leaf accessors, and 21 DllField leaf accessors. These groups may
share a unit, so their unit counts are not additive. A further eight POD and
numeric helper functions contribute 460 bytes across seven previously
zero-credit modules. Contracts 06 and 07 add 18 exact functions and 748 bytes
across ten modules, including eight previously zero-credit units. Contract 08
adds eight exact functions and 1,052 bytes across eight more previously
zero-credit modules. Contract 09 adds eight exact functions and 1,744 bytes
across eight more previously zero-credit modules. Five DllBattle batches add
58 exact functions and 3,196 bytes within that already-credited unit. Contract
10 adds eight exact functions and 2,612 bytes across eight more previously
zero-credit modules. The other 49
CROs receive zero credit, and matched CRO
data remains zero. Unclaimed code and all data stay unmatched. Every CRO
remains incomplete and no CRO earns completed-unit credit. Further work
replaces skeleton sections with reviewed clean-room source while keeping each
validated module boundary and neutral partition intact.
