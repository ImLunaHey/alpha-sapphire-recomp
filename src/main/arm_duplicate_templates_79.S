.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT79_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT79_END name
.size \name,.-\name
.endm

.macro DT79_RELEASE_GLOBAL name, slot
DT79_BEGIN \name
    push {r4, lr}
    ldr r4, .Ldt79_release_slot\@
    ldr r0, [r4]
    cmp r0, #0
    beq .Ldt79_release_done\@
    bl func_002C20AC
    mov r0, #0
    str r0, [r4]
.Ldt79_release_done\@:
    pop {r4, pc}
DT79_END \name
.Ldt79_release_slot\@:
    .word \slot
.endm

.macro DT79_OPTIONAL_FLAGGED name, destination
DT79_BEGIN \name
    ldr r1, .Ldt79_flag_owner\@
    add r0, r0, #4
    ldrb r1, [r1, #4]
    cmp r1, #0
    bne .Ldt79_flag_return\@
    add r0, r0, #4
    b \destination
.Ldt79_flag_return\@:
    bx lr
DT79_END \name
.Ldt79_flag_owner\@:
    .word ipc_allocator_dispatch_owner_68
.endm

.macro DT79_INSTALL_TAG name
DT79_BEGIN \name
    ldr r1, .Ldt79_record_tag\@
    push {r4, lr}
    str r1, [r0], #36
    bl func_001862FC
    pop {r4, lr}
    sub r0, r0, #36
    b func_00160A64
DT79_END \name
.Ldt79_record_tag\@:
    .word arm_duplicate_templates_79_record_tag_identity
.endm

.macro DT79_SET_IDENTITY name, destination
DT79_BEGIN \name
    ldr r1, .Ldt79_constructor_tag\@
    push {r4, lr}
    str r1, [r0], #8
    bl \destination
    sub r0, r0, #8
    pop {r4, pc}
DT79_END \name
.Ldt79_constructor_tag\@:
    .word arm_duplicate_templates_79_constructor_tag_identity
.endm

.macro DT79_LOAD_SOURCE name, destination
DT79_BEGIN \name
    mov r1, r0
    ldr r0, .Ldt79_source_context\@
    ldr r0, [r0, #36]
    b \destination
DT79_END \name
.Ldt79_source_context\@:
    .word arm_duplicate_templates_79_source_context_identity
.endm

.macro DT79_INDEXED_ADDRESS name
DT79_BEGIN \name
    ldr r0, [r0, #4]
    add r0, r0, r1, lsl #3
    adr r1, .Ldt79_index_descriptor\@
    b func_0018BF20
DT79_END \name
.Ldt79_index_descriptor\@:
.endm

.macro DT79_OPTIONAL_VALUE name, destination
DT79_BEGIN \name
    cmp r0, #0
    beq .Ldt79_value_return\@
    b \destination
.Ldt79_value_return\@:
    bx lr
DT79_END \name
.endm

.macro DT79_LOAD_MEMBER name, identity
DT79_BEGIN \name
    mov r0, r1
    ldr r1, .Ldt79_member_identity\@
    ldr r0, [r0, #4]
    b func_0017F3F8
DT79_END \name
.Ldt79_member_identity\@:
    .word \identity
.endm

.macro DT79_LITERAL_SERVICE name, destination
DT79_BEGIN \name
    mov r0, r0
    ldr r0, .Ldt79_service_object\@
    b \destination
DT79_END \name
.Ldt79_service_object\@:
    .word service_lifecycle_object_43
.endm

.macro DT79_CALL_PRESERVE_R0 name, destination
DT79_BEGIN \name
    push {r0, lr}
    bl \destination
    pop {r0, pc}
DT79_END \name
.endm

.macro DT79_FIXED_ARGUMENT name, destination
DT79_BEGIN \name
    mov r2, r1
    mov r1, #4
    b \destination
DT79_END \name
.endm

.macro DT79_STORE_IDENTITY name, identity, destination
DT79_BEGIN \name
    ldr r1, .Ldt79_stored_identity\@
    str r1, [r0]
    b \destination
DT79_END \name
.Ldt79_stored_identity\@:
    .word \identity
.endm

DT79_RELEASE_GLOBAL func_002C27B0, arm_duplicate_templates_79_release_slot_a_identity
DT79_RELEASE_GLOBAL func_002C2C48, arm_duplicate_templates_79_release_slot_b_identity
DT79_OPTIONAL_FLAGGED func_00171F38, func_001602B8
DT79_OPTIONAL_FLAGGED func_00171F5C, func_00160380
DT79_INSTALL_TAG func_00206070
DT79_INSTALL_TAG func_002B005C
DT79_SET_IDENTITY func_0033A3C0, func_001787CC
DT79_SET_IDENTITY func_0033A3FC, func_00205C3C
DT79_LOAD_SOURCE func_0014EB1C, func_0016BB14
DT79_LOAD_SOURCE func_0014EBB4, func_0016BB50
DT79_INDEXED_ADDRESS func_00298E60
DT79_INDEXED_ADDRESS func_00298EA8
DT79_OPTIONAL_VALUE func_002C20AC, func_003B7EC0
DT79_OPTIONAL_VALUE func_00520B18, func_001D1DC8
DT79_LOAD_MEMBER func_004AC6FC, arm_duplicate_templates_79_member_key_a_identity
DT79_LOAD_MEMBER func_004B1E0C, arm_duplicate_templates_79_member_key_b_identity
DT79_LITERAL_SERVICE func_00164F44, func_001602B8
DT79_LITERAL_SERVICE func_00164F54, func_00160380
DT79_CALL_PRESERVE_R0 func_001A3958, func_00301034
DT79_CALL_PRESERVE_R0 func_00300980, func_00300B28
DT79_FIXED_ARGUMENT func_004175B8, func_004171D0
DT79_FIXED_ARGUMENT func_004175C4, arm_duplicate_templates_79_secondary_0041729C
DT79_STORE_IDENTITY func_0032BD18, arm_duplicate_templates_79_stored_identity_a, func_0032ADB0
DT79_STORE_IDENTITY func_003B8038, arm_duplicate_templates_79_stored_identity_b, func_003BD0B8
