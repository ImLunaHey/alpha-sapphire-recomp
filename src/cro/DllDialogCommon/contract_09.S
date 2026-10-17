.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000002C0, "ax", %progbits
.balign 4
.global func_000002C0
.type func_000002C0, %function
func_000002C0:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #0x20]
    mov r5, #1
    ldrb r0, [r0, #8]
    cmp r0, #3
    beq .Ldispatch_000002C0
    bl . - 0x2AC
    bl . - 0x2A8
    cmp r0, #0
    bne .Lclose_000002C0
    bl . - 0x2BC
    bl . - 0x2B0
    cmp r0, #0
    beq .Ldispatch_000002C0
.Lclose_000002C0:
    ldrb r0, [r4, #0x25]
    cmp r0, #0
    mov r0, #3
    bne .Lnotify_close_000002C0
    strb r5, [r4, #0x25]
    ldr r1, [r4, #0x20]
    strb r0, [r1, #8]
.Lnotify_close_000002C0:
    ldr r0, [r4, #4]
    mov r1, #0
    bl . - 0x2D8
    nop
    nop
    bl . - 0x2FC
    nop
    nop
    bl . - 0x2E8
.Ldispatch_000002C0:
    ldr r0, [r4, #0x20]
    ldrb r0, [r0]
    cmp r0, #0
    beq .Ltick_000002C0
    cmp r0, #1
    beq .Ldelayed_000002C0
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl . - 0x308
.Ltick_000002C0:
    ldr r0, [r4, #0x28]
    cmp r0, #0
    ble .Ltest_flag_000002C0
.Ltick_count_000002C0:
    ldr r0, [r4, #0x28]
    sub r0, r0, #1
    str r0, [r4, #0x28]
.Ltest_flag_000002C0:
    ldrb r0, [r4, #0x25]
    cmp r0, #0
    beq .Lreturn_000002C0
    mov r3, #0
    mov r2, #8
    mov r1, r3
    mov r0, #2
    bl . - 0x338
    mov r0, #2
    strb r0, [r4, #0x24]
.Lreturn_000002C0:
    pop {r4, r5, r6, pc}
.Ldelayed_000002C0:
    ldrh r0, [r4, #0x26]
    cmp r0, #0
    beq .Lstart_delay_000002C0
    cmp r0, #1
    ldreq r0, [r4, #0x28]
    cmpeq r0, #0
    bne .Ltick_000002C0
    ldrb r0, [r4, #0x25]
    cmp r0, #0
    mov r0, #0
    bne .Lcomplete_000002C0
    b .Lset_open_000002C0
.Lstart_delay_000002C0:
    mov r0, #0xB4
    str r0, [r4, #0x28]
    strh r5, [r4, #0x26]
    b .Ltick_count_000002C0
.Lset_open_000002C0:
    strb r5, [r4, #0x25]
    ldr r1, [r4, #0x20]
    strb r0, [r1, #8]
.Lcomplete_000002C0:
    ldr r0, [r4, #4]
    mov r1, #0
    bl . - 0x3B4
    nop
    nop
    b .Ltick_000002C0
.size func_000002C0, . - func_000002C0
