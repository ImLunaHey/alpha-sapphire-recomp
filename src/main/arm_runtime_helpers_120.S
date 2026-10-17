.syntax unified
.arch armv6k
.fpu vfpv2
.arm

/* Original implementation of the behavioral schedules in the lane specification. */
.section .text.func_00111E70, "ax", %progbits
.balign 4
.global func_00111E70
.type func_00111E70, %function
func_00111E70:
    cmp r0, #0
    beq .Lsetter_return_120
    ldr r1, .Lsetter_root_120
    ldr r1, [r1, #72]
    ldr r1, [r1]
    str r0, [r1, #1648]
.Lsetter_return_120:
    bx lr
.size func_00111E70, . - func_00111E70
.Lsetter_root_120:
    .word runtime_setter_root_120

.section .text.func_0011911C, "ax", %progbits
.balign 4
.global func_0011911C
.type func_0011911C, %function
func_0011911C:
    ldr r2, .Ldescriptor_primary_120
    mov r1, #104
    str r2, [r0]
    ldr r2, .Ldescriptor_secondary_120
    str r1, [r0, #8]
    str r2, [r0, #4]
    bx lr
.size func_0011911C, . - func_0011911C
.Ldescriptor_primary_120:
    .word runtime_descriptor_primary_120
.Ldescriptor_secondary_120:
    .word runtime_descriptor_secondary_120

.section .text.func_0012AC44, "ax", %progbits
.balign 4
.global func_0012AC44
.type func_0012AC44, %function
func_0012AC44:
    mov r2, r1
    mov r1, r0
    mov r0, r2
    mov r0, r0
    cmp r1, #28
    ldrcc r2, .Ltable_root_120
    strcc r0, [r2, r1, lsl #2]
    bx lr
.size func_0012AC44, . - func_0012AC44
.Ltable_root_120:
    .word runtime_table_root_120

.section .text.func_0012B594, "ax", %progbits
.balign 4
.global func_0012B594
.type func_0012B594, %function
func_0012B594:
    cmp r0, #0
    beq .Lpair_return_120
    ldr r2, .Lpair_template_120
    ldm r2, {r1, r2}
    stm r0, {r1, r2}
.Lpair_return_120:
    bx lr
.size func_0012B594, . - func_0012B594
.Lpair_template_120:
    .word runtime_pair_template_120
