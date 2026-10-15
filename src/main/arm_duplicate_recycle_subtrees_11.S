.syntax unified
.arm

.macro recycle_subtree name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    cmp r1, #0
    bxeq lr
    push {r4, r5, lr}
    mov r5, r0
    mov r4, r1
.Lloop_\name:
    mov r0, r5
    ldr r1, [r4, #12]
    bl \name
    ldr r1, [r5, #4]
    ldr r0, [r4, #8]
    str r1, [r4, #12]
    str r4, [r5, #4]
    movs r4, r0
    bne .Lloop_\name
    pop {r4, r5, pc}
.size \name, . - \name
.endm

recycle_subtree func_0018A080
recycle_subtree func_00192AE0
recycle_subtree func_005504D4
recycle_subtree func_00550CAC
recycle_subtree func_005516E8
recycle_subtree func_0055227C
recycle_subtree func_00552CCC
recycle_subtree func_005531F4
recycle_subtree func_0055388C
recycle_subtree func_0055670C
recycle_subtree func_00557C70
recycle_subtree func_005588EC
recycle_subtree func_0055943C
recycle_subtree func_00559948
recycle_subtree func_00559FE0
recycle_subtree func_0055AB38
recycle_subtree func_0055B2E0
recycle_subtree func_0055BDF4
recycle_subtree func_0055C938
recycle_subtree func_0055D4E8
recycle_subtree func_0055E1BC
recycle_subtree func_0055EE08
recycle_subtree func_0055FF78
recycle_subtree func_00560A9C
recycle_subtree func_00561C08
recycle_subtree func_005622A4
recycle_subtree func_00562CB8
recycle_subtree func_00563450
recycle_subtree func_00563F64
recycle_subtree func_00564A78
recycle_subtree func_0056548C
recycle_subtree func_00565FA0
recycle_subtree func_005676A0
recycle_subtree func_005680CC
recycle_subtree func_00568AE4
recycle_subtree func_00569180
recycle_subtree func_00569958
