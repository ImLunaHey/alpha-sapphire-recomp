.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT69_SEARCH name, prepare, examine
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, lr}
    mov     r5, r3
    mov     r7, r2
    mov     r8, r0
    mov     r9, r1
    vpush   {d8-d15}
    sub     sp, sp, #76
    add     r2, sp, #168
    add     r12, sp, #28
    add     r4, sp, #24
    add     r3, sp, #12
    vldmia  r2, {s16-s31}
    add     r2, sp, #20
    stmia   sp, {r2, r4, r12}
    add     r2, sp, #16
    bl      \prepare
    ldrsh   r6, [sp, #12]
    mov     r4, #0
    cmp     r6, #0
    ble     .Ldt69_search_miss\@
.Ldt69_search_loop\@:
    add     r0, sp, #4
    add     r3, sp, #68
    vstmia  r0, {s16-s31}
    mov     r2, r4
    mov     r1, r9
    mov     r0, r8
    str     r5, [sp]
    bl      \examine
    ldrsh   r2, [sp, #68]
    cmp     r2, r7
    beq     .Ldt69_search_found\@
    add     r2, r4, #1
    sxth    r4, r2
    cmp     r6, r4
    bgt     .Ldt69_search_loop\@
.Ldt69_search_miss\@:
    add     sp, sp, #76
    mov     r2, #0
    vpop    {d8-d15}
    mov     r1, r2
    mov     r0, r2
    pop     {r4, r5, r6, r7, r8, r9, lr}
    b       func_0014EA68-4
.Ldt69_search_found\@:
    add     sp, sp, #76
    vpop    {d8-d15}
    pop     {r4, r5, r6, r7, r8, r9, pc}
.size \name, .-\name
.endm

.macro DT69_ITERATE name, dispatch
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, lr}
    mov     r5, r0
    mov     r6, r1
    ldr     r7, .Ldt69_iterate_identity\@
    vpush   {d8}
    vmov.f32 s16, s0
    ldrb    r0, [r7, #1]
    cmp     r0, #0
    movne   r4, #0
    beq     .Ldt69_iterate_return\@
.Ldt69_iterate_loop\@:
    mov     r2, r6
    mov     r1, r5
    mov     r0, r4
    bl      func_0044E250
    cmp     r0, #0
    nop     {0}
    beq     .Ldt69_iterate_next\@
    ldrb    r1, [r7, #1]
    mov     r0, r4
    cmp     r1, #0
    moveq   r1, #4
    beq     .Ldt69_iterate_ready\@
    cmp     r0, #11
    bcc     .Ldt69_iterate_clamp\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    mov     r0, r0
    mov     r0, #0
.Ldt69_iterate_clamp\@:
    add     r0, r0, #4
    and     r1, r0, #255
.Ldt69_iterate_ready\@:
    sub     r0, r1, #4
    cmp     r0, #10
    ldr     r0, [r7, #16]
    vmov.f32 s0, s16
    ldrls   r0, [r0, #4]
    blls    \dispatch
.Ldt69_iterate_next\@:
    add     r0, r4, #1
    and     r4, r0, #255
    cmp     r4, #11
    bcc     .Ldt69_iterate_loop\@
.Ldt69_iterate_return\@:
    vpop    {d8}
    pop     {r4, r5, r6, r7, r8, pc}
.size \name, .-\name
.Ldt69_iterate_identity\@:
    .word global_load_11
.endm

.macro DT69_PACK name, map, classify
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r3, r4, r5, r6, r7, lr}
    mov     r4, r0
    mov     r6, r1
    ldr     r1, [r0]
    mov     r5, r2
    mov     r0, r2
    bl      \map
    mov     r0, r5
    bl      \classify
    cmp     r0, #1
    moveq   r1, #1
    movne   r1, #0
    mov     r0, #0
    and     r1, r1, #3
    orr     r1, r1, r0
    orr     r1, r1, r0
    str     r0, [sp]
    lsl     r2, r1, #16
    mov     r0, r4
    lsr     r2, r2, #24
    lsl     r2, r2, #8
    and     r2, r2, #65280
    orr     r3, r1, r2
    ldr     r2, [r4]
    mov     r1, r6
    bl      func_0013D4AC
    pop     {r3, r4, r5, r6, r7, pc}
.size \name, .-\name
.endm

.macro DT69_ALLOCATE name, attach
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r5, r0
    bl      service_context_secondary_69
    mov     r1, r0
    mov     r0, #40
    bl      func_00123480
    cmp     r0, #0
    beq     .Ldt69_allocate_attach\@
    mov     r4, r0
    mov     r0, r5
    bl      service_context_secondary_69
    mov     r1, r0
    mov     r0, r4
    bl      func_00109434
    ldr     r2, .Ldt69_allocate_identity\@
    mov     r1, #0
    str     r1, [r0, #24]
    str     r2, [r0]
    strb    r1, [r0, #37]
.Ldt69_allocate_attach\@:
    mov     r4, r0
    mov     r1, r0
    mov     r0, r5
    bl      \attach
    mov     r0, r4
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.Ldt69_allocate_identity\@:
    .word arm_duplicate_templates_69_allocated_node_dispatch_identity
.endm

.macro DT69_COPY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, lr}
    sub     sp, sp, #64
    mov     r4, r0
    mov     r2, #64
    mov     r0, sp
    bl      func_00300B28
    ldr     r0, [sp]
    ldr     r1, .Ldt69_copy_tag\@
    cmp     r0, r1
    movne   r0, #0
    bne     .Ldt69_copy_return\@
    add     r1, sp, #4
    vldmia  r1, {s1-s7}
    add     r1, r4, #60
    str     r0, [r4, #56]
    add     r4, r4, #88
    vstmia  r1, {s1-s7}
    add     r1, sp, #32
    mov     r0, #1
    vldmia  r1, {s0-s7}
    vstmia  r4, {s0-s7}
.Ldt69_copy_return\@:
    add     sp, sp, #64
    pop     {r4, pc}
.size \name, .-\name
.Ldt69_copy_tag\@:
    .word arm_duplicate_templates_69_copied_record_tag_identity
.endm

.global func_0014EA68
.global indexed_float_dispatch_secondary_a_69
.global indexed_float_dispatch_secondary_b_69
.global service_context_secondary_69
.global global_load_11
.global arm_duplicate_templates_69_allocated_node_dispatch_identity
.global arm_duplicate_templates_69_copied_record_tag_identity

DT69_SEARCH func_0049866C, func_00497E48, func_0049840C
DT69_SEARCH func_004995CC, func_00498DA0, func_00499388
DT69_ITERATE func_0044C63C, indexed_float_dispatch_secondary_a_69
DT69_ITERATE func_0044EC5C, indexed_float_dispatch_secondary_b_69
DT69_PACK func_00450D90, func_004D12A8, func_004D26FC
DT69_PACK func_0045174C, func_004D1E10, func_004D1CDC
DT69_ALLOCATE func_0052AF8C, func_00108CB0
DT69_ALLOCATE func_0052B1A8, func_001E711C
DT69_COPY func_0041097C
DT69_COPY func_004109DC
