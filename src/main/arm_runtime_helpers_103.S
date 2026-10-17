.syntax unified
.arch armv6k
.arm

.section .text.func_00112098, "ax", %progbits
.balign 4
.global func_00112098
.type func_00112098, %function
func_00112098:
    ldr r2, [pc, #16]
    mov r3, #0
    strb r3, [r0, #8]
    str r1, [r0, #4]
    str r2, [r0]
    bx lr
.size func_00112098, . - func_00112098
    .word runtime_record_descriptor_103_a

.section .text.func_00115C74, "ax", %progbits
.balign 4
.global func_00115C74
.type func_00115C74, %function
func_00115C74:
    ldr r1, [pc, #16]
    str r1, [r0]
    mov r1, #0
    str r1, [r0, #4]
    str r1, [r0, #8]
    bx lr
.size func_00115C74, . - func_00115C74
    .word runtime_record_descriptor_103_b

.section .text.func_00171214, "ax", %progbits
.balign 4
.global func_00171214
.type func_00171214, %function
func_00171214:
    mov r1, #0
    str r1, [r0, #4]
    strb r1, [r0, #8]
    ldr r1, [pc, #4]
    str r1, [r0]
    bx lr
.size func_00171214, . - func_00171214
    .word runtime_record_descriptor_103_c

.section .text.func_002C1EB4, "ax", %progbits
.balign 4
.global func_002C1EB4
.type func_002C1EB4, %function
func_002C1EB4:
    ldr r2, [pc, #16]
    mov r1, #0
    str r2, [r0]
    strh r1, [r0, #12]
    strb r1, [r0, #14]
    bx lr
.size func_002C1EB4, . - func_002C1EB4
    .word runtime_record_descriptor_103_d

.section .text.func_002CC97C, "ax", %progbits
.balign 4
.global func_002CC97C
.type func_002CC97C, %function
func_002CC97C:
    ldr r1, [pc, #16]
    mov r2, #0
    stmia r0, {r1, r2}
    str r2, [r0, #8]
    str r2, [r0, #12]
    bx lr
.size func_002CC97C, . - func_002CC97C
    .word service_cleanup_vtable_42_c
