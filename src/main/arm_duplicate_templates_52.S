.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT52_HANDLE name, operation
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, lr}
    sub     sp, sp, #8
    movs    r6, r0
    mov     r5, r1
    ldr     r8, .Ldt52_result_slot\@
    mov     r7, #0
    cmpne   r5, #0
    mov     r9, r2
    add     r4, r8, #16
    str     r7, [sp]
    beq     .Ldt52_return\@
    cmp     r9, #0
    ldrne   r0, [r5]
    cmpne   r0, #0
    beq     .Ldt52_return\@
    ldr     r0, [r6]
    cmp     r0, #0
    strne   r0, [sp]
    bne     .Ldt52_have_handle\@
    mov     r0, sp
    bl      func_001D0F00
    movs    r4, r0
    bne     .Ldt52_cleanup\@
    ldr     r0, [sp]
    cmp     r0, #0
    beq     .Ldt52_no_handle\@
.Ldt52_have_handle\@:
    ldr     r10, [r0, #4]
    str     r7, [sp, #4]
    ldr     r1, [r5]
    add     r3, sp, #4
    mov     r2, r9
    mov     r0, r10
    bl      \operation
    movs    r4, r0
    nop
    bne     .Ldt52_cleanup\@
    mov     r1, #0
    mov     r0, r10
    bl      func_001CF858
    cmp     r0, #0
    movne   r4, r8
    bne     .Ldt52_cleanup\@
    ldr     r0, [r5]
    ldr     r1, [sp, #4]
    add     r0, r0, r1
    str     r0, [r5]
    b       .Ldt52_success\@
.Ldt52_no_handle\@:
    cmp     r4, #0
    beq     .Ldt52_success\@
.Ldt52_cleanup\@:
    ldr     r0, [sp]
    cmp     r0, #0
    beq     .Ldt52_return\@
    bl      func_001D07E0
    str     r7, [sp]
.Ldt52_return\@:
    add     sp, sp, #8
    mov     r0, r4
    pop     {r4, r5, r6, r7, r8, r9, r10, pc}
.Ldt52_success\@:
    ldr     r0, [sp]
    str     r0, [r6]
    b       .Ldt52_return\@
.size \name, .-\name
.Ldt52_result_slot\@:
    .word   duplicate52_shared_result_identity
.endm

DT52_HANDLE func_001D0834, func_001C4EE8
DT52_HANDLE func_001D0928, func_001C4F18
DT52_HANDLE func_001D0A1C, func_001C4F48
