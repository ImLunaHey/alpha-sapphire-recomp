.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro FUNCTION_BEGIN name
    .section .text.\name,"ax",%progbits
    .balign 4
    .global \name
    .type \name,%function
\name:
.endm

.macro FUNCTION_END name
    .size \name,.-\name
.endm

FUNCTION_BEGIN func_004CD0DC
/* BEGIN_FUNCTION func_004CD0DC */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#240
    add r1,r1,r2,lsl #2
    ldr r0,[r0,r1]
    lsl r0,r0,#26
    lsr r0,r0,#29
    bx lr
/* END_FUNCTION func_004CD0DC */
FUNCTION_END func_004CD0DC

FUNCTION_BEGIN func_004CD674
/* BEGIN_FUNCTION func_004CD674 */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#240
    add r1,r1,r2,lsl #2
    ldr r0,[r0,r1]
    lsl r0,r0,#23
    lsr r0,r0,#29
    bx lr
/* END_FUNCTION func_004CD674 */
FUNCTION_END func_004CD674

FUNCTION_BEGIN func_004CD698
/* BEGIN_FUNCTION func_004CD698 */
    ldr r0,[r0,#120]
    ldrb r0,[r0,r1]
    bx lr
/* END_FUNCTION func_004CD698 */
FUNCTION_END func_004CD698

FUNCTION_BEGIN func_004CD6A4
/* BEGIN_FUNCTION func_004CD6A4 */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#220
    add r1,r1,r2,lsl #2
    ldrb r0,[r0,r1]
    cmp r0,#0
    movne r0,#1
    bx lr
/* END_FUNCTION func_004CD6A4 */
FUNCTION_END func_004CD6A4

FUNCTION_BEGIN func_004CD6C8
/* BEGIN_FUNCTION func_004CD6C8 */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#240
    add r1,r1,r2,lsl #2
    ldr r0,[r0,r1]
    lsl r0,r0,#20
    lsr r0,r0,#29
    bx lr
/* END_FUNCTION func_004CD6C8 */
FUNCTION_END func_004CD6C8

FUNCTION_BEGIN func_004CD7D8
/* BEGIN_FUNCTION func_004CD7D8 */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#240
    add r1,r1,r2,lsl #2
    ldr r0,[r0,r1]
    lsr r0,r0,#28
    bx lr
/* END_FUNCTION func_004CD7D8 */
FUNCTION_END func_004CD7D8

FUNCTION_BEGIN func_004CD7F8
/* BEGIN_FUNCTION func_004CD7F8 */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#223
    add r1,r1,r2,lsl #2
    ldrb r0,[r0,r1]
    bx lr
/* END_FUNCTION func_004CD7F8 */
FUNCTION_END func_004CD7F8

FUNCTION_BEGIN func_004CD814
/* BEGIN_FUNCTION func_004CD814 */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#240
    add r1,r1,r2,lsl #2
    ldr r0,[r0,r1]
    lsl r0,r0,#16
    lsr r0,r0,#28
    bx lr
/* END_FUNCTION func_004CD814 */
FUNCTION_END func_004CD814

FUNCTION_BEGIN func_004CD85C
/* BEGIN_FUNCTION func_004CD85C */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#240
    add r1,r1,r2,lsl #2
    ldr r0,[r0,r1]
    lsl r0,r0,#12
    lsr r0,r0,#28
    bx lr
/* END_FUNCTION func_004CD85C */
FUNCTION_END func_004CD85C

FUNCTION_BEGIN func_004CD880
/* BEGIN_FUNCTION func_004CD880 */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#276
    add r1,r1,r2,lsl #2
    ldrb r0,[r0,r1]
    bx lr
/* END_FUNCTION func_004CD880 */
FUNCTION_END func_004CD880

FUNCTION_BEGIN func_004CD89C
/* BEGIN_FUNCTION func_004CD89C */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#225
    add r1,r1,r2,lsl #2
    ldrb r0,[r0,r1]
    bx lr
/* END_FUNCTION func_004CD89C */
FUNCTION_END func_004CD89C

FUNCTION_BEGIN func_004CD8B8
/* BEGIN_FUNCTION func_004CD8B8 */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#227
    add r1,r1,r2,lsl #2
    ldrb r0,[r0,r1]
    bx lr
/* END_FUNCTION func_004CD8B8 */
FUNCTION_END func_004CD8B8

FUNCTION_BEGIN func_004CD8D4
/* BEGIN_FUNCTION func_004CD8D4 */
    ldr r0,[r0,#128]
    lsl r2,r2,#3
    ldr r0,[r0,r1,lsl #4]
    lsr r0,r0,r2
    ands r0,r0,#255
    movne r0,#1
    bx lr
/* END_FUNCTION func_004CD8D4 */
FUNCTION_END func_004CD8D4

FUNCTION_BEGIN func_004CD8F0
/* BEGIN_FUNCTION func_004CD8F0 */
    rsb r2,r1,r1,lsl #5
    ldr r0,[r0,#108]
    add r2,r2,r2,lsl #1
    mov r1,#226
    add r1,r1,r2,lsl #2
    ldrb r0,[r0,r1]
    bx lr
/* END_FUNCTION func_004CD8F0 */
FUNCTION_END func_004CD8F0

FUNCTION_BEGIN func_004CDC60
/* BEGIN_FUNCTION func_004CDC60 */
    add r1,r1,r1,lsl #4
    ldr r0,[r0,#48]
    add r1,r1,r1,lsl #2
    add r0,r0,r1,lsl #2
    add r1,r2,r2,lsl #1
    add r0,r0,#84
    add r0,r0,r1,lsl #3
    add r1,r0,#164
    ldrd r0,[r1]
    strd r0,[r3]
    bx lr
/* END_FUNCTION func_004CDC60 */
FUNCTION_END func_004CDC60

FUNCTION_BEGIN func_004CDC8C
/* BEGIN_FUNCTION func_004CDC8C */
    add r1,r1,r1,lsl #4
    ldr r0,[r0,#48]
    add r3,r1,r1,lsl #2
    add r1,r2,r2,lsl #1
    add r0,r0,r3,lsl #2
    add r0,r0,r1,lsl #3
    ldrb r0,[r0,#234]
    bx lr
/* END_FUNCTION func_004CDC8C */
FUNCTION_END func_004CDC8C

FUNCTION_BEGIN func_004CDCAC
/* BEGIN_FUNCTION func_004CDCAC */
    ldr r0,[r0,#40]
    add r3,r1,r1,lsl #1
    add r1,r3,r1,lsl #3
    ldr r0,[r0,#52]
    add r0,r0,r1,lsl #2
    add r0,r0,r2,lsl #2
    ldr r0,[r0,#28]
    bx lr
/* END_FUNCTION func_004CDCAC */
FUNCTION_END func_004CDCAC

FUNCTION_BEGIN func_004CFE50
/* BEGIN_FUNCTION func_004CFE50 */
    vldmia r0,{s0-s3}
    add r2,r0,#16
    add r0,r0,#32
    vstmia r1,{s0-s3}
    vldmia r2,{s0-s3}
    add r2,r1,#16
    add r1,r1,#32
    vstmia r2,{s0-s3}
    vldmia r0,{s0-s3}
    vstmia r1,{s0-s3}
    bx lr
/* END_FUNCTION func_004CFE50 */
FUNCTION_END func_004CFE50

FUNCTION_BEGIN func_004CFE7C
/* BEGIN_FUNCTION func_004CFE7C */
    ldr r2,[r1,#12]
    ldr r3,[r1,#28]
    ldr r1,[r1,#44]
    str r1,[r0,#8]
    strd r2,[r0]
    bx lr
/* END_FUNCTION func_004CFE7C */
FUNCTION_END func_004CFE7C

FUNCTION_BEGIN func_004CFFE4
/* BEGIN_FUNCTION func_004CFFE4 */
    vldmia r2!,{s5}
    vldr s1,[r1]
    vldr s0,[r1,#4]
    vldr s2,[r1,#8]
    vadd.f32 s1,s1,s5
    vldmia r2,{s3-s4}
    vadd.f32 s0,s0,s3
    vadd.f32 s2,s2,s4
    vstr s1,[r0]
    vstr s0,[r0,#4]
    vstr s2,[r0,#8]
    bx lr
/* END_FUNCTION func_004CFFE4 */
FUNCTION_END func_004CFFE4

.section .note.GNU-stack,"",%progbits
