.syntax unified
.arch armv6k
.fpu vfp
.arm

.macro arm_function name
  .section .text.\name, "ax", %progbits
  .balign 4
  .global \name
  .type \name, %function
\name:
.endm

.macro end_arm_function name
  .size \name, . - \name
.endm

.macro relative_word_16 name
  arm_function \name
  ldr r1, [r0, #16]
  add r0, r0, r1
  bx lr
  end_arm_function \name
.endm

.macro relative_word_4 name
  arm_function \name
  ldr r1, [r0, #4]
  add r0, r0, r1
  bx lr
  end_arm_function \name
.endm

.macro relative_word_12 name
  arm_function \name
  ldr r1, [r0, #12]
  add r0, r0, r1
  bx lr
  end_arm_function \name
.endm

.macro low_two_bit_update name
  arm_function \name
  ldr r2, [r0, #4]
  and r1, r1, #3
  bic r2, r2, #3
  orr r1, r1, r2
  str r1, [r0, #4]
  bx lr
  end_arm_function \name
.endm

.macro tag_4_byte_payload name
  arm_function \name
  mov r3, #4
  strb r3, [r0, #4]
  strb r2, [r0, #6]
  ldr r1, [r1]
  str r1, [r0]
  bx lr
  end_arm_function \name
.endm

.macro tag_3_word_payload name
  arm_function \name
  mov r3, #3
  strb r3, [r0, #4]
  str r2, [r0, #16]
  ldr r1, [r1]
  str r1, [r0]
  bx lr
  end_arm_function \name
.endm

.macro tag_2_halfword_payload name
  arm_function \name
  mov r3, #2
  strb r3, [r0, #4]
  strh r2, [r0, #6]
  ldr r1, [r1]
  str r1, [r0]
  bx lr
  end_arm_function \name
.endm

.macro clear_words_56_64 name
  arm_function \name
  mov r1, #0
  str r1, [r0, #56]
  str r1, [r0, #60]
  str r1, [r0, #64]
  bx lr
  end_arm_function \name
.endm

.macro clear_words_0_8 name
  arm_function \name
  mov r1, #0
  str r1, [r0]
  str r1, [r0, #4]
  str r1, [r0, #8]
  bx lr
  end_arm_function \name
.endm

.macro explicit_noop_return name
  arm_function \name
  mov r0, r0
  bx lr
  end_arm_function \name
.endm

.macro word_4_boolean name
  arm_function \name
  ldr r0, [r0, #4]
  cmp r0, #0
  movne r0, #1
  bx lr
  end_arm_function \name
.endm

.macro word_halfword_clear name
  arm_function \name
  mov r1, #0
  str r1, [r0]
  strh r1, [r0, #4]
  bx lr
  end_arm_function \name
.endm

.macro nested_halfword_clear name
  arm_function \name
  add r0, r0, #288
  mov r1, #0
  strh r1, [r0, #8]
  bx lr
  end_arm_function \name
.endm

.macro invalid_word_28 name
  arm_function \name
  mvn r1, #0
  str r1, [r0, #28]
  bx lr
  end_arm_function \name
.endm

.macro two_word_integer_copy name
  arm_function \name
  ldm r1, {r1, r2}
  stm r0, {r1, r2}
  bx lr
  end_arm_function \name
.endm

.macro clear_word_8 name
  arm_function \name
  mov r1, #0
  str r1, [r0, #8]
  bx lr
  end_arm_function \name
.endm

.macro four_single_vfp_copy name
  arm_function \name
  vldmia r1, {s0-s3}
  vstmia r0, {s0-s3}
  bx lr
  end_arm_function \name
.endm

.macro nested_two_word_store name
  arm_function \name
  add r0, r0, #40
  stm r0, {r1, r2}
  bx lr
  end_arm_function \name
.endm

relative_word_16 func_001769CC
relative_word_16 func_00176A00
relative_word_16 func_004BFB50
relative_word_16 func_004BFB5C

relative_word_4 func_0016B050
relative_word_4 func_00176C7C
relative_word_4 func_004BEE74

relative_word_12 func_0017CFB4
relative_word_12 func_004C1F50
relative_word_12 func_004C22D8

low_two_bit_update func_004108BC
low_two_bit_update func_00462B9C

tag_4_byte_payload func_0053FAA4
tag_4_byte_payload func_0053FC70

tag_3_word_payload func_0053FABC
tag_3_word_payload func_0053FC88

tag_2_halfword_payload func_0053FAD4
tag_2_halfword_payload func_0053FCA0

clear_words_56_64 func_0014AE44
clear_words_56_64 func_00331294

clear_words_0_8 func_002B81F0
clear_words_0_8 func_004F2C0C

explicit_noop_return func_002AEAE8
explicit_noop_return func_002C8878
explicit_noop_return func_003388E8
explicit_noop_return func_00339B44

word_4_boolean func_0013E6F4
word_4_boolean func_0016BC74

word_halfword_clear func_002C2350
word_halfword_clear func_004F2C30

nested_halfword_clear func_003E80E8
nested_halfword_clear func_003E8290

invalid_word_28 func_0015E42C
invalid_word_28 func_0015E468

two_word_integer_copy func_0017358C
two_word_integer_copy func_002ADE84

clear_word_8 func_002F9224
clear_word_8 func_0041B3CC

four_single_vfp_copy func_003CC4C4
four_single_vfp_copy func_003CC4D0

nested_two_word_store func_00410A3C
nested_two_word_store func_00438BEC
