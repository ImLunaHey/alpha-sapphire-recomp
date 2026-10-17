.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_003CBD34, "ax", %progbits
.balign 4
.global func_003CBD34
.type func_003CBD34, %function
func_003CBD34:
    cmp r0, #51
    ldrlo r1, [pc, #12]
    addlo r0, r0, r0, lsl #3
    movhs r0, #0
    addlo r0, r1, r0, lsl #3
    bx lr
.Lfunc_003CBD34_body_end:
    .word runtime_bounded_record_table_107_a
.size func_003CBD34, .Lfunc_003CBD34_body_end - func_003CBD34

.section .text.func_001E04F8, "ax", %progbits
.balign 4
.global func_001E04F8
.type func_001E04F8, %function
func_001E04F8:
    ldr r2, [pc, #20]
    add r1, r1, r1, lsl #1
    add r0, r0, #44
    add r1, r2, r1, lsl #3
    vldmia r1, {s0-s5}
    vstmia r0, {s0-s5}
    bx lr
.Lfunc_001E04F8_body_end:
    .word runtime_vector_record_table_102
.size func_001E04F8, .Lfunc_001E04F8_body_end - func_001E04F8

.section .text.func_0020675C, "ax", %progbits
.balign 4
.global func_0020675C
.type func_0020675C, %function
func_0020675C:
    ldr r2, [pc, #20]
    add r1, r1, #4
    str r2, [r0]
    add r2, r0, #4
    vldmia r1, {s0-s6}
    vstmia r2, {s0-s6}
    bx lr
.Lfunc_0020675C_body_end:
    .word runtime_record_descriptor_107_c
.size func_0020675C, .Lfunc_0020675C_body_end - func_0020675C

.section .text.func_002ACEC8, "ax", %progbits
.balign 4
.global func_002ACEC8
.type func_002ACEC8, %function
func_002ACEC8:
    ldr r2, [pc, #20]
    ldr r3, [r1]
    mov r1, #176
    str r1, [r0, #8]
    str r2, [r0, #4]
    str r3, [r0]
    bx lr
.Lfunc_002ACEC8_body_end:
    .word service_query_context_86
.size func_002ACEC8, .Lfunc_002ACEC8_body_end - func_002ACEC8

.section .text.func_00179D04, "ax", %progbits
.balign 4
.global func_00179D04
.type func_00179D04, %function
func_00179D04:
    ldr r2, [pc, #24]
    mov r3, #0
    strb r3, [r0, #4]
    str r1, [r0, #12]
    str r2, [r0]
    str r3, [r0, #8]
    strb r3, [r0, #5]
    bx lr
.Lfunc_00179D04_body_end:
    .word runtime_record_descriptor_107_e
.size func_00179D04, .Lfunc_00179D04_body_end - func_00179D04

.section .note.GNU-stack, "", %progbits
