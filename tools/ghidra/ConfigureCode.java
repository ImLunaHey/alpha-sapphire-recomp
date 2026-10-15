// License: MIT
// Original project script: configures a raw 3DS code.bin for analysis.

import java.math.BigInteger;

import ghidra.app.script.GhidraScript;
import ghidra.program.model.address.Address;
import ghidra.program.model.lang.Register;
import ghidra.program.model.mem.Memory;
import ghidra.program.model.mem.MemoryBlock;

public class ConfigureCode extends GhidraScript {
    private static final long TEXT_START = 0x00100000L;
    private static final long TEXT_END = 0x005795FBL;
    private static final long RODATA_START = 0x0057A000L;
    private static final long RODATA_END = 0x005EBA13L;
    private static final long DATA_START = 0x005EC000L;
    private static final long DATA_END = 0x0062F9F3L;

    @Override
    public void run() throws Exception {
        Memory memory = currentProgram.getMemory();
        Address textStart = toAddr(TEXT_START);
        Address textPaddingStart = toAddr(TEXT_END + 1);
        Address rodataStart = toAddr(RODATA_START);
        Address rodataPaddingStart = toAddr(RODATA_END + 1);
        Address dataStart = toAddr(DATA_START);
        Address dataPaddingStart = toAddr(DATA_END + 1);

        MemoryBlock text = memory.getBlock(textStart);
        if (text == null) {
            throw new IllegalStateException("No imported block at the text address");
        }

        memory.split(text, textPaddingStart);
        MemoryBlock textPadding = memory.getBlock(textPaddingStart);
        memory.split(textPadding, rodataStart);
        MemoryBlock rodata = memory.getBlock(rodataStart);
        memory.split(rodata, rodataPaddingStart);
        MemoryBlock rodataPadding = memory.getBlock(rodataPaddingStart);
        memory.split(rodataPadding, dataStart);
        MemoryBlock data = memory.getBlock(dataStart);
        memory.split(data, dataPaddingStart);
        MemoryBlock dataPadding = memory.getBlock(dataPaddingStart);
        text.setName(".text");
        textPadding.setName(".text_padding");
        rodata.setName(".rodata");
        rodataPadding.setName(".rodata_padding");
        data.setName(".data");
        dataPadding.setName(".data_padding");
        text.setRead(true);
        text.setWrite(false);
        text.setExecute(true);
        textPadding.setRead(true);
        textPadding.setWrite(false);
        textPadding.setExecute(false);
        rodata.setRead(true);
        rodata.setWrite(false);
        rodata.setExecute(false);
        rodataPadding.setRead(true);
        rodataPadding.setWrite(false);
        rodataPadding.setExecute(false);
        data.setRead(true);
        data.setWrite(true);
        data.setExecute(false);
        dataPadding.setRead(true);
        dataPadding.setWrite(false);
        dataPadding.setExecute(false);

        Register tMode = currentProgram.getLanguage().getRegister("TMode");
        if (tMode != null) {
            currentProgram.getProgramContext().setValue(
                tMode, textStart, textStart.add(3), BigInteger.ZERO);
        }
        createLabel(textStart, "entry", true);
        currentProgram.getSymbolTable().addExternalEntryPoint(textStart);
        disassemble(textStart);
    }
}
