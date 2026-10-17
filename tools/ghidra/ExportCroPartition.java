// License: MIT
// Exports a byte-exact, evidence-backed partition of a CRO .text section.

import java.io.File;
import java.io.PrintWriter;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import ghidra.app.script.GhidraScript;
import ghidra.program.model.address.Address;
import ghidra.program.model.lang.Register;
import ghidra.program.model.listing.Data;
import ghidra.program.model.listing.Instruction;
import ghidra.program.model.listing.InstructionIterator;
import ghidra.program.model.mem.MemoryBlock;
import ghidra.program.model.reloc.Relocation;

public class ExportCroPartition extends GhidraScript {
    private static final byte UNKNOWN = 0;
    private static final byte FUNCTION = 1;
    private static final byte GAP_ARM = 2;
    private static final byte GAP_THUMB = 3;
    private static final byte POOL = 4;
    private static final Pattern ROW = Pattern.compile(
        "^([0-9A-F]{8}),\"func_([0-9A-F]{8})\",\"Global\",(\\$a|\\$t),([0-9A-F]{8}),\"\\.text\"$");

    private static final class FunctionEntry {
        long address;
        long size;
        String name;
        String mode;

        FunctionEntry(long address, long size, String name, String mode) {
            this.address = address;
            this.size = size;
            this.name = name;
            this.mode = mode;
        }
    }

    private static final class Range {
        long address;
        long size;
        String mode;

        Range(long address, long size, String mode) {
            this.address = address;
            this.size = size;
            this.mode = mode;
        }
    }

