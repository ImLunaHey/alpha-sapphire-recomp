# Probe-verified ARM service/data wrappers 72

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the authoritative unmatched-function inventory, bounded private-target
  control/data-flow inspection, direct-transfer resolution, physical literal
  equality analysis, and an independent GNU Arm normalized-exact schedule probe.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, target hashes, private literal values, private strings, assets,
  implementation, or proprietary source are present.
- Implementation source SHA-256: `e2480389de33b142512bf4a004a51bbc95c080e38bf35f84fdb8a799b54a33ca`.

This batch covers four still-unmatched ARM service-state, descriptor-copy,
submission, and dispatch bodies totaling exactly 644 executable bytes. It is
disjoint from every earlier IPC cohort and from the pending runtime 78 and
duplicate 75 cohorts.

## Function, extent, and semantic contract

| Function | Section | Body | Next global | Contract |
|---|---|---:|---|---|
| `func_0018C18C` | `.text.func_0018C18C` | 152 | `func_0018C238` at +172 | Inspect service-state flags, perform the requested refresh or shutdown transition, and either register the final handle or retry the refresh path. |
| `func_0018C238` | `.text.func_0018C238` | 152 | `func_0018C2D4` at +156 | Publish one compact descriptor into an indexed destination, copying each optional halfword or word field selected by the source flags before dispatching the result. |
| `func_0018C3EC` | `.text.func_0018C3EC` | 300 | `func_0018C62C` at +576 | If submission is active, publish two indexed payloads through both service paths, update timing and sequence state, release the synchronization primitive, and advance the producer index. |
| `func_0018CA70` | `.text.func_0018CA70` | 40 | `func_0018CA98` at +40 | Dispatch an indexed member with the supplied payload, then remember that payload when the caller requests publication. |

## Positional identity and transfer contract

`func_0018C18C` owns five post-body literal slots at +152 through +168. Their
load-site sets are respectively `{+8}`, `{+24}`, `{+28,+56,+132}`,
`{+84,+92}`, and `{+124}`. `func_0018C238` owns one slot at +152, reached by
the load at +144; that slot shares the exact
`ipc_shared_control_owner_72` identity used by the third slot of
`func_0018C18C`. `func_0018C3EC` owns three slots at +300, +304, and +308,
reached respectively from +20, +24, and +44. Private equality analysis found
the eight resulting identities pairwise distinct and unequal to every earlier
IPC identity. Starting from the IPC71 baseline of 742 slots in 390 classes,
this batch therefore requires 751 physical slots in 398 classes.

There are exactly 21 symbolic direct-transfer sites: eighteen unconditional
call relocations, one conditional call-form jump relocation, and two tail
jumps. Two sites share `ipc_publish_secondary_72`, two share
`func_0018E820`, and every other destination is a singleton. All nineteen
destination classes are pairwise distinct. The three secondary identities are
fixed positionally: `ipc_publish_secondary_72` is +32 from
`func_0018C008` and 356 bytes before `func_0018C18C`;
`ipc_registration_secondary_72` is +172 from `func_00132C20` and 48 bytes
before `func_00132CFC`; and `ipc_refresh_secondary_72` is +312 from
`func_0018C3EC` and 264 bytes before `func_0018C62C`. All other conditional
transfers remain local and create no symbolic relocation.

