#include <stdint.h>

extern void *func_004D83F4(void *object, uint32_t selector);

uint32_t func_004D86AC(void *object)
{
    const uint8_t *data = func_004D83F4(object, 0);
    const uint32_t value = *(const uint16_t *)(data + 30);

    return (value << 18) >> 25;
}

uint32_t func_004D8860(void *object)
{
    const uint8_t *data = func_004D83F4(object, 0);
    const uint32_t value = *(const uint32_t *)(data + 40);

    return (value << 21) >> 25;
}
