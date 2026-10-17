#!/usr/bin/env python3
"""Execute independently assembled passage code against synthetic services only.

Requires Python's unicorn package. The sole input is a body extracted from our
own assembly by validate-cro-dll-uspassage.mjs, never a game/target artifact.
"""
import math
import struct
import sys
from pathlib import Path

from unicorn import Uc, UC_ARCH_ARM, UC_MODE_ARM, UC_HOOK_CODE, UC_HOOK_MEM_WRITE
from unicorn.arm_const import (
    UC_ARM_REG_R0, UC_ARM_REG_R1, UC_ARM_REG_R2, UC_ARM_REG_R3,
    UC_ARM_REG_R4, UC_ARM_REG_R5, UC_ARM_REG_R6, UC_ARM_REG_R7,
    UC_ARM_REG_R8, UC_ARM_REG_R9, UC_ARM_REG_R10, UC_ARM_REG_R11,
    UC_ARM_REG_R12, UC_ARM_REG_SP, UC_ARM_REG_LR, UC_ARM_REG_PC,
    UC_ARM_REG_CPSR, UC_ARM_REG_C1_C0_2, UC_ARM_REG_FPEXC,
    UC_ARM_REG_S0, UC_ARM_REG_S16, UC_ARM_REG_D0, UC_ARM_REG_D8,
)

ARGS = [UC_ARM_REG_R0, UC_ARM_REG_R1, UC_ARM_REG_R2, UC_ARM_REG_R3]
SAVED = [UC_ARM_REG_R4, UC_ARM_REG_R5, UC_ARM_REG_R6, UC_ARM_REG_R7,
         UC_ARM_REG_R8, UC_ARM_REG_R9, UC_ARM_REG_R10, UC_ARM_REG_R11]
BASE, S, C, ALT_C = 0x10000, 0x20000, 0x21000, 0x22000
LIST, ALT_LIST, RESOURCE, VTABLE = 0x23000, 0x23100, 0x24000, 0x25000
NAMES, STOP, STACK = 0x26000, 0x1F000, 0x90000
I = {0x024, 0x0BC, 0x0FC, 0x104, 0x10C, 0x114, 0x11C,
     0x124, 0x12C, 0x134, 0x13C, 0x144, 0x14C, 0x154}
SLOTS = {0x1C, 0x2C, 0x34, 0x38, 0x40, 0x5C, 0x64}
VECTOR = [0x02010000] * 3
POISON = 0xA5A5A5A5
CALL_SITES = {
    0x024: {0x16B8}, 0x0BC: {0x1400, 0x1468, 0x1500, 0x1584},
    0x0FC: {0x1424, 0x1524}, 0x104: {0x1440, 0x1544},
    0x10C: {0x145C}, 0x114: {0x1474}, 0x11C: {0x1490},
    0x124: {0x14AC}, 0x12C: {0x14C8}, 0x134: {0x14D4},
    0x13C: {0x1590}, 0x144: {0x1658}, 0x14C: {0x16AC}, 0x154: {0x16CC},
    0x402C: {0x15B8}, 0x401C: {0x15CC}, 0x4034: {0x15F8},
    0x4038: {0x1610}, 0x4040: {0x1628}, 0x405C: {0x1644}, 0x4064: {0x1670},
}
TARGET_REGISTERS = {0x402C: UC_ARM_REG_R12, 0x401C: UC_ARM_REG_R2,
                    0x4034: UC_ARM_REG_R12, 0x4038: UC_ARM_REG_R2,
                    0x4040: UC_ARM_REG_R2, 0x405C: UC_ARM_REG_R2,
                    0x4064: UC_ARM_REG_R3}


def fbits(value):
    return struct.unpack('<I', struct.pack('<f', value))[0]


def fvalue(value):
    return struct.unpack('<f', struct.pack('<I', value))[0]


