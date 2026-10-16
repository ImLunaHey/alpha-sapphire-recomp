# Probe-verified duplicate ARM templates 71

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `f8d7097f62b286ea195b75fc80b82b81ac7deb8d0e227b52187c36c3486756dd`.
- Evidence: the evidence-gated function inventory, current objdiff report,
  repository-wide configured-function exclusion, direct-transfer and
  PC-relative-load normalized complete-body grouping, bounded target
  control/data-flow and post-body inspection, primary/secondary branch
  resolution, physical literal equality comparison, and an independent GNU
  Arm Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  literal values, extracted assets, proprietary source, or implementation
  source.

Every exact function in the current report and every function already named
by a configuration file was excluded. The resulting batch is also disjoint
from the pending runtime 70, duplicate 70, IPC 67, and runtime 71 work. The
24 selected ARM-state functions comprise six normalized schedules and 2,532
executable bytes (633 instructions):

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Forward five-argument call | 11 | 48 | 528 |
| Clear intrusive container | 2 | 268 | 536 |
| Retry status operation | 3 | 132 | 396 |
| Accumulate three stages | 4 | 84 | 336 |
| Destroy linked chain | 2 | 188 | 376 |
| Destroy composite state | 2 | 180 | 360 |

The schedules contain 66 symbolic direct transfers, ten register-indirect
calls, twelve physical pool slots in seven equality classes, and no other
relocations. All body sizes, instruction counts, local destinations, transfer
conditions, operand registers, immediates, writeback forms, pool positions,
and post-body boundaries were independently probed rather than inferred from
the duplicate relationship.

## Template behavior and boundaries

### Forward five-argument call

`func_001C4EE8`, `func_001C4F18`, `func_001C4F48`, `func_001C4F78`,
`func_001C4FA8`, `func_001C4FD8`, `func_001C5008`, `func_001C5038`,
`func_001C5068`, `func_001C5098`, and `func_001C50C8` share a 48-byte
schedule. Each preserves all four register arguments, calls its preparation
helper at +20, restores the original first three arguments into `r1` through
`r3`, places the original fourth argument at stack offset zero as a fifth
argument, and calls its forwarding helper at +40. The first six use
`func_001C4C94` as the forwarding helper; the last five use `func_001C4DDC`.

The first ten functions are contiguous and their next globals start at +48.
Unrelated anonymous material starts at +48 after `func_001C50C8`; its next
global is `func_001C53D4` at +780.

### Clear intrusive container

`func_002179DC` and `func_0024FD1C` share a 268-byte schedule. The function
uses the owner subobject at +4 and walks the intrusive list rooted through
owner offset 20. It unlinks non-sentinel nodes, decrements the count at
subobject offset 20, invokes the node callback indirectly at +88, and moves
each processed node to the secondary chain. It reconnects the sentinel before
walking the primary chain. Each primary node may invoke an indirect callback
at +176 or +216; a missing callback uses `func_00302108` at +188 or +228.
The container roots and count are cleared before returning the original owner.

The complete local-destination set is +24, +104, +112, +140, +184, +192,
+224, +232, +244, and +260. The three indirect calls are at +88, +176, and
+216. `func_002179DC` is followed immediately by its next global at +268.
Unrelated anonymous material starts at +268 after `func_0024FD1C`, whose next
global begins at +336.

### Retry status operation

`func_002DEF0C`, `func_002DF024`, and `func_002DF0B0` share a 132-byte
schedule followed by two literal slots. The template retains its three
arguments, attempts the operation at +44, and retries no more than twice.
Negative results are compared with the shared accepted-status identity and a
derived status based on the shared retry-base identity. Other negative
results are reported conditionally through `func_00146000` at +92. The
function returns zero on an early nonnegative result, otherwise the retry-base
identity.

The operation helpers are respectively `func_002DEDFC`, `func_002DEE4C`, and
`func_002DEE9C`. Local destinations are +32, +96, +112, +124, and +128. The
retry-base and accepted-status slots are at +132 and +136, loaded at +16 and
+20. Template-owned material ends at +139 and each next global begins at
+140.

### Accumulate three stages

