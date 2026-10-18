# DllWazaOboe clean-room evidence blocker

## Scope and public evidence

This record covers the published `cro/DllWazaOboe` unit at public baseline
`69f879dcd8649709d5f7b8a21cb092d70708ff5a`. `AS_EUR_REV2` identifies only
the intended repository target; the target was not inspected or executed.
This is a provenance audit and quarantine record, not a behavioral or
interface specification.

The audit was performed on 2026-10-18 by Luna using Git 2.53.0, Node.js
v24.21.0, ripgrep 15.2.0, and repository-public material: the clean-room
policy, neutral CRO inventory and partition, source registry, checked-in
report, contract 08 files, and their Git history. Generated base objects used
for validation contain only remaining public source built by the pinned GNU
Arm toolchain. No ROM, extracted asset, target binary, disassembly, private
output, proprietary SDK material, or copied implementation was accessed.

The neutral inventory accepts 24 provisional ARM function boundaries and the
partition accounts for the complete text container, but neither establishes
behavior. The checked-in report previously credited `func_000035D8` with one
exact function and 148 code bytes. Git history shows that commit
`cb94bf453049fc89badf9ea217c405ce3fcfb7c9` added the batch description, exact
instruction ledger, implementation, validator, source ownership, and match
claim together under one author and committer. It records no distinct analyst,
specification reviewer, target-blind implementer, or attributable independent
approval. This is a provenance deficiency, not an allegation of copying.

## Stop condition and withdrawal

The [clean-room stop condition](../../CLEAN_ROOM.md) therefore does not
authorize implementation from contract 08. Luna performed both this
public-evidence audit and the quarantine maintenance, so this contribution
also makes no independent analysis or implementation claim. The existing
assembly and its exact instruction ledger are removed rather than reused or
reworked.

Source ownership and the claim for `func_000035D8` are withdrawn with 148
matched code bytes and one matched function. All 24 neutral boundaries, the
unit's section identities and sizes, its 11,796-byte accepted-code denominator,
its 4,872-byte data denominator, and publication membership remain unchanged.
The unit returns to zero code, function, and data credit, has no authored
source path, and remains explicitly incomplete. This maintenance makes no
fresh target comparison, full-link, completion, or new ByteMatch-credit claim.

## Validation

The pinned public-source base build completed with 82 CRO base units and 352
total source objects. Contract 08 object validation retains seven functions,
904 code bytes, 226 ARM instructions, zero relocations, and zero adjacent
owned bytes; no `DllWazaOboe` source or object claim remains. The fresh
contract validator also rejects `DllWazaOboe` ownership in either the
integrated or proposal manifest. Its fail-closed absence tests reject an
ordinary restored file, a dangling symlink, and a deterministic non-`ENOENT`
inspection failure under both manifest selections. The fresh
complete build-tree digest is
`88e270da5dce912523488b91db5fbdc5d2135cb15d01307ec1a483631ac471c1`.
It is the SHA-256 of the lexicographically sorted manifest of all 435 regular
files below `build/AS_EUR_REV2/base`, with each entry encoded as its relative
path, a NUL byte, the lowercase SHA-256 of its contents, and a trailing NUL.

Publication validation and hostile fixtures pass with 146 units, 14,840
functions, 4,240 exact functions, 415,664/3,719,620 matched code bytes
(11.174904823303223%), 415,676 fuzzy-matched bytes
(11.175227165222168%), and 2,121,692 data bytes. The prepared ByteMatch report
is byte-identical to the tracked report, whose SHA-256 is
`e789eeba3d14358769ce88a2d822beafaba1261334a013699ecd92db9cd47aef`.
`cro/DllWazaOboe` specifically reports 0/24 matched functions, 0/11,796
matched code bytes, zero matched data, and `complete: false`. The full
repository check, clean-boundary/no-ROM check, and whitespace check pass.

## Reopening requirements

A distinct analysis contributor must provide a provenance-complete neutral
behavioral and interface specification. It must identify the observer, date,
verified target revision, tool versions, reproducible external observation
method, inputs and initial conditions, observable outputs and state effects,
boundary and failure cases, repeatability, and uncertainties. Public sources
must be linked and separated from direct observations. The handoff must not
contain target bytes, instruction schedules, private-derived layouts, or
implementation details.

That handoff and this blocker require durable, attributable independent review
before a separate target-blind implementer may write original source. Any
later credit additionally requires the pinned deterministic build, authorized
comparison evidence, focused object and report validation, and all repository
publication and safety gates. Until those requirements are met, clean-room
implementation for this unit is blocked.
