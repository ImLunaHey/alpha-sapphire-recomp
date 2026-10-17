.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro BEGIN f
 .section .text.\f,"ax",%progbits
 .balign 4
 .arm
 .global \f
 .type \f,%function
\f:
.endm
.macro END f
 .size \f,.-\f
.endm

.global ipc_unit_scalar_54
.global service_zero_scalar_51

BEGIN func_0018067C
vldr s1,.Lunit_0018067C
vldr s2,.Lzero_0018067C
vadd.f32 s1,s0,s1
vcmpe.f32 s1,s2
vmrs APSR_nzcv,fpscr
vldr s0,[r0,#68]
vmovcc.f32 s1,s2
vcmp.f32 s0,s1
vmrs APSR_nzcv,fpscr
beq .Lreturn_0018067C
ldrh r1,[r0,#32]
vstr s1,[r0,#68]
orr r1,r1,#8
strh r1,[r0,#32]
.Lreturn_0018067C:
bx lr
END func_0018067C
.Lunit_0018067C:
.word ipc_unit_scalar_54
.Lzero_0018067C:
.word service_zero_scalar_51

BEGIN func_001806E4
vldr s2,.Lunit_001806E4
vldr s1,.Lzero_001806E4
vcmpe.f32 s0,s2
vmrs APSR_nzcv,fpscr
vmovgt.f32 s0,s2
bgt .Lcompare_001806E4
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
.Lcompare_001806E4:
ldrb r3,[r0,#34]
mov r2,#0
cmp r3,r1
strbne r1,[r0,#34]
vldr s1,[r0,#60]
movne r2,#1
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
vstrne s0,[r0,#60]
cmpeq r2,#0
beq .Lreturn_001806E4
ldrh r1,[r0,#32]
orr r1,r1,#32
strh r1,[r0,#32]
.Lreturn_001806E4:
bx lr
END func_001806E4
.Lunit_001806E4:
.word ipc_unit_scalar_54
.Lzero_001806E4:
.word service_zero_scalar_51
