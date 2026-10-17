# DllUSPassage implementation evidence (unintegrated)

`construct_objects.S` is an independent IMPLEMENTATION candidate for
`func_000013BC`, based only on the approved neutral contracts:

- [`DllUSPassage_AS_EUR_REV2.md`](../../../docs/specs/cro/DllUSPassage_AS_EUR_REV2.md)
- [`DllUSPassage_func_000013BC.md`](../../../docs/specs/cro/DllUSPassage_func_000013BC.md)

No local environment settings, game/CRO inputs, target objects, target
instructions, private reports, or analyst scratch inputs were consulted.
The existing `contract_10.S` is unchanged.

The second implementation round emits exactly **204 ARM instructions / 816
bytes**, with zero relocations and no embedded payloads, adjacent literals,
veneer bodies, or padding. Assembly-time assertions enforce all specified call
sites, branch sites/destinations, literal-load sites, loop and return boundaries.
The code uses the specified preserved registers, 208-byte frame, partial stack
initialization, callback reloads, scalar VFP schedule, and seven architectural
no-ops. This is a schedule-conforming semantic candidate, **not an exact match**.

Final body SHA-256:
`fd142db2ee0b88a5fb4eaa852acda6e55588a27c3d08a8577b91fece8eb87df9`.
Required SHA-256:
`29fdcae73468ad66dba3dd60de6b32cae142afbacc16f44f8aa6bb120bc95da1`.
The required digest was used only as the final acceptance check. It did not
supply instruction differences or drive a search over encodings. The candidate
preserves the neutral schedule, but the specified operations still permit
choices of temporary registers, addressing forms and instruction ordering;
the failed digest supplies no information identifying which choices differ.

**Integration is disabled.** `config/cro-sources.json`, `package.json`,
`scripts/build-base.sh`, and `scripts/validate-cro-contract-10.mjs` were restored
to HEAD. Config retains only `func_000019F4`; report generation cannot claim
this unmatched candidate. Its source and focused validator/tests remain only
as independently reproducible semantic evidence. There is no progress, report,
completion, data, pool, or veneer credit. Full linking remains blocked by the
unowned dependencies described in the original brief.

Run the standalone checks directly (there are deliberately no package hooks):

```sh
node scripts/validate-cro-dll-uspassage.mjs
bash scripts/test-cro-dll-uspassage.sh
```

The shell test obtains the pinned ARM compiler and Python with Unicorn through
Nix, assembles only authored sources in a temporary directory, and runs isolated
and synthetic composite ELF rejection checks plus **22 synthetic ARM/VFP
execution cases**. These cover zero count, all exclusions, separate scan/packed
indices, a synthetic seventh entry, every allocation failing, a returning shared
failure service, ignored per-entry initialization failure, signed lookups,
persistent/overlapping position scratch, context/resource/instance mutations,
volatile register and flag destruction, exceptional floats and rounding,
return-register behavior, saved registers/d8, stack depth/alignment, and
ARM/Thumb returns. Tests provide synthetic services, vtables, names and literals;
no real resource data is copied. Uninitialized padding and position scratch
remain poisoned rather than being silently initialized.

For installed tools, the equivalent command is:

```sh
node scripts/validate-cro-dll-uspassage.mjs --self-test \
  --compiler /path/to/arm-none-eabi-gcc --python /path/to/python-with-unicorn
```

The evidence validator pins the authored source/body for reproducibility and
rejects any accidental reintroduction of this candidate into config/package/
build/contract gates. `--require-exact` deliberately exits nonzero because the
required digest has not been achieved. A passing semantic check is never an
exact-match claim. The separately authored analysis spec remains untouched.
