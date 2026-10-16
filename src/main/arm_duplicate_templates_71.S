.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT71_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT71_END name
.size \name, .-\name
.endm

.macro DT71_FORWARD name, prepare, forward
DT71_BEGIN \name
    push {r3, r4, r5, r6, r7, lr}
    mov r5, r0
    mov r6, r1
    mov r7, r2
    mov r4, r3
    bl \prepare
    mov r3, r7
    mov r2, r6
    mov r1, r5
    str r4, [sp]
    bl \forward
    pop {r3, r4, r5, r6, r7, pc}
DT71_END \name
.endm

.macro DT71_CLEAR name
DT71_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    add r4, r0, #4
    ldr r5, [r0, #20]
    cmp r5, #0
    ldrne r6, [r5]
    beq .Ldt71_clear_return_\@
.Ldt71_clear_secondary_loop_\@:
    cmp r6, r5
    beq .Ldt71_clear_reconnect_\@
    ldr r7, [r4, #16]
    cmp r6, r7
    beq .Ldt71_clear_advance_secondary_\@
    ldr r2, [r6, #4]
    ldr r7, [r6]
    add r0, r6, #8
    str r7, [r2]
    ldm r6, {r1, r2}
    str r2, [r1, #4]
    ldr r1, [r4, #20]
    sub r1, r1, #1
    str r1, [r4, #20]
    ldr r1, [r6, #8]
    ldr r1, [r1]
    blx r1
    ldr r0, [r4, #4]
    str r0, [r6]
    str r6, [r4, #4]
.Ldt71_clear_advance_secondary_\@:
    mov r6, r7
    b .Ldt71_clear_secondary_loop_\@
.Ldt71_clear_reconnect_\@:
    ldr r0, [r4, #16]
    ldr r1, [r4, #4]
    str r1, [r0]
    str r0, [r4, #4]
    ldr r0, [r4]
    cmp r0, #0
    beq .Ldt71_clear_zero_\@
.Ldt71_clear_primary_loop_\@:
    mov r5, r0
    ldr r0, [r0]
    str r0, [r4]
    ldr r0, [r5, #8]
    cmp r0, #0
    beq .Ldt71_clear_first_done_\@
    ldr r1, [r0, #-8]!
    cmp r1, #0
    beq .Ldt71_clear_first_default_\@
    blx r1
    b .Ldt71_clear_first_done_\@
.Ldt71_clear_first_default_\@:
    nop {0}
    bl func_00302108
.Ldt71_clear_first_done_\@:
    cmp r5, #0
    beq .Ldt71_clear_second_done_\@
    ldr r1, [r5, #-8]
    sub r0, r5, #8
    cmp r1, #0
    beq .Ldt71_clear_second_default_\@
    blx r1
    b .Ldt71_clear_second_done_\@
.Ldt71_clear_second_default_\@:
    nop {0}
    bl func_00302108
.Ldt71_clear_second_done_\@:
    ldr r0, [r4]
    cmp r0, #0
    bne .Ldt71_clear_primary_loop_\@
.Ldt71_clear_zero_\@:
    mov r0, #0
    str r0, [r4, #4]
    str r0, [r4, #8]
    str r0, [r4, #12]
.Ldt71_clear_return_\@:
    sub r0, r4, #4
    pop {r4, r5, r6, r7, r8, pc}
DT71_END \name
.endm

.macro DT71_RETRY name, attempt
DT71_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, sl, lr}
    mov r4, #0
    mov r8, r0
    mov r9, r1
    ldr r5, .Ldt71_retry_base_\@
    ldr r6, .Ldt71_retry_accepted_\@
    mov sl, r2
    add r7, r5, #0x3fc
.Ldt71_retry_loop_\@:
    mov r2, sl
    mov r1, r9
    mov r0, r8
    bl \attempt
    ands r1, r0, #0x80000000
    mov r2, r0
    bpl .Ldt71_retry_nonnegative_\@
    cmp r0, r6
    beq .Ldt71_retry_return_\@
    and r1, r0, #0x3fc00
    cmp r1, #0x2c00
    beq .Ldt71_retry_increment_\@
    cmp r0, r7
    beq .Ldt71_retry_use_base_\@
    lsrs r0, r2, #31
    blne func_00146000
.Ldt71_retry_increment_\@:
    add r4, r4, #1
    cmp r4, #2
    blt .Ldt71_retry_loop_\@
    b .Ldt71_retry_use_base_\@
.Ldt71_retry_nonnegative_\@:
    cmp r4, #2
    movlt r0, #0
    blt .Ldt71_retry_return_\@
.Ldt71_retry_use_base_\@:
    mov r0, r5
.Ldt71_retry_return_\@:
    pop {r4, r5, r6, r7, r8, r9, sl, pc}
DT71_END \name
.Ldt71_retry_base_\@:
    .word arm_duplicate_templates_71_retry_base_status_identity
.Ldt71_retry_accepted_\@:
    .word service_query_accepted_status_31
.endm

.macro DT71_ACCUMULATE name, middle
DT71_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    mov r6, r1
    mov r4, #0
    bl func_002F7220
    orr r0, r0, r4
    ands r1, r0, #0x80000000
    mov r4, r0
    bmi .Ldt71_accumulate_return_\@
    mov r1, r6
    mov r0, r5
    bl \middle
    orr r0, r0, r4
    ands r1, r0, #0x80000000
    mov r4, r0
    bmi .Ldt71_accumulate_return_\@
    mov r1, r6
    mov r0, r5
    bl shared_completion_secondary_71
    orr r0, r0, r4
.Ldt71_accumulate_return_\@:
    pop {r4, r5, r6, pc}
DT71_END \name
.endm

.macro DT71_CHAIN name, mover, dispatch
DT71_BEGIN \name
    push {r4, r5, lr}
    mov r4, r0
    ldr r0, .Ldt71_chain_dispatch_\@
    sub sp, sp, #12
    add r1, r4, #64
    str r0, [r4]
    ldr ip, [r4, #80]
    add r3, sp, #4
    mov r2, sp
    ldr r0, [ip, #8]
    stm sp, {r0, ip}
    add r0, sp, #8
    bl \mover
    add r4, r4, #64
    ldr r0, [r4, #16]
    movs r1, r0
    beq .Ldt71_chain_done_\@
    str r0, [sp, #4]
    ldr r0, [r1, #8]
    add r3, sp, #4
    mov r2, sp
    str r0, [sp]
    mov r1, r4
    add r0, sp, #8
    bl \mover
    ldr r0, [r4, #16]
    ldr r1, [r4, #4]
    str r1, [r0, #12]
    str r0, [r4, #4]
    ldr r0, [r4]
    cmp r0, #0
    beq .Ldt71_chain_done_\@
.Ldt71_chain_loop_\@:
    mov r5, r0
    ldr r0, [r0]
    str r0, [r4]
    ldr r0, [r5, #8]
    bl func_00160F9C
    mov r0, r5
    nop {0}
    bl func_00160F9C
    ldr r0, [r4]
    cmp r0, #0
    bne .Ldt71_chain_loop_\@
.Ldt71_chain_done_\@:
    add sp, sp, #12
    sub r0, r4, #64
    pop {r4, r5, lr}
    b func_002412A4
DT71_END \name
.Ldt71_chain_dispatch_\@:
    .word \dispatch
.endm

.macro DT71_COMPOSITE name, dispatch
DT71_BEGIN \name
    ldr r1, .Ldt71_composite_dispatch_\@
    push {r4, r5, r6, lr}
    str r1, [r0], #116
    mov r6, r0
    ldrd r4, [r6]
    cmp r4, r5
    beq .Ldt71_composite_first_done_\@
.Ldt71_composite_first_loop_\@:
    ldr r1, [r4]
    mov r0, r4
    ldr r1, [r1]
    blx r1
    add r4, r4, #40
    cmp r4, r5
    bne .Ldt71_composite_first_loop_\@
.Ldt71_composite_first_done_\@:
    ldr r0, [r6]
    bl func_00160F9C
    sub r6, r6, #12
    ldrd r4, [r6]
    cmp r4, r5
    beq .Ldt71_composite_second_done_\@
.Ldt71_composite_second_loop_\@:
    ldr r1, [r4]
    mov r0, r4
    ldr r1, [r1]
    blx r1
    add r4, r4, #8
    cmp r4, r5
    bne .Ldt71_composite_second_loop_\@
.Ldt71_composite_second_done_\@:
    ldr r0, [r6]
    bl func_00160F9C
    ldr r4, .Ldt71_composite_nested_\@
    str r4, [r6, #-32]!
    ldr r0, [r6, #8]
    bl func_00160F9C
    sub r6, r6, #72
    str r4, [r6, #52]
    ldr r0, [r6, #60]
    bl func_00160F9C
    add r0, r6, #20
    nop {0}
    bl func_00163ED0
    sub r0, r0, #12
    nop {0}
    bl func_001862FC
    sub r0, r0, #8
    pop {r4, r5, r6, pc}
DT71_END \name
.Ldt71_composite_dispatch_\@:
    .word \dispatch
.Ldt71_composite_nested_\@:
    .word arm_duplicate_templates_71_nested_dispatch_identity
.endm

DT71_FORWARD func_001C4EE8, func_001C4D94, func_001C4C94
DT71_FORWARD func_001C4F18, func_001C4DAC, func_001C4C94
DT71_FORWARD func_001C4F48, func_001C4DC4, func_001C4C94
DT71_FORWARD func_001C4F78, func_001C4EAC, func_001C4C94
DT71_FORWARD func_001C4FA8, func_001C4EB8, func_001C4C94
DT71_FORWARD func_001C4FD8, func_001C4ED0, func_001C4C94
DT71_FORWARD func_001C5008, func_001C4DA0, func_001C4DDC
DT71_FORWARD func_001C5038, func_001C4DB8, func_001C4DDC
DT71_FORWARD func_001C5068, func_001C4DD0, func_001C4DDC
DT71_FORWARD func_001C5098, func_001C4EC4, func_001C4DDC
DT71_FORWARD func_001C50C8, func_001C4EDC, func_001C4DDC

DT71_CLEAR func_002179DC
DT71_CLEAR func_0024FD1C

DT71_RETRY func_002DEF0C, func_002DEDFC
DT71_RETRY func_002DF024, func_002DEE4C
DT71_RETRY func_002DF0B0, func_002DEE9C

DT71_ACCUMULATE func_002EAD38, func_002EAF50
DT71_ACCUMULATE func_002EB8D8, func_002EBA04
DT71_ACCUMULATE func_002F0B88, func_002F0D7C
DT71_ACCUMULATE func_002F9440, func_002F956C

DT71_CHAIN func_0028CF4C, func_005597F4, arm_duplicate_templates_71_chain_dispatch_a_identity
DT71_CHAIN func_0029DCD8, func_0055A9E4, arm_duplicate_templates_71_chain_dispatch_b_identity

DT71_COMPOSITE func_0029A554, arm_duplicate_templates_71_composite_dispatch_a_identity
DT71_COMPOSITE func_0029DF68, arm_duplicate_templates_71_composite_dispatch_b_identity
