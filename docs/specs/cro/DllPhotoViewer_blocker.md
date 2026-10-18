# DllPhotoViewer direct-reverse-engineering completion

## Scope and behavior

This contribution implements the remaining accepted ARM function in
`cro/DllPhotoViewer`, `func_00000F20` at text offset `0x0F20` (596 bytes).
Together with the existing eight-byte leaf, this completes the unit's public
accepted-function inventory: two functions and 604 accepted code bytes.

The routine constructs and configures a photo-viewer object. It preserves its
three incoming arguments, initializes the object and embedded state, invokes
the module's common setup helpers, configures paired display resources, builds
a stack-resident render descriptor from owner fields, allocates the backing
resource, stores the resulting handle at object offset `0x80`, and returns the
object. Repeated helper calls and the order of resource setup remain explicit
in the symbolic assembly.

The function uses three adjacent literal-pool words outside its accepted
boundary and owns no relocation words. Its bounded instruction body is exactly
596 bytes with SHA-256
`5e7e55d14c203eb1d6cfd83d803274b28e59c1a2c6c13176de97738f9fb14a3a`.

## Provenance and limits

- Target: Pokémon Alpha Sapphire `AS_EUR_REV2`.
- Evidence: the public function inventory and partition, plus direct private
  inspection of the independently extracted target object.
- Tools: repository CRO converter/splitter, GNU Arm Embedded 14.2.Rel1, GNU
  binutils 2.44, and objdiff-cli 3.8.2.
- Observation date: 2026-10-18.
- Classification: direct reverse engineering. No leaked source, proprietary
  SDK material, copied byte tables, extracted assets, or target bytes are
  committed.

This completes only the accepted-function denominator. Executable gaps,
literal pools, read-only and writable data, BSS, relocations, and CRO container
metadata remain unowned, so `metadata.complete` must remain `false`.
