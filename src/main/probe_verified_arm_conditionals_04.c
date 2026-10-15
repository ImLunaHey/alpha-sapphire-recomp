#include <stdint.h>

uint32_t func_001233B4(const void *base)
{
    const uint8_t *value = *(const uint8_t *const *)((const uint8_t *)base + 16);
    return value != 0 ? *(const uint8_t *)(value + 0) : 0;
}

void *func_001233C4(const void *base)
{
    const uint8_t *value = *(const uint8_t *const *)((const uint8_t *)base + 16);
    return value != 0 ? *(void *const *)(value + 12) : 0;
}

void *func_00150034(const void *base)
{
    const uint8_t *value = *(const uint8_t *const *)((const uint8_t *)base + 312);
    return value != 0 ? *(void *const *)(value + 120) : 0;
}

void *func_00152B74(const void *base)
{
    const uint8_t *value = *(const uint8_t *const *)((const uint8_t *)base + 8);
    return value != 0 ? *(void *const *)(value + 0) : 0;
}

uint32_t func_0016AD50(const void *base)
{
    const uint8_t *value = *(const uint8_t *const *)((const uint8_t *)base + 8);
    return value != 0 ? *(const uint16_t *)(value + 10) : 0;
}

void *func_004B1EC0(const void *base)
{
    const uint8_t *value = *(const uint8_t *const *)((const uint8_t *)base + 4);
    return value != 0 ? *(void *const *)(value + 8) : 0;
}

uint32_t func_004B1ED0(const void *base)
{
    const uint8_t *value = *(const uint8_t *const *)((const uint8_t *)base + 4);
    return value != 0 ? *(const uint8_t *)(value + 5) : 0;
}

uint32_t func_004BCA88(const void *base)
{
    const uint8_t *value = *(const uint8_t *const *)((const uint8_t *)base + 12);
    return value != 0 ? *(const uint16_t *)(value + 12) : 0;
}

uint32_t func_001D0058(const void *value)
{
    return value != 0 ? *(const uint32_t *)((const uint8_t *)value + 8) : UINT32_MAX;
}

uint32_t func_001D0068(const void *value)
{
    return value != 0 ? *(const uint32_t *)((const uint8_t *)value + 0) : UINT32_MAX;
}

uint32_t func_001D0090(const void *value)
{
    return value != 0 ? *(const uint32_t *)((const uint8_t *)value + 12) : UINT32_MAX;
}

uint32_t func_001D00A0(const void *value)
{
    return value != 0 ? *(const uint32_t *)((const uint8_t *)value + 20) : UINT32_MAX;
}

uint32_t func_001D00B0(const void *value)
{
    return value != 0 ? *(const uint32_t *)((const uint8_t *)value + 4) : UINT32_MAX;
}

void func_0013A144(void *first, void *second)
{
    if (second != 0) {
        *(void **)((uint8_t *)second + 444) = first;
        *(void **)((uint8_t *)first + 64) = second;
    }
}

uint32_t func_001524C8(const int32_t *value_pointer)
{
    int32_t value = *value_pointer;
    return (uint32_t)((value >> 31) + 1);
}

void *func_004C7F08(const void *base, uint32_t selector)
{
    return selector == 0 ? *(void *const *)((const uint8_t *)base + 48) : 0;
}

void *func_004C7F18(const void *base, uint32_t selector)
{
    return selector == 0 ? *(void *const *)((const uint8_t *)base + 52) : 0;
}
