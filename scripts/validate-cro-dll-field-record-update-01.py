#!/usr/bin/env python3
"""Public IMPLEMENTATION validation; only compile and execute authored DllField code.

AS_EUR_REV2, 2026-10-17. Behavioral authority: the ANALYSIS-approved public
DllField_record_update_01.md at 70e1ebe8123dbd1df821fce1b729fafb6d14c151.
No prebuilt object input, target comparison, disassembler, or instruction schedule.
IMPLEMENTATION provenance and the observed public tool versions are recorded below.

Reproduce using the repository's locked public Nix packages (from its root):
  field_tools="$(nix build --no-link --print-out-paths .#toolchain)"
  field_python="$(nix build --no-link --print-out-paths --impure --expr \\
    'let pkgs = (builtins.getFlake (toString ./.)).inputs.nixpkgs.legacyPackages.x86_64-linux; in pkgs.python3.withPackages (p: [ p.unicorn ])')"
  "$field_python/bin/python3" scripts/validate-cro-dll-field-record-update-01.py \\
    --compiler "$field_tools/bin/arm-none-eabi-gcc" \\
    --linker "$field_tools/bin/arm-none-eabi-ld" \\
    --readelf "$field_tools/bin/arm-none-eabi-readelf"
"""

import argparse
from collections import Counter
from copy import deepcopy
import itertools
import json
from pathlib import Path
import random
import re
import struct
import subprocess
import tempfile

from unicorn import (
    Uc, UC_ARCH_ARM, UC_MODE_ARM, UC_MODE_LITTLE_ENDIAN,
    UC_HOOK_CODE, UC_HOOK_MEM_READ, UC_HOOK_MEM_WRITE, UC_MEM_READ,
    UC_PROT_READ, UC_PROT_WRITE, UC_PROT_EXEC,
)
from unicorn.arm_const import (
    UC_CPU_ARM_11MPCORE, UC_ARM_REG_R0, UC_ARM_REG_R1, UC_ARM_REG_R2,
    UC_ARM_REG_R3, UC_ARM_REG_R4, UC_ARM_REG_R5, UC_ARM_REG_R6,
    UC_ARM_REG_R7, UC_ARM_REG_R8, UC_ARM_REG_R9, UC_ARM_REG_R10,
    UC_ARM_REG_R11, UC_ARM_REG_R12, UC_ARM_REG_SP, UC_ARM_REG_LR, UC_ARM_REG_PC,
    UC_ARM_REG_CPSR,
)

ROOT = Path(__file__).resolve().parent.parent
BASE = "70e1ebe8123dbd1df821fce1b729fafb6d14c151"
UNIT = "DllField"
NAME = "func_0002CBF8"
SOURCE = "src/cro/DllField/record_update_01.c"
SPEC = "docs/specs/cro/DllField_record_update_01.md"
CLAIM = {"name": NAME, "address": 183288, "size": 24, "semantics": "record-update-01"}
PROVENANCE = {
    "role": "IMPLEMENTATION (distinct from the approved specification's ANALYSIS role)",
    "date": "2026-10-17",
    "revision": "AS_EUR_REV2",
    "unit": "cro/DllField",
    "specification": SPEC,
    "specification_commit": BASE,
    "boundary": "docs/CLEAN_ROOM.md read in full; original source; no target or private inputs, "
                "disassembly, leaked source, proprietary headers, or reverse-engineering tools",
    "public_inputs": ["config/cro-sources.json", "scripts/build-cro-base.mjs",
                      "src/cro/DllField.c", "configured authored companion sources",
                      "symbols/cro/DllField.csv", "symbols/cro-partitions/DllField.json",
                      "progress/units/AS_EUR_REV2.cro.json",
                      "progress/reports/AS_EUR_REV2/report.json"],
    "tools": {
        "gcc": "arm-none-eabi-gcc (Arm GNU Toolchain 14.2.Rel1 (Build arm-14.52)) 14.2.1 20241119",
        "linker": "GNU ld (Arm GNU Toolchain 14.2.Rel1 (Build arm-14.52)) 2.43.1.20241119",
        "readelf": "GNU readelf (Arm GNU Toolchain 14.2.Rel1 (Build arm-14.52)) 2.43.1.20241119",
        "python": "3.12.12", "unicorn": "2.1.3", "node": "24.21.0", "npm": "11.19.0",
        "git": "2.53.0", "ripgrep": "15.2.0", "bash": "5.3.9(1)-release", "nix": "2.31.3",
    },
    "limits": "Authored-code behavioral and compiler-structure checks only; no exact-match "
              "claim, authoritative objdiff/report comparison, or new report credit. "
              "Complete remains false; independent revision-verified verification is outstanding.",
}
COMMON = ["-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft",
          "-ffreestanding", "-fno-pic", "-fno-pie", "-Wa,--noexecstack"]
