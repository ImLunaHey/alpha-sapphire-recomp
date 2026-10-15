// License: MIT
// Original project script: exports neutral function-boundary metadata only.

import java.io.File;
import java.io.PrintWriter;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;

import ghidra.app.script.GhidraScript;
import ghidra.program.model.address.Address;
import ghidra.program.model.lang.Register;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.program.model.listing.Instruction;
import ghidra.program.model.symbol.Reference;
import ghidra.program.model.symbol.ReferenceIterator;

public class ExportFunctions extends GhidraScript {
    private static final long TEXT_START = 0x00100000L;
    private static final long TEXT_END = 0x005795FBL;

    private static String csv(String value) {
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    private boolean hasCallEvidence(Address entry) {
        if (currentProgram.getSymbolTable().isExternalEntryPoint(entry)) {
            return true;
        }
        ReferenceIterator references = currentProgram.getReferenceManager().getReferencesTo(entry);
        while (references.hasNext()) {
            Reference reference = references.next();
            if (reference.getReferenceType().isCall()) {
                return true;
            }
        }
        return false;
    }

    private boolean hasTerminalInstruction(Function function) {
        Address end = function.getBody().getMaxAddress();
        Instruction instruction = currentProgram.getListing().getInstructionContaining(end);
        return instruction != null &&
            instruction.getMaxAddress().equals(end) &&
            instruction.getFallThrough() == null;
    }

    @Override
    public void run() throws Exception {
        String[] arguments = getScriptArgs();
        if (arguments.length != 1) {
            throw new IllegalArgumentException("Expected output CSV path");
        }

        Register tMode = currentProgram.getLanguage().getRegister("TMode");
        if (tMode == null) {
            throw new IllegalStateException("ARM TMode context register is unavailable");
        }
        int count = 0;
        int rejected = 0;
        try (PrintWriter output = new PrintWriter(new File(arguments[0]), StandardCharsets.UTF_8)) {
            output.println("Location,Name,Namespace,Mode,Size,Segment");
            FunctionIterator functions = currentProgram.getFunctionManager().getFunctions(true);
            for (Function function : functions) {
                Address entry = function.getEntryPoint();
                long address = entry.getOffset();
                if (address < TEXT_START || address > TEXT_END) {
                    continue;
                }

                BigInteger value = currentProgram.getProgramContext().getValue(tMode, entry, false);
                if (value == null ||
                    (!BigInteger.ZERO.equals(value) && !BigInteger.ONE.equals(value)) ||
                    function.getBody().getNumAddressRanges() != 1 ||
                    !function.getBody().getMinAddress().equals(entry) ||
                    function.getBody().getMaxAddress().getOffset() > TEXT_END ||
                    !hasCallEvidence(entry) ||
                    !hasTerminalInstruction(function)) {
                    rejected++;
                    continue;
                }
                String mode = BigInteger.ONE.equals(value) ? "$t" : "$a";
                long size = function.getBody().getMaxAddress().subtract(entry) + 1;
                long alignment = "$a".equals(mode) ? 4 : 2;
                if (size % alignment != 0) {
                    rejected++;
                    continue;
                }
                String name = String.format("func_%08X", address);
                output.printf("%08X,%s,%s,%s,%08X,%s%n",
                    address,
                    csv(name),
                    csv(function.getParentNamespace().getName()),
                    mode,
                    size,
                    csv(".text"));
                count++;
            }
        }
        println("Exported " + count + " conservative function boundaries to " + arguments[0] +
            "; rejected " + rejected + " ambiguous bodies");
    }
}
