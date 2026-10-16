.syntax unified
.arch armv6k
.arm

.macro begin_function name
  .section .text.\name,"ax",%progbits
  .balign 4
  .arm
  .global \name
  .type \name, %function
\name:
.endm

.macro end_function name
  .size \name, .-\name
.endm

.macro single_type_identity_installer name, identity
  begin_function \name
  ldr r1, 1f
  str r1, [r0]
  bx lr
  end_function \name
1:
  .word \identity
  .global \identity
.endm

.macro typed_four_word_clear_initializer name, identity
  begin_function \name
  mov r1, #0
  str r1, [r0, #4]
  ldr r2, 1f
  str r1, [r0, #8]
  str r1, [r0, #12]
  str r1, [r0, #16]
  str r2, [r0]
  bx lr
  end_function \name
1:
  .word \identity
  .global \identity
.endm

.macro typed_zero_invalid_pair_initializer name, identity
  begin_function \name
  add r3, r0, #4
  mov r1, #0
  mvn r2, #0
  stm r3, {r1, r2}
  ldr r2, 1f
  str r1, [r0, #12]
  str r2, [r0]
  bx lr
  end_function \name
1:
  .word \identity
  .global \identity
.endm

.macro tagged_relative_pointer_resolver name
  begin_function \name
  ldrh r1, [r0, #4]
  sub r2, r1, #256
  subs r2, r2, #1
  ldreq r1, [r0, #8]
  movne r0, #0
  addeq r0, r0, r1
  bx lr
  end_function \name
.endm

.macro single_word_zero_initializer name
  begin_function \name
  mov r1, #0
  str r1, [r0]
  bx lr
  end_function \name
.endm

.macro three_word_trailing_byte_zero_initializer name
  begin_function \name
  mov r1, #0
  str r1, [r0]
  str r1, [r0, #4]
  str r1, [r0, #8]
  strb r1, [r0, #12]
  bx lr
  end_function \name
.endm

single_type_identity_installer func_0010ACEC, duplicate_template_23_type_func_0010ACEC
single_type_identity_installer func_00163B70, duplicate_template_23_type_func_00163B70
single_type_identity_installer func_00163C20, duplicate_template_23_type_func_00163C20
single_type_identity_installer func_001666DC, duplicate_template_23_type_func_001666DC
single_type_identity_installer func_00203888, duplicate_template_23_type_func_00203888
single_type_identity_installer func_0024FB08, duplicate_template_23_type_func_0024FB08
single_type_identity_installer func_00250468, duplicate_template_23_type_func_00250468
single_type_identity_installer func_0026D5D4, duplicate_template_23_type_func_0026D5D4
single_type_identity_installer func_002AEF8C, duplicate_template_23_type_func_002AEF8C
single_type_identity_installer func_0032ADB0, duplicate_template_23_type_func_0032ADB0
single_type_identity_installer func_003312BC, duplicate_template_23_type_func_003312BC
single_type_identity_installer func_0042D510, duplicate_template_23_type_func_0042D510

typed_four_word_clear_initializer func_002C69FC, duplicate_template_23_type_func_002C69FC
typed_four_word_clear_initializer func_002C8850, duplicate_template_23_type_func_002C8850

typed_zero_invalid_pair_initializer func_00375814, duplicate_template_23_type_func_00375814
typed_zero_invalid_pair_initializer func_0037A0DC, duplicate_template_23_type_func_0037A0DC

tagged_relative_pointer_resolver func_004BF8F4
tagged_relative_pointer_resolver func_004BFAB4

single_word_zero_initializer func_0011EB78
single_word_zero_initializer func_00279DD0
single_word_zero_initializer func_00370764
single_word_zero_initializer func_00417610

three_word_trailing_byte_zero_initializer func_00134384
three_word_trailing_byte_zero_initializer func_002013A4

.section .note.GNU-stack,"",%progbits
