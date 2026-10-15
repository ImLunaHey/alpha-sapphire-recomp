.syntax unified
.arm
.fpu vfpv2
.text

.extern arm_duplicate_templates_17_nudge
.extern arm_duplicate_templates_17_normalizer
.extern arm_duplicate_templates_17_scale_a
.extern arm_duplicate_templates_17_scale_b
.extern arm_duplicate_templates_17_tag_0013E908
.extern arm_duplicate_templates_17_tag_00152C18
.extern arm_duplicate_templates_17_tag_004BF440
.extern arm_duplicate_templates_17_tag_004BF4B8
.extern arm_duplicate_templates_17_vtable_identity

.macro BEGIN_ARM_FUNCTION name
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
.endm

.macro END_ARM_FUNCTION name
    .size \name, . - \name
.endm

.macro X_DIRECTION_SCALER name, scale_identity
    BEGIN_ARM_FUNCTION \name
    vldr s2, [r2]
    vldr s1, [r3]
    vcmp.f32 s1, s2
    vmrs APSR_nzcv, fpscr
    bne .Lx_different_\@
    vldr s2, .Lx_nudge_\@
    vadd.f32 s1, s1, s2
    vstr s1, [r3]
.Lx_different_\@:
    vmov.f32 s3, s1
    vldmia r2!, {s6}
    vldr s2, [r3, #4]
    vldr s1, [r3, #8]
    vldmia r2, {s4-s5}
    vsub.f32 s3, s3, s6
    vsub.f32 s2, s2, s4
    vsub.f32 s1, s1, s5
    vldr s5, .Lx_normalizer_\@
    vmul.f32 s4, s3, s3
    vmla.f32 s4, s2, s2
    vmla.f32 s4, s1, s1
    vsqrt.f32 s6, s4
    vdiv.f32 s4, s5, s6
    vmul.f32 s3, s3, s4
    vmul.f32 s2, s2, s4
    vmul.f32 s4, s1, s4
    vldr s1, .Lx_scale_\@
    vmul.f32 s1, s0, s1
    vdiv.f32 s0, s1, s3
    vmul.f32 s1, s3, s0
    vmul.f32 s2, s2, s0
    vmul.f32 s0, s4, s0
    vstr s0, [r0, #8]
    vstmia r0, {s1-s2}
    bx lr
    END_ARM_FUNCTION \name
.Lx_nudge_\@:
    .word arm_duplicate_templates_17_nudge
.Lx_normalizer_\@:
    .word arm_duplicate_templates_17_normalizer
.Lx_scale_\@:
    .word \scale_identity
.endm

.macro Y_DIRECTION_SCALER name, scale_identity
    BEGIN_ARM_FUNCTION \name
    vldr s2, [r2, #4]
    vldr s0, [r3, #4]
    vcmp.f32 s0, s2
    vmrs APSR_nzcv, fpscr
    bne .Ly_different_\@
    vldr s2, .Ly_nudge_\@
    vadd.f32 s0, s0, s2
    vstr s0, [r3, #4]
.Ly_different_\@:
    vldr s3, [r3]
    vldr s2, [r3, #8]
    vldmia r2!, {s6}
    vldmia r2, {s4-s5}
    vsub.f32 s3, s3, s6
    vsub.f32 s0, s0, s4
    vsub.f32 s2, s2, s5
    vldr s5, .Ly_normalizer_\@
    vmul.f32 s4, s3, s3
    vmla.f32 s4, s0, s0
    vmla.f32 s4, s2, s2
    vsqrt.f32 s6, s4
    vdiv.f32 s4, s5, s6
    vmul.f32 s5, s3, s4
    vmul.f32 s3, s0, s4
    vldr s0, .Ly_scale_\@
    vmul.f32 s4, s2, s4
    vmul.f32 s1, s1, s0
    vdiv.f32 s0, s1, s3
    vmul.f32 s1, s5, s0
    vmul.f32 s2, s3, s0
    vmul.f32 s0, s4, s0
    vstr s0, [r0, #8]
    vstmia r0, {s1-s2}
    bx lr
    END_ARM_FUNCTION \name
.Ly_nudge_\@:
    .word arm_duplicate_templates_17_nudge
.Ly_normalizer_\@:
    .word arm_duplicate_templates_17_normalizer
.Ly_scale_\@:
    .word \scale_identity
.endm

.macro SATURATING_SAMPLE_SCALER name, helper
    BEGIN_ARM_FUNCTION \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #168]
    mov r5, r1
    cmp r0, #0
    beq .Lsample_return_\@
    ldrh r0, [r4, #160]
    tst r0, #2
    beq .Lsample_scale_check_\@
    ldrsh r1, [r4, #164]
    mov r2, r5
    mov r0, r4
    bl \helper
.Lsample_scale_check_\@:
    ldrh r0, [r4, #162]
    cmp r0, #4096
    movne r1, #63
    beq .Lsample_return_\@
.Lsample_loop_\@:
    add r2, r5, r1, lsl #1
    ldrh r0, [r4, #162]
    ldrsh r3, [r2]
    mul r3, r3, r0
    qadd r0, r3, r3
    qadd r0, r0, r0
    qadd r0, r0, r0
    qadd r3, r0, r0
    sub r0, r1, #1
    sxth r1, r0
    asr r0, r3, #16
    cmp r1, #0
    strh r0, [r2]
    bge .Lsample_loop_\@
.Lsample_return_\@:
    pop {r4, r5, r6, pc}
    END_ARM_FUNCTION \name
.endm

.macro INTRUSIVE_ERASE_RECYCLE name
    BEGIN_ARM_FUNCTION \name
    push {r4, r5, r6, lr}
    mov r6, r0
    mov r5, r1
    vpush {d8}
    mov r4, r2
    ldr r0, [r1, #16]
    ldr r1, [r2]
    cmp r1, r0
    streq r0, [r6]
    beq .Lerase_return_\@
    vldr s16, [r1]
    ldrd r0, [r1]
    str r0, [r1]
    ldr r0, [r4]
    ldr r1, [r0]
    ldr r0, [r0, #4]
    str r0, [r1, #4]
    ldr r0, [r5, #20]
    sub r0, r0, #1
    str r0, [r5, #20]
    ldr r0, [r4]
    ldr r1, [r0, #8]!
    ldr r1, [r1]
    blx r1
    ldr r0, [r4]
    ldr r1, [r5, #4]
    str r1, [r0]
    str r0, [r5, #4]
    vstr s16, [r6]
.Lerase_return_\@:
    vpop {d8}
    pop {r4, r5, r6, pc}
    END_ARM_FUNCTION \name
.endm

.macro TAGGED_POINTER_LOOKUP name, tag_identity
    BEGIN_ARM_FUNCTION \name
    ldr r1, .Llookup_tag_\@
    ldrh r2, [r0, #20]
    cmp r2, r1
    addeq r0, r0, #20
    beq .Llookup_load_\@
    ldrh r2, [r0, #32]
    cmp r2, r1
    addeq r0, r0, #32
    beq .Llookup_load_\@
    ldrh r2, [r0, #44]
    cmp r2, r1
    addeq r0, r0, #44
    movne r0, #0
.Llookup_load_\@:
    ldr r0, [r0, #4]
    bx lr
    END_ARM_FUNCTION \name
.Llookup_tag_\@:
    .word \tag_identity
.endm

.macro VTABLE_RESET_RELEASE name
    BEGIN_ARM_FUNCTION \name
    push {r4, lr}
    mov r4, r0
    ldr r0, .Lvtable_identity_\@
    str r0, [r4]
    ldr r1, [r4, #20]
    cmp r1, #0
    beq .Lvtable_clear_\@
    ldr r0, [r4, #8]
    cmp r0, #0
    bne .Lvtable_clear_\@
    ldr r0, [r4, #4]
    ldr r0, [r0]
    ldr r2, [r0]
    ldr r2, [r2, #4]
    blx r2
.Lvtable_clear_\@:
    mov r0, #0
    str r0, [r4, #20]
    str r0, [r4, #24]
    mov r0, r4
    pop {r4, pc}
    END_ARM_FUNCTION \name
.Lvtable_identity_\@:
    .word arm_duplicate_templates_17_vtable_identity
.endm

Y_DIRECTION_SCALER func_00348540, arm_duplicate_templates_17_scale_a
X_DIRECTION_SCALER func_003485D0, arm_duplicate_templates_17_scale_a
X_DIRECTION_SCALER func_00348664, arm_duplicate_templates_17_scale_b
Y_DIRECTION_SCALER func_003486F8, arm_duplicate_templates_17_scale_b

SATURATING_SAMPLE_SCALER func_001A3AA4, func_001A3964
SATURATING_SAMPLE_SCALER func_001A4250, func_001A4110

INTRUSIVE_ERASE_RECYCLE func_0056E15C
INTRUSIVE_ERASE_RECYCLE func_0056EB14

TAGGED_POINTER_LOOKUP func_0013E908, arm_duplicate_templates_17_tag_0013E908
TAGGED_POINTER_LOOKUP func_00152C18, arm_duplicate_templates_17_tag_00152C18
TAGGED_POINTER_LOOKUP func_004BF440, arm_duplicate_templates_17_tag_004BF440
TAGGED_POINTER_LOOKUP func_004BF4B8, arm_duplicate_templates_17_tag_004BF4B8

VTABLE_RESET_RELEASE func_00409614
VTABLE_RESET_RELEASE func_0040F458
VTABLE_RESET_RELEASE func_00411198

.section .note.GNU-stack, "", %progbits
