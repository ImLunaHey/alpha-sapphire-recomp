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

FUNCTION_BEGIN func_0004FE04
    ldr r0, [r0]
    and r1, r0, #15
    cmp r1, #1
    lsleq r0, r0, #8
    lsreq r0, r0, #16
    movne r0, #0
    bx lr
FUNCTION_END func_0004FE04

FUNCTION_BEGIN func_0004FE20
    tst r0, #1
    movne r0, #1
    lsleq r0, r1, #1
    addne r0, r0, r1, lsl #1
    and r0, r0, #0xFF
    bx lr
FUNCTION_END func_0004FE20

FUNCTION_BEGIN func_000507C8
    add r0, r0, #0x1000
    ldrb r1, [r0, #0x93]
    tst r1, #8
    orreq r1, r1, #8
    strbeq r1, [r0, #0x93]
    movne r0, #0
    moveq r0, #1
    bx lr
FUNCTION_END func_000507C8

FUNCTION_BEGIN func_00050D70
    cmp r0, #31
    cmpne r1, #31
    beq .L50D70_false
    cmp r0, #12
    movhs r0, #1
    movlo r0, #0
    cmp r1, #12
    movhs r1, #1
    movlo r1, #0
    cmp r0, r1
    moveq r0, #1
    beq .L50D70_done
.L50D70_false:
    mov r0, #0
.L50D70_done:
    bx lr
FUNCTION_END func_00050D70

FUNCTION_BEGIN func_00050FE0
    add r2, r0, #0x100
    add r2, r2, #0x66
    lsr r0, r1, #3
    and r1, r1, #7
    ldrb r2, [r2, r0]
    mov r3, #1
    lsl r0, r3, r1
    and r0, r0, #0xFF
    ands r0, r0, r2
    movne r0, #1
    bx lr
FUNCTION_END func_00050FE0

FUNCTION_BEGIN func_00051214
    add r2, r0, #0x100
    add r2, r2, #0x69
    lsr r0, r1, #3
    and r1, r1, #7
    ldrb r2, [r2, r0]
    mov r3, #1
    lsl r0, r3, r1
    and r0, r0, #0xFF
    ands r0, r0, r2
    movne r0, #1
    bx lr
FUNCTION_END func_00051214

FUNCTION_BEGIN func_00051A9C
    ldrh r3, [r0, #2]
    strh r2, [r0]
    and r1, r1, #0x7F
    bic r2, r3, #0x7F
    orr r1, r1, r2
    bic r1, r1, #0x3F80
    strh r1, [r0, #2]
    bx lr
FUNCTION_END func_00051A9C

FUNCTION_BEGIN func_0005CC28
    mov r3, r0
    mov r0, #0
.L5CC28_next:
    add ip, r3, r0
    ldrb ip, [ip, #0x7EC]
    cmp ip, r1
    bne .L5CC28_advance
    cmp r2, #0
    subne r2, r2, #1
    andne r2, r2, #0xFF
    beq .L5CC28_done
.L5CC28_advance:
    add r0, r0, #1
    and r0, r0, #0xFF
    cmp r0, #10
    blo .L5CC28_next
    mov r0, #10
.L5CC28_done:
    bx lr
FUNCTION_END func_0005CC28

FUNCTION_BEGIN func_00064808
    ldr r1, [r0, #4]
    cmp r1, #0
    beq .L64808_primary
    ldrb r2, [r0, #0x1B]
    tst r2, #0x40
    movne r0, r1
    bne .L64808_done
.L64808_primary:
    ldr r0, [r0]
.L64808_done:
    bx lr
FUNCTION_END func_00064808

FUNCTION_BEGIN func_000763A8
    mov ip, #0x70
    mov r3, #0x380
    and r1, ip, r1, lsl #4
    orr r1, r1, #3
    and r2, r3, r2, lsl #7
    orr r1, r1, r2
    str r1, [r0]
    bx lr
FUNCTION_END func_000763A8

FUNCTION_BEGIN func_0007F344
    mov r3, #0x1F8
    mov r2, #0x7E00
    and r1, r3, r1, lsl #3
    orr r1, r1, #4
    and r0, r2, r0, lsl #9
    orr r0, r0, r1
    bx lr
FUNCTION_END func_0007F344

FUNCTION_BEGIN func_000A6AFC
    cmp r0, #7
    moveq r0, #1
    movhi r0, #2
    bhi .LA6AFC_done
    beq .LA6AFC_done
    cmp r0, #0
    movne r0, #3
.LA6AFC_done:
    bx lr
FUNCTION_END func_000A6AFC

FUNCTION_BEGIN func_000A6B68
    mul r0, r0, r1
    lsl r1, r0, #20
    lsr r0, r0, #12
    lsr r1, r1, #20
    cmp r1, #0x800
    addhi r0, r0, #1
    cmp r0, #0
    moveq r0, #1
    bx lr
FUNCTION_END func_000A6B68

FUNCTION_BEGIN func_000A6C78
    mul r0, r0, r1
    lsl r1, r0, #20
    lsr r0, r0, #12
    lsr r1, r1, #20
    cmp r1, #0x800
    addhi r0, r0, #1
    bx lr
FUNCTION_END func_000A6C78

FUNCTION_BEGIN func_000D080C
    rsb r1, r1, r1, lsl #3
    add r0, r0, r1, lsl #3
    ldr r0, [r0, #0x838]
    cmp r0, #0
    moveq r0, #1
    movne r0, #0
    bx lr
FUNCTION_END func_000D080C

FUNCTION_BEGIN func_000D0C40
    rsb r1, r1, r1, lsl #3
    add r0, r0, r1, lsl #3
    ldr r1, [r0, #0x838]
    cmp r1, #0
    addeq r0, r0, #0x800
    ldrheq r0, [r0, #0x4C]
    movne r0, #0
    bx lr
FUNCTION_END func_000D0C40

FUNCTION_BEGIN func_000D1800
    ldr r0, [r0, #0x30]
    tst r0, #7
    beq .LD1800_false
    and r1, r0, #7
    cmp r1, #1
    bne .LD1800_false
    and r0, r0, #0x1F8
    cmp r0, #0x78
    moveq r0, #1
    beq .LD1800_done
.LD1800_false:
    mov r0, #0
.LD1800_done:
    bx lr
FUNCTION_END func_000D1800

FUNCTION_BEGIN func_000D1838
    add r0, r0, #0x100
    ldrh r2, [r0, #0x1C]
    cmp r2, r1
    ldrhne r2, [r0, #0x2A]
    cmpne r2, r1
    beq .LD1838_true
    ldrh r2, [r0, #0x38]
    cmp r2, r1
    ldrhne r0, [r0, #0x46]
    cmpne r0, r1
    movne r0, #0
    bne .LD1838_done
.LD1838_true:
    mov r0, #1
.LD1838_done:
    bx lr
FUNCTION_END func_000D1838

FUNCTION_BEGIN func_000D2E30
    cmp r1, #4
    bhs .LD2E30_invalid
    add r3, r1, r1, lsl #4
    add r1, r3, r1, lsl #5
    ldrb r3, [r0, r1]
    cmp r2, r3
    bhs .LD2E30_invalid
    add r0, r0, r1
    add r0, r0, r2
    ldrb r0, [r0, #0x19]
    bx lr
.LD2E30_invalid:
    mov r0, #31
    bx lr
FUNCTION_END func_000D2E30
