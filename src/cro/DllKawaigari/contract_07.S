.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000039EC, "ax", %progbits
.balign 4
.global func_000039EC
.type func_000039EC, %function
func_000039EC:
    add r1, r0, #0x870
    str r1, [r0, #0xCA8]
    mov r0, #0
    bx lr
.size func_000039EC, . - func_000039EC

.section .text.func_000137C4, "ax", %progbits
.balign 4
.global func_000137C4
.type func_000137C4, %function
func_000137C4:
    mov r0, r0
    mov r0, #0x840
    bx lr
.size func_000137C4, . - func_000137C4

.section .text.func_00021EBC, "ax", %progbits
.balign 4
.global func_00021EBC
.type func_00021EBC, %function
func_00021EBC:
    clz r0, r0
    uxth r0, r0
    bx lr
.size func_00021EBC, . - func_00021EBC

.section .text.func_0002335C, "ax", %progbits
.balign 4
.global func_0002335C
.type func_0002335C, %function
func_0002335C:
    cmp r0, #0
    movlt r0, #0
    movge r0, #0x20
    bx lr
.size func_0002335C, . - func_0002335C
