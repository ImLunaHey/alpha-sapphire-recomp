.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00001D60, "ax", %progbits
.balign 4
.global func_00001D60
.type func_00001D60, %function
func_00001D60:
    push {r4, r5, r6, r7, r8, r9, lr}
    mov r4, r0
    sub sp, sp, #36
    mov r5, r1
    ldr r9, [pc, #512]
    mov r6, r2
    mov r8, #0
    ldr r0, [r9, #-12]
    tst r0, #1
    bne .Lsetup_00001D60
    sub r0, r9, #12
    bl . - 0x1B44
    cmp r0, #0
    beq .Lsetup_00001D60
    str r8, [r9, #8]
    sub r0, r9, #12
    bl . - 0x1B50
.Lsetup_00001D60:
    mov r7, #1
    mov r0, #8
    str r0, [sp, #28]
    str r9, [sp]
    mov r0, #59
    add r3, sp, #16
    stmia r3, {r0, r7, r8}
    str r7, [sp, #4]
    mov r1, r7
    ldr r0, [pc, #428]
    strd r0, r1, [sp, #8]
    mov r3, r7
    mov r2, r6
    mov r1, r5
    mov r0, r4
    bl . - 0x1B88
    nop
    nop
    bl . - 0x1CA4
    ldr r0, [r0, #28]
    ldr r0, [r0]
    add r1, r0, #0x20400
    add r0, sp, #8
    bl . - 0x1B20
    add r0, sp, #8
    nop
    bl . - 0x1B24
    mov r5, r0
    str r7, [sp]
    str r7, [sp, #4]
    mov r0, r4
    bl . - 0x1D88
    mov r3, #6
    mov r2, r5
    mov r1, #5
    bl . - 0x1B40
    mov r3, #12
    mov r2, #43
    mov r1, r8
    mov r0, r4
    bl . - 0x1B74

    add r0, r4, #120
    nop
    bl . - 0x1B58
    ldr r1, [pc, #292]
    smull r2, r3, r1, r0
    asr r2, r3, #5
    asr r1, r0, #31
    sub r2, r2, r1
    mvn r3, #24
    mul r2, r3, r2
    add r5, r0, r2, lsl #2
    mov r6, #2
    strd r6, r7, [sp]
    mov r0, r4
    bl . - 0x1DE8
    mov r3, r6
    mov r2, r5
    mov r1, r8
    bl . - 0x1BA0

    add r0, r4, #120
    nop
    bl . - 0x1B9C
    mov r5, r0
    str r7, [sp, #4]
    str r8, [sp]
    mov r0, r4
    bl . - 0x1E18
    mov r3, r6
    mov r2, r5
    mov r1, r7
    bl . - 0x1BD0

    add r0, r4, #120
    nop
    bl . - 0x1BC4
    mov r5, r0
    str r7, [sp, #4]
    str r8, [sp]
    mov r0, r4
    bl . - 0x1E48
    mov r3, r6
    mov r2, r5
    mov r1, r6
    bl . - 0x1C00

    add r0, r4, #120
    nop
    bl . - 0x1BEC
    mov r5, r0
    str r7, [sp]
    str r7, [sp, #4]
    mov r0, r4
    bl . - 0x1E78
    mov r3, r6
    mov r2, r5
    mov r1, #3
    bl . - 0x1C30

    add r0, r4, #120
    nop
    bl . - 0x1C14
    mov r5, r0
    strd r6, r7, [sp]
    mov r0, r4
    bl . - 0x1EA4
    mov r3, r6
    mov r2, r5
    mov r1, #4
    bl . - 0x1C5C

    mov r3, #10
    mov r2, #49
    mov r1, r8
    mov r0, r4
    bl . - 0x1C90
    add r0, sp, #8
    nop
    bl . - 0x1C4C
    add sp, sp, #36
    pop {r4, r5, r6, r7, r8, r9, pc}
.size func_00001D60, . - func_00001D60
