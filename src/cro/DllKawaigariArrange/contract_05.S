.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00005028, "ax", %progbits
.balign 4
.global func_00005028
.type func_00005028, %function
func_00005028:
    ldr r1, [r0, #0x34]
    mov r2, r1
    ldr r1, [r1, #0xC]
    ldrb r3, [r2, #0x3B]
    ldrsh r0, [r1, #0x40]
    ldrsh r1, [r1, #0x42]
    cmp r3, #0
    beq .Lzero_00005028
    cmp r0, #0
    addlt r0, r0, r1
    blt .Lnonzero_store_00005028
    cmp r1, r0
    suble r0, r0, r1
.Lnonzero_store_00005028:
    strb r0, [r2, #0x3D]
    bx lr
.Lzero_00005028:
    cmp r0, #0
    addlt r0, r0, r1
    blt .Lzero_store_00005028
    cmp r1, r0
    suble r0, r0, r1
.Lzero_store_00005028:
    strb r0, [r2, #0x3C]
    ldr r0, [r2, #0xC]
    ldr r0, [r0, #0x2C]
    ldr r0, [r0]
    strb r0, [r2, #0x3F]
    bx lr
.size func_00005028, . - func_00005028
