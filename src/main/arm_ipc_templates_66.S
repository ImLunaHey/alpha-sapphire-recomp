.syntax unified
.arch armv6k
.arm

.macro BEGIN f
 .section .text.\f,"ax",%progbits
 .balign 4
 .arm
 .global \f
 .type \f,%function
\f:
.endm
.macro END f
 .size \f,.-\f
.endm

.global func_00301FBC
.global ipc_allocator_owner_65
.global ipc_record_tree_owner_66,ipc_dirty_flag_owner_66

BEGIN func_001824D4
push {r4,r5,r6,r7,r8,lr}
mov r5,r1
ldr r6,.Lpool_001824D4_tree
ldr r1,.Lpool_001824D4_dirty
ldr r0,[r6]
ldr r7,[r1]
ldr r1,[r0,#12]
cmp r1,#0
beq .Lsearch_001824D4
ldr r1,[r1,#64]
cmp r1,r5
beq .Lreturn_001824D4
.Lsearch_001824D4:
cmp r5,#0
beq .Lnull_001824D4
ldr r4,[r0,#4]
cmp r4,#0
beq .Lallocate_001824D4
.Lsearch_loop_001824D4:
ldr r0,[r4,#64]
cmp r0,r5
bcs .Lsearch_check_001824D4
ldr r4,[r4,#68]
cmp r4,#0
bne .Lsearch_loop_001824D4
b .Lallocate_001824D4
.Lsearch_check_001824D4:
cmp r4,#0
beq .Lallocate_001824D4
cmp r0,r5
beq .Lpublish_001824D4
.Lallocate_001824D4:
ldr r0,.Lpool_001824D4_allocator
ldr ip,[r0]
cmp ip,#0
moveq r4,#0
beq .Linitialize_001824D4
mov r3,#72
mov r2,#0
mov r1,#256
mov r0,#65536
blx ip
movs r4,r0
movne r1,#72
blne func_00301FBC
.Linitialize_001824D4:
str r5,[r4,#64]
ldr r1,[r6]
mov r2,r5
ldr r0,[r1,#4]
cmp r0,#0
streq r4,[r1,#4]
beq .Lpublish_001824D4
.Linsert_loop_001824D4:
ldr r3,[r0,#64]
cmp r3,r2
bls .Linsert_after_001824D4
str r0,[r4,#68]
str r4,[r1,#4]
b .Lpublish_001824D4
.Linsert_after_001824D4:
ldr r1,[r0,#68]
cmp r1,#0
beq .Linsert_tail_001824D4
.Linsert_compare_001824D4:
ldr r3,[r1,#64]
cmp r3,r2
bls .Linsert_advance_001824D4
str r4,[r0,#68]
cmp r1,#0
str r1,[r4,#68]
bne .Lpublish_001824D4
b .Linsert_tail_001824D4
.Linsert_advance_001824D4:
mov r0,r1
ldr r1,[r1,#68]
cmp r1,#0
bne .Linsert_compare_001824D4
.Linsert_tail_001824D4:
str r4,[r0,#68]
.Lpublish_001824D4:
cmp r5,#0
bne .Lstore_current_001824D4
.Lnull_001824D4:
mov r4,#0
.Lstore_current_001824D4:
ldr r0,[r6]
str r4,[r0,#12]
ldr r0,[r7]
orr r0,r0,#1
str r0,[r7]
.Lreturn_001824D4:
pop {r4,r5,r6,r7,r8,pc}
END func_001824D4
.Lpool_001824D4_tree:
.word ipc_record_tree_owner_66
.Lpool_001824D4_dirty:
.word ipc_dirty_flag_owner_66
.Lpool_001824D4_allocator:
.word ipc_allocator_owner_65

BEGIN func_0018261C
ldr r0,.Lpool_0018261C_tree
push {r4}
ldr r4,[r0]
ldr r0,.Lpool_0018261C_dirty
ldr ip,[r0]
ldr r0,[r4,#4]
cmp r0,#0
beq .Llookup_done_0018261C
.Llookup_loop_0018261C:
ldr r2,[r0,#64]
cmp r2,r3
bcs .Llookup_check_0018261C
ldr r0,[r0,#68]
cmp r0,#0
bne .Llookup_loop_0018261C
b .Llookup_done_0018261C
.Llookup_check_0018261C:
cmp r0,#0
cmpne r2,r3
movne r0,#0
.Llookup_done_0018261C:
ldr r2,[r4,#8]
sub r1,r1,#33280
subs r1,r1,#26
beq .Llane_one_0018261C
sub r1,r1,#2560
subs r1,r1,#198
beq .Llane_selected_0018261C
cmp r1,#32
bne .Lreturn_0018261C
.Llane_one_0018261C:
mov r1,#1
.Llane_selected_0018261C:
cmp r3,#0
beq .Lzero_0018261C
add r3,r2,r1,lsl #4
str r0,[r3,#12]
ldr r4,[r0,#64]
.Lwrite_0018261C:
add r0,r2,r1,lsl #4
mov r3,#0
stm r0,{r3,r4}
str r3,[r0,#8]
ldr r0,[ip]
orr r0,r0,#1
str r0,[ip]
.Lreturn_0018261C:
pop {r4}
bx lr
.Lzero_0018261C:
mov r0,#0
add r3,r2,r1,lsl #4
mov r4,r0
str r0,[r3,#12]
b .Lwrite_0018261C
END func_0018261C
.Lpool_0018261C_tree:
.word ipc_record_tree_owner_66
.Lpool_0018261C_dirty:
.word ipc_dirty_flag_owner_66

BEGIN func_001826E0
cmp r0,#0
bxeq lr
push {r4,r5,r6,r7,r8,r9,sl,fp,ip,lr}
mov r7,r0
mov sl,r1
mov r9,#0
ldr r5,.Lpool_001826E0_tree
ldr fp,.Lpool_001826E0_allocator
ldr r0,[r5]
ldr r4,[r0]
cmp r4,#0
movne r8,#0
movne r5,#1
bne .Lwalk_001826E0
mov r4,#0
cmp r7,#0
mov r6,r4
bls .Lreturn_a_001826E0
.Linitial_allocate_001826E0:
ldr ip,[fp]
cmp ip,#0
moveq r0,#0
beq .Linitial_link_001826E0
mov r3,#40
mov r2,#0
mov r1,#256
mov r0,#65536
blx ip
cmp r0,#0
beq .Linitial_link_001826E0
str r9,[r0]
str r9,[r0,#4]
str r9,[r0,#8]
str r9,[r0,#12]
str r9,[r0,#16]
str r9,[r0,#20]
str r9,[r0,#24]
str r9,[r0,#28]
str r9,[r0,#32]
str r9,[r0,#36]
.Linitial_link_001826E0:
cmp r4,#0
ldreq r1,[r5]
strne r0,[r4,#36]
mov r4,r0
streq r0,[r1]
add r1,r6,#1
str r1,[sl,r6,lsl #2]
add r6,r6,#1
cmp r6,r7
str r1,[r0,#32]
bcc .Linitial_allocate_001826E0
.Lreturn_a_001826E0:
pop {r4,r5,r6,r7,r8,r9,sl,fp,ip,pc}
.Lspan_check_001826E0:
ldr r0,[r6,#32]
cmp r0,r5
movhi r9,#0
bhi .Lspan_progress_001826E0
b .Lspan_accept_001826E0
.Lgap_allocate_001826E0:
ldr ip,[fp]
cmp ip,#0
moveq r0,#0
beq .Lgap_initialized_001826E0
mov r3,#40
mov r2,#0
mov r1,#256
mov r0,#65536
blx ip
cmp r0,#0
beq .Lgap_initialized_001826E0
mov r1,#0
str r1,[r0]
str r1,[r0,#4]
str r1,[r0,#8]
str r1,[r0,#12]
str r1,[r0,#16]
str r1,[r0,#20]
str r1,[r0,#24]
str r1,[r0,#28]
str r1,[r0,#32]
str r1,[r0,#36]
.Lgap_initialized_001826E0:
add r1,r9,r5
str r1,[r0,#32]
str r1,[sl,r8,lsl #2]
str r0,[r4,#36]
sub r7,r7,#1
add r9,r9,#1
add r8,r8,#1
mov r4,r0
str r6,[r0,#36]
.Lspan_progress_001826E0:
ldr r0,[r6,#32]
sub r0,r0,r5
cmp r0,r9
bls .Lspan_reload_001826E0
cmp r7,#0
bne .Lgap_allocate_001826E0
.Lspan_reload_001826E0:
ldr r5,[r6,#32]
.Lspan_accept_001826E0:
mov r4,r6
add r5,r5,#1
.Lwalk_001826E0:
ldr r6,[r4,#36]
cmp r6,#0
beq .Lappend_test_001826E0
cmp r7,#0
bne .Lspan_check_001826E0
pop {r4,r5,r6,r7,r8,r9,sl,fp,ip,pc}
.Lappend_test_001826E0:
cmp r7,#0
movne r6,#0
movhi r9,#0
beq .Lreturn_a_001826E0
bls .Lterminate_001826E0
.Lappend_allocate_001826E0:
ldr ip,[fp]
cmp ip,#0
moveq r0,#0
beq .Lappend_initialized_001826E0
mov r3,#40
mov r2,#0
mov r1,#256
mov r0,#65536
blx ip
cmp r0,#0
beq .Lappend_initialized_001826E0
str r9,[r0]
str r9,[r0,#4]
str r9,[r0,#8]
str r9,[r0,#12]
str r9,[r0,#16]
str r9,[r0,#20]
str r9,[r0,#24]
str r9,[r0,#28]
str r9,[r0,#32]
str r9,[r0,#36]
.Lappend_initialized_001826E0:
str r0,[r4,#36]
str r5,[r0,#32]
str r5,[sl,r8,lsl #2]
add r6,r6,#1
cmp r6,r7
mov r4,r0
add r5,r5,#1
add r8,r8,#1
bcc .Lappend_allocate_001826E0
.Lterminate_001826E0:
mov r0,#0
str r0,[r4,#36]
pop {r4,r5,r6,r7,r8,r9,sl,fp,ip,pc}
END func_001826E0
.Lpool_001826E0_tree:
.word ipc_record_tree_owner_66
.Lpool_001826E0_allocator:
.word ipc_allocator_owner_65
