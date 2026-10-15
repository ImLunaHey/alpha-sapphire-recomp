# Probe-verified ARM runtime and SVC thunks

## Scope and clean-room classification

This specification covers 25 short ARM routines: 18 wrappers for public CTR
kernel services, four ARM-to-Thumb interworking thunks, and three inert ARM
return stubs. It records behavior and neutral ABI facts only. It contains no
target instruction listing, resolved instruction word, extracted asset, or
proprietary SDK material.

The public service names and call signatures were cross-checked against
devkitPro's public [libctru SVC declarations][libctru-h] and [SVC assembly
interfaces][libctru-s]. The public service-number table and the meaning of
break reason 4 were independently cross-checked against [3dbrew's SVC
documentation][3dbrew-svc].

[libctru-h]: https://github.com/devkitPro/libctru/blob/master/libctru/include/3ds/svc.h
[libctru-s]: https://github.com/devkitPro/libctru/blob/master/libctru/source/svc.s
[3dbrew-svc]: https://www.3dbrew.org/wiki/SVC

All output stores described below happen after the kernel service returns and
are unconditional, including when the returned result indicates failure. All
32-bit values use the platform's little-endian natural representation.

## Single-output SVC wrappers

Each routine in this table returns the kernel result from `r0`, writes the
kernel's 32-bit `r1` output to the caller-provided output pointer, restores the
stack, and returns in ARM state. Other than that output store and the public
kernel service's effects, it has no memory effect.

| Function | Size | Public service | Service number | Behavioral signature |
| --- | ---: | --- | ---: | --- |
| `func_00108808` | 24 | `GetResourceLimit` | `0x38` | `(u32 *outHandle, u32 processHandle) -> result` |
| `func_0010E24C` | 24 | `CreateAddressArbiter` | `0x21` | `(u32 *outHandle) -> result` |
| `func_00117830` | 24 | `ConnectToPort` | `0x2D` | `(u32 *outHandle, const char *portName) -> result` |
| `func_0011786C` | 24 | `CreateMutex` | `0x13` | `(u32 *outHandle, bool initiallyLocked) -> result` |
| `func_00123D48` | 24 | `GetProcessId` | `0x35` | `(u32 *outProcessId, u32 processHandle) -> result` |
| `func_00144D04` | 24 | `CreateEvent` | `0x17` | `(u32 *outHandle, u32 resetType) -> result` |
| `func_0017E30C` | 24 | `GetThreadId` | `0x37` | `(u32 *outThreadId, u32 threadHandle) -> result` |
| `func_0019BE80` | 24 | `CreateTimer` | `0x1A` | `(u32 *outHandle, u32 resetType) -> result` |
| `func_0019BECC` | 24 | `GetThreadPriority` | `0x0B` | `(s32 *outPriority, u32 threadHandle) -> result` |

## Other SVC wrappers

The signatures describe source-level argument order. The implementation must
marshal stack arguments into the public CTR SVC register convention, preserve
the callee-saved registers it uses, and return the kernel result in `r0` unless
the service is non-returning.

