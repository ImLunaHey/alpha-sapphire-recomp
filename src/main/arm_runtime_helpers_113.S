.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00509050, "ax", %progbits
.balign 4
.global func_00509050
.type func_00509050, %function
func_00509050:
    ldr r0, .L113_func_00509050_172
    mov r3, #0
    ldr r0, [r0, #8]
    cmp r0, #0
    beq .L113_func_00509050_140
.L113_func_00509050_20:
    ldr r1, [r0, #20]
    cmp r1, #0
    ldrne r2, [r1, #16]
    cmpne r2, r0
    beq .L113_func_00509050_48
    mov r0, #1
    bx lr
.L113_func_00509050_48:
    ldr r2, [r0]
    tst r2, #15
    beq .L113_func_00509050_68
    mov r0, #2
    bx lr
.L113_func_00509050_68:
    add ip, r0, #16
    cmp r2, ip
    beq .L113_func_00509050_88
    mov r0, #3
    bx lr
.L113_func_00509050_88:
    ldr r0, [r0, #4]
    tst r0, #15
    beq .L113_func_00509050_108
    mov r0, #4
    bx lr
.L113_func_00509050_108:
    cmp r0, #8
    bcs .L113_func_00509050_124
    mov r0, #5
    bx lr
.L113_func_00509050_124:
    add r2, r3, r0
    movs r0, r1
    add r3, r2, #16
    bne .L113_func_00509050_20
.L113_func_00509050_140:
    ldr r0, .L113_func_00509050_176
    ldr r1, [r0, #12]
    ldr r0, [r0, #20]
    add r1, r1, r3
    cmp r0, r1
    movne r0, #6
    moveq r0, #0
    bx lr
.L113_func_00509050_body_end:
.L113_func_00509050_172:
    .word runtime_chain_root_113
.L113_func_00509050_176:
    .word runtime_chain_totals_113
.size func_00509050, .L113_func_00509050_body_end - func_00509050

.section .text.func_0050B290, "ax", %progbits
.balign 4
.global func_0050B290
.type func_0050B290, %function
func_0050B290:
    add r1, r0, r0, lsl #1
    ldr r0, .L113_func_0050B290_52
    ldr r0, [r0]
    add r1, r0, r1, lsl #3
    ldrb r2, [r1, #1133]
    cmp r2, #0
    beq .L113_func_0050B290_48
    mov r2, #0
    strb r2, [r1, #1133]
    ldr r1, [r0]
    orr r1, r1, #64
    str r1, [r0]
.L113_func_0050B290_48:
    bx lr
.L113_func_0050B290_body_end:
.L113_func_0050B290_52:
    .word duplicate_template_25_mutable_state_a
.size func_0050B290, .L113_func_0050B290_body_end - func_0050B290

.section .text.func_0050BCBC, "ax", %progbits
.balign 4
.global func_0050BCBC
.type func_0050BCBC, %function
func_0050BCBC:
    add r1, r0, r0, lsl #1
    ldr r0, .L113_func_0050BCBC_52
    ldr r0, [r0]
    add r1, r0, r1, lsl #3
    ldrb r2, [r1, #1133]
    cmp r2, #0
    bne .L113_func_0050BCBC_48
    mov r2, #1
    strb r2, [r1, #1133]
    ldr r1, [r0]
    orr r1, r1, #64
    str r1, [r0]
.L113_func_0050BCBC_48:
    bx lr
.L113_func_0050BCBC_body_end:
.L113_func_0050BCBC_52:
    .word duplicate_template_25_mutable_state_a
.size func_0050BCBC, .L113_func_0050BCBC_body_end - func_0050BCBC

.section .text.func_0050BCF4, "ax", %progbits
.balign 4
.global func_0050BCF4
.type func_0050BCF4, %function
func_0050BCF4:
    ldr r2, .L113_func_0050BCF4_88
    ldr ip, .L113_func_0050BCF4_92
    push {r4, r5}
    mov r3, #1
    ldr r1, [r2]
    ldr r0, [ip]
    cmp r1, r0
    bcs .L113_func_0050BCF4_48
    ldr r4, .L113_func_0050BCF4_96
    add r5, r1, #8
    stm r1, {r3, r4}
    str r5, [r2]
.L113_func_0050BCF4_48:
    ldr r0, [ip]
    ldr r1, [r2]
    cmp r1, r0
    bcs .L113_func_0050BCF4_80
    ldr ip, .L113_func_0050BCF4_100
    add r4, r1, #8
    stm r1, {r3, ip}
    str r4, [r2]
.L113_func_0050BCF4_80:
    pop {r4, r5}
    bx lr
.L113_func_0050BCF4_body_end:
.L113_func_0050BCF4_88:
    .word global_load_26
.L113_func_0050BCF4_92:
    .word runtime_command_limit_113
.L113_func_0050BCF4_96:
    .word runtime_command_marker_113_a
.L113_func_0050BCF4_100:
    .word runtime_command_marker_113_b
.size func_0050BCF4, .L113_func_0050BCF4_body_end - func_0050BCF4

.section .text.func_0050D5DC, "ax", %progbits
.balign 4
.global func_0050D5DC
.type func_0050D5DC, %function
func_0050D5DC:
    ldr r3, .L113_func_0050D5DC_124
    push {r4, r5}
    ldr r1, .L113_func_0050D5DC_128
    ldr ip, [r3, #156]
    ldr r0, [r1]
    ldr r2, [ip, #4]
    sub r2, r0, r2
    tst r2, #8
    str r2, [ip, #12]
    beq .L113_func_0050D5DC_80
    ldr r2, .L113_func_0050D5DC_132
    ldr r2, [r2]
    cmp r2, r0
    bls .L113_func_0050D5DC_80
    ldr r4, .L113_func_0050D5DC_136
    mov ip, #0
    add r5, r0, #8
    str r4, [r0, #4]
    str ip, [r0]
    str r5, [r1]
.L113_func_0050D5DC_80:
    mov r0, #1
    strb r0, [r3, #19]
    ldr r0, [r3, #156]
    ldr r1, [r1]
    ldr r2, [r0, #4]
    sub r1, r1, r2
    str r1, [r3, #360]
    ldr r0, [r0, #32]
    str r0, [r3, #364]
    pop {r4, r5}
    bx lr
.L113_func_0050D5DC_body_end:
.L113_func_0050D5DC_124:
    .word runtime_global_context_root_99
.L113_func_0050D5DC_128:
    .word global_load_26
.L113_func_0050D5DC_132:
    .word runtime_command_limit_113
.L113_func_0050D5DC_136:
    .word runtime_command_marker_113_c
.size func_0050D5DC, .L113_func_0050D5DC_body_end - func_0050D5DC

.section .text.func_0050D668, "ax", %progbits
.balign 4
.global func_0050D668
.type func_0050D668, %function
func_0050D668:
    push {r4, r5, r6, r7, r8, r9}
    mov r7, #0
    ldr ip, .L113_func_0050D668_152
    ldr r4, .L113_func_0050D668_156
    strb r7, [ip, #19]
    ldr r6, [ip, #156]
    ldr r5, [r4]
    ldr r8, [r6, #4]
    sub r8, r5, r8
    tst r8, #8
    str r8, [r6, #12]
    beq .L113_func_0050D668_80
    ldr r6, .L113_func_0050D668_160
    ldr r6, [r6]
    cmp r6, r5
    bls .L113_func_0050D668_80
    ldr r8, .L113_func_0050D668_164
    add r9, r5, #8
    stm r5, {r7, r8}
    str r9, [r4]
.L113_func_0050D668_80:
    ldr r5, [ip, #360]
    str r5, [r0]
    ldr r0, [ip, #156]
    ldr r4, [r4]
    ldr r5, [ip, #360]
    ldr r0, [r0, #4]
    sub r0, r4, r0
    sub r0, r0, r5
    str r0, [r1]
    ldr r0, [ip, #364]
    str r0, [r2]
    ldr r0, [ip, #156]!
    ldr r1, [ip, #208]
    ldr r0, [r0, #32]
    sub r0, r0, r1
    str r0, [r3]
    pop {r4, r5, r6, r7, r8, r9}
    bx lr
.L113_func_0050D668_body_end:
.L113_func_0050D668_152:
    .word runtime_global_context_root_99
.L113_func_0050D668_156:
    .word global_load_26
.L113_func_0050D668_160:
    .word runtime_command_limit_113
.L113_func_0050D668_164:
    .word runtime_command_marker_113_c
.size func_0050D668, .L113_func_0050D668_body_end - func_0050D668

.section .text.func_0051BDE8, "ax", %progbits
.balign 4
.global func_0051BDE8
.type func_0051BDE8, %function
func_0051BDE8:
    sub r1, r0, #9984
    sub r1, r1, #17
    cmp r1, #41
    mov r1, #0
    bhi .L113_func_0051BDE8_40
    ldr r1, .L113_func_0051BDE8_56
    add r0, r1, r0, lsl #2
    sub r0, r0, #40960
    ldr r1, [r0, #956]
    b .L113_func_0051BDE8_48
.L113_func_0051BDE8_40:
    cmp r0, #0
    ldrne r1, .L113_func_0051BDE8_60
.L113_func_0051BDE8_48:
    mov r0, r1
    bx lr
.L113_func_0051BDE8_body_end:
.L113_func_0051BDE8_56:
    .word runtime_indexed_result_table_113
.L113_func_0051BDE8_60:
    .word duplicate52_shared_result_identity
.size func_0051BDE8, .L113_func_0051BDE8_body_end - func_0051BDE8

.section .text.func_0051F8C8, "ax", %progbits
.balign 4
.global func_0051F8C8
.type func_0051F8C8, %function
func_0051F8C8:
    push {r4, r5, r6, r7, r8}
    add r0, r0, #8
    cmp r1, #0
    ldm r0, {r5, r6, ip}
    ldr r0, .L113_func_0051F8C8_172
    beq .L113_func_0051F8C8_132
    ldr r4, [r1, #4]
    mov r3, #0
    cmn r4, #1
    beq .L113_func_0051F8C8_132
    and r4, ip, #1
    sub r4, r4, #1
    and r7, r4, ip
.L113_func_0051F8C8_52:
    add r4, r3, r3, lsl #2
    ldr r8, [r1, r4, lsl #2]
    cmp r8, r5
    bne .L113_func_0051F8C8_140
    add r4, r1, r4, lsl #2
    ldr r8, [r4, #4]
    cmp r8, r6
    bne .L113_func_0051F8C8_140
    ldr r4, [r4, #8]
    cmp r7, #0
    beq .L113_func_0051F8C8_108
    bics r4, ip, r4
    bne .L113_func_0051F8C8_140
    b .L113_func_0051F8C8_116
.L113_func_0051F8C8_108:
    cmp r4, ip
    bne .L113_func_0051F8C8_140
.L113_func_0051F8C8_116:
    add r3, r3, r3, lsl #2
    mov r0, #0
    add r1, r1, r3, lsl #2
    str r1, [r2]
.L113_func_0051F8C8_132:
    pop {r4, r5, r6, r7, r8}
    bx lr
.L113_func_0051F8C8_140:
    add r3, r3, #1
    add r4, r3, r3, lsl #2
    add r4, r1, r4, lsl #2
    ldr r4, [r4, #4]
    cmn r4, #1
    bne .L113_func_0051F8C8_52
    pop {r4, r5, r6, r7, r8}
    bx lr
.L113_func_0051F8C8_body_end:
.L113_func_0051F8C8_172:
    .word runtime_lookup_miss_113
.size func_0051F8C8, .L113_func_0051F8C8_body_end - func_0051F8C8

.section .note.GNU-stack, "", %progbits
