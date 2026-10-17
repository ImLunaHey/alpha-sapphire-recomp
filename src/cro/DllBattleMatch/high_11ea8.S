.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00011EA8, "ax", %progbits
.balign 4
.global func_00011EA8
.type func_00011EA8, %function
func_00011EA8:
.Lentry_00011EA8:
    push {r4, r5, r6, lr}
    mov r6, #0
    ldr r1, [r0, #0x58]
    cmp r1, #0
    beq .Lcheck_5c_00011EA8

    ldr r4, [r0, #0x14]
    mov r1, #0
    ldr r5, [r4, #0x94]
    ldr r0, [r5, #0x5c]
    ldr r2, [r5, #0x7c]
    bl .Lcall_000001DC
    cmp r0, #0
    beq .Lreturn_zero_00011EA8
    ldr r0, [r5, #0x5c]!
    mov r1, #1
    ldr r2, [r5, #0x24]
    bl .Lcall_000001DC
    cmp r0, #0
    beq .Lreturn_zero_00011EA8
    ldr r0, [r4, #0x94]
    mov r1, #0
    str r1, [r0, #0x88]
    ldrb r0, [r4, #0xc4]
    cmp r0, #1
    beq .Lreset_58_00011EA8
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl .Lcall_0000003C
.Lreset_58_00011EA8:
    strb r6, [r4, #0xc4]
    ldr r0, [r4, #0x94]
    bl .Lcall_000001AC
    mov r0, #1
    pop {r4, r5, r6, pc}

.Lcheck_5c_00011EA8:
    ldr r1, [r0, #0x5c]
    cmp r1, #0
    beq .Lcheck_60_00011EA8
    ldr r0, [r0, #0x14]
    pop {r4, r5, r6, lr}
    b .Lcall_0000E710

.Lcheck_60_00011EA8:
    ldr r1, [r0, #0x60]
    cmp r1, #0
    beq .Lunexpected_00011EA8
    ldr r4, [r0, #0x14]
    mov r1, #0
    ldr r5, [r4, #0x9c]
    ldr r0, [r5, #0x5c]
    ldr r2, [r5, #0x7c]
    bl .Lcall_000001DC
    cmp r0, #0
    nop
    beq .Lreturn_zero_00011EA8
    ldr r0, [r5, #0x5c]!
    mov r1, #1
    ldr r2, [r5, #0x24]
    bl .Lcall_000001DC
    cmp r0, #0
    nop
    beq .Lreturn_zero_00011EA8
    ldr r0, [r4, #0x9c]
    mov r1, #0
    str r1, [r0, #0x88]
    ldrb r0, [r4, #0xc4]
    cmp r0, #1
    beq .Lreset_60_00011EA8
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl .Lcall_0000003C
.Lreset_60_00011EA8:
    strb r6, [r4, #0xc4]
    ldr r0, [r4, #0x9c]
    bl .Lcall_000001AC
    nop
    nop
    b .Lreturn_one_00011EA8

.Lreturn_zero_00011EA8:
    mov r0, #0
    pop {r4, r5, r6, pc}

.Lunexpected_00011EA8:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl .Lcall_0000003C

.Lreturn_one_00011EA8:
    mov r0, #1
    pop {r4, r5, r6, pc}

.Lcall_0000003C = .Lentry_00011EA8 - (0x00011EA8 - 0x0000003C)
.Lcall_000001AC = .Lentry_00011EA8 - (0x00011EA8 - 0x000001AC)
.Lcall_000001DC = .Lentry_00011EA8 - (0x00011EA8 - 0x000001DC)
.Lcall_0000E710 = .Lentry_00011EA8 - (0x00011EA8 - 0x0000E710)

.size func_00011EA8, . - func_00011EA8
.if (. - func_00011EA8) != 332
.error "func_00011EA8 must be exactly 332 bytes"
.endif
