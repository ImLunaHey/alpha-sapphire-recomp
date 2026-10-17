.syntax unified
.arm
.fpu vfpv2

.section .text.func_00183E28, "ax", %progbits
.balign 4
.global func_00183E28
.type func_00183E28, %function
func_00183E28:
    push    {r4-r7, lr}
    sub     sp, sp, #28
    add     r6, sp, #16
    ldrh    r2, [r1]
    mov     r1, #0
    str     r1, [sp, #20]
    strh    r2, [sp, #16]

    ldr     r3, [r0, #16]
    mov     r1, r0
    add     r4, sp, #8
    mov     r7, r3
    ldr     r2, [r3, #4]
    mov     r0, #1
    cmp     r2, #0
    ldrhne  r12, [sp, #16]
    beq     .Lsearch_done

.Lsearch:
    ldrh    r0, [r2, #16]
    mov     r3, r2
    cmp     r12, r0
    ldrlo   r2, [r2, #8]
    ldrhs   r2, [r2, #12]
    movlo   r0, #1
    movhs   r0, #0
    cmp     r2, #0
    bne     .Lsearch

.Lsearch_done:
    ldrb    r12, [r1, #24]
    mov     r5, #1
    cmp     r12, #0
    bne     .Lmake_result
    cmp     r0, #0
    mov     r12, r3
    beq     .Lcheck_candidate

    ldr     r0, [r7, #8]
    cmp     r3, r0
    beq     .Lmake_result
    ldrb    r0, [r3]
    cmp     r0, #0
    bne     .Lwalk_right

    ldr     r0, [r3, #4]
    ldr     r12, [r0, #4]
    cmp     r12, r3
    ldreq   r12, [r3, #12]
    beq     .Lcheck_candidate

.Lwalk_right:
    ldr     r12, [r3, #8]
    mov     r0, r3
    cmp     r12, #0
    beq     .Lwalk_parents

    ldr     r0, [r12, #12]
    cmp     r0, #0
    beq     .Lcheck_candidate
.Lwalk_descendants:
    mov     r12, r0
    ldr     r0, [r0, #12]
    cmp     r0, #0
    bne     .Lwalk_descendants
    b       .Lcheck_candidate

.Lwalk_parents:
    ldr     r12, [r0, #4]
    ldr     r7, [r12, #8]
    cmp     r3, r7
    bne     .Lcheck_candidate
.Lwalk_up:
    mov     r0, r12
    ldr     r12, [r12, #4]
    ldr     r7, [r12, #8]
    cmp     r0, r7
    beq     .Lwalk_up

.Lcheck_candidate:
    ldrh    r7, [sp, #16]
    ldrh    r0, [r12, #16]
    cmp     r0, r7
    bhs     .Luse_candidate

.Lmake_result:
    add     r0, sp, #4
    str     r6, [sp]
    bl      func_0018A0BC
    ldr     r0, [sp, #4]
    str     r0, [sp, #8]
    strb    r5, [sp, #12]
    b       .Lreturn_payload

.Luse_candidate:
    mov     r0, #0
    str     r12, [sp, #8]
    strb    r0, [sp, #12]

.Lreturn_payload:
    ldr     r0, [sp, #8]
    add     sp, sp, #28
    add     r0, r0, #20
    pop     {r4-r7, pc}
.size func_00183E28, .-func_00183E28
