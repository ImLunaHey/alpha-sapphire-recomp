# Probe-verified ARM runtime/helper batch 56

## Scope and provenance

This clean-room specification covers four currently unmatched ARM-state, call-free fixed-width arithmetic helpers totaling 16,800 executable bytes. Evidence was limited to the current unmatched report, neutral symbol inventory, bounded private-target control/data-flow inspection, and independently assembled exact-schedule probes. The selection excludes all earlier configured functions plus duplicate batch 56 and IPC batch 52 reservations.

The routines are two multiply/square pairs for eleven- and sixteen-limb unsigned integers. None contains a direct or indirect call, branch, literal pool, adjacent word, relocation, or symbolic identity. Independent ARMv6K assembly comparison against target revision `AS_EUR_REV2` on 2026-10-16 matched all four complete bodies and all 16,800 body bytes. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Labels and directives occupy no executable bytes. Preserve every displayed mnemonic, operand, register, condition, addressing mode, and instruction order.

## Eleven-limb multiplication

`func_0019E2E4` is 3,092 bytes. Treat `r1` and `r2` as eleven little-endian 32-bit limbs each. Compute their complete 22-limb unsigned product and write it to `r0`.

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
ldr	r7, [r1, #24]
ldr	r6, [r2]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #20]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #4]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #8]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #16]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #20]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #24]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
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
ldr	r9, [r1, #4]
ldr	r8, [r2, #24]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #28]
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #8]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #16]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #20]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #24]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #28]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #32]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #32]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #4]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #8]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #16]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #20]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #28]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #32]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #36]	@ 0x24
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #36]	@ 0x24
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #8]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #12]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #16]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #20]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #24]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #28]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #32]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #36]	@ 0x24
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #40]	@ 0x28
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #40]	@ 0x28
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #12]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #24]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #28]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #32]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #36]	@ 0x24
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #40]	@ 0x28
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #8]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #44]	@ 0x2c
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #20]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #24]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #28]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #32]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #36]	@ 0x24
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #40]	@ 0x28
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #48]	@ 0x30
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #20]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #24]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #32]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #36]	@ 0x24
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #40]	@ 0x28
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #16]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #52]	@ 0x34
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #24]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #28]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #32]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #36]	@ 0x24
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #40]	@ 0x28
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #56]	@ 0x38
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #28]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #32]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #36]	@ 0x24
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #40]	@ 0x28
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #24]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #60]	@ 0x3c
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #32]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #36]	@ 0x24
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #40]	@ 0x28
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #64]	@ 0x40
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #32]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #36]	@ 0x24
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #40]	@ 0x28
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #32]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #68]	@ 0x44
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #36]	@ 0x24
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #40]	@ 0x28
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #36]	@ 0x24
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #72]	@ 0x48
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #40]	@ 0x28
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #40]	@ 0x28
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #76]	@ 0x4c
mov	fp, #0
umull	r5, r4, r9, r8
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #80]	@ 0x50
str	ip, [r0, #84]	@ 0x54
pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

## Eleven-limb squaring

`func_0019EEF8` is 2,388 bytes. Treat `r1` as eleven little-endian 32-bit limbs. Compute its complete 22-limb unsigned square, doubling each off-diagonal product in the displayed carry schedule, and write it to `r0`. `r2` is unused.

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
ldr	r9, [r1, #24]
ldr	r8, [r1]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #20]
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r1, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r1, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #28]
ldr	r8, [r1]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #24]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r1, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r1, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r1, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #28]
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r1, #8]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r1, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r9
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #32]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #4]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #8]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r1, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r1, #16]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #36]	@ 0x24
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r1, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #40]	@ 0x28
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #12]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r1, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r1, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #44]	@ 0x2c
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r1, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r1, #16]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r1, #20]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #48]	@ 0x30
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #16]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #20]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #24]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #52]	@ 0x34
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #20]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #24]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #56]	@ 0x38
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #28]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r1, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #60]	@ 0x3c
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r1, #28]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #28]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #64]	@ 0x40
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #32]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #32]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #68]	@ 0x44
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #36]	@ 0x24
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #72]	@ 0x48
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #76]	@ 0x4c
mov	fp, #0
umull	r4, r5, r7, r7
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #80]	@ 0x50
str	ip, [r0, #84]	@ 0x54
pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

## Sixteen-limb multiplication

`func_0019F84C` is 6,412 bytes. Treat `r1` and `r2` as sixteen little-endian 32-bit limbs each. Compute their complete 32-limb unsigned product and write it to `r0`.

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
ldr	r7, [r1, #24]
ldr	r6, [r2]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #20]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #4]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #8]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #16]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #20]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #24]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
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
ldr	r9, [r1, #4]
ldr	r8, [r2, #24]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #28]
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #8]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #16]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #20]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #24]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #28]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #32]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #32]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #4]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #8]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #16]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #20]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #28]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #32]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #36]	@ 0x24
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #36]	@ 0x24
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #8]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #12]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #16]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #20]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #24]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #28]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #32]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #36]	@ 0x24
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #40]	@ 0x28
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r2]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #40]	@ 0x28
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #8]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #16]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #20]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #24]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #28]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #32]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #36]	@ 0x24
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #40]	@ 0x28
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #44]	@ 0x2c
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r2]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #44]	@ 0x2c
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r2, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #20]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #24]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #28]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #32]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #36]	@ 0x24
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #40]	@ 0x28
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #44]	@ 0x2c
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #48]	@ 0x30
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r2]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #48]	@ 0x30
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r2, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r2, #8]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #12]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #16]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #20]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #24]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #28]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #32]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #36]	@ 0x24
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #40]	@ 0x28
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #44]	@ 0x2c
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #48]	@ 0x30
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #52]	@ 0x34
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r2]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #52]	@ 0x34
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r2, #4]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r2, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r2, #12]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #24]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #28]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #32]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #36]	@ 0x24
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #40]	@ 0x28
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #44]	@ 0x2c
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #48]	@ 0x30
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #52]	@ 0x34
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #56]	@ 0x38
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r2]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #56]	@ 0x38
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r2, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r2, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r2, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r2, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #20]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #24]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #28]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #32]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #36]	@ 0x24
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #40]	@ 0x28
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #44]	@ 0x2c
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #48]	@ 0x30
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #52]	@ 0x34
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #56]	@ 0x38
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #60]	@ 0x3c
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r2, #4]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #60]	@ 0x3c
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r2, #8]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r2, #12]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r2, #16]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r2, #20]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #24]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #28]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #32]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #36]	@ 0x24
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #40]	@ 0x28
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #44]	@ 0x2c
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #48]	@ 0x30
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #52]	@ 0x34
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #56]	@ 0x38
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #60]	@ 0x3c
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r2, #8]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #64]	@ 0x40
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r2, #12]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r2, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r2, #24]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #28]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #32]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #36]	@ 0x24
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #40]	@ 0x28
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #44]	@ 0x2c
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #48]	@ 0x30
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #52]	@ 0x34
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #56]	@ 0x38
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #60]	@ 0x3c
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r2, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #68]	@ 0x44
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r2, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r2, #20]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r2, #24]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r2, #28]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #32]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #36]	@ 0x24
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #40]	@ 0x28
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #44]	@ 0x2c
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #48]	@ 0x30
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #52]	@ 0x34
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #56]	@ 0x38
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #60]	@ 0x3c
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r2, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #72]	@ 0x48
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r2, #20]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r2, #24]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r2, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r2, #32]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #36]	@ 0x24
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #40]	@ 0x28
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #44]	@ 0x2c
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #48]	@ 0x30
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #52]	@ 0x34
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #56]	@ 0x38
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #60]	@ 0x3c
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r2, #20]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #76]	@ 0x4c
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r2, #24]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r2, #28]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r2, #32]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r2, #36]	@ 0x24
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #40]	@ 0x28
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #44]	@ 0x2c
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #48]	@ 0x30
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #52]	@ 0x34
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #56]	@ 0x38
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #60]	@ 0x3c
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r2, #24]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #80]	@ 0x50
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r2, #28]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r2, #32]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r2, #36]	@ 0x24
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r2, #40]	@ 0x28
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #44]	@ 0x2c
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #48]	@ 0x30
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #52]	@ 0x34
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #56]	@ 0x38
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #60]	@ 0x3c
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r2, #28]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #84]	@ 0x54
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r2, #32]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r2, #36]	@ 0x24
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r2, #40]	@ 0x28
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r2, #44]	@ 0x2c
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #48]	@ 0x30
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r2, #52]	@ 0x34
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r2, #56]	@ 0x38
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #60]	@ 0x3c
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r2, #32]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #88]	@ 0x58
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r2, #36]	@ 0x24
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r2, #40]	@ 0x28
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r2, #44]	@ 0x2c
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r2, #48]	@ 0x30
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #52]	@ 0x34
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #56]	@ 0x38
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r2, #60]	@ 0x3c
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r2, #36]	@ 0x24
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #92]	@ 0x5c
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r2, #40]	@ 0x28
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r2, #44]	@ 0x2c
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r2, #48]	@ 0x30
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r2, #52]	@ 0x34
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r2, #56]	@ 0x38
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r2, #60]	@ 0x3c
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r2, #40]	@ 0x28
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #96]	@ 0x60
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r2, #44]	@ 0x2c
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r2, #48]	@ 0x30
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r2, #52]	@ 0x34
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r2, #56]	@ 0x38
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r2, #60]	@ 0x3c
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r2, #44]	@ 0x2c
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #100]	@ 0x64
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r2, #48]	@ 0x30
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r2, #52]	@ 0x34
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r2, #56]	@ 0x38
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r2, #60]	@ 0x3c
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r2, #48]	@ 0x30
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #104]	@ 0x68
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r2, #52]	@ 0x34
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r2, #56]	@ 0x38
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r2, #60]	@ 0x3c
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r2, #52]	@ 0x34
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #108]	@ 0x6c
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r2, #56]	@ 0x38
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r2, #60]	@ 0x3c
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r2, #56]	@ 0x38
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #112]	@ 0x70
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r2, #60]	@ 0x3c
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r2, #60]	@ 0x3c
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #116]	@ 0x74
mov	sl, #0
umull	r4, r5, r7, r6
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #120]	@ 0x78
str	fp, [r0, #124]	@ 0x7c
pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

## Sixteen-limb squaring

`func_001A1158` is 4,908 bytes. Treat `r1` as sixteen little-endian 32-bit limbs. Compute its complete 32-limb unsigned square, doubling each off-diagonal product in the displayed carry schedule, and write it to `r0`. `r2` is unused.

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
ldr	r9, [r1, #24]
ldr	r8, [r1]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #20]
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r1, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r1, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #28]
ldr	r8, [r1]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #24]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r1, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r1, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r1, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #28]
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r1, #8]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r1, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r9
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #32]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #4]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #8]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r1, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r1, #16]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #36]	@ 0x24
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r1, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r1]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #40]	@ 0x28
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r1, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r1, #8]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r1, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r1, #16]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r1, #20]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r1]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #44]	@ 0x2c
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r1, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #20]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r9
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r1]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #48]	@ 0x30
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r1, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r1, #8]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #12]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #16]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #20]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #24]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r1]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #52]	@ 0x34
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r1, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r1, #8]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r1, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #16]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
ldr	r6, [r1, #20]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #32]
ldr	r8, [r1, #24]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #56]	@ 0x38
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r1, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r1, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r1, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r1, #20]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r1, #24]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
ldr	r6, [r1, #28]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #4]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #60]	@ 0x3c
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #8]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r1, #12]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r1, #16]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r1, #20]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r1, #24]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r1, #28]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #32]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #64]	@ 0x40
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r1, #16]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r1, #20]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r1, #24]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r1, #28]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #36]	@ 0x24
ldr	r8, [r1, #32]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r1, #12]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #68]	@ 0x44
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r1, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r1, #20]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r1, #24]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
ldr	r6, [r1, #28]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #40]	@ 0x28
ldr	r8, [r1, #32]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #36]	@ 0x24
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #72]	@ 0x48
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #20]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r1, #24]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r1, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r1, #32]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
ldr	r6, [r1, #36]	@ 0x24
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #20]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #76]	@ 0x4c
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #24]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r1, #28]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r1, #32]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r1, #36]	@ 0x24
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #40]	@ 0x28
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #24]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #80]	@ 0x50
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #28]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r1, #32]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r1, #36]	@ 0x24
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #44]	@ 0x2c
ldr	r8, [r1, #40]	@ 0x28
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r1, #28]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #84]	@ 0x54
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r1, #32]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
ldr	r6, [r1, #36]	@ 0x24
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #48]	@ 0x30
ldr	r8, [r1, #40]	@ 0x28
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #44]	@ 0x2c
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #32]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #88]	@ 0x58
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #36]	@ 0x24
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r1, #40]	@ 0x28
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
ldr	r6, [r1, #44]	@ 0x2c
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #36]	@ 0x24
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #92]	@ 0x5c
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #40]	@ 0x28
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r1, #44]	@ 0x2c
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #48]	@ 0x30
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #40]	@ 0x28
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #96]	@ 0x60
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #44]	@ 0x2c
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #52]	@ 0x34
ldr	r8, [r1, #48]	@ 0x30
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
ldr	r6, [r1, #44]	@ 0x2c
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #100]	@ 0x64
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #56]	@ 0x38
ldr	r8, [r1, #48]	@ 0x30
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #52]	@ 0x34
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #48]	@ 0x30
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #104]	@ 0x68
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
ldr	r6, [r1, #52]	@ 0x34
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #52]	@ 0x34
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #108]	@ 0x6c
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #56]	@ 0x38
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #60]	@ 0x3c
ldr	r8, [r1, #56]	@ 0x38
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #112]	@ 0x70
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #60]	@ 0x3c
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #116]	@ 0x74
mov	sl, #0
umull	r4, r5, r7, r7
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #120]	@ 0x78
str	fp, [r0, #124]	@ 0x7c
pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```
