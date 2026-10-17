.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0024FB80, "ax", %progbits
.balign 4
.global func_0024FB80
.type func_0024FB80, %function
func_0024FB80:
    push {r4, r5}
    ldr r1, [r0, #20]
    mov r5, #0
    ldr r3, [r1]
    ldr r1, .L125_traversal_root
    ldr ip, [r1, #356]
.L125_outer:
    ldr r1, [r0, #20]
    cmp r3, r1
    beq .L125_done
    ldr r1, [ip, #512]
    ldr r4, [r1, #4]
    add r4, r4, #2
    str r4, [r1, #4]
    ldr r1, [ip, #512]
    add r4, r4, #2
    str r4, [r1, #4]
    ldr r1, [r3, #36]
    ldr r2, [r1]
.L125_inner:
    cmp r2, r1
    ldrne r2, [r2]
    bne .L125_inner
    ldr r1, [ip, #512]
    cmp r4, #2
    subhi r2, r4, #2
    strhi r2, [r1, #4]
    strls r5, [r1, #4]
    ldr r1, [ip, #512]
    ldr r2, [r1, #4]
    cmp r2, #2
    subhi r2, r2, #2
    strhi r2, [r1, #4]
    strls r5, [r1, #4]
    ldr r3, [r3]
    b .L125_outer
.L125_done:
    pop {r4, r5}
    bx lr
.size func_0024FB80, . - func_0024FB80
.L125_traversal_root:
    .word global_load_29

.section .text.func_0026CFA8, "ax", %progbits
.balign 4
.global func_0026CFA8
.type func_0026CFA8, %function
func_0026CFA8:
    ldr r1, .L125_set_root
    ldr r2, [r1, #336]
    cmp r2, #0
    streq r0, [r1, #336]
    moveq r0, #1
    movne r0, #0
    bx lr
.size func_0026CFA8, . - func_0026CFA8
.L125_set_root:
    .word global_load_29

.section .text.func_0026CFC8, "ax", %progbits
.balign 4
.global func_0026CFC8
.type func_0026CFC8, %function
func_0026CFC8:
    ldr r0, .L125_clear_root
    ldr r1, [r0, #336]
    cmp r1, #0
    movne r1, #0
    strne r1, [r0, #336]
    movne r0, #1
    moveq r0, #0
    bx lr
.size func_0026CFC8, . - func_0026CFC8
.L125_clear_root:
    .word global_load_29

.section .note.GNU-stack, "", %progbits
