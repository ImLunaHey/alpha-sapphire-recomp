.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT47_BODY name, ctor, builder, cleanup, slot_a, slot_b, slot_c
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, sl, lr}
    mov     r4, r1
    mov     r6, r2
    mov     r9, r0
    mov     r8, r3
    vpush   {d8}
    sub     sp, sp, #72
    add     r0, sp, #116
    ldr     sl, [sp, #112]
    vldmia  r0, {s16-s17}
    mov     r0, r2
    bl func_00170DA4
    cmp     r0, #0
    beq     .Ldt47_0144\@
    mov     r1, r6
    mov     r0, r4
    bl func_0056D0B8
    cmp     r0, #0
    beq     .Ldt47_0164\@
    ldr     r0, [r4]
    ldr     r1, [r0, #252]
    mov     r0, r4
    blx     r1
    mov     r7, r0
    ldr     r0, [r6, #116]
    cmp     r0, #0
    ldrne   r7, [r0, #12]
    mov     r0, #1040
    bl func_00184990-4
    cmp     r0, #0
    moveq   r5, #0
    beq     .Ldt47_0088\@
    bl      \ctor
    mov     r5, r0
.Ldt47_0088\@:
    mov     r1, sl
    add     r0, sp, #56
    bl      \builder
    str     r0, [sp, #20]
    add     r0, sp, #24
    str     r8, [sp, #16]
    add     r2, r4, #16
    vstmia  r0, {s16-s17}
    add     r3, sp, #4
    ldrsb   r1, [r4, #100]
    ldr     r0, [r4, #96]
    str     r2, [sp]
    stm     r3, {r0, r1, r7}
    add     r3, r4, #92
    ldr     r0, [r5]
    ldr     r2, [r6, #68]
    mov     r1, r5
    ldr     ip, [r0, #52]
    add     r0, sp, #32
    blx     ip
    add     r3, sp, #32
    ldm     r3, {r0, r1, r2}
    add     r3, sp, #44
    stm     r3, {r0, r1, r2}
    add     r0, sp, #56
    bl      \cleanup
    mov     r4, #0
    add     r0, sp, #44
    bl func_001524C8
    cmp     r0, #0
    nop     {0}
    beq     .Ldt47_01a0\@
    bl func_0017F0D8
    cmp     r0, #0
    ldrne   r4, [r0, #12]
    mov     r2, #0
    mov     r1, r5
    mov     r0, r4
    bl func_00173A64
    ldr     r0, .Ldt47_slot_a\@
    add     r1, sp, #68
    str     r0, [sp, #68]
    mov     r0, r9
    bl func_001734DC
    add     sp, sp, #72
    vpop    {d8}
    pop     {r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt47_0144\@:
    ldr     r0, .Ldt47_slot_b\@
    mov     r1, sp
    str     r0, [sp]
    mov     r0, r9
    bl func_001734DC
    add     sp, sp, #72
    vpop    {d8}
    pop     {r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt47_0164\@:
    ldr     r4, .Ldt47_slot_c\@
    mov     r1, sp
    add     r0, sp, #4
    str     r4, [sp]
    bl func_001734DC
    ldm     r0, {r1, r2, r3}
    mov     r0, r6
    bl func_00170E24
    mov     r1, sp
    mov     r0, r9
    str     r4, [sp]
    bl func_001734DC
    add     sp, sp, #72
    vpop    {d8}
    pop     {r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt47_01a0\@:
    add     r4, sp, #44
    mov     r0, r6
    ldm     r4, {r1, r2, r3}
    bl func_00170E24
    mov     r0, r5
    mvn     r2, #0
    add     r3, r5, #4
.Ldt47_01bc\@:
    ldrex   r1, [r3]
    add     r1, r1, r2
    strex   ip, r1, [r3]
    cmp     ip, #0
    bne     .Ldt47_01bc\@
    cmp     r1, #0
    ldrbeq  r1, [r0, #8]
    cmpeq   r1, #0
    moveq   r1, #1
    strbeq  r1, [r0, #8]
    bne     .Ldt47_01f4\@
    ldr     r1, [r0]
    ldr     r1, [r1, #4]
    blx     r1
.Ldt47_01f4\@:
    add     r3, sp, #44
    ldm     r3, {r0, r1, r2}
    stm     r9, {r0, r1, r2}
    add     sp, sp, #72
    vpop    {d8}
    pop     {r4, r5, r6, r7, r8, r9, sl, pc}
.size \name, .-\name
.Ldt47_slot_a\@:
    .word \slot_a
.Ldt47_slot_b\@:
    .word \slot_b
.Ldt47_slot_c\@:
    .word \slot_c
.endm

DT47_BODY func_0053A57C, func_0053D290, func_002AD354, func_002AD3EC, \
    duplicate47_result_status_identity, \
    duplicate47_invalid_context_status_identity, \
    duplicate47_incompatible_service_status_identity

DT47_BODY func_0053A794, func_0053ECFC, func_002AD444, func_002AD4DC, \
    duplicate47_result_status_identity, \
    duplicate47_invalid_context_status_identity, \
    duplicate47_incompatible_service_status_identity
