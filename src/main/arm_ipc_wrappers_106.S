.syntax unified
.arch armv6k
.fpu vfpv2
.arm

// Resolve registry member four, then assign its owned member from the caller.
.section .text.func_002AC050, "ax", %progbits
.balign 4
.global func_002AC050
.type func_002AC050, %function
func_002AC050:
    push    {r4, lr}
    mov     r4, r0
    bl      func_00171FC0
    mov     r2, r0
    ldr     r0, .Lregistry_owner_106
    mov     r1, #4
    bl      func_00171324
    ldr     r0, [r0, #48]
    mov     r1, r4
    pop     {r4, lr}
    add     r0, r0, #24
    b       func_0017F4A4
.size func_002AC050, . - func_002AC050

.Lregistry_owner_106:
    .word   ipc_service_registry_owner_71

.section .note.GNU-stack, "", %progbits
