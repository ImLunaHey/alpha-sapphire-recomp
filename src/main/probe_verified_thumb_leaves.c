#include <stdint.h>

typedef struct {
    uint32_t *elements;
} U32Elements;

typedef struct {
    int32_t key;
} SignedKey;

uint32_t *func_00101CD0(const U32Elements *object, uint32_t index)
{
    return object->elements + index;
}

uint32_t *func_0030390C(const U32Elements *object, uint32_t index)
{
    return object->elements + index;
}

SignedKey *func_00304E9C(SignedKey *first, SignedKey *second)
{
    return second->key < first->key ? second : first;
}

SignedKey *func_00305406(SignedKey *first, SignedKey *second)
{
    return second->key < first->key ? second : first;
}
