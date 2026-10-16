# Probe-verified ARM service/IPC helpers 52

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, direct-branch resolution, physical literal
  identity comparison, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objcopy, readelf, and objdump 2.44.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers three adjacent, still-unmatched ARM-state record/service
helpers totaling exactly 492 executable bytes. They construct and validate a
record-backed transfer, acquire lazily initialized shared service state, and
replace one indexed record slot while returning its previous value. The set is
disjoint from duplicate batch 56 and runtime batch 56.

## Identity contracts

Fourteen physical direct-branch sites resolve to fourteen pairwise-distinct
destinations. Twelve are primary entries: `func_00174F18`, `func_00175338`,
`func_0016B22C`, `func_00176A0C`, `func_00145D54`, `func_00145D44`,
`func_00300B28`, `func_00176A34`, `func_001750A0`, `func_001673F4`,
`func_00302F52`, and `func_00136240`. The remaining two are standalone
secondary entries without function-start rows in the neutral inventory:
`service_record_lookup_secondary_52` and
`service_buffer_notify_secondary_52`. `func_00302F52` is a Thumb primary
entry reached with immediate `blx`; every other destination is ARM and
four-byte aligned. Register-indirect `blx` sites belong to the schedules but
are not relocations.

Six physical pool slots form six pairwise-distinct new literal classes:
`ipc_record_tag_52`, `ipc_guard_state_52`, `ipc_service_handle_52`,
`ipc_shared_object_52`, `ipc_fixed_extent_52`, and
`ipc_fallback_entry_52`. They are distinct from every literal class established
by IPC manifests 13 through 51. The cumulative IPC contract becomes 642
physical slots in 335 classes.

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; a following pool
belongs to the preceding section but lies outside its function size. Labels and
directives occupy no executable bytes. Preserve every mnemonic, operand,
register, condition, addressing mode, immediate, local branch, pool order, and
direct-branch form. Written `nop` instructions use the architectural encoding;
the two written `mov r0,r0` instructions retain the legacy no-op encoding.

```asm
.syntax unified
.arch armv6k
.fpu vfp
.arm

.macro BEGIN f
 .section .text.\f,"ax",%progbits
 .balign 4
 .arm
 .global \f
 .type \f,%function
\f:
.endm
.macro END f
 .size \f,.-\f
.endm

.global service_record_lookup_secondary_52,func_00174F18,func_00175338,func_0016B22C
.global func_00176A0C,func_00145D54,func_00145D44,func_00300B28
.global func_00176A34,func_001750A0,service_buffer_notify_secondary_52,func_00302F52
.global func_00136240
.global ipc_record_tag_52,ipc_guard_state_52,ipc_service_handle_52
.global ipc_shared_object_52,ipc_fixed_extent_52,ipc_fallback_entry_52

BEGIN func_00167224
push {r4,r5,r6,r7,r8,r9,r10,r11,lr}
sub sp,sp,#60
mov r6,r0
mov r7,r1
mov r5,r2
ldr r10,[sp,#96]
ldr r0,[r0,#4]
mov r4,r3
bl service_record_lookup_secondary_52
mov r11,r0
ldr r0,[r6]
mov r1,r11
ldr r2,[r0,#16]
mov r0,r6
blx r2
movs r1,r0
bne .Lhave_record_00167224
mov r3,r10
mov r2,r4
mov r1,r7
mov r0,r6
bl func_00174F18
movs r1,r0
beq .Lfail_00167224
.Lhave_record_00167224:
mov r2,#1
add r0,sp,#8
bl func_00175338
ldrb r2,[sp,#20]
add r0,sp,#8
mov r1,r5
cmp r2,#0
beq .Lprepare_00167224
bl func_0016B22C
cmp r0,#0
movne r0,#1
bne .Lreturn_00167224
.Lprepare_00167224:
mov r1,r5
add r0,sp,#8
bl func_00176A0C
mov r7,r0
add r8,r0,#32
ldr r0,[r4]
mov r1,r8
ldr r2,[r0,#8]
mov r0,r4
blx r2
movs r4,r0
beq .Lfail_00167224
mov r9,r8
bl func_00145D54
mov r8,r0
nop
bl func_00145D44
cmp r8,r4
add r1,r0,r8
bhi .Lfail_00167224
add r0,r4,r9
cmp r0,r1
bhi .Lfail_00167224
ldr r0,.Lpool_00167224
add r1,sp,#24
str r5,[sp,#32]
stm r1,{r0,r11}
mov r2,#32
mov r0,r4
bl func_00300B28
add r4,r4,#32
mov r1,r5
add r0,sp,#8
bl func_00176A34
stm sp,{r0,r10}
mov r3,r7
mov r2,r4
mov r1,r11
mov r0,r6
bl func_001750A0
cmp r0,r7
nop
beq .Lcommit_00167224
.Lfail_00167224:
mov r0,#0
.Lreturn_00167224:
add sp,sp,#60
pop {r4,r5,r6,r7,r8,r9,r10,r11,pc}
.Lcommit_00167224:
mov r2,r4
mov r1,r5
add r0,sp,#8
bl func_001673F4
mov r1,r7
mov r0,r4
bl service_buffer_notify_secondary_52
add sp,sp,#60
mov r0,#1
pop {r4,r5,r6,r7,r8,r9,r10,r11,pc}
END func_00167224
.Lpool_00167224:
.word ipc_record_tag_52

BEGIN func_00167398
ldr r0,.Lpool_00167398
push {r4,lr}
ldr r0,[r0,#4]
tst r0,#1
bne .Lfinish_00167398
ldr r0,.Lpool_00167398+4
blx func_00302F52
cmp r0,#0
beq .Lfinish_00167398
ldr r0,.Lpool_00167398+8
bl func_00136240
ldr r2,.Lpool_00167398+12
ldr r1,.Lpool_00167398+16
mov r0,r0
ldr r0,.Lpool_00167398+4
mov r0,r0
.Lfinish_00167398:
ldr r0,.Lpool_00167398+8
pop {r4,pc}
END func_00167398
.Lpool_00167398:
.word ipc_guard_state_52
.word ipc_service_handle_52
.word ipc_shared_object_52
.word ipc_fixed_extent_52
.word ipc_fallback_entry_52

BEGIN func_001673F4
ldrb r3,[r0,#12]
cmp r3,#0
ldrne r3,[r0,#8]
cmpne r3,#0
beq .Lempty_001673F4
ldr r0,[r0,#4]
ldr r0,[r0]
cmp r0,r1
ldrhi r0,[r3,r1,lsl #2]
strhi r2,[r3,r1,lsl #2]
bhi .Lreturn_001673F4
.Lempty_001673F4:
mov r0,#0
.Lreturn_001673F4:
bx lr
END func_001673F4
```

## Probe results

- The three assembled body sizes are exactly 368, 72, and 52 bytes, totaling
  492 bytes; their pools are excluded from those sizes.
- Every one of the 436 non-relocated body bytes matches independently. The
  fourteen four-byte direct-branch fields are represented by the relocation
  and identity contract above; their decoded destinations and branch forms
  were checked independently.
- The first function's single pool slot follows its 368-byte body. The second
  function's five ordered pool slots follow its 72-byte body. The third has no
  pool or relocations.
- All six physical pool values are pairwise distinct and are absent from every
  prior IPC literal class through batch 51.
