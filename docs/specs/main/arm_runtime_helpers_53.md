# Probe-verified ARM runtime/helper batch 53

## Scope and provenance

This clean-room specification covers four currently unmatched ARM-state, call-free helpers totaling 1,612 executable bytes. Evidence was limited to the current unmatched report, neutral symbol inventory, bounded private-target control/data-flow inspection, and independently assembled exact-schedule probes. The selection excludes all earlier configured functions, duplicate batch 53 reservations, and IPC batch 49 reservations.

No selected function has a direct or indirect call, literal pool, adjacent word, relocation, or symbolic identity. Independent ARMv6K assembly comparison against target revision `AS_EUR_REV2` on 2026-10-16 matched all four complete bodies and all 1,612 body bytes. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Labels and directives occupy no executable bytes. Preserve every displayed mnemonic, operand, register, condition, addressing mode, and instruction order.

## Four-sample VFP interpolation

`func_0013D540` is 408 bytes. Load four three-component vectors from the table referenced at owner offset 68, using two independent selector pairs and component-family bases 144, 156, and 168. First interpolate each pair with the scalar in `d0`, then interpolate those two results with the scalar in `d1`; write the resulting three floats to the output pointer supplied as the sixth argument.

```asm
push {r4, r5, r6, r7, r8, r9, r10, r11, lr}
mov r6, r0
mov r7, r2
mov r5, r3
mov r11, #168
add r8, r11, r1, lsl #2
vpush {d8}
add r2, r8, r5
ldr r0, [r0, #68]
vmov.f64 d8, d0
sub sp, sp, #52
add r2, r0, r2, lsl #2
ldr r4, [sp, #96]
vldr s2, [r2]
mov r2, #156
add r9, r2, r1, lsl #2
add r2, r9, r5
add r2, r0, r2, lsl #2
vldr s1, [r2]
mov r2, #144
add r10, r2, r1, lsl #2
add r1, r10, r5
add r0, r0, r1, lsl #2
vldr s0, [r0]
add r0, sp, #36
vstmia r0, {s0-s2}
ldr r0, [r6, #68]
add r1, r8, r4
add r1, r0, r1, lsl #2
vldr s2, [r1]
add r1, r9, r4
add r1, r0, r1, lsl #2
vldr s1, [r1]
add r1, r10, r4
add r0, r0, r1, lsl #2
vldr s0, [r0]
add r0, sp, #24
vstmia r0, {s0-s2}
ldr r0, [r6, #68]
add r9, r11, r7, lsl #2
add r1, r9, r5
add r1, r0, r1, lsl #2
vldr s2, [r1]
mov r1, #156
add r8, r1, r7, lsl #2
add r1, r8, r5
add r1, r0, r1, lsl #2
vldr s1, [r1]
mov r1, #144
add r7, r1, r7, lsl #2
add r1, r7, r5
add r0, r0, r1, lsl #2
vldr s0, [r0]
add r0, sp, #12
vstmia r0, {s0-s2}
ldr r0, [r6, #68]
add r1, r9, r4
add r1, r0, r1, lsl #2
vldr s2, [r1]
add r1, r8, r4
add r1, r0, r1, lsl #2
vldr s1, [r1]
add r1, r7, r4
add r0, r0, r1, lsl #2
vldr s0, [r0]
mov r0, sp
vstmia r0, {s0-s2}
add r2, sp, #40
vldr s5, [sp, #24]
vldr s4, [sp, #28]
vldr s3, [sp, #32]
vldr s2, [sp, #36]
vldr s8, [sp]
vldr s6, [sp, #8]
vsub.f32 s5, s5, s2
vldmia r2, {s0-s1}
add r2, sp, #12
vldr s7, [sp, #4]
ldr r0, [sp, #100]
vsub.f32 s4, s4, s0
vsub.f32 s3, s3, s1
vmla.f32 s2, s16, s5
vmla.f32 s0, s16, s4
vmla.f32 s1, s16, s3
vldmia r2, {s3-s5}
vsub.f32 s8, s8, s3
vsub.f32 s6, s6, s5
vsub.f32 s7, s7, s4
vmla.f32 s3, s16, s8
vmla.f32 s5, s16, s6
vmla.f32 s4, s16, s7
vsub.f32 s3, s3, s2
vsub.f32 s5, s5, s1
vsub.f32 s4, s4, s0
vmla.f32 s2, s17, s3
vmla.f32 s1, s17, s5
vmla.f32 s0, s17, s4
vstmia r0!, {s2}
vstmia r0, {s0-s1}
add sp, sp, #52
vpop {d8}
pop {r4, r5, r6, r7, r8, r9, r10, r11, pc}
```

## Unrolled 128-by-128 multiplication

