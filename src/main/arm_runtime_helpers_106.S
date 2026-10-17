.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00114B50, "ax", %progbits
.balign 4
.global func_00114B50
.type func_00114B50, %function
func_00114B50:
    mov r1, #0
    ldr r12, [pc, #44]
    strb r1, [r0, #4]
    str r1, [r0, #40]
    str r12, [r0]
    str r1, [r0, #44]
    strb r1, [r0, #49]
    strb r1, [r0, #50]
    strb r1, [r0, #48]
    mov r2, r1
    mov r3, r1
    strb r1, [r0, #51]
    strd r2, r3, [r0, #56]
    bx lr
.Lfunc_00114B50_body_end:
    .word runtime_record_descriptor_106_a
.size func_00114B50, .Lfunc_00114B50_body_end - func_00114B50

.section .text.func_00114B8C, "ax", %progbits
.balign 4
.global func_00114B8C
.type func_00114B8C, %function
func_00114B8C:
    ldr r2, [pc, #36]
    mov r1, #0
    strb r1, [r0, #4]
    str r1, [r0, #72]
    str r2, [r0]
    str r1, [r0, #76]
    str r1, [r0, #92]
    strb r1, [r0, #81]
    strb r1, [r0, #80]
    strb r1, [r0, #82]
    bx lr
.Lfunc_00114B8C_body_end:
    .word runtime_record_descriptor_106_b
.size func_00114B8C, .Lfunc_00114B8C_body_end - func_00114B8C

.section .text.func_0014A214, "ax", %progbits
.balign 4
.global func_0014A214
.type func_0014A214, %function
func_0014A214:
    ldr r1, [pc, #40]
    mov r2, #0
    stmia r0, {r1, r2}
    add r1, r0, #272
    str r2, [r0, #8]
    str r2, [r0, #272]
    mvn r3, #0
    strd r2, r3, [r1, #4]
    mov r1, #47
    strb r1, [r0, #12]
    strb r2, [r0, #13]
    bx lr
.Lfunc_0014A214_body_end:
    .word duplicate_template_23_type_func_0032ADB0
.size func_0014A214, .Lfunc_0014A214_body_end - func_0014A214

.section .text.func_0014FBA4, "ax", %progbits
.balign 4
.global func_0014FBA4
.type func_0014FBA4, %function
func_0014FBA4:
    ldr r2, [pc, #28]
    mov r1, #0
    str r1, [r0, #4]
    str r2, [r0]
    str r1, [r0, #8]
    str r1, [r0, #12]
    strb r1, [r0, #12]
    strb r1, [r0, #13]
    bx lr
.Lfunc_0014FBA4_body_end:
    .word runtime_record_descriptor_106_d
.size func_0014FBA4, .Lfunc_0014FBA4_body_end - func_0014FBA4

.section .text.func_00174D9C, "ax", %progbits
.balign 4
.global func_00174D9C
.type func_00174D9C, %function
func_00174D9C:
    ldr r2, [pc, #40]
    mov r1, #0
    str r1, [r0, #4]
    str r2, [r0]
    str r1, [r0, #8]
    str r1, [r0, #12]
    str r1, [r0, #16]
    str r1, [r0, #20]
    strb r1, [r0, #24]
    str r1, [r0, #28]
    str r1, [r0, #32]
    bx lr
.Lfunc_00174D9C_body_end:
    .word runtime_record_descriptor_106_e
.size func_00174D9C, .Lfunc_00174D9C_body_end - func_00174D9C

.section .note.GNU-stack, "", %progbits
