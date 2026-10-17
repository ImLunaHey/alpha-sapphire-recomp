.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00007898, "ax", %progbits
.balign 4
.global func_00007898
.type func_00007898, %function
func_00007898:
    push {r4, r5}
    ldr r4, [sp, #0xC]
    ldr ip, [sp, #8]
    cmp r4, #0
    ldrne r1, [pc, #0x48]
    ldrdne r2, r3, [r1, #0x38]
    bne .Lstore_result_00007898
    cmp ip, #0
    beq .Lzero_pair_00007898
    ldr ip, [r1, #0x88]
    cmp ip, #0
    bne .Lloaded_pair_00007898
    ldr r4, [r1, #0x8C]
    tst r4, #1
    beq .Lzero_pair_00007898
    cmp r4, #0
    beq .Lzero_pair_00007898
.Lloaded_pair_00007898:
    ldr r3, [r1, #0x8C]
    mov r2, ip
    b .Lstore_result_00007898
.Lzero_pair_00007898:
    strd r2, r3, [r1, #0x88]
.Lstore_result_00007898:
    strd r2, r3, [r0]
    pop {r4, r5}
    bx lr
.size func_00007898, . - func_00007898