# Same public C preset as scripts/build-cro-base.mjs; no compiler tuning.
C_FLAGS = ["-std=c11", "-Os", *COMMON, "-fno-builtin", "-fno-common",
           "-fomit-frame-pointer", "-fno-unwind-tables", "-fno-asynchronous-unwind-tables",
           "-fno-stack-protector", "-fno-ident", "-ffunction-sections", "-fdata-sections",
           "-Wall", "-Wextra", "-Werror"]


def check(condition, message):
    if not condition:
        raise ValueError(message)


def run(*args):
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, check=False)
    # Do not echo tool diagnostics that may contain local paths.
    check(result.returncode == 0, f"{Path(args[0]).name} failed (exit {result.returncode})")
    return result.stdout


def public_at_base(path):
    return run("git", "show", f"{BASE}:{path}")


def validate_ownership(config, baseline):
    check(config.get("schemaVersion") == 1, "unsupported ownership version")
    units = [unit for unit in config["units"] if unit["name"] == UNIT]
    check(len(units) == 1, "DllField ownership must be unique")
    unit = units[0]
    expected = deepcopy(next(unit for unit in baseline["units"] if unit["name"] == UNIT))
    expected["sources"].append({"path": SOURCE, "mode": "arm"})
    expected["functions"].append(CLAIM)
    expected["functions"].sort(key=lambda fn: fn["address"])
    check(unit == expected, "DllField must add only the approved function and ARM C source")
    owners = [owner["name"] for owner in config["units"]
              for source in owner["sources"] if source["path"] == SOURCE]
    check(owners == [UNIT], "new source ownership must be disjoint")
    for left, right in itertools.pairwise(unit["functions"]):
        check(left["address"] + left["size"] <= right["address"], "function ownership overlaps")
    return unit


def validate_accounting(report_unit, old_unit):
    check(report_unit == old_unit and len(report_unit) == 1 and
          report_unit[0]["metadata"]["complete"] is False,
          "published DllField credit and complete=false must remain unchanged")


def validate_public_inputs():
    config = json.loads((ROOT / "config/cro-sources.json").read_text())
    baseline = json.loads(public_at_base("config/cro-sources.json"))
    unit = validate_ownership(config, baseline)
    check((ROOT / SPEC).read_text() == public_at_base(SPEC), "approved specification changed")
    inventory = json.loads((ROOT / "progress/units/AS_EUR_REV2.cro.json").read_text())
    check(inventory["target"] == "AS_EUR_REV2" and
          len([u for u in inventory["units"] if u["name"] == "cro/DllField"]) == 1,
          "published revision or unit identity changed")
    partition = json.loads((ROOT / "symbols/cro-partitions/DllField.json").read_text())
    check(partition["module"] == UNIT and
          [fn for fn in partition["functions"] if fn["name"] == NAME] ==
          [{"name": NAME, "address": 183288, "size": 24, "mode": "arm"}],
          "approved public boundary is missing or ambiguous")
    rows = [line for line in (ROOT / "symbols/cro/DllField.csv").read_text().splitlines()
            if f'"{NAME}"' in line]
    check(rows == [f'0002CBF8,"{NAME}","Global",$a,00000018,".text"'],
          "approved public inventory boundary changed")
    report_path = "progress/reports/AS_EUR_REV2/report.json"
    report = json.loads((ROOT / report_path).read_text())
    report_unit = [u for u in report["units"] if u["name"] == "cro/DllField"]
    old_unit = [u for u in json.loads(public_at_base(report_path))["units"]
                if u["name"] == "cro/DllField"]
    validate_accounting(report_unit, old_unit)
    for source in unit["sources"]:
        path = ROOT / source["path"]
        check(path.is_file() and not path.is_symlink() and
              path.resolve().is_relative_to(ROOT / "src/cro"), "source must be a regular owned file")
    source_text = (ROOT / SOURCE).read_text()
    check(not re.search(r"\b(?:asm|__asm|__asm__)\b|\.incbin\b", source_text),
          "new implementation must not encode instructions or import binary content")
    includes = re.findall(r"^\s*#\s*include\s+(.+)$", source_text, re.M)
    check(includes == ["<stddef.h>", "<stdint.h>"], "only standard layout/integer headers allowed")
    return unit, config, baseline, report_unit


