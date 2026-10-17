.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001734DC, "ax", %progbits
.balign 4
.global func_001734DC
.type func_001734DC, %function
func_001734DC:
    ldr r2, [r1]
    mov r1, #111
    str r2, [r0]
    ldr r2, [pc, #8]
    str r1, [r0, #8]
    str r2, [r0, #4]
    bx lr
.Lfunc_001734DC_body_end:
    .word service_query_context_86
.size func_001734DC, .Lfunc_001734DC_body_end - func_001734DC

.section .text.func_00179360, "ax", %progbits
.balign 4
.global func_00179360
.type func_00179360, %function
func_00179360:
    ldr r1, [pc, #20]
    mov r2, #0
    stmia r0, {r1, r2}
    mov r1, #1
    str r1, [r0, #4]
    strb r2, [r0, #8]
    bx lr
.Lfunc_00179360_body_end:
    .word duplicate_template_25_shared_type
.size func_00179360, .Lfunc_00179360_body_end - func_00179360

.section .text.func_0024F928, "ax", %progbits
.balign 4
.global func_0024F928
.type func_0024F928, %function
func_0024F928:
    ldr r1, [pc, #12]
    str r1, [r0]
    mov r1, #0
    str r1, [r0, #4]
    bx lr
.Lfunc_0024F928_body_end:
    .word duplicate_template_25_shared_type
.size func_0024F928, .Lfunc_0024F928_body_end - func_0024F928

.section .text.func_0033965C, "ax", %progbits
.balign 4
.global func_0033965C
.type func_0033965C, %function
func_0033965C:
    ldr r1, [pc, #16]
    str r1, [r0]
    mov r1, #0
    str r1, [r0, #1656]
    str r1, [r0, #1660]
    bx lr
.Lfunc_0033965C_body_end:
    .word runtime_record_descriptor_104_a
.size func_0033965C, .Lfunc_0033965C_body_end - func_0033965C

.section .text.func_0039DFAC, "ax", %progbits
.balign 4
.global func_0039DFAC
.type func_0039DFAC, %function
func_0039DFAC:
    ldr r2, [pc, #20]
    mov r1, #254
    str r2, [r0]
    mov r2, #0
    strb r1, [r0, #4]
    str r2, [r0, #8]
    bx lr
.Lfunc_0039DFAC_body_end:
    .word runtime_record_descriptor_104_b
.size func_0039DFAC, .Lfunc_0039DFAC_body_end - func_0039DFAC

.section .note.GNU-stack, "", %progbits
