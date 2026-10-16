.syntax unified
.arch armv6k
.thumb

.macro TL01_BEGIN name
.section .text.\name,"ax",%progbits
.balign 2
.global \name
.type \name,%function
.thumb_func
\name:
.endm

.macro TL01_END name
.size \name,.-\name
.endm

TL01_BEGIN func_0030232C
    ldr r0, [r0, #12]
    movs r1, #128
    ands r0, r1
    bx lr
TL01_END func_0030232C

TL01_BEGIN func_00302C50
    ldr r0, [r0]
    cmp r0, #0
    beq.n .Ltl01_00302c50_return
    movs r0, #1
.Ltl01_00302c50_return:
    bx lr
TL01_END func_00302C50

TL01_BEGIN func_0030490A
    str r1, [r0]
    movs r1, #0
    str r1, [r0, #4]
    str r1, [r0, #8]
    bx lr
TL01_END func_0030490A

TL01_BEGIN func_003034C0
    lsrs r0, r0, #8
    beq.n .Ltl01_003034c0_true
    movs r0, #0
    bx lr
.Ltl01_003034c0_true:
    movs r0, #1
    bx lr
TL01_END func_003034C0

TL01_BEGIN func_002FFB94
    subs r0, #48
    cmp r0, #10
    bcs.n .Ltl01_002ffb94_false
    movs r0, #1
    bx lr
.Ltl01_002ffb94_false:
    movs r0, #0
    bx lr
TL01_END func_002FFB94

TL01_BEGIN func_00303304
    ldr r0, [r0, #20]
    lsls r2, r2, #1
    ldrh r0, [r0, r2]
    ands r0, r1
    beq.n .Ltl01_00303304_return
    movs r0, #1
.Ltl01_00303304_return:
    bx lr
TL01_END func_00303304

TL01_BEGIN func_00304766
    ldr r2, [r1]
    str r2, [r0]
    ldr r2, [r1, #8]
    ldr r1, [r1, #4]
    str r2, [r0, #8]
    str r1, [r0, #4]
    bx lr
TL01_END func_00304766

TL01_BEGIN func_002FEDC0
    ldr r3, [r1, #4]
    ldr r2, [r1]
    cmp r2, r3
    bcs.n .Ltl01_002fedc0_return
    adds r3, r2, #2
    str r3, [r1]
    strh r0, [r2]
.Ltl01_002fedc0_return:
    bx lr
TL01_END func_002FEDC0

TL01_BEGIN func_00303934
    ldr r0, [r0]
    ldr r1, [r1]
    cmp r0, r1
    bne.n .Ltl01_00303934_false
    movs r0, #1
    bx lr
.Ltl01_00303934_false:
    movs r0, #0
    bx lr
TL01_END func_00303934

TL01_BEGIN func_00303944
    ldr r0, [r0]
    ldr r1, [r1]
    cmp r0, r1
    bne.n .Ltl01_00303944_false
    movs r0, #1
    bx lr
.Ltl01_00303944_false:
    movs r0, #0
    bx lr
TL01_END func_00303944

TL01_BEGIN func_00304774
    ldr r0, [r0]
    ldr r1, [r1]
    cmp r0, r1
    bne.n .Ltl01_00304774_false
    movs r0, #1
    bx lr
.Ltl01_00304774_false:
    movs r0, #0
    bx lr
TL01_END func_00304774

TL01_BEGIN func_003048BE
    cmp r0, #0
    beq.n .Ltl01_003048be_true
    ldr r0, [r0]
    cmp r0, #0
    beq.n .Ltl01_003048be_true
    movs r0, #0
    bx lr
.Ltl01_003048be_true:
    movs r0, #1
    bx lr
TL01_END func_003048BE

TL01_BEGIN func_00304974
    cmp r1, r0
    beq.n .Ltl01_00304974_return
    ldr r2, [r1]
    str r2, [r0]
    ldr r2, [r1, #8]
    ldr r1, [r1, #4]
    str r2, [r0, #8]
    str r1, [r0, #4]
.Ltl01_00304974_return:
    bx lr
TL01_END func_00304974

TL01_BEGIN func_00304DB4
    ldr r2, [r0, #16]
    movs r3, #2
    cmp r1, #0
    beq.n .Ltl01_00304db4_clear
    orrs r2, r3
    b.n .Ltl01_00304db4_store
.Ltl01_00304db4_clear:
    bics r2, r3
.Ltl01_00304db4_store:
    str r2, [r0, #16]
    bx lr
TL01_END func_00304DB4

TL01_BEGIN func_003055D4
    ldr r2, [r0, #16]
    movs r3, #2
    cmp r1, #0
    beq.n .Ltl01_003055d4_clear
    orrs r2, r3
    b.n .Ltl01_003055d4_store
.Ltl01_003055d4_clear:
    bics r2, r3
.Ltl01_003055d4_store:
    str r2, [r0, #16]
    bx lr
TL01_END func_003055D4

TL01_BEGIN func_00301D1C
    ldr r1, [r0, #12]
    movs r2, #128
    orrs r1, r2
    lsls r2, r2, #14
    bics r1, r2
    str r1, [r0, #12]
    movs r1, #0
    str r1, [r0, #8]
    str r1, [r0]
    bx lr
TL01_END func_00301D1C

TL01_BEGIN func_002FF972
    ldr r1, [r1]
    lsls r2, r1, #21
    bpl.n .Ltl01_002ff972_second
    lsls r0, r0, #24
    lsrs r0, r0, #24
.Ltl01_002ff972_first_return:
    bx lr
.Ltl01_002ff972_second:
    lsls r1, r1, #23
    bpl.n .Ltl01_002ff972_first_return
    lsls r0, r0, #16
    lsrs r0, r0, #16
.Ltl01_002ff972_return:
    bx lr
TL01_END func_002FF972

TL01_BEGIN func_00304DEE
    ldr r1, [r0, #4]
    lsls r1, r1, #29
    lsrs r1, r1, #31
    beq.n .Ltl01_00304dee_zero
    ldr r1, [r0, #24]
    cmp r1, #0
    beq.n .Ltl01_00304dee_zero
    ldr r0, [r0, #20]
    subs r0, r1, r0
    bx lr
.Ltl01_00304dee_zero:
    movs r0, #0
    bx lr
TL01_END func_00304DEE

TL01_BEGIN func_0030560E
    ldr r1, [r0, #4]
    lsls r1, r1, #29
    lsrs r1, r1, #31
    beq.n .Ltl01_0030560e_zero
    ldr r1, [r0, #24]
    cmp r1, #0
    beq.n .Ltl01_0030560e_zero
    ldr r0, [r0, #20]
    subs r0, r1, r0
    asrs r0, r0, #1
    bx lr
.Ltl01_0030560e_zero:
    movs r0, #0
    bx lr
TL01_END func_0030560E

TL01_BEGIN func_002FEDD0
    cmp r0, #58
    bcs.n .Ltl01_002fedd0_letter
    subs r0, #48
.Ltl01_002fedd0_letter:
    movs r3, #32
    movs r2, r0
    bics r2, r3
    cmp r2, #65
    bcc.n .Ltl01_002fedd0_check
    movs r0, r2
    subs r0, #55
.Ltl01_002fedd0_check:
    cmp r0, r1
    bcc.n .Ltl01_002fedd0_return
    movs r0, #0
    mvns r0, r0
.Ltl01_002fedd0_return:
    bx lr
TL01_END func_002FEDD0

TL01_BEGIN func_0030242A
    ldr r1, [r0, #12]
    movs r2, #64
    orrs r1, r2
    lsls r2, r2, #6
    bics r1, r2
    movs r2, #0
    str r2, [r0]
    str r1, [r0, #12]
    lsls r1, r1, #21
    lsrs r1, r1, #30
    beq.n .Ltl01_0030242a_compute
    str r2, [r0, #8]
    bx lr
.Ltl01_0030242a_compute:
    ldr r2, [r0, #16]
    ldr r1, [r0, #4]
    subs r1, r1, r2
    ldr r2, [r0, #28]
    subs r1, r1, r2
    str r1, [r0, #8]
    bx lr
TL01_END func_0030242A

TL01_BEGIN func_00304D7E
    push {r0, r1}
    ldr r1, [r0, #4]
    lsls r1, r1, #28
    lsrs r2, r1, #31
    mov r1, sp
    ldrb r1, [r1, #4]
    beq.n .Ltl01_00304d7e_tail
    ldr r3, [r0, #40]
    ldr r2, [r0, #36]
    subs r3, r3, r2
    beq.n .Ltl01_00304d7e_tail
    adds r3, r2, #1
    str r3, [r0, #36]
    strb r1, [r2]
    movs r0, r1
    add sp, #8
    bx lr
.Ltl01_00304d7e_tail:
    ldr r2, [r0]
    ldr r2, [r2, #40]
    add sp, #8
    bx r2
TL01_END func_00304D7E

TL01_BEGIN func_003055A8
    push {r0, r1}
    ldr r1, [r0, #4]
    lsls r1, r1, #28
    lsrs r2, r1, #31
    mov r1, sp
    ldrh r1, [r1, #4]
    beq.n .Ltl01_003055a8_tail
    ldr r3, [r0, #40]
    ldr r2, [r0, #36]
    subs r3, r3, r2
    asrs r3, r3, #1
    beq.n .Ltl01_003055a8_tail
    adds r3, r2, #2
    str r3, [r0, #36]
    strh r1, [r2]
    movs r0, r1
    add sp, #8
    bx lr
.Ltl01_003055a8_tail:
    ldr r2, [r0]
    ldr r2, [r2, #40]
    add sp, #8
    bx r2
TL01_END func_003055A8

TL01_BEGIN func_0010420C
    ldr r0, [pc, #0]
    bx lr
TL01_END func_0010420C
