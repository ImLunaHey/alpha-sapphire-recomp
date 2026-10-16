.syntax unified
.arm
.fpu vfpv2

.macro polymorphic_record_vector_insert name, primary_dispatch, secondary_dispatch
    .section .text.\name,"ax",%progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
    mov r5, r0
    mov r7, r1
    mov r9, r2
    ldr r0, [r0, #8]
    ldr r1, [r5]
    ldr fp, .Ldt45_pool\@
    ldr r6, .Ldt45_pool\@+4
    sub r0, r0, r1
    ldr r4, .Ldt45_pool\@+8
    smull r2, r0, fp, r0
    asr r2, r0, #2
    sub r2, r2, r0, asr #31
    ldr r0, [r5, #4]
    sub r1, r0, r1
    smull r3, r1, fp, r1
    asr r3, r1, #2
    sub r1, r3, r1, asr #31
    cmp r2, r1
    bls .Ldt45_00c4\@
    add r1, r0, #24
    cmp r0, #0
    str r1, [r5, #4]
    beq .Ldt45_0084\@
    sub r1, r0, #16
    add r5, r0, #8
    ldm r1, {r1, r3}
    add r2, r0, #16
    stm r5, {r1, r3}
    sub r1, r0, #8
    ldm r1, {r1, r3}
    stm r2, {r1, r3}
    str r4, [r0]
.Ldt45_0084\@:
    sub r1, r0, #24
    cmp r7, r1
    beq .Ldt45_00b0\@
.Ldt45_0090\@:
    sub r1, r1, #24
    sub r0, r0, #24
    ldrd r2, r3, [r1, #8]
    cmp r7, r1
    strd r2, r3, [r0, #8]
    ldrd r2, r3, [r1, #16]
    strd r2, r3, [r0, #16]
    bne .Ldt45_0090\@
.Ldt45_00b0\@:
    ldrd r0, r1, [r9, #8]
    strd r0, r1, [r7, #8]
    ldrd r0, r1, [r9, #16]
    strd r0, r1, [r7, #16]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Ldt45_00c4\@:
    add r0, r1, r1, lsr #1
    add sl, r0, r1, lsr #3
    add r0, r1, #32
    cmp sl, r0
    movlo sl, r0
    add r0, sl, sl, lsl #1
    lsl r0, r0, #3
    bl func_00184990
    ldr r2, [r5]
    mov r8, r0
    cmp r2, r7
    beq .Ldt45_0134\@
.Ldt45_00f4\@:
    cmp r0, #0
    beq .Ldt45_0124\@
    add r3, r2, #8
    str r6, [r0]
    add r1, r0, #16
    vldmia r3, {s0, s1}
    add r3, r0, #8
    vstmia r3, {s0, s1}
    add r3, r2, #16
    ldm r3, {r3, ip}
    stm r1, {r3, ip}
    str r4, [r0]
.Ldt45_0124\@:
    add r2, r2, #24
    cmp r2, r7
    add r0, r0, #24
    bne .Ldt45_00f4\@
.Ldt45_0134\@:
    ldr r0, [r5]
    sub r0, r7, r0
    smull r1, r0, fp, r0
    asr r1, r0, #2
    sub r0, r1, r0, asr #31
    add r0, r0, r0, lsl #1
    adds r0, r8, r0, lsl #3
    beq .Ldt45_0178\@
    add r1, r9, #8
    str r6, [r0]
    ldm r1, {r1, r2}
    add r3, r0, #8
    add r9, r9, #16
    stm r3, {r1, r2}
    ldm r9, {r1, r2}
    str r4, [r0], #16
    stm r0, {r1, r2}
.Ldt45_0178\@:
    ldr r0, [r5]
    ldr r2, [r5, #4]
    sub r0, r7, r0
    cmp r7, r2
    smull r1, r0, fp, r0
    asr r1, r0, #2
    sub r0, r1, r0, asr #31
    add r0, r0, r0, lsl #1
    add r0, r8, r0, lsl #3
    add r1, r0, #24
    beq .Ldt45_01e4\@
.Ldt45_01a4\@:
    movs r0, r1
    beq .Ldt45_01d4\@
    add r3, r7, #8
    str r6, [r0]
    ldm r3, {r3, ip}
    add r9, r0, #8
    stm r9, {r3, ip}
    add r3, r7, #16
    add r9, r0, #16
    ldm r3, {r3, ip}
    stm r9, {r3, ip}
    str r4, [r1]
.Ldt45_01d4\@:
    add r7, r7, #24
    cmp r7, r2
    add r1, r0, #24
    bne .Ldt45_01a4\@
.Ldt45_01e4\@:
    ldm r5, {r4, r6}
    sub r0, r6, r4
    cmp r4, r6
    smull r1, r0, fp, r0
    asr r1, r0, #2
    sub r7, r1, r0, asr #31
    beq .Ldt45_021c\@
.Ldt45_0200\@:
    ldr r0, [r4]
    ldr r1, [r0]
    mov r0, r4
    blx r1
    add r4, r4, #24
    cmp r4, r6
    bne .Ldt45_0200\@
.Ldt45_021c\@:
    ldr r0, [r5]
    bl func_00160F9C
    add r0, r7, r7, lsl #1
    add r1, sl, sl, lsl #1
    add r0, r8, r0, lsl #3
    add r1, r8, r1, lsl #3
    add r0, r0, #24
    str r8, [r5]
    strd r0, r1, [r5, #4]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
    .size \name, .-\name
.Ldt45_pool\@:
    .word arm_duplicate_templates_45_divide_by_24_identity
    .word \primary_dispatch
    .word \secondary_dispatch
.endm

    polymorphic_record_vector_insert func_0056FDB0, func_0056FDB0_primary_dispatch_identity, func_0056FDB0_secondary_dispatch_identity
    polymorphic_record_vector_insert func_00570000, func_00570000_primary_dispatch_identity, func_00570000_secondary_dispatch_identity