def object_metadata(readelf, path):
    header = run(readelf, "--file-header", str(path))
    check(all(re.search(pattern, header, re.M) for pattern in [
        r"Class:\s+ELF32$", r"Data:\s+2's complement, little endian$",
        r"Type:\s+REL \(Relocatable file\)$", r"Machine:\s+ARM$",
        r"Flags:.*Version5 EABI$",
    ]), "authored object must be ELF32 little-endian ARM EABI5 ET_REL")
    sections = []
    for line in run(readelf, "--sections", "--wide", str(path)).splitlines():
        match = re.match(r"\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+([0-9a-f]+)\s+"
                         r"([0-9a-f]+)\s+([0-9a-f]+)\s+[0-9a-f]+\s+(.*?)\s*$", line, re.I)
        if match and match[2] != "NULL":
            tail = match[7].split()
            sections.append({"index": int(match[1]), "name": match[2], "type": match[3],
                             "address": int(match[4], 16), "offset": int(match[5], 16),
                             "size": int(match[6], 16), "flags": "".join(tail[:-3]),
                             "align": int(tail[-1])})
    symbols = []
    for line in run(readelf, "--symbols", "--wide", str(path)).splitlines():
        fields = line.split()
        if len(fields) >= 8 and re.fullmatch(r"\d+:", fields[0]):
            symbols.append({"value": int(fields[1], 16), "size": int(fields[2]),
                            "type": fields[3], "bind": fields[4], "visibility": fields[5],
                            "section": fields[6], "name": fields[7]})
    relocations = run(readelf, "--relocs", "--wide", str(path))
    check("There are no relocations in this file." in relocations, "unexpected authored relocation")
    return sections, symbols


def validate_structure(sections, symbols, functions):
    allocated = [section for section in sections if "A" in section["flags"] and section["size"]]
    check(sorted(section["name"] for section in allocated) ==
          sorted(f'.text.{fn["name"]}' for fn in functions), "missing or extra allocated payload")
    check(not any(sym["section"] == "UND" for sym in symbols), "undefined collaborator symbol")
    globals_ = [sym for sym in symbols if sym["bind"] in ("GLOBAL", "WEAK")]
    check(sorted(sym["name"] for sym in globals_) == sorted(fn["name"] for fn in functions),
          "missing, duplicate, or extra global symbol")
    for fn in functions:
        section = next(section for section in allocated if section["name"] == f'.text.{fn["name"]}')
        check(section["type"] == "PROGBITS" and section["size"] == fn["size"] and
              section["flags"] == "AX" and section["align"] == 4 and section["address"] == 0,
              "function section extent, permissions, or alignment changed")
        symbol = next(sym for sym in globals_ if sym["name"] == fn["name"])
        check(symbol == {"value": 0, "size": fn["size"], "type": "FUNC", "bind": "GLOBAL",
                         "visibility": "DEFAULT", "section": str(section["index"]), "name": fn["name"]},
              "function symbol must exclusively cover its section")
        mappings = [sym for sym in symbols if sym["section"] == str(section["index"]) and
                    sym["name"].startswith(("$a", "$t", "$d"))]
        check(len(mappings) == 1 and re.fullmatch(r"\$a(?:\.\d+)?", mappings[0]["name"]) and
              mappings[0]["value"] == 0, "ARM mapping must cover the whole function without a data pool")


