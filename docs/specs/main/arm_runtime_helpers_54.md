# Probe-verified ARM runtime/helper batch 54

## Scope and provenance

This clean-room specification covers two currently unmatched ARM-state, call-free fixed-width arithmetic helpers totaling 1,740 executable bytes. Evidence was limited to the current unmatched report, neutral symbol inventory, bounded private-target control/data-flow inspection, and independently assembled exact-schedule probes. The selection excludes all earlier configured functions plus duplicate batch 54 and IPC batch 50 reservations.

Neither function contains a direct or indirect call, branch, literal pool, adjacent word, relocation, or symbolic identity. Independent ARMv6K assembly comparison against target revision `AS_EUR_REV2` on 2026-10-16 matched both complete bodies and all 1,740 body bytes. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Labels and directives occupy no executable bytes. Preserve every displayed mnemonic, operand, register, condition, addressing mode, and instruction order.

## Six-limb multiplication

`func_0019D070` is 972 bytes. Treat `r1` and `r2` as six little-endian 32-bit limbs each. Compute the complete twelve-limb unsigned product with the fully unrolled `umull` plus carry schedule and write its twelve limbs to `r0`.

```asm
push	{r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
mov	ip, #0
mov	fp, #0
mov	sl, #0
ldr	r9, [r1]
ldr	r8, [r2]
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0]
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #4]
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #4]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #8]
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #12]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #16]
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #4]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #12]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #20]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #20]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #24]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #20]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #12]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #28]
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #32]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #20]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #20]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #36]
mov	ip, #0
umull	r4, r5, r7, r6
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #40]
str	sl, [r0, #44]
pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

## Six-limb squaring

`func_0019D43C` is 768 bytes. Treat `r1` as six little-endian 32-bit limbs. Compute its complete twelve-limb unsigned square, doubling each off-diagonal product in the exact displayed carry schedule, and write the twelve result limbs to `r0`.

```asm
push	{r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
mov	ip, #0
mov	fp, #0
mov	sl, #0
ldr	r9, [r1]
umull	r5, r4, r9, r9
ldr	r7, [r1, #4]
ldr	r6, [r1]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0]
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r1]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #4]
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #12]
ldr	r8, [r1]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #8]
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r1, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r1]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #12]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r1, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r9
ldr	r7, [r1, #20]
ldr	r6, [r1]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #16]
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r1, #4]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r1, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r1, #4]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #20]
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r1, #8]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r9
ldr	r7, [r1, #20]
ldr	r6, [r1, #8]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #24]
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r1, #12]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r1, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #28]
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r9
ldr	r7, [r1, #20]
ldr	r6, [r1, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #32]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #36]
mov	ip, #0
umull	r5, r4, r9, r9
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #40]
str	sl, [r0, #44]
pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

## Verification contract

- Emit each helper in its own executable ARM section named `.text.<function>`.
- Export one global function symbol spanning exactly its stated body size.
- Emit no relocations and no material outside either function body.
- The two function sizes must sum to 1,740 bytes.
