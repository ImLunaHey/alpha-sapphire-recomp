.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT62_BODY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, lr}
    bic     r2, r0, #255
    mov     r4, r0
    add     r5, r0, #36
    sub     sp, sp, #12
    orr     r6, r2, #1
    mov     r0, r5
    bl      func_0017EA3C
    ldr     r7, .Ldt62_context\@
    mov     r0, sp
    ldr     r1, [r7, #12]
    bl      func_0017E30C
    lsrs    r1, r0, #31
    blne    func_001603A0
    ldr     r1, [r4, #100]
    ldr     r3, [sp]
    mov     r12, r1
    ldr     r0, [r1, #4]
    cmp     r0, #0
    beq     .Ldt62_search_done\@
.Ldt62_search\@:
    ldr     r2, [r0, #16]
    cmp     r2, r3
    movhs   r1, r0
    ldrhs   r0, [r0, #8]
    ldrlo   r0, [r0, #12]
    cmp     r0, #0
    bne     .Ldt62_search\@
.Ldt62_search_done\@:
    cmp     r1, r12
    beq     .Ldt62_no_exact\@
    ldr     r0, [r1, #16]
    cmp     r0, r3
    bls     .Ldt62_candidate_checked\@
.Ldt62_no_exact\@:
    mov     r1, r12
.Ldt62_candidate_checked\@:
    cmp     r1, r12
    bne     .Ldt62_found\@
    ldr     r1, [r7, #12]
    add     r0, sp, #4
    bl      func_0017E30C
    lsrs    r1, r0, #31
    nop
    blne    func_001603A0
    ldr     r0, [sp, #4]
    mov     r1, sp
    str     r0, [sp]
    add     r0, r4, #84
    bl      func_0018D348
    add     r1, r4, #12
    nop
    bl      func_0018D6D4
    ldr     r1, [r7, #12]
    add     r0, sp, #4
    bl      func_0017E30C
    lsrs    r1, r0, #31
    nop
    blne    func_001603A0
    ldr     r0, [sp, #4]
    mov     r1, sp
    str     r0, [sp]
    add     r0, r4, #84
    bl      func_0018D348
    mov     r4, r0
    sxtb    r0, r6
    cmp     r0, #0
    beq     .Ldt62_return\@
.Ldt62_cleanup\@:
    mov     r0, r5
    bl      func_0017EA90
    nop
    nop
    b       .Ldt62_return\@
.Ldt62_found\@:
    sxtb    r0, r6
    cmp     r0, #0
    add     r4, r1, #20
    bne     .Ldt62_cleanup\@
.Ldt62_return\@:
    add     sp, sp, #12
    mov     r0, r4
    pop     {r4, r5, r6, r7, pc}
.size \name, .-\name
.Ldt62_context\@:
    .word duplicate62_shared_context_identity
.endm

DT62_BODY func_0052DCB4
DT62_BODY func_0056CF84
