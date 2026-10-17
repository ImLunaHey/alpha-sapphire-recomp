// License: MIT
// Exports only neutral CRO-relative function-boundary metadata.

import java.io.File;
import java.io.PrintWriter;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import ghidra.app.script.GhidraScript;
import ghidra.program.model.address.Address;
import ghidra.program.model.lang.Register;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.program.model.listing.Instruction;
import ghidra.program.model.mem.MemoryBlock;
import ghidra.program.model.symbol.Reference;
import ghidra.program.model.symbol.ReferenceIterator;

public class ExportCroFunctions extends GhidraScript {
    private static final class Entry {
        long location;
        long size;
        String mode;

        Entry(long location, long size, String mode) {
            this.location = location;
            this.size = size;
            this.mode = mode;
        }
    }

    private static String csv(String value) {
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    private boolean hasCallEvidence(Address entry) {
        if (currentProgram.getSymbolTable().isExternalEntryPoint(entry)) return true;
        ReferenceIterator references = currentProgram.getReferenceManager().getReferencesTo(entry);
        while (references.hasNext()) {
            Reference reference = references.next();
            if (reference.getReferenceType().isCall()) return true;
        }
        return false;
    }

    private boolean hasTerminalInstruction(Function function) {
        Address end = function.getBody().getMaxAddress();
        Instruction instruction = currentProgram.getListing().getInstructionContaining(end);
        return instruction != null && instruction.getMaxAddress().equals(end) && instruction.getFallThrough() == null;
    }

    @Override
    public void run() throws Exception {
        String[] arguments = getScriptArgs();
        if (arguments.length != 2) throw new IllegalArgumentException("Expected output CSV path and cro/DllName unit");
        if (!arguments[1].matches("cro/Dll[A-Za-z0-9_]+")) throw new IllegalArgumentException("Invalid CRO unit name");

        MemoryBlock text = null;
        for (MemoryBlock block : currentProgram.getMemory().getBlocks()) {
            if (".text".equals(block.getName()) && block.isExecute()) {
                if (text != null) throw new IllegalStateException("Multiple executable .text blocks");
                text = block;
            }
        }
        if (text == null || text.getSize() <= 0 || text.getSize() > 0xffffffffL) {
            throw new IllegalStateException("Missing or invalid executable .text block");
        }

        Register tMode = currentProgram.getLanguage().getRegister("TMode");
        if (tMode == null) throw new IllegalStateException("ARM TMode context register is unavailable");
        Address textStart = text.getStart();
        Address textEnd = text.getEnd();
        List<Entry> accepted = new ArrayList<>();
        int rejected = 0;
        FunctionIterator functions = currentProgram.getFunctionManager().getFunctions(true);
        for (Function function : functions) {
            Address entry = function.getEntryPoint();
            if (entry.compareTo(textStart) < 0 || entry.compareTo(textEnd) > 0) continue;
            BigInteger value = currentProgram.getProgramContext().getValue(tMode, entry, false);
            if (value == null || (!BigInteger.ZERO.equals(value) && !BigInteger.ONE.equals(value)) ||
                function.getBody().getNumAddressRanges() != 1 ||
                !function.getBody().getMinAddress().equals(entry) ||
                function.getBody().getMaxAddress().compareTo(textEnd) > 0 ||
                !hasCallEvidence(entry) || !hasTerminalInstruction(function)) {
                rejected++;
                continue;
            }
            String mode = BigInteger.ONE.equals(value) ? "$t" : "$a";
            long location = entry.subtract(textStart);
            long size = function.getBody().getMaxAddress().subtract(entry) + 1;
            long alignment = "$a".equals(mode) ? 4 : 2;
            if (location < 0 || size <= 0 || location % alignment != 0 || size % alignment != 0 ||
                location + size > text.getSize()) {
                rejected++;
                continue;
            }
            accepted.add(new Entry(location, size, mode));
        }
        accepted.sort(Comparator.comparingLong(entry -> entry.location));
        for (int index = 1; index < accepted.size(); index++) {
            Entry previous = accepted.get(index - 1);
            Entry current = accepted.get(index);
            if (previous.location + previous.size > current.location) {
                throw new IllegalStateException("Accepted function bodies overlap");
            }
        }
        if (accepted.isEmpty()) throw new IllegalStateException("No conservative CRO functions were accepted");

        try (PrintWriter output = new PrintWriter(new File(arguments[0]), StandardCharsets.UTF_8)) {
            output.print("# Format,CRO_FUNCTIONS_V1\n");
            output.print("# Module," + arguments[1] + "\n");
            output.printf("# TextSize,%08X\n", text.getSize());
            output.print("Location,Name,Namespace,Mode,Size,Segment\n");
            for (Entry entry : accepted) {
                String name = String.format("func_%08X", entry.location);
                output.printf("%08X,%s,%s,%s,%08X,%s\n",
                    entry.location, csv(name), csv("Global"), entry.mode, entry.size, csv(".text"));
            }
        }
        println("Exported " + accepted.size() + " conservative " + arguments[1] +
            " function boundaries; rejected " + rejected + " ambiguous bodies");
    }
}
