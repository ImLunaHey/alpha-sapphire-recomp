# DllPhotoSaver clean-room batch 01

The neutral public inventory for `cro/DllPhotoSaver` contains one accepted
function boundary: `func_00000000`, an 8-byte ARM leaf. Its reviewed semantic
contract is a byte store at offset 217 followed by return. The independently
authored C implementation expresses only that behavior:

```c
void func_00000000(uint8_t *base, uint8_t value)
{
    base[217] = value;
}
```

The CRO builder compiles the source with the pinned ARMv6K freestanding flags
and overlays only the claimed function section onto the payload-free skeleton.
The validator pins the source semantics, public boundary, ELF section and
symbol properties, absence of relocations, and exact objdiff result. The
function matches 8/8 bytes. The unit remains incomplete: unclaimed code and all
148 data bytes stay unmatched, and no target CRO or generated ELF is tracked.
