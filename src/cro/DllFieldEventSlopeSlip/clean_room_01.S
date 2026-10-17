.syntax unified
.arch armv6k
.fpu vfp
.arm

/*
 * Independently implemented from docs/specs/cro/DllFieldEventSlopeSlip_01.md.
 * Calls in the cleanup routines use the specified veneer addresses: I17 is
 * 0x0088 and I18 is 0x0090.  Keeping those calls module-relative avoids
 * assigning private identities to the imports.
 */

.section .text.func_000000D0, "ax", %progbits
.balign 4
.global func_000000D0
.type func_000000D0, %function
func_000000D0:
    push {r4, r5, r6, lr}
    mov r4, r0
    str r1, [r0, #0x18]
    mov r5, r2
    mov r0, r1
    bl . - 0xE4
    str r0, [r4, #0x28]
    ldr r0, [r0, #0x0C]
    str r0, [r4, #0x1C]
    strb r5, [r4, #0x24]
    bl . - 0xF0
    bl . - 0xEC
    cmp r0, #0
    movne r0, #1
    strb r0, [r4, #0x30]
    pop {r4, r5, r6, pc}
.size func_000000D0, . - func_000000D0

.section .text.func_000002DC, "ax", %progbits
.balign 4
.global func_000002DC
.type func_000002DC, %function
func_000002DC:
    push {r4, r5, r6, lr}
    mov r4, r0
    str r1, [r0, #0x18]
    mov r5, r2
    mov r0, r1
    bl . - 0x2F0
    str r0, [r4, #0x28]
    ldr r0, [r0, #0x0C]
    str r0, [r4, #0x1C]
    strb r5, [r4, #0x24]
    pop {r4, r5, r6, pc}
.size func_000002DC, . - func_000002DC

.section .text.func_000006D0, "ax", %progbits
.balign 4
.global func_000006D0
.type func_000006D0, %function
func_000006D0:
    push {r4, r5, r6, lr}
    mov r4, r0
    str r1, [r0, #0x1C]
    mov r5, r2
    mov r0, r1
    bl . - 0x6E4
    str r0, [r4, #0x2C]
    ldr r0, [r0, #0x0C]
    str r0, [r4, #0x20]
    strb r5, [r4, #0x28]
    bl . - 0x6F0
    bl . - 0x6EC
    cmp r0, #0
    movne r0, #1
    strb r0, [r4, #0x34]
    pop {r4, r5, r6, pc}
.size func_000006D0, . - func_000006D0

.macro RETURN_TRUE name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    mov r0, #1
    bx lr
.size \name, . - \name
.endm

RETURN_TRUE func_00000110
RETURN_TRUE func_00000464
RETURN_TRUE func_00000710

.macro CLEANUP_WRAPPER name, call_delta
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, lr}
    bl . - \call_delta
    pop {r4, lr}
    b . - \call_delta
.size \name, . - \name
.endm

CLEANUP_WRAPPER func_000002C8, 0x244
CLEANUP_WRAPPER func_000006BC, 0x638
CLEANUP_WRAPPER func_00000918, 0x894

.macro CLEANUP_TAIL name, call_delta
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    b . - \call_delta
.size \name, . - \name
.endm

CLEANUP_TAIL func_000002D8, 0x250
CLEANUP_TAIL func_000006CC, 0x644
CLEANUP_TAIL func_00000928, 0x8A0

.section .text.func_0000092C, "ax", %progbits
.balign 4
.global func_0000092C
.type func_0000092C, %function
func_0000092C:
    ldr r0, [pc, #0x20]
    vldr s1, [pc, #0x14]
    vldr s0, [pc, #0x14]
    vstr s1, [r0]
    vstr s1, [r0, #4]
    vstr s0, [r0, #8]
    vstr s0, [r0, #12]
    bx lr
.size func_0000092C, . - func_0000092C

/* The public partition keeps the adjacent pools separate from the function. */
.section .pool.__cro_pool_0000094c, "a", %progbits
.balign 4
.global __cro_pool_0000094c
.type __cro_pool_0000094c, %object
__cro_pool_0000094c:
.Lslope_point_seven:
    .float 0.7
.Lslope_one:
    .float 1.0
.size __cro_pool_0000094c, . - __cro_pool_0000094c

.section .pool.__cro_pool_00000954, "a", %progbits
.balign 4
.global __cro_pool_00000954
.type __cro_pool_00000954, %object
__cro_pool_00000954:
.Lslope_config_storage:
    .word slope_slip_config
.size __cro_pool_00000954, . - __cro_pool_00000954
