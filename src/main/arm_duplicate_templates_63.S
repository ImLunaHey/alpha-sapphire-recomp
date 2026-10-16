.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT63_BODY name, insertion_helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, lr}
    mov     r4, r0
    mov     r0, r2
    ldr     r3, [r1, #16]
    sub     sp, sp, #12
    mov     r6, #1
    mov     r7, r3
    ldr     r2, [r3, #4]
    cmp     r2, #0
    ldrne   r12, [r0]
    beq     .Ldt63_search_done\@
.Ldt63_search\@:
    ldr     r5, [r2, #16]
    mov     r3, r2
    cmp     r12, r5
    ldrcc   r2, [r3, #8]
    ldrcs   r2, [r3, #12]
    movcc   r6, #1
    movcs   r6, #0
    cmp     r2, #0
    bne     .Ldt63_search\@
.Ldt63_search_done\@:
    ldrb    r12, [r1, #24]
    mov     r5, #1
    cmp     r12, #0
    bne     .Ldt63_insert\@
    cmp     r6, #0
    mov     r12, r3
    beq     .Ldt63_compare_candidate\@
    ldr     r12, [r7, #8]
    cmp     r3, r12
    beq     .Ldt63_insert\@
    ldrb    r12, [r3]
    cmp     r12, #0
    bne     .Ldt63_predecessor_left\@
    ldr     r12, [r3, #4]
    ldr     r6, [r12, #4]
    cmp     r6, r3
    ldreq   r12, [r3, #12]
    beq     .Ldt63_compare_candidate\@
.Ldt63_predecessor_left\@:
    ldr     r12, [r3, #8]
    cmp     r12, #0
    beq     .Ldt63_predecessor_parent\@
    ldr     r6, [r12, #12]
    cmp     r6, #0
    beq     .Ldt63_compare_candidate\@
.Ldt63_predecessor_rightmost\@:
    mov     r12, r6
    ldr     r6, [r6, #12]
    cmp     r6, #0
    bne     .Ldt63_predecessor_rightmost\@
    b       .Ldt63_compare_candidate\@
.Ldt63_predecessor_parent\@:
    ldr     r12, [r3, #4]
    ldr     r7, [r12, #8]
    cmp     r3, r7
    bne     .Ldt63_compare_candidate\@
.Ldt63_predecessor_ascend\@:
    mov     r6, r12
    ldr     r12, [r12, #4]
    ldr     r7, [r12, #8]
    cmp     r6, r7
    beq     .Ldt63_predecessor_ascend\@
.Ldt63_compare_candidate\@:
    ldr     r7, [r0]
    ldr     r6, [r12, #16]
    cmp     r6, r7
    bcs     .Ldt63_existing\@
.Ldt63_insert\@:
    str     r0, [sp]
    add     r0, sp, #4
    bl      \insertion_helper
    ldr     r0, [sp, #4]
    str     r0, [r4]
    strb    r5, [r4, #4]
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.Ldt63_existing\@:
    mov     r0, #0
    str     r12, [r4]
    strb    r0, [r4, #4]
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.size \name, .-\name
.endm

DT63_BODY func_0016F94C, func_0015E4C4
DT63_BODY func_005587C0, func_00558928
