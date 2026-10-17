# DllBattle leaf accessors 01

This batch covers 45 reviewed ARM leaves in `cro/DllBattle`, totaling 708 code
bytes. Their clean-room contracts are short, call-free operations: field and
pointer-chain reads, fixed field writes, boolean and range predicates, bit
extraction or mutation, bounded indexed selection, small address calculations,
and fixed value construction.

Each leaf returns directly and owns one accepted public function section; the
batch has no undefined symbols, relocations, literal pools, stack operations,
or foreign allocated payload. Validation pins each neutral identity, boundary,
semantic schedule, and the 45-function/708-byte aggregate. The rest of the
module's code and all data remain unmatched, and DllBattle remains incomplete.