    private static String json(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    private String modeAt(Register tMode, Address address) {
        BigInteger value = currentProgram.getProgramContext().getValue(tMode, address, false);
        if (BigInteger.ZERO.equals(value)) return "arm";
        if (BigInteger.ONE.equals(value)) return "thumb";
        return null;
    }

    private static void mark(byte[] classes, int start, int size, byte kind, String context) {
        if (start < 0 || size <= 0 || start > classes.length - size) {
            throw new IllegalStateException(context + " is outside .text");
        }
        for (int index = start; index < start + size; index++) {
            if (classes[index] != UNKNOWN && classes[index] != kind) {
                throw new IllegalStateException(context + " conflicts at .text+0x" + Integer.toHexString(index));
            }
            classes[index] = kind;
        }
    }

    private List<FunctionEntry> readFunctions(File csv, String unit, long textSize) throws Exception {
        List<String> lines = Files.readAllLines(csv.toPath(), StandardCharsets.UTF_8);
        if (lines.size() < 4 || !lines.get(0).equals("# Format,CRO_FUNCTIONS_V1") ||
            !lines.get(1).equals("# Module," + unit) ||
            !lines.get(2).equals(String.format("# TextSize,%08X", textSize)) ||
            !lines.get(3).equals("Location,Name,Namespace,Mode,Size,Segment")) {
            throw new IllegalStateException("Function CSV metadata is invalid");
        }
        List<FunctionEntry> functions = new ArrayList<>();
        for (int index = 4; index < lines.size(); index++) {
            if (lines.get(index).isEmpty()) continue;
            Matcher matcher = ROW.matcher(lines.get(index));
            if (!matcher.matches() || !matcher.group(1).equals(matcher.group(2))) {
                throw new IllegalStateException("Function CSV row is invalid at line " + (index + 1));
            }
            long address = Long.parseLong(matcher.group(1), 16);
            long size = Long.parseLong(matcher.group(4), 16);
            String mode = matcher.group(3).equals("$a") ? "arm" : "thumb";
            functions.add(new FunctionEntry(address, size, "func_" + matcher.group(1), mode));
        }
        functions.sort(Comparator.comparingLong(entry -> entry.address));
        return functions;
    }

    private List<Range> coalesce(byte[] classes, byte kind, String mode) {
        List<Range> ranges = new ArrayList<>();
        int cursor = 0;
        while (cursor < classes.length) {
            if (classes[cursor] != kind) { cursor++; continue; }
            int start = cursor++;
            while (cursor < classes.length && classes[cursor] == kind) cursor++;
            ranges.add(new Range(start, cursor - start, mode));
        }
        return ranges;
    }

    @Override
    public void run() throws Exception {
        String[] arguments = getScriptArgs();
        if (arguments.length != 3) {
            throw new IllegalArgumentException("Expected function CSV, output JSON, and cro/DllName unit");
        }
        String unit = arguments[2];
        if (!unit.matches("cro/Dll[A-Za-z0-9_]+")) throw new IllegalArgumentException("Invalid CRO unit name");
        String module = unit.substring("cro/".length());

        MemoryBlock text = null;
        MemoryBlock marker = null;
        for (MemoryBlock block : currentProgram.getMemory().getBlocks()) {
            if (".text".equals(block.getName()) && block.isExecute()) {
                if (text != null) throw new IllegalStateException("Multiple executable .text blocks");
                text = block;
            }
            if (".cro.module".equals(block.getName())) marker = block;
        }
        if (text == null || text.getSize() <= 0 || text.getSize() > Integer.MAX_VALUE) {
            throw new IllegalStateException("Missing or invalid executable .text block");
        }
        if (marker == null || marker.getSize() < 2 || marker.getSize() > 256) {
            throw new IllegalStateException("Missing or invalid .cro.module marker");
        }
        byte[] markerBytes = new byte[(int) marker.getSize()];
        if (marker.getBytes(marker.getStart(), markerBytes) != markerBytes.length || markerBytes[markerBytes.length - 1] != 0) {
            throw new IllegalStateException("Unreadable or unterminated .cro.module marker");
        }
        module = new String(markerBytes, 0, markerBytes.length - 1, StandardCharsets.UTF_8);
        if (!module.matches("Dll[A-Za-z0-9_]+")) throw new IllegalStateException("Invalid .cro.module identity");
        Address textStart = text.getStart();
        Address textEnd = text.getEnd();
        int textSize = (int) text.getSize();
        byte[] classes = new byte[textSize];
        Register tMode = currentProgram.getLanguage().getRegister("TMode");
        if (tMode == null) throw new IllegalStateException("ARM TMode context register is unavailable");
        List<FunctionEntry> functions = readFunctions(new File(arguments[0]), unit, textSize);

        // Relocation outputs are objective data evidence and take precedence over disassembly.
        Iterator<Relocation> relocations = currentProgram.getRelocationTable().getRelocations();
        while (relocations.hasNext()) {
            Relocation relocation = relocations.next();
            Address address = relocation.getAddress();
            if (address.compareTo(textStart) < 0 || address.compareTo(textEnd) > 0) continue;
            long relative = address.subtract(textStart);
            if (relative % 4 != 0) throw new IllegalStateException("Misaligned .text relocation output");
            mark(classes, (int) relative, 4, POOL, ".text relocation output");
        }

        for (FunctionEntry function : functions) {
            byte expected = function.mode.equals("arm") ? GAP_ARM : GAP_THUMB;
            long alignment = function.mode.equals("arm") ? 4 : 2;
            if (function.address % alignment != 0 || function.size % alignment != 0) {
                throw new IllegalStateException(function.name + " is misaligned");
            }
            Address cursor = textStart.add(function.address);
            Address end = cursor.add(function.size - 1);
            while (cursor.compareTo(end) <= 0) {
                Instruction instruction = currentProgram.getListing().getInstructionAt(cursor);
                if (instruction == null || instruction.getMaxAddress().compareTo(end) > 0 ||
                    !function.mode.equals(modeAt(tMode, cursor))) {
                    throw new IllegalStateException(function.name + " lacks exact instruction tiling at " + cursor);
                }
                cursor = instruction.getMaxAddress().next();
            }
            for (int offset = (int) function.address; offset < function.address + function.size; offset++) {
                if (classes[offset] != UNKNOWN) {
                    throw new IllegalStateException(function.name + " overlaps non-code evidence at .text+0x" +
                        Integer.toHexString(offset));
                }
            }
            mark(classes, (int) function.address, (int) function.size, FUNCTION, function.name);
        }

        InstructionIterator instructions = currentProgram.getListing().getInstructions(textStart, true);
        while (instructions.hasNext()) {
            Instruction instruction = instructions.next();
            if (instruction.getMinAddress().compareTo(textEnd) > 0) break;
            if (instruction.getMaxAddress().compareTo(textEnd) > 0) {
                throw new IllegalStateException("Instruction crosses the end of .text");
            }
            int start = (int) instruction.getMinAddress().subtract(textStart);
            int size = instruction.getLength();
            boolean owned = true;
            for (int offset = start; offset < start + size; offset++) owned &= classes[offset] == FUNCTION;
            if (owned) continue;
            for (int offset = start; offset < start + size; offset++) {
                if (classes[offset] != UNKNOWN) {
                    throw new IllegalStateException("Instruction overlaps pool or partial function at .text+0x" +
                        Integer.toHexString(offset));
                }
            }
            String mode = modeAt(tMode, instruction.getMinAddress());
            if (mode == null) throw new IllegalStateException("Instruction has ambiguous TMode at " + instruction.getMinAddress());
            mark(classes, start, size, mode.equals("arm") ? GAP_ARM : GAP_THUMB, "unowned instruction");
        }

        // Query by address: defined table data can live in sparse listing ranges and
        // is not reliably returned by the global iterator for relocatable overlays.
        for (int offset = 0; offset < textSize; offset++) {
            if (classes[offset] == UNKNOWN) {
                Data data = currentProgram.getListing().getDefinedDataContaining(textStart.add(offset));
                if (data == null) continue;
                if (data.getMinAddress().compareTo(textStart) < 0 || data.getMaxAddress().compareTo(textEnd) > 0) {
                    throw new IllegalStateException("Defined data crosses a .text boundary");
                }
                int start = (int) data.getMinAddress().subtract(textStart);
                for (int cursor = start; cursor < start + data.getLength(); cursor++) {
                    if (classes[cursor] == FUNCTION || classes[cursor] == GAP_ARM || classes[cursor] == GAP_THUMB) {
                        throw new IllegalStateException("Defined data overlaps code at .text+0x" +
                            Integer.toHexString(cursor));
                    }
                }
                mark(classes, start, data.getLength(), POOL, "defined .text data");
            }
        }
        List<Range> armGaps = coalesce(classes, GAP_ARM, "arm");
        List<Range> thumbGaps = coalesce(classes, GAP_THUMB, "thumb");
        List<Range> gaps = new ArrayList<>();
        gaps.addAll(armGaps); gaps.addAll(thumbGaps);
        gaps.sort(Comparator.comparingLong(range -> range.address));
        List<Range> pools = coalesce(classes, POOL, null);
        List<Range> unknown = coalesce(classes, UNKNOWN, null);

        try (PrintWriter output = new PrintWriter(new File(arguments[1]), StandardCharsets.UTF_8)) {
            output.println("{");
            output.println("  \"format\": 1,");
            output.println("  \"module\": " + json(module) + ",");
            output.println("  \"textSize\": " + textSize + ",");
            output.println("  \"functions\": [");
            for (int index = 0; index < functions.size(); index++) {
                FunctionEntry entry = functions.get(index);
                output.printf("    {\"name\":%s,\"address\":%d,\"size\":%d,\"mode\":%s}%s%n",
                    json(entry.name), entry.address, entry.size, json(entry.mode), index + 1 == functions.size() ? "" : ",");
            }
            output.println("  ],");
            output.println("  \"gaps\": [");
            for (int index = 0; index < gaps.size(); index++) {
                Range range = gaps.get(index);
                output.printf("    {\"address\":%d,\"size\":%d,\"mode\":%s}%s%n",
                    range.address, range.size, json(range.mode), index + 1 == gaps.size() ? "" : ",");
            }
            output.println("  ],");
            output.println("  \"pools\": [");
            for (int index = 0; index < pools.size(); index++) {
                Range range = pools.get(index);
                output.printf("    {\"address\":%d,\"size\":%d}%s%n",
                    range.address, range.size, index + 1 == pools.size() ? "" : ",");
            }
            output.println("  ],");
            output.println("  \"unknown\": [");
            for (int index = 0; index < unknown.size(); index++) {
                Range range = unknown.get(index);
                output.printf("    {\"address\":%d,\"size\":%d}%s%n",
                    range.address, range.size, index + 1 == unknown.size() ? "" : ",");
            }
            output.println("  ]");
            output.println("}");
        }
        println("Exported exact " + unit + " partition: " + functions.size() + " functions, " +
            gaps.size() + " gaps, " + pools.size() + " pools, " + unknown.size() + " unknown ranges");
    }
}