def run_case(body, excluded, lookups=None, fail_alloc=(), shared_status=1,
             mutate=False, thumb=False, shared_vector_write=False,
             fp_values=None, translations=None, poison_flags=False):
    """Check the full expected service trace, arguments, writes and ABI."""
    uc = Uc(UC_ARCH_ARM, UC_MODE_ARM)
    uc.mem_map(0, 0xA0000)
    uc.mem_write(BASE + 0x13BC, body)
    uc.mem_write(STACK - 0x1000, bytes([0xA5]) * 0x1000)
    uc.mem_write(S, bytes([0xCC]) * 0x200)

    def word(address, value=None):
        if value is not None:
            uc.mem_write(address, struct.pack('<I', value & 0xFFFFFFFF))
        return struct.unpack('<I', uc.mem_read(address, 4))[0]

    def words(address, count):
        return [word(address + 4 * j) for j in range(count)]

    def position(address, values):
        for j, value in enumerate(values):
            word(address + 4 * j, fbits(value))

    for offset, value in [(8, C), (0x18, 0xFFFFFFFF), (0x24, RESOURCE),
                          (0xB4, 0xB400)]:
        word(S + offset, value)
    for context, lst in [(C, LIST), (ALT_C, ALT_LIST)]:
        word(context + 4, 0xA110C)
        word(context + 0x24, 0xC240)
        word(context + 0x2C, 0xC2C0)
        word(context + 0x60, context + 0x100)
        word(context + 0x100 + 0x1C, context + 0x200)
        word(context + 0x200 + 0x14, lst)
    word(ALT_C + 4, 0xBAD00004)
    word(ALT_C + 0x24, 0xBAD00024)
    word(ALT_C + 0x2C, 0xBAD0002C)
    for j in range(6):
        word(S + 0x5C + 4 * j, 0x5100 + j)
        word(NAMES + 4 * j, 0x27000 + 32 * j)
    # Synthetic adjacent word permits observing the seventh raw iteration.
    # The real name array's capacity is six; no actual name data is required.
    word(NAMES + 24, 0x27F00)
    # Synthetic dependencies at the public adjacent pool addresses.
    word(BASE + 0x16EC, VECTOR[0])
    word(BASE + 0x16F0, 0)
    word(BASE + 0x16F4, NAMES)
    for slot in SLOTS:
        word(VTABLE + slot, BASE + 0x4000 + slot)
    for resource in range(RESOURCE, RESOURCE + 0x100, 4):
        word(resource, VTABLE)
    word(0, VTABLE)  # Mock virtual receiver zero; verifies null is still used.
    word(0x28000 + 0x34, 0x34000)
    for offset in I:
        # Stubs exist only so Unicorn can fetch. The hook implements services.
        word(BASE + offset, 0xE12FFF1E)  # synthetic bx lr
    for slot in SLOTS:
        word(BASE + 0x4000 + slot, 0xE12FFF1E)
    included = [i for i, skip in enumerate(excluded) if not skip]
    lookups = lookups if lookups is not None else [7 + j for j in range(len(included))]
    assert len(lookups) == len(included)
    events, allocation_sizes, wrappers, objects, placements = [], [], [], [], []
    stack_writes, expected_placements, visited = [], [], []
    heap, packed, original = 0x30000, 0, 0
    shared_wrapper, shared_object = None, None
    expected_position = [VECTOR[0], VECTOR[0], POISON]
    pending_result = 0
    replacement_instance = 0x38000
    count_calls, max_depth, finished = 0, 0, False
    initial_saved = [0x44000000 + j for j in range(8)]
    for reg, value in zip(SAVED, initial_saved):
        uc.reg_write(reg, value)
    uc.reg_write(UC_ARM_REG_SP, STACK)
    uc.reg_write(UC_ARM_REG_LR, STOP | int(thumb))
    uc.reg_write(UC_ARM_REG_R0, S)
    uc.reg_write(UC_ARM_REG_D8, 0x123456789ABCDEF0)
    uc.reg_write(UC_ARM_REG_C1_C0_2, 0xF << 20)
    uc.reg_write(UC_ARM_REG_FPEXC, 1 << 30)

    def on_write(machine, access, address, size, value, user):
        pc = uc.reg_read(UC_ARM_REG_PC)
        # Observe only instructions in our body, excluding synthetic helpers
        # and the saved-register area. This also detects unintended clearing.
        if BASE + 0x13BC <= pc < BASE + 0x16EC and STACK - 208 <= address < STACK - 44:
            stack_writes.append((address - (STACK - 208), size,
                                 value & ((1 << (8 * size)) - 1)))

    def on_code(machine, address, size, user):
        nonlocal heap, packed, original, shared_wrapper, shared_object
        nonlocal expected_position, count_calls, max_depth, finished
        nonlocal pending_result, replacement_instance
        sp = uc.reg_read(UC_ARM_REG_SP)
        max_depth = max(max_depth, STACK - sp)
        if address == STOP:
            finished = True
            assert bool(uc.reg_read(UC_ARM_REG_CPSR) & 0x20) == thumb
            uc.emu_stop()
            return
        offset = address - BASE
        if 0x13BC <= offset < 0x16EC:
            visited.append(offset)
            if offset == 0x14B8:
                # A zero count must leave the incoming saved VFP value alone.
                assert uc.reg_read(UC_ARM_REG_S16) == (0 if excluded else 0x9ABCDEF0)
            if offset == 0x14C0:
                assert [uc.reg_read(reg) for reg in
                        (UC_ARM_REG_R5, UC_ARM_REG_R6, UC_ARM_REG_R7,
                         UC_ARM_REG_R8, UC_ARM_REG_R11)] == [S, original, packed, len(excluded), 0]
            return
        assert offset in I or offset - 0x4000 in SLOTS, hex(address)
        assert uc.reg_read(UC_ARM_REG_LR) - BASE - 4 in CALL_SITES[offset]
        if offset in TARGET_REGISTERS:
            assert uc.reg_read(TARGET_REGISTERS[offset]) == address
        assert sp % 8 == 0 and sp == STACK - 208
        a, b, c, d = [uc.reg_read(reg) for reg in ARGS]
        stk = words(sp, 3)
        result = 0xDEAD0000
        if offset == 0x0BC:
            assert b == 0xA110C  # Cached even if callbacks replace S.context.
            allocation_sizes.append(a)
            result = 0 if len(allocation_sizes) - 1 in fail_alloc else heap
            heap += 0x100
            events.append(('alloc', a))
        elif offset in (0x0FC, 0x114, 0x13C):
            assert a != 0
            if offset == 0x0FC:
                assert (b, c, d, stk[:2]) == (0, 0, 0, [1, 0])
            result = a + 0x10  # Constructed result can differ from storage.
            word(result, VTABLE)
            if mutate and offset == 0x114:
                # Fixed attachment must reload the auxiliary field after C114.
                shared_wrapper = 0x39000
                word(S + 0xAC, shared_wrapper)
            events.append(('ctor', offset))
        elif offset == 0x104:
            assert b == 0xC240 and words(d, 3) == VECTOR and stk[0] == 0
            if shared_wrapper is None:
                shared_wrapper = a
                assert word(S + 0xAC) == a and c == 0xB400 and stk[1] == 0
                events.append(('initialize_shared',))
                result = shared_status
                if shared_vector_write:
                    word(d + 4, fbits(17.0))
                    word(d + 8, fbits(-31.0))
                    expected_position[:2] = [fbits(17.0), fbits(-31.0)]
            else:
                assert word(S + 0x44 + 4 * packed) == a
                assert c == (0x5100 + packed if packed < 6 else 0xCCCCCCCC) and stk[1] == 1
                wrappers.append(a)
                events.append(('initialize', packed))
                result = 0  # Failure here is deliberately ignored.
        elif offset == 0x10C:
            assert shared_status == 0 and (a, b, c) == (0, 0, 0)
            events.append(('failure',))  # Returning must resume construction.
        elif offset == 0x11C:
            shared_object = d
            assert (a, b, c) == (shared_wrapper, 2, 0)
            assert word(S + 0xB0) == d
            events.append(('attach_shared',))
            if mutate:
                word(S + 8, ALT_C)
        elif offset == 0x124:
            assert a == (ALT_LIST if mutate else LIST)
            count_calls += 1
            assert count_calls == 1
            result = len(excluded)
            events.append(('count',))
        elif offset == 0x12C:
            assert a == (ALT_LIST if mutate else LIST) and b == original
            result = 0x29000 + 4 * b
            events.append(('element', b))
        elif offset == 0x134:
            assert (a, b) == (0x29000 + 4 * original, 2)
            result = excluded[original]
            events.append(('exclude', original))
            original += 1
            # This must not become the loop bound.
            word(S + 0x18, 0)
        elif offset == 0x402C:
            objects.append(a)
            assert word(S + 0x2C + 4 * packed) == a
            assert (b, c, d, stk[0]) == (0xC240, 0xC2C0, wrappers[packed], 0)
            q = stk[1]
            assert bytes(uc.mem_read(q, 4)) == b'\0\xa5\xa5\xa5'
            assert words(q + 4, 10) == [0, 0, 4, 0, 0, 0, 1, 0, 0, 1]
            events.append(('slot2c', packed))
        elif offset == 0x401C:
            assert (a, b) == (objects[packed], 0)
            events.append(('slot1c', packed))
        elif offset == 0x4034:
            assert (a, b, c, d, stk) == (objects[packed], 0xC240, shared_object, 0, [0, 0xFFFFFFFF, 0])
            events.append(('slot34', packed))
        elif offset in (0x4038, 0x4040):
            assert (a, b) == (objects[packed], 0)
            assert uc.reg_read(UC_ARM_REG_S0) == 0
            events.append(('slot38' if offset == 0x4038 else 'slot40', packed))
        elif offset == 0x405C:
            assert a == word(S + 0x24) and b == word(NAMES + 4 * packed)
            result = lookups[packed] & 0xFFFFFFFF
            events.append(('lookup', packed))
            if mutate:
                word(S + 0x24, RESOURCE + 4 * (packed * 2 + 1))
        elif offset == 0x144:
            assert a == word(S + 0x24) and lookups[packed] >= 0
            values = fp_values or [1.25 + packed, -2.5 - packed, 16777216.0]
            position(b, values)
            expected_position = [fbits(v) for v in values]
            events.append(('position', packed))
            if mutate:
                word(S + 0x24, RESOURCE + 4 * (packed * 2 + 2))
        elif offset == 0x4064:
            assert a == word(S + 0x24) and b == lookups[packed]
            uc.mem_write(c, bytes([0x7E]) * 48)
            delta = translations or [0.5, 8.25, 1.0]
            for displacement, value in zip((12, 28, 44), delta):
                word(c + displacement, fbits(value))
            expected_position = [fbits(fvalue(old) + value)
                                 for old, value in zip(expected_position, delta)]
            events.append(('matrix', packed))
        elif offset == 0x14C:
            assert a == objects[packed]
            actual = words(b, 3)
            assert all(a == e or (math.isnan(fvalue(a)) and math.isnan(fvalue(e)))
                       for a, e in zip(actual, expected_position)), (actual, expected_position)
            placements.append(actual)
            expected_placements.append(expected_position.copy())
            events.append(('place', packed))
            if mutate:
                word(S + 8, C if packed % 2 else ALT_C)
        elif offset == 0x024:
            assert a == word(S + 8)
            result = 0x28000
            events.append(('service', packed))
        elif offset == 0x154:
            assert (a, b, c, d) == (0x34000, objects[packed], 0, 0)
            events.append(('register', packed))
            packed += 1
        else:
            raise AssertionError(hex(offset))
        # All these callbacks may replace the instance field. Every following
        # virtual call and registration must reload the current field.
        if mutate and offset in (0x402C, 0x401C, 0x4034, 0x4038, 0x4040, 0x024):
            replacement_instance += 0x10
            word(replacement_instance, VTABLE)
            word(S + 0x2C + 4 * packed, replacement_instance)
            objects[packed] = replacement_instance
        pending_result = result
        if poison_flags:
            # Force V=1 so a negative lookup cannot accidentally rely on V=0
            # when testing the sign of the returned word.
            uc.reg_write(UC_ARM_REG_CPSR,
                         (uc.reg_read(UC_ARM_REG_CPSR) & 0x0FFFFFFF) | 0x10000000)
        # Every mock destroys volatile channels, including float arguments.
        for j, reg in enumerate(ARGS + [UC_ARM_REG_R12]):
            uc.reg_write(reg, 0xDEAD1000 + j)
        for j in range(8):
            uc.reg_write(UC_ARM_REG_D0 + j, 0x4141414141414141)
        uc.reg_write(UC_ARM_REG_R0, result)
        uc.reg_write(UC_ARM_REG_PC, uc.reg_read(UC_ARM_REG_LR))

    uc.hook_add(UC_HOOK_CODE, on_code)
    uc.hook_add(UC_HOOK_MEM_WRITE, on_write)
    uc.emu_start(BASE + 0x13BC, STOP + 4, count=100000)
    assert finished and max_depth == 208
    assert uc.reg_read(UC_ARM_REG_R0) == pending_result
    assert uc.reg_read(UC_ARM_REG_SP) == STACK
    assert [uc.reg_read(reg) for reg in SAVED] == initial_saved
    assert uc.reg_read(UC_ARM_REG_D8) == 0x123456789ABCDEF0
    assert original == len(excluded) and packed == len(included) and count_calls == 1
    assert allocation_sizes == [64, 36] + [64, 200] * len(included)
    expected_events = [('alloc', 64)]
    if 0 not in fail_alloc:
        expected_events.append(('ctor', 0x0FC))
    expected_events.append(('initialize_shared',))
    if shared_status == 0:
        expected_events.append(('failure',))
    expected_events.append(('alloc', 36))
    if 1 not in fail_alloc:
        expected_events.append(('ctor', 0x114))
    expected_events += [('attach_shared',), ('count',)]
    j = 0
    for i, skip in enumerate(excluded):
        expected_events += [('element', i), ('exclude', i)]
        if skip:
            continue
        expected_events.append(('alloc', 64))
        if 2 + 2 * j not in fail_alloc:
            expected_events.append(('ctor', 0x0FC))
        expected_events += [('initialize', j), ('alloc', 200)]
        if 3 + 2 * j not in fail_alloc:
            expected_events.append(('ctor', 0x13C))
        expected_events += [(name, j) for name in ('slot2c', 'slot1c', 'slot34', 'slot38', 'slot40', 'lookup')]
        if lookups[j] >= 0:
            expected_events += [('position', j), ('matrix', j)]
        expected_events += [('place', j), ('service', j), ('register', j)]
        j += 1
    assert events == expected_events, (events, expected_events)
    # The spec fixes write widths and order, including overlapping temporaries,
    # the partially initialized option block, and all outgoing stack arguments.
    expected_writes = [(0x0C, 4, 0xC240), (0x24, 4, 0xC2C0),
                       (0x10, 4, VECTOR[0]), (0x14, 4, VECTOR[0]),
                       (0x90, 4, 0xA110C), (0x18, 4, VECTOR[0])]
    if 0 not in fail_alloc:
        expected_writes += [(0, 4, 1), (4, 4, 0)]
    expected_writes += [(0, 4, 0), (4, 4, 0),
                        (0x88, 4, ALT_LIST if mutate else LIST)]
    for j in range(len(included)):
        expected_writes += [(k, 4, VECTOR[0]) for k in (0x98, 0x9C, 0xA0)]
        if 2 + 2 * j not in fail_alloc:
            expected_writes += [(0, 4, 1), (4, 4, 0)]
        expected_writes += [(0, 4, 0), (4, 4, 1), (0x28, 1, 0)]
        expected_writes += [(k, 4, v) for k, v in
                            [(0x2C, 0), (0x30, 0), (0x34, 4), (0x38, 0),
                             (0x3C, 0), (0x40, 0), (0x50, 1), (0x44, 1),
                             (0x48, 0), (0x4C, 0)]]
        expected_writes += [(0, 4, 0), (4, 4, STACK - 208 + 0x28),
                            (0, 4, 0), (4, 4, 0xFFFFFFFF), (8, 4, 0)]
        if lookups[j] >= 0:
            expected_writes += [(0x14 + 4 * k, 4, v)
                                for k, v in enumerate(expected_placements[j])]
    assert len(stack_writes) == len(expected_writes), (stack_writes, expected_writes)
    for actual, expected in zip(stack_writes, expected_writes):
        assert actual == expected or (actual[:2] == expected[:2] and
               actual[0] in (0x14, 0x18, 0x1C) and actual[1] == 4 and
               math.isnan(fvalue(actual[2])) and math.isnan(fvalue(expected[2]))), (actual, expected)
    assert all(visited.count(k) == v for k, v in {
        0x1448: 1, 0x1470: 1, 0x14D0: len(excluded), 0x14DC: len(excluded),
        0x1508: len(included), 0x158C: len(included), 0x16B4: len(included),
        0x16E0: 1, 0x16E4: 1, 0x16E8: 1,
    }.items())
    # Even the seventh raw iteration must not clear these outputs or the flag.
    assert words(S + 0x74, 6) == [0xCCCCCCCC] * 6
    assert word(S + 0xB4) == 0xB400 and word(S + 0xB8) == 0xCCCCCCCC
    assert bytes(uc.mem_read(S + 0x28, 1)) == b'\xcc'
    for j in range(len(included), 6):
        assert word(S + 0x2C + 4 * j) == 0xCCCCCCCC
        assert word(S + 0x44 + 4 * j) == 0xCCCCCCCC
    return placements


