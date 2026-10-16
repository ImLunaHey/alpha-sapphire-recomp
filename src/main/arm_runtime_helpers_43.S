.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro BEGIN_FUNCTION name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro END_FUNCTION name
.size \name, .-\name
.endm

BEGIN_FUNCTION func_004EA6F8
    add r0, r0, #256
    ldrh r0, [r0, #82]
    and r0, r0, #1
    bx lr
END_FUNCTION func_004EA6F8

BEGIN_FUNCTION func_004EA794
    add r0, r0, #256
    ldrsb r0, [r0, #120]
    bx lr
END_FUNCTION func_004EA794

BEGIN_FUNCTION func_004EA7A0
    mov r2, r1
    add r1, r0, #80
    mov r0, r2
    b runtime_embedded_payload_transfer_43
END_FUNCTION func_004EA7A0

BEGIN_FUNCTION func_004EA7C4
    add r0, r0, #56
    vldmia r0, {s0-s3}
    vstmia r1, {s0-s3}
    bx lr
END_FUNCTION func_004EA7C4

BEGIN_FUNCTION func_004EA7F8
    ldr r2, [r0, #16]!
    ldr r1, [r0, #4]
    mov r0, r2
    bx lr
END_FUNCTION func_004EA7F8

BEGIN_FUNCTION func_004EA810
    ldr r2, [r0, #24]!
    ldr r1, [r0, #4]
    mov r0, r2
    bx lr
END_FUNCTION func_004EA810

BEGIN_FUNCTION func_004EA820
    add r0, r0, #256
    ldrh r0, [r0, #82]
    and r0, r0, #2
    lsr r0, r0, #1
    bx lr
END_FUNCTION func_004EA820

BEGIN_FUNCTION func_004EA834
    mov r3, r1
    ldr r1, [r0, #8]
    mov r2, #13
    str r1, [r3]
    ldrb r1, [r0, #13]
    strb r1, [r3, #4]
    add r1, r0, #80
    add r0, r3, #6
    b runtime_fixed_13_byte_copy_43
END_FUNCTION func_004EA834

BEGIN_FUNCTION func_004EA858
    cmp r1, #0
    beq 1f
    ldr r2, [r0, #40]
    str r2, [r1]
    ldr r2, [r0, #28]
    ldr r0, [r0, #24]
    str r0, [r1, #8]
    str r2, [r1, #12]
1:
    bx lr
END_FUNCTION func_004EA858

BEGIN_FUNCTION func_004EA87C
    mov r2, r1
    add r1, r0, #106
    mov r0, r2
    b runtime_embedded_payload_transfer_43
END_FUNCTION func_004EA87C

BEGIN_FUNCTION func_004EA89C
    add r1, r1, r1, lsl #4
    add r0, r0, r1, lsl #1
    add r1, r0, #132
    mov r0, r2
    b runtime_embedded_payload_transfer_43
END_FUNCTION func_004EA89C

BEGIN_FUNCTION func_004EA8EC
    ldrb r0, [r0, #54]
    cmp r0, #0
    movne r0, #1
    bx lr
END_FUNCTION func_004EA8EC

BEGIN_FUNCTION func_004EA924
    ldr r0, [r0, #44]
    and r0, r0, #0xff0000
    lsr r0, r0, #16
    bx lr
END_FUNCTION func_004EA924

BEGIN_FUNCTION func_004EA940
    ldrb r0, [r0, #12]
    cmp r0, #24
    cmpne r0, #25
    moveq r0, #1
    movne r0, #0
    bx lr
END_FUNCTION func_004EA940

BEGIN_FUNCTION func_004EA958
    mov r3, r1
    add r1, r0, #8
    mov r2, #368
    mov r0, r3
    push {r4, lr}
    bl runtime_fixed_368_byte_copy_43
    mov r0, #368
    pop {r4, pc}
END_FUNCTION func_004EA958

BEGIN_FUNCTION func_004EA998
    ldr r1, [r0, #4]
    ldrd r0, r1, [r1, #16]
    bx lr
END_FUNCTION func_004EA998

.global runtime_embedded_payload_transfer_43
.type runtime_embedded_payload_transfer_43, %function
.global runtime_fixed_13_byte_copy_43
.type runtime_fixed_13_byte_copy_43, %function
.global runtime_fixed_368_byte_copy_43
.type runtime_fixed_368_byte_copy_43, %function
