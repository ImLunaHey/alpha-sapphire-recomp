.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004151E0, "ax", %progbits
.balign 4
.global func_004151E0
.type func_004151E0, %function
func_004151E0:
    push {r4, lr}
    ands r1, r0, #0x80000000
    mov r4, r0
    bpl .L117_classified
    and r1, r4, #0x3fc00
    lsl r0, r4, #22
    lsr r1, r1, #10
    cmp r1, #17
    lsr r0, r0, #22
    bne .L117_test_second
    cmp r0, #100
    blt .L117_test_second
    cmp r0, #179
    ble .L117_classified
.L117_test_second:
    cmp r1, #17
    bne .L117_test_third
    cmp r0, #180
    blt .L117_test_third
    cmp r0, #199
    ble .L117_classified
.L117_test_third:
    cmp r1, #17
    bne .L117_fallback
    cmp r0, #200
    blt .L117_fallback
    cmp r0, #219
    ble .L117_classified
.L117_fallback:
    mov r0, r4
    mov r1, pc
    lsrs r2, r4, #31
    blne func_00124FB0
.L117_classified:
    mov r0, r4
    pop {r4, pc}
.size func_004151E0, . - func_004151E0

.section .text.func_0041E4C4, "ax", %progbits
.balign 4
.global func_0041E4C4
.type func_0041E4C4, %function
func_0041E4C4:
    push {r4, lr}
    ldr r0, [r0, #4]
    cmp r0, #0
    beq .L117_e4c4_zero
    mov r3, #0
    pop {r4, lr}
    mov r2, r3
    mov r1, #92
    b func_0036DF4C
.L117_e4c4_zero:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
    mov r0, #0
    pop {r4, pc}
.size func_0041E4C4, . - func_0041E4C4

.section .text.func_0041EDE8, "ax", %progbits
.balign 4
.global func_0041EDE8
.type func_0041EDE8, %function
func_0041EDE8:
    push {r4, lr}
    ldr r0, [r0, #4]
    cmp r0, #0
    beq .L117_ede8_zero
    mov r3, #0
    pop {r4, lr}
    mov r2, r3
    mov r1, #91
    b func_0036DF4C
.L117_ede8_zero:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
    mov r0, #0
    pop {r4, pc}
.size func_0041EDE8, . - func_0041EDE8

.section .text.func_0041E490, "ax", %progbits
.balign 4
.global func_0041E490
.type func_0041E490, %function
func_0041E490:
    push {r4, lr}
    ldr r0, [r0, #4]
    cmp r0, #0
    beq .L117_e490_zero
    pop {r4, lr}
    mov r1, #92
    b func_0036DF28
.L117_e490_zero:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
    mov r0, #0
    pop {r4, pc}
.size func_0041E490, . - func_0041E490

.section .text.func_0041EDB4, "ax", %progbits
.balign 4
.global func_0041EDB4
.type func_0041EDB4, %function
func_0041EDB4:
    push {r4, lr}
    ldr r0, [r0, #4]
    cmp r0, #0
    beq .L117_edb4_zero
    pop {r4, lr}
    mov r1, #91
    b func_0036DF28
.L117_edb4_zero:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
    mov r0, #0
    pop {r4, pc}
.size func_0041EDB4, . - func_0041EDB4

.section .text.func_00425F04, "ax", %progbits
.balign 4
.global func_00425F04
.type func_00425F04, %function
func_00425F04:
    ldrb r1, [r0, #5]
    cmp r1, #0
    ldrne r0, [r0, #40]
    cmpne r0, #0
    beq .L117_25f04_false
    ldrb r1, [r0, #16]
    cmp r1, #1
    beq .L117_25f04_tail
.L117_25f04_false:
    mov r0, #0
    bx lr
.L117_25f04_tail:
    mov r1, #4
    b func_00160BA8
.size func_00425F04, . - func_00425F04

.section .note.GNU-stack, "", %progbits
