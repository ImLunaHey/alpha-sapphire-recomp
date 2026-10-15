/* Clean-room implementation of the semantic templates documented in
 * docs/specs/main/arm_duplicate_templates_14.md. */

.syntax unified
.arm
.fpu vfp

.macro FUNCTION_BEGIN name
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
.endm

.macro FUNCTION_END name
.Lend_\name:
    .size \name, .Lend_\name - \name
.endm

.macro PACKET_ENCODER name
    FUNCTION_BEGIN \name
    push    {r4, r5, r6}
    ldrb    r12, [r0, #4]
    cmp     r12, #3
    cmpne   r12, #4
    beq     .Lspecial_\@
    cmp     r12, #5
    movne   r5, #0
    beq     .Lspecial_\@
.Lpack_\@:
    ldrb    r4, [r0, #3]
    cmp     r2, #0
    lsl     r5, r5, #2
    movne   r2, #2
    moveq   r2, #0
    orr     r4, r5, r4, lsl #1
    ldrb    r5, [r0, #2]
    ldrb    r6, [r0, #1]
    cmp     r12, #2
    cmpne   r12, #5
    orr     r2, r4, r2, lsl #4
    orr     r2, r2, r5, lsl #8
    moveq   r12, #1
    movne   r12, #0
    orr     r2, r2, r6, lsl #12
    orr     r12, r2, r12, lsl #24
    ldr     r2, .Lpacket_header_a_\@
    str     r12, [r1], #4
    ldr     r4, .Lpacket_header_b_\@
    str     r2, [r1], #4
    ldrb    r12, [r0, #4]
    mov     r2, #0
    cmp     r12, #3
    cmpne   r12, #0
    beq     .Lzero_payload_\@
    vldr    s1, [r0, #8]
    vldr    s2, .Lfloat_zero_\@
    vmov    r12, s1
    vcmp.f32 s1, s2
    vmrs    APSR_nzcv, fpscr
    beq     .Lemit_\@
    lsl     r12, r12, #1
    mov     r5, #255
    cmp     r5, r12, lsr #24
    beq     .Lemit_\@
    ldr     r12, .Linteger_boundary_\@
    vldr    s0, .Lfloat_bias_\@
    vldr    s4, .Lfloat_scale_\@
    vldr    s3, .Lround_adjust_\@
    vadd.f32 s0, s1, s0
    vmul.f32 s0, s0, s4
    vcmpe.f32 s2, s0
    vmrs    APSR_nzcv, fpscr
    vmovgt.f32 s0, s2
    bgt     .Lround_up_\@
    vmov    r2, s0
    cmp     r2, #0x46000000
    vmovlt  r2, s0
    vldrge  s0, .Llarge_replacement_\@
    cmplt   r2, r12
    blt     .Lround_up_\@
    vsub.f32 s0, s0, s3
    vcvt.u32.f32 s0, s0
    vmov    r2, s0
    b       .Lemit_\@
.Lspecial_\@:
    mov     r5, #1
    b       .Lpack_\@
.Lround_up_\@:
    vadd.f32 s0, s0, s3
    vcvt.u32.f32 s0, s0
    vmov    r2, s0
.Lemit_\@:
    ldrb    r0, [r0, #5]
    orr     r2, r2, r3, lsl #16
    orr     r0, r2, r0, lsl #24
    stm     r1, {r0, r4}
    add     r0, r1, #8
    pop     {r4, r5, r6}
    bx      lr
.Lzero_payload_\@:
    stm     r1, {r2, r4}
    add     r0, r1, #8
    pop     {r4, r5, r6}
    bx      lr
    FUNCTION_END \name
.Lpacket_header_a_\@:
    .word   \name\()_packet_header_a
.Lpacket_header_b_\@:
    .word   \name\()_packet_header_b
.Lfloat_zero_\@:
    .word   \name\()_float_zero
.Lfloat_bias_\@:
    .word   \name\()_float_bias
.Lfloat_scale_\@:
    .word   \name\()_float_scale
.Linteger_boundary_\@:
    .word   \name\()_integer_boundary
.Lround_adjust_\@:
    .word   \name\()_round_adjust
.Llarge_replacement_\@:
    .word   \name\()_large_replacement
.endm

.macro VECTOR_RESERVE name
    FUNCTION_BEGIN \name
    push    {r4, r5, r6, r7, r8, lr}
    mov     r6, r1
    mov     r4, r0
    ldr     r1, [r0, #12]
    bic     r0, r1, #0xc0000000
    cmp     r0, r6
    movge   r0, #1
    bge     .Lreturn_\@
    ldr     r0, [r4]
    cmp     r0, #0
    beq     .Lfail_\@
    and     r1, r1, #0xc0000000
    cmp     r1, #0x40000000
    beq     .Lallocate_\@
.Lfail_\@:
    mov     r0, #0
.Lreturn_\@:
    pop     {r4, r5, r6, r7, r8, pc}
.Lallocate_\@:
    ldr     r1, [r0]
    mov     r2, #32
    ldr     r3, [r1, #8]
    lsl     r1, r6, #2
    blx     r3
    movs    r5, r0
    beq     .Lreturn_\@
    add     r0, r4, #4
    mov     r7, #0
    ldm     r0, {r0, r2}
    cmp     r0, r2
    movne   r1, r5
    beq     .Lcopy_done_\@
.Lcopy_\@:
    cmp     r1, #0
    ldrne   r12, [r0]
    add     r0, r0, #4
    strne   r12, [r1]
    cmp     r0, r2
    add     r1, r1, #4
    bne     .Lcopy_\@
    ldr     r0, [r4, #8]
    ldr     r1, [r4, #4]
    sub     r0, r0, r1
    asr     r7, r0, #2
.Lcopy_done_\@:
    ldr     r1, [r4, #4]
    cmp     r1, #0
    beq     .Linstall_\@
    ldr     r0, [r4]
    ldr     r2, [r0]
    ldr     r2, [r2, #12]
    blx     r2
.Linstall_\@:
    add     r0, r5, r7, lsl #2
    str     r0, [r4, #8]
    str     r5, [r4, #4]
    ldr     r0, [r4, #12]
    and     r0, r0, #0xc0000000
    orr     r0, r0, r6
    str     r0, [r4, #12]
    mov     r0, #1
    pop     {r4, r5, r6, r7, r8, pc}
    FUNCTION_END \name
.endm

.macro RECORD_DECODER name
    FUNCTION_BEGIN \name
    push    {r4, r5, r6, r7, r8, r9, r10, lr}
    cmp     r1, #0
    mov     r4, r2
    add     r9, sp, #36
    ldr     r8, [sp, #32]
    ldm     r9, {r5, r6}
    mov     r7, r3
    mov     r9, #0
    blt     .Lnegative_\@
    ldr     r0, [r0, #24]
    mov     r2, #2
    add     r2, r2, r1, lsl #1
    add     r1, r0, r1, lsl #1
    ldrh    r2, [r0, r2]
    ldrsh   r1, [r1]
    sub     r2, r2, r1
    sxth    r2, r2
    subs    r2, r2, #4
    bmi     .Linvalid_\@
    ldrb    r1, [r0, r1]!
    strh    r1, [r4]
    ldrb    r1, [r0, #1]
    strh    r1, [r7]
    ldrb    r1, [r0, #2]
    strh    r1, [r8]
    ldrsh   r1, [r4]
    cmp     r1, #0
    addgt   r1, r0, #4
    strgt   r1, [r5]
    strle   r9, [r5]
    ldrsh   r1, [r3]
    cmp     r1, #0
    strle   r9, [r6]
    ble     .Lreturn_\@
    ldrsh   r1, [r4]
    add     r0, r0, r1, lsl #1
    add     r0, r0, #4
    str     r0, [r6]
.Lreturn_\@:
    pop     {r4, r5, r6, r7, r8, r9, r10, pc}
.Linvalid_\@:
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    mov     r0, r0
    strh    r9, [r4]
    strh    r9, [r7]
    strh    r9, [r8]
    str     r9, [r5]
    str     r9, [r6]
    pop     {r4, r5, r6, r7, r8, r9, r10, pc}
.Lnegative_\@:
    strh    r9, [r2]
    strh    r9, [r3]
    strh    r9, [r8]
    str     r9, [r5]
    str     r9, [r6]
    pop     {r4, r5, r6, r7, r8, r9, r10, pc}
    FUNCTION_END \name
.endm

.macro TAGGED_LOOKUP name
    FUNCTION_BEGIN \name
    push    {r4, r5}
    ldrh    r3, [r0, #16]
    ldr     r12, .Lrecord_tag_\@
    mov     r5, #0
    cmp     r3, #0
    add     r2, r0, #20
    mov     r1, r5
    ble     .Lreturn_\@
.Lscan_\@:
    add     r4, r1, r1, lsl #1
    add     r4, r2, r4, lsl #2
    ldrh    r4, [r4]
    cmp     r4, r12
    bne     .Lnext_\@
    add     r1, r1, r1, lsl #1
    adds    r1, r2, r1, lsl #2
    ldrne   r1, [r1, #4]
    cmpne   r1, #0
    addne   r5, r1, r0
.Lreturn_\@:
    mov     r0, r5
    pop     {r4, r5}
    bx      lr
.Lnext_\@:
    add     r1, r1, #1
    cmp     r3, r1
    bgt     .Lscan_\@
    b       .Lreturn_\@
    FUNCTION_END \name
.Lrecord_tag_\@:
    .word   \name\()_record_tag
.endm

.macro RECORD_INITIALIZER name
    FUNCTION_BEGIN \name
    cmp     r1, #0
    push    {r4, r5, r6, r7}
    movgt   r0, #0
    mov     r7, #0
    mvngt   r5, #0
    ble     .Lreturn_\@
.Lrecord_\@:
    mov     r3, #91
    mov     r4, #0
    smulbb  r3, r7, r3
    str     r0, [r2, r3, lsl #2]
    add     r3, r2, r3, lsl #2
    str     r0, [r3, #4]
    str     r0, [r3, #8]
    str     r0, [r3, #24]
    str     r0, [r3, #12]
    str     r0, [r3, #28]
    str     r0, [r3, #16]
    str     r0, [r3, #32]
    str     r0, [r3, #20]
    str     r0, [r3, #36]
.Linner_\@:
    add     r12, r3, r4, lsl #2
    add     r6, r3, r4, lsl #1
    str     r0, [r12, #40]
    str     r0, [r12, #72]
    str     r0, [r12, #104]
    strh    r5, [r6, #136]
    strh    r5, [r6, #152]
    str     r0, [r12, #168]
    str     r0, [r12, #200]
    add     r4, r4, #1
    str     r0, [r12, #232]
    str     r0, [r12, #264]
    sxth    r4, r4
    str     r0, [r12, #296]
    cmp     r4, #8
    str     r0, [r12, #328]
    blt     .Linner_\@
    add     r12, r7, #1
    add     r3, r3, #256
    sxth    r7, r12
    cmp     r7, r1
    strh    r5, [r3, #104]
    blt     .Lrecord_\@
.Lreturn_\@:
    pop     {r4, r5, r6, r7}
    bx      lr
    FUNCTION_END \name
.endm

.macro SELECTOR_LOOKUP name
    FUNCTION_BEGIN \name
    ldr     r3, [r0, #4]
    ldrh    r12, [r0]
    mov     r2, r0
    add     r2, r2, r3
    cmp     r12, #0x6000
    mov     r0, #0
    ldreq   r0, [r2, #4]
    addeq   r0, r0, r2
    beq     .Lreturn_\@
    sub     r3, r12, #0x6000
    subs    r3, r3, #1
    beq     .Ltype1_\@
    cmp     r3, #1
    bne     .Lreturn_\@
    ldrb    r0, [r2]
    cmp     r0, r1
    ldrbls  r3, [r2, #1]
    cmpls   r1, r3
    bhi     .Lnull_\@
    b       .Ltype2_hit_\@
.Ltype1_\@:
    ldr     r12, [r2]
    mov     r0, #0
    cmp     r12, #0
    bls     .Lnull_\@
.Lscan_\@:
    add     r3, r2, r0
    ldrb    r3, [r3, #4]
    cmp     r3, r1
    bcc     .Lnext_\@
    add     r1, r12, #3
    bic     r1, r1, #3
    add     r0, r1, r0, lsl #3
    add     r0, r0, #4
    add     r0, r0, r2
    ldr     r0, [r0, #4]
    b       .Ladd_base_\@
.Lnext_\@:
    add     r0, r0, #1
    cmp     r0, r12
    bcc     .Lscan_\@
.Lnull_\@:
    mov     r0, #0
.Lreturn_\@:
    bx      lr
.Ltype2_hit_\@:
    sub     r0, r1, r0
    add     r0, r2, r0, lsl #3
    ldr     r0, [r0, #8]
.Ladd_base_\@:
    add     r0, r0, r2
    bx      lr
    FUNCTION_END \name
.endm

PACKET_ENCODER func_004BBFD4
PACKET_ENCODER func_004BC130

VECTOR_RESERVE func_00540D64
VECTOR_RESERVE func_0054108C

RECORD_DECODER func_00497E48
RECORD_DECODER func_00498DA0

TAGGED_LOOKUP func_0016B518
TAGGED_LOOKUP func_0016B5EC
TAGGED_LOOKUP func_0018CDFC
TAGGED_LOOKUP func_004C2204

RECORD_INITIALIZER func_0049D0B8
RECORD_INITIALIZER func_004A416C

SELECTOR_LOOKUP func_004C1E58
SELECTOR_LOOKUP func_004C2120

.section .note.GNU-stack, "", %progbits
