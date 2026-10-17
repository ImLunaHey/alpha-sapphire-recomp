.syntax unified
.arch armv6k
.arm
.fpu vfpv2

.section .text.func_00184744, "ax", %progbits
.balign 4
.global func_00184744
.type func_00184744, %function
func_00184744:
    push    {r4-r11, lr}
    mov     r6, #0
    sub     sp, sp, #52
    mov     r8, r0
    mov     r5, r1
    mov     r9, r2
    mov     r10, r6
.Lparse_loop:
    add     r1, pc, #532
    mov     r0, r5
    blx     func_0010048A
    movs    r4, r0
    nop
    bne     .Lhave_end
    mov     r6, #1
    mov     r0, r5
    blx     func_001003E8
    add     r4, r5, r0, lsl #1
    cmp     r5, r4
    beq     .Lsuccess
.Lhave_end:
    cmp     r5, r4
    movne   r7, r5
    strhne  r10, [r4]
    beq     .Lfailure
    ldr     r11, [pc, #472]
    mov     r0, r5
    mov     r1, r11
    blx     func_0010048A
    movs    r5, r0
    cmpne   r7, r5
    beq     .Lempty_component
    add     r0, r5, #2
    str     r0, [sp, #12]
    ldrh    r0, [r5, #2]
    cmp     r0, #0
    beq     .Lempty_component
    ldr     r0, [sp, #12]
    mov     r1, r11
    blx     func_0010048A
    cmp     r0, #0
    nop
    beq     .Lclassify
.Lempty_component:
    mov     r11, r10
    b       .Lfinish_item
.Lclassify:
    cmp     r9, #0
    mov     r11, #1
    strh    r10, [r5]
    beq     .Lprobe_class_a
    mov     r1, r7
    add     r0, sp, #32
    str     r8, [sp, #16]
    bl      func_001862A0
    mov     r7, r0
    ldr     r1, [sp, #12]
    add     r0, sp, #40
    bl      func_001862A0
    str     r0, [sp, #12]
    ldr     r0, [sp, #16]
    bl      func_0018CD7C
    ldr     r0, [sp, #16]
    mov     r1, r7
    add     r0, r0, #68
    bl      func_0018D190
.Lcommon_update:
    ldr     r1, [sp, #12]
    bl      func_0017F4A4
    ldr     r0, [sp, #16]
    strb    r10, [r0, #101]
    add     r0, sp, #40
    bl      func_001862FC
    add     r0, sp, #32
    bl      func_001862FC
.Lwrite_tag:
    mov     r0, #61
    strh    r0, [r5]
.Lfinish_item:
    cmp     r6, #0
    moveq   r0, #59
    strheq  r0, [r4]
    cmp     r11, #0
    beq     .Lfailure
    cmp     r6, #0
    add     r5, r4, #2
    beq     .Lparse_loop
.Lsuccess:
    add     sp, sp, #52
    mov     r0, #1
    pop     {r4-r11, pc}
.Lprobe_class_a:
    ldr     r1, [pc, #236]
    mov     r0, r7
    blx     func_0010046E
    cmp     r0, #0
    nop
    beq     .Lclass_a_fallback
    ldr     r1, [pc, #216]
    mov     r0, r7
    blx     func_0010046E
    cmp     r0, #0
    nop
    beq     .Lclass_b_fallback
    mov     r1, r7
    add     r0, sp, #32
    str     r8, [sp, #16]
    bl      func_001862A0
    str     r0, [sp]
    ldr     r1, [sp, #12]
    add     r0, sp, #40
    bl      func_001862A0
    mov     r7, r0
    ldr     r0, [sp, #16]
    bl      func_0018CD7C
    ldr     r0, [sp, #16]
    ldr     r1, [sp]
    add     r0, r0, #40
    bl      func_0018D190
    mov     r1, r7
    nop
    b       .Lcommon_update
.Lclass_a_fallback:
    ldr     r11, [sp, #12]
    mov     r7, r8
    mov     r0, r7
    bl      func_0018CD7C
    strb    r10, [r7, #101]
    ldr     r0, [r7, #4]
    mov     r1, r11
    bl      func_0018A7B4
    mov     r11, r0
    nop
    b       .Lwrite_tag
.Lclass_b_fallback:
    ldr     r0, [sp, #12]
    mov     r7, r8
    mov     r2, #10
    mov     r1, #0
    blx     func_001003FA
    uxth    r0, r0
    str     r0, [sp, #12]
    mov     r0, r7
    bl      func_0018CD7C
    ldr     r0, [sp, #12]
    ldr     r1, [r7, #4]
    rev16   r0, r0
    strh    r0, [r1, #6]
    strb    r10, [r7, #101]
    b       .Lwrite_tag
.Lfailure:
    add     sp, sp, #52
    mov     r0, #0
    pop     {r4-r11, pc}
.size func_00184744, . - func_00184744
