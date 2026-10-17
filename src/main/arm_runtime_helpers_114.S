.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0052A400, "ax", %progbits
.balign 4
.global func_0052A400
.type func_0052A400, %function
func_0052A400:
    push {r4, r5, r6, lr}
    mov r5, r1
    mov r6, r2
    mov r4, r0
    bl func_0052A420
    str r5, [r4, #96]!
    str r6, [r4, #8]
    pop {r4, r5, r6, pc}
.size func_0052A400, . - func_0052A400

.section .text.func_0052A5C4, "ax", %progbits
.balign 4
.global func_0052A5C4
.type func_0052A5C4, %function
func_0052A5C4:
    mov r12, #3
    add r3, r12, r3, lsr #1
    push {r4, r5, r6}
    bics r12, r3, #3
    beq .L114_sat_done
    sub r12, r0, #2
    sub r0, r2, #2
    ldr r2, .L114_sat_limit
    lsr r3, r3, #2
    lsl r4, r3, #1
    sub r3, r1, #2
    mvn r5, r2
.L114_sat_loop:
    ldrsh r1, [r12, #2]
    ldrsh r6, [r3, #2]
    add r1, r1, r6
    cmp r1, #32768
    movge r1, r2
    bge .L114_sat_first
    cmn r1, #32768
    movle r1, r5
.L114_sat_first:
    strh r1, [r0, #2]
    ldrsh r1, [r12, #4]!
    ldrsh r6, [r3, #4]!
    add r1, r1, r6
    cmp r1, #32768
    movge r1, r2
    bge .L114_sat_second
    cmn r1, #32768
    movle r1, r5
.L114_sat_second:
    subs r4, r4, #1
    strh r1, [r0, #4]!
    bne .L114_sat_loop
.L114_sat_done:
    pop {r4, r5, r6}
    bx lr
.size func_0052A5C4, . - func_0052A5C4
.L114_sat_limit:
    .word 32767

.section .text.func_0052A6E0, "ax", %progbits
.balign 4
.global func_0052A6E0
.type func_0052A6E0, %function
func_0052A6E0:
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #108]
    cmp r0, #0
    beq .L114_reset_empty
    bl func_0014307C
    mov r0, #0
    str r0, [r4, #108]
.L114_reset_empty:
    mvn r0, #0
    str r0, [r4, #104]
    pop {r4, pc}
.size func_0052A6E0, . - func_0052A6E0

.section .text.func_0053FC40, "ax", %progbits
.balign 4
.global func_0053FC40
.type func_0053FC40, %function
func_0053FC40:
    push {r3, lr}
    ldr r12, [r1]
    mov r3, r2
    mov r2, sp
    str r12, [sp]
    bl func_0053FB10
    pop {r3, pc}
.size func_0053FC40, . - func_0053FC40

.section .text.func_0053FCDC, "ax", %progbits
.balign 4
.global func_0053FCDC
.type func_0053FCDC, %function
func_0053FCDC:
    push {r4, r5, r6, lr}
    add r6, r0, #8
    ldr r0, [r0, #16]
    mov r4, r6
    cmp r0, #0
    beq .L114_clear_done
    ldr r5, [r4, #4]
    cmp r5, r4
    beq .L114_clear_reset
.L114_clear_loop:
    mov r1, r5
    ldr r5, [r5, #4]
    ldr r0, [r4, #8]
    mov r2, #1
    bl func_002B807C
    cmp r5, r4
    nop
    bne .L114_clear_loop
.L114_clear_reset:
    mov r0, #0
    str r0, [r4, #8]
    str r4, [r4]
    str r4, [r4, #4]
.L114_clear_done:
    sub r0, r6, #8
    pop {r4, r5, r6, pc}
.size func_0053FCDC, . - func_0053FCDC

.section .text.func_0053FD38, "ax", %progbits
.balign 4
.global func_0053FD38
.type func_0053FD38, %function
func_0053FD38:
    push {r4, r5, r6, lr}
    mov r6, r0
    ldr r0, [r1, #8]
    mov r5, r1
    mov r1, #2
    bl func_002B80B0
    movs r4, r0
    streq r0, [r6]
    beq .L114_insert_done
    adds r0, r4, #8
    blne func_0053FCB8
    ldr r0, [r5]
    stm r4, {r0, r5}
    str r4, [r5]
    ldr r0, [r4]
    str r4, [r0, #4]
    str r4, [r6]
.L114_insert_done:
    pop {r4, r5, r6, pc}
.size func_0053FD38, . - func_0053FD38

.section .note.GNU-stack, "", %progbits
