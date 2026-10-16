# Probe-verified ARM service/data wrappers 76

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function report, neutral global-symbol
  inventory, bounded private-target control/data-flow inspection, physical
  literal equality analysis, direct-transfer resolution, and independent LLVM
  21.1.8 Arm assembly and normalized exact-target comparison.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private literal values, private strings, assets, implementation,
  or proprietary source are present.
- Implementation source SHA-256: `5bcb8105490dbf3ab2c06900213ca147105827854ede750bd0d6312933b89f6f`.
- Normalized normative-schedule SHA-256: `5bcb8105490dbf3ab2c06900213ca147105827854ede750bd0d6312933b89f6f`.

This batch covers four still-unmatched ARM service object, indexed record,
buffer-layout, and callback-dispatch bodies. The executable bodies total
exactly 908 bytes (227 instructions). Selection was collision-audited against
every current config, including pending runtime, duplicate, template, and IPC
cohorts. None of the four names occurs as a configured primary body, alias,
secondary entry, branch destination, literal code entry, or material owner.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_0018E080` | `.text.func_0018E080` | 348 | `func_0018E1E0` at +352 | Initialize a service record container, grow its eight-byte element store when needed, preserve existing elements, release the old allocation, and publish the new bounds. |
| `func_0018E480` | `.text.func_0018E480` | 80 | `func_0018E4D8` at +88 | Resolve an indexed service record from the live allocator-backed table when enabled, otherwise return the corresponding embedded fallback record. |
| `func_0018EAD8` | `.text.func_0018EAD8` | 256 | `func_0018EBE4` at +268 | Snapshot buffer dimensions, derive aligned scaled plane extents, publish all plane boundaries, finalize the layout, and mark it initialized. |
| `func_0018F43C` | `.text.func_0018F43C` | 224 | `func_0018F51C` at +224 | Validate the active service record kind, dispatch its present teardown callbacks in order, release the record, clear ownership, and return the kind-dependent result. |

Each body owns exactly the reached literal words listed below; the first three
therefore end at their following globals after four, eight, and twelve adjacent
bytes respectively. `func_0018F43C` ends exactly at its following global. The
batch owns 908 executable bytes and 24 adjacent literal bytes, with no padding,
gap, secondary entry, private string, asset, or unrelated material.

All four report entries lack `fuzzy_match_percent`, and report sizes agree with
the neutral symbol inventory. Their complete body byte strings are each unique
among current ARM global bodies. A fresh all-config audit found no ownership or
reference collision for any selected name.

## Literal positional and equality contract

There are exactly six physical literal slots in five semantic identity classes.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_0018E080` | +348 | +0 | `ipc_record_vtable_76` | New. |
| `func_0018E480` | +80 | +0 | `ipc_allocator_dispatch_owner_68` | Reused; equal to every established slot of this identity. |
| `func_0018E480` | +84 | +12 | `ipc_service_record_table_76` | New. |
| `func_0018EAD8` | +256 | +16 | `ipc_u32_float_limit_76` | New; equal to the slot at +260. |
| `func_0018EAD8` | +260 | +20 | `ipc_u32_float_limit_76` | New; equal to the slot at +256. |
| `func_0018EAD8` | +264 | +28 | `ipc_dimension_scale_76` | New. |

The four new classes are pairwise unequal and unequal to every previously
configured literal identity. Starting from the IPC75 totals of 771 physical
slots in 406 classes, this batch advances the cumulative totals to exactly 777
slots in 410 classes.

## Direct-transfer and entry contract