def validate_execution(code):
    machine = Uc(UC_ARCH_ARM, UC_MODE_ARM | UC_MODE_LITTLE_ENDIAN)
    machine.ctl_set_cpu_model(UC_CPU_ARM_11MPCORE)
    code_base, records, stack, returned = 0x1000000, 0x2000000, 0x3000000, 0x4000000
    machine.mem_map(code_base, 4096, UC_PROT_READ | UC_PROT_WRITE | UC_PROT_EXEC)
    machine.mem_write(code_base, code)
    machine.mem_protect(code_base, 4096, UC_PROT_READ | UC_PROT_EXEC)
    machine.mem_map(records, 8192, UC_PROT_READ | UC_PROT_WRITE)
    machine.mem_map(stack, 8192, UC_PROT_READ | UC_PROT_WRITE)
    accesses = []

    def memory_hook(_machine, access, address, size, _value, _data):
        accesses.append(("read" if access == UC_MEM_READ else "write", address, size))

    def code_hook(_machine, address, size, _data):
        check(code_base <= address < code_base + len(code) and size == 4,
              "execution escaped the authored ARM function")

    machine.hook_add(UC_HOOK_MEM_READ | UC_HOOK_MEM_WRITE, memory_hook)
    machine.hook_add(UC_HOOK_CODE, code_hook)
    preserved = [UC_ARM_REG_R4, UC_ARM_REG_R5, UC_ARM_REG_R6, UC_ARM_REG_R7,
                 UC_ARM_REG_R8, UC_ARM_REG_R9, UC_ARM_REG_R10, UC_ARM_REG_R11]
    edges = [0, 1, 0x7F, 0x80, 0xFF, 0x100, 0x80000000, 0xFFFFFFFF]
    rng = random.Random(20261017)
    cases = list(itertools.product(edges, repeat=4))
    cases.extend(tuple(rng.getrandbits(32) for _ in range(4)) for _ in range(256))
    positions = [0, 4, 64, 4096 - 44, 4096 - 40, 4096, 8192 - 44]
    for index, (a, b, c, d) in enumerate(cases):
        # Include page edges and a record crossing a page; valid storage stays disjoint.
        position = positions[index % len(positions)]
        record, sp = records + position, stack + 1024 + 8 * (index % 64)
        initial = rng.randbytes(8192)
        stack_initial = bytearray(rng.randbytes(8192))
        struct.pack_into("<I", stack_initial, sp - stack, d)
        machine.mem_write(records, initial)
        machine.mem_write(stack, bytes(stack_initial))
        machine.reg_write(UC_ARM_REG_CPSR, 0x10 | ((index % 16) << 28))
        for reg, value in zip([UC_ARM_REG_R0, UC_ARM_REG_R1, UC_ARM_REG_R2, UC_ARM_REG_R3],
                              [record, a, b, c]):
            machine.reg_write(reg, value)
        saved = [rng.getrandbits(32) for _ in preserved]
        for reg, value in zip(preserved, saved):
            machine.reg_write(reg, value)
        machine.reg_write(UC_ARM_REG_SP, sp)
        machine.reg_write(UC_ARM_REG_LR, returned)
        machine.reg_write(UC_ARM_REG_R12, rng.getrandbits(32))
        accesses.clear()
        machine.emu_start(code_base, returned, count=64)
        check(machine.reg_read(UC_ARM_REG_PC) == returned, "bounded return did not complete")
        expected = bytearray(initial)
        struct.pack_into("<I", expected, position + 28, a)
        expected[position + 36] = b & 0xFF
        expected[position + 37] = c & 0xFF
        struct.pack_into("<I", expected, position + 40, d)
        check(machine.mem_read(records, 8192) == expected, "fields, padding, or record guards changed")
        check(machine.mem_read(stack, 8192) == stack_initial and
              machine.reg_read(UC_ARM_REG_SP) == sp, "stack was modified")
        check(machine.reg_read(UC_ARM_REG_R0) == record, "record pointer was not returned")
        check([machine.reg_read(reg) for reg in preserved] == saved, "callee-saved register changed")
        # Compare a multiset: the neutral contract specifies extents, never an access order.
        check(Counter(accesses) == Counter([("read", sp, 4), ("write", record + 28, 4),
                                            ("write", record + 36, 1), ("write", record + 37, 1),
                                            ("write", record + 40, 4)]),
              "unexpected data access or missing field write")
    return len(cases)


def rejected(action):
    try:
        action()
    except ValueError:
        return
    raise ValueError("negative fixture was incorrectly accepted")