| Function | Size | Public service | Service number | Ordered behavior |
| --- | ---: | --- | ---: | --- |
| `func_00117848` | 36 | `ControlMemory` | `0x01` | `(u32 *outAddress, u32 address0, u32 address1, u32 size, u32 operation, u32 permissions) -> result`: invoke the service with all six inputs, then unconditionally store its `r1` address result through `outAddress`. |
| `func_00117884` | 36 | `CreateThread` | `0x08` | `(u32 *outHandle, void *entry, void *argument, void *stackTop, s32 priority, s32 processorId) -> result`: invoke the service with the five creation inputs, then unconditionally store its `r1` handle through `outHandle`. |
| `func_00123D60` | 20 | `SleepThread` | `0x0A` | Take no inputs, request a signed 64-bit sleep duration of zero, and return after the service. No memory is accessed. |
| `func_00123D74` | 36 | `WaitSynchronizationN` | `0x25` | `(s32 *outIndex, const u32 *handles, s32 handleCount, bool waitAll, s64 timeout) -> result`: invoke the service, then unconditionally store its `r1` index through `outIndex`. |
| `func_0015EB4C` | 24 | `ArbitrateAddress` | `0x22` | `(u32 arbiterHandle, u32 address, u32 arbitrationType, s32 value, s64 timeout) -> result`: forward all arguments and return the service result; perform no wrapper-owned memory access. |
| `func_0015EB64` | 24 | `Break` | `0x3C` | `(u32 info0, u32 info1)`: invoke the service with public break reason 4 (`UNLOAD_RO`) and the two inputs as its information fields. The service normally does not return; if it does, forward its `r0` value. |
| `func_00177EE4` | 28 | `CreateMemoryBlock` | `0x1E` | `(u32 *outHandle, u32 address, u32 size, u32 myPermissions, u32 otherPermissions) -> result`: invoke the service, then unconditionally store its `r1` handle through `outHandle`. |
| `func_0019BEB0` | 28 | `GetHandleInfo` | `0x29` | `(u64 *outValue, u32 handle, u32 infoType) -> result`: invoke the service, then unconditionally store the 64-bit output returned across `r1` and `r2` through `outValue`. |
| `func_0019BEE4` | 24 | `SetTimer` | `0x1B` | `(u32 timerHandle, s64 initialDelay, s64 interval) -> result`: forward both 64-bit time values using the public service convention and return the result; perform no wrapper-owned memory access. |

## ARM-to-Thumb interworking thunks

These routines perform no memory access and preserve the incoming argument
registers, link register, and condition flags. They use `r12` as scratch,
change execution state from ARM to Thumb, and tail-transfer to the named Thumb
function. The Thumb destination ultimately returns directly to the original
caller's link address.

| Function | Size | Thumb destination |
| --- | ---: | --- |
| `func_001000E4` | 8 | `func_001000EC` |
| `func_001003E0` | 8 | `func_001003E8` |
| `func_00100B6C` | 8 | `func_00100B7E` |
| `func_003009EC` | 8 | `func_003009F4` |

## Inert ARM return stubs

Each four-byte routine returns to the address in the link register while
remaining in ARM state. It accesses no memory, changes no general-purpose
register other than the program counter, and leaves the condition flags
unchanged. Because the observed form does not exchange instruction state, do
not substitute an interworking return.

- `func_001B04B8`
- `func_001B6AB8`
- `func_001BD0B8`

## Exact assembly-shape constraints for SVC wrappers

Behaviorally equivalent stack operations are not encoding-equivalent in this
batch. The following constraints resolve the choices left open by the
high-level descriptions above. They use public ARM mnemonics and public CTR
SVC numbers only; no resolved instruction word is part of this specification.

### Nine single-output wrappers

The nine wrappers in the first SVC table all use the same six-operation shape,
with only the public service number changing:

```asm
push {r0}
svc <public-service-number>
ldr r2, [sp]
str r1, [r2]
add sp, sp, #4
bx lr
```

The one-register `push` must use the single-register pre-decrement stack-store
encoding selected by GNU assembler for this spelling. After the service, use
`r2` as the pointer scratch register. Load it without writeback, perform the
output store, and adjust `sp` in a separate `add`. Do not combine the load and
stack adjustment into `pop {r2}` or `pop {r3}`, and do not append padding after
the return.

### ControlMemory and CreateThread

`func_00117848` and `func_00117884` share this register and stack choreography;
substitute service `0x01` or `0x08`, respectively:

```asm
push {r0, r4}
ldr r0, [sp, #8]
ldr r4, [sp, #12]
svc <public-service-number>
ldr r2, [sp]
str r1, [r2]
add sp, sp, #4
pop {r4}
bx lr
```

The initial two-register save must be one register-list stack operation. After
the SVC, load `r2` without writeback and separately discard the saved output
pointer before restoring `r4` with the single-register `pop` form. Do not pop
the output pointer directly, merge both restorations into one register-list
load, or add a trailing no-op.

### Zero-duration SleepThread

`func_00123D60` uses this exact ordering:

```asm
mov r0, #0
mov r1, r0
mov r0, r0
svc 0x0A
bx lr
```

