# First loadable CRO milestone

The shortest path to loading authored code is not rebuilding the whole game.
It is replacing one small CRO in a locally owned game image while retaining
the original executable and every unrelated module.

## Recommended pilot: DllContestCommon

`DllContestCommon` is the best current pilot because its accepted function is
already matched and its remaining payload is small and fully classified:

| Material | Current state |
| --- | ---: |
| Accepted function code | 472 / 472 bytes matched |
| Classified executable gaps | 316 bytes across 8 ranges |
| Text pools | 84 bytes across 9 ranges |
| Read-only data | 24 bytes |
| Writable data | 4 bytes |
| Unknown text residue | 0 bytes |
| Original CRO container | 12,288 bytes |

The current build emits comparison-only ELF fragments. Those objects cannot be
loaded by the game because they deliberately omit the CRO container header,
module tables, exports, imports, patch lists, hashes, and all unowned payload.

## Work required

1. Complete the authored link unit.
   Implement the remaining 316 executable bytes, reconstruct the 84 text-pool
   bytes through symbolic identities and relocations, author the 24 read-only
   bytes and 4 writable bytes from reviewable evidence, and preserve the BSS
   layout. The completed ELF must reproduce every segment and relocation of the
   structural target object without copying proprietary payloads.

2. Add an ELF-to-CRO writer.
   The repository currently converts `CRO0` modules to structural ELF but has
   no reverse path. A writer must serialize the segment layout, named/indexed/
   anonymous imports, exports, relocation patch lists, string and metadata
   tables, and four header SHA-256 coverage regions. Synthetic fixtures should
   prove deterministic CRO-to-ELF-to-CRO structural round trips before it is
   used with private inputs.

3. Establish a lawful local loading path.
   Use a privately owned image and an emulator/debug environment or other
   authorized test loader. Signed-module support files (`static.crs` and
   `static.crr`) must remain private; the experiment must either preserve
   their required identity relationship or use a controlled development loader
   that explicitly permits the test module.

4. Run a visible smoke test.
   First load a byte-identical rebuilt module to prove packaging and linking.
   Then make a reversible, unmistakable behavior change in the private test
   build, confirm that the module reaches its natural call site, and capture
   loader/link errors without committing the game image, module, assets, keys,
   or extracted strings.

## Definition of done

The milestone is complete when a repository-built `DllContestCommon.cro` is
accepted by the local loader, all imports resolve, its initialization path
runs, and the original module can be restored without changing repository
state. ByteMatch's accepted-function percentage alone is not evidence of this:
the load test additionally requires full segment, relocation, metadata, and
container correctness.
