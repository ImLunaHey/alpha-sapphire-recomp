.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00002324, "ax", %progbits
.balign 4
.global func_00002324
.type func_00002324, %function
func_00002324:
.Lentry_00002324:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #0x8C]
    sub sp, sp, #0x30
    mov r5, r1
    cmp r0, #0
    bne .Lreturn_00002324
    mov r6, #0
    mov r0, #2
    str r6, [sp, #0x14]
    strb r0, [sp, #0x28]
    mov r0, r1
    str r6, [sp, #0x2C]
    bl .Lveneer_000001F4
    cmp r0, #0
    movne r0, #0x26
    moveq r0, #0x25
    strb r0, [sp, #0x28]
    mov r0, r5
    bl .Lveneer_000001FC
    mov r5, #1
    str r0, [sp, #0x2C]
    str r5, [sp, #0x14]
    ldr r0, [r4, #0x74]
    add r2, sp, #0x14
    add r3, sp, #0x28
    add r12, sp, #0x0C
    ldr r1, [r0, #4]
    str r2, [sp, #8]
    str r3, [sp, #4]
    stmia r12, {r1, r6}
    mov r3, r1
    ldr r2, [r0, #8]
    str r2, [sp]
    ldr r0, [r4, #0x78]
    bl .Lveneer_00000204
    str r0, [r4, #0x8C]
    mov r0, #3
    strb r0, [sp, #0x18]
    mov r0, r4
    str r6, [sp, #0x1C]
    str r6, [sp, #0x20]
    str r6, [sp, #0x24]
    bl .Lveneer_000000BC
    mov r1, #1
    bl .Lveneer_0000013C
    mov r1, #0x3C
    bl .Lveneer_0000020C
    str r0, [sp, #0x1C]
    ldr r0, [r4, #0x8C]
    add r1, sp, #0x18
    bl .Lveneer_00000214
    mov r1, #0x16
    mov r0, r4
    bl .Lcall_0000F21C
    strb r5, [r4, #0x90]
.Lreturn_00002324:
    add sp, sp, #0x30
    pop {r4, r5, r6, pc}

.Lveneer_000000BC = .Lentry_00002324 - (0x00002324 - 0x000000BC)
.Lveneer_0000013C = .Lentry_00002324 - (0x00002324 - 0x0000013C)
.Lveneer_000001F4 = .Lentry_00002324 - (0x00002324 - 0x000001F4)
.Lveneer_000001FC = .Lentry_00002324 - (0x00002324 - 0x000001FC)
.Lveneer_00000204 = .Lentry_00002324 - (0x00002324 - 0x00000204)
.Lveneer_0000020C = .Lentry_00002324 - (0x00002324 - 0x0000020C)
.Lveneer_00000214 = .Lentry_00002324 - (0x00002324 - 0x00000214)
.Lcall_0000F21C = .Lentry_00002324 + (0x0000F21C - 0x00002324)
.size func_00002324, . - func_00002324

.section .text.func_000075D0, "ax", %progbits
.balign 4
.global func_000075D0
.type func_000075D0, %function
func_000075D0:
.Lentry_000075D0:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #4]
    ldr r1, [r4, #0x0C]
    ldr r0, [r0, #0x1C]
    ldr r0, [r0]
    add r0, r0, #0x3800
    add r0, r0, #0x194
    bl .Lveneer_00000284
    cmp r0, #0
    mov r5, #1
    beq .Lquery_false_000075D0
    mov r0, #2
    strb r0, [r4, #0x4A]
    ldrb r1, [r4, #0x48]
    mov r0, #5
    cmp r1, #0
    bne .Lcommon_tail_000075D0
.Lstore_candidate_000075D0:
    strb r0, [r4, #0x48]
.Lafter_candidate_store_000075D0:
    b .Lcommon_tail_000075D0
.Lquery_false_000075D0:
    mov r1, #2
    mov r0, r4
    bl .Lcall_0000E8E0
    mov r0, #3
    strb r0, [r4, #0x4A]
    ldrb r1, [r4, #0x48]
    mov r0, #0x0B
    cmp r1, #0
    beq .Lstore_candidate_000075D0
.Lcommon_tail_000075D0:
    strb r5, [r4, #0x3C]
    ldr r0, [r4, #0x5C]
    mov r5, #0
    bl .Lveneer_000000BC_000075D0
    mov r3, r5
    mov r2, #0x1BC
    mov r1, #0
    bl .Lveneer_00000194
    mov r0, #0x0D
    str r0, [r4, #0x38]
    pop {r4, r5, r6, pc}

.Lveneer_000000BC_000075D0 = .Lentry_000075D0 - (0x000075D0 - 0x000000BC)
.Lveneer_00000194 = .Lentry_000075D0 - (0x000075D0 - 0x00000194)
.Lveneer_00000284 = .Lentry_000075D0 - (0x000075D0 - 0x00000284)
.Lcall_0000E8E0 = .Lentry_000075D0 + (0x0000E8E0 - 0x000075D0)
.size func_000075D0, . - func_000075D0