`func_0019CD30` is 460 bytes. Treat `r1` and `r2` as four little-endian 32-bit limbs each. Compute the complete eight-limb unsigned product with an unrolled `umull` plus carry schedule and write its eight limbs to `r0`.

```asm
push {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
mov r12, #0
mov r11, #0
mov r10, #0
ldr r9, [r1]
ldr r8, [r2]
umull r5, r4, r9, r8
ldr r7, [r1, #4]
ldr r6, [r2]
adds r12, r12, r5
adcs r11, r11, r4
adcs r10, r10, #0
str r12, [r0]
mov r12, #0
umull r4, r5, r7, r6
ldr r9, [r1]
ldr r8, [r2, #4]
adds r11, r11, r4
adcs r10, r10, r5
adcs r12, r12, #0
umull r5, r4, r9, r8
ldr r7, [r1, #8]
ldr r6, [r2]
adds r11, r11, r5
adcs r10, r10, r4
adcs r12, r12, #0
str r11, [r0, #4]
mov r11, #0
umull r4, r5, r7, r6
ldr r9, [r1, #4]
ldr r8, [r2, #4]
adds r10, r10, r4
adcs r12, r12, r5
adcs r11, r11, #0
umull r5, r4, r9, r8
ldr r7, [r1]
ldr r6, [r2, #8]
adds r10, r10, r5
adcs r12, r12, r4
adcs r11, r11, #0
umull r4, r5, r7, r6
ldr r9, [r1, #12]
ldr r8, [r2]
adds r10, r10, r4
adcs r12, r12, r5
adcs r11, r11, #0
str r10, [r0, #8]
mov r10, #0
umull r5, r4, r9, r8
ldr r7, [r1, #8]
ldr r6, [r2, #4]
adds r12, r12, r5
adcs r11, r11, r4
adcs r10, r10, #0
umull r4, r5, r7, r6
ldr r9, [r1, #4]
ldr r8, [r2, #8]
adds r12, r12, r4
adcs r11, r11, r5
adcs r10, r10, #0
umull r5, r4, r9, r8
ldr r7, [r1]
ldr r6, [r2, #12]
adds r12, r12, r5
adcs r11, r11, r4
adcs r10, r10, #0
umull r4, r5, r7, r6
ldr r9, [r1, #12]
ldr r8, [r2, #4]
adds r12, r12, r4
adcs r11, r11, r5
adcs r10, r10, #0
str r12, [r0, #12]
mov r12, #0
umull r5, r4, r9, r8
ldr r7, [r1, #8]
ldr r6, [r2, #8]
adds r11, r11, r5
adcs r10, r10, r4
adcs r12, r12, #0
umull r4, r5, r7, r6
ldr r9, [r1, #4]
ldr r8, [r2, #12]
adds r11, r11, r4
adcs r10, r10, r5
adcs r12, r12, #0
umull r5, r4, r9, r8
ldr r7, [r1, #12]
ldr r6, [r2, #8]
adds r11, r11, r5
adcs r10, r10, r4
adcs r12, r12, #0
str r11, [r0, #16]
mov r11, #0
umull r4, r5, r7, r6
ldr r9, [r1, #8]
ldr r8, [r2, #12]
adds r10, r10, r4
adcs r12, r12, r5
adcs r11, r11, #0
umull r5, r4, r9, r8
ldr r7, [r1, #12]
ldr r6, [r2, #12]
adds r10, r10, r5
adcs r12, r12, r4
adcs r11, r11, #0
str r10, [r0, #20]
mov r10, #0
umull r4, r5, r7, r6
adds r12, r12, r4
adcs r11, r11, r5
adcs r10, r10, #0
str r12, [r0, #24]
str r11, [r0, #28]
pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
```

## Unrolled 128-bit squaring

`func_0019CEFC` is 372 bytes. Treat `r1` as four little-endian 32-bit limbs. Compute the complete eight-limb unsigned square at `r0`, doubling each off-diagonal partial product with the displayed carry schedule.

