.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.global runtime_dispatch_root_97
.global runtime_dispatch_selector_tail_100
.global runtime_shared_context_root_100
.global func_004AA8A4

.section .text.func_001159D8, "ax", %progbits
.balign 4
.global func_001159D8
.type func_001159D8, %function
func_001159D8:
    ldr r0, [pc, #12]
    mov r1, #0
    ldr r0, [r0, #16]
    ldr r0, [r0, #4]
    b runtime_dispatch_selector_tail_100
.size func_001159D8, . - func_001159D8
    .word runtime_dispatch_root_97

.section .text.func_001159F0, "ax", %progbits
.balign 4
.global func_001159F0
.type func_001159F0, %function
func_001159F0:
    ldr r0, [pc, #12]
    mov r1, #1
    ldr r0, [r0, #16]
    ldr r0, [r0, #4]
    b runtime_dispatch_selector_tail_100
.size func_001159F0, . - func_001159F0
    .word runtime_dispatch_root_97

.section .text.func_00115A08, "ax", %progbits
.balign 4
.global func_00115A08
.type func_00115A08, %function
func_00115A08:
    ldr r0, [pc, #12]
    mov r1, #2
    ldr r0, [r0, #16]
    ldr r0, [r0, #4]
    b runtime_dispatch_selector_tail_100
.size func_00115A08, . - func_00115A08
    .word runtime_dispatch_root_97

.section .text.func_004AAA0C, "ax", %progbits
.balign 4
.global func_004AAA0C
.type func_004AAA0C, %function
func_004AAA0C:
    ldr r1, [pc, #12]
    mov r2, #0
    ldr r1, [r1, #356]
    add r1, r1, #28
    b func_004AA8A4
.size func_004AAA0C, . - func_004AAA0C
    .word runtime_shared_context_root_100

.section .text.func_004AAA24, "ax", %progbits
.balign 4
.global func_004AAA24
.type func_004AAA24, %function
func_004AAA24:
    ldr r1, [pc, #12]
    mov r2, #0
    ldr r1, [r1, #356]
    add r1, r1, #36
    b func_004AA8A4
.size func_004AAA24, . - func_004AAA24
    .word runtime_shared_context_root_100

.section .text.func_004AAAE4, "ax", %progbits
.balign 4
.global func_004AAAE4
.type func_004AAAE4, %function
func_004AAAE4:
    ldr r1, [pc, #12]
    mov r2, #0
    ldr r1, [r1, #356]
    add r1, r1, #52
    b func_004AA8A4
.size func_004AAAE4, . - func_004AAAE4
    .word runtime_shared_context_root_100

.section .text.func_004AABC0, "ax", %progbits
.balign 4
.global func_004AABC0
.type func_004AABC0, %function
func_004AABC0:
    ldr r1, [pc, #12]
    mov r2, #0
    ldr r1, [r1, #356]
    add r1, r1, #44
    b func_004AA8A4
.size func_004AABC0, . - func_004AABC0
    .word runtime_shared_context_root_100

.section .note.GNU-stack, "", %progbits
