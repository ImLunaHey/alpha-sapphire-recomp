.syntax unified
.arch armv6k
.arm

.macro FUNCTION_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro FUNCTION_END name
.size \name, . - \name
.endm

FUNCTION_BEGIN func_0004EB74
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #108]
    mov r5, #0
    cmp r0, #0
    beq .L4EB74_68
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #108]
.L4EB74_68:
    ldr r0, [r4, #104]
    cmp r0, #0
    beq .L4EB74_64
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #104]
.L4EB74_64:
    ldr r0, [r4, #100]
    cmp r0, #0
    beq .L4EB74_60
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #100]
.L4EB74_60:
    ldr r0, [r4, #96]
    cmp r0, #0
    beq .L4EB74_5c
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #96]
.L4EB74_5c:
    ldr r0, [r4, #92]
    cmp r0, #0
    beq .L4EB74_58
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #92]
.L4EB74_58:
    ldr r0, [r4, #88]
    cmp r0, #0
    beq .L4EB74_54
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #88]
.L4EB74_54:
    ldr r0, [r4, #84]
    cmp r0, #0
    beq .L4EB74_done
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #84]
.L4EB74_done:
    pop {r4, r5, r6, pc}
FUNCTION_END func_0004EB74

FUNCTION_BEGIN func_0004ED84
    ldr r2, [r0, #16]
    ldrb r0, [r0, #0x816]
    ldrb r2, [r2, #1]
    cmp r2, #4
    beq .L4ED84_four
    cmp r2, #0
    and r2, r1, #1
    beq .L4ED84_zero
    cmp r2, #0
    and r0, r0, #1
    eorne r0, r0, #1
    add r0, r0, r1
    andeq r0, r0, #0xff
    subne r0, r0, #1
    beq .L4ED84_return
    b .L4ED84_mask
.L4ED84_zero:
    cmp r2, #0
    beq .L4ED84_return
    cmp r0, #0
    moveq r0, #1
    movne r0, #0
.L4ED84_return:
    bx lr
.L4ED84_four:
    cmp r1, #0
    beq .L4ED84_return
    eor r0, r0, #1
    add r0, r0, r1, lsl #1
    sub r0, r0, #2
.L4ED84_mask:
    and r0, r0, #0xff
    bx lr
FUNCTION_END func_0004ED84

FUNCTION_BEGIN func_0004EE5C
    push {r4, r5, r6, lr}
    cmp r1, #0
    mov r4, r0
    mov r5, #0
    beq .L4EE5C_zero
    cmp r1, #1
    bne .L4EE5C_done
    ldr r0, [r4, #40]
    cmp r0, #0
    beq .L4EE5C_44
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #40]
.L4EE5C_44:
    ldr r0, [r4, #44]
    cmp r0, #0
    beq .L4EE5C_done
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #44]
.L4EE5C_done:
    pop {r4, r5, r6, pc}
.L4EE5C_zero:
    ldr r0, [r4, #36]
    cmp r0, #0
    beq .L4EE5C_32
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #36]
.L4EE5C_32:
    ldr r0, [r4, #32]
    cmp r0, #0
    beq .L4EE5C_28
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #32]
.L4EE5C_28:
    ldr r0, [r4, #28]
    cmp r0, #0
    beq .L4EE5C_done
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #28]
    pop {r4, r5, r6, pc}
FUNCTION_END func_0004EE5C

FUNCTION_BEGIN func_00058470
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #56]
    cmp r0, #0
    beq .L58470_clear
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
.L58470_clear:
    mov r0, #0
    mov r2, r0
    mov r1, r0
    str r0, [r4, #56]
.L58470_loop:
    add r3, r2, r2, lsl #1
    add r2, r2, #1
    add r3, r4, r3, lsl #2
    add ip, r2, r2, lsl #1
    add r1, r1, #2
    add ip, r4, ip, lsl #2
    strh r0, [r3, #60]
    cmp r1, #12
    add r2, r2, #1
    strh r0, [ip, #60]
    blt .L58470_loop
    pop {r4, pc}
FUNCTION_END func_00058470

FUNCTION_BEGIN func_0006F6DC
    push {r4}
    ldrb ip, [r0, #0x152]
    cmp ip, #0
    beq .L6F6DC_none
    and r2, ip, #1
    cmp r2, #0
    mov r3, #0
    bls .L6F6DC_pairs
.L6F6DC_first:
    rsb r4, r3, r3, lsl #3
    add r4, r0, r4, lsl #1
    add r4, r4, #0x100
    ldrh r4, [r4, #28]
    cmp r4, r1
    bne .L6F6DC_first_next
    rsb r1, r3, r3, lsl #3
    add r0, r0, r1, lsl #1
    ldrb r0, [r0, #0x11e]
    pop {r4}
    bx lr
.L6F6DC_first_next:
    add r3, r3, #1
    cmp r2, r3
    bhi .L6F6DC_first
.L6F6DC_pairs:
    cmp r2, ip
    bhs .L6F6DC_none
.L6F6DC_pair_loop:
    rsb r3, r2, r2, lsl #3
    add r3, r0, r3, lsl #1
    add r3, r3, #0x100
    ldrh r4, [r3, #28]
    cmp r4, r1
    bne .L6F6DC_second
    rsb r1, r2, r2, lsl #3
    add r0, r0, r1, lsl #1
    ldrb r0, [r0, #0x11e]
    pop {r4}
    bx lr
.L6F6DC_second:
    ldrh r3, [r3, #42]
    cmp r3, r1
    bne .L6F6DC_next
    rsb r1, r2, r2, lsl #3
    add r0, r0, r1, lsl #1
    ldrb r0, [r0, #0x12c]
    pop {r4}
    bx lr
.L6F6DC_next:
    add r2, r2, #2
    cmp ip, r2
    bhi .L6F6DC_pair_loop
.L6F6DC_none:
    pop {r4}
    mov r0, #0
    bx lr
FUNCTION_END func_0006F6DC

FUNCTION_BEGIN func_0007275C
    push {r4, r5, r6}
    mov r2, r0
    ldr r3, [r0, #4]
    mov r1, #0
    mov r0, r1
    bic ip, r3, #0x80000000
    cmp ip, #0
    ldrhi r4, [r2]
    bichi r3, r3, #0x80000000
    bls .L7275C_done
.L7275C_outer:
    ldrb r2, [r4, r1]
    add r1, r1, #1
    lsl ip, r2, #25
    lsrs r5, r2, #7
    lsr r6, ip, #29
    addne r0, r0, #1
    cmp r3, r1
    and ip, r2, #15
    bls .L7275C_done
    cmp r6, #1
    addne r1, r1, ip
    bne .L7275C_next
    cmp ip, #0
    mov r2, #0
    bls .L7275C_next
.L7275C_inner:
    ldrb r5, [r4, r1]
    add r1, r1, #1
    and r5, r5, #31
    add r1, r1, r5, lsl #2
    cmp r1, r3
    addcc r2, r2, #1
    cmpcc r2, ip
    bcc .L7275C_inner
.L7275C_next:
    cmp r3, r1
    bhi .L7275C_outer
.L7275C_done:
    pop {r4, r5, r6}
    bx lr
FUNCTION_END func_0007275C

FUNCTION_BEGIN func_00073808
    push {r4, r5, r6, r7}
    mov ip, #0
    mov r5, ip
    mov r4, #31
.L73808_outer:
    and r3, ip, #0xff
    mov r2, #0
    add r1, r0, r3, lsl #2
    add r6, r3, r3, lsl #2
    str r5, [r1, #12]
    str r5, [r1, #56]
    str r5, [r1, #100]
    str r5, [r1, #584]
    str r5, [r1, #628]
    mov r1, r2
    add r3, r0, r6, lsl #3
.L73808_inner:
    add r6, r3, r2, lsl #2
    add r2, r2, #1
    add r1, r1, #2
    add r7, r3, r2, lsl #2
    str r4, [r6, #144]
    cmp r1, #10
    add r2, r2, #1
    str r4, [r7, #144]
    bcc .L73808_inner
    add ip, ip, #1
    cmp ip, #11
    bcc .L73808_outer
    mov r1, #255
    strb r5, [r0, #1]
    str r1, [r0, #4]
    strb r5, [r0, #9]
    strb r5, [r0, #8]
    pop {r4, r5, r6, r7}
    bx lr
FUNCTION_END func_00073808

FUNCTION_BEGIN func_00075894
    cmp r1, #18
    push {r4}
    beq .L75894_false
    ldr r2, [r0, #124]
    ldrb r3, [r0, #0x100]
    tst r2, #7
    movne ip, #1
    moveq ip, #0
    cmp r3, #2
    mov r2, #18
    bne .L75894_second
    cmp ip, #0
    movne r3, r2
.L75894_second:
    ldrb r4, [r0, #0x101]
    cmp r4, #2
    bne .L75894_pick
    cmp ip, #0
    bne .L75894_values
.L75894_pick:
    mov r2, r4
.L75894_values:
    and ip, r3, #0xff
    cmp ip, #18
    beq .L75894_first18
    and r4, r2, #0xff
    cmp r4, #18
    moveq r2, ip
    b .L75894_compare
.L75894_first18:
    and r3, r2, #0xff
    cmp r3, #18
    moveq r2, #0
    and r3, r2, #0xff
.L75894_compare:
    and r3, r3, #0xff
    cmp r3, r1
    andne r2, r2, #0xff
    cmpne r2, r1
    ldrbne r0, [r0, #0x102]
    cmpne r0, r1
    moveq r0, #1
    beq .L75894_done
.L75894_false:
    mov r0, #0
.L75894_done:
    pop {r4}
    bx lr
FUNCTION_END func_00075894

FUNCTION_BEGIN func_00075B70
    push {r4}
    ldrb ip, [r0, #24]
    mov r3, r0
    cmp ip, #0
    moveq r2, #0
    beq .L75B70_pairs
    and r2, ip, #1
    cmp r2, #0
    mov r0, #0
    ble .L75B70_pairs
.L75B70_first:
    ldr r4, [r3, r0, lsl #2]
    cmp r4, r1
    beq .L75B70_found
    add r0, r0, #1
    cmp r2, r0
    bgt .L75B70_first
.L75B70_pairs:
    cmp r2, ip
    mov r0, r2
    bge .L75B70_none
.L75B70_loop:
    ldr r2, [r3, r0, lsl #2]
    cmp r2, r1
    beq .L75B70_found
    add r2, r3, r0, lsl #2
    ldr r2, [r2, #4]
    cmp r2, r1
    bne .L75B70_next
    add r0, r0, #1
.L75B70_found:
    pop {r4}
    bx lr
.L75B70_next:
    add r0, r0, #2
    cmp ip, r0
    bgt .L75B70_loop
.L75B70_none:
    pop {r4}
    mvn r0, #0
    bx lr
FUNCTION_END func_00075B70

FUNCTION_BEGIN func_00076890
    ldr r1, [r0, #124]
    ldrb r2, [r0, #0x100]
    tst r1, #7
    movne r3, #1
    moveq r3, #0
    cmp r2, #2
    mov r1, #18
    bne .L76890_second
    cmp r3, #0
    movne r2, r1
.L76890_second:
    ldrb ip, [r0, #0x101]
    cmp ip, #2
    bne .L76890_pick
    cmp r3, #0
    bne .L76890_values
.L76890_pick:
    mov r1, ip
.L76890_values:
    and r3, r2, #0xff
    cmp r3, #18
    beq .L76890_first18
    and ip, r1, #0xff
    cmp ip, #18
    moveq r1, r3
    b .L76890_pack
.L76890_first18:
    and r2, r1, #0xff
    cmp r2, #18
    moveq r1, #0
    and r2, r1, #0xff
.L76890_pack:
    ldrb r0, [r0, #0x102]
    and r1, r1, #31
    and r2, r2, #31
    lsl r0, r0, #27
    lsr r0, r0, #17
    orr r0, r0, r1, lsl #5
    orr r0, r0, r2
    bx lr
FUNCTION_END func_00076890

FUNCTION_BEGIN func_0007A1A0
    push {r4, r5, r6}
    mov r1, #0
    ldrb r4, [r0, #189]
    cmp r4, #0
    beq .L7A1A0_finish_sum
    add r2, r0, #151
    tst r4, #1
    ldrbne r1, [r2, #1]!
    lsrs r3, r4, #1
    mov ip, #0
    beq .L7A1A0_sum_done
.L7A1A0_sum:
    ldrb r5, [r2, #1]
    ldrb r6, [r2, #2]!
    subs r3, r3, #1
    add r1, r1, r5
    add ip, ip, r6
    and r1, r1, #0xff
    and ip, ip, #0xff
    bne .L7A1A0_sum
.L7A1A0_sum_done:
    add r1, r1, ip
    and r1, r1, #0xff
.L7A1A0_finish_sum:
    ldrb r3, [r0, #144]
    ldr r2, [r0, #8]
    add ip, r4, r1
    add r5, r0, #12
    rsb r3, r3, r3, lsl #3
    add ip, r0, ip, lsl #2
    add r2, r2, r3, lsl #2
    add r2, r2, #4
    add ip, ip, #244
    ldrb r3, [r2, #24]
    mov r1, #0
    cmp r3, r4
    ldrhi r2, [r2, r4, lsl #2]
    add r3, r0, #152
    add r3, r3, r4
    movls r2, #0
    str r3, [r0, #20]
    stm r5, {r2, ip}
    strb r1, [r3]
    ldr r0, [r0, #16]
    str r1, [r0]
    pop {r4, r5, r6}
    bx lr
FUNCTION_END func_0007A1A0
