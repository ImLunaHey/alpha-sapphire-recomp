.syntax unified
.arch armv6k
.fpu vfpv2
.arm

// Guard a table dispatch with the caller's nullable object.
.section .text.func_001CF630, "ax", %progbits
.balign 4
.global func_001CF630
.type func_001CF630, %function
func_001CF630:
    cmp r0, #0
    beq .Ldispatch_return_123
    ldr r2, [r1, #4]
    ldr r2, [r2, #20]
    bx r2
.Ldispatch_return_123:
    bx lr
.size func_001CF630, . - func_001CF630

// Forward through the caller's two-level dispatch table.
.section .text.func_001CF648, "ax", %progbits
.balign 4
.global func_001CF648
.type func_001CF648, %function
func_001CF648:
    ldr ip, [r2, #4]
    ldr ip, [ip, #12]
    bx ip
.size func_001CF648, . - func_001CF648

.section .note.GNU-stack, "", %progbits
