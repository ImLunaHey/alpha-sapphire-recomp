# Toolchain fingerprint

## Target evidence

Private target inspection identifies Nintendo CTR SDK `7.1.1.200` and firmware build tag `02.39.00`. The executable uses ARM EABI C++ conventions and ARM/Thumb interworking patterns associated with the ARMCC/RVCT family. The main executable is predominantly ARM code, with smaller Thumb runtime/startup islands; middleware and CRO modules may use different presets.

This establishes a compiler family, not an exact compiler build. The exact build must remain provisional until multiple nontrivial functions from the same source family match.

## Candidate matrix

Probe licensed, user-supplied compiler installations outside Git in this order:

1. ARMCC 4.1 build 1049
2. ARMCC 4.1 build 1454
3. ARMCC 4.1 build 1440
4. ARMCC 4.1 build 894
5. ARMCC 4.1 build 921
6. ARMCC 5.04 build 82 as a lower-confidence fallback

Verify every candidate with `armcc --vsn`; directory names are not evidence of compiler identity.

## Initial main-code preset

The first main-code probe should use the equivalent of:

```text
--cpu=MPCore --arm --apcs=/interwork --littleend --split_sections
-O3 -Otime --fpmode=fast --data_reorder --signed_chars
--multibyte_chars --wchar --wchar16 --dollar
```

For C++, initially probe `--cpp --gnu --force_new_nothrow`, disabled exceptions/RTTI, VFE, and removal of unused entities. Treat `--forceinline`, VFE choice, exception/RTTI settings, and optimization level as controlled matrix variables. CRO probes additionally require the PIC preset and must be evaluated separately.

## Acceptance rule

Use relocation-light probes spanning loops, switches, bitfields, floating point, 64-bit arithmetic, and virtual/indirect calls. A compiler build is accepted for a source family only after several 20–200 byte nontrivial functions match; tiny return stubs cannot distinguish compiler builds.

The current GNU Arm toolchain is used only for license-clean target wrapping and portable leaf probes. Its small exact matches do not imply that GCC was the original compiler.
