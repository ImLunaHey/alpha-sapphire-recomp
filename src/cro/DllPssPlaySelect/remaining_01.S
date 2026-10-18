.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000658, "ax", %progbits
.balign 4
.global func_00000658
.type func_00000658, %function
ASM_FUNC(func_00000658)
func_00000658:
    push {r4, r5, lr}
    mov r4, r0
    sub sp, sp, #12
    mov r0, #238
    bl . - 0x5D8
    mov r5, r0
    mov r0, #237
    bl . - 0x5E4
    mov r12, #393216
    mov r3, #160
    mov r2, #65536
    stm sp, {r2, r3, r12}
    mov r1, r0
    mov r3, #159
    mov r2, r5
    add r0, r4, #8
    bl . - 0x600
    ldr r1, [r4, #12]
    mov r0, #128
    bl . - 0x604
    movs r12, r0
    beq .Lstore_child
    ldr r0, [r4, #32]
    ldrsb r3, [r0, #12]
    ldrb r2, [r0, #13]
    ldr r1, [r0, #8]
    stm sp, {r1, r2, r3}
    add r1, r4, #8
    ldrd r2, [r0]
    mov r0, r12
    bl . + 0x1D0
.Lstore_child:
    str r0, [r4, #4]
    str r4, [r0, #120]
    ldr r0, [r4, #4]
    ldr r1, [r0]
    ldr r1, [r1, #32]
    blx r1
    mov r0, #1
    bl . - 0x648
    mov r0, #1
    strb r0, [r4, #36]
    add sp, sp, #12
    pop {r4, r5, pc}
.size func_00000658, . - func_00000658

.section .text.func_000008A0, "ax", %progbits
.balign 4
.global func_000008A0
.type func_000008A0, %function
ASM_FUNC(func_000008A0)
func_000008A0:
    push {r4, r5, r6, r7, r8, r9, r10, r11, lr}
    sub sp, sp, #36
    mov r4, r1
    mov r9, r2
    add r2, sp, #72
    mov r10, r3
    ldm r2, {r6, r7, r8}
    ldr r2, [r1, #16]
    mov r3, r2
    bl . - 0x804
    mov r5, r0
    ldr r0, [pc, #376]
    add r2, r5, #116
    mov r11, #0
    str r0, [r5]
    add r1, r0, #68
    stm r2, {r1, r11}
    mov r2, r11
    strb r7, [r5, #125]
    mov r1, r4
    mov r0, r5
    strb r8, [r5, #124]
    bl . - 0x830
    ldr r3, [pc, #332]
    cmp r10, #0
    cmpne r6, #0
    mov r0, r5
    mov r1, r4
    mov r2, r9
    sub r12, r3, #20
    mov r7, #1
    beq .Ldefault_setup
    add r8, sp, #20
    str r12, [sp]
    stm r8, {r6, r7, r11}
    add r8, sp, #8
    str r7, [sp, #4]
    stm r8, {r3, r7, r10}
    mov r3, #1
    bl . - 0x86C
.Lpost_setup:
    mov r0, r5
    bl . - 0x5EC
    mov r0, r5
    nop {0}
    bl . - 0x1B4
    mov r1, #0
    mov r0, r5
    bl . - 0x904
    mov r1, #6
    mov r2, r0
    str r1, [sp]
    ldr r3, [pc, #224]
    mov r1, r4
    mov r0, r5
    bl . - 0x8A0
    ldr r6, [pc, #208]
    mov r4, #0
    add r8, r6, #168
.Lconfigure_loop:
    rsb r0, r4, r4, lsl #3
    ldr r2, [r8, r4, lsl #2]
    ldr r1, [r6, r0, lsl #2]
    ldr r0, [r5, #16]
    bl . - 0x8B8
    add r4, r4, #1
    cmp r4, #6
    bcc .Lconfigure_loop
    ldrb r0, [r5, #124]
    cmp r0, #1
    bne .Lselect_state
    b .Lmode_one

.Ldefault_setup:
    mov r6, #8
    add r9, sp, #20
    str r6, [sp, #28]
    str r12, [sp]
    stm r9, {r7, r11}
    add r9, sp, #8
    mov r8, #70
    str r7, [sp, #4]
    stm r9, {r3, r7, r8}
    mov r3, #1
    bl . - 0x8F8
    nop {0}
    nop {0}
    b .Lpost_setup

.Lmode_one:
    mov r3, #0
    ldr r0, [r5, #92]
    mov r2, #1
    mov r1, r3
    bl . - 0x990
    str r7, [sp]
    ldr r0, [r5, #92]
    mov r2, r7
    mov r3, #1
    mov r1, #0
    bl . - 0x9A0
    mov r0, r5
    nop {0}
    bl . - 0x99C
.Lselect_state:
    ldrb r1, [r5, #124]
    mov r0, r5
    bl . - 0x32C
    add r1, r5, #116
    mov r0, r5
    bl . - 0x94C
    add sp, sp, #36
    mov r0, r5
    pop {r4, r5, r6, r7, r8, r9, r10, r11, pc}
.size func_000008A0, . - func_000008A0
