.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0014EB08, "ax", %progbits
.balign 4
.global func_0014EB08
.type func_0014EB08, %function
func_0014EB08:
    mov r1, r0
    ldr r0, 1f
    ldr r0, [r0, #20]
    b runtime_secondary_dispatch_tail_102
.size func_0014EB08, . - func_0014EB08
1:
    .word runtime_shared_dispatch_root_102

.section .text.func_0014EB30, "ax", %progbits
.balign 4
.global func_0014EB30
.type func_0014EB30, %function
func_0014EB30:
    mov r2, r1
    mov r1, r0
    ldr r0, 1f
    ldr r0, [r0, #20]
    b func_00168844
.size func_0014EB30, . - func_0014EB30
1:
    .word runtime_shared_dispatch_root_102

.section .text.func_001DBCD8, "ax", %progbits
.balign 4
.global func_001DBCD8
.type func_001DBCD8, %function
func_001DBCD8:
    ldr r2, 1f
    add r0, r0, r0, lsl #1
    add r0, r2, r0, lsl #3
    vldmia r0, {s0-s5}
    vstmia r1, {s0-s5}
    bx lr
.size func_001DBCD8, . - func_001DBCD8
1:
    .word runtime_vector_record_table_102

.section .text.func_00324E84, "ax", %progbits
.balign 4
.global func_00324E84
.type func_00324E84, %function
func_00324E84:
    mov r1, r0
    ldr r0, 1f
    ldr r0, [r0, #4]
    ldr r2, [r0]
    ldr r2, [r2, #12]
    bx r2
.size func_00324E84, . - func_00324E84
1:
    .word runtime_object_dispatch_root_102

.section .text.func_0042FF40, "ax", %progbits
.balign 4
.global func_0042FF40
.type func_0042FF40, %function
func_0042FF40:
    ldr r0, 1f
    ldr r0, [r0, #36]
    ldr r1, [r0]
    ldr r1, [r1, #56]
    bx r1
.size func_0042FF40, . - func_0042FF40
1:
    .word runtime_method_dispatch_root_102

.section .note.GNU-stack, "", %progbits