def self_test(config, baseline, sections, symbols, functions, report_unit):
    count = 0
    for change in ("missing-source", "wrong-mode", "duplicate-function", "wrong-boundary", "shared-source"):
        bad = deepcopy(config)
        unit = next(unit for unit in bad["units"] if unit["name"] == UNIT)
        if change == "missing-source":
            unit["sources"].pop()
        elif change == "wrong-mode":
            unit["sources"][-1]["mode"] = "thumb"
        elif change == "duplicate-function":
            unit["functions"].append(CLAIM)
        elif change == "wrong-boundary":
            next(fn for fn in unit["functions"] if fn["name"] == NAME)["size"] += 4
        else:
            next(unit for unit in bad["units"] if unit["name"] != UNIT)["sources"].append(
                {"path": SOURCE, "mode": "arm"})
        rejected(lambda: validate_ownership(bad, baseline))
        count += 1
    for change in ("data-payload", "writable-code", "wrong-size", "undefined", "duplicate-symbol", "thumb"):
        bad_sections, bad_symbols = deepcopy(sections), deepcopy(symbols)
        section = next(section for section in bad_sections if section["name"] == f".text.{NAME}")
        symbol = next(sym for sym in bad_symbols if sym["name"] == NAME)
        if change == "data-payload":
            extra = dict(section, name=".unexpected-data", flags="WA")
            bad_sections.append(extra)
        elif change == "writable-code":
            section["flags"] = "WAX"
        elif change == "wrong-size":
            section["size"] += 4
        elif change == "undefined":
            bad_symbols.append(dict(symbol, name="unexpected_collaborator", section="UND"))
        elif change == "duplicate-symbol":
            bad_symbols.append(symbol.copy())
        else:
            next(sym for sym in bad_symbols if sym["section"] == str(section["index"]) and
                 sym["name"].startswith("$a"))["name"] = "$t"
        rejected(lambda: validate_structure(bad_sections, bad_symbols, functions))
        count += 1
    for change in ("complete", "code-credit", "function-credit"):
        bad = deepcopy(report_unit)
        if change == "complete":
            bad[0]["metadata"]["complete"] = True
        elif change == "code-credit":
            bad[0]["measures"]["matched_code"] = "488"
        else:
            bad[0]["measures"]["matched_functions"] = 29
        rejected(lambda: validate_accounting(bad, report_unit))
        count += 1
    return count


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for tool in ("compiler", "linker", "readelf"):
        parser.add_argument(f"--{tool}", required=True, type=Path)
    args = parser.parse_args()
    unit, config, baseline, report_unit = validate_public_inputs()
    tools = [args.compiler, args.linker, args.readelf]
    for tool in tools:
        check(tool.is_file(), "required compiler tool is missing")
    with tempfile.TemporaryDirectory(prefix="dll-field-public-") as directory:
        objects = []
        for index, source in enumerate(unit["sources"]):
            output = Path(directory) / f"{index}.o"
            flags = C_FLAGS if source["path"].endswith(".c") else [*COMMON, "-x", "assembler-with-cpp"]
            run(str(args.compiler), *flags, "-c", source["path"], "-o", str(output))
            objects.append(str(output))
        linked = Path(directory) / "DllField.o"
        run(str(args.linker), "-r", "-o", str(linked), *objects)
        sections, symbols = object_metadata(str(args.readelf), linked)
        validate_structure(sections, symbols, unit["functions"])
        own_sections, own_symbols = object_metadata(str(args.readelf), Path(objects[-1]))
        validate_structure(own_sections, own_symbols, [CLAIM])
        attributes = run(str(args.readelf), "--arch-specific", objects[-1])
        check("Tag_CPU_arch: v6K" in attributes and "Tag_ARM_ISA_use: Yes" in attributes,
              "compiler did not emit the public ARMv6K preset")
        section = next(section for section in own_sections if section["name"] == f".text.{NAME}")
        payload = Path(objects[-1]).read_bytes()[section["offset"]:section["offset"] + section["size"]]
        cases = validate_execution(payload)
        negatives = self_test(config, baseline, sections, symbols, unit["functions"], report_unit)
    print(f"Validated {cases} deterministic authored-code cases; {negatives} rejection fixtures.")
    print("DllField: 29 owned ARM functions, 488 code bytes; new function: 24 bytes, no relocations.")
    print("Published credit unchanged: 28 functions, 464 bytes; metadata.complete=false.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, OSError) as error:
        raise SystemExit(f"DllField public validation failed: {error}") from None
