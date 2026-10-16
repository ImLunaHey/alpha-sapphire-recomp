.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT76_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT76_END name
.size \name, .-\name
.endm

.macro DT76_CONFIGURE_RESULT name
DT76_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r6, r0
    mov r4, r1
    ldr r5, [r1]
    mov r7, #8
    ldr r0, [r5]
    ldr r1, [r0, #28]
    mov r0, r5
    blx r1
    mov r2, r0
    mov r3, #1
    mov r1, r7
    mov r0, r5
    bl func_0012B9A0
    cmp r0, #0
    beq .Ldt76_configure_done\@
    ldrsh r2, [r4, #4]
    ldr r1, [r4]
    bl func_003A7DD8
.Ldt76_configure_done\@:
    str r0, [r6, #12]
    pop {r4, r5, r6, r7, r8, pc}
DT76_END \name
.endm

.macro DT76_GUARDED_SERVICE name, guard
DT76_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, #0
    ldr r4, .Ldt76_service_guard\@
    ldrb r0, [r4]
    cmp r0, #0
    ldreq r0, .Ldt76_service_inactive\@
    beq .Ldt76_service_done\@
    ldrb r0, [r4, #1]
    cmp r0, #0
    ldreq r0, .Ldt76_service_failure\@
    beq .Ldt76_service_done\@
    bl func_002C2244
    ldr r1, [r0]
    ldr r1, [r1, #20]
    blx r1
    bl func_002C21AC
    mov r0, r5
    strb r5, [r4, #1]
.Ldt76_service_done\@:
    pop {r4, r5, r6, pc}
DT76_END \name
.Ldt76_service_guard\@:
    .word \guard
.Ldt76_service_inactive\@:
    .word arm_duplicate_templates_76_service_inactive_identity
.Ldt76_service_failure\@:
    .word arm_duplicate_templates_76_service_failure_identity
.endm

.macro DT76_ATTACHED_RECORD name, initializer
DT76_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    adr r0, .Ldt76_attached_post_body\@
    mov r1, #0
    bl func_0036F28C
    mov r6, r0
    ldr r1, [r4, #4]
    mov r0, #56
    bl func_00123480
    cmp r0, #0
    movne r1, r5
    blne \initializer
    str r4, [r0, #28]
    mov r1, r0
    str r6, [r0, #16]
    mov r0, r4
    pop {r4, r5, r6, lr}
    b func_003AB384
DT76_END \name
.set .Ldt76_attached_post_body\@, \name + 76
.endm

.macro DT76_ROUTE_INDEXED name, present_tail
DT76_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #28]
    mov ip, r1
    mov r1, r2
    ldr r0, [r0, ip, lsl #3]
    mov r4, r3
    bl func_004C8ADC
    cmp r0, #0
    beq .Ldt76_route_missing\@
    mov r1, r4
    pop {r4, lr}
    mvn r2, #0
    b \present_tail
.Ldt76_route_missing\@:
    mov r2, #0
    pop {r4, lr}
    mov r1, r2
    mov r0, r2
    b arm_duplicate_templates_74_fallback_secondary
DT76_END \name
.endm

.macro DT76_RESOLVE_OFFSET name, fallback
DT76_BEGIN \name
    push {r3, r4, r5, lr}
    mov r4, r0
    mov r2, #9
    mov r1, sp
    add r0, r0, #4
    bl func_0017D058
    cmp r0, #0
    ldreq r0, .Ldt76_offset_fallback\@
    beq .Ldt76_offset_done\@
    ldr r0, [sp]
    add r0, r0, r4
    ldr r1, [r0, #4]
    add r0, r0, r1
.Ldt76_offset_done\@:
    pop {r3, r4, r5, pc}
DT76_END \name
.Ldt76_offset_fallback\@:
    .word \fallback
.endm

.macro DT76_ALLOCATE_ZEROED name
DT76_BEGIN \name
    mov r0, #24
    push {r4, lr}
    bl func_001D1EB0
    cmp r0, #0
    beq .Ldt76_allocate_done\@
    mov r2, #0
    str r2, [r0]
    str r2, [r0, #4]
    str r2, [r0, #8]
    mov r1, #1
    str r2, [r0, #12]
    str r1, [r0, #20]
    str r2, [r0, #16]
.Ldt76_allocate_done\@:
    pop {r4, pc}
DT76_END \name
.endm

.macro DT76_FORWARD_STACKED name, destination
DT76_BEGIN \name
    push {r4, lr}
    sub sp, sp, #8
    mov r4, r1
    ldr r1, [sp, #16]
    str r3, [sp]
    mov r3, r2
    str r1, [sp, #4]
    ldr ip, [r0]
    mov r1, r0
    mov r2, r4
    mov r0, ip
    bl \destination
    add sp, sp, #8
    pop {r4, pc}
DT76_END \name
.endm

.macro DT76_DISPATCH_TAIL name
DT76_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r0, [r1]
    mov r4, r1
    ldr r1, [r0, #28]
    mov r0, r4
    blx r1
    rsb r2, r0, #0
    mov r1, r5
    mov r0, r4
    pop {r4, r5, r6, lr}
    mov r3, #1
    b func_0012B9A0
DT76_END \name
.endm

.macro DT76_SET_READY name
DT76_BEGIN \name
    push {r4, lr}
    mov r4, r0
    bl func_001611D0
    cmp r0, #0
    beq .Ldt76_ready_done\@
    add r1, r4, #16
    mov r0, r4
    bl arm_duplicate_templates_76_ready_secondary
    cmp r0, #0
    beq .Ldt76_ready_done\@
    mov r0, #1
    strb r0, [r4, #13]
.Ldt76_ready_done\@:
    pop {r4, pc}
DT76_END \name
.endm

.macro DT76_TAGGED_OBJECT name, constructor, tag
DT76_BEGIN \name
    push {r4, lr}
    bl \constructor
    ldr r1, .Ldt76_tag\@
    str r1, [r0]
    pop {r4, pc}
DT76_END \name
.Ldt76_tag\@:
    .word \tag
.endm

.macro DT76_FORMAT_FIXED name, formatter, descriptor
DT76_BEGIN \name
    push {r4, lr}
    sub sp, sp, #64
    mov r4, r0
    ldr r1, .Ldt76_format_descriptor\@
    mov r0, sp
    bl \formatter
    mov r2, #64
    mov r1, sp
    mov r0, r4
    bl func_00300B28
    add sp, sp, #64
    pop {r4, pc}
DT76_END \name
.Ldt76_format_descriptor\@:
    .word \descriptor
.endm

DT76_CONFIGURE_RESULT func_00390DA0
DT76_CONFIGURE_RESULT func_00391130
DT76_GUARDED_SERVICE func_002C1D28, arm_duplicate_templates_76_service_guard_a_identity
DT76_GUARDED_SERVICE func_002C2CEC, arm_duplicate_templates_76_service_guard_b_identity
DT76_ATTACHED_RECORD func_00368BB4, func_0019C148
DT76_ATTACHED_RECORD func_0036A2DC, func_0019C280
DT76_ROUTE_INDEXED func_0036286C, arm_duplicate_templates_76_route_secondary
DT76_ROUTE_INDEXED func_003628C8, func_00419288
DT76_RESOLVE_OFFSET func_0016B0CC, arm_duplicate_templates_76_offset_fallback_a_identity
DT76_RESOLVE_OFFSET func_004C1F88, arm_duplicate_templates_76_offset_fallback_b_identity
DT76_ALLOCATE_ZEROED func_001CFE14
DT76_ALLOCATE_ZEROED func_001CFEAC
DT76_FORWARD_STACKED func_003C550C, func_003C5344
DT76_FORWARD_STACKED func_003C69D4, arm_duplicate_templates_76_forward_secondary
DT76_DISPATCH_TAIL func_0013F48C
DT76_DISPATCH_TAIL func_004F2B94
DT76_SET_READY func_00146F24
DT76_SET_READY func_002132B8
DT76_TAGGED_OBJECT func_0011C348, func_0011C274, arm_duplicate_templates_76_tag_0011C348_identity
DT76_TAGGED_OBJECT func_00160A3C, func_00171DBC, arm_duplicate_templates_76_tag_00160A3C_identity
DT76_TAGGED_OBJECT func_002C7B30, func_002C67C4, arm_duplicate_templates_76_tag_002C7B30_identity
DT76_TAGGED_OBJECT func_00324C20, func_001284C0, arm_duplicate_templates_76_tag_00324C20_identity
DT76_TAGGED_OBJECT func_003345CC, func_003336EC, arm_duplicate_templates_76_tag_003345CC_identity
DT76_FORMAT_FIXED func_00122F18, func_0012EC80, arm_duplicate_templates_76_format_descriptor_a_identity
DT76_FORMAT_FIXED func_00123118, func_0012EF50, arm_duplicate_templates_76_format_descriptor_b_identity
