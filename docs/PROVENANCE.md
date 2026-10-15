# Target provenance

## AS_EUR_REV2

The project owner supplied a lawfully obtained European Pokémon Alpha Sapphire game-card image. Local inspection on 2026-10-15 established:

- NCSD/CCI title ID `000400000011C500`, product code `CTR-P-ECLA`
- CARD2 image, card revision 2, title version 3120
- application name `sango-2`, remaster version 3
- unencrypted NCCH (`NoCrypto` flag), compressed ExeFS code
- decompressed executable CRC32 `72B62B7F`

Only hashes, sizes, addresses, neutral container metadata, and provisional function boundaries are committed. The image, extracted ExeFS, executable, banners, icons, RomFS, generated target objects, and analysis databases remain outside the repository. [3dbrew's NCSD documentation](https://www.3dbrew.org/wiki/NCSD) defines the container and partition table; [the NCCH documentation](https://www.3dbrew.org/wiki/NCCH) defines the executable partition layout.

The CRC32 independently agrees with the public base-version identifier recorded by Universal Pokémon Randomizer ZX, but that project is used only as corroborating metadata, not as a source of implementation code.

## Tool provenance

Pinned external tooling is recorded in `config/tools.json`. The extraction path uses MIT-licensed `3dstool` plus a small original NCSD/NCCH slicer based on the public format documentation. `objdiff` is the authoritative match/progress calculator.

Ghidra 12.0.2 (Apache-2.0) imports the private executable as ARMv6K. The original scripts in `tools/ghidra/` restrict analysis to the exact executable range and export only direct-call targets with contiguous bodies, known ARM/Thumb mode, valid instruction alignment, and a terminal instruction. The resulting `symbols/code.bin.csv` is an address-sorted, validated heuristic inventory, not an assertion that every boundary is correct. The first evidence-gated inventory contains 10,440 accepted bodies covering 2,197,028 code bytes; 5,957 ambiguous, discontiguous, or weakly evidenced bodies were rejected.

Proprietary ARM compiler binaries, Nintendo SDK material, leaked symbols/source, and third-party assets are forbidden. A compiler must be user-supplied outside Git after its exact version is established empirically.
