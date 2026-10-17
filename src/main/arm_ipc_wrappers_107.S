.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_003AC2A0, "ax", %progbits
.balign 4
.global func_003AC2A0
.type func_003AC2A0, %function
func_003AC2A0:
    push    {r4-r6, lr}
    mov     r4, r0
    ldr     r0, .Ldispatch_identity
    mov     r5, #0
    add     r6, r4, #48
    str     r0, [r4]
    ldr     r0, [r4, #48]
    cmp     r0, #0
    beq     .Lslot52
    svc     #35
    str     r5, [r6]
.Lslot52:
    ldr     r0, [r4, #52]
    add     r6, r4, #52
    cmp     r0, #0
    beq     .Lslot56
    svc     #35
    str     r5, [r6]
.Lslot56:
    ldr     r0, [r4, #56]
    add     r6, r4, #56
    cmp     r0, #0
    beq     .Lslot60
    svc     #35
    str     r5, [r6]
.Lslot60:
    ldr     r0, [r4, #60]
    add     r6, r4, #60
    cmp     r0, #0
    beq     .Lslot64
    svc     #35
    str     r5, [r6]
.Lslot64:
    ldr     r0, [r4, #64]
    add     r6, r4, #64
    cmp     r0, #0
    beq     .Lslot68
    svc     #35
    str     r5, [r6]
.Lslot68:
    ldr     r0, [r4, #68]
    add     r6, r4, #68
    cmp     r0, #0
    beq     .Lslot72
    svc     #35
    str     r5, [r6]
.Lslot72:
    ldr     r0, [r4, #72]
    add     r6, r4, #72
    cmp     r0, #0
    beq     .Lreverse
    svc     #35
    str     r5, [r6]
.Lreverse:
    mvn     r0, #0
    str     r0, [r4, #96]
    add     r4, r4, #72
    ldr     r0, [r4, #-4]!
    cmp     r0, #0
    beq     .Lreverse64
    svc     #35
    str     r5, [r4]
.Lreverse64:
    ldr     r0, [r4, #-4]!
    cmp     r0, #0
    beq     .Lreverse60
    svc     #35
    str     r5, [r4]
.Lreverse60:
    ldr     r0, [r4, #-4]!
    cmp     r0, #0
    beq     .Lreverse56
    svc     #35
    str     r5, [r4]
.Lreverse56:
    ldr     r0, [r4, #-4]!
    cmp     r0, #0
    beq     .Lreverse52
    svc     #35
    str     r5, [r4]
.Lreverse52:
    ldr     r0, [r4, #-4]!
    cmp     r0, #0
    beq     .Lreverse48
    svc     #35
    str     r5, [r4]
.Lreverse48:
    ldr     r0, [r4, #-4]!
    cmp     r0, #0
    beq     .Lfinish
    svc     #35
    str     r5, [r4]
.Lfinish:
    sub     r0, r4, #48
    pop     {r4-r6, lr}
    b       func_003A7EE8
.size func_003AC2A0, . - func_003AC2A0

.Ldispatch_identity:
    .word   service_handle_owner_dispatch_107

.section .note.GNU-stack, "", %progbits
