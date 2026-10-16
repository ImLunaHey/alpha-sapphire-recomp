.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT59_BODY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r6, r0
    sub     sp, sp, #200
    mov     r4, r1
    mov     r0, r1
    bl      func_004E5E08
    mov     r5, r0
    mov     r0, r4
    bl      func_004E5DDC
    mov     r4, r0
    bl      func_00410B30
    ldr     r0, [r4, #12]
    orr     r0, r0, #1
    str     r0, [r4, #12]
    mov     r0, r5
    bl      func_004E688C
    str     r0, [sp, #8]
    add     r1, sp, #8
    mov     r0, r4
    bl      func_00410B4C
    ldrd    r0, [r5, #20]
    strd    r0, [r4]
    bl      func_00410484
    mov     r4, #0
    mov     r1, r0
    mov     r3, r5
    mov     r2, r6
    add     r0, sp, #16
    str     r4, [sp]
    bl      func_00410EAC
    add     r0, sp, #16
    bl      func_00410E50
    cmp     r0, #0
    bne     .Ldt59_done\@
    add     r0, sp, #16
    str     r4, [sp, #160]
    str     r4, [sp, #12]
    ldr     r0, [r0, #24]
    mov     r4, r0
    add     r0, sp, #16
    ldr     r0, [r0, #20]
    mov     r2, r0
    mov     r3, r4
    add     r1, sp, #12
    add     r0, sp, #160
    bl      func_00413574
    cmp     r0, #0
    beq     .Ldt59_release_optional\@
    mov     r3, #1
    mov     r2, r3
    mov     r1, r5
    add     r0, sp, #80
    bl      func_00417514 + 28
    bl      func_00410484
    ldr     r3, [sp, #160]
    ldr     r12, [sp, #12]
    mov     r2, #1
    mov     r1, r0
    stm     sp, {r2, r3, r12}
    add     r3, sp, #80
    mov     r2, r6
    add     r0, sp, #164
    bl      func_0040F228
    add     r0, sp, #164
    bl      func_0040F1A4
    add     r0, sp, #164
    mov     r0, r0
.Ldt59_release_optional\@:
    ldr     r0, [sp, #160]
    cmp     r0, #0
    beq     .Ldt59_done\@
    bl      func_0040AC94
    ldr     r0, [r0]
    ldr     r1, [sp, #160]
    ldr     r2, [r0]
    ldr     r2, [r2, #4]
    blx     r2
.Ldt59_done\@:
    add     r0, sp, #16
    bl      func_0040F458
    add     sp, sp, #200
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.endm

DT59_BODY func_0040EA28
DT59_BODY func_0040EB68
