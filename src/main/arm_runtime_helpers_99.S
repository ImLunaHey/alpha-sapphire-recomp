.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0011F8A8, "ax", %progbits
.balign 4
.global func_0011F8A8
.type func_0011F8A8, %function
func_0011F8A8:
    mvn r1, #1
    vldr s0, .Lfunc_0011F8A8_data
    str r1, [r0]
    vstr s0, [r0, #4]
    bx lr
.size func_0011F8A8, . - func_0011F8A8
.global runtime_float_unit_38
.Lfunc_0011F8A8_data:
    .word runtime_float_unit_38

.section .text.func_00142388, "ax", %progbits
.balign 4
.global func_00142388
.type func_00142388, %function
func_00142388:
    ldr r1, .Lfunc_00142388_data
    ldr r1, [r1, #156]
    cmp r1, #0
    strne r0, [r1, #56]
    bx lr
.size func_00142388, . - func_00142388
.global runtime_global_context_root_99
.Lfunc_00142388_data:
    .word runtime_global_context_root_99

.section .text.func_002C2F2C, "ax", %progbits
.balign 4
.global func_002C2F2C
.type func_002C2F2C, %function
func_002C2F2C:
    ldr r0, .Lfunc_002C2F2C_data
    ldrb r0, [r0, #133]
    and r0, r0, #28
    lsr r0, r0, #2
    bx lr
.size func_002C2F2C, . - func_002C2F2C
.global runtime_fixed_register_base_99
.Lfunc_002C2F2C_data:
    .word runtime_fixed_register_base_99

.section .text.func_00336114, "ax", %progbits
.balign 4
.global func_00336114
.type func_00336114, %function
func_00336114:
    vmov s0, r0
    vldr s1, .Lfunc_00336114_data
    vcvt.f32.u32 s0, s0
    vmul.f32 s0, s0, s1
    bx lr
.size func_00336114, . - func_00336114
.global ipc_step_scalar_a_65
.Lfunc_00336114_data:
    .word ipc_step_scalar_a_65

.section .text.func_00417638, "ax", %progbits
.balign 4
.global func_00417638
.type func_00417638, %function
func_00417638:
    ldr r1, .Lfunc_00417638_data
    cmp r0, r1
    movle r0, #1
    movgt r0, #0
    bx lr
.size func_00417638, . - func_00417638
.global runtime_scalar_threshold_99
.Lfunc_00417638_data:
    .word runtime_scalar_threshold_99

.section .text.func_0041D118, "ax", %progbits
.balign 4
.global func_0041D118
.type func_0041D118, %function
func_0041D118:
    cmp r0, #8
    ldrls r1, .Lfunc_0041D118_data
    mvnhi r0, #0
    ldrls r0, [r1, r0, lsl #2]
    bx lr
.size func_0041D118, . - func_0041D118
.global runtime_lookup_table_99
.Lfunc_0041D118_data:
    .word runtime_lookup_table_99

.section .text.func_004A5B3C, "ax", %progbits
.balign 4
.global func_004A5B3C
.type func_004A5B3C, %function
func_004A5B3C:
    ldr r1, .Lfunc_004A5B3C_data
    ldr r1, [r1]
    cmp r1, #0
    strne r0, [r1, #64]
    bx lr
.size func_004A5B3C, . - func_004A5B3C
.global runtime_global_instance_slot_99
.Lfunc_004A5B3C_data:
    .word runtime_global_instance_slot_99
