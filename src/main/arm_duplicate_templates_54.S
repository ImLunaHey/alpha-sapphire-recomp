.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT54_WORKER name, operation
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    mov     r5, r0
    ldrb    r0, [r0, #9]
    cmp     r0, #0
    ldrbne  r0, [r5, #11]
    cmpne   r0, #0
    moveq   r0, #1
    strbeq  r0, [r5, #9]
    movne   r0, #0
    bne     .Ldt54_return\@
    ldr     r1, .Ldt54_interval\@
    mov     r0, #1
    bl      func_00150110
    mov     r11, #0
    str     r11, [r5, #896]
    ldr     r7, [r5, #28]
    mov     r8, r0
    ldm     r7, {r9, r10}
    cmp     r9, r10
    movne   r4, r9
    movne   r6, r10
    beq     .Ldt54_after_walk\@
.Ldt54_walk\@:
    ldr     r1, [r4]
    mov     r0, r4
    ldr     r1, [r1]
    blx     r1
    add     r4, r4, #40
    cmp     r4, r6
    bne     .Ldt54_walk\@
    ldr     r0, .Ldt54_divide_by_40\@
    sub     r2, r10, r9
    ldr     r1, [r7, #4]
    smull   r2, r0, r0, r2
    asr     r2, r0, #4
    sub     r0, r2, r0, asr #31
    rsb     r0, r0, #0
    add     r0, r0, r0, lsl #2
    add     r0, r1, r0, lsl #3
    str     r0, [r7, #4]
.Ldt54_after_walk\@:
    ldr     r0, [r5, #36]
    ldr     r2, [r5, #28]
    mov     r1, r8
    bl      \operation
    cmp     r0, #0
    nop
    beq     .Ldt54_cleanup\@
    mov     r0, #20
    str     r8, [r5, #896]
    bl      func_00184990 - 4
    cmp     r0, #0
    nop
    beq     .Ldt54_success_return\@
    mov     r4, r0
    ldr     r0, .Ldt54_record_seed\@
    ldm     r0, {r1, r2}
    add     r0, r4, #8
    str     r5, [r4, #4]
    stm     r0, {r1, r2}
    mov     r0, r8
    ldr     r1, .Ldt54_record_dispatch\@
    str     r1, [r4]
    mov     r1, #2
    str     r8, [r4, #16]
    bl      func_0014648C
    mov     r3, #1
    mov     r2, #0
    mov     r1, r4
    mov     r0, r8
    bl      func_00146464
.Ldt54_success_return\@:
    mov     r0, #1
.Ldt54_return\@:
    pop     {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
.Ldt54_cleanup\@:
    cmp     r8, #0
    beq     .Ldt54_clear\@
    ldr     r0, [r8]
    ldr     r1, [r0, #4]
    mov     r0, r8
    blx     r1
.Ldt54_clear\@:
    strb    r11, [r5, #9]
    str     r11, [r5, #896]
    bl      func_001505A4
    mov     r4, r0
    nop
    bl      func_00139650
    mov     r1, r4
    nop
    bl      func_00169564
    mov     r0, #0
    pop     {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
.size \name, .-\name
.Ldt54_interval\@:
    .word arm_duplicate_templates_54_worker_interval_identity
.Ldt54_divide_by_40\@:
    .word arm_duplicate_templates_54_divide_by_40_identity
.Ldt54_record_seed\@:
    .word arm_duplicate_templates_54_record_seed_identity
.Ldt54_record_dispatch\@:
    .word arm_duplicate_templates_54_record_dispatch_identity
.endm

DT54_WORKER func_0013BE38, func_00146BD0
DT54_WORKER func_0013C138, func_00146CD8
