.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00001ED4, "ax", %progbits
.balign 4
.global func_00001ED4
.type func_00001ED4, %function
func_00001ED4:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldrb r0, [r0, #0x16B]
    mov r5, r1
    cmp r0, #0
    beq .Lnew_state_00001ED4
    cmp r0, #1
    beq .Lrelease_00001ED4
    cmp r0, #2
    moveq r0, r4
    bleq . - 0xF4
    b .Lnew_state_00001ED4
.Lrelease_00001ED4:
    ldr r0, [r4, #0x78]
    bl . - 0x1C80
.Lnew_state_00001ED4:
    cmp r5, #0
    beq .Ldone_00001ED4
    cmp r5, #1
    beq .Lcreate_00001ED4
    cmp r5, #2
    bne .Ldone_00001ED4
    b .Lconfigure_00001ED4
.Lcreate_00001ED4:
    ldr r0, [r4, #0x78]
    ldr r1, [r4, #0x74]
    bl . - 0x1C58
    nop
    nop
    b .Ldone_00001ED4
.Lconfigure_00001ED4:
    ldr r0, [r4, #0xA4]
    ldr r1, [pc, #0x1C]
    ldr r2, [r4, #0x74]
    add r0, r0, r0, lsl #3
    add r0, r1, r0, lsl #2
    ldr r1, [r0, #0x1C]
    mov r0, r4
    bl . - 0x2E4
.Ldone_00001ED4:
    strb r5, [r4, #0x16B]
    pop {r4, r5, r6, pc}
.size func_00001ED4, . - func_00001ED4
