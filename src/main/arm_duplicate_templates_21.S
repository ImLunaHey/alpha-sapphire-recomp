.syntax unified
.arch armv6k
.arm

.macro arm_function name
  .section .text.\name,"ax",%progbits
  .balign 4
  .arm
  .global \name
  .type \name, %function
\name:
.endm

.macro typed_two_word_initializer name, identity
  arm_function \name
  ldr r1, .Lidentity_\name
  mov r2, #0
  stm r0, {r1, r2}
  bx lr
  .size \name, .-\name
.Lidentity_\name:
  .word \identity
  .global \identity
.endm

typed_two_word_initializer func_00257BB4, duplicate_template_21_type_shared
typed_two_word_initializer func_00257BF4, duplicate_template_21_type_shared
typed_two_word_initializer func_0028D188, duplicate_template_21_type_func_0028D188
typed_two_word_initializer func_00330C0C, duplicate_template_21_type_func_00330C0C
typed_two_word_initializer func_00374CBC, duplicate_template_21_type_func_00374CBC
typed_two_word_initializer func_0039BC80, duplicate_template_21_type_func_0039BC80

.macro two_tag_tail_dispatcher name, table
  arm_function \name
  ldr r0, [r0]
  ldr r1, .Ltable_\name
  ldr r2, [r0]
  cmp r2, #0x80000000
  beq .Lfirst_\name
  cmp r2, #0x40000000
  bne .Lreturn_\name
  ldr r1, [r1, #4]
  bx r1
.Lfirst_\name:
  ldr r1, [r1]
  bx r1
.Lreturn_\name:
  bx lr
  .size \name, .-\name
.Ltable_\name:
  .word \table
  .global \table
.endm

two_tag_tail_dispatcher func_0030E398, duplicate_template_21_dispatch_table_func_0030E398
two_tag_tail_dispatcher func_0030F074, duplicate_template_21_dispatch_table_func_0030F074

.macro tagged_relative_entry_lookup name, tag
  arm_function \name
  ldr r2, [r0]
  cmp r2, r1
  ldr r2, .Ltag_\name
  bls .Lfail_\name
  add r1, r0, r1, lsl #3
  ldrh r3, [r1, #4]
  cmp r3, r2
  ldreq r1, [r1, #8]
  addeq r0, r0, r1
  beq .Lreturn_\name
.Lfail_\name:
  mov r0, #0
.Lreturn_\name:
  bx lr
  .size \name, .-\name
.Ltag_\name:
  .word \tag
  .global \tag
.endm

tagged_relative_entry_lookup func_004BF560, duplicate_template_21_entry_tag_func_004BF560
tagged_relative_entry_lookup func_004BF594, duplicate_template_21_entry_tag_func_004BF594

.macro bounded_halfword_span_export name, error
  arm_function \name
  ldr r2, [r0, #4]
  ldr r3, [r0]
  sub r2, r2, r3
  asr r2, r2, #1
  cmp r2, #256
  strls r2, [r1]
  ldrls r0, [r0]
  ldrhi r0, .Lerror_\name
  strls r0, [r1, #4]
  movls r0, #0
  bx lr
  .size \name, .-\name
.Lerror_\name:
  .word \error
  .global \error
.endm

bounded_halfword_span_export func_004A9E30, duplicate_template_21_error_func_004A9E30
bounded_halfword_span_export func_004A9EB4, duplicate_template_21_error_func_004A9EB4

.macro paired_store_zero_initializer name
  arm_function \name
  mov r1, #0
  mov r2, r1
  stm r0, {r1, r2}
  bx lr
  .size \name, .-\name
.endm

paired_store_zero_initializer func_00139404
paired_store_zero_initializer func_0017357C
paired_store_zero_initializer func_0040ECE8
paired_store_zero_initializer func_00410850
paired_store_zero_initializer func_0041090C

.macro packed_two_axis_offset name
  arm_function \name
  ldr r1, [r0, #52]
  ldr r0, [r0, #44]
  lsl r3, r0, #28
  lsl r2, r0, #30
  lsr r0, r3, #30
  lsr r2, r2, #25
  add r0, r0, r0, lsl #2
  add r0, r2, r0, lsl #2
  add r0, r0, r1
  bx lr
  .size \name, .-\name
.endm

packed_two_axis_offset func_00328E24
packed_two_axis_offset func_004BE73C
