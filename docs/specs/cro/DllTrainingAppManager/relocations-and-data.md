# DllTrainingAppManager relocations and non-code data

All relocations are `R_ARM_ABS32`. Addends are the pre-relocation word values.
The target has 51 import patches and 64 internal relocations.

## `.text` pools

- Every pool word at `0x004, 0x00C, ..., 0x13C` relocates with addend zero to
  the corresponding anonymous import in `inventory.md` (40 import patches).
- Jump table `0x190`: ten relocations to text continuation `0x1B8` with
  addends `0x000, 0x014, 0x03C, 0x084, 0x09C, 0x0B4, 0x0C0, 0x0D8,
  0x10C, 0x134`.
- Jump table `0x350`: nine relocations to text continuation `0x374` with
  addends `0x000, 0x014, 0x0D4, 0x10C, 0x158, 0x160, 0x178, 0x1AC,
  0x1D4`.
- `0x654` and `0x700`: `.rodata+0xA4`.
- `0xA20`: `.rodata+0xC0`; `0xA24`: `.rodata+0xA4`.
- `0xAC8`: `.rodata+0xC0`; `0xACC`: `.rodata+0xEC`.
- `0xB6C`: `.rodata+0xC0`; `0xB70`: `.rodata+0xEC`.
- `0xBAC` and `0xBE0`: `.rodata+0xEC`.
- `0xC78`: `.bss+0x00`; `0xC9C`: `.bss+0x28`.
- Jump table `0xCBC`: five relocations to continuation `0xCD0` with addends
  `0x00, 0x08, 0x10, 0x1C, 0x2C`.
- Pool `0xD30..0xD57`:

| Address | Relocation/addend or raw value |
| ---: | --- |
| `0xD30` | `.data+0` |
| `0xD34` | raw zero |
| `0xD38` | self-pool symbol at `0xD30` plus `0x24` |
| `0xD3C` | self-pool symbol at `0xD30` plus `0x28` |
| `0xD40` | `.rodata+0x104` |
| `0xD44` | `.rodata+0x104` |
| `0xD48` | raw `0x30000000` |
| `0xD4C` | raw `0x30000026` |
| `0xD50` | raw `0xD8E12C21` |
| `0xD54` | relocation to function entry `0xBF4`, addend zero |

The scalar-only part of `0xC70..0xCA7` contains float32 values in address
order: `0.7, 1.0, 0.0, 0.75, 1.45, -0.8, 0.95`, then the relocated BSS+0x28
word at `0xC9C`, then `120.0, 45.0`.

## `.rodata` layout

### RTTI descriptors and names (`0x00..0x9F`)

The first 40 bytes are five two-word RTTI/name descriptors with eleven
relocations overall across this region. Their exact word contract is:

| Offset | Target/addend |
| ---: | --- |
| `0x00` | anonymous import `s1:0x5A468 + 0x08` |
| `0x04` | `.rodata+0x28` |
| `0x08` | `.rodata+0x20` |
| `0x0C` | anonymous import `s1:0x5A468 + 0x08` |
| `0x10` | `.rodata+0x45` |
| `0x14` | anonymous import `s1:0x45DEC + 0x00` |
| `0x18` | anonymous import `s1:0x5A458 + 0x08` |
| `0x1C` | `.rodata+0x67` |
| `0x20` | anonymous import `s1:0x5A458 + 0x08` |
| `0x24` | `.rodata+0x80` |

Four NUL-terminated RTTI name strings occupy `0x28..0x98`. Their bytes are
not reproduced. This is their complete non-revealing identity:

| Start | Payload length | SHA-256 of payload (excluding NUL) |
| ---: | ---: | --- |
| `0x28` | 28 | `9ba5dd2e74feb588dc2b55083336152d61ce96398449c8b19ff795c7c3a2bd01` |
| `0x45` | 33 | `80041fa92d4903b7357a6c90e9b7dbe7b1d245598b3ef6a5f4e5890bcb06690c` |
| `0x67` | 24 | `03f04e78fc00cc4442ddadc8400f14b83710f94ce0e0b585015ab1f0ab513f95` |
| `0x80` | 24 | `fbfba85693326c0a6b35c1b8f9f02b01f0c0d93cdb982bd915d793cb4fbccf69` |

Bytes `0x99..0x9B` are three `0xFF` sentinel bytes; byte `0x9C` is zero.
Bytes `0x9D..0x9F` are zero alignment padding.

### Dispatch/vtable-like records (`0xA0..0x103`)

Every omitted word below is raw zero.

| Offset | Target/addend or raw word |
| ---: | --- |
| `0xA0` | `.rodata+0x00` |
| `0xA4` | function `0x658` |
| `0xA8` | function `0x578` |
| `0xAC` | function `0x578` |
| `0xB0` | function `0x578` |
| `0xB4` | function `0x140` |
| `0xB8` | raw zero |
| `0xBC` | `.rodata+0x0C` |
| `0xC0` | function `0xAD0` |
| `0xC4` | function `0xA28` |
| `0xC8` | function `0x704` |
| `0xCC` | function `0x704` |
| `0xD0` | anonymous import `s0:0x0E7C00` |
| `0xD4` | function `0x704` |
| `0xD8` | function `0xBEC` |
| `0xDC` | anonymous import `s0:0x0E7BF0` |
| `0xE0` | anonymous import `s0:0x0E7BE0` |
| `0xE4` | raw zero |
| `0xE8` | `.rodata+0x18` |
| `0xEC` | function `0xBB0` |
| `0xF0` | function `0xB74` |
| `0xF4` | anonymous import `s0:0x0048D7` |
| `0xF8` | anonymous import `s0:0x0048D7` |
| `0xFC` | function `0xB74` |
| `0x100` | anonymous import `s0:0x0048D7` |

The `s0:0x0048D7` identity is intentionally odd-valued and must remain so;
the relocation itself is ordinary ABS32.

## `.data` and `.bss`

`.data` is one four-byte zero word and has no relocation. It is read/written
by `func_00000CA8`.

`.bss` is 76 zero-initialized bytes and has no stored payload or relocations.
`func_00000BF4` populates two parameter blocks at offsets `0x00` and `0x28` as
specified in `functions.md`. All BSS bytes are thereby accounted for; the
unwritten first 12 bytes of block 1 deliberately remain zero.

