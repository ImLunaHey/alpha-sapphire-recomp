.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0018538C, "ax", %progbits
.balign 4
.global func_0018538C
.type func_0018538C, %function
func_0018538C:
    push    {r4-r6, lr}
    mov     r4, r0
    ldr     r0, [r4]
    ldr     r1, [r0, #24]
    mov     r0, r4
    blx     r1
    ldrh    r5, [r4, #20]
    cmp     r5, #4
    beq     .Lreturn
    bgt     .Lhigh_state
    cmp     r5, #1
    beq     .Ltry_two
    cmp     r5, #2
    bne     .Lreturn
    ldr     r0, [r4]
    ldr     r1, [r0, #36]
    mov     r0, r4
    blx     r1
    cmp     r0, #0
    movne   r5, #4
    beq     .Lload_state
    ldr     r0, [r4]
    mov     r1, r5
    ldr     r2, [r0, #48]
    mov     r0, r4
    blx     r2
    cmp     r0, #0
    beq     .Lload_state
    b       .Lcommit_state
.Lhigh_state:
    cmp     r5, #8
    beq     .Lreturn
    cmp     r5, #64
    bne     .Lreturn
.Ltry_two:
    ldr     r0, [r4]
    mov     r5, #2
    ldr     r2, [r0, #48]
    mov     r1, r5
    mov     r0, r4
    blx     r2
    cmp     r0, #0
    beq     .Ltry_four
    ldr     r0, [r4]
    mov     r1, r5
    ldr     r2, [r0, #20]
    mov     r0, r4
    blx     r2
    strh    r5, [r4, #20]
.Ltry_four:
    ldr     r0, [r4]
    ldr     r1, [r0, #32]
    mov     r0, r4
    blx     r1
    cmp     r0, #0
    movne   r5, #4
    beq     .Lload_state
    ldr     r0, [r4]
    mov     r1, r5
    ldr     r2, [r0, #48]
    mov     r0, r4
    blx     r2
    cmp     r0, #0
    beq     .Lload_state
.Lcommit_state:
    ldr     r0, [r4]
    mov     r1, r5
    ldr     r2, [r0, #20]
    mov     r0, r4
    blx     r2
    strh    r5, [r4, #20]
.Lload_state:
    ldrh    r0, [r4, #20]
.Lreturn:
    pop     {r4-r6, pc}
.size func_0018538C, . - func_0018538C

.section .note.GNU-stack, "", %progbits
