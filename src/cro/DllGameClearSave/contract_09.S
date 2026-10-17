.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000006DC, "ax", %progbits
.balign 4
.global func_000006DC
.type func_000006DC, %function
func_000006DC:
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r0
    mov r6, r1
    strb r2, [r0, #0x78]
    ldr r0, [r0, #0x5C]
    mov r5, r2
    mov r1, #1
    bl . - 0x608
    mov r7, r0
    ldr r0, [r4, #0x5C]
    mov r2, r6
    mov r1, r7
    bl . - 0x614
    ldr r0, [r4, #0x5C]
    mov r1, r7
    bl . - 0x618
    cmp r5, #0
    beq .Lmode_zero_000006DC
    cmp r5, #1
    beq .Lmode_one_000006DC
    cmp r5, #2
    bne .Ldone_000006DC
    ldr r0, [r4, #0x5C]
    mov r2, #0x3C
    mov r1, #2
    bl . - 0x638
    ldr r0, [r4, #0x74]
    mov r1, #0
    bl . - 0x63C
    b .Ldone_000006DC
.Lmode_one_000006DC:
    ldr r0, [r4, #0x5C]
    mov r2, #0
    mov r1, #1
    bl . - 0x658
    ldr r0, [r4, #0x74]
    mov r1, #0
    b .Lnotify_000006DC
.Lmode_zero_000006DC:
    mov r2, #0
    ldr r0, [r4, #0x5C]
    mov r1, r2
    bl . - 0x674
    ldr r0, [r4, #0x74]
    mov r1, #1
.Lnotify_000006DC:
    bl . - 0x678
.Ldone_000006DC:
    mov r0, #0
    strb r0, [r4, #0x79]
    pop {r4, r5, r6, r7, r8, pc}
.size func_000006DC, . - func_000006DC
