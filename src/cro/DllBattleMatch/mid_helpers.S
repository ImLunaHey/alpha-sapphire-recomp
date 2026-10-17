.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0000DFCC, "ax", %progbits
.balign 4
.global func_0000DFCC
.type func_0000DFCC, %function
func_0000DFCC:
.Lentry_0000DFCC:
    push {r3-r7, lr}
    mov r4, r0
    mov r7, #0
    str r7, [r0, #0]
    str r7, [r0, #0x10]
    str r7, [r0, #0x14]
    strb r7, [r0, #0x18]
    strb r0, [r0, #0x19]
    str r7, [r0, #0xc]
    str r7, [r0, #8]
    str r7, [r0, #4]
    mov r6, #0x20
    mov r0, #0xc
    bl .Lcall_0000DFCC_00000994
    mov r5, r0
    mov r0, #0x700
    bl .Lcall_0000DFCC_00000994
    str r0, [r5, #8]
    ldr r0, [r4, #0]
    add r1, r4, #8
    stm r5, {r0, r6}
    str r5, [r4, #0]
    ldr r0, [r5, #8]
    add r2, r0, #0x700
    stm r1, {r0, r2}
    ldr r0, [r4, #8]
    add r2, r0, #0x38
    str r2, [r4, #8]
    str r7, [r0, #8]
    str r7, [r0, #0xc]
    strb r7, [r0, #0]
    str r0, [r4, #0x10]
    str r7, [r0, #4]
    ldr r0, [r4, #0x10]
    str r0, [r0, #8]
    ldr r0, [r4, #0x10]
    str r0, [r0, #0xc]
    mov r0, r4
    pop {r3-r7, pc}
.Lcall_0000DFCC_00000994 = .Lentry_0000DFCC - (0x0000DFCC - 0x00000994)
.size func_0000DFCC, . - func_0000DFCC
.if (. - func_0000DFCC) != 156
.error "func_0000DFCC must be exactly 156 bytes"
.endif

.section .text.func_0000E710, "ax", %progbits
.balign 4
.global func_0000E710
.type func_0000E710, %function
func_0000E710:
.Lentry_0000E710:
    push {r4-r6, lr}
    mov r4, r0
    ldr r5, [r0, #0x98]
    mov r1, #0
    ldr r0, [r5, #0x5c]
    ldr r2, [r5, #0x7c]
    bl .Lcall_0000E710_000001DC
    cmp r0, #0
    beq .Lzero_0000E710
    ldr r0, [r5, #0x5c]!
    mov r1, #1
    ldr r2, [r5, #0x24]
    bl .Lcall_0000E710_000001DC
    cmp r0, #0
    beq .Lzero_0000E710
    ldr r0, [r4, #0x98]
    mov r1, #0
    str r1, [r0, #0x88]
    ldrb r0, [r4, #0xc4]
    cmp r0, #1
    beq .Lcomplete_0000E710
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl .Lcall_0000E710_0000003C
.Lcomplete_0000E710:
    mov r0, #0
    strb r0, [r4, #0xc4]
    ldr r0, [r4, #0x98]
    bl .Lcall_0000E710_000001AC
    mov r0, #1
    pop {r4-r6, pc}
.Lzero_0000E710:
    mov r0, #0
    pop {r4-r6, pc}
.Lcall_0000E710_0000003C = .Lentry_0000E710 - (0x0000E710 - 0x0000003C)
.Lcall_0000E710_000001AC = .Lentry_0000E710 - (0x0000E710 - 0x000001AC)
.Lcall_0000E710_000001DC = .Lentry_0000E710 - (0x0000E710 - 0x000001DC)
.size func_0000E710, . - func_0000E710
.if (. - func_0000E710) != 132
.error "func_0000E710 must be exactly 132 bytes"
.endif

.section .text.func_0000E970, "ax", %progbits
.balign 4
.global func_0000E970
.type func_0000E970, %function
func_0000E970:
.Lentry_0000E970:
    push {r4-r7, lr}
    mov r6, r0
    sub sp, sp, #0xc
    ldr r0, [r0, #0x4c]
    mov r7, r1
    add r0, r0, #1
    cmp r0, #0xa
    str r0, [r6, #0x4c]
    movcc r0, #0
    bcc .Ldone_0000E970
    mov r0, sp
    bl .Lcall_0000E970_00000764
    mov r0, sp
    bl .Lcall_0000E970_0000065C
    mov r0, sp
    bl .Lcall_0000E970_0000076C
    mov r4, r0
    add r0, r6, #0x40
    bl .Lcall_0000E970_0000076C
    subs r0, r4, r0
    cmp r0, r7
    mov r1, #0
    movcs r4, #1
    movcc r4, #0
    mov r0, sp
    str r1, [r6, #0x4c]
    bl .Lcall_0000E970_0000048C
    mov r0, r4
.Ldone_0000E970:
    add sp, sp, #0xc
    pop {r4-r7, pc}
.Lcall_0000E970_0000048C = .Lentry_0000E970 - (0x0000E970 - 0x0000048C)
.Lcall_0000E970_0000065C = .Lentry_0000E970 - (0x0000E970 - 0x0000065C)
.Lcall_0000E970_00000764 = .Lentry_0000E970 - (0x0000E970 - 0x00000764)
.Lcall_0000E970_0000076C = .Lentry_0000E970 - (0x0000E970 - 0x0000076C)
.size func_0000E970, . - func_0000E970
.if (. - func_0000E970) != 120
.error "func_0000E970 must be exactly 120 bytes"
.endif

.section .text.func_0000EAFC, "ax", %progbits
.balign 4
.global func_0000EAFC
.type func_0000EAFC, %function
func_0000EAFC:
.Lentry_0000EAFC:
    push {r4-r6, lr}
    mov r4, r0
    ldr r5, [r0, #0xac]
    mov r1, #0
    ldr r0, [r5, #0x5c]
    ldr r2, [r5, #0x7c]
    bl .Lcall_0000EAFC_000001DC
    cmp r0, #0
    beq .Lzero_0000EAFC
    ldr r0, [r5, #0x5c]!
    mov r1, #1
    ldr r2, [r5, #0x24]
    bl .Lcall_0000EAFC_000001DC
    cmp r0, #0
    beq .Lzero_0000EAFC
    ldr r0, [r4, #0xac]
    mov r1, #0
    str r1, [r0, #0x88]
    ldrb r0, [r4, #0xc4]
    cmp r0, #1
    beq .Lcomplete_0000EAFC
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl .Lcall_0000EAFC_0000003C
.Lcomplete_0000EAFC:
    mov r0, #0
    strb r0, [r4, #0xc4]
    ldr r0, [r4, #0xac]
    bl .Lcall_0000EAFC_000001AC
    mov r0, #1
    pop {r4-r6, pc}
.Lzero_0000EAFC:
    mov r0, #0
    pop {r4-r6, pc}
.Lcall_0000EAFC_0000003C = .Lentry_0000EAFC - (0x0000EAFC - 0x0000003C)
.Lcall_0000EAFC_000001AC = .Lentry_0000EAFC - (0x0000EAFC - 0x000001AC)
.Lcall_0000EAFC_000001DC = .Lentry_0000EAFC - (0x0000EAFC - 0x000001DC)
.size func_0000EAFC, . - func_0000EAFC
.if (. - func_0000EAFC) != 132
.error "func_0000EAFC must be exactly 132 bytes"
.endif

.section .text.func_0000EED4, "ax", %progbits
.balign 4
.global func_0000EED4
.type func_0000EED4, %function
func_0000EED4:
.Lentry_0000EED4:
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #0x84]
    cmp r0, #0
    beq .Lsuccess_0000EED4
    bl .Lcall_0000EED4_00000354
    cmp r0, #0
    beq .Lreturn_0000EED4
    ldr r0, [r4, #0x84]
    cmp r0, #0
    beq .Lsuccess_0000EED4
    ldr r1, [r0, #0]
    ldr r1, [r1, #4]
    blx r1
    mov r0, #0
    str r0, [r4, #0x84]
.Lsuccess_0000EED4:
    mov r0, #1
.Lreturn_0000EED4:
    pop {r4, pc}
.Lcall_0000EED4_00000354 = .Lentry_0000EED4 - (0x0000EED4 - 0x00000354)
.size func_0000EED4, . - func_0000EED4
.if (. - func_0000EED4) != 72
.error "func_0000EED4 must be exactly 72 bytes"
.endif

.section .text.func_0000F21C, "ax", %progbits
.balign 4
.global func_0000F21C
.type func_0000F21C, %function
func_0000F21C:
.Lentry_0000F21C:
    push {r3-r5, lr}
    mov r5, r1
    str r1, [r0, #0x80]
    mov r4, r0
    ldr r0, [r0, #0x5c]
    mov r3, #0
    mov r2, r5
    mov r1, #1
    bl .Lcall_0000F21C_0000019C
    mov r0, #1
    mov r3, #1
    str r0, [sp]
    ldr r0, [r4, #0x5c]
    mov r2, r5
    mov r1, r3
    bl .Lcall_0000F21C_000001A4
    cmp r5, #0x15
    bne .Lreturn_0000F21C
    mov r0, r4
    bl .Lcall_0000F21C_0000052C
    pop {r3-r5, lr}
    mov r1, #1
    b .Lcall_0000F21C_00000534
.Lreturn_0000F21C:
    pop {r3-r5, pc}
.Lcall_0000F21C_0000019C = .Lentry_0000F21C - (0x0000F21C - 0x0000019C)
.Lcall_0000F21C_000001A4 = .Lentry_0000F21C - (0x0000F21C - 0x000001A4)
.Lcall_0000F21C_0000052C = .Lentry_0000F21C - (0x0000F21C - 0x0000052C)
.Lcall_0000F21C_00000534 = .Lentry_0000F21C - (0x0000F21C - 0x00000534)
.size func_0000F21C, . - func_0000F21C
.if (. - func_0000F21C) != 96
.error "func_0000F21C must be exactly 96 bytes"
.endif
