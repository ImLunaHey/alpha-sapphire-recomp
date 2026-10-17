# ARM duplicate templates 83

This batch covers 28 independently specified ARM accessors totaling 1,288
executable bytes. A private-target analyst produced only the neutral contract
recorded in `config/arm-duplicate-templates-83.json`: function boundaries,
three semantic template classes, field offsets, accessor identities, and
symbolic transfer relationships. A separate implementation agent, without
access to the ROM, target object, target disassembly, or private report,
authored `src/main/arm_duplicate_templates_83.S` from that contract.

The three reusable behaviors are:

- fourteen byte-field setters that enter and leave the shared access context;
- seven byte-field getters using the primary accessor; and
- seven nested byte-field getters beginning from the pointer at offset 12.

The public validator pins 28 function boundaries, 322 ARM instructions, 70
`R_ARM_CALL` relocations, 14 `R_ARM_JUMP24` relocations, template membership,
field values, symbolic destinations, source ownership, and the 1,288-byte
aggregate. Standalone validation and comparison with the ignored authoritative
target both pass exactly; no target bytes or private artifacts are tracked.
