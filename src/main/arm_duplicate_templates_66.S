.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT66_RECORD name, allocator
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, r11, lr}
    mov     r7, r2
    mov     r8, r3
    vpush   {d8-d12}
    sub     sp, sp, #12
    add     r4, sp, #92
    add     r6, sp, #144
    ldmia   r6, {r5, r12, lr}
    mov     r6, r1
    ldr     r9, [sp, #88]
    ldr     r10, [sp, #104]
    ldr     r11, [sp, #120]
    vldr    s25, [sp, #140]
    vldmia  r4, {s16-s18}
    add     r4, sp, #108
    vldmia  r4, {s19-s21}
    add     r4, sp, #124
    vldmia  r4, {s22-s24}
    ldr     r4, [sp, #136]
    stmia   sp, {r12, lr}
    bl      \allocator
    cmp     r0, #0
    beq     .Ldt66_record_return\@
    mov     r2, #4
    stmia   r0, {r2, r6, r7, r8}
    add     r2, r0, #20
    mov     r1, #0
    strh    r9, [r0, #16]
    vstmia  r2, {s16-s18}
    add     r2, r0, #36
    strh    r10, [r0, #32]
    vstmia  r2, {s19-s21}
    add     r2, r0, #52
    strh    r11, [r0, #48]
    vstmia  r2, {s22-s24}
    ldrb    r2, [r4]
    strb    r2, [r0, #64]
    ldrb    r2, [r4, #1]
    strb    r2, [r0, #65]
    ldrb    r2, [r4, #2]
    strb    r2, [r0, #66]
    ldrb    r2, [r4, #3]
    strb    r2, [r0, #67]
    vstr    s25, [r0, #68]
    ldrb    r2, [r5]
    strb    r2, [r0, #72]
    ldrb    r2, [r5, #1]
    strb    r2, [r0, #73]
    ldrb    r2, [r5, #2]
    strb    r2, [r0, #74]
    ldrb    r2, [r5, #3]
    strb    r2, [r0, #75]
    ldr     r2, [sp]
    strh    r2, [r0, #76]
    ldr     r2, [sp, #4]
    strh    r2, [r0, #78]
    str     r1, [r0, #80]
    str     r1, [r0, #84]
.Ldt66_record_return\@:
    add     sp, sp, #12
    vpop    {d8-d12}
    pop     {r4, r5, r6, r7, r8, r9, r10, r11, pc}
.size \name, .-\name
.endm

.macro DT66_APPEND name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, lr}
    mov     r4, r0
    mov     r8, r1
    ldr     r5, [r0, #4]!
    ldr     r7, [r0, #12]
    cmp     r5, #0
    ldrne   r0, [r5]
    strne   r0, [r4, #4]
    bne     .Ldt66_have_slot\@
    ldrd    r0, r1, [r4, #8]
    cmp     r0, r1
    bne     .Ldt66_use_tail\@
    ldr     r0, [r4]
    cmp     r0, #0
    moveq   r5, #32
    beq     .Ldt66_have_capacity\@
    ldr     r0, [r0, #4]
    add     r1, r0, r0, lsr #1
    add     r5, r1, r0, lsr #3
    add     r0, r0, #32
    cmp     r0, r5
    movhi   r5, r0
.Ldt66_have_capacity\@:
    mov     r0, #12
    bl      func_00184990
    mov     r6, r0
    rsb     r0, r5, r5, lsl #3
    lsl     r0, r0, #3
    bl      func_00184990
    str     r0, [r6, #8]
    ldr     r0, [r4]
    rsb     r1, r5, r5, lsl #3
    stmia   r6, {r0, r5}
    str     r6, [r4]
    ldr     r0, [r6, #8]
    add     r1, r0, r1, lsl #3
    strd    r0, r1, [r4, #8]
.Ldt66_use_tail\@:
    ldr     r5, [r4, #8]
    add     r0, r5, #56
    str     r0, [r4, #8]
.Ldt66_have_slot\@:
    adds    r0, r5, #8
    beq     .Ldt66_link\@
    mov     r1, r8
    bl      func_0020675C
    add     r8, r8, #32
    add     r0, r0, #32
    ldmia   r8, {r1, r2, r3, r12}
    stmia   r0, {r1, r2, r3, r12}
.Ldt66_link\@:
    str     r7, [r5]
    ldr     r0, [r7, #4]
    str     r0, [r5, #4]
    ldr     r0, [r7, #4]
    str     r5, [r0]
    str     r5, [r7, #4]
    ldr     r0, [r4, #20]
    add     r0, r0, #1
    str     r0, [r4, #20]
    pop     {r4, r5, r6, r7, r8, pc}
.size \name, .-\name
.endm

DT66_RECORD func_0049B080, func_0049A0F8
DT66_RECORD func_004A1E14, func_004A0CDC
DT66_APPEND func_0056E77C
DT66_APPEND func_0056E944
