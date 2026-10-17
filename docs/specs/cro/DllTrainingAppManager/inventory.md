# DllTrainingAppManager executable inventory

## Import trampoline region

`0x000..0x13F` is exactly 40 repetitions of a four-byte ARM indirect jump
followed by a four-byte relocated address slot. Each trampoline loads the word
immediately following itself into the program counter. The table below gives
the code address and anonymous static-module import identity for each slot.

| Code | Pool | Imported static segment/offset |
| ---: | ---: | --- |
| `0x000` | `0x004` | `s0:0x3288B8` |
| `0x008` | `0x00C` | `s0:0x3288B4` |
| `0x010` | `0x014` | `s0:0x32852C` |
| `0x018` | `0x01C` | `s0:0x023480` |
| `0x020` | `0x024` | `s0:0x32D510` |
| `0x028` | `0x02C` | `s0:0x32D508` |
| `0x030` | `0x034` | `s0:0x32C1F4` |
| `0x038` | `0x03C` | `s0:0x328AD0` |
| `0x040` | `0x044` | `s0:0x328598` |
| `0x048` | `0x04C` | `s0:0x32C5C0` |
| `0x050` | `0x054` | `s0:0x3281B8` |
| `0x058` | `0x05C` | `s0:0x328660` |
| `0x060` | `0x064` | `s0:0x328B88` |
| `0x068` | `0x06C` | `s0:0x32D018` |
| `0x070` | `0x074` | `s0:0x3285A4` |
| `0x078` | `0x07C` | `s0:0x3287BC` |
| `0x080` | `0x084` | `s0:0x328DB4` |
| `0x088` | `0x08C` | `s0:0x328C30` |
| `0x090` | `0x094` | `s0:0x32D900` |
| `0x098` | `0x09C` | `s0:0x328438` |
| `0x0A0` | `0x0A4` | `s0:0x05066C` |
| `0x0A8` | `0x0AC` | `s0:0x32D97C` |
| `0x0B0` | `0x0B4` | `s0:0x32875C` |
| `0x0B8` | `0x0BC` | `s0:0x328D44` |
| `0x0C0` | `0x0C4` | `s0:0x32CA48` |
| `0x0C8` | `0x0CC` | `s0:0x02B8FC` |
| `0x0D0` | `0x0D4` | `s0:0x31B3CC` |
| `0x0D8` | `0x0DC` | `s0:0x1FF8C0` |
| `0x0E0` | `0x0E4` | `s0:0x04E348` |
| `0x0E8` | `0x0EC` | `s0:0x3D0748` |
| `0x0F0` | `0x0F4` | `s0:0x269E90` |
| `0x0F8` | `0x0FC` | `s0:0x2B34C4` |
| `0x100` | `0x104` | `s0:0x268B50` |
| `0x108` | `0x10C` | `s0:0x0E7C0C` |
| `0x110` | `0x114` | `s0:0x261064` |
| `0x118` | `0x11C` | `s0:0x260F18` |
| `0x120` | `0x124` | `s0:0x2B2470` |
| `0x128` | `0x12C` | `s0:0x260FD0` |
| `0x130` | `0x134` | `s0:0x2610B0` |
| `0x138` | `0x13C` | `s0:0x0397B8` |

## Local function and pool map

The `Code bytes` column excludes embedded/trailing pools. A logical function
with two code fragments has one entry point and one continuation after its
jump table; the continuation is not a callable function.

| Function | Code fragments | Code bytes | Embedded/trailing pool |
| --- | --- | ---: | --- |
| `func_00000140` | `0x140..0x147` | 8 | none |
| `func_00000148` | `0x148..0x18F`, `0x1B8..0x303` | 404 | ten-word jump table `0x190..0x1B7` |
| `func_00000304` | `0x304..0x34F`, `0x374..0x55B` | 564 | nine-word jump table `0x350..0x373` |
| `func_0000055C` | `0x55C..0x577` | 28 | none |
| `func_00000578` | `0x578..0x59F` | 40 | none |
| `func_000005A0` | `0x5A0..0x5A7` | 8 | none |
| `func_000005A8` | `0x5A8..0x653` | 172 | address word `0x654..0x657` |
| `func_00000658` | `0x658..0x6FF` | 168 | address word `0x700..0x703` |
| `func_00000704` | `0x704..0x8E7` | 484 | none |
| `func_000008E8` | `0x8E8..0x8EF` | 8 | none |
| `func_000008F0` | `0x8F0..0x8F7` | 8 | none |
| `func_000008F8` | `0x8F8..0xA1F` | 296 | two address words `0xA20..0xA27` |
| `func_00000A28` | `0xA28..0xAC7` | 160 | two address words `0xAC8..0xACF` |
| `func_00000AD0` | `0xAD0..0xB6B` | 156 | two address words `0xB6C..0xB73` |
| `func_00000B74` | `0xB74..0xB77` | 4 | none |
| `func_00000B78` | `0xB78..0xBAB` | 52 | address word `0xBAC..0xBAF` |
| `func_00000BB0` | `0xBB0..0xBDF` | 48 | address word `0xBE0..0xBE3` |
| `func_00000BE4` | `0xBE4..0xBEB` | 8 | none |
| `func_00000BEC` | `0xBEC..0xBF3` | 8 | none |
| `func_00000BF4` | `0xBF4..0xC6F` | 124 | scalar/address pool `0xC70..0xCA7` |
| `func_00000CA8` | `0xCA8..0xCBB`, `0xCD0..0xD2F` | 116 | five-word jump table `0xCBC..0xCCF`; 40-byte literal/address pool `0xD30..0xD57` |

