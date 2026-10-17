.syntax unified
.arch armv6k
.arm
.fpu vfpv2

.global runtime_indirect_dispatch_root_101
.global runtime_indirect_dispatch_slot_101
.global runtime_dispatch_object_root_101
.global runtime_dispatch_root_97
.global func_004E60D8
.global func_0010D1DC

.section .text.func_001D1DC8, "ax", %progbits
.balign 4
.global func_001D1DC8
.type func_001D1DC8, %function
func_001D1DC8:
    ldr r1, 1f
    ldr r1, [r1, #12]
    bx r1
.Lfunc_001D1DC8_end:
1:
    .word runtime_indirect_dispatch_root_101
.size func_001D1DC8, .Lfunc_001D1DC8_end - func_001D1DC8

.section .text.func_001D1EEC, "ax", %progbits
.balign 4
.global func_001D1EEC
.type func_001D1EEC, %function
func_001D1EEC:
    ldr r3, 1f
    ldr r3, [r3, #8]
    bx r3
.Lfunc_001D1EEC_end:
1:
    .word runtime_indirect_dispatch_root_101
.size func_001D1EEC, .Lfunc_001D1EEC_end - func_001D1EEC

.section .text.func_001D4248, "ax", %progbits
.balign 4
.global func_001D4248
.type func_001D4248, %function
func_001D4248:
    ldr r1, 1f
    ldr r1, [r1]
    bx r1
.Lfunc_001D4248_end:
1:
    .word runtime_indirect_dispatch_slot_101
.size func_001D4248, .Lfunc_001D4248_end - func_001D4248

.section .text.func_00416324, "ax", %progbits
.balign 4
.global func_00416324
.type func_00416324, %function
func_00416324:
    ldr r0, 1f
    ldr r0, [r0]
    b func_004E60D8
.Lfunc_00416324_end:
1:
    .word runtime_dispatch_object_root_101
.size func_00416324, .Lfunc_00416324_end - func_00416324

.section .text.func_0044F520, "ax", %progbits
.balign 4
.global func_0044F520
.type func_0044F520, %function
func_0044F520:
    ldr r0, 1f
    ldr r0, [r0, #16]
    b func_0010D1DC
.Lfunc_0044F520_end:
1:
    .word runtime_dispatch_root_97
.size func_0044F520, .Lfunc_0044F520_end - func_0044F520

.section .note.GNU-stack, "", %progbits