def main():
    assert len(sys.argv) == 2, 'usage: test-cro-dll-uspassage.py <authored-body.bin>'
    body = Path(sys.argv[1]).read_bytes()
    assert len(body) == 816
    cases = [([], {}), ([1, 0xFFFFFFFF, 2], {}), ([0], {}),
             ([0] * 6, {}), ([0] * 7, {}),
             ([1, 0, 3, 0, 0, 8], {'mutate': True}),
             ([0, 0, 0], {'lookups': [-1, 4, -2]}),
             ([0, 0], {'lookups': [0, -1], 'mutate': True}),
             ([0], {'shared_status': 0}),
             ([0], {'fail_alloc': (0, 1, 2, 3), 'shared_status': 0}),
             ([0], {'thumb': True}), ([], {'thumb': True}),
             ([0, 0], {'lookups': [-1, -2], 'shared_vector_write': True}),
             ([0, 1, 0], {'lookups': [-1, 0], 'mutate': True,
                          'poison_flags': True}),
             ([0], {'fp_values': [float('inf'), float('-inf'), -0.0],
                    'translations': [1.0, float('inf'), -0.0]}),
             ([0], {'fp_values': [float('nan'), 0.0, 1.0],
                    'translations': [1.0, float('nan'), float('-inf')]})]
    for allocation in range(6):
        cases.append(([0, 0], {'fail_alloc': (allocation,)}))
    for excluded, options in cases:
        run_case(body, excluded, **options)
    print(f'Passed {len(cases)} synthetic ARM/VFP passage execution cases.')


if __name__ == '__main__':
    main()