| Body | Offset | Kind | Mnemonic | Destination |
|---|---:|---|---|---|
| `func_0018C18C` | +36 | `R_ARM_CALL` | `bl` | `func_0018C62C` |
| `func_0018C18C` | +60 | `R_ARM_CALL` | `bl` | `ipc_refresh_secondary_72` |
| `func_0018C18C` | +88 | `R_ARM_CALL` | `bl` | `func_001600B0` |
| `func_0018C18C` | +100 | `R_ARM_CALL` | `bl` | `func_00132A14` |
| `func_0018C18C` | +128 | `R_ARM_JUMP24` | `b` | `ipc_registration_secondary_72` |
| `func_0018C18C` | +136 | `R_ARM_CALL` | `bl` | `func_0018C6B4` |
| `func_0018C238` | +32 | `R_ARM_CALL` | `bl` | `func_00179DD0` |
| `func_0018C238` | +148 | `R_ARM_JUMP24` | `b` | `func_00179FBC` |
| `func_0018C3EC` | +8 | `R_ARM_CALL` | `bl` | `func_0017E4D8` |
| `func_0018C3EC` | +28 | `R_ARM_CALL` | `bl` | `func_00186EB8` |
| `func_0018C3EC` | +96 | `R_ARM_CALL` | `bl` | `ipc_publish_secondary_72` |
| `func_0018C3EC` | +112 | `R_ARM_CALL` | `bl` | `ipc_publish_secondary_72` |
| `func_0018C3EC` | +128 | `R_ARM_CALL` | `bl` | `func_0018E820` |
| `func_0018C3EC` | +144 | `R_ARM_CALL` | `bl` | `func_0018E820` |
| `func_0018C3EC` | +156 | `R_ARM_CALL` | `bl` | `func_0018E5C0` |
| `func_0018C3EC` | +168 | `R_ARM_CALL` | `bl` | `func_0018E76C` |
| `func_0018C3EC` | +184 | `R_ARM_CALL` | `bl` | `func_0018E7A0` |
| `func_0018C3EC` | +196 | `R_ARM_CALL` | `bl` | `func_0018E54C` |
| `func_0018C3EC` | +212 | `R_ARM_CALL` | `bl` | `func_0018E5F4` |
| `func_0018C3EC` | +268 | `R_ARM_JUMP24` | `blne` | `func_001603A0` |
| `func_0018CA70` | +24 | `R_ARM_CALL` | `bl` | `func_00190C20` |

## Complete normative mnemonic schedules

The schedule below is complete and literal. `BEGIN` emits only the standard ARM
section/function header and `END` fixes the executable body size. Each `.word`
is adjacent data outside the preceding declared body. Labels and directives
occupy no executable bytes. Preserve every mnemonic, operand, condition,
addressing mode, immediate, local branch, direct-transfer form, pool position,
and pool order.

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

.global func_0018C62C,ipc_refresh_secondary_72,func_001600B0
.global func_00132A14,ipc_registration_secondary_72,func_0018C6B4
.global func_00179DD0,func_00179FBC,func_0017E4D8,func_00186EB8
.global ipc_publish_secondary_72,func_0018E820,func_0018E5C0
.global func_0018E76C,func_0018E7A0,func_0018E54C,func_0018E5F4
.global func_001603A0,func_00190C20
.global ipc_state_flags_72,ipc_frame_payload_table_72
.global ipc_shared_control_owner_72,ipc_shutdown_service_owner_72
.global ipc_registration_handle_72,ipc_exchange_context_72
.global ipc_submission_owner_72,ipc_payload_stride_72

