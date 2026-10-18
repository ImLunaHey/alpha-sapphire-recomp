.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000780, "ax", %progbits
.balign 4
.global func_00000780
.type func_00000780, %function
ASM_FUNC(func_00000780)
func_00000780:
    push {r4, r5, r6, r7, r8, r9, r10, r11, lr}
    mov r6, r2
    sub sp, sp, #36
    mov r5, r1
    mov r11, r3
    ldr r2, [r1, #16]
    ldr r10, [sp, #72]
    mov r3, r2
    bl . - 0x6F0
    mov r4, r0
    ldr r0, [pc, #748]
    add r3, r4, #116
    mov r7, #0
    add r1, r0, #64
    str r0, [r4]
    stm r3, {r1, r5, r7}
    mov r2, #1
    mov r1, r5
    mov r0, r4
    bl . - 0x714
    add r8, sp, #16
    mov r2, #136
    stm r8, {r2, r7}
    mov r0, #8
    ldr r3, [pc, #696]
    mov r9, #2
    add r2, sp, #8
    sub r12, r3, #40
    str r0, [sp, #28]
    str r7, [sp, #24]
    str r9, [sp, #4]
    str r12, [sp]
    stm r2, {r3, r9}
    mov r1, r5
    mov r3, r9
    mov r2, #0
    mov r0, r4
    bl . - 0x754
    mov r3, #0
    ldr r0, [r4, #92]
    mov r2, #73
    mov r1, r3
    bl . - 0x760
    mov r3, #0
    ldr r0, [r4, #92]
    mov r2, #75
    mov r1, r3
    bl . - 0x774
    mov r0, r4
    bl . - 0x774
    ldr r2, [pc, #596]
    mov r3, #5
    mov r1, #1
    bl . - 0x77C
    cmp r6, #0
    mov r8, #1
    beq .Lmode_zero_setup
    cmp r6, #1
    beq .Lmode_one_setup
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl . - 0x820
.Lsecond_dispatch:
    cmp r6, #0
    mov r5, r10
    beq .Lmode_zero_resource
    cmp r6, #1
    beq .Lmode_one_resource
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl . - 0x844
.Lfinalize:
    add r1, r4, #116
    mov r0, r4
    bl . - 0x7C8
    add sp, sp, #36
    mov r0, r4
    pop {r4, r5, r6, r7, r8, r9, r10, r11, pc}

.Lmode_zero_setup:
    mov r5, #2
    mov r1, #1
    mov r0, r4
    bl . - 0x7DC
    mov r2, r0
    str r5, [sp]
    ldr r3, [pc, #464]
    ldr r1, [r4, #120]
    mov r0, r4
    bl . - 0x7EC
    mov r0, r4
    nop {0}
    bl . - 0x7F0
    ldr r5, [pc, #440]
    mov r1, #4
    mov r2, r5
    bl . - 0x7F8
    mov r0, r4
    nop {0}
    bl . - 0x80C
    mov r2, r5
    mov r1, #5
    bl . - 0x810
    mov r0, r4
    nop {0}
    bl . - 0x824
    mov r3, #0
    mov r2, #32
    mov r1, #5
    bl . - 0x824
    mov r3, #1
    str r8, [sp]
    ldr r0, [r4, #92]
    mov r2, #0
    mov r1, r3
    bl . - 0x834
    nop {0}
    nop {0}
    b .Lsecond_dispatch

.Lmode_one_setup:
    mov r0, r4
    bl . - 0x888
    mov r3, #0
    mov r2, #6
    mov r1, #1
    bl . - 0x8A0
    mov r0, r4
    nop {0}
    bl . - 0x8A4
    mov r3, #0
    mov r2, #7
    mov r1, #1
    bl . - 0x8BC
    nop {0}
    nop {0}
    b .Lsecond_dispatch

.Lmode_zero_resource:
    cmp r5, #0
    beq .Lmode_zero_slots
    mov r0, r4
    bl . - 0x8D0
    nop {0}
    nop {0}
    bl . - 0x894
    mov r2, r5
    mov r1, #0
    bl . - 0x898
    mov r0, r4
    nop {0}
    bl . - 0x8F4
    ldr r1, [r4, #120]
    mov r3, #0
    mov r2, #70
    str r1, [sp]
    mov r1, r3
    bl . - 0x8B4
.Lmode_zero_slots:
    mov r3, #4
    mov r2, #0
    mov r1, #1
    mov r0, r4
    bl . - 0x8C0
    mov r3, #5
    mov r2, #2
    mov r1, #1
    mov r0, r4
    bl . - 0x8D4
    nop {0}
    nop {0}
    b .Lfinalize

.Lmode_one_resource:
    cmp r5, #0
    beq .Lmode_one_layout
    mov r0, r4
    bl . - 0x950
    nop {0}
    nop {0}
    bl . - 0x914
    mov r2, r5
    mov r1, #0
    bl . - 0x918
    mov r0, r4
    nop {0}
    bl . - 0x974
    ldr r1, [r4, #120]
    mov r3, #3
    mov r2, #70
    str r1, [sp]
    mov r1, #0
    bl . - 0x934
.Lmode_one_layout:
    mov r0, r4
    bl . - 0x994
    add r1, sp, #12
    str r8, [sp, #8]
    str r9, [sp, #4]
    stm r1, {r7, r8}
    mov r3, #3
    ldrsh r1, [r11]
    mov r2, #70
    str r1, [sp]
    mov r1, #0
    bl . - 0x954
    nop {0}
    nop {0}
    b .Lfinalize
.size func_00000780, . - func_00000780
