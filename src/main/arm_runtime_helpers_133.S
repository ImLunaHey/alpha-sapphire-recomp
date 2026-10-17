.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0052BB30, "ax", %progbits
.balign 4
.global func_0052BB30
.type func_0052BB30, %function
func_0052BB30:
    push {r4}
    ldr r1, [r1, #20]
    mov r3, #0
    ldr ip, [r1]
    ldr r1, .L133_func_0052BB30_100
    str r1, [r0, #4]
    str r3, [r0, #8]
    mov r1, #2
    str r3, [r0, #12]
    strb r1, [r0, #9]
    ldr r3, [ip, #8]!
    mov r1, #1
    add r2, r3, #4
    str r3, [r0]
.L133_func_0052BB30_56:
    ldrex r3, [r2]
    add r3, r3, r1
    strex r4, r3, [r2]
    cmp r4, #0
    bne .L133_func_0052BB30_56
    add ip, ip, #8
    add r0, r0, #8
    vldmia ip, {s0-s6}
    vstmia r0, {s0-s6}
    pop {r4}
    bx lr
.L133_func_0052BB30_body_end:
.L133_func_0052BB30_100:
    .word runtime_record_descriptor_107_c
.size func_0052BB30, .L133_func_0052BB30_body_end - func_0052BB30

.section .text.func_0053F5E0, "ax", %progbits
.balign 4
.global func_0053F5E0
.type func_0053F5E0, %function
func_0053F5E0:
    ldr r1, .L133_func_0053F5E0_116
    str r1, [r0]
    ldr r1, [r0, #4]
    ldr ip, [r0, #12]
    cmp r1, ip
    bxeq lr
    push {r4, r5}
    mov r4, #0
.L133_func_0053F5E0_32:
    ldrd r2, [r1, #20]
    cmp r3, #0
    strne r2, [r3, #20]
    cmp r2, #0
    str r4, [r1, #24]
    strne r3, [r2, #24]
    str r4, [r1, #20]
    ldr r5, [r0, #4]
    cmp r5, r1
    streq r2, [r0, #4]
    ldr r5, [r0, #8]
    cmp r5, r1
    streq r3, [r0, #8]
    ldr r1, [r0, #16]
    cmp r2, ip
    sub r1, r1, #1
    str r1, [r0, #16]
    mov r1, r2
    bne .L133_func_0053F5E0_32
    pop {r4, r5}
    bx lr
.L133_func_0053F5E0_body_end:
.L133_func_0053F5E0_116:
    .word runtime_literal_133_1
.size func_0053F5E0, .L133_func_0053F5E0_body_end - func_0053F5E0

.section .text.func_0053F688, "ax", %progbits
.balign 4
.global func_0053F688
.type func_0053F688, %function
func_0053F688:
    ldr r1, .L133_func_0053F688_116
    str r1, [r0]
    ldr r1, [r0, #4]
    ldr ip, [r0, #12]
    cmp r1, ip
    bxeq lr
    push {r4, r5}
    mov r4, #0
.L133_func_0053F688_32:
    ldrd r2, [r1, #12]
    cmp r3, #0
    strne r2, [r3, #12]
    cmp r2, #0
    str r4, [r1, #16]
    strne r3, [r2, #16]
    str r4, [r1, #12]
    ldr r5, [r0, #4]
    cmp r5, r1
    streq r2, [r0, #4]
    ldr r5, [r0, #8]
    cmp r5, r1
    streq r3, [r0, #8]
    ldr r1, [r0, #16]
    cmp r2, ip
    sub r1, r1, #1
    str r1, [r0, #16]
    mov r1, r2
    bne .L133_func_0053F688_32
    pop {r4, r5}
    bx lr
.L133_func_0053F688_body_end:
.L133_func_0053F688_116:
    .word runtime_literal_133_2
.size func_0053F688, .L133_func_0053F688_body_end - func_0053F688

.section .text.func_0053F7A8, "ax", %progbits
.balign 4
.global func_0053F7A8
.type func_0053F7A8, %function
func_0053F7A8:
    ldr r1, .L133_func_0053F7A8_116
    str r1, [r0]
    ldr r1, [r0, #4]
    ldr ip, [r0, #12]
    cmp r1, ip
    bxeq lr
    push {r4, r5}
    mov r4, #0
.L133_func_0053F7A8_32:
    ldrd r2, [r1, #28]
    cmp r3, #0
    strne r2, [r3, #28]
    cmp r2, #0
    str r4, [r1, #32]
    strne r3, [r2, #32]
    str r4, [r1, #28]
    ldr r5, [r0, #4]
    cmp r5, r1
    streq r2, [r0, #4]
    ldr r5, [r0, #8]
    cmp r5, r1
    streq r3, [r0, #8]
    ldr r1, [r0, #16]
    cmp r2, ip
    sub r1, r1, #1
    str r1, [r0, #16]
    mov r1, r2
    bne .L133_func_0053F7A8_32
    pop {r4, r5}
    bx lr
.L133_func_0053F7A8_body_end:
.L133_func_0053F7A8_116:
    .word runtime_literal_133_3
.size func_0053F7A8, .L133_func_0053F7A8_body_end - func_0053F7A8
