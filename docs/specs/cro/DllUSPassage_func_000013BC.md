# cro/DllUSPassage: func_000013BC (AS_EUR_REV2)

## Scope and provenance

This is a strict clean-room **analysis specification**, not implementation source. Its sole implementation subject is the accepted function `func_000013BC` in `cro/DllUSPassage`. No file under `src/cro/DllUSPassage` was opened or edited. No proprietary source, SDK material, target instruction listing, encoded instructions, strings, or table contents are reproduced here. Helper names below denote neutral addresses, not inferred original names or contracts.

Evidence was independently observed on 2026-10-17 from the user-supplied external verification input configured through the root checkout's ignored environment settings. No private location is recorded here. The external CRO passed the repository parser's structural and four-region hash checks and matched the public inventory: container size **20,480 bytes**, SHA-256 **64376f24f024c96cbe249746bc089d47b999cd6367918829912df7d582b1fdc0**. Repository baseline: `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.

Public evidence: [clean-room protocol](../../CLEAN_ROOM.md), [public module manifest](../../../progress/units/AS_EUR_REV2.cro.json), [function inventory](../../../symbols/cro/DllUSPassage.csv), and [complete partition](../../../symbols/cro-partitions/DllUSPassage.json). Tools: Node.js **v24.21.0**, repository `parseCro`/`convertCroToElf`, and GNU ARM objdump **2.44**, explicitly selecting **armv6k** to interpret architectural no-ops and register-indirect calls correctly. The body alone was also independently decoded as a raw bounded slice. There were **204 contiguous four-byte instructions**, no undefined instructions, and no in-body relocation outputs. Temporary verification artifacts were private and removed after inspection. No gameplay execution or equivalence claim is made.

All behavior below is observed locally at this function boundary. Descriptive words such as allocation, construction, predicate, position, and matrix are conveniences inferred from usage; the neutral helper identities remain authoritative. No external platform-documentation claims are needed.

## Identity and ABI

- Revision: **AS_EUR_REV2**; module `.text` size **0x26F4**.
- Entry: section-relative **0x13BC**, ARM state, four-byte alignment.
- Accepted instruction-body extent: **[0x13BC, 0x16EC)**, exactly **0x330 / 816 bytes**. The last instruction starts at **0x16E8** and returns through the saved program counter.
- The following **[0x16EC, 0x16F8)** is a separately owned 12-byte pool. It is not part of the function size. Do not enlarge the accepted function to absorb it.
- Input: `r0 = O`, a writable object pointer. Incoming `r1`–`r3` and incoming floating-point arguments are not consumed as inputs.
- Pointers and ordinary words are 32-bit little-endian quantities. Arithmetic/index formation wraps at 32 bits. Unless specifically identified otherwise, field operations are word loads/stores.
- Preserve incoming `r4`–`r11`, `d8` (both `s16` and `s17`), and the stack pointer. Save `r4`–`r11` plus link register first, then `d8`, then reserve **164 bytes**. Total frame depth is **208 bytes**. Restore in the reverse order. There is no frame-pointer chain; `r11` is used as a persistent zero.
- No deliberate result is assigned at return. The raw returned `r0` is: zero when the count is zero; the final predicate result if the last scanned entry is skipped; otherwise the return of the last call to `C154`. Do not add a return of `O` or a fixed success value. Treat the source-level result type as unproven.
- Calls can mutate reachable memory. Preserve the described reloads; do not cache mutable object fields across calls beyond the values explicitly saved below. Additional caller-saved registers not listed as arguments have no inferred semantic contract.

## Neutral identities and memory vocabulary

`W(P, k)` means the word at byte address `P + k`. `V(P, k)` means the callable pointer at byte offset `k` in the table pointed to by `W(P, 0)`. Each virtual call freshly loads the object and its table as specified; register-indirect calls permit the destination's state bit to control interworking.

Use the following local direct-call identities. Each is an ARM import veneer; its separate pool slot is at entry plus four. Each such slot has `R_ARM_ABS32`, zero addend, and an undefined anonymous import. Providers A and B are merely distinct anonymous provider identities: A is identified by the import used at veneer `0x24`; B by the one at `0xBC`. Their authored names are intentionally omitted.

| Identity / veneer `.text` offset | Pool slot | Provider | Imported segment and offset |
| --- | --- | --- | --- |
| C024: `0x24` | `0x28` | A | segment 0, `0xE5B70` |
| CBC: `0xBC` | `0xC0` | B | segment 0, `0x23480` |
| CFC: `0xFC` | `0x100` | B | segment 0, `0x29DBEC` |
| C104: `0x104` | `0x108` | B | segment 0, `0x29D6E8` |
| C10C: `0x10C` | `0x110` | B | segment 0, `0x4EA64` |
| C114: `0x114` | `0x118` | B | segment 0, `0x295C80` |
| C11C: `0x11C` | `0x120` | B | segment 0, `0x3CE2D4` |
| C124: `0x124` | `0x128` | B | segment 0, `0x3D341C` |
| C12C: `0x12C` | `0x130` | B | segment 0, `0x3D36DC` |
| C134: `0x134` | `0x138` | B | segment 0, `0x3D2E20` |
| C13C: `0x13C` | `0x140` | B | segment 0, `0x37BDDC` |
| C144: `0x144` | `0x148` | B | segment 0, `0x3CCDD4` |
| C14C: `0x14C` | `0x150` | B | segment 0, `0x2878F8` |
| C154: `0x154` | `0x158` | B | segment 0, `0x291CE8` |

The function does not establish helper implementations or provider behavior. Do not inspect or reconstruct those routines as part of this specification.

Object fields used by this body:

| Base | Offset | Observed role |
| --- | --- | --- |
| O | `0x08` | pointer to context K; loaded again at later stages |
| O | `0x24` | object Q used for lookup and transform calls; reloaded for each call |
| O | `0x2C + 4*j` | created instance slot |
| O | `0x44 + 4*j` | created auxiliary instance slot |
| O | `0x5C + 4*j` | preexisting argument for auxiliary initialization |
| O | `0xAC` | fixed auxiliary instance slot |
| O | `0xB0` | fixed secondary instance slot |
| O | `0xB4` | preexisting argument for fixed auxiliary initialization |
| K | `0x04`, `0x24`, `0x2C` | values captured at entry as H, A, B respectively |
| K | `0x60` | start of traversal to collection L |

Collection traversal is exactly `L = W(W(W(K, 0x60), 0x1C), 0x14)`, using a fresh `K = W(O, 8)` after the fixed-instance setup. No pointer in these chains is checked for null.

## Stack and preserved-register plan

Let **S** denote the fully allocated stack pointer (`entry_sp - 208`). All offsets below are from S. The call boundary stack arguments are words at `S+0`, `S+4`, and when used `S+8`, in that order after `r0`–`r3`.

| Offset/range | Lifetime and initialization |
| --- | --- |
| `0x00..0x0B` | outgoing arguments; rewritten per call below |
| `0x0C` | saved A = `W(K, 0x24)` |
| `0x10, 0x14, 0x18` | initially each set to scalar C; contiguous triple passed to first C104 |
| `0x14..0x1F` | persistent three-word temporary P, overlapping the preceding triple; `P = S+0x14` |
| `0x24` | saved B = `W(K, 0x2C)` |
| `0x28..0x53` | per-processed-entry configuration block D; exact partial initialization below |
| `0x58..0x87` | output buffer M for virtual call at table offset `0x64` |
| `0x88` | saved collection L |
| `0x90` | saved H = `W(K, 4)` |
| `0x98, 0x9C, 0xA0` | each reset to C for each processed entry; triple E |
| `0xA4..0xAB` | saved d8 |
| `0xAC..0xCF` | saved r4–r11, then return address, in increasing register order |

No other local bytes are initialized by the function. In particular, `S+0x1C` (P's third word) is initially indeterminate, and the configuration padding `S+0x29..0x2B` is untouched. Do not replace these operations with a whole-frame or whole-structure clear.

Long-lived register allocation: `r5=O`, `r6=i` (scanned index), `r7=j` (processed index), `r8=N` (captured count), `r11=0`. Initially `r4=C`; on processing an entry it becomes `O+4*j`. `r9` is set to one during fixed setup and each processed-entry setup, and later holds the signed lookup result. `r10=P` is formed immediately before the lookup call. When N is nonzero, `s16` is loaded with floating-point positive zero and survives helper calls in saved `d8`.

## Exact control-flow semantics

### Fixed setup, once per invocation

1. Save O. Read `K=W(O,8)`, then capture A, B, and H in that order from K at `0x24`, `0x2C`, and `4`. Initialize the three words at `S+0x10`, `S+0x14`, `S+0x18` to C, saving H at `S+0x90` between the second and third stores.
2. Call **CBC** at body site `0x1400` with `(r0,r1)=(64,H)`. Set `r9=1` and `r11=0` after testing its result. If the result is nonzero, call **CFC** at `0x1424` with `(r0,r1,r2,r3)=(result,0,0,0)` and stack words `(1,0)`. If the result is zero, bypass CFC and keep zero in r0. Store the resulting r0 into `O+0xAC`.
3. Set outgoing stack words to `(0,0)`. Call **C104** at `0x1440` with `(r0,r1,r2,r3)=(that same r0,A,W(O,0xB4),S+0x10)`. This call is unconditional, including when r0 is zero. Test its returned word: if zero, call **C10C** at `0x145C` with `r0=r1=r2=0`. If C10C returns, continue with the next step. There is no local early return or assumption that it cannot return.
4. Call **CBC** at `0x1468` with `(36,H)`. Only when its result is nonzero, call **C114** at `0x1474`, passing that result in r0 without preparing additional arguments. Store the resulting r0 (including zero on the bypass path) into `O+0xB0`.
5. Call **C11C** at `0x1490` with `(r0,r1,r2,r3)=(W(O,0xAC),2,0,the result just stored at O+0xB0)`. The auxiliary field is reloaded after C114; r3 uses the returned value, rather than reloading `O+0xB0`.
6. Reload K from `O+8`, initialize j to zero, follow the three-load collection traversal described above, and save L. Call **C124** at `0x14AC` with `r0=L`. Capture its unsigned 32-bit result as N. Set i to zero. Only when N is unsigned-greater-than-zero load floating-point positive zero into `s16`. If N is zero, branch directly to the common epilogue.

### Scan loop and processed-entry setup

The loop head is `0x14C0`. Neither N nor L is recomputed between iterations.

1. Call **C12C** at `0x14C8` with `(r0,r1)=(L,i)`. Pass its returned r0 directly to **C134** at `0x14D4`, with `r1=2`. If C134's returned word is nonzero, branch straight to the scan-index increment at `0x16D4`. This skips all creation and does not increment j.
2. Otherwise load C again from its pool slot, set `r9=1`, initialize E's three words to C, and call **CBC** at `0x1500` with `(64,H)`. If nonzero, call **CFC** at `0x1524` with `(result,0,0,0)` and stack words `(1,0)`. Keep zero if allocation returned zero. Set `r4=O+4*j`; store the resulting r0 at `r4+0x44`.
3. Write outgoing stack words `(0,1)`. Call **C104** at `0x1544` with `(r0,r1,r2,r3)=(that same r0,A,W(r4,0x5C),S+0x98)`. Ignore its result completely; there is no failure check and no C10C call on this loop path.
4. Initialize D, at S+0x28, with the following exact widths and order. First store one zero byte at D+0; store zero words at D+4 and D+8; store the consecutive word pair `(4,0)` at D+12 and D+16; store zero words at D+20 and D+24; store one at D+40, then one at D+28; finally store zero at D+32 and D+36. Leave D+1..3 untouched. Load H and prepare size 200 before the final two stores, then call **CBC** at `0x1584` with `(200,H)`.
5. Only if that CBC result is nonzero, call **C13C** at `0x1590` with the result in r0 and no additional prepared arguments. Store the resulting r0 at `r4+0x2C`, including zero on the bypass path. The next step dereferences it without a null check.

### Instance virtual-call sequence

Maintain this order, reloading `W(r4,0x2C)` and its table for each call. The notation lists only prepared argument registers and stack arguments; the target register itself is also specified for exact reconstruction.

1. Site **0x15B8**, table offset **0x2C**: `r0=instance`, `r1=A`, `r2=B`, `r3=W(r4,0x44)`, outgoing stack `(0,&D)`. Call target in r12. Ignore return.
2. Site **0x15CC**, table offset **0x1C**: `r0=instance`, `r1=0`; call target in r2. Ignore return.
3. Site **0x15F8**, table offset **0x34**: `r0=instance`, `r1=A`, `r2=W(O,0xB0)`, `r3=0`, outgoing stack `(0,UINT32_MAX,0)`. Call target in r12. The first stack word is written before the consecutive pair at S+4/S+8. Ignore return.
4. Site **0x1610**, table offset **0x38**: `r0=instance`, `r1=0`, **s0=positive floating-point zero**, copied from s16. Call target in r2. Ignore return.
5. Site **0x1628**, table offset **0x40**: same prepared arguments as the preceding call, freshly reloading the instance and target and recopying s16 into s0. Call target in r2. Ignore return.

These VFP arguments must remain VFP arguments. Do not replace them with integer zeros in a core register.

### Lookup, temporary update, and publication

1. Reload `Q=W(O,0x24)`. Load the table pointer T from pool slot `0x16F4`, form `P=S+0x14` in r10, and load the word `W(T,4*j)`. At site **0x1644**, call `V(Q,0x5C)` with `r0=Q`, `r1=that table word`; call target in r2. No strings, table words, or table extent are part of this specification. T is an external data identity, not embedded reconstruction data.
2. Capture the returned word in r9 and compare it as **signed** against zero. If negative, branch directly to `0x16A4`, performing neither of the following helper calls nor the floating-point additions. P is not reset on this path.
3. Otherwise, reload Q and call **C144** at `0x1658` with `(r0,r1)=(Q,P)`. Then reload Q again and call `V(Q,0x64)` at **0x1670** with `r0=Q`, `r1=r9`, `r2=M=S+0x58`; call target in r3. r9 is the earlier lookup result, regardless of C144's result. Neither helper's return is otherwise used.
4. Perform three scalar single-precision additions, in order, updating P in place:
   - `P[0] = float32(P[0] + M[3])`, where M[3] is at S+0x64;
   - `P[1] = float32(P[1] + M[7])`, where M[7] is at S+0x74;
   - `P[2] = float32(P[2] + M[11])`, where M[11] is at S+0x84.
   Operand order is the prior P component first, M component second. Use the current floating-point control environment; the function does not change it. Preserve individual scalar loads/adds/stores and avoid fusion or reassociation. For exact scheduling, load M[3] into s2, P[0] into s3, M[7] into s0, and M[11] into s1 before the first add; write P[0] before loading P[1] into s2, and write P[1] before loading P[2] into s0.
5. At common site **0x16AC**, reload the instance from `r4+0x2C` and call **C14C** with `(r0,r1)=(instance,P)`, on both lookup branches.
6. Reload `K=W(O,8)` and call **C024** at `0x16B8` with r0=K. From its returned pointer load `W(result,0x34)`. Call **C154** at `0x16CC` with `(r0,r1,r2,r3)=(that loaded word,W(r4,0x2C),0,0)`.
7. Increment j by one at **0x16D0**. At **0x16D4**, increment i by one. Compare i to captured N **unsigned**; branch back to `0x14C0` iff i < N, otherwise fall through to the epilogue at `0x16E0`.

P is initialized only by the overlapping entry-time stores, not per iteration. Initially its first two words are C and its third word is indeterminate. Any write by C104 through its first triple argument can affect P's first two words. On nonnegative lookup paths C144 receives P and may replace its components before the additions. On negative paths the existing P is passed through unchanged to C14C. Subsequent iterations inherit whatever P contains, including helper mutations. No capacity check or upper bound for j is visible. Do not infer an array length or clamp the loop from adjacent field offsets.

## Branch and layout requirements

For an exact reconstruction retain these branch decisions and destinations, using `.text` offsets: allocation-zero at `0x1410` to `0x1428`; initialization-success at `0x144C` to `0x1460`; unsigned-count-zero at `0x14BC` to `0x16E0`; nonzero predicate at `0x14E0` to `0x16D4`; per-entry allocation-zero at `0x150C` to `0x1528`; signed-negative lookup at `0x164C` to `0x16A4`; unsigned loop-back at `0x16DC` to `0x14C0`.

The construction calls at `0x1474` and `0x1590` are conditional nonzero calls, with fall-through preserving the zero allocation result. Do not turn them into early returns. There are seven architectural no-ops at **0x1448, 0x1470, 0x14D0, 0x14DC, 0x1508, 0x158C, 0x16B4**. The no-ops after comparisons preserve their condition flags. Keep them for size and exact scheduling.

## Pool and relocation ownership

- **0x16EC**, unrelocated scalar **C = 33,619,968**: read as a word at body sites **0x13C4** and **0x14E4**. This is an opaque initialization constant, not an address and not floating-point zero. No semantic interpretation of its packed fields is established.
- **0x16F0**, unrelocated **positive binary32 zero**: conditionally read into s16 at **0x14B4** only when N is unsigned-greater-than-zero.
- **0x16F4**, pointer to **`.data + 0x10`**, an internal **R_ARM_ABS32** relocation with addend **0x10**: read at **0x1630**, then indexed by processed index j with four-byte stride. Preserve the reference symbolically. Do not copy the target table into the implementation or this specification.

All three slots belong to the public pool starting at 0x16EC; none belongs to the accepted instruction section. Local direct calls encode references to the fixed veneer offsets, without relocation outputs in the accepted body. The veneer import slots listed above belong to their own preexisting pools; they are not additional literals owned by this function. In a split object, preserve references to the partition's neutral pool/gap identities rather than creating accepted functions for unaccepted veneers. This specification awards no data or veneer matching credit.

## Independent implementation and validation requirements

An implementer should use this reviewed specification alone, without target disassembly or implementation-source access by the analyst. Preserve the ABI, 816-byte ARM body, exact stack partial initialization, conditional calls, call-site order, overlapping temporaries, fresh object-field reloads, unsigned iteration tests, signed lookup test, VFP arguments, and separate literal ownership. No original source spelling or inferred class layout is required.

The verification party must compare the independently produced function against the legally supplied external target using the repository's ARM build/matching workflow. Require exact body bytes and size, correct ARM mapping, outgoing stack argument order, preserved-register handling, and correct pool references/relocation identity. A body-only match does not authorize credit for the adjacent pool or imported veneers. Keep target-bearing objects and reports ignored, review reports for private information, and run the repository clean check before any eventual commit. No commit is part of this analysis task.

Behavioral validation should cover: N=0; all predicates nonzero; mixed skipped/processed entries proving separate i/j indexing; each allocation returning zero; the first C104 failing with C10C returning; loop C104 returning zero without an error callback; negative, zero, and positive signed lookups; repeated lookups proving P persists; helpers mutating reloadable fields; scalar additions including exceptional floating-point inputs; and preservation of r4–r11, d8, and stack pointer. Allocation failure paths deliberately include subsequent null receiver calls or dereferences; do not add guards. Use mocked helper traces or an appropriate isolated execution harness rather than assuming those paths are valid in normal gameplay. Indeterminate stack bytes must remain unspecified in semantic assertions while their lack of initialization remains part of exact reconstruction.

Analysis checks completed: public container identity and accepted boundary agreement; successful structural/hash parsing; exact 204-instruction tiling of the bounded body; all seven local branch destinations verified within the body; all seven no-op sites verified; zero in-body relocation outputs; all fourteen direct-call veneers verified against anonymous-import relocation slots; and all three adjacent literal roles/ownership checked. Implementation compilation, behavioral execution, and byte matching remain the independent implementer's and verifier's work.