`func_002EAD38`, `func_002EB8D8`, `func_002F0B88`, and `func_002F9440`
share an 84-byte schedule. They preserve both arguments, call
`func_002F7220` at +16, OR each stage result into an accumulator, and stop
after a result has its sign bit set. The expansion-specific middle-stage
calls at +44 are `func_002EAF50`, `func_002EBA04`, `func_002F0D7C`, and
`func_002F956C`. A still-nonnegative accumulator reaches the common
`shared_completion_secondary_71` call at +72. The sole local destination is
+80. Every next global begins at +84.

`shared_completion_secondary_71` is the established executable entry exactly
416 bytes after `func_00312530`. It is 592 bytes before the next global,
`func_00312920`. It is a branch identity only; this batch owns none of that
entry's bytes.

### Destroy linked chain

`func_0028CF4C` and `func_0029DCD8` share a 188-byte schedule followed by an
expansion-specific dispatch identity. The function installs the dispatch at
owner offset zero, uses a twelve-byte stack record to move the leading chain
node through the expansion-specific helper at +48, shifts to the owner
subobject at +64, and optionally moves its sentinel node through the same
helper at +96. It then walks the remaining chain. Each node's payload and the
node itself are released through `func_00160F9C` at +144 and +156. After
restoring the stack and original owner, it tail-branches to `func_002412A4`
at +184.

The move helpers are `func_005597F4` and `func_0055A9E4`. Local destinations
are +128 and +172. The dispatch slot is +188, read at +8. Template material
ends at +191 and both next globals begin at +192.

### Destroy composite state

`func_0029A554` and `func_0029DF68` share a 180-byte schedule followed by an
expansion-specific root dispatch and a shared nested dispatch. The function
installs its root dispatch while advancing the owner by 116, walks the first
array in 40-byte strides and calls each element indirectly at +40, releases
that array through `func_00160F9C` at +60, then walks a second array in
eight-byte strides and calls its elements indirectly at +92. It releases the
second array at +112, installs the shared nested dispatch, releases two nested
members at +128 and +144, calls `func_00163ED0` at +156, then calls
`func_001862FC` at +168 before returning.

Local destinations are +28, +56, +80, and +108. The root and nested slots are
at +180 and +184, loaded at +0 and +116. Template material ends at +187.
Unrelated anonymous material starts at +188; the next globals begin at +304
and +5108, respectively.

## Literal identity contract

The twelve physical slots form exactly seven equality classes:

| Identity | Slots | Classification |
| --- | ---: | --- |
| `arm_duplicate_templates_71_retry_base_status_identity` | 3 | new shared status-code identity |
| `service_query_accepted_status_31` | 3 | reused accepted-status identity from IPC template 31 |
| `arm_duplicate_templates_71_chain_dispatch_a_identity` | 1 | new dispatch identity |
| `arm_duplicate_templates_71_chain_dispatch_b_identity` | 1 | new dispatch identity |
| `arm_duplicate_templates_71_composite_dispatch_a_identity` | 1 | new dispatch identity |
| `arm_duplicate_templates_71_composite_dispatch_b_identity` | 1 | new dispatch identity |
| `arm_duplicate_templates_71_nested_dispatch_identity` | 2 | new shared dispatch identity |

All seven classes are pairwise distinct. Direct physical comparison against
all configured literal slots established that the accepted-status class is
exactly the existing `service_query_accepted_status_31` identity. Each other
class is distinct from every previously configured literal identity. No
private value forms part of this contract.

## Direct-transfer identity contract

All 66 direct transfers are ARM-state, four-byte aligned, and symbolic. The
shared equality classes are:

| Destination | Sites |
| --- | ---: |
| `func_001C4C94` | 6 |
| `func_001C4DDC` | 5 |
| `func_00302108` | 4 |
| `func_00146000` | 3 |
| `func_002F7220` | 4 |
| `shared_completion_secondary_71` | 4 |
| `func_005597F4` | 2 |
| `func_0055A9E4` | 2 |
| `func_00160F9C` | 12 |
| `func_002412A4` | 2 |
| `func_00163ED0` | 2 |
| `func_001862FC` | 2 |

The eleven preparation helpers, three retry-operation helpers, and four
middle-stage helpers are singleton classes. All primary and secondary classes
are pairwise distinct. Every direct transfer is `bl`/`R_ARM_CALL` except the
three conditional `blne` report sites, which are `R_ARM_JUMP24`, and the two
unconditional `b` destroy-base tails, which are also `R_ARM_JUMP24`.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. The source must
assemble to these exact fixed schedules, function sizes, local destinations,
relocations, and pool positions. `DT71_END` closes the function symbol before
owned pool material.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT71_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT71_END name
.size \name, .-\name
.endm

