.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001854A0, "ax", %progbits
.balign 4
.global func_001854A0
.type func_001854A0, %function
func_001854A0:
    push    {r4-r10, lr}
    mov     r5, r1
    sub     sp, sp, #16
    mov     r8, #0
    ldr     r1, [pc, #244]
    mov     r6, r2
    stmia   r0, {r1, r8}
    mov     r1, #536870912
    add     r0, r0, #16
    bl      func_0018B220
    ldr     r3, [pc, #224]
    ldr     r1, [pc, #224]
    mov     r2, #0
    add     r0, r0, #48
    bl      func_0018AAEC
    ldr     r3, [pc, #204]
    ldr     r1, [pc, #208]
    mov     r2, #0
    add     r0, r0, #112
    bl      func_0018AAEC
    str     r8, [r0, #-168]
    sub     r4, r0, #176
    str     r8, [r0, #-164]
    ldr     r0, [pc, #184]
    cmn     r5, #1
    moveq   r5, #15
    cmn     r6, #1
    str     r0, [r4]
    mov     r7, r5
    moveq   r6, #8
    mov     r0, #112
    bl      func_00184990
    movs    r5, r0
    movne   r1, #112
    .inst   0x1bfffffe
    .reloc  . - 4, R_ARM_CALL, service_buffer_initialize_secondary_100
    ldr     r9, [pc, #140]
    str     r5, [r4, #288]
    ldr     r10, [pc, #136]
    str     r9, [r5, #32]
    ldr     r0, [r4, #288]
    ldr     r1, [pc, #128]
    mov     r2, #56
    str     r10, [r0, #36]
    ldr     r0, [r4, #288]
    str     r8, [r0, #40]
    ldr     r0, [r4, #288]
    bl      func_0018F654
    ldr     r0, [r4, #288]
    ldr     r2, [pc, #96]
    mov     r1, #56
    mov     r3, r7
    str     r9, [r0, #88]
    ldr     r0, [r4, #288]
    str     r10, [r0, #92]
    ldr     r0, [r4, #288]
    str     r8, [r0, #96]
    str     r1, [sp, #12]
    str     r2, [sp, #8]
    stmia   sp, {r6, r8}
    ldr     r0, [r4, #288]
    mov     r2, #8
    mvn     r1, #0
    add     r0, r0, #56
    bl      func_0018CE64
    add     sp, sp, #16
    mov     r0, r4
    pop     {r4-r10, pc}
.size func_001854A0, . - func_001854A0

    .word   service_manager_vtable_100
    .word   ipc_empty_text_63
    .word   service_channel_descriptor_primary_100
    .word   service_channel_descriptor_secondary_100
    .word   service_instance_vtable_100
    .word   service_buffer_first_callback_100
    .word   service_buffer_second_callback_100
    .word   service_buffer_template_100

.section .note.GNU-stack, "", %progbits
