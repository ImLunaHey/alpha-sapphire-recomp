#include <stddef.h>
#include <stdint.h>

/* Neutral storage layout from DllField_record_update_01.md, not a game type. */
typedef struct {
    uint8_t reserved_00[28];
    uint32_t a;
    uint8_t reserved_20[4];
    uint8_t b;
    uint8_t c;
    uint8_t reserved_26[2];
    uint32_t d;
} DllFieldRecordUpdate01;

_Static_assert(offsetof(DllFieldRecordUpdate01, a) == 28, "A offset");
_Static_assert(offsetof(DllFieldRecordUpdate01, b) == 36, "B offset");
_Static_assert(offsetof(DllFieldRecordUpdate01, c) == 37, "C offset");
_Static_assert(offsetof(DllFieldRecordUpdate01, d) == 40, "D offset");
_Static_assert(sizeof(DllFieldRecordUpdate01) == 44, "record extent");

/* Writable word-aligned record; incoming argument storage must be disjoint. */
DllFieldRecordUpdate01 *func_0002CBF8(DllFieldRecordUpdate01 *record,
                                   uint32_t a, uint32_t b, uint32_t c,
                                   uint32_t d)
{
    record->a = a;
    record->b = (uint8_t)b;
    record->c = (uint8_t)c;
    record->d = d;
    return record;
}