.macro DT71_FORWARD name, prepare, forward
DT71_BEGIN \name
    push {r3, r4, r5, r6, r7, lr}
    mov r5, r0
    mov r6, r1
    mov r7, r2
    mov r4, r3
    bl \prepare
    mov r3, r7
    mov r2, r6
    mov r1, r5
    str r4, [sp]
    bl \forward
    pop {r3, r4, r5, r6, r7, pc}
DT71_END \name
.endm

.macro DT71_CLEAR name
DT71_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    add r4, r0, #4
    ldr r5, [r0, #20]
    cmp r5, #0
    ldrne r6, [r5]
    beq .Ldt71_clear_return_\@
.Ldt71_clear_secondary_loop_\@:
    cmp r6, r5
    beq .Ldt71_clear_reconnect_\@
    ldr r7, [r4, #16]
    cmp r6, r7
    beq .Ldt71_clear_advance_secondary_\@
    ldr r2, [r6, #4]
    ldr r7, [r6]
    add r0, r6, #8
    str r7, [r2]
    ldm r6, {r1, r2}
    str r2, [r1, #4]
    ldr r1, [r4, #20]
    sub r1, r1, #1
    str r1, [r4, #20]
    ldr r1, [r6, #8]
    ldr r1, [r1]
    blx r1
    ldr r0, [r4, #4]
    str r0, [r6]
    str r6, [r4, #4]
.Ldt71_clear_advance_secondary_\@:
    mov r6, r7
    b .Ldt71_clear_secondary_loop_\@
.Ldt71_clear_reconnect_\@:
    ldr r0, [r4, #16]
    ldr r1, [r4, #4]
    str r1, [r0]
    str r0, [r4, #4]
    ldr r0, [r4]
    cmp r0, #0
    beq .Ldt71_clear_zero_\@
.Ldt71_clear_primary_loop_\@:
    mov r5, r0
    ldr r0, [r0]
    str r0, [r4]
    ldr r0, [r5, #8]
    cmp r0, #0
    beq .Ldt71_clear_first_done_\@
    ldr r1, [r0, #-8]!
    cmp r1, #0
    beq .Ldt71_clear_first_default_\@
    blx r1
    b .Ldt71_clear_first_done_\@
.Ldt71_clear_first_default_\@:
    nop {0}
    bl func_00302108
.Ldt71_clear_first_done_\@:
    cmp r5, #0
    beq .Ldt71_clear_second_done_\@
    ldr r1, [r5, #-8]
    sub r0, r5, #8
    cmp r1, #0
    beq .Ldt71_clear_second_default_\@
    blx r1
    b .Ldt71_clear_second_done_\@
.Ldt71_clear_second_default_\@:
    nop {0}
    bl func_00302108
.Ldt71_clear_second_done_\@:
    ldr r0, [r4]
    cmp r0, #0
    bne .Ldt71_clear_primary_loop_\@
.Ldt71_clear_zero_\@:
    mov r0, #0
    str r0, [r4, #4]
    str r0, [r4, #8]
    str r0, [r4, #12]
.Ldt71_clear_return_\@:
    sub r0, r4, #4
    pop {r4, r5, r6, r7, r8, pc}
DT71_END \name
.endm

.macro DT71_RETRY name, attempt
DT71_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, sl, lr}
    mov r4, #0
    mov r8, r0
    mov r9, r1
    ldr r5, .Ldt71_retry_base_\@
    ldr r6, .Ldt71_retry_accepted_\@
    mov sl, r2
    add r7, r5, #0x3fc
.Ldt71_retry_loop_\@:
    mov r2, sl
    mov r1, r9
    mov r0, r8
    bl \attempt
    ands r1, r0, #0x80000000
    mov r2, r0
    bpl .Ldt71_retry_nonnegative_\@
    cmp r0, r6
    beq .Ldt71_retry_return_\@
    and r1, r0, #0x3fc00
    cmp r1, #0x2c00
    beq .Ldt71_retry_increment_\@
    cmp r0, r7
    beq .Ldt71_retry_use_base_\@
    lsrs r0, r2, #31
    blne func_00146000
.Ldt71_retry_increment_\@:
    add r4, r4, #1
    cmp r4, #2
    blt .Ldt71_retry_loop_\@
    b .Ldt71_retry_use_base_\@
.Ldt71_retry_nonnegative_\@:
    cmp r4, #2
    movlt r0, #0
    blt .Ldt71_retry_return_\@
.Ldt71_retry_use_base_\@:
    mov r0, r5
.Ldt71_retry_return_\@:
    pop {r4, r5, r6, r7, r8, r9, sl, pc}
DT71_END \name
.Ldt71_retry_base_\@:
    .word arm_duplicate_templates_71_retry_base_status_identity
.Ldt71_retry_accepted_\@:
    .word service_query_accepted_status_31
.endm

.macro DT71_ACCUMULATE name, middle
DT71_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    mov r6, r1
    mov r4, #0
    bl func_002F7220
    orr r0, r0, r4
    ands r1, r0, #0x80000000
    mov r4, r0
    bmi .Ldt71_accumulate_return_\@
    mov r1, r6
    mov r0, r5
    bl \middle
    orr r0, r0, r4
    ands r1, r0, #0x80000000
    mov r4, r0
    bmi .Ldt71_accumulate_return_\@
    mov r1, r6
    mov r0, r5
    bl shared_completion_secondary_71
    orr r0, r0, r4
.Ldt71_accumulate_return_\@:
    pop {r4, r5, r6, pc}
DT71_END \name
.endm

.macro DT71_CHAIN name, mover, dispatch
DT71_BEGIN \name
    push {r4, r5, lr}
    mov r4, r0
    ldr r0, .Ldt71_chain_dispatch_\@
    sub sp, sp, #12
    add r1, r4, #64
    str r0, [r4]
    ldr ip, [r4, #80]
    add r3, sp, #4
    mov r2, sp
    ldr r0, [ip, #8]
    stm sp, {r0, ip}
    add r0, sp, #8
    bl \mover
    add r4, r4, #64
    ldr r0, [r4, #16]
    movs r1, r0
    beq .Ldt71_chain_done_\@
    str r0, [sp, #4]
    ldr r0, [r1, #8]
    add r3, sp, #4
    mov r2, sp
    str r0, [sp]
    mov r1, r4
    add r0, sp, #8
    bl \mover
    ldr r0, [r4, #16]
    ldr r1, [r4, #4]
    str r1, [r0, #12]
    str r0, [r4, #4]
    ldr r0, [r4]
    cmp r0, #0
    beq .Ldt71_chain_done_\@
.Ldt71_chain_loop_\@:
    mov r5, r0
    ldr r0, [r0]
    str r0, [r4]
    ldr r0, [r5, #8]
    bl func_00160F9C
    mov r0, r5
    nop {0}
    bl func_00160F9C
    ldr r0, [r4]
    cmp r0, #0
    bne .Ldt71_chain_loop_\@
.Ldt71_chain_done_\@:
    add sp, sp, #12
    sub r0, r4, #64
    pop {r4, r5, lr}
    b func_002412A4
DT71_END \name
.Ldt71_chain_dispatch_\@:
    .word \dispatch
.endm

.macro DT71_COMPOSITE name, dispatch
DT71_BEGIN \name
    ldr r1, .Ldt71_composite_dispatch_\@
    push {r4, r5, r6, lr}
    str r1, [r0], #116
    mov r6, r0
    ldrd r4, [r6]
    cmp r4, r5
    beq .Ldt71_composite_first_done_\@
.Ldt71_composite_first_loop_\@:
    ldr r1, [r4]
    mov r0, r4
    ldr r1, [r1]
    blx r1
    add r4, r4, #40
    cmp r4, r5
    bne .Ldt71_composite_first_loop_\@
.Ldt71_composite_first_done_\@:
    ldr r0, [r6]
    bl func_00160F9C
    sub r6, r6, #12
    ldrd r4, [r6]
    cmp r4, r5
    beq .Ldt71_composite_second_done_\@
.Ldt71_composite_second_loop_\@:
    ldr r1, [r4]
    mov r0, r4
    ldr r1, [r1]
    blx r1
    add r4, r4, #8
    cmp r4, r5
    bne .Ldt71_composite_second_loop_\@
.Ldt71_composite_second_done_\@:
    ldr r0, [r6]
    bl func_00160F9C
    ldr r4, .Ldt71_composite_nested_\@
    str r4, [r6, #-32]!
    ldr r0, [r6, #8]
    bl func_00160F9C
    sub r6, r6, #72
    str r4, [r6, #52]
    ldr r0, [r6, #60]
    bl func_00160F9C
    add r0, r6, #20
    nop {0}
    bl func_00163ED0
    sub r0, r0, #12
    nop {0}
    bl func_001862FC
    sub r0, r0, #8
    pop {r4, r5, r6, pc}
DT71_END \name
.Ldt71_composite_dispatch_\@:
    .word \dispatch
.Ldt71_composite_nested_\@:
    .word arm_duplicate_templates_71_nested_dispatch_identity
.endm

DT71_FORWARD func_001C4EE8, func_001C4D94, func_001C4C94
DT71_FORWARD func_001C4F18, func_001C4DAC, func_001C4C94
DT71_FORWARD func_001C4F48, func_001C4DC4, func_001C4C94
DT71_FORWARD func_001C4F78, func_001C4EAC, func_001C4C94
DT71_FORWARD func_001C4FA8, func_001C4EB8, func_001C4C94
DT71_FORWARD func_001C4FD8, func_001C4ED0, func_001C4C94
DT71_FORWARD func_001C5008, func_001C4DA0, func_001C4DDC
DT71_FORWARD func_001C5038, func_001C4DB8, func_001C4DDC
DT71_FORWARD func_001C5068, func_001C4DD0, func_001C4DDC
DT71_FORWARD func_001C5098, func_001C4EC4, func_001C4DDC
DT71_FORWARD func_001C50C8, func_001C4EDC, func_001C4DDC

DT71_CLEAR func_002179DC
DT71_CLEAR func_0024FD1C

DT71_RETRY func_002DEF0C, func_002DEDFC
DT71_RETRY func_002DF024, func_002DEE4C
DT71_RETRY func_002DF0B0, func_002DEE9C

DT71_ACCUMULATE func_002EAD38, func_002EAF50
DT71_ACCUMULATE func_002EB8D8, func_002EBA04
DT71_ACCUMULATE func_002F0B88, func_002F0D7C
DT71_ACCUMULATE func_002F9440, func_002F956C

DT71_CHAIN func_0028CF4C, func_005597F4, arm_duplicate_templates_71_chain_dispatch_a_identity
DT71_CHAIN func_0029DCD8, func_0055A9E4, arm_duplicate_templates_71_chain_dispatch_b_identity

DT71_COMPOSITE func_0029A554, arm_duplicate_templates_71_composite_dispatch_a_identity
DT71_COMPOSITE func_0029DF68, arm_duplicate_templates_71_composite_dispatch_b_identity
```

The independent probe assembled one representative of each macro. After only
the declared external transfer fields and PC-relative pool displacements were
symbolically normalized, every fixed instruction word and every local branch
matched its complete target body. The remaining expansions were separately
checked for normalized complete-body equality and for their own transfer,
literal, and boundary metadata.

## Exact invariants

- Exactly 24 ARM function symbols and 2,532 executable body bytes are owned.
- Every function is in a separate `.text.func_*` section, is four-byte
  aligned, and has the exact body size and instruction count in the config.
- There are exactly 66 declared direct-transfer relocations at the declared
  offsets and exactly ten register-indirect `blx` calls.
- All local branch destinations equal the configured offset sets; none becomes
  an external relocation.
- Exactly twelve `R_ARM_ABS32` pool slots exist at the declared physical
  offsets and form exactly the seven declared equality classes.
- Every literal load resolves to its declared slot. No other PC-relative load,
  ADR, or owned literal material exists.
- The shared secondary branch target has the exact owner relation recorded in
  the config and is not emitted as owned code.
- Template-owned material never extends into any anonymous gap or following
  global. Every configured `anonymousMaterialOffset`, `nextGlobalOffset`, and
  material-end boundary is exact.
- After normalizing only configured direct transfers and literal-load
  displacements, all members of each template have byte-identical complete
  bodies.
- The implementation source hash is pinned to
  `f8d7097f62b286ea195b75fc80b82b81ac7deb8d0e227b52187c36c3486756dd`.
