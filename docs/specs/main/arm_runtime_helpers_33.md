# Probe-verified ARM runtime/helper batch 33

## Scope and provenance

This clean-room specification covers ten still-unmatched ARM-state retry
wrappers totaling 1,240 executable bytes. Each wrapper has a 124-byte body
followed by two ordered symbolic pool words outside its function extent. The
complete schedule below was independently assembled with GNU Arm Embedded
15.2 for ARMv6K and compared against target revision `AS_EUR_REV2` on
2026-10-16. After abstracting the two external branches and two pool words in
each wrapper, all ten complete bodies and all 1,240 executable bytes matched.
Every non-relocation body byte matched directly before normalization.

The evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, physical
identity comparisons, and an independent exact-schedule probe. No private
absolute address, raw byte sequence, instruction encoding, literal value,
implementation source, or proprietary source is recorded here.

## Shared retry semantics

The ten wrappers have one exact local schedule. Entry `r0-r1` are retained in
`r8-r9`, and `r4` is a zero-based attempt counter. `r5` receives the shared
exhausted-status pool identity, `r6` receives the shared terminal-status pool
identity, and `r7` is formed by adding 1020 to the exhausted status. The
derived `r7` value is a semantic arithmetic relation; its private underlying
pool value is neither needed nor recorded.

Each attempt restores entry `r0-r1` and calls the wrapper-specific operation.
The returned status is tested for negativity with flag-setting `ands`, then
copied to `r2`.

- A nonnegative status returns zero through the conditional `movlt` path.
- The terminal status returns unchanged.
- A negative status whose masked category equals the displayed immediate
  advances directly to the next attempt.
- A negative status equal to the derived `r7` identity returns the exhausted
  status instead.
- Every other negative status is destructively reduced to sign bit one and
  passed to the shared failure identity. If that call returns, retry handling
  continues.

After a retry, the counter is incremented. A second operation attempt is made
while the counter is less than two; exhaustion after that attempt returns the
shared exhausted status. The exact schedule, including apparently redundant
conditions and register choices, is normative.

## Complete exact schedule

`RETRY_WRAPPER` below emits the entire executable body and its two adjacent
pool slots. Its ten invocations are the exhaustive batch schedule; there are
no omitted per-function instructions or variant operands besides the
operation identity.

```asm
.syntax unified
.arch armv6k
.arm

.macro RETRY_WRAPPER f, op
.section .text.\f,"ax",%progbits
.balign 4
.arm
.global \f
.type \f,%function
\f:
    push {r4,r5,r6,r7,r8,r9,r10,lr}
    mov r4,#0
    mov r8,r0
    mov r9,r1
    ldr r5,.Lpool_\f
    ldr r6,.Lpool_\f+4
    add r7,r5,#1020
.Lretry_\f:
    mov r1,r9
    mov r0,r8
    bl \op
    ands r1,r0,#0x80000000
    mov r2,r0
    bpl .Lnonnegative_\f
    cmp r0,r6
    beq .Lreturn_\f
    and r1,r0,#0x3fc00
    cmp r1,#0x2c00
    beq .Lnext_\f
    cmp r0,r7
    beq .Lexhausted_\f
    lsrs r0,r2,#31
    blne runtime_failure_raise_entry_31
.Lnext_\f:
    add r4,r4,#1
    cmp r4,#2
    blt .Lretry_\f
    b .Lexhausted_\f
.Lnonnegative_\f:
    cmp r4,#2
    movlt r0,#0
    blt .Lreturn_\f
.Lexhausted_\f:
    mov r0,r5
.Lreturn_\f:
    pop {r4,r5,r6,r7,r8,r9,r10,pc}
.size \f,.-\f
.Lpool_\f:
    .word runtime_retry_exhausted_status_33
    .word service_query_accepted_status_31
.endm

RETRY_WRAPPER func_002DDAA4,func_002DE630
RETRY_WRAPPER func_002DDB28,func_002DE678
RETRY_WRAPPER func_002DDC20,func_002DE744
RETRY_WRAPPER func_002DDCA4,func_002DE78C
RETRY_WRAPPER func_002DDD94,func_002DE83C
RETRY_WRAPPER func_002DDFA8,func_002DE8F0
RETRY_WRAPPER func_002DE02C,func_002DE938
RETRY_WRAPPER func_002DE0B0,func_002DE980
RETRY_WRAPPER func_002DE1E4,func_002DEB2C
RETRY_WRAPPER func_002DE268,func_002DEB74
```

Within every body, the operation call is at `+0x24`, the conditional linked
failure transfer is at `+0x54`, the exhausted-status pool slot is at `+0x7c`,
and the terminal-status pool slot is at `+0x80`. The executable body ends at
`+0x7c`; both pool slots are adjacent data outside the function extent. The
body-local targets are retry `+0x1c`, next-attempt `+0x58`, nonnegative
`+0x68`, exhausted `+0x74`, and return `+0x78`.

Exact-schedule cautions:

- Preserve the initial eight-register push and the otherwise unused saved
  `r10`; do not reduce the save set.
- Load both pool identities before deriving `r7`, and restore `r1` before
  `r0` at the start of every attempt.
