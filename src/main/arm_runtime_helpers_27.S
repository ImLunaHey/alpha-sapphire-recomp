.syntax unified

.section .text.func_002DF13C,"ax",%progbits
.balign 4
.arm
.global func_002DF13C
.type func_002DF13C, %function
func_002DF13C:
    ldr r0, .Lruntime_once_flag_27
    ldrb r1, [r0]
    cmp r1, #0
    moveq r1, #1
    strbeq r1, [r0]
    bx lr
.size func_002DF13C, .-func_002DF13C
.Lruntime_once_flag_27:
    .word runtime_once_flag_27
.global runtime_once_flag_27

.section .text.func_002DFB0C,"ax",%progbits
.balign 4
.arm
.global func_002DFB0C
.type func_002DFB0C, %function
func_002DFB0C:
    push {r4, r5}
    mov r1, #0
    ldr r5, .Lruntime_initializer_value_b_27
    str r1, [r0, #72]
    str r1, [r0, #76]
    ldr r2, .Lruntime_initializer_value_c_27
    str r1, [r0, #68]!
    mvn r3, r5
    ldr r4, .Lruntime_initializer_value_a_27
    str r3, [r0, #24]
    str r2, [r0, #28]
    add r0, r0, #12
    mvn r12, r4
    stm r0, {r4, r5, r12}
    pop {r4, r5}
    bx lr
.size func_002DFB0C, .-func_002DFB0C
.Lruntime_initializer_value_a_27:
    .word runtime_initializer_value_a_27
.Lruntime_initializer_value_b_27:
    .word runtime_initializer_value_b_27
.Lruntime_initializer_value_c_27:
    .word runtime_initializer_value_c_27
.global runtime_initializer_value_a_27
.global runtime_initializer_value_b_27
.global runtime_initializer_value_c_27

.section .note.GNU-stack,"",%progbits
