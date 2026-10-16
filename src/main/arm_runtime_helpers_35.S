.syntax unified
.arch armv6k
.arm

.section .text.func_00300EA8, "ax", %progbits
.balign 4
.global func_00300EA8
.type func_00300EA8, %function
func_00300EA8:
    subs r3, r2, #32
    bpl 1f
    rsb r3, r2, #32
    lsl r1, r1, r2
    orr r1, r1, r0, lsr r3
    lsl r0, r0, r2
    bx lr
1:
    lsl r1, r0, r3
    mov r0, #0
    bx lr
.size func_00300EA8, . - func_00300EA8

.section .text.func_00301FBC, "ax", %progbits
.balign 4
.global func_00301FBC
.type func_00301FBC, %function
func_00301FBC:
    mov r2, #0
    stmfd sp!, {lr}
    mov r3, r2
    mov r12, r2
    mov lr, r2
    subs r1, r1, #32
1:
    stmiacs r0!, {r2, r3, r12, lr}
    stmiacs r0!, {r2, r3, r12, lr}
    subscs r1, r1, #32
    bcs 1b
    lsls r1, r1, #28
    stmiacs r0!, {r2, r3, r12, lr}
    stmiami r0!, {r2, r3}
    ldmfd sp!, {lr}
    lsls r1, r1, #2
    strcs r2, [r0], #4
    bxeq lr
    strhmi r2, [r0], #2
    tst r1, #0x40000000
    strbne r2, [r0], #1
    bx lr
.size func_00301FBC, . - func_00301FBC

.section .text.func_003028B8, "ax", %progbits
.balign 4
.global func_003028B8
.type func_003028B8, %function
func_003028B8:
    cmp r2, #0
    beq 2f
    cmp r1, #0
    beq 3f
    ldr r1, [r1, #8]
    mov r3, #0x40000001
    cmp r1, #0
    beq 1f
    ldr r0, [r1]
    bics r0, r3, r0
    movne r1, #0
1:
    ldr r0, [r2, #8]
    cmp r0, #0
    beq 4f
    ldr r2, [r0]
    bics r2, r3, r2
    movne r0, #0
4:
    ldr r1, [r1, #76]
    ldr r0, [r0, #76]
    cmp r1, r0
    bcs 3f
2:
    mov r0, #1
    bx lr
3:
    mov r0, #0
    bx lr
.size func_003028B8, . - func_003028B8

.section .text.func_00303150, "ax", %progbits
.balign 4
.global func_00303150
.type func_00303150, %function
func_00303150:
    ldr r1, [r0, #60]
    mov r2, #16
    bics r2, r2, r1
    beq 1f
    ldr r2, [r0]
    cmp r2, #0x3f800000
    bne 2f
    ldr r2, [r0, #20]
    cmp r2, #0x3f800000
    orreq r1, r1, #128
    beq 3f
2:
    bic r1, r1, #128
3:
    str r1, [r0, #60]
1:
    bx lr
.size func_00303150, . - func_00303150

.section .text.func_003032D0, "ax", %progbits
.balign 4
.global func_003032D0
.type func_003032D0, %function
func_003032D0:
    ldr r1, [r0, #60]
    mov r2, #384
    bic r1, r1, #96
    bics r2, r2, r1
    str r1, [r0, #60]
    bne 1f
    orr r1, r1, #64
    mov r2, #512
    bics r2, r2, r1
    str r1, [r0, #60]
    orreq r1, r1, #32
    streq r1, [r0, #60]
1:
    bx lr
.size func_003032D0, . - func_003032D0

.section .text.func_00305760, "ax", %progbits
.balign 4
.global func_00305760
.type func_00305760, %function
func_00305760:
    ldr r1, [r1, #76]
    ldr r1, [r1, #204]
    cmp r1, #0
    ble 1f
    ldr r1, [r0]
    mov r0, #0
    strb r0, [r1]
1:
    bx lr
.size func_00305760, . - func_00305760

.section .text.func_0030E318, "ax", %progbits
.balign 4
.global func_0030E318
.type func_0030E318, %function
func_0030E318:
    ldr r0, [r0]
    ldr r1, [r0]
    cmp r1, #0x80000000
    beq 1f
    cmp r1, #0x40000000
    bne 2f
    ldr r1, [r0, #12]!
    cmp r1, #0
    addne r0, r0, r1
    bne 1f
2:
    mov r0, #0
1:
    bx lr
.size func_0030E318, . - func_0030E318

.section .text.func_0030FDE8, "ax", %progbits
.balign 4
.global func_0030FDE8
.type func_0030FDE8, %function
func_0030FDE8:
    ldr r2, [r0]
    mov r1, #0
    mov r0, r1
    bx lr
.size func_0030FDE8, . - func_0030FDE8
