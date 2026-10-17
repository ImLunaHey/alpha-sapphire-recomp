.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0000081C, "ax", %progbits
.balign 4
.global func_0000081C
.type func_0000081C, %function
func_0000081C:
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r7, #0
    ldr r4, [r0, #0xC]
    cmp r4, #0
    beq .Ldestroy_owner_0000081C
    ldrb r0, [r4, #0x1A0]
    add r6, r4, #0x100
    cmp r0, #1
    beq .Lcheck_active_0000081C
    ldrb r0, [r4, #0xA5]
    mov r8, #1
    cmp r0, #1
    strbne r8, [r4, #0x19E]
    strbne r7, [r4, #0x19F]
    beq .Lalternate_0000081C
.Lprimary_0000081C:
    ldr r0, [r4, #0x98]
    cmp r0, #0
    beq .Lmark_ready_0000081C
    bl . - 0x670
    nop
    nop
    bl . - 0x674
    str r7, [r4, #0x98]
.Lmark_ready_0000081C:
    strb r8, [r4, #0x1A0]
.Lcheck_active_0000081C:
    ldrb r0, [r6, #0x9E]
    cmp r0, #0
    beq .Ldestroy_owner_0000081C
    ldr r0, [r5, #0xC]
    bl . - 0x6B0
    mov r0, #0
    pop {r4, r5, r6, r7, r8, pc}
.Lalternate_0000081C:
    ldr r0, [r4, #0x9C]
    cmp r0, #0
    beq .Lclear_alternate_0000081C
    bl . - 0x6A0
    nop
    nop
    bl . - 0x6B4
    str r7, [r4, #0x9C]
.Lclear_alternate_0000081C:
    strb r7, [r4, #0x19E]
    b .Lprimary_0000081C
.Ldestroy_owner_0000081C:
    ldr r0, [r5, #0x30]
    cmp r0, #0
    beq .Ldestroy_child_0000081C
    bl . - 0x6C0
    str r7, [r5, #0x30]
.Ldestroy_child_0000081C:
    ldr r0, [r5, #0xC]
    cmp r0, #0
    beq .Lfinalize_0000081C
    ldr r1, [r0]
    ldr r1, [r1, #0x18]
    blx r1
    str r7, [r5, #0xC]
.Lfinalize_0000081C:
    add r0, r5, #0x10
    bl . - 0x6E0
    mov r0, #5
    strb r0, [r5, #0x2C]
    mov r0, #1
    pop {r4, r5, r6, r7, r8, pc}
.size func_0000081C, . - func_0000081C