```asm
push {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
mov r12, #0
mov r11, #0
mov r10, #0
ldr r9, [r1]
umull r5, r4, r9, r9
ldr r7, [r1, #4]
ldr r6, [r1]
adds r12, r12, r5
adcs r11, r11, r4
adcs r10, r10, #0
str r12, [r0]
mov r12, #0
umull r4, r5, r7, r6
ldr r9, [r1, #8]
ldr r8, [r1]
adds r11, r11, r4
adcs r10, r10, r5
adcs r12, r12, #0
adds r11, r11, r4
adcs r10, r10, r5
adcs r12, r12, #0
str r11, [r0, #4]
mov r11, #0
umull r5, r4, r9, r8
ldr r7, [r1, #4]
adds r10, r10, r5
adcs r12, r12, r4
adcs r11, r11, #0
adds r10, r10, r5
adcs r12, r12, r4
adcs r11, r11, #0
umull r4, r5, r7, r7
ldr r9, [r1, #12]
ldr r8, [r1]
adds r10, r10, r4
adcs r12, r12, r5
adcs r11, r11, #0
str r10, [r0, #8]
mov r10, #0
umull r5, r4, r9, r8
ldr r7, [r1, #8]
ldr r6, [r1, #4]
adds r12, r12, r5
adcs r11, r11, r4
adcs r10, r10, #0
adds r12, r12, r5
adcs r11, r11, r4
adcs r10, r10, #0
umull r4, r5, r7, r6
ldr r9, [r1, #12]
ldr r8, [r1, #4]
adds r12, r12, r4
adcs r11, r11, r5
adcs r10, r10, #0
adds r12, r12, r4
adcs r11, r11, r5
adcs r10, r10, #0
str r12, [r0, #12]
mov r12, #0
umull r5, r4, r9, r8
ldr r7, [r1, #8]
adds r11, r11, r5
adcs r10, r10, r4
adcs r12, r12, #0
adds r11, r11, r5
adcs r10, r10, r4
adcs r12, r12, #0
umull r4, r5, r7, r7
ldr r9, [r1, #12]
ldr r8, [r1, #8]
adds r11, r11, r4
adcs r10, r10, r5
adcs r12, r12, #0
str r11, [r0, #16]
mov r11, #0
umull r5, r4, r9, r8
ldr r7, [r1, #12]
adds r10, r10, r5
adcs r12, r12, r4
adcs r11, r11, #0
adds r10, r10, r5
adcs r12, r12, r4
adcs r11, r11, #0
str r10, [r0, #20]
mov r10, #0
umull r4, r5, r7, r7
adds r12, r12, r4
adcs r11, r11, r5
adcs r10, r10, #0
str r12, [r0, #24]
str r11, [r0, #28]
pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
```

## Descriptor extent summary

`func_001FC800` is 372 bytes. Read the descriptor ranges beginning at input offsets 176 through 304, calculate each end using its record stride, and track their unsigned maximum with a floor of 312. Store the final maximum and the preserved intermediate maxima in the five-word result at `r0`, with its final word cleared.

```asm
add r2, r1, #176
push {r4, r5, r6}
mov r3, #312
ldm r2, {r2, r12}
ldr r4, [r1, #212]
add r2, r2, r12
cmp r2, #312
movls r2, r3
add r3, r1, #192
ldm r3, {r3, r12}
add r3, r3, r12
cmp r2, r3
movcc r2, r3
add r3, r1, #200
ldm r3, {r3, r12}
add r12, r12, r12, lsl #1
add r3, r3, r12, lsl #2
ldr r12, [r1, #208]
cmp r2, r3
movcc r2, r3
add r12, r12, r4, lsl #3
cmp r2, r12
mov r3, r2
ldr r4, [r1, #220]
movcc r2, r12
ldr r12, [r1, #216]
add r12, r12, r4, lsl #2
cmp r2, r12
movcc r2, r12
ldr r4, [r1, #228]
ldr r12, [r1, #224]
add r12, r12, r4
cmp r2, r12
ldr r4, [r1, #236]
movcc r2, r12
ldr r12, [r1, #232]
add r12, r12, r4, lsl #3
ldrd r4, [r1, #240]
cmp r2, r12
movcc r2, r12
mov r12, r2
add r4, r4, r5, lsl #3
cmp r2, r4
movcc r2, r4
ldrd r4, [r1, #248]
add r5, r5, r5, lsl #1
add r4, r4, r5, lsl #2
cmp r2, r4
movcc r2, r4
add r4, r1, #256
ldm r4, {r4, r5}
add r4, r4, r5, lsl #3
cmp r2, r4
movcc r2, r4
add r4, r1, #264
ldm r4, {r4, r5}
add r4, r4, r5, lsl #3
cmp r2, r4
movcc r2, r4
add r4, r1, #272
ldm r4, {r4, r5}
add r4, r4, r5, lsl #3
cmp r2, r4
movcc r2, r4
add r4, r1, #280
ldm r4, {r4, r5}
add r4, r4, r5
add r5, r1, #304
cmp r2, r4
ldm r5, {r5, r6}
movcc r2, r4
mov r4, r2
add r6, r6, r6, lsl #1
add r5, r5, r6, lsl #2
cmp r2, r5
movcc r2, r5
add r5, r1, #288
ldm r5, {r5, r6}
add r5, r5, r6, lsl #3
cmp r2, r5
movcc r2, r5
ldr r5, [r1, #296]
ldr r1, [r1, #300]
add r1, r1, r1, lsl #1
add r1, r5, r1, lsl #2
cmp r2, r1
movcc r2, r1
mov r1, #0
str r1, [r0, #16]
str r3, [r0, #12]
stm r0, {r2, r4, r12}
pop {r4, r5, r6}
bx lr
```
