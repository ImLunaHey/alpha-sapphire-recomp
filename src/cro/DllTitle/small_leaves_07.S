.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_000123E0, "ax", %progbits
.balign 4
.global func_000123E0
.type func_000123E0, %function
ASM_FUNC(func_000123E0)
func_000123E0:
    push {r3, r4, r5, r6, r7, r8, r9, lr}
    mov r6, r0
    ldr r0, [r0, #432]
    ldr r1, [r6, #436]
    subs r0, r0, r1
    beq .L123e0_entries
    mov r0, r6
    bl . + 0x66C
    mov r0, r6
    bl . + 0x2948
.L123e0_entries:
    mov r7, #0
    mov r8, r7
.L123e0_outer:
    add r5, r6, r7, lsl #2
    ldr r0, [r5, #1140]
    cmp r0, #0
    blt .L123e0_next
    add r0, r6, r0, lsl #2
    ldr r0, [r0, #756]
    ldr r1, [r0]
    ldr r2, [r1, #16]
    mov r1, sp
    blx r2
    ldr r0, [sp]
    mov r4, #0
    cmp r0, #0
    ble .L123e0_clear
.L123e0_release:
    ldr r0, [r5, #1140]
    add r0, r6, r0, lsl #2
    ldr r0, [r0, #756]
    ldr r1, [r0]
    ldr r1, [r1, #28]
    blx r1
    ldr r0, [sp]
    add r4, r4, #1
    cmp r0, r4
    bgt .L123e0_release
.L123e0_clear:
    str r8, [r5, #1148]
    str r8, [r5, #1156]
.L123e0_next:
    add r7, r7, #1
    cmp r7, #2
    blt .L123e0_outer
    pop {r3, r4, r5, r6, r7, r8, r9, pc}
.size func_000123E0, . - func_000123E0

.section .text.func_000155A4, "ax", %progbits
.balign 4
.global func_000155A4
.type func_000155A4, %function
ASM_FUNC(func_000155A4)
func_000155A4:
    mov r1, #0
    str r1, [r0]
    add r3, r0, #4
    mvn r2, #0
    stm r3, {r1, r2}
    str r1, [r0, #20]
    str r1, [r0, #24]
    str r1, [r0, #32]
    str r1, [r0, #36]
    mov r3, #1
    str r1, [r0, #40]
    strb r3, [r0, #44]
    mov r12, #2
    str r1, [r0, #344]
    strb r12, [r0, #348]
    strb r1, [r0, #349]
    strb r3, [r0, #350]
    str r1, [r0, #448]
    str r1, [r0, #452]
    str r1, [r0, #456]
    str r1, [r0, #752]
    mov r2, #0
    str r1, [r0, #1164]
.L155a4_loop:
    add r3, r2, r2, lsl #1
    add r12, r0, r2, lsl #2
    add r3, r0, r3, lsl #3
    str r1, [r12, #756]
    str r1, [r3, #480]
    add r2, r2, #2
    str r1, [r12, #760]
    cmp r2, #8
    str r1, [r3, #504]
    blt .L155a4_loop
    str r1, [r0, #1168]
    str r1, [r0, #1172]
    str r1, [r0, #1176]
    str r1, [r0, #1180]
    str r1, [r0, #1184]
    str r1, [r0, #1188]
    str r1, [r0, #1192]
    str r1, [r0, #1196]
    bx lr
.size func_000155A4, . - func_000155A4

.section .text.func_0000ED48, "ax", %progbits
.balign 4
.global func_0000ED48
.type func_0000ED48, %function
ASM_FUNC(func_0000ED48)
func_0000ED48:
    push {r4, r5, r6, r7, lr}
    add r5, r0, #5120
    add r5, r5, #120
    mov r4, r0
    ldr r0, [r5]
    sub sp, sp, #12
    cmp r0, #0
    beq .Led48_return
    ldr r1, [r0]
    ldr r1, [r1, #16]
    blx r1
    add r1, r4, #5120
    mov r6, #0
    add r1, r1, #28
    str r6, [r5]
    ldr r0, [r1, #20]
    add r3, sp, #4
    mov r2, sp
    vldr s0, [r0, #8]
    str r0, [sp, #4]
    vstr s0, [sp]
    add r0, sp, #8
    bl . - 0x1FC
    add r5, r4, #5120
    add r5, r5, #60
    mov r1, #0
    ldr r2, [r5, #12]
    mov r0, r5
    bl . + 0x1800
    mov r0, #0
    mov r2, #5248
    str r6, [r5, #12]
    mov r1, r0
    mov r5, #64
    add r3, r2, #13
    strd r0, r1, [r4]
    mov r7, #1
    add r12, r2, #14
    str r5, [r2, r4]
    strb r7, [r3, r4]
    strb r6, [r12, r4]
.Led48_return:
    add sp, sp, #12
    pop {r4, r5, r6, r7, pc}
.size func_0000ED48, . - func_0000ED48

.section .text.func_00010738, "ax", %progbits
.balign 4
.global func_00010738
.type func_00010738, %function
ASM_FUNC(func_00010738)
func_00010738:
    push {r4, r5, r6, r7, r8, lr}
    add r6, r0, #5120
    add r6, r6, #28
    mov r7, #1
    ldr r0, [r6, #20]
    ldr r4, [r0, #8]
    cmp r4, r0
    movne r8, #1
    beq .L10738_return
.L10738_loop:
    ldr r0, [r4, #24]
    ldr r5, [r0, #16]
    mov r0, r5
    bl . - 0x344
    cmp r0, #0
    moveq r7, #0
    beq .L10738_next
    ldr r0, [r5, #72]
    strb r8, [r0, #17]
.L10738_next:
    ldr r0, [r4, #12]
    cmp r0, #0
    beq .L10738_parent
.L10738_descend:
    mov r4, r0
    ldr r0, [r0, #8]
    cmp r0, #0
    bne .L10738_descend
    b .L10738_advance
.L10738_parent:
    ldr r0, [r4, #4]
    ldr r2, [r0, #12]
    cmp r4, r2
    bne .L10738_check
.L10738_ascend:
    mov r4, r0
    ldr r0, [r0, #4]
    ldr r1, [r0, #12]
    cmp r4, r1
    beq .L10738_ascend
.L10738_check:
    ldr r1, [r4, #12]
    cmp r1, r0
    movne r4, r0
.L10738_advance:
    ldr r0, [r6, #20]
    cmp r4, r0
    bne .L10738_loop
.L10738_return:
    mov r0, r7
    pop {r4, r5, r6, r7, r8, pc}
.size func_00010738, . - func_00010738

.section .text.func_0001AB40, "ax", %progbits
.balign 4
.global func_0001AB40
.type func_0001AB40, %function
ASM_FUNC(func_0001AB40)
func_0001AB40:
    cmp r1, #0
    moveq r0, #64
    bxeq lr
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r0
    mov r5, r1
    bl . - 0xBE10
    add r6, r4, #5120
    add r6, r6, #120
    mov r0, r5
    str r5, [r6]
    ldr r1, [r5]
    ldr r1, [r1, #12]
    blx r1
    cmp r0, #0
    moveq r0, #65
    beq .L1ab40_return
    ldr r0, [r6]
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    ldr r1, [pc, #80]
    mov r5, #65536
    mov r6, #5248
    mov r7, #64
    strb r0, [r1, r4]
    mov r1, #0
    mov r2, r1
    mov r3, r1
    mov r12, r1
    stm r4, {r1, r2, r3, r12}
    mov r0, r1
    orr r2, r6, r5, asr #14
    add r1, r4, #5120
    str r7, [r6, r4]
    str r5, [r2, r4]
    add r1, r1, #143
    add r4, r4, #5120
    add r4, r4, #145
    strb r0, [r1]
    strb r0, [r4]
    mov r0, #0
.L1ab40_return:
    pop {r4, r5, r6, r7, r8, pc}
.size func_0001AB40, . - func_0001AB40
