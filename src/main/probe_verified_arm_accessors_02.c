#include <stdint.h>

#define READ_U32_FULL(base, offset) \
    (*(const volatile uint32_t *)((const uint8_t *)(base) + (offset)))

void func_00136300(uint8_t *base, uint32_t value)
{
    *(uint32_t *)(void *)(base + 60) = value + UINT32_C(8);
}

void func_0013630C(uint8_t *base, uint32_t value)
{
    *(uint32_t *)(void *)(base + 56) = value + UINT32_C(8);
}

uint16_t func_002BACF8(const uint8_t *base, uint32_t index)
{
    uint32_t offset = index + UINT32_C(20);

    return *(const uint16_t *)(const void *)(base + offset);
}

uint8_t func_002BAF24(const uint8_t *base, uint32_t index)
{
    return base[index + UINT32_C(20)];
}

uint8_t *func_0045A330(uint8_t *base, uint32_t index)
{
    uint32_t offset = index * UINT32_C(16) + UINT32_C(4);

    return base + offset;
}

uint8_t *func_004E60E8(const uint8_t *base, uint32_t index)
{
    uint32_t address = *(const uint32_t *)(const void *)(base + 24);
    uint32_t offset = index * UINT32_C(8);

    return (uint8_t *)(uintptr_t)(address + offset);
}

uint8_t func_004EA6B8(const uint8_t *base, uint32_t index)
{
    return base[index + UINT32_C(180)];
}

uint8_t func_004EA6C4(const uint8_t *base, uint32_t index)
{
    return base[index + UINT32_C(184)];
}

uint8_t func_004EA6D0(const uint8_t *base, uint32_t index)
{
    return base[index + UINT32_C(188)];
}

uint32_t func_004AACB4(const uint8_t *base)
{
    uint32_t value = *(const uint32_t *)(const void *)(base + 8);

    return ((value & UINT32_C(0x000000FF)) << 24)
         | ((value & UINT32_C(0x0000FF00)) << 8)
         | ((value & UINT32_C(0x00FF0000)) >> 8)
         | ((value & UINT32_C(0xFF000000)) >> 24);
}

uint32_t func_00466270(const uint8_t *base)
{
    uint32_t value = *(const uint32_t *)(const void *)(base + 4);

    return value >> 29;
}

uint32_t func_004E5410(const uint8_t *base)
{
    return (READ_U32_FULL(base, 48) << 12) >> 24;
}

int32_t func_004E5ED4(const uint8_t *base)
{
    return (int32_t)(READ_U32_FULL(base, 0) << 14) >> 14;
}

uint32_t func_004E68E0(const uint8_t *base)
{
    uint32_t value = *(const uint32_t *)(const void *)(base + 44);

    return value & UINT32_C(0x1F);
}

uint32_t func_004E6960(const uint8_t *base)
{
    return (READ_U32_FULL(base, 40) << 23) >> 24;
}

uint32_t func_004E69C4(const uint8_t *base)
{
    return (READ_U32_FULL(base, 44) << 19) >> 24;
}

uint32_t func_004E7474(const uint8_t *base)
{
    return (READ_U32_FULL(base, 80) << 12) >> 28;
}

uint32_t func_004E7A4C(const uint8_t *base)
{
    return ((uint32_t)*(const uint8_t *)((const uint8_t *)base + 4) << 26) >> 30;
}

uint32_t func_004EA02C(const uint8_t *base)
{
    return (READ_U32_FULL(base, 52) << 18) >> 30;
}

uint32_t func_004EA088(const uint8_t *base)
{
    return (READ_U32_FULL(base, 4) << 17) >> 30;
}

uint32_t func_004EA0A4(const uint8_t *base)
{
    return (READ_U32_FULL(base, 4) << 29) >> 31;
}

uint32_t func_004EA6DC(const uint8_t *base)
{
    return READ_U32_FULL(base, 44) >> 24;
}
