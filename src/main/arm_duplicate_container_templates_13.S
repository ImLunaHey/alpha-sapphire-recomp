.syntax unified
.arm

.macro RANGE_ERASE_A name, recycler, erase
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, r7, lr}
    sub sp, sp, #12
    mov r7, r0
    ldr r0, [r1, #16]
    mov r5, r1
    mov r4, r2
    str r0, [r7]
    ldr r0, [r1, #16]
    ldr r2, [r2]
    mov r6, r3
    ldr r1, [r0, #8]
    cmp r2, r1
    ldreq r1, [r6]
    cmpeq r1, r0
    bne .Literate_\name
    ldr r1, [r5, #20]
    cmp r1, #0
    beq .Literate_\name
    ldr r4, [r0, #4]
    cmp r4, #0
    beq .Lreset_\name
.Lrecycle_loop_\name:
    ldr r1, [r4, #12]
    mov r0, r5
    bl \recycler
    ldr r0, [r5, #4]
    ldr r2, [r4, #8]
    str r0, [r4, #12]
    str r4, [r5, #4]
    movs r4, r2
    bne .Lrecycle_loop_\name
.Lreset_\name:
    ldr r1, [r5, #16]
    mov r0, #0
    str r1, [r1, #8]
    ldr r1, [r5, #16]
    str r0, [r1, #4]
    ldr r1, [r5, #16]
    str r1, [r1, #12]
    str r0, [r5, #20]
    ldr r0, [r5, #16]
    str r0, [r7]
.Lreturn_\name:
    add sp, sp, #12
    pop {r4, r5, r6, r7, pc}
.Literate_\name:
    ldr r0, [r6]
    ldr r2, [r4]
    cmp r2, r0
    beq .Lreturn_\name
    ldr r1, [r2, #12]
    mov r0, r2
    cmp r1, #0
    movne r0, r1
    strne r1, [r4]
    beq .Lclimb_\name
.Ldescend_\name:
    ldr r0, [r0, #8]
    cmp r0, #0
    strne r0, [r4]
    bne .Ldescend_\name
    b .Lerase_\name
.Lclimb_\name:
    mov r1, r0
    ldr r0, [r2, #4]
    ldr r3, [r0, #12]
    cmp r1, r3
    bne .Lclimb_done_\name
.Lclimb_loop_\name:
    mov r1, r0
    str r0, [r4]
    ldr r0, [r0, #4]
    ldr r3, [r0, #12]
    cmp r1, r3
    beq .Lclimb_loop_\name
.Lclimb_done_\name:
    ldr r1, [r4]
    ldr r1, [r1, #12]
    cmp r1, r0
    strne r0, [r4]
.Lerase_\name:
    str r2, [sp, #4]
    add r2, sp, #4
    mov r1, r5
    mov r0, sp
    bl \erase
    ldr r0, [sp]
    str r0, [r7]
    b .Literate_\name
.size \name, . - \name
.endm

.macro RANGE_ERASE_B name, recycler, erase
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, r7, lr}
    sub sp, sp, #12
    mov r7, r0
    ldr r0, [r1, #16]
    mov r5, r1
    mov r4, r2
    str r0, [r7]
    ldr r0, [r1, #16]
    ldr r2, [r2]
    mov r6, r3
    ldr r1, [r0, #8]
    cmp r2, r1
    ldreq r1, [r6]
    cmpeq r1, r0
    bne .Literate_\name
    ldr r1, [r5, #20]
    cmp r1, #0
    beq .Literate_\name
    ldr r4, [r0, #4]
    cmp r4, #0
    beq .Lreset_\name
.Lrecycle_loop_\name:
    ldr r1, [r4, #12]
    mov r0, r5
    bl \recycler
    ldr r1, [r5, #4]
    ldr r2, [r4, #8]
    str r1, [r4, #12]
    str r4, [r5, #4]
    movs r4, r2
    bne .Lrecycle_loop_\name
.Lreset_\name:
    ldr r1, [r5, #16]
    mov r0, #0
    str r1, [r1, #8]
    ldr r1, [r5, #16]
    str r0, [r1, #4]
    ldr r1, [r5, #16]
    str r1, [r1, #12]
    str r0, [r5, #20]
    ldr r0, [r5, #16]
    str r0, [r7]
.Lreturn_\name:
    add sp, sp, #12
    pop {r4, r5, r6, r7, pc}
.Literate_\name:
    ldr r0, [r6]
    ldr r2, [r4]
    cmp r2, r0
    beq .Lreturn_\name
    ldr r0, [r2, #12]
    mov r1, r2
    cmp r0, #0
    beq .Lclimb_\name
.Ldescend_\name:
    str r0, [r4]
    ldr r0, [r0, #8]
    cmp r0, #0
    bne .Ldescend_\name
    b .Lerase_\name
.Lclimb_\name:
    ldr r0, [r2, #4]
    mov r3, r1
    ldr r1, [r0, #12]
    cmp r3, r1
    bne .Lclimb_done_\name
.Lclimb_loop_\name:
    mov r1, r0
    str r0, [r4]
    ldr r0, [r0, #4]
    ldr r3, [r0, #12]
    cmp r1, r3
    beq .Lclimb_loop_\name
.Lclimb_done_\name:
    ldr r1, [r4]
    ldr r1, [r1, #12]
    cmp r1, r0
    strne r0, [r4]
.Lerase_\name:
    str r2, [sp, #4]
    add r2, sp, #4
    mov r1, r5
    mov r0, sp
    bl \erase
    ldr r0, [sp]
    str r0, [r7]
    b .Literate_\name
.size \name, . - \name
.endm

.macro VECTOR_APPEND_4 name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, r10, lr}
    mov r4, r0
    mov r8, r1
    add r1, r4, #8
    ldr r3, [r0, #4]
    ldm r1, {r1, r2}
    mov r0, #1
    sub r3, r1, r3
    bic r1, r2, #0xc0000000
    cmp r1, r3, asr #2
    bgt .Lappend_\name
    cmp r1, #0
    lslne r6, r1, #1
    moveq r6, #1
    bic r1, r2, #0xc0000000
    cmp r1, r6
    mov r9, #1
    bge .Lappend_\name
    ldr r0, [r4]
    mov r7, #0
    cmp r0, #0
    beq .Lfail_\name
    and r1, r2, #0xc0000000
    cmp r1, #0x40000000
    bne .Lfail_\name
    ldr r1, [r0]
    mov r2, #32
    ldr r3, [r1, #8]
    lsl r1, r6, #2
    blx r3
    movs r5, r0
    beq .Lfail_\name
    add r0, r4, #4
    ldm r0, {r0, r2}
    cmp r0, r2
    movne r1, r5
    beq .Lcopy_done_\name
.Lcopy_\name:
    cmp r1, #0
    ldrne r12, [r0]
    add r0, r0, #4
    strne r12, [r1]
    cmp r0, r2
    add r1, r1, #4
    bne .Lcopy_\name
    ldr r0, [r4, #8]
    ldr r1, [r4, #4]
    sub r0, r0, r1
    asr r7, r0, #2
.Lcopy_done_\name:
    ldr r1, [r4, #4]
    cmp r1, #0
    beq .Linstall_\name
    ldr r0, [r4]
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Linstall_\name:
    add r0, r5, r7, lsl #2
    str r0, [r4, #8]
    str r5, [r4, #4]
    ldr r0, [r4, #12]
    and r0, r0, #0xc0000000
    orr r0, r0, r6
    str r0, [r4, #12]
    mov r0, r9
.Lappend_\name:
    ldr r1, [r4, #8]
    cmp r1, #0
    ldrne r2, [r8]
    strne r2, [r1]
    ldr r1, [r4, #8]
    add r1, r1, #4
    str r1, [r4, #8]
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
.Lfail_\name:
    mov r0, r7
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
.size \name, . - \name
.endm

RANGE_ERASE_A func_00550394, func_005504D4, func_0054FD38
RANGE_ERASE_A func_00550B6C, func_00550CAC, func_00550510
RANGE_ERASE_A func_0055C7F8, func_0055C938, func_0055C19C
RANGE_ERASE_A func_00567560, func_005676A0, func_00566F04
RANGE_ERASE_A func_00569818, func_00569958, func_005691BC

RANGE_ERASE_B func_00552144, func_0055227C, func_00551AE4
RANGE_ERASE_B func_00559304, func_0055943C, func_00558CA4
RANGE_ERASE_B func_0055D3B0, func_0055D4E8, func_0055CD50

VECTOR_APPEND_4 func_00540E44
VECTOR_APPEND_4 func_00540F68
VECTOR_APPEND_4 func_0054116C
