.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_005409C0, "ax", %progbits
.balign 4
.global func_005409C0
.type func_005409C0, %function
func_005409C0:
    add r1, r0, #4
    push {r4, lr}
    ldm r1, {r1, r2}
    mov r4, r0
    ldr r3, .L134_divisor_0
    sub r0, r2, r1
    cmp r2, r1
    smull r2, r0, r3, r0
    asr r2, r0, #1
    sub r2, r2, r0, asr #31
    andhi r0, r2, #1
    movls r0, #0
    add r0, r0, #1
    add r2, r2, #1
    cmp r2, r0
    ble .L134_func_005409C0_store
.L134_func_005409C0_loop:
    add r0, r0, #2
    cmp r2, r0
    bgt .L134_func_005409C0_loop
.L134_func_005409C0_store:
    str r1, [r4, #8]
    ldr r0, [r4]
    cmp r0, #0
    cmpne r1, #0
    beq .L134_func_005409C0_return
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.L134_func_005409C0_return:
    mov r0, r4
    pop {r4, pc}
.L134_func_005409C0_body_end:
.L134_divisor_0:
    .word 0x2aaaaaab
.size func_005409C0, .L134_func_005409C0_body_end - func_005409C0

.section .text.func_00540A38, "ax", %progbits
.balign 4
.global func_00540A38
.type func_00540A38, %function
func_00540A38:
    add r1, r0, #4
    push {r4, lr}
    ldm r1, {r1, r2}
    mov r4, r0
    ldr r3, .L134_divisor_1
    sub r0, r2, r1
    cmp r2, r1
    smull r2, r0, r3, r0
    asr r2, r0, #3
    sub r2, r2, r0, asr #31
    andhi r0, r2, #1
    movls r0, #0
    add r0, r0, #1
    add r2, r2, #1
    cmp r2, r0
    ble .L134_func_00540A38_store
.L134_func_00540A38_loop:
    add r0, r0, #2
    cmp r2, r0
    bgt .L134_func_00540A38_loop
.L134_func_00540A38_store:
    str r1, [r4, #8]
    ldr r0, [r4]
    cmp r0, #0
    cmpne r1, #0
    beq .L134_func_00540A38_return
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.L134_func_00540A38_return:
    mov r0, r4
    pop {r4, pc}
.L134_func_00540A38_body_end:
.L134_divisor_1:
    .word 0x2aaaaaab
.size func_00540A38, .L134_func_00540A38_body_end - func_00540A38

.section .text.func_00540AB0, "ax", %progbits
.balign 4
.global func_00540AB0
.type func_00540AB0, %function
func_00540AB0:
    push {r4, lr}
    mov r4, r0
    add r1, r4, #4
    ldr r0, [r0, #8]
    ldm r1, {r1, r2}
    mov r3, #1
    cmp r0, r1
    sub r2, r2, r1
    lslhi r0, r2, #27
    add r2, r3, r2, asr #4
    lsrhi r0, r0, #31
    movls r0, #0
    add r0, r0, #1
    cmp r2, r0
    ble .L134_func_00540AB0_store
.L134_func_00540AB0_loop:
    add r0, r0, #2
    cmp r2, r0
    bgt .L134_func_00540AB0_loop
.L134_func_00540AB0_store:
    str r1, [r4, #8]
    ldr r0, [r4]
    cmp r0, #0
    cmpne r1, #0
    beq .L134_func_00540AB0_return
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.L134_func_00540AB0_return:
    mov r0, r4
    pop {r4, pc}
.size func_00540AB0, . - func_00540AB0

.section .text.func_0054F918, "ax", %progbits
.balign 4
.global func_0054F918
.type func_0054F918, %function
func_0054F918:
    cmp r1, #0
    bxeq lr
    push {r4, r5, r6, lr}
    mov r5, r0
    mov r4, r1
.L134_func_0054F918_loop:
    mov r0, r5
    ldr r1, [r4, #12]
    bl func_0054F918
    ldr r0, [r5, #4]
    ldr r6, [r4, #8]
    str r0, [r4, #12]
    ldr r1, [r4, #16]
    add r0, r4, #16
    ldr r1, [r1]
    blx r1
    str r4, [r5, #4]
    movs r4, r6
    bne .L134_func_0054F918_loop
    pop {r4, r5, r6, pc}
.size func_0054F918, . - func_0054F918

.section .note.GNU-stack, "", %progbits
