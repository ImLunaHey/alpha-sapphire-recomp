.syntax unified
.arch armv6k
.fpu vfpv2
.arm

/*
 * Clean-room duplicate template batch 48.
 *
 * Identifier strings below are neutral, same-length stand-ins.  Their text is
 * intentionally unrelated to the private executable; only placement, length,
 * sharing, and distinction are part of the reviewed contract.
 */

.macro DT48_BODY name, ctor, expansion_id
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r4, r1
    bl func_0012B95C
    mov r8, r0
    mov r2, #1
    adr r1, .Ldt48_id1\@
    bl func_0036F398
    mov r6, r0
    mov r2, #1
    adr r1, .Ldt48_id2\@
    mov r0, r8
    bl func_0036F398
    mov r7, r0
    mov r2, #0
    mov r1, r6
    mov r0, r8
    bl func_0036F4D0
    mov r2, #0
    mov r1, r7
    mov r0, r8
    bl func_0036F4D0
    adr r0, .Ldt48_id3\@
    mov r1, #0
    bl func_0036F28C
    mov r8, r0
    ldr r1, [r5, #4]
    mov r0, #40
    bl func_00123480
    cmp r0, #0
    moveq r4, #0
    beq .Ldt48_constructed\@
    mov r1, r4
    bl \ctor
    mov r4, r0
.Ldt48_constructed\@:
    mov r1, r4
    str r5, [r4, #28]
    mov r0, r5
    str r8, [r4, #16]
    bl func_003AB384
    ldr r0, [r4, #20]
    mov r8, #2
    cmp r0, #0
    ldr r0, [r5, #4]
    bne .Ldt48_have_storage\@
    mov r1, #8
    bl func_0012B95C+16
    add r1, r4, #20
    stm r1, {r0, r8}
.Ldt48_have_storage\@:
    ldr r0, [r4, #24]
    cmp r0, #0
    bhi .Ldt48_store_first\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.Ldt48_store_first\@:
    ldr r0, [r4, #20]
    str r6, [r0]
    ldr r0, [r4, #24]
    cmp r0, #1
    bhi .Ldt48_store_second\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.Ldt48_store_second\@:
    ldr r0, [r4, #20]
    str r7, [r0, #4]
    pop {r4, r5, r6, r7, r8, pc}
.size \name, .-\name
.Ldt48_id1\@:
    .set .Ldt48_id2\@, .Ldt48_id1\@ + 24
    .set .Ldt48_id3\@, .Ldt48_id1\@ + 48
    .ascii "neutral-shared-id-01\000\000\000\000neutral-shared-second2\000\000\expansion_id\000"
.endm

DT48_BODY func_00368600, func_0019C0F8, neutral-expansion-a
DT48_BODY func_00368CE0, func_0019C160, neutral-expansion-b01
DT48_BODY func_00369104, func_0019C190, neutral-expansion-c02