- Keep the flag-setting `ands`, the copy to `r2`, and the later destructive
  `lsrs` in exactly that order.
- The category test is the displayed `and` followed by `cmp`. Do not replace
  it with a bit-test or fold either immediate.
- Preserve the conditional linked `blne`. It is an `R_ARM_JUMP24`
  relocation, and control continues at next-attempt handling if the failure
  identity returns.
- Keep both final conditional instructions even though the observed loop
  topology makes the nonnegative path's counter less than two.

## Ordered code-identity ledger

All external destinations are ARM code and at least four-byte aligned. The
operation calls are `R_ARM_CALL`; the conditional failure calls are
`R_ARM_JUMP24` as classified by the pinned GNU assembler.

| Wrapper | Operation at `+0x24` | Equality and visible contract |
| --- | --- | --- |
| `func_002DDAA4` | `func_002DE630` | distinct operation; receives restored entry `r0-r1` |
| `func_002DDB28` | `func_002DE678` | distinct operation; receives restored entry `r0-r1` |
| `func_002DDC20` | `func_002DE744` | distinct operation; receives restored entry `r0-r1` |
| `func_002DDCA4` | `func_002DE78C` | distinct operation; receives restored entry `r0-r1` |
| `func_002DDD94` | `func_002DE83C` | distinct operation; receives restored entry `r0-r1` |
| `func_002DDFA8` | `func_002DE8F0` | distinct operation; receives restored entry `r0-r1` |
| `func_002DE02C` | `func_002DE938` | distinct operation; receives restored entry `r0-r1` |
| `func_002DE0B0` | `func_002DE980` | distinct operation; receives restored entry `r0-r1` |
| `func_002DE1E4` | `func_002DEB2C` | distinct operation; receives restored entry `r0-r1` |
| `func_002DE268` | `func_002DEB74` | distinct operation; receives restored entry `r0-r1` |

The ten operation identities are pairwise distinct and are the already
specified ARM IPC identities from duplicate IPC/table batch 12. At every
wrapper's `+0x54`, `runtime_failure_raise_entry_31` is one exact shared ARM
identity. Physical destination comparison proves that all ten sites equal the
failure identity established by runtime batch 31 and reused by IPC batch 31;
it receives extracted sign bit one in `r0`.

An implementation may normalize only these twenty branch sites, in the
displayed per-function order. It must preserve mode, alignment, relocation
kind, the pairwise distinction of the ten operation targets, and the
ten-site equality of the failure target. Body-local branches must remain
ordinary exact instructions.

## Ordered data-identity ledger

There are exactly twenty adjacent `R_ARM_ABS32` slots in two equality
classes:

| Per-wrapper offset | Symbolic identity | Equality contract |
| --- | --- | --- |
| `+0x7c` | `runtime_retry_exhausted_status_33` | exactly equal across all ten wrappers; distinct from every IPC31 pool identity |
| `+0x80` | `service_query_accepted_status_31` | exactly equal across all ten wrappers and exactly equal to IPC31 `func_002C5F10 + 0x24` |

The two runtime33 classes are unequal. The terminal-status class is
physically unequal to IPC31's `service_open_accepted_status_31` at
`func_002C5E14 + 0xa4`; the similarly described open and query accepted
statuses must not be merged. The exhausted-status class is also unequal to
all six ordered IPC31 slots. These claims come from physical word-identity
comparison only; no literal value is recorded or required.

The derived `r7` comparison identity is exactly
`runtime_retry_exhausted_status_33 + 1020` as formed by the body instruction.
It is not an additional pool slot or relocation class.

## Exact-probe and overlap audit

| Function | Mode | Body bytes | Adjacent pool bytes | External branches | Probe result |
| --- | --- | ---: | ---: | ---: | --- |
| `func_002DDAA4` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| `func_002DDB28` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| `func_002DDC20` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| `func_002DDCA4` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| `func_002DDD94` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| `func_002DDFA8` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| `func_002DE02C` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| `func_002DE0B0` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| `func_002DE1E4` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| `func_002DE268` | ARM | 124 | 8 | 2 | exact complete body after four-site symbolic normalization |
| **Total** |  | **1,240** | **80** | **20** | **10 / 10 exact; 1,240 / 1,240 body bytes** |

The probe emitted a 132-byte section for every wrapper: 124 body bytes plus
the two ordered pool words. Readelf reported exactly ten `R_ARM_CALL`, ten
`R_ARM_JUMP24`, and twenty `R_ARM_ABS32` relocations at the specified
offsets. Direct comparison found zero residual non-relocation differences in
the 1,240 body bytes. Independent bounded comparison of the twenty physical
target pool words established the two equality classes and the one IPC31
cross-batch equality above.

The current objdiff report lists all ten wrappers as zero-percent matched.
The complete tracked and concurrent inventory contains none of their names:
in particular, IPC31 selects sixteen `func_002C...` wrappers and duplicate34
selects only `func_002E25B0`, `func_002E4960`, and `func_002E52EC`. Runtime33's
ten body extents and eighty adjacent pool bytes are pairwise disjoint from
those batches and from every earlier specification. There is zero function,
body-byte, or adjacent-data overlap.
