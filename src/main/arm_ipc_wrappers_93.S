.syntax unified
.arm
.fpu vfpv2

.global func_001878A8
.global func_001870E4
.global func_00187DCC
.global func_00187FDC
.global func_00187F9C
.global func_00170340
.global service_object_finalize_secondary_93
.set service_object_finalize_secondary_93, func_00170340 + 324

.section .text.func_001814C4, "ax", %progbits
.align 2
.global func_001814C4
.type func_001814C4, %function
func_001814C4:
    @ BEGIN func_001814C4
    push    {r4-r11, lr}
    mov     r5, r0
    mov     r10, r3
    mov     r11, r2
    vpush   {d8}
    sub     sp, sp, #12
    ldrb    r0, [r0, #80]
    vldr    s16, [sp, #56]
    vldr    s17, [sp, #68]
    cmp     r0, #0
    beq     .L1814C4_300
    cmp     r1, #0
    beq     .L1814C4_272
    cmp     r10, #0
    beq     .L1814C4_224
    ldr     r0, [r5, #252]
    mov     r4, #0
    cmp     r0, #0
    ble     .L1814C4_224
    add     r0, r11, r11, lsl #1
    str     r0, [sp, #4]
    ldr     r0, [sp, #60]
    sub     r0, r10, r0
    str     r0, [sp]
.L1814C4_96:
    add     r0, r4, r4, lsl #2
    add     r0, r0, r4, lsl #3
    ldr     r1, [r5, #160]
    add     r7, r5, r0, lsl #6
    ldr     r2, [sp, #60]
    ldr     r0, [r7, #260]
    mov     r9, r10
    mla     r8, r1, r11, r0
    cmp     r2, #0
    beq     .L1814C4_156
    ldrb    r1, [r5, #128]
    mov     r0, r2
    bl      func_001878A8
    ldr     r9, [sp]
    add     r8, r8, r0
.L1814C4_156:
    ldr     r0, [sp, #4]
    add     r6, r7, r0, lsl #3
    add     r6, r6, #312
    mov     r0, r6
    bl      func_001870E4
    strd    r8, r9, [r6]
    ldr     r0, [sp, #64]
    mov     r1, r6
    ldr     r0, [r0, r4, lsl #2]
    str     r0, [r6, #8]
    ldr     r2, [sp, #72]
    add     r0, r7, #260
    bl      func_00187DCC
    ldr     r0, [r5, #252]
    add     r4, r4, #1
    cmp     r0, r4
    bgt     .L1814C4_96
.L1814C4_224:
    add     r0, r5, r11, lsl #3
    add     r0, r0, #6144
    add     r0, r0, #916
    ldr     r1, [sp, #72]
    cmp     r1, #0
    vstmia  r0, {s16-s17}
    movne   r0, #1
    strbne  r0, [r5, #85]
    ldrb    r0, [r5, #81]
    cmp     r0, #0
    beq     .L1814C4_312
    b       .L1814C4_348
.L1814C4_272:
    mov     r0, #1
    strb    r0, [r5, #15]
    ldr     r0, [r5]
    ldr     r1, [r0, #20]
    mov     r0, r5
    blx     r1
    mov     r0, #0
.L1814C4_300:
    add     sp, sp, #12
    vpop    {d8}
    pop     {r4-r11, pc}
.L1814C4_312:
    ldr     r0, [r5, #92]
    subs    r0, r0, #1
    str     r0, [r5, #92]
    beq     .L1814C4_340
    ldrb    r0, [r5, #85]
    cmp     r0, #0
    beq     .L1814C4_348
.L1814C4_340:
    mov     r0, #1
    strb    r0, [r5, #81]
.L1814C4_348:
    add     sp, sp, #12
    mov     r0, #1
    vpop    {d8}
    pop     {r4-r11, pc}
    @ END func_001814C4
.size func_001814C4, .-func_001814C4

.section .text.func_001816F8, "ax", %progbits
.align 2
.global func_001816F8
.type func_001816F8, %function
func_001816F8:
    @ BEGIN func_001816F8
    push    {r4-r10, lr}
    add     r6, sp, #36
    mov     r4, r0
    add     r7, sp, #52
    ldmia   r6, {r0, r12}
    cmp     r2, #8
    ldmia   r7, {r6, r8}
    mov     r7, #8
    ldr     r5, [sp, #32]
    ldr     r9, [sp, #48]
    vldr    s1, [sp, #44]
    movhi   r2, r7
    str     r2, [r4, #252]
    strb    r0, [r4, #232]
    strb    r12, [r4, #233]
    vstr    s1, [r4, #236]
    str     r9, [r4, #240]
    vstr    s0, [r4, #244]
    strb    r6, [r4, #248]
    ldrb    r6, [r8]
    cmp     r3, #0
    strb    r6, [r4, #249]
    ldrb    r6, [r8, #1]
    mov     r8, #1
    strb    r6, [r4, #250]
    mov     r0, #0
    beq     .L1816F8_156
.L1816F8_108:
    tst     r3, #1
    beq     .L1816F8_144
    cmp     r0, #4
    bge     .L1816F8_156
    add     r2, r0, r0, lsl #3
    add     r2, r4, r2, lsl #2
    add     r2, r2, #6144
    add     r2, r2, #772
    strb    r8, [r2]
.L1816F8_144:
    lsrs    r3, r3, #1
    add     r0, r0, #1
    bne     .L1816F8_108
.L1816F8_156:
    cmp     r0, #4
    mov     r2, #4
    movhi   r0, r2
    cmp     r0, #0
    str     r0, [r4, #256]
    moveq   r0, #2
    beq     .L1816F8_328
    str     r1, [r4, #100]
    ldr     r0, [r4, #252]
    mov     r6, #0
    cmp     r0, #0
    ble     .L1816F8_256
.L1816F8_204:
    ldr     r0, [r4, #100]
    bl      func_00187FDC
    cmp     r0, #0
    nop
    beq     .L1816F8_332
    add     r1, r6, r6, lsl #2
    add     r2, r1, r6, lsl #3
    add     r6, r6, #1
    add     r1, r4, r2, lsl #6
    str     r0, [r1, #260]
    ldr     r0, [r4, #252]
    cmp     r0, r6
    bgt     .L1816F8_204
.L1816F8_256:
    mov     r0, #0
.L1816F8_260:
    add     r1, r0, r0, lsl #2
    add     r1, r1, r0, lsl #3
    add     r2, r5, r1
    add     r1, r4, r1
    ldr     r3, [r2]
    add     r0, r0, #1
    cmp     r0, #4
    str     r3, [r1, #180]!
    ldr     r3, [r2, #4]
    str     r3, [r1, #4]
    ldr     r3, [r2, #8]
    str     r3, [r1, #8]
    ldrb    r2, [r2, #12]
    strb    r2, [r1, #12]
    blo     .L1816F8_260
    mov     r0, #0
    strb    r8, [r4, #80]
.L1816F8_328:
    pop     {r4-r10, pc}
.L1816F8_332:
    mov     r9, #0
    cmp     r6, #0
    mov     r5, r9
    ble     .L1816F8_388
.L1816F8_348:
    add     r0, r5, r5, lsl #2
    add     r0, r0, r5, lsl #3
    add     r7, r4, r0, lsl #6
    ldr     r0, [r4, #100]
    ldr     r1, [r7, #260]
    bl      func_00187F9C
    add     r5, r5, #1
    cmp     r6, r5
    str     r9, [r7, #260]
    bgt     .L1816F8_348
.L1816F8_388:
    mov     r0, r4
    bl      service_object_finalize_secondary_93
    mov     r0, #1
    strb    r0, [r4, #16]
    pop     {r4-r10, pc}
    @ END func_001816F8
.size func_001816F8, .-func_001816F8

.section .note.GNU-stack, "", %progbits
