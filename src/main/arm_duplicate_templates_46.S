.syntax unified
.arm

.global func_002F7B18
.global func_004B9B50
.global func_002EBDF8_required_flags_identity
.global func_002EBDF8_object_dispatch_identity
.global func_002F9968_required_flags_identity
.global func_002F9968_object_dispatch_identity

.macro CONDITIONAL_OBJECT_RESOLVE_AND_APPEND name, required_flags, object_dispatch
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
    cmp r1, #0
    mov r4, r0
    mov r7, r2
    mov r5, r3
    beq .Ldt46_002c\@
    ldr r0, [r1]
    ldr r2, .Ldt46_pool\@
    bics r0, r2, r0
    moveq r6, r1
    beq .Ldt46_0030\@
.Ldt46_002c\@:
    mov r6, #0
.Ldt46_0030\@:
    ldr r0, [r5]
    mov r2, #4
    mov r1, #380
    ldr r3, [r0, #8]
    mov r0, r5
    blx r3
    cmp r0, #0
    mov sl, #0
    beq .Ldt46_0080\@
    mov r1, r5
    mov r3, r7
    mov r2, r6
    bl func_002F7B18
    mov r1, #0
    str r1, [r0, #328]
    ldr r1, .Ldt46_pool\@+4
    str r1, [r0]
    str sl, [r0, #368]
    str sl, [r0, #372]
    str sl, [r0, #376]
.Ldt46_0080\@:
    mov r8, r0
    ldr r0, [r0]
    mov r1, r5
    ldr r2, [r0, #36]
    mov r0, r8
    blx r2
    cmp r4, #0
    beq .Ldt46_01ec\@
    ldr r0, [r4, #12]
    mov r1, r8
    mov r5, r8
    cmp r0, #0
    mov r6, #1
    beq .Ldt46_00d0\@
    cmp r0, r1
    beq .Ldt46_01ec\@
    bl func_004B9B50
    cmp r0, #0
    nop
    bne .Ldt46_01ec\@
.Ldt46_00d0\@:
    ldr r0, [r5, #12]
    cmp r0, #0
    bne .Ldt46_01ec\@
    ldr r2, [r4, #24]
    ldrd r0, [r4, #28]
    mov fp, #1
    sub r2, r0, r2
    bic r0, r1, #-1073741824
    cmp r0, r2, asr #2
    bgt .Ldt46_01c8\@
    cmp r0, #0
    lslne r7, r0, #1
    moveq r7, #1
    bic r0, r1, #-1073741824
    cmp r0, r7
    bge .Ldt46_01c8\@
    ldr r0, [r4, #20]
    cmp r0, #0
    beq .Ldt46_01f4\@
    and r0, r1, #-1073741824
    cmp r0, #1073741824
    mov fp, r6
    bne .Ldt46_01f4\@
    ldr r0, [r4, #20]
    lsl r1, r7, #2
    ldr r2, [r0]
    ldr r3, [r2, #8]
    mov r2, #32
    blx r3
    movs r6, r0
    beq .Ldt46_01f4\@
    add r0, r4, #24
    mov r9, #0
    ldm r0, {r0, r2}
    cmp r0, r2
    movne r1, r6
    beq .Ldt46_0190\@
.Ldt46_0164\@:
    cmp r1, #0
    ldrne ip, [r0]
    add r0, r0, #4
    strne ip, [r1]
    cmp r0, r2
    add r1, r1, #4
    bne .Ldt46_0164\@
    ldr r0, [r4, #28]
    ldr r1, [r4, #24]
    sub r0, r0, r1
    asr r9, r0, #2
.Ldt46_0190\@:
    ldr r1, [r4, #24]
    cmp r1, #0
    beq .Ldt46_01ac\@
    ldr r0, [r4, #20]
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Ldt46_01ac\@:
    add r0, r6, r9, lsl #2
    str r0, [r4, #28]
    str r6, [r4, #24]
    ldr r0, [r4, #32]
    and r0, r0, #-1073741824
    orr r0, r0, r7
    str r0, [r4, #32]
.Ldt46_01c8\@:
    ldr r0, [r4, #28]
    cmp r0, #0
    strne r5, [r0]
    ldr r0, [r4, #28]
    add r0, r0, #4
    str r0, [r4, #28]
.Ldt46_01e0\@:
    cmp fp, #0
    ldrne r0, [r4, #16]
    strne r0, [r5, #12]
.Ldt46_01ec\@:
    mov r0, r8
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Ldt46_01f4\@:
    mov fp, sl
    b .Ldt46_01e0\@
.size \name, .-\name
.Ldt46_pool\@:
    .word \required_flags
    .word \object_dispatch
.endm

CONDITIONAL_OBJECT_RESOLVE_AND_APPEND func_002EBDF8, func_002EBDF8_required_flags_identity, func_002EBDF8_object_dispatch_identity
CONDITIONAL_OBJECT_RESOLVE_AND_APPEND func_002F9968, func_002F9968_required_flags_identity, func_002F9968_object_dispatch_identity

.section .note.GNU-stack, "", %progbits
