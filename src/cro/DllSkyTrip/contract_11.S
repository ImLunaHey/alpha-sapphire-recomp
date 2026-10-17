.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00008048, "ax", %progbits
.balign 4
.global func_00008048
.type func_00008048, %function
func_00008048:
    vldmia r1!, {s3}
    vldr s4, [pc, #0x30]
    add r2, r0, #4
    vldmia r1, {s0-s1}
    vmul.f32 s2, s3, s3
    vmla.f32 s2, s0, s0
    vmla.f32 s2, s1, s1
    vsqrt.f32 s5, s2
    vdiv.f32 s2, s4, s5
    vmul.f32 s3, s3, s2
    vmul.f32 s1, s1, s2
    vmul.f32 s0, s0, s2
    vstr s3, [r0]
    vstmia r2, {s0-s1}
    bx lr
.size func_00008048, . - func_00008048
