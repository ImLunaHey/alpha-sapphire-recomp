.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.global runtime_curve_coefficient_a_46
.global runtime_curve_coefficient_b_46
.global runtime_curve_coefficient_c_46

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

FUNCTION_BEGIN func_004E43FC
/* BEGIN_FUNCTION func_004E43FC */
  push {r4,lr}
  mov r4,r0
  ldr r0,[r0,#52]
  cmp r0,#0
  bne 1f
  mov r2,#0
  mov r1,r2
  mov r0,r2
  mov r0,r0
1:
  ldr r0,[r4,#52]
  pop {r4,pc}
/* END_FUNCTION func_004E43FC */
FUNCTION_END func_004E43FC

FUNCTION_BEGIN func_004E4430
/* BEGIN_FUNCTION func_004E4430 */
  ldr r0,[r0,#52]
  cmp r0,#0
  movne r0,#1
  bx lr
/* END_FUNCTION func_004E4430 */
FUNCTION_END func_004E4430

FUNCTION_BEGIN func_004E4670
/* BEGIN_FUNCTION func_004E4670 */
  vadd.f32 s7,s2,s4
  vsub.f32 s1,s1,s3
  vldr s8,.Lfunc_004E4670_coefficient_c
  vldr s6,.Lfunc_004E4670_coefficient_a
  vldr s5,.Lfunc_004E4670_coefficient_b
  vnmls.f32 s4,s2,s8
  vmla.f32 s7,s1,s6
  vmls.f32 s4,s1,s5
  vmul.f32 s1,s7,s5
  vmul.f32 s3,s4,s6
  vmul.f32 s1,s1,s0
  vmul.f32 s1,s1,s0
  vmla.f32 s1,s3,s0
  vadd.f32 s0,s1,s2
  bx lr
/* END_FUNCTION func_004E4670 */
FUNCTION_END func_004E4670
.Lfunc_004E4670_coefficient_a:
  .word runtime_curve_coefficient_a_46
.Lfunc_004E4670_coefficient_b:
  .word runtime_curve_coefficient_b_46
.Lfunc_004E4670_coefficient_c:
  .word runtime_curve_coefficient_c_46

FUNCTION_BEGIN func_004E46B8
/* BEGIN_FUNCTION func_004E46B8 */
  vldr s8,.Lfunc_004E46B8_coefficient_c
  vadd.f32 s5,s2,s4
  vsub.f32 s3,s1,s3
  vnmls.f32 s4,s2,s8
  vldr s7,.Lfunc_004E46B8_coefficient_a
  vldr s6,.Lfunc_004E46B8_coefficient_b
  vmla.f32 s5,s3,s7
  vmls.f32 s4,s3,s6
  vmla.f32 s4,s5,s0
  vmla.f32 s2,s0,s4
  vmla.f32 s1,s0,s2
  vmov.f32 s0,s1
  bx lr
/* END_FUNCTION func_004E46B8 */
FUNCTION_END func_004E46B8
.Lfunc_004E46B8_coefficient_c:
  .word runtime_curve_coefficient_c_46
.Lfunc_004E46B8_coefficient_a:
  .word runtime_curve_coefficient_a_46
.Lfunc_004E46B8_coefficient_b:
  .word runtime_curve_coefficient_b_46

FUNCTION_BEGIN func_004E6014
/* BEGIN_FUNCTION func_004E6014 */
  ldrb r0,[r0,#10]
  cmp r0,#0
  cmpne r0,#1
  movne r0,#2
  beq 1f
1:
  bx lr
/* END_FUNCTION func_004E6014 */
FUNCTION_END func_004E6014

FUNCTION_BEGIN func_004E6064
/* BEGIN_FUNCTION func_004E6064 */
  ldrb r0,[r0,#15]
  mov r2,#1
  ands r0,r0,r2,lsl r1
  movne r0,#1
  bx lr
/* END_FUNCTION func_004E6064 */
FUNCTION_END func_004E6064

FUNCTION_BEGIN func_004E6084
/* BEGIN_FUNCTION func_004E6084 */
  ldrb r0,[r0,#14]
  cmp r0,#0
  cmpne r0,#1
  movne r0,#2
  beq 1f
1:
  bx lr
/* END_FUNCTION func_004E6084 */
FUNCTION_END func_004E6084

FUNCTION_BEGIN func_004E68C4
/* BEGIN_FUNCTION func_004E68C4 */
  ldr r0,[r0,#40]
  mov r2,#1
  and r0,r0,#7680
  lsr r0,r0,#9
  ands r0,r0,r2,lsl r1
  movne r0,#1
  bx lr
/* END_FUNCTION func_004E68C4 */
FUNCTION_END func_004E68C4

FUNCTION_BEGIN func_004E6FA0
/* BEGIN_FUNCTION func_004E6FA0 */
  ldrb r0,[r0,#195]
  cmp r0,#3
  moveq r0,#1
  movne r0,#0
  bx lr
/* END_FUNCTION func_004E6FA0 */
FUNCTION_END func_004E6FA0

FUNCTION_BEGIN func_004E7F90
/* BEGIN_FUNCTION func_004E7F90 */
  cmp r1,#100
  movcs r0,#0
  bcs 1f
  add r0,r0,r1,lsl #4
  add r0,r0,#4
  vldmia r0,{s0-s3}
  mov r0,#1
  vstmia r2,{s0-s3}
1:
  bx lr
/* END_FUNCTION func_004E7F90 */
FUNCTION_END func_004E7F90

FUNCTION_BEGIN func_004E82C4
/* BEGIN_FUNCTION func_004E82C4 */
  add r1,r0,#768
  ldrh r0,[r1,#40]
  sub r2,r0,#65280
  subs r2,r2,#255
  beq 1f
  ldrh r1,[r1,#46]
  cmp r0,r1
  moveq r0,#1
  beq 2f
1:
  mov r0,#0
2:
  bx lr
/* END_FUNCTION func_004E82C4 */
FUNCTION_END func_004E82C4

FUNCTION_BEGIN func_004E8384
/* BEGIN_FUNCTION func_004E8384 */
  cmp r1,#5
  movcs r0,#0
  bcs 1f
  add r0,r0,r1,lsl #4
  add r1,r0,#30720
  vldr s0,[r1,#640]
  ldr r0,[r1,#644]!
  add r1,r1,#4
  vldmia r1,{s1-s2}
  vstr s0,[r2]
  str r0,[r2,#4]!
  add r2,r2,#4
  mov r0,#1
  vstmia r2,{s1-s2}
1:
  bx lr
/* END_FUNCTION func_004E8384 */
FUNCTION_END func_004E8384

FUNCTION_BEGIN func_004E8D38
/* BEGIN_FUNCTION func_004E8D38 */
  ldr r1,[r0,#4]
  tst r1,#1
  moveq r0,#0
  addne r0,r0,#8
  bx lr
/* END_FUNCTION func_004E8D38 */
FUNCTION_END func_004E8D38

FUNCTION_BEGIN func_004E8D68
/* BEGIN_FUNCTION func_004E8D68 */
  add r0,r0,#19456
  add r0,r0,#552
  ldr r0,[r0]
  cmp r0,#0
  moveq r0,#1
  movne r0,#0
  bx lr
/* END_FUNCTION func_004E8D68 */
FUNCTION_END func_004E8D68

FUNCTION_BEGIN func_004E9E5C
/* BEGIN_FUNCTION func_004E9E5C */
  ldr r0,[r0,#20]
  mov r1,#0
  cmp r0,#0
  beq 2f
1:
  tst r0,#1
  addne r1,r1,#1
  lsrs r0,r0,#1
  bne 1b
2:
  and r0,r1,#255
  bx lr
/* END_FUNCTION func_004E9E5C */
FUNCTION_END func_004E9E5C

FUNCTION_BEGIN func_004E9F98
/* BEGIN_FUNCTION func_004E9F98 */
  ldr r2,[r0,#8]!
  ldr r1,[r0,#4]
  mov r0,r2
  bx lr
/* END_FUNCTION func_004E9F98 */
FUNCTION_END func_004E9F98

FUNCTION_BEGIN func_004EA03C
/* BEGIN_FUNCTION func_004EA03C */
  ldr r0,[r0,#4]
  lsl r0,r0,#24
  lsrs r0,r0,#28
  cmpne r0,#1
  movne r0,#0
  beq 1f
1:
  bx lr
/* END_FUNCTION func_004EA03C */
FUNCTION_END func_004EA03C

FUNCTION_BEGIN func_00520DDC
/* BEGIN_FUNCTION func_00520DDC */
  add r0,r0,r1,lsl #3
  ldr r0,[r0,#12]
  str r0,[r2]
  mov r0,#0
  bx lr
/* END_FUNCTION func_00520DDC */
FUNCTION_END func_00520DDC

FUNCTION_BEGIN func_0053FC5C
/* BEGIN_FUNCTION func_0053FC5C */
  mov r2,#1
  strb r2,[r0,#4]
  ldr r1,[r1]
  str r1,[r0]
  bx lr
/* END_FUNCTION func_0053FC5C */
FUNCTION_END func_0053FC5C

FUNCTION_BEGIN func_005406DC
/* BEGIN_FUNCTION func_005406DC */
  mov r1,#15
1:
  ldrb r2,[r0,r1]
  add r2,r2,#1
  ands r2,r2,#255
  strb r2,[r0,r1]
  bne 2f
  sub r1,r1,#1
  cmp r1,#0
  bgt 1b
2:
  bx lr
/* END_FUNCTION func_005406DC */
FUNCTION_END func_005406DC

.section .note.GNU-stack,"",%progbits
