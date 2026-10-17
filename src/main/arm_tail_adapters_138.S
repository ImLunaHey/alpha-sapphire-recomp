.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.extern func_00123D60
.extern func_0012FE3C
.extern func_00132C04
.extern func_00144D28
.extern func_0014E904
.extern func_0015EBCC
.extern func_00177E8C
.extern func_00179870
.extern func_0019C7E8
.extern func_001F46F4
.extern func_00217834
.extern func_00300B28
.extern func_00396510
.extern func_00415BC8
.extern func_00471D24

.section .text.func_00136318, "ax", %progbits
.balign 4
.global func_00136318
.type func_00136318, %function
func_00136318:
    add r0, r0, #452
    b func_00132C04
.size func_00136318, . - func_00136318

.section .text.func_00177E84, "ax", %progbits
.balign 4
.global func_00177E84
.type func_00177E84, %function
func_00177E84:
    mov r2, #0x3f800000
    b func_00177E8C + 20
.size func_00177E84, . - func_00177E84

.section .text.func_001E86A0, "ax", %progbits
.balign 4
.global func_001E86A0
.type func_001E86A0, %function
func_001E86A0:
    mov r3, r1
    mov r1, r0
    mov r2, #604
    mov r0, r3
    b func_00144D28
.size func_001E86A0, . - func_001E86A0

.section .text.func_001F4368, "ax", %progbits
.balign 4
.global func_001F4368
.type func_001F4368, %function
func_001F4368:
    mov r2, #3
    b func_001F46F4 + 8
.size func_001F4368, . - func_001F4368

.section .text.func_002A59EC, "ax", %progbits
.balign 4
.global func_002A59EC
.type func_002A59EC, %function
func_002A59EC:
    ldr r1, [r1, #8]
    ldr ip, [r1, #24]
    ldrd r2, r3, [r1, #12]
    ldr r0, [r0, #8]
    add r1, r2, ip
    sub r2, r3, #4
    add r1, r1, #4
    mvn r3, #0
    b func_00179870
.size func_002A59EC, . - func_002A59EC

.section .text.func_002B2CE8, "ax", %progbits
.balign 4
.global func_002B2CE8
.type func_002B2CE8, %function
func_002B2CE8:
    ldr r1, [r1, #4]
    b func_00217834
.size func_002B2CE8, . - func_002B2CE8

.section .text.func_0037FC74, "ax", %progbits
.balign 4
.global func_0037FC74
.type func_0037FC74, %function
func_0037FC74:
    add r0, pc, #0
    bx lr
.size func_0037FC74, . - func_0037FC74

.section .text.func_00391C80, "ax", %progbits
.balign 4
.global func_00391C80
.type func_00391C80, %function
func_00391C80:
    mov r2, #0
    mov r3, #2
    mvn r1, #0
    strd r2, r3, [r0]
    strh r1, [r0, #8]
    ldr r1, [r0, #12]
    ldr r0, [r1, #4]
    ldr r1, [r1]
    add r1, r1, #7
    lsr r1, r1, #3
    b func_0015EBCC
.size func_00391C80, . - func_00391C80

.section .text.func_00391CAC, "ax", %progbits
.balign 4
.global func_00391CAC
.type func_00391CAC, %function
func_00391CAC:
    mov r1, #0
    mov r2, #2
    stm r0, {r1, r2}
    mvn r1, #0
    strh r1, [r0, #8]
    ldr r1, [r0, #12]
    ldr r0, [r1, #4]
    ldr r1, [r1]
    add r1, r1, #7
    lsr r1, r1, #3
    b func_0015EBCC
.size func_00391CAC, . - func_00391CAC

.section .text.func_0039727C, "ax", %progbits
.balign 4
.global func_0039727C
.type func_0039727C, %function
func_0039727C:
    ldr ip, [r0, #40]
    add r2, r1, r1, lsl #1
    add r2, r2, r1, lsl #3
    ldr r3, [r0, #124]
    ldr ip, [ip, #52]
    ldr r2, [ip, r2, lsl #2]
    ldr r2, [r2, #8]
    str r2, [r3, r1, lsl #2]
    b func_00396510
.size func_0039727C, . - func_0039727C

.section .text.func_003A9FAC, "ax", %progbits
.balign 4
.global func_003A9FAC
.type func_003A9FAC, %function
func_003A9FAC:
    mov r3, #0
    mov r2, #1
    b func_0014E904
.size func_003A9FAC, . - func_003A9FAC

.section .text.func_003BB834, "ax", %progbits
.balign 4
.global func_003BB834
.type func_003BB834, %function
func_003BB834:
    mov r0, #0
    mov r1, r0
    b func_00123D60 + 12
.size func_003BB834, . - func_003BB834

.section .text.func_004127BC, "ax", %progbits
.balign 4
.global func_004127BC
.type func_004127BC, %function
func_004127BC:
    mov r3, r2
    mov r2, #1
    b func_00415BC8
.size func_004127BC, . - func_004127BC

.section .text.func_0043EC84, "ax", %progbits
.balign 4
.global func_0043EC84
.type func_0043EC84, %function
func_0043EC84:
    mov r2, #200
    b func_00144D28
.size func_0043EC84, . - func_0043EC84

.section .text.func_00462764, "ax", %progbits
.balign 4
.global func_00462764
.type func_00462764, %function
func_00462764:
    add r0, r0, #60
    b func_0012FE3C
.size func_00462764, . - func_00462764

.section .text.func_00463D2C, "ax", %progbits
.balign 4
.global func_00463D2C
.type func_00463D2C, %function
func_00463D2C:
    mov r2, #40
    add r0, r0, #912
    b func_00300B28
.size func_00463D2C, . - func_00463D2C

.section .text.func_0046491C, "ax", %progbits
.balign 4
.global func_0046491C
.type func_0046491C, %function
func_0046491C:
    mov r2, #368
    add r0, r0, #8
    b func_00300B28
.size func_0046491C, . - func_0046491C

.section .text.func_004757A0, "ax", %progbits
.balign 4
.global func_004757A0
.type func_004757A0, %function
func_004757A0:
    vldmia r1, {s0-s7}
    add r0, r0, #756
    add r1, r1, #32
    vstmia r0, {s0-s7}
    add r0, r0, #32
    vldmia r1, {s0-s3}
    vstmia r0, {s0-s3}
    b func_00471D24 + 8
.size func_004757A0, . - func_004757A0

.section .text.func_004E3FC8, "ax", %progbits
.balign 4
.global func_004E3FC8
.type func_004E3FC8, %function
func_004E3FC8:
    add r0, r0, #2048
    add r0, r0, #252
    b func_0019C7E8
.size func_004E3FC8, . - func_004E3FC8
