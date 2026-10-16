.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro function name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro endfunction name
.size \name,.-\name
.endm

function func_00398958
/* BEGIN_FUNCTION func_00398958 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
strb r2,[r0,#222]
ldr r1,[r0,#216]
orr r1,r1,#1
str r1,[r0,#216]
bx lr
/* END_FUNCTION func_00398958 */
endfunction func_00398958

function func_00398D9C
/* BEGIN_FUNCTION func_00398D9C */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
strb r2,[r0,#221]
ldr r1,[r0,#216]
orr r1,r1,#1
str r1,[r0,#216]
bx lr
/* END_FUNCTION func_00398D9C */
endfunction func_00398D9C

function func_00398E30
/* BEGIN_FUNCTION func_00398E30 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
strb r2,[r0,#223]
ldr r1,[r0,#216]
orr r1,r1,#1
str r1,[r0,#216]
bx lr
/* END_FUNCTION func_00398E30 */
endfunction func_00398E30

function func_00399520
/* BEGIN_FUNCTION func_00399520 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r2,r0,r1,lsl #2
strb r3,[r2,#6]
ldr r2,[r0,r1,lsl #2]
orr r2,r2,#4
str r2,[r0,r1,lsl #2]
bx lr
/* END_FUNCTION func_00399520 */
endfunction func_00399520

function func_00399588
/* BEGIN_FUNCTION func_00399588 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
strb r2,[r0,#276]
ldr r1,[r0,#272]
orr r1,r1,#1
str r1,[r0,#272]
bx lr
/* END_FUNCTION func_00399588 */
endfunction func_00399588

function func_003995AC
/* BEGIN_FUNCTION func_003995AC */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
strb r2,[r0,#225]
ldr r1,[r0,#216]
orr r1,r1,#2
str r1,[r0,#216]
bx lr
/* END_FUNCTION func_003995AC */
endfunction func_003995AC

function func_003995D0
/* BEGIN_FUNCTION func_003995D0 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
strb r2,[r0,#227]
ldr r1,[r0,#216]
orr r1,r1,#2
str r1,[r0,#216]
bx lr
/* END_FUNCTION func_003995D0 */
endfunction func_003995D0

function func_003995F4
/* BEGIN_FUNCTION func_003995F4 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
ldr r12,[sp]
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r0,r0,r1,lsl #2
add r0,r0,r3,lsl #3
strb r12,[r0,#14]
ldr r1,[r0,#8]
orr r1,r1,#4
str r1,[r0,#8]
bx lr
/* END_FUNCTION func_003995F4 */
endfunction func_003995F4

function func_00399628
/* BEGIN_FUNCTION func_00399628 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r2,r2,r2,lsl #3
mov r3,#4
add r0,r0,r1,lsl #2
add r1,r3,r2,lsl #2
ldrb r0,[r0,r1]
bx lr
/* END_FUNCTION func_00399628 */
endfunction func_00399628

function func_0039964C
/* BEGIN_FUNCTION func_0039964C */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r2,r2,r2,lsl #3
mov r3,#7
add r0,r0,r1,lsl #2
add r1,r3,r2,lsl #2
ldrb r0,[r0,r1]
bx lr
/* END_FUNCTION func_0039964C */
endfunction func_0039964C

function func_00399670
/* BEGIN_FUNCTION func_00399670 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
strb r2,[r0,#226]
ldr r1,[r0,#216]
orr r1,r1,#2
str r1,[r0,#216]
bx lr
/* END_FUNCTION func_00399670 */
endfunction func_00399670

function func_00399694
/* BEGIN_FUNCTION func_00399694 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r2,r0,r1,lsl #2
strb r3,[r2,#4]
ldr r2,[r0,r1,lsl #2]
orr r2,r2,#1
str r2,[r0,r1,lsl #2]
bx lr
/* END_FUNCTION func_00399694 */
endfunction func_00399694

function func_003996C0
/* BEGIN_FUNCTION func_003996C0 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
ldr r12,[sp]
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r0,r0,r1,lsl #2
add r0,r0,r3,lsl #3
strb r12,[r0,#12]
ldr r1,[r0,#8]
orr r1,r1,#1
str r1,[r0,#8]
bx lr
/* END_FUNCTION func_003996C0 */
endfunction func_003996C0

function func_003996F4
/* BEGIN_FUNCTION func_003996F4 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r2,r0,r1,lsl #2
strb r3,[r2,#7]
ldr r2,[r0,r1,lsl #2]
orr r2,r2,#8
str r2,[r0,r1,lsl #2]
bx lr
/* END_FUNCTION func_003996F4 */
endfunction func_003996F4

function func_00399808
/* BEGIN_FUNCTION func_00399808 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
ldr r12,[sp]
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r0,r0,r1,lsl #2
add r0,r0,r3,lsl #3
strb r12,[r0,#15]
ldr r1,[r0,#8]
orr r1,r1,#8
str r1,[r0,#8]
bx lr
/* END_FUNCTION func_00399808 */
endfunction func_00399808

function func_003998FC
/* BEGIN_FUNCTION func_003998FC */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r2,r2,r2,lsl #3
mov r3,#5
add r0,r0,r1,lsl #2
add r1,r3,r2,lsl #2
ldrb r0,[r0,r1]
bx lr
/* END_FUNCTION func_003998FC */
endfunction func_003998FC

function func_003999B8
/* BEGIN_FUNCTION func_003999B8 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r2,r0,r1,lsl #2
strb r3,[r2,#5]
ldr r2,[r0,r1,lsl #2]
orr r2,r2,#2
str r2,[r0,r1,lsl #2]
bx lr
/* END_FUNCTION func_003999B8 */
endfunction func_003999B8

function func_003999E4
/* BEGIN_FUNCTION func_003999E4 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
ldr r12,[sp]
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r0,r0,r1,lsl #2
add r0,r0,r3,lsl #3
strb r12,[r0,#13]
ldr r1,[r0,#8]
orr r1,r1,#2
str r1,[r0,#8]
bx lr
/* END_FUNCTION func_003999E4 */
endfunction func_003999E4

function func_00399A18
/* BEGIN_FUNCTION func_00399A18 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r2,r0,r1,lsl #2
strb r3,[r2,#32]
ldr r2,[r0,r1,lsl #2]
orr r2,r2,#16
str r2,[r0,r1,lsl #2]
bx lr
/* END_FUNCTION func_00399A18 */
endfunction func_00399A18

function func_00399AD4
/* BEGIN_FUNCTION func_00399AD4 */
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r2,r0,r1,lsl #2
strb r3,[r2,#33]
ldr r2,[r0,r1,lsl #2]
orr r2,r2,#32
str r2,[r0,r1,lsl #2]
bx lr
/* END_FUNCTION func_00399AD4 */
endfunction func_00399AD4
