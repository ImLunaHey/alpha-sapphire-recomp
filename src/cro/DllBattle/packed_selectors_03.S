.syntax unified
.arch armv6k
.arm

.macro FUNCTION_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro FUNCTION_END name
.size \name, . - \name
.endm

FUNCTION_BEGIN func_00050908
    add r0, r0, #0x100
    ldrsb r1, [r0, #4]
    cmp r1, #6
    ldrsbge r1, [r0, #5]
    cmpge r1, #6
    blt .L50908_true
    ldrsb r1, [r0, #6]
    cmp r1, #6
    ldrsbge r1, [r0, #7]
    cmpge r1, #6
    blt .L50908_true
    ldrsb r1, [r0, #8]
    cmp r1, #6
    ldrsbge r1, [r0, #9]
    cmpge r1, #6
    blt .L50908_true
    ldrsb r0, [r0, #10]
    cmp r0, #6
    movge r0, #0
    bge .L50908_done
.L50908_true:
    mov r0, #1
.L50908_done:
    bx lr
FUNCTION_END func_00050908

FUNCTION_BEGIN func_000509EC
    cmp r1, #0
    beq .L509EC_default
    add r0, r0, #0x100
    ldrh r2, [r0, #0x1C]
    cmp r2, r1
    moveq r0, #0
    beq .L509EC_done
    ldrh r2, [r0, #0x2A]
    cmp r2, r1
    moveq r0, #1
    beq .L509EC_done
    ldrh r2, [r0, #0x38]
    cmp r2, r1
    moveq r0, #2
    beq .L509EC_done
    ldrh r0, [r0, #0x46]
    cmp r0, r1
    moveq r0, #3
    beq .L509EC_done
.L509EC_default:
    mov r0, #4
.L509EC_done:
    bx lr
FUNCTION_END func_000509EC

FUNCTION_BEGIN func_00051A64
    ldrh r2, [r0, #2]
    mov r3, #8
    lsl ip, r2, #18
    cmp r3, ip, lsr #25
    bls .L51A64_done
    mov ip, #0x02000000
    mov r3, #0x1FC
    add ip, ip, r2, ror #14
    and r2, r3, r2, lsr #5
    ror r3, ip, #18
    add r2, r2, r0
    strh r3, [r0, #2]
    str r1, [r2, #4]
.L51A64_done:
    bx lr
FUNCTION_END func_00051A64

FUNCTION_BEGIN func_00051B38
    cmp r0, #0
    beq .L51B38_false
    ldrb r1, [r0, #0x10]
    ldrb r2, [r0, #0x3A]
    ldr r0, [r0, #4]
    cmp r0, #0
    beq .L51B38_false
.L51B38_loop:
    ldrb r3, [r0, #0x10]
    cmp r3, r1
    ldrbeq r3, [r0, #0x3A]
    cmpeq r3, r2
    bne .L51B38_advance
    ldr r3, [r0, #0x18]
    tst r3, #0x08000000
    beq .L51B38_done
.L51B38_advance:
    ldr r0, [r0, #4]
    cmp r0, #0
    bne .L51B38_loop
.L51B38_false:
    mov r0, #0
.L51B38_done:
    bx lr
FUNCTION_END func_00051B38

FUNCTION_BEGIN func_0006731C
    mov r2, r0
    mov r0, r1
    ldr r2, [r2, #0x210]
    cmp r2, #0
    beq .L6731C_first_done
    cmp r0, #9
    beq .L6731C_from_nine
    cmp r0, #11
    bne .L6731C_first_done
    ldr r1, [r2, #0x28C]
    cmp r1, #0
    movne r0, #9
.L6731C_first_done:
    bx lr
.L6731C_from_nine:
    ldr r1, [r2, #0x28C]
    cmp r1, #0
    movne r0, #11
.L6731C_done:
    bx lr
FUNCTION_END func_0006731C

FUNCTION_BEGIN func_0007347C
    ldr r1, [r0, #0x20]
    tst r1, #7
    movne r0, #1
    bne .L7347C_done
    ldr r1, [r0, #0x24]
    tst r1, #7
    movne r0, #2
    bne .L7347C_done
    ldr r1, [r0, #0x28]
    tst r1, #7
    movne r0, #3
    bne .L7347C_done
    ldr r1, [r0, #0x2C]
    tst r1, #7
    movne r0, #4
    bne .L7347C_done
    ldr r0, [r0, #0x30]
    ands r0, r0, #7
    movne r0, #5
.L7347C_done:
    bx lr
FUNCTION_END func_0007347C

FUNCTION_BEGIN func_00076264
    cmp r1, #4
    movlo r2, #0
    bhs .L76264_false
.L76264_loop:
    add r3, r0, r2
    ldrb ip, [r3, #0x7EC]
    cmp ip, r1
    ldrbne r3, [r3, #0x7ED]
    cmpne r3, r1
    bne .L76264_next
    mov r0, #1
    bx lr
.L76264_next:
    add r2, r2, #2
    cmp r2, #10
    blo .L76264_loop
.L76264_false:
    mov r0, #0
    bx lr
FUNCTION_END func_00076264

FUNCTION_BEGIN func_000772E8
    and r1, r0, #7
    mov r2, r0
    lsl r0, r0, #7
    cmp r1, #1
    cmpne r1, #3
    lsr r0, r0, #16
    beq .L772E8_done
    cmp r1, #4
    lsleq r0, r2, #1
    lsreq r0, r0, #16
    beq .L772E8_done
    cmp r1, #2
    movne r0, #0
.L772E8_done:
    bx lr
FUNCTION_END func_000772E8

FUNCTION_BEGIN func_00079628
    mov ip, #0xF0
    and r2, ip, r2, lsl #4
    orr r2, r2, #1
    orr r1, r2, r1, lsl #8
    cmp r3, #0
    str r1, [r0]
    orrne r1, r1, #0x10000000
    biceq r1, r1, #0x10000000
    str r1, [r0]
    bx lr
FUNCTION_END func_00079628

FUNCTION_BEGIN func_00079FC8
    ldrb r2, [r0, #3]
    mov r3, #8
    cmp r3, r2, lsr #4
    bls .L79FC8_done
    lsr r3, r2, #4
    bic r2, r2, #0xF0
    lsl ip, r3, #4
    add ip, ip, #0x10
    and ip, ip, #0xF0
    add r3, r0, r3, lsl #2
    orr r2, r2, ip
    strb r2, [r0, #3]
    str r1, [r3, #4]
.L79FC8_done:
    bx lr
FUNCTION_END func_00079FC8

FUNCTION_BEGIN func_0007C788
    ldrh r2, [r0, #2]
    mov r3, #8
    lsl ip, r2, #18
    cmp r3, ip, lsr #25
    bls .L7C788_done
    orr r2, r2, #0x4000
    str r1, [r0, #0x20]
    strh r2, [r0, #2]
.L7C788_done:
    bx lr
FUNCTION_END func_0007C788

FUNCTION_BEGIN func_0007C808
    ldr r2, [r0]
    and r3, r2, #7
    cmp r3, #1
    cmpne r3, #3
    beq .L7C808_shared
    cmp r3, #4
    biceq r2, r2, #0x80000000
    orreq r1, r2, r1, lsl #31
    beq .L7C808_store
    cmp r3, #2
    biceq r2, r2, #0x02000000
    orreq r1, r2, r1, lsl #25
    bne .L7C808_return
.L7C808_store:
    str r1, [r0]
.L7C808_return:
    bx lr
.L7C808_shared:
    bic r2, r2, #0x02000000
    orr r1, r2, r1, lsl #25
    str r1, [r0]
    bx lr
FUNCTION_END func_0007C808

FUNCTION_BEGIN func_0007FE38
    and r1, r0, #7
    cmp r1, #1
    bne .L7FE38_false
    and r0, r0, #0x1F8
    cmp r0, #0x78
    moveq r0, #1
    beq .L7FE38_done
.L7FE38_false:
    mov r0, #0
.L7FE38_done:
    bx lr
FUNCTION_END func_0007FE38
