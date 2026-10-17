.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00185BDC, "ax", %progbits
.balign 4
.global func_00185BDC
.type func_00185BDC, %function
func_00185BDC:
    push    {r4-r8, lr}
    mov     r5, #0
    str     r5, [r0, #4]
    mov     r2, #1
    str     r2, [r0, #4]
    ldr     r2, .Lnode_vtable
    strb    r5, [r0, #8]
    str     r2, [r0], #12
    bl      func_0018BF64
    mov     r1, #1
    strh    r1, [r0, #8]
    str     r5, [r0, #12]
    sub     r6, r0, #12
    str     r5, [r0, #16]
    ldr     r0, .Lcontainer_vtable
    add     r4, r6, #32
    mov     r7, r1
    str     r0, [r6]
    str     r5, [r6, #32]
    str     r5, [r6, #36]
    str     r5, [r6, #40]
    str     r5, [r6, #44]
    str     r5, [r6, #48]
    mov     r0, #12
    str     r5, [r6, #52]
    bl      func_00184990
    mov     r5, r0
    mov     r0, #12
    bl      func_00184990
    str     r0, [r5, #8]
    ldr     r0, [r4]
    stm     r5, {r0, r7}
    str     r5, [r4]
    ldr     r0, [r5, #8]
    add     r1, r0, #12
    strd    r0, [r4, #8]
    add     r1, r0, #12
    str     r0, [r4, #16]
    str     r1, [r4, #8]
    str     r0, [r0]
    ldr     r0, [r4, #16]
    str     r0, [r0, #4]
    mov     r0, r6
    pop     {r4-r8, pc}
.size func_00185BDC, . - func_00185BDC

.Lnode_vtable:
    .word   service_node_vtable_85
.Lcontainer_vtable:
    .word   service_container_vtable_104

.section .note.GNU-stack, "", %progbits