Local executable total: 2,864 bytes. Import trampoline code: 160
bytes. Total executable content: 3,024 bytes (756 ARM instructions).

## Range verification hashes

These hashes are for the pre-relocation bytes and let an implementation-side
validator check exact layout without publishing target bytes.

| Start | Size | SHA-256 |
| ---: | ---: | --- |
| `0x000` | `0x140` | `42f651bfe93d8b444635d87ed8144ec7210b6ae196ac3ce1afc187cba9cea984` |
| `0x140` | `0x008` | `007f34a6c3441b0240da53f253e513b959105da2d8803255e1856aa48f48db47` |
| `0x148` | `0x048` | `4a692c679f358e8f9a9fd7ff3120426fcc31018f1138d20e703e0f0e6a9107f5` |
| `0x190` | `0x028` | `2c34ce1df23b838c5abf2a7f6437cca3d3067ed509ff25f11df6b11b582b51eb` |
| `0x1B8` | `0x14C` | `a54e3d211ff3fc3ca11d0fe18cb160761d4a2924788e3f529cba8b149ec90ab6` |
| `0x304` | `0x04C` | `900d1564b98a57e0a0c096e4cce339d29a695d78cad68fa6e5d40d3f033e7bb1` |
| `0x350` | `0x024` | `6db65fd59fd356f6729140571b5bcd6bb3b83492a16e1bf0a3884442fc3c8a0e` |
| `0x374` | `0x1E8` | `830496e3f27c9179b71331b3a9b60a8ab9b5e1b8be3aa2c1cf3a33ff0a68b04e` |
| `0x55C` | `0x01C` | `7868d5f2ba3a0674e5e7ac104e9eb3b050697e5f44e58729f5915307db8a8940` |
| `0x578` | `0x028` | `410ae60fd5c4acd7e90e4b80d77f687015e3933f7a5ea076c70e408b444db0ff` |
| `0x5A0` | `0x008` | `007f34a6c3441b0240da53f253e513b959105da2d8803255e1856aa48f48db47` |
| `0x5A8` | `0x0AC` | `783d92d17571fd410253058ec5e367988406d8795bdefb781055446ee6c2170b` |
| `0x654` | `0x004` | `df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119` |
| `0x658` | `0x0A8` | `bde37b606410bfb723e7d9d82ff59e2a6025554b003a1f75b98c22ffe1421181` |
| `0x700` | `0x004` | `df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119` |
| `0x704` | `0x1E4` | `38fbf525e90a4f12b84aef55c518908ff0ce0c23ed3380670a98a7a212244b72` |
| `0x8E8` | `0x008` | `007f34a6c3441b0240da53f253e513b959105da2d8803255e1856aa48f48db47` |
| `0x8F0` | `0x008` | `007f34a6c3441b0240da53f253e513b959105da2d8803255e1856aa48f48db47` |
| `0x8F8` | `0x128` | `ed1988e063014c8a5a1821fa959649a15dcdfd2b1275c93aae0285457f063da5` |
| `0xA20` | `0x008` | `af5570f5a1810b7af78caf4bc70a660f0df51e42baf91d4de5b2328de0e83dfc` |
| `0xA28` | `0x0A0` | `3827ba7da997c0f7533e7eb090a0649a80f6c2a6ca5356f66ea89e2b2b511301` |
| `0xAC8` | `0x008` | `af5570f5a1810b7af78caf4bc70a660f0df51e42baf91d4de5b2328de0e83dfc` |
| `0xAD0` | `0x09C` | `e974e447666105210d5580607795992a69b3b58ce428ede33c36285217b3fe76` |
| `0xB6C` | `0x008` | `af5570f5a1810b7af78caf4bc70a660f0df51e42baf91d4de5b2328de0e83dfc` |
| `0xB74` | `0x004` | `379bec29dccd0a93c94826144d7ef6e42fab64ef195a3b8313a16926f66f388f` |
| `0xB78` | `0x034` | `35b6bdc5f5457f331d66453330d3244faec93f8aac40a8a05409af9e3a0ae756` |
| `0xBAC` | `0x004` | `df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119` |
| `0xBB0` | `0x030` | `aaa21c234b4421451637a68edfbb9003a1f1a56b4fb5e07decb9390956131f82` |
| `0xBE0` | `0x004` | `df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119` |
| `0xBE4` | `0x008` | `e589c5df8f2165646b76d51210e582481e4ce9fcf143a96f4c61de56bf2e5e12` |
| `0xBEC` | `0x008` | `007f34a6c3441b0240da53f253e513b959105da2d8803255e1856aa48f48db47` |
| `0xBF4` | `0x07C` | `ffffd00a76bb2cd2b538693db803071e623261092f5b4d7518c43c487a74038d` |
| `0xC70` | `0x038` | `c2ff06f44ca304a504cdde75f4d09d87994a5d66ae42cb487b8ca355cd1c343a` |
| `0xCA8` | `0x014` | `d354f6231d0117c94d6cadc81c07f710cf32306924ea71c539770f09139be214` |
| `0xCBC` | `0x014` | `de47c9b27eb8d300dbb5f2c353e632c393262cf06340c4fa7f1b40c4cbd36f90` |
| `0xCD0` | `0x060` | `2600e3f459095f9ca4fc0a30731fac70633c04fa0a2877cacb92bda899ea41e6` |
| `0xD30` | `0x028` | `7bc37100661e6f6cc6952fe440fee6226eba572e82f142e481bb6dfe303242fd` |