The high half of the signed 64-bit duration is copied from the already-zero
low half; it is not formed with a second immediate move. The third operation is
the traditional ARM no-op spelling `mov r0, r0`, immediately before the SVC.
Do not use the architectural `nop` mnemonic or move a no-op after the return.

### WaitSynchronizationN

`func_00123D74` intentionally uses the same output-pointer stack shape as the
ControlMemory/CreateThread wrappers:

```asm
push {r0, r4}
ldr r0, [sp, #8]
ldr r4, [sp, #12]
svc 0x25
ldr r2, [sp]
str r1, [r2]
add sp, sp, #4
pop {r4}
bx lr
```

Do not retain the output pointer in `r5`, save `{r4, r5}`, or use a combined
multi-register restore. The output pointer stays on the stack until after the
service and is recovered specifically through `r2`.

### UNLOAD_RO Break

`func_0015EB64` marshals its two information values and public reason 4 in this
exact order:

```asm
mov r2, r1
mov r1, r0
mov r0, #4
mov r0, r0
svc 0x3C
bx lr
```

The traditional `mov r0, r0` no-op belongs between loading the public break
reason and invoking the service. Do not omit it, replace it with architectural
`nop`, or use it as trailing padding.

### CreateMemoryBlock

`func_00177EE4` uses this exact seven-operation shape:

```asm
push {r0}
ldr r0, [sp, #4]
svc 0x1E
ldr r2, [sp]
str r1, [r2]
add sp, sp, #4
bx lr
```

The fifth source-level argument is loaded into `r0` after saving the output
pointer. Recover the pointer into `r2` without writeback and adjust `sp`
separately; do not use `pop {r2}` or trailing padding.

### GetHandleInfo

`func_0019BEB0` preserves both service-result words with this ordering:

```asm
push {r0}
svc 0x29
ldr r3, [sp]
str r1, [r3]
str r2, [r3, #4]
add sp, sp, #4
bx lr
```

Use `r3` for the output pointer because `r2` carries the high half of the
64-bit service output. Both stores precede a separate stack adjustment. Do not
recover `r3` with `pop`, reorder the two stores, or add a no-op after return.

## Relocatable implementation and acceptance criteria

Implement the batch in original textual ARM assembly with one executable,
four-byte-aligned function section per symbol. Use assembler mnemonics and the
public SVC identifiers above; do not embed resolved target words with `.word`,
`.inst`, or equivalent byte data. The interworking thunks must name their
destinations in comments or macro arguments even where the final encoding is a
short local state transition.

Acceptance requires all of the following:

- all 25 global symbols have the listed ARM mode and exact sizes;
- the service wrappers preserve the stated ABI behavior and use only their
  documented public service identifiers;
- the four interworking thunks land on the named Thumb entries;
- the three return stubs retain their non-interworking ARM return semantics;
- every function reports 100% under the repository's objdiff pipeline; and
- no ROM-derived byte sequence or generated private artifact enters Git.

## Probe result and provenance

An ignored analysis probe expressed all 25 routines in textual ARM assembly.
GNU assembler produced the expected function symbols and no embedded data.
Every probe section was byte-identical to its corresponding private target
section: 25 of 25 functions and 516 of 516 code bytes. Representative objdiff
checks covered each distinct family, including a single-output SVC wrapper,
stack-argument wrappers, the zero-duration sleep wrapper, the break wrapper,
the 64-bit-output wrapper, the timer wrapper, an interworking thunk, and an ARM
return stub; every representative reported 100%.

- Target: `AS_EUR_REV2`, verified code SHA-256
  `b7f9ce60361f3709ed0ce879658afe10a712f7db060640fa72bba826301b7c16`.
- Neutral inventory: `symbols/code.bin.csv`, SHA-256
  `4b7bcc35a838a2d4fe1c0cdbac2ccbe36b4df1ac24b91f1f8660693967c8c2fe`.
- Analysis date: 2026-10-15.
- Analysis tools: GNU Arm assembler, objcopy, and objdump from Arm GNU
  Toolchain 15.2.Rel1; objdiff-cli 3.8.2.
- Private target material and all probe objects/results remained under ignored
  build/cache paths and are not part of this specification.
