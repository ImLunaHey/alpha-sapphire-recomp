.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT77_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT77_END name
.size \name, .-\name
.endm

.macro DT77_UPDATE_HALFWORD name, slot
DT77_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldrh r0, [r0, #4]
    mov r5, r1
    cmp r0, r5
    beq .Ldt77_update_done\@
    ldr r0, .Ldt77_update_slot\@
    ldr r2, [r4, #8]
    ldr r0, [r0]
    bl func_00128CBC
    strh r5, [r4, #4]
.Ldt77_update_done\@:
    pop {r4, r5, r6, pc}
DT77_END \name
.Ldt77_update_slot\@:
    .word \slot
.endm

.macro DT77_COMPARE_PAIR name, complete
DT77_BEGIN \name
    push {r6, r7, r11, lr}
    mov r11, r2
    push {r4, r5}
    ldm r1, {r3, r4, r5}
    ldm r0, {r0, r1, r2}
    bics r12, r1, r0, lsl #1
    bicsmi r12, r4, r3, lsl #1
    bpl .Ldt77_compare_done\@
    bl func_00195248
    bl \complete
.Ldt77_compare_done\@:
    pop {r4, r5, r6, r7}
    pop {r11, pc}
DT77_END \name
.endm

.macro DT77_TEST_PAIR name, complete
DT77_BEGIN \name
    push {r6, r7, r11, lr}
    mov r11, r2
    push {r4, r5}
    ldm r1, {r3, r4, r5}
    ldm r0, {r0, r1, r2}
    tst r0, #0x40000000
    tsteq r3, #0x40000000
    bne .Ldt77_test_done\@
    bl func_001955F0
    bl \complete
.Ldt77_test_done\@:
    pop {r4, r5, r6, r7}
    pop {r11, pc}
DT77_END \name
.endm

.macro DT77_DISPATCH_OPTIONAL name, resolver
DT77_BEGIN \name
    push {r4, lr}
    bl \resolver
    cmp r0, #0
    beq .Ldt77_dispatch_return\@
    ldr r1, [r0, #-8]!
    cmp r1, #0
    beq .Ldt77_dispatch_fallback\@
    pop {r4, lr}
    bx r1
.Ldt77_dispatch_fallback\@:
    pop {r4, lr}
    b func_00302108
.Ldt77_dispatch_return\@:
    pop {r4, pc}
DT77_END \name
.endm

.macro DT77_QUERY_PRESENCE name, query
DT77_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #4]
    mov r4, #0
    bl \query
    cmp r0, #0
    ldrne r4, .Ldt77_presence\@
    mov r0, r4
    pop {r4, pc}
DT77_END \name
.Ldt77_presence\@:
    .word duplicate_template_22_presence_identity
.endm

.macro DT77_CALL_FORWARD name, prepare, destination
DT77_BEGIN \name
    push {r4, lr}
    bl \prepare
    pop {r4, lr}
    b \destination
DT77_END \name
.endm

.macro DT77_READ_MEMBER name, resolver, member
DT77_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl \resolver
    ldrb r4, [r0, #\member]
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
DT77_END \name
.endm

.macro DT77_INITIALIZE_CONDITIONALLY name
DT77_BEGIN \name
    push {r4, lr}
    cmp r1, #0
    mov r4, r0
    beq .Ldt77_initialize_absent\@
    bl func_0012FE3C
    b .Ldt77_initialize_done\@
.Ldt77_initialize_absent\@:
    nop
    bl func_0012FE20
.Ldt77_initialize_done\@:
    mov r0, r4
    pop {r4, pc}
DT77_END \name
.endm

.macro DT77_BOUNDED_LOOKUP name
DT77_BEGIN \name
    cmp r1, #6
    ldrcc r0, [r0, r1, lsl #2]
    bxcc lr
    mov r2, #0
    mov r1, r2
    mov r0, r2
    push {r4, lr}
    bl func_0011EF4C
    mov r0, #0
    pop {r4, pc}
DT77_END \name
.endm

DT77_UPDATE_HALFWORD func_00175E24, arm_duplicate_templates_19_owned_object_slot_003B0B80
DT77_UPDATE_HALFWORD func_003B09C4, arm_duplicate_templates_19_owned_object_slot_003B0994
DT77_COMPARE_PAIR func_00195590, func_00195854
DT77_COMPARE_PAIR func_002FF1EC, func_00195160
DT77_TEST_PAIR func_001955C0, func_00195854
DT77_TEST_PAIR func_002FF21C, func_00195160
DT77_DISPATCH_OPTIONAL func_00203690, func_00170CC0
DT77_DISPATCH_OPTIONAL func_002A2180, func_00173304
DT77_QUERY_PRESENCE func_001D0FAC, func_001C5038
DT77_QUERY_PRESENCE func_001D0FD0, func_001C5068
DT77_QUERY_PRESENCE func_001D0FF4, func_001C50C8
DT77_CALL_FORWARD func_002115A8, func_002115B8, func_00160A64
DT77_CALL_FORWARD func_00211F44, func_00173304, func_00160A64
DT77_CALL_FORWARD func_002547C0, func_0024F928, func_00160A64
DT77_CALL_FORWARD func_00298E38, func_0027B858, func_00160A64
DT77_CALL_FORWARD func_003FB218, func_003AB234, func_002FF8C0
DT77_CALL_FORWARD func_00433058, func_00433068, func_002FF8C0
DT77_READ_MEMBER func_00153054, func_0016BC84, 26
DT77_READ_MEMBER func_004D2050, func_0016BD80, 26
DT77_READ_MEMBER func_00153080, func_0016BC84, 27
DT77_READ_MEMBER func_004D17BC, func_0016BD80, 27
DT77_INITIALIZE_CONDITIONALLY func_00200910
DT77_INITIALIZE_CONDITIONALLY func_00200938
DT77_BOUNDED_LOOKUP func_003B6150
DT77_BOUNDED_LOOKUP func_004D36DC
