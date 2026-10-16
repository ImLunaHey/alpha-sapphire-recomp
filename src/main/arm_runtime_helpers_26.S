.syntax unified
.arch armv6k
.arm

.section .text.func_002DBE58,"ax",%progbits
.balign 4
.global func_002DBE58
.type func_002DBE58, %function
func_002DBE58:
    push {r0-r3}
    push {r4, lr}
    add r3, sp, #20
    ldr r2, [sp, #16]
    bl runtime_stacked_argument_helper_26
    pop {r4}
    ldr pc, [sp], #20
.size func_002DBE58, .-func_002DBE58

.section .text.func_002DBE74,"ax",%progbits
.balign 4
.global func_002DBE74
.type func_002DBE74, %function
func_002DBE74:
    push {r4, lr}
    mov r4, r0
    sub sp, sp, #40
    mov r0, r1
    mov r2, sp
    add r1, r4, #24
    bl runtime_record_expander_26
    ldm sp, {r0, r1, r2}
    add r3, r4, #36
    stm r3, {r0, r1, r2}
    add r3, sp, #12
    ldm r3, {r0, r1, r2}
    add r3, r4, #48
    add r4, r4, #60
    stm r3, {r0, r1, r2}
    add r3, sp, #24
    ldm r3, {r0, r1, r2}
    stm r4, {r0, r1, r2}
    add sp, sp, #40
    pop {r4, pc}
.size func_002DBE74, .-func_002DBE74

.global runtime_stacked_argument_helper_26
.global runtime_record_expander_26

.section .note.GNU-stack,"",%progbits
