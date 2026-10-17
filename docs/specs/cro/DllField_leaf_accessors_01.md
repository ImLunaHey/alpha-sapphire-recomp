# DllField leaf accessors 01

This batch covers 21 reviewed ARM leaves in `cro/DllField`, totaling 344 code
bytes and 86 instructions. Their clean-room contracts are short, call-free
field operations: direct or chained reads, conditional pointer selection,
boolean and equality tests, byte or halfword extraction, state updates, and
small result-record writes.

Each leaf returns directly and owns one accepted public function section; the
batch has no undefined symbols, relocations, literal pools, stack operations,
or foreign allocated payload. Validation pins each neutral identity, boundary,
semantic schedule, and the exact aggregate. The rest of the module's code and
all data remain unmatched, and DllField remains incomplete.
