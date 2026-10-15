#include <stdint.h>

struct UnsignedKeyObject {
    uint32_t key;
};

struct UnsignedKeyObject *func_002FFE4A(struct UnsignedKeyObject *first,
                                        struct UnsignedKeyObject *second)
{
    return first->key < second->key ? second : first;
}
