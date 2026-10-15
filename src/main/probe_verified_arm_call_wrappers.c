#include <stdint.h>

extern void func_00300B28(void *subobject);
extern int32_t func_003672B8(void *object);
extern void *func_004A9658(void *object);
extern int32_t func_004D1330(void *context);
extern uint32_t func_004D1DD8(void *context);
extern uint32_t func_004D244C(void *context);
extern void *func_004D83F4(void *object, uint32_t selector);

void func_00438BF8(void *object, uint32_t unused, uint32_t value)
{
    (void)unused;
    func_00300B28((uint8_t *)object + 84);
    *(uint32_t *)((uint8_t *)object + 252) = value;
}

void func_0043DF18(void *object)
{
    int32_t result = func_003672B8(object);

    *(uint16_t *)((uint8_t *)object + 192) = (uint16_t)result;
}

uint32_t func_004A9714(void *object)
{
    uint8_t *result = func_004A9658(object);

    if (result == 0) {
        return 0;
    }
    return *(uint32_t *)(result + 4);
}

int32_t func_004D2B68(void *object)
{
    void *context = *(void **)((uint8_t *)object + 12);
    int32_t result = func_004D1330(context);

    return (result & 0xF) != 0;
}

uint32_t func_004D2D44(void *object)
{
    void *context = *(void **)((uint8_t *)object + 12);

    return func_004D1DD8(context) ^ 1;
}

uint32_t func_004D2E90(void *object)
{
    void *context = *(void **)((uint8_t *)object + 12);

    return (uint16_t)func_004D244C(context);
}

uint32_t func_004D83D8(void *object)
{
    uint8_t *result = func_004D83F4(object, 0);

    return *(uint16_t *)(result + 4);
}

uint32_t func_004D84AC(void *object)
{
    uint8_t *result = func_004D83F4(object, 0);

    return *(uint16_t *)(result + 30) & 0x1F;
}

uint32_t func_004D86FC(void *object)
{
    uint8_t *result = func_004D83F4(object, 0);

    return *(uint16_t *)(result + 38);
}

uint32_t func_004D8734(void *object)
{
    uint8_t *result = func_004D83F4(object, 0);

    return *(uint16_t *)(result + 6);
}

uint32_t func_004D8780(void *object)
{
    uint8_t *result = func_004D83F4(object, 0);

    return *(uint16_t *)(result + 32) & 0x1F;
}

uint32_t func_004D8964(void *object)
{
    uint8_t *result = func_004D83F4(object, 0);

    return *(uint16_t *)(result + 2);
}