There are exactly four symbolic direct-transfer relocations in four primary
entry classes. All destinations are aligned ARM entries; there are no secondary
entries.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0018E080` | +128 | `R_ARM_CALL` | `bl` | `func_00184990` |
| `func_0018E080` | +300 | `R_ARM_CALL` | `bl` | `func_00302108` |
| `func_0018E480` | +36 | `R_ARM_CALL` | `bl` | `func_001888A8` |
| `func_0018EAD8` | +240 | `R_ARM_CALL` | `bl` | `func_00190888` |

The four primary classes are pairwise distinct singleton classes. Every other
B-family instruction in the schedule targets a local label or register and
produces no symbolic relocation.

## Complete normative mnemonic schedules

The schedule is complete and literal. `BEGIN` emits only the standard ARM
section/function header; `END` fixes executable symbol size before each owned
pool. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, condition, addressing mode, immediate, local target,
transfer form, pool position, and equality identity.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
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

.global func_00184990,func_00302108,func_001888A8,func_00190888
.global ipc_record_vtable_76,ipc_allocator_dispatch_owner_68
.global ipc_service_record_table_76,ipc_u32_float_limit_76
.global ipc_dimension_scale_76

BEGIN func_0018E080
ldr r1,.Lrecord_vtable_0018E080
push {r4,r5,r6,lr}
sub sp,sp,#8
str r1,[r0],#4
mov r4,r0
mov r2,#0
str r2,[r0,#4]!
mov r1,#16
str r2,[r0,#4]
str r2,[r0,#8]
str r1,[sp]
ldr r0,[r4,#4]
ldr r2,[r4,#12]
sub r2,r2,r0
cmp r1,r2,asr #3
bls .Lcontainer_done_0018E080
ldr r2,[r4,#8]
ldr r3,[sp]
mov r1,sp
sub r0,r2,r0
asr r0,r0,#3
add r2,r0,r0,lsr #1
add r2,r2,r0,lsr #3
add r0,r0,#32
cmp r0,r2
movhi r2,r0
cmp r3,r2
add r0,sp,#4
movlo r1,r0
str r2,[sp,#4]
ldr r6,[r1]
lsl r0,r6,#3
bl func_00184990
add r3,r4,#4
mov r5,r0
ldm r3,{r1,r3}
cmp r1,r3
beq .Lcopy_done_0018E080
.Lcopy_loop_0018E080:
cmp r0,#0
beq .Lcopy_advance_0018E080
ldrb r12,[r1]
strb r12,[r0]
ldr r12,[r1,#4]
str r12,[r0,#4]
.Lcopy_advance_0018E080:
add r1,r1,#8
cmp r1,r3
add r0,r0,#8
bne .Lcopy_loop_0018E080
.Lcopy_done_0018E080:
ldr r0,[r4,#8]
ldr r1,[r4,#4]
cmp r0,r1
movls r3,#0
bls .Lrelease_count_0018E080
sub r2,r0,r1
lsl r2,r2,#28
lsr r3,r2,#31
.Lrelease_count_0018E080:
sub r12,r0,r1
mov r2,#1
add r0,r3,#1
add r3,r2,r12,asr #3
cmp r3,r0
addgt r2,r2,r12,asr #3
ble .Lrelease_ready_0018E080
.Lrelease_adjust_0018E080:
add r0,r0,#2
cmp r2,r0
bgt .Lrelease_adjust_0018E080
.Lrelease_ready_0018E080:
cmp r1,#0
beq .Lpublish_store_0018E080
ldr r2,[r1,#-8]!
mov r0,r1
cmp r2,#0
beq .Ldefault_release_0018E080
blx r2
b .Lpublish_store_0018E080
.Ldefault_release_0018E080:
nop
bl func_00302108
.Lpublish_store_0018E080:
ldr r0,[r4,#8]
ldr r1,[r4,#4]
str r5,[r4,#4]
sub r0,r0,r1
bic r0,r0,#7
add r1,r5,r6,lsl #3
add r0,r0,r5
strd r0,r1,[r4,#8]
.Lcontainer_done_0018E080:
add sp,sp,#8
sub r0,r4,#4
pop {r4,r5,r6,pc}
END func_0018E080
.Lrecord_vtable_0018E080:
.word ipc_record_vtable_76

BEGIN func_0018E480
ldr r1,.Lallocator_owner_0018E480
rsb r2,r0,r0,lsl #3
push {r4,lr}
ldr r3,.Lrecord_table_0018E480
ldrb r0,[r1,#13]
add r4,r3,r2,lsl #6
cmp r0,#0
beq .Lfallback_record_0018E480
ldr r0,[r1,#148]
bl func_001888A8
ldr r0,[r0]
cmp r0,#0
beq .Lfallback_record_0018E480
add r0,r0,r0,lsl #3
ldr r1,[r4,#8]
add r0,r0,r0,lsl #1
add r0,r1,r0,lsl #3
pop {r4,pc}
.Lfallback_record_0018E480:
add r0,r4,#16
pop {r4,pc}
END func_0018E480
.Lallocator_owner_0018E480:
.word ipc_allocator_dispatch_owner_68
.Lrecord_table_0018E480:
.word ipc_service_record_table_76

BEGIN func_0018EAD8
push {r4,r5,r6,lr}
mov r4,r0
ldr r1,[r0,#12]
ldr r0,[r0,#4]
ldr lr,.Lu32_float_limit_a_0018EAD8
vldr s0,.Lu32_float_limit_b_0018EAD8
vmov s1,r0
vldr s2,.Ldimension_scale_0018EAD8
add r2,r4,#48
ldm r2,{r2,r3,r12}
vcvt.f32.u32 s1,s1
vmov r5,s1
cmp r5,lr
vmovgt s1,r0
add r5,r4,#240
stm r5,{r0,r1,r2,r3,r12}
lsl r2,r2,#2
lsl r3,r3,#2
vcvtgt.f32.u32 s1,s1
vmovle.f32 s1,s0
vmul.f32 s1,s1,s2
vcvt.u32.f32 s1,s1
vmov r0,s1
vmov s1,r1
add r0,r0,r0,lsl #2
lsl r0,r0,#7
vcvt.f32.u32 s1,s1
vmov r5,s1
cmp r5,lr
vmovgt s0,r1
ldr r5,[r4,#40]
lsl lr,r12,#2
add r12,r5,#31
bic r12,r12,#31
vcvtgt.f32.u32 s0,s0
str r12,[r4,#60]
add r12,r12,r0
str r12,[r4,#76]
vmul.f32 s0,s0,s2
vcvt.u32.f32 s0,s0
vmov r1,s0
add r1,r1,r1,lsl #2
lsl r1,r1,#7
add r12,r12,r1
str r12,[r4,#92]
add r12,r12,r2
str r12,[r4,#96]
add r12,r12,r3
str r12,[r4,#124]
add r12,r12,lr
add r0,r0,r12
str r12,[r4,#64]
str r0,[r4,#80]
add r0,r0,r1
str r0,[r4,#100]
add r0,r0,r2
str r0,[r4,#104]
add r0,r0,r3
str r0,[r4,#128]
mov r0,r4
bl func_00190888
mov r0,#1
strb r0,[r4,#260]
pop {r4,r5,r6,pc}
END func_0018EAD8
.Lu32_float_limit_a_0018EAD8:
.word ipc_u32_float_limit_76
.Lu32_float_limit_b_0018EAD8:
.word ipc_u32_float_limit_76
.Ldimension_scale_0018EAD8:
.word ipc_dimension_scale_76

BEGIN func_0018F43C
push {r4,r5,r6,lr}
movs r4,r0
ldrne r0,[r4,#28]
cmpne r0,#0
beq .Linvalid_record_0018F43C
ldr r5,[r0,#4]
cmp r5,#42
cmpne r5,#69
beq .Lvalid_kind_0018F43C
cmp r5,#73
cmpne r5,#91
beq .Lvalid_kind_0018F43C
cmp r5,#103
cmpne r5,#113
subne r1,r5,#512
subsne r1,r1,#154
beq .Lvalid_kind_0018F43C
.Linvalid_record_0018F43C:
mvn r0,#1
pop {r4,r5,r6,pc}
.Lvalid_kind_0018F43C:
ldr r1,[r0,#8]
cmp r1,#0
beq .Lcallback_44_0018F43C
ldr r2,[r4,#36]
ldr r0,[r4,#40]
blx r2
.Lcallback_44_0018F43C:
ldr r0,[r4,#28]
ldr r1,[r0,#68]
cmp r1,#0
beq .Lcallback_40_0018F43C
ldr r2,[r4,#36]
ldr r0,[r4,#40]
blx r2
.Lcallback_40_0018F43C:
ldr r0,[r4,#28]
ldr r1,[r0,#64]
cmp r1,#0
beq .Lcallback_38_0018F43C
ldr r2,[r4,#36]
ldr r0,[r4,#40]
blx r2
.Lcallback_38_0018F43C:
ldr r0,[r4,#28]
ldr r1,[r0,#56]
cmp r1,#0
beq .Lrelease_record_0018F43C
ldr r2,[r4,#36]
ldr r0,[r4,#40]
blx r2
.Lrelease_record_0018F43C:
ldr r2,[r4,#36]
ldr r0,[r4,#40]
ldr r1,[r4,#28]
blx r2
mov r0,#0
cmp r5,#113
str r0,[r4,#28]
mvneq r0,#2
movne r0,#0
pop {r4,r5,r6,pc}
END func_0018F43C
```

## Verification and implementation handoff

Independent ARMv6K/VFPv2 assembly and normalized comparison matched all four
complete executable bodies, all four relocation sites and four classes, all
six physical literal slots, and every literal equality relation against the
target. The unmatched/collision audit covered every report entry and current
config; body uniqueness was checked over all complete ARM global bodies.

Implement this artifact as `src/main/arm_ipc_wrappers_76.S` without access to
the private target, disassembly, unmatched report, symbol inventory, or probe
products. The implementation source SHA-256 remains pending until that source
exists; its final hash must replace `PENDING` in this
specification and the neutral config.
