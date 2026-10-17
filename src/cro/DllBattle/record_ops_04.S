.syntax unified
.arch armv6k
.fpu vfp
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

FUNCTION_BEGIN func_0001E234
    add r0, r0, #0x1000
    ldr r1, [r0, #0x84]
    adds r1, r1, #1
    str r1, [r0, #0x84]
    moveq r1, #1
    streq r1, [r0, #0x84]
    mov r0, r1
    bx lr
FUNCTION_END func_0001E234

FUNCTION_BEGIN func_0004FD4C
    add r0, r0, #0x1000
    add r0, r0, #0x244
    ldr r2, [r0]
    cmp r2, #0
    ldrne r3, [r0, #4]
    cmpne r3, r1
    addls r0, r0, #8
    addhi r0, r2, r1
    ldrb r0, [r0]
    bx lr
FUNCTION_END func_0004FD4C

FUNCTION_BEGIN func_000599A4
    push {r4, r5, r6}
    add r4, r0, #8
    ldr ip, [r0, #8]
    cmp ip, r4
    beq .L599A4_none
.L599A4_loop:
    ldr r6, [ip, #-28]
    sub r4, ip, #28
    ldr ip, [ip]
    cmp r6, r1
    ldreq r6, [r4, #4]
    cmpeq r6, r2
    bne .L599A4_next
    cmp r3, #0
    ldrne r0, [r4, #12]
    strne r0, [r3]
    ldr r0, [r4, #24]
    pop {r4, r5, r6}
    bx lr
.L599A4_next:
    add r4, r0, #8
    cmp ip, r4
    bne .L599A4_loop
.L599A4_none:
    pop {r4, r5, r6}
    mov r0, #0
    bx lr
FUNCTION_END func_000599A4

FUNCTION_BEGIN func_0005DAD4
    push {r4, r5, r6}
    add r4, r0, #8
    ldr ip, [r0, #8]
    cmp ip, r4
    beq .L5DAD4_none
.L5DAD4_loop:
    ldr r6, [ip, #-28]
    sub r4, ip, #28
    ldr ip, [ip]
    cmp r6, r1
    ldreq r6, [r4, #4]
    cmpeq r6, r2
    bne .L5DAD4_next
    cmp r3, #0
    ldrne r0, [r4, #12]
    strne r0, [r3]
    ldr r0, [r4, #16]
    pop {r4, r5, r6}
    bx lr
.L5DAD4_next:
    add r4, r0, #8
    cmp ip, r4
    bne .L5DAD4_loop
.L5DAD4_none:
    pop {r4, r5, r6}
    mov r0, #0
    bx lr
FUNCTION_END func_0005DAD4

FUNCTION_BEGIN func_0005DE8C
    mov r2, #0
    mov ip, r2
    mov r3, #1
    push {r4}
.L5DE8C_loop:
    add r1, r0, r2, lsl #2
    ldr r1, [r1, #0x8E4]
    cmp r1, #0
    beq .L5DE8C_next
    ldrb r4, [r1, #0x10]
    strb r3, [r1, #0x35]
    cmp r4, #0
    strbne ip, [r1, #0x10]
    strbne r3, [r1, #0x44]
.L5DE8C_next:
    add r2, r2, #1
    cmp r2, #6
    blt .L5DE8C_loop
    pop {r4}
    bx lr
FUNCTION_END func_0005DE8C

FUNCTION_BEGIN func_0005F23C
    add r2, r0, r2, lsl #2
    add r1, r0, r1, lsl #2
    ldr r3, [r2, #0x100]
    ldr r0, [r1, #0x100]
    str r3, [r1, #0x100]
    str r0, [r2, #0x100]
    ldr r1, [r1, #0x100]
    ldr r3, [r0, #0xBC]
    ldr r0, [r1, #0xBC]
    str r3, [r1, #0xBC]
    ldr r1, [r2, #0x100]
    str r0, [r1, #0xBC]
    bx lr
FUNCTION_END func_0005F23C

FUNCTION_BEGIN func_00062F40
    add r3, r3, r3, lsl #1
    cmp r1, #0
    add r0, r0, r3, lsl #2
    beq .L62F40_second
    add r3, r0, #0x208
    vldmia r3, {s0-s2}
    vstmia r1, {s0-s2}
.L62F40_second:
    cmp r2, #0
    beq .L62F40_done
    add r1, r0, #0x238
    ldr r0, [r0, #0x240]
    ldm r1, {r1, r3}
    str r0, [r2, #8]
    stm r2, {r1, r3}
.L62F40_done:
    bx lr
FUNCTION_END func_00062F40

FUNCTION_BEGIN func_0006F094
    mov r2, #0
    mov r3, #10
    mov r1, r2
    push {r4}
.L6F094_loop:
    add ip, r0, r2, lsl #1
    str r1, [r0, r2, lsl #2]
    add r4, r0, r2
    strh r1, [ip, #40]
    strh r1, [ip, #60]
    strb r1, [r4, #80]
    subs r3, r3, #1
    add r2, r2, #1
    strh r1, [ip, #90]
    bne .L6F094_loop
    strb r1, [r0, #110]
    strb r1, [r0, #111]
    strb r1, [r0, #112]
    strb r1, [r0, #113]
    pop {r4}
    bx lr
FUNCTION_END func_0006F094

FUNCTION_BEGIN func_00070AB0
    mov r1, r0
    ldr r0, [r0]
    lsr r2, r0, #10
    lsl r2, r2, #10
    lsl r3, r2, #13
    bic r2, r2, #0x0C000000
    lsr r3, r3, #23
    bic r2, r2, #0x03F80000
    orr r2, r2, r3, lsl #19
    bic r2, r2, #0x70000000
    str r2, [r1]
    bx lr
FUNCTION_END func_00070AB0

FUNCTION_BEGIN func_00075C14
    add r2, r0, r1, lsl #2
    mov r3, #0
    push {r4}
    str r3, [r2, #12]
    str r3, [r2, #56]
    str r3, [r2, #100]
    add ip, r1, r1, lsl #2
    str r3, [r2, #584]
    str r3, [r2, #628]
    mov r2, r3
    mov r1, #31
    add r0, r0, ip, lsl #3
.L75C14_loop:
    add ip, r0, r3, lsl #2
    add r3, r3, #1
    add r2, r2, #2
    add r4, r0, r3, lsl #2
    str r1, [ip, #144]
    cmp r2, #10
    add r3, r3, #1
    str r1, [r4, #144]
    blo .L75C14_loop
    pop {r4}
    bx lr
FUNCTION_END func_00075C14

FUNCTION_BEGIN func_00075C70
    cmp r1, #6
    mov r2, #0
    movlo r1, #1
    bhs .L75C70_one
.L75C70_loop:
    add r3, r0, r1, lsl #2
    str r2, [r3, #28]
    add r3, r0, r1
    strb r2, [r3, #180]
    uxth r3, r1
    cmp r3, #2
    streq r2, [r0, #64]
    add r1, r1, #1
    strbeq r2, [r0, #189]
    cmp r1, #6
    blo .L75C70_loop
    bx lr
.L75C70_one:
    add r3, r0, r1, lsl #2
    add r0, r0, r1
    str r2, [r3, #28]
    strb r2, [r0, #180]
    bx lr
FUNCTION_END func_00075C70

FUNCTION_BEGIN func_0007A000
    push {r4}
    ldrb r4, [r0, #3]
    mov r3, #0
    strh r2, [r0]
    str r3, [r0, #4]
    str r3, [r0, #8]
    str r3, [r0, #12]
    str r3, [r0, #16]
    str r3, [r0, #20]
    and ip, r1, #15
    str r3, [r0, #24]
    bic r1, r4, #0xFF
    str r3, [r0, #28]
    orr r1, r1, ip
    str r3, [r0, #32]
    strb r1, [r0, #3]
    strb r3, [r0, #2]
    pop {r4}
    bx lr
FUNCTION_END func_0007A000

FUNCTION_BEGIN func_000AAF60
    push {r4, lr}
    add r4, r0, #0x3DC
    ldr r0, [r0, #0x4B8]
    cmp r0, #0
    ldrsbeq r0, [r4, #0xC8]
    beq .LAAF60_done
    ldrb r1, [r4, #0xE0]
    mov r0, #1
    cmp r0, #0
    ldrsbne r0, [r4, #0xC8]
    movne r1, #0
    moveq r0, #1
    strne r1, [r4, #0xDC]
.LAAF60_done:
    pop {r4, pc}
FUNCTION_END func_000AAF60
