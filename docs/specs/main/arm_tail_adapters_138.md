# ARM tail adapters 138

This batch covers 19 independently specified ARM leaves totaling 340
executable bytes and 85 instructions. Eighteen adapters reshape arguments,
perform short field or flag operations, or copy fixed-size values before a
symbolic tail transfer. One leaf returns a PC-relative address directly.

The tail transfers use 18 `R_ARM_JUMP24` relocations to 15 already public
branch identities; four select reviewed secondary-entry addends. The batch has
no calls, literal pools, padding, or adjacent payload. Validation pins every
boundary, semantic schedule, destination identity and addend, source owner,
and aggregate size while keeping target bytes and private disassembly out of
the repository.
