.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT58_BODY name, ctor, id1
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, lr}
    mov     r5, r0
    bl      func_0012B95C
    mov     r4, r0
    mov     r2, #1
    adr     r1, .Ldt58_id1\@
    bl      func_0036F398
    mov     r7, r0
    mov     r2, #1
    adr     r1, .Ldt58_id2\@
    mov     r0, r4
    bl      func_0036F398
    mov     r6, r0
    mov     r2, #1
    adr     r1, .Ldt58_id3\@
    mov     r0, r4
    bl      func_0036F398
    mov     r8, r0
    mov     r2, #0
    mov     r1, r7
    mov     r0, r4
    bl      func_0036F4D0
    mov     r2, #0
    mov     r1, r6
    mov     r0, r4
    bl      func_0036F4D0
    mov     r2, #0
    mov     r1, r8
    mov     r0, r4
    bl      func_0036F4D0
    ldr     r1, [r5, #4]
    mov     r0, #64
    bl      func_00123480
    cmp     r0, #0
    moveq   r4, #0
    beq     .Ldt58_constructed\@
    bl      \ctor
    mov     r4, r0
.Ldt58_constructed\@:
    mov     r1, r4
    mov     r0, r5
    str     r5, [r4, #28]
    bl      func_003AB384
    ldr     r0, [r4, #20]
    mov     r9, #3
    cmp     r0, #0
    ldr     r0, [r5, #4]
    bne     .Ldt58_have_storage\@
    mov     r1, #12
    bl      func_0012B95C + 16
    add     r1, r4, #20
    stm     r1, {r0, r9}
.Ldt58_have_storage\@:
    ldr     r0, [r4, #24]
    cmp     r0, #0
    bhi     .Ldt58_store_first\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    bl      func_0011EF4C
.Ldt58_store_first\@:
    ldr     r0, [r4, #20]
    str     r6, [r0]
    ldr     r0, [r4, #24]
    cmp     r0, #1
    bhi     .Ldt58_store_second\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    bl      func_0011EF4C
.Ldt58_store_second\@:
    ldr     r0, [r4, #20]
    str     r8, [r0, #4]
    ldr     r0, [r4, #24]
    cmp     r0, #2
    bhi     .Ldt58_store_third\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    bl      func_0011EF4C
.Ldt58_store_third\@:
    ldr     r0, [r4, #20]
    str     r7, [r0, #8]
    mov     r0, r4
    pop     {r4, r5, r6, r7, r8, r9, r10, pc}
.size \name, .-\name
.Ldt58_id1\@:
    .ifc \name,func_00369FAC
    .ascii  "neutral-dt58-identity-a01\0\0\0neutral-dt58-id02x\0\0neutral-dt58-shared-03\0\0"
    .else
    .ascii  "neutral-dt58-identity-b002\0\0neutral-dt58-id02x\0\0neutral-dt58-shared-03\0\0"
    .endif
.set .Ldt58_id2\@, .Ldt58_id1\@ + 28
.set .Ldt58_id3\@, .Ldt58_id1\@ + 48
.endm

DT58_BODY func_00369FAC, func_0019C250, neutral-dt58-identity-a01
DT58_BODY func_0036A428, func_0019C2A0, neutral-dt58-identity-b002
