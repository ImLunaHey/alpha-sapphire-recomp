.syntax unified
.arm

.section .text.import_veneers, "ax", %progbits
.balign 4

.extern __cro_import_anon_m7c7374617469637c_s0_002fd48
.extern __cro_import_anon_m446c6c4669656c64_s0_0087014
.extern __cro_import_anon_m7c7374617469637c_s0_02dc63c
.extern __cro_import_anon_m446c6c4669656c64_s0_00d8e40
.extern __cro_import_anon_m446c6c4669656c64_s0_0015d34
.extern __cro_import_anon_m446c6c4669656c64_s0_00d8eb0
.extern __cro_import_anon_m446c6c4669656c64_s0_00158d4
.extern __cro_import_anon_m7c7374617469637c_s0_01ff8c0

.global dll_us_area_tenji_import_veneer_000
dll_us_area_tenji_import_veneer_000:
    ldr pc, [pc, #-4]
.Lpool_004:
    .word __cro_import_anon_m7c7374617469637c_s0_002fd48

.global dll_us_area_tenji_import_veneer_008
dll_us_area_tenji_import_veneer_008:
    ldr pc, [pc, #-4]
.Lpool_00c:
    .word __cro_import_anon_m446c6c4669656c64_s0_0087014

.global dll_us_area_tenji_import_veneer_010
dll_us_area_tenji_import_veneer_010:
    ldr pc, [pc, #-4]
.Lpool_014:
    .word __cro_import_anon_m7c7374617469637c_s0_02dc63c

.global dll_us_area_tenji_import_veneer_018
dll_us_area_tenji_import_veneer_018:
    ldr pc, [pc, #-4]
.Lpool_01c:
    .word __cro_import_anon_m446c6c4669656c64_s0_00d8e40

.global dll_us_area_tenji_import_veneer_020
dll_us_area_tenji_import_veneer_020:
    ldr pc, [pc, #-4]
.Lpool_024:
    .word __cro_import_anon_m446c6c4669656c64_s0_0015d34

.global dll_us_area_tenji_import_veneer_028
dll_us_area_tenji_import_veneer_028:
    ldr pc, [pc, #-4]
.Lpool_02c:
    .word __cro_import_anon_m446c6c4669656c64_s0_00d8eb0

.global dll_us_area_tenji_import_veneer_030
dll_us_area_tenji_import_veneer_030:
    ldr pc, [pc, #-4]
.Lpool_034:
    .word __cro_import_anon_m446c6c4669656c64_s0_00158d4

.global dll_us_area_tenji_import_veneer_038
dll_us_area_tenji_import_veneer_038:
    ldr pc, [pc, #-4]
.Lpool_03c:
    .word __cro_import_anon_m7c7374617469637c_s0_01ff8c0

.section .note.GNU-stack, "", %progbits
