#include <stdint.h>

void func_00332E4C(uint8_t *base, uint32_t value)
{
    base[131] = (uint8_t)value;
}

void func_00332E54(uint8_t *base, uint32_t value)
{
    base[244] = (uint8_t)value;
}

void func_0033303C(uint8_t *base, uint32_t value)
{
    base[240] = (uint8_t)value;
}

void func_003DB988(uint8_t *base, uint32_t value)
{
    base[28] = (uint8_t)value;
}

void func_003A65C4(uint8_t *base, uint32_t first, uint32_t second)
{
    base[35] = (uint8_t)first;
    base[42] = (uint8_t)second;
}

void func_003A6544(uint8_t *base, uint32_t first, uint32_t second)
{
    base[35] = (uint8_t)first;
    base[43] = (uint8_t)first;
    base[42] = (uint8_t)second;
    base[44] = (uint8_t)second;
}

void func_0032E8EC(uint8_t *base, uint32_t first, uint32_t second)
{
    *(uint32_t *)(base + 80) = second;
    base[153] = (uint8_t)first;
}

uint32_t func_003D424C(uint32_t value)
{
    return value != 0 ? UINT32_C(2) : UINT32_C(1);
}

uint32_t func_00410C88(uint32_t value)
{
    return (value + UINT32_C(7)) & ~UINT32_C(3);
}

uint32_t func_0042F338(uint32_t value)
{
    return (value >> 2) * UINT32_C(3);
}

uint32_t func_0013E9B8(const uint8_t *base)
{
    return *(const uint32_t *)(base + 4) - UINT32_C(1);
}

uint32_t func_001C4C88(uint8_t *base, uint32_t value)
{
    *(uint32_t *)(base + 120) = value;
    return UINT32_C(0);
}

uint32_t func_001CA310(uint8_t *base, uint32_t value)
{
    *(uint32_t *)(base + 4) = value;
    return UINT32_C(0);
}

uint32_t func_002C7810(uint8_t *base, uint32_t value)
{
    base[7] = (uint8_t)value;
    return UINT32_C(0);
}

uint32_t func_00506104(uint8_t *base, uint32_t value)
{
    *(uint32_t *)(base + 84) = value;
    return UINT32_C(0);
}

uint32_t func_0034679C(const uint8_t *base, uint32_t index)
{
    return *(const uint32_t *)(base + index * UINT32_C(8) + 4);
}

uint32_t func_004BE900(const uint8_t *base, uint32_t index)
{
    return *(const uint32_t *)(base + index * UINT32_C(16) + 8);
}

uint32_t func_004E5EBC(const uint8_t *base)
{
    return *(const uint32_t *)(base + 4) & UINT32_C(3);
}

uint32_t func_004EA098(const uint8_t *base)
{
    return *(const uint32_t *)(base + 4) & UINT32_C(3);
}

uint32_t func_004E5EC8(const uint8_t *base)
{
    return *(const uint32_t *)(base + 0) >> 18;
}

uint32_t func_004E68EC(const uint8_t *base)
{
    return *(const uint32_t *)(base + 40) & UINT32_C(1);
}

uint32_t func_004E7100(const uint8_t *base)
{
    return *(const uint32_t *)(base + 92) & UINT32_C(1);
}

uint32_t func_004E8D4C(const uint8_t *base)
{
    return *(const uint32_t *)(base + 4) & UINT32_C(1);
}

uint32_t func_004EAD34(const uint8_t *base)
{
    return (uint32_t)(base[230] & UINT8_C(1));
}

uint32_t func_004EDAD4(const uint8_t *base)
{
    return *(const uint32_t *)(base + 8) >> 1;
}

uint32_t func_004E897C(const uint8_t *base, uint32_t index)
{
    return base[index + UINT32_C(70)];
}

uint32_t func_004E8988(const uint8_t *base, uint32_t index)
{
    return base[index + UINT32_C(80)];
}

uint32_t func_004E8994(const uint8_t *base, uint32_t index)
{
    return base[index + UINT32_C(90)];
}

uint32_t func_004E89A0(const uint8_t *base, uint32_t index)
{
    return base[index + UINT32_C(97)];
}

uint16_t func_004B287C(const uint8_t *base)
{
    return *(const uint16_t *)(base + 1024);
}

void func_0042D8F4(uint8_t *base, uint32_t value)
{
    *(uint32_t *)(base + 21172) = value;
}

void func_00434200(uint8_t *base, uint32_t value)
{
    *(uint32_t *)(base + 4992) = value;
}

void func_0045AD9C(uint8_t *base, uint32_t value)
{
    *(uint32_t *)(base + 0) = value + UINT32_C(812);
}

void func_00462A10(uint8_t *base, uint32_t value)
{
    *(uint32_t *)(base + 0) = value + UINT32_C(108);
}
