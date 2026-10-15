.syntax unified
.arch armv6k
.arm
.fpu vfpv2
.text

.section .text.func_002F54D0, "ax", %progbits
.global func_002F54D0
.type func_002F54D0, %function
func_002F54D0:
vldmia r3, {s1-s3}
vldr s5, [r2]
vldr s4, [r2, #16]
vldr s15, [r2, #32]
vmul.f32 s5, s5, s1
vmul.f32 s4, s4, s1
vmul.f32 s1, s15, s1
vldr s14, [r2, #4]
vldr s13, [r2, #20]
vldr s12, [r2, #36]
vldr s11, [r2, #8]
vldr s10, [r2, #24]
vldr s9, [r2, #40]
vldr s8, [r2, #12]
vmla.f32 s5, s14, s2
vmla.f32 s4, s13, s2
vmla.f32 s1, s12, s2
vldr s0, [r3, #12]
vldr s6, [r2, #28]
vldr s7, [r2, #44]
vmla.f32 s5, s11, s3
vmla.f32 s4, s10, s3
vmla.f32 s1, s9, s3
vmla.f32 s5, s8, s0
vmla.f32 s4, s6, s0
vmla.f32 s1, s7, s0
vstr s5, [r1]
vstr s4, [r1, #4]
vstr s1, [r1, #8]
vstr s0, [r1, #12]
bx lr
.size func_002F54D0, . - func_002F54D0

.section .text.func_002FC820, "ax", %progbits
.global func_002FC820
.type func_002FC820, %function
func_002FC820:
ldr r2, [r0, #144]
ldr r2, [r2, r1, lsl #2]
cmp r2, #0
ldrne r3, [r0, #156]
cmpne r3, r1
bxeq lr
push {r4-r7}
mov r5, #1
str r1, [r0, #156]
ldr r1, [r0]
ldr r3, [r2, #12]
cmp r1, r3
beq .L17_first_done
cmp r3, #0
strb r5, [r0, #169]
beq .L17_first_null
ldr r1, [r3, #8]
ldrb r1, [r1, #180]
cmp r1, #0
bne .L17_first_store
.L17_first_null:
mov r3, #0
.L17_first_store:
str r3, [r0]
.L17_first_done:
ldr r3, [r2, #16]
ldr r1, [r0, #4]
cmp r1, r3
beq .L17_second_done
cmp r3, #0
strb r5, [r0, #171]
beq .L17_second_null
ldr r1, [r3, #8]
ldrb r1, [r1, #180]
cmp r1, #0
bne .L17_second_store
.L17_second_null:
mov r3, #0
.L17_second_store:
str r3, [r0, #4]
.L17_second_done:
mov r7, #0
add r3, r2, #24
str r7, [r0, #160]
ldm r3, {r3, r6}
ldr r1, [r0, #20]
cmp r3, r6
bic r4, r1, #0xc0000000
beq .L17_first_range_done
.L17_first_range_loop:
ldr r12, [r0, #160]
strb r5, [r0, #170]
cmp r12, r4
beq .L17_first_range_done
ldr r1, [r3]
ldr r1, [r1, #8]
ldrb r1, [r1, #180]
cmp r1, #0
beq .L17_first_next
ldr r1, [r0, #12]
vldr s0, [r3]
add r1, r1, r12, lsl #2
vstr s0, [r1]
ldr r1, [r0, #160]
add r1, r1, #1
str r1, [r0, #160]
.L17_first_next:
add r3, r3, #4
cmp r3, r6
bne .L17_first_range_loop
.L17_first_range_done:
add r2, r2, #68
str r7, [r0, #164]
ldm r2, {r3, r12}
cmp r3, r12
beq .L17_second_range_done
.L17_second_range_loop:
ldr r2, [r0, #164]
strb r5, [r0, #168]
cmp r2, #8
beq .L17_second_range_done
ldr r1, [r3]
ldr r1, [r1, #8]
ldrb r1, [r1, #180]
cmp r1, #0
beq .L17_second_next
ldr r1, [r0, #36]
ldr r4, [r3]
str r4, [r1, r2, lsl #2]
ldr r1, [r0, #164]
add r1, r1, #1
str r1, [r0, #164]
.L17_second_next:
add r3, r3, #4
cmp r3, r12
bne .L17_second_range_loop
.L17_second_range_done:
pop {r4-r7}
bx lr
.size func_002FC820, . - func_002FC820

.section .text.func_00329750, "ax", %progbits
.global func_00329750
.type func_00329750, %function
func_00329750:
ldrb r3, [r0, #1]
cmp r3, r2
movcc r3, r2
cmp r2, #0
strb r3, [r0, #1]
movne r3, #0
bxeq lr
push {r4-r9}
mov r5, #8
mov r12, #16
mov r4, #24
.L17_record_loop:
ldr r6, [r0, #4]
add r7, r5, r3, lsl #5
vldmia r1, {s0-s1}
add r8, r6, r3, lsl #5
add r6, r12, r3, lsl #5
add r9, r4, r3, lsl #5
vstmia r8, {s0-s1}
subs r2, r2, #1
ldr r8, [r0, #4]
add r3, r3, #1
add r7, r7, r8
add r8, r1, #8
vldmia r8, {s0-s1}
vstmia r7, {s0-s1}
ldr r8, [r0, #4]
ldr r7, [r1, #16]
vldr s0, [r1, #20]
add r6, r6, r8
str r7, [r6]
vstr s0, [r6, #4]
add r7, r1, #24
ldr r6, [r0, #4]
ldm r7, {r7, r8}
add r1, r1, #32
add r6, r6, r9
stm r6, {r7, r8}
bne .L17_record_loop
pop {r4-r9}
bx lr
.size func_00329750, . - func_00329750

.section .text.func_003299E8, "ax", %progbits
.global func_003299E8
.type func_003299E8, %function
func_003299E8:
push {r4-r7}
mov r6, #8
ldr r5, [r0, #4]
ldr r3, [r2]
vldr s0, [r2, #4]
add r7, r5, r1, lsl #5
mov r4, #16
str r3, [r7]
add r5, r6, r1, lsl #5
add r3, r4, r1, lsl #5
vstr s0, [r7, #4]
ldr r4, [r0, #4]
mov r12, #24
add r6, r2, #8
add r1, r12, r1, lsl #5
ldm r6, {r6, r12}
add r4, r4, r5
add r5, r2, #16
stm r4, {r6, r12}
ldr r4, [r0, #4]
ldm r5, {r5, r12}
add r3, r3, r4
stm r3, {r5, r12}
ldr r0, [r0, #4]
ldr r3, [r2, #24]
ldr r2, [r2, #28]
str r3, [r0, r1]!
str r2, [r0, #4]
pop {r4-r7}
bx lr
.size func_003299E8, . - func_003299E8

.section .text.func_003354FC, "ax", %progbits
.global func_003354FC
.type func_003354FC, %function
func_003354FC:
ldr r12, [sp]
vldr s0, [sp, #4]
stm r0, {r1-r3}
add r1, r12, #8
vstr s0, [r0, #28]
str r1, [r0, #16]
add r2, r12, #16
add r3, r12, #24
str r12, [r0, #12]
strd r2, [r0, #20]
bx lr
.size func_003354FC, . - func_003354FC

.section .text.func_003A7910, "ax", %progbits
.global func_003A7910
.type func_003A7910, %function
func_003A7910:
push {r4-r6}
ldr r2, [r0, #16]
ldr r3, [r0, #12]
cmp r3, r2
movcs r0, #0
bcs .L17_insert_done
cmp r3, #0
mov r2, #0
bls .L17_insert_found
ldrb r12, [r1, #5]
ldr r4, [r0, #8]
mov r5, #5
.L17_insert_scan:
add r6, r2, r2, lsl #2
add r6, r5, r6, lsl #2
ldrb r6, [r4, r6]
cmp r6, r12
addls r2, r2, #1
cmpls r2, r3
bcc .L17_insert_scan
.L17_insert_found:
cmp r3, r2
mvnhi r5, #19
bls .L17_insert_place
.L17_insert_shift:
ldr r12, [r0, #8]
add r4, r3, r3, lsl #2
sub r3, r3, #1
add r6, r5, r4, lsl #2
add r6, r6, r12
add r12, r12, r4, lsl #2
vldmia r6, {s0-s4}
cmp r3, r2
vstmia r12, {s0-s4}
bhi .L17_insert_shift
.L17_insert_place:
ldr r3, [r0, #8]
vldmia r1, {s0-s4}
add r1, r2, r2, lsl #2
add r1, r3, r1, lsl #2
vstmia r1, {s0-s4}
ldr r1, [r0, #12]
add r1, r1, #1
str r1, [r0, #12]
mov r0, #1
.L17_insert_done:
pop {r4-r6}
bx lr
.size func_003A7910, . - func_003A7910