BEGIN func_0018C18C
push {r4,r5,r6,lr}
mov r5,#0
ldr r4,.Lpool_0018C18C_state
ldrb r0,[r4,#2]
cmp r0,#0
beq .Lstate_ready_0018C18C
ldr r2,.Lpool_0018C18C_payload
ldr r0,.Lpool_0018C18C_control
mov r3,#0
bl func_0018C62C
cmp r0,#0
moveq r0,#1
strbeq r0,[r4,#1]
beq .Lstate_ready_0018C18C
.Lrefresh_0018C18C:
ldr r0,.Lpool_0018C18C_control
bl ipc_refresh_secondary_72
strb r5,[r4,#5]
pop {r4,r5,r6,pc}
.Lstate_ready_0018C18C:
ldrb r0,[r4,#1]
cmp r0,#0
beq .Lregistration_0018C18C
ldr r0,.Lpool_0018C18C_shutdown
bl func_001600B0
ldr r0,.Lpool_0018C18C_shutdown
nop
bl func_00132A14
.Lregistration_0018C18C:
ldrb r0,[r4,#3]
cmp r0,#0
beq .Lfallback_0018C18C
pop {r4,r5,r6,lr}
mov r1,#0
ldr r0,.Lpool_0018C18C_handle
b ipc_registration_secondary_72
.Lfallback_0018C18C:
ldr r0,.Lpool_0018C18C_control
bl func_0018C6B4
nop
nop
b .Lrefresh_0018C18C
END func_0018C18C
.Lpool_0018C18C_state:
.word ipc_state_flags_72
.Lpool_0018C18C_payload:
.word ipc_frame_payload_table_72
.Lpool_0018C18C_control:
.word ipc_shared_control_owner_72
.Lpool_0018C18C_shutdown:
.word ipc_shutdown_service_owner_72
.Lpool_0018C18C_handle:
.word ipc_registration_handle_72

BEGIN func_0018C238
push {r4,r5,r6,lr}
mov r4,r1
ldrh r1,[r2,#2]
add r0,r0,r4
mov r5,r2
cmp r1,#0
movne r1,#1
strb r1,[r0,#4]
bl func_00179DD0
mov r2,r5
mov r1,r4
pop {r4,r5,r6,lr}
mov r0,r0
ldrh r3,[r2]
add ip,r1,r1,lsl #2
tst r3,#1
ldrhne r3,[r2,#2]
add r0,r0,ip,lsl #2
strhne r3,[r0,#2]
ldrh r3,[r2]
tst r3,#4
beq .Lword_fields_0018C238
ldrh r3,[r2,#6]
strh r3,[r0,#6]
ldrh r3,[r2,#12]
strh r3,[r0,#12]
ldrh r3,[r2,#14]
strh r3,[r0,#14]
ldrh r3,[r2,#16]
strh r3,[r0,#16]
ldrh r3,[r2,#18]
strh r3,[r0,#18]
.Lword_fields_0018C238:
ldrh r3,[r2]
tst r3,#2
ldrne r3,[r2,#8]
strne r3,[r0,#8]
ldr r0,.Lpool_0018C238_control
b func_00179FBC
END func_0018C238
.Lpool_0018C238_control:
.word ipc_shared_control_owner_72

BEGIN func_0018C3EC
push {r4,r5,r6,r7,r8,r9,sl,lr}
mov r4,r0
bl func_0017E4D8
cmp r0,#0
beq .Lreturn_0018C3EC
ldr r7,.Lpool_0018C3EC_exchange
ldr r8,.Lpool_0018C3EC_submission
bl func_00186EB8
add r5,r4,#4864
mov r9,r0
ldrh r0,[r5,#28]
ldr r1,.Lpool_0018C3EC_stride
add r0,r4,r0,lsl #3
ldr r6,[r1,r0]
add r0,r0,#4096
add r0,r0,#4
ldr sl,[r0,#752]
add r0,r1,#700
ldrb r0,[r0,r4]
cmp r0,#0
beq .Lpublish_primary_0018C3EC
mov r2,r6
mov r1,#0
mov r0,r7
bl ipc_publish_secondary_72
mov r2,sl
mov r1,#1
mov r0,r7
bl ipc_publish_secondary_72
.Lpublish_primary_0018C3EC:
mov r2,r6
mov r1,#0
mov r0,r7
bl func_0018E820
mov r2,sl
mov r1,#1
mov r0,r7
bl func_0018E820
mov r0,r8
nop
bl func_0018E5C0
mov r0,r8
nop
bl func_0018E76C
add r6,r4,#4096
mov r0,r7
ldr sl,[r6,#800]
bl func_0018E7A0
sub r7,sl,r0
mov r0,r9
bl func_0018E54C
sub r1,r7,r0
ldr r2,[r6,#804]
mov r0,r8
bl func_0018E5F4
ldrh r1,[r5,#30]
ldrh r0,[r5,#26]
add r1,r4,r1,lsl #2
add r1,r1,#4096
ldr r1,[r1,#152]
strh r0,[r1]
ldrh r0,[r5,#26]
add r0,r0,#1
strh r0,[r5,#26]
ldr r0,[r4,#4]
svc #24
lsrs r1,r0,#31
nop
blne func_001603A0
ldrh r0,[r5,#26]
and r0,r0,#1
strh r0,[r5,#30]
ldrb r0,[r5,#25]
add r0,r0,#1
strb r0,[r6,#793]
.Lreturn_0018C3EC:
pop {r4,r5,r6,r7,r8,r9,sl,pc}
END func_0018C3EC
.Lpool_0018C3EC_exchange:
.word ipc_exchange_context_72
.Lpool_0018C3EC_submission:
.word ipc_submission_owner_72
.Lpool_0018C3EC_stride:
.word ipc_payload_stride_72

BEGIN func_0018CA70
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,r1,lsl #2]
mov r5,r2
mov r6,r3
mov r1,r2
bl func_00190C20
cmp r6,#0
strne r5,[r4,#28]
pop {r4,r5,r6,pc}
END func_0018CA70
```

## Independent probe result

The normative schedule was independently assembled with the pinned GNU Arm
toolchain in ARMv6K/VFPv2 mode. Section-scoped comparison against the private
target confirmed all 161 executable instructions, all local-control targets,
all nine literal reaches and their physical order, all 21 symbolic transfer
sites, all function sizes, and all four next-global boundaries. The comparison
normalizes only relocation payload fields; opcode, condition, register,
addressing-mode, immediate, and local-displacement bits remain exact.
