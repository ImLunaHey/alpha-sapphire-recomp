#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = path.join(ROOT, 'config/thumb-leaf-helpers-11.json');
const SOURCE = path.join(ROOT, 'src/main/thumb_leaf_helpers_11.S');
const LIMIT = Object.freeze({ file: 64 * 1024 * 1024, executable: 16 * 1024 * 1024, sections: 16384, symbols: 1000000, relocations: 1000000 });
// Canonical non-call bytes assembled from the neutral schedules; call words are zeroed.
const EXPECTED_BODIES = Object.freeze({"func_0010115A":"/7WFsAAgFAAAkFBoAZCWaAAgApADkJFpBQAGmIhHBwAQmQiYCEMF0AngoWkGmG0ciEcHACFqOACIRwAo9dF4HAPQAZjABwTQHeAAIMBDCbDwvSBoAR0hYABoAJAT4AGYwAcK0TkEAJgJDAKqAAAAAEEcMtAAmQgYAJChaXYeBphtHIhHBwAALhTdeBwS0AiYACgH0A+aDpk7AAAAAAAAKN3RB+AQmAAo2dEhajgAiEcAKNTQ4WkGmIhHAZgQmcAHwA8IQwHRAJkIcKBosEIE3RCYACgE0AAuAtABIMBDtucoALTn","func_00301E0C":"+LUEAEdpwGgNABYAgAcw0DgAAAAAAAAoK9EyABAmACol0AEqAtACKiPRBOAgAAAAAABFGRvgOAAAAAAA4WgxQwAo4WAE2iAAAAAAAAEg+L3JAwvVYmjhapFCANgRAKJpiRgiaYkagUIA3QgALRgALQHaAiD4veFqYGjiaIFCBtKRA+BiA9UBIUkEikMyQ6ZprkIR3OFqgUIB2QsAAOADAJ8ZI2n/Gq9CBt2BQgHZDwAA4AcAn0IG0SAgAkMAIKBgpWIgYA3grRvmaa4bgUKmYADZCADAGigaIGBYGWBgICCCQwNIAkAAIOJgQDQgcfi9","func_003034CC":"/7WBsAYAHQAAaEFpKUIB0AAkBuABaTpIKUIB0MRoAOCEaAAsEtACmAdo4Gi4QgfYACAAkCAAeRwIMGpGAAAAAKBouQBAGAdoAC9Q0QOYACgC0QQgAAAAAAAsEtACmAdo4Gi4QgfYACAAkCAAeRwIMGpGAAAAAKBouQBAGAdoAC810TJoACNQaR6hKEIQ0AIjECEAIC8AD0IE0BFogAAIGAFoCeBAHEkABijz0xWhA+AQaShCANABIwAiGAAKm5hHBwAALBPQMGigQhDQIQBoRgAAAAACmjkAaEYAAAAAACAAkOBpQB7gYWhGAAAAAAKaOQAwAAAAAAA4AAWw8L0=","func_00101040":"/7WHsAAnFABQaD4AAZCQaAKXA5cElwCQkWkImIhHBQAQmQqYCEMF0AngoWkImHYciEcFACFqKACIRwAo9dFoHAPQAZjABwTQK+AAIMBDC7DwvSBoAR0hYAdoIuApBgOqCQ4FqAAAAABBHAfQgBwJ0AAgApABmMAHB9AK4OFpCJiIR0XgASACkAbgaEaAijiAvxwAmEAeAJChaQiYdhyIRwUAAJgAKBzdaBwa0AqYACgP0OgXwA5AGUERQAmKAAqZQAFRGCoaCWgBIJBAAULF0QfgEJgAKMHRIWooAIhHACi80OFpCJiIRwKYACgQ0QGYEJnAB8APCEMA0TiAoWgAmIFCBd0QmAAoBdAAmAAoAtABIMBDm+cwAJnn","func_00303954":"+LUEACAgYGAAIONgR0ugYCNgYWEAKSJ2AtFFSWFhIHYAJf8mKgYSDhAhIAAAAAAAACgJ0QvgMgYSDhAhIAAAAAAAACgG0XYerkL02ALgbRy1QufTcBsmYkAc5WEAAAAABwDgYhzgKABhOBkoFNgqBhIOECEgAAAAAAAAKAzQKAAgOAIGAJASDgghIAAAAAAAACgB0ACYAOAoADhwfxxtHLVC4NkAJf8mKgYSDgghIAAAAAAAACgJ0QvgMgYSDgghIAAAAAAAACgG0XYerkL02ALgbRy1QufTcBumYkAcZWIAAAAABwAgYxzgKABBOBkoFNgqBhIOCCEgAAAAAAAAKAzQKAAgMAIGAJASDhAhIAAAAAAAACgB0ACYAOAoADhwfxxtHLVC4NkgAPi9","func_00103F08":"/rUVAAYADAAIAAAAAAABACsAACIwAAAAAABHSQFgBgBAaUZJiEJ60AEgMHYCIiEAaEYAAAAAACT/JSIGEg4QITAAAAAAAAAoCdEL4CoGEg4QITAAAAAAAAAoBtFtHqVC9NgC4GQcrELn0zVi9GH3ahzgIABhOBkoFNgiBhIOECEwAAAAAAAAKAzQIAAgOAIGApASDgghMAAAAAAAACgB0AKYAOAgADhwfxxkHKxC4NkAJP8lIgYSDgghMAAAAAAAACgJ0QvgKgYSDgghMAAAAAAAACgG0W0epUL02ALgZBysQufTtWJ0YjdrHeAgAEE4GSgV2CIGEg4IITAAAAAAAAAoDdAgACAwAgYCkBIOECEwAAAAAAAAKALQApgB4AjgIAA4cH8cZBysQt/ZaEYAAAAAMAD+vQ==","func_00100CD0":"/7UAJRwA7UODsAAgAJABkJ9oXmihaQSYbRyIRwKQIWqIRwAo9tECmEAcDNADIEAChkMALxndcAYU1QKYKygJ0C0oD9ED4AAgwEMHsPC9ASCAAgZDoWkEmG0ciEd/HgAvApAC3QKYMCgD0AWYACgl0DzgASChaUACBkN/HgSYbRyIRwAvApAD3XgoBdBYKAPQBZgAKBDQKeAFmAAoAdAQKCTRASChaUAChkN/HgSYbRyIRwKQECAC4AggAOAKIAWQFOAFmgEgAZlAAgZDAJh/HtMXAAAAAAKa0xeAGFlBAZEAkKFpBJhtHIhHApAALwbdBZkCmAAAAAAAKAKQ4drhaQSYiEewBQLUASDAQ53n8AcP0XAGD9UAmXAFBNUBmAAiSUKCQQDgAZogaAMdI2AAaAbAKACJ5yBoAR0hYABoAZoAmfXn","func_001007BC":"/7WLsFFOMGgAKGvRUKAAIAC/BQAB0TUADDUoADohAAAAAAAoDtAAIUhKAXBAHBIdSqEAAAAAASgC0XBoACgB3AEgcGBGSRQgBZEIAAC/BwAe0AEhSQJBYAAhgWDBYEFJOAAQMDlgBpA8AAmoAL8AvwIAPaEEqAAAAAABAAaYAAAAAAQAEDwEqAAAAAA3SCBgM0wIqAC/AL8CACkAAagAAAAABwBoRgAAAAACACBoOQDDaCAAmEewYACcACwO0OBpQB7gYQrRoGkAAAAAoGgAAAAAIAAAAAAAAAAAAAGoAAAAADVgtGhgHCjQAqgEkHdoG00NngeoAL8AvwIAFqEDqAAAAAAAlgGQKGg7AAZpIgAEmCkAsEcDqAAAAAACmhAADDiAaAAoC9AOmwyZC5gAAAAABAACqAAAAAAgAA+w8L0CqAAAAAAAIPjn","func_00100E14":"/7UAJx0A/0ODsFxoACABkJ5oqWkEmH8ciEcAkClqiEcAKPbRAJhAHAzQAyBAAoRDAC4Z3WAGFNUAmCsoCdAtKA/RA+AAIMBDB7DwvQEggAIEQ6lpBJh/HIhHdh4ALgCQAt0AmDAoA9AFmAAoJdA14AEgqWlAAgRDdh4EmH8ciEcALgCQA914KAXQWCgD0AWYACgQ0CLgBZgAKAHQECgd0QEgqWlAAoRDdh4EmH8ciEcAkBAgAuAIIADgCiAFkA3gASEFmkkCDEMBmXYeUUMIGAGQqWkEmH8ciEcAkAAuBd0FmQCYAAAAAAAo6drpaQSYiEegBQLUASDAQ6Xn4Aci0WAGEdVgBQGYANVAQiloCh0qYAloIgUB1QhwFOAiBwHVCIAQ4AhgDuAoaAEdKWAAaCEFAtUBmQFwBeAhBwGZAdUBgADgAWA4AH7n","func_00102590":"/7WFsAwABQAAaA6eDDiAaKBCAtMPmbFCD9mwQgHZAQAA4DEAoEIB0iMAAOAPmwCRCSBQok+hAAAAAChoB5kMOIBoBxu5QgDSDwAPmXYaEJmxQgDSDgDDGw4gwEOAG4NCBdkAkAggQ6JCoQAAAAAoaAEADDmORolojEbJG48ZVNAJGwKRB5pxRgloohgDkgibD5pJHJoYASkEkgvYcUZJaLlCB9MAK0bQmEJE2GFGQhiaQkDZYEZBCAkYwgiJGIAwiEIA2QEAAJEAmmlGukIBqAGXANMIAAFoOgAoAAAAAAAHAAAsBdA4ACloDDAiAAAAAAAALgbQOAAMMASZABkyAAAAAAACmAAoCdAqaAOZOAAMMAAZURgCmoAZAAAAACgAAAAAAAw3L2Ag4CgAAAAAABFIKGAa4AKZACkG0AOZohlBGIAYApoAAAAAAC4F0ChoBJkAGTIAAAAAAChoakYMOIdgKGg5GAAgEHAIcChoCbAAGfC9","func_0030291C":"+LUFAMhoDAAFIckEiEMBIYkFCEPgYIAGAtUgAAAAAABySeBoAUACKQPQIAAAAAAAv+AFIQEiSQMBQNIDkUIP0cADBtVhaOBqiEIA2AgAYGAG4CBp4GJgYGBpAAAAAKBhoWguBgAiNg4AKQ7a4GiDBQvUyUOhYAkhImBJAwhD4GBgaEEcYWAGcK7g4GgBIUkDCEPgYAAgIGAgaQAoM9FgaQAAAAAlACQ1AScAKBfQ4GiABYAPCtDgaQAAAAAAKCBhBNDhaPgCAUPhYBrg52ElYeBoAyEJAohDASGJAg/g4GkAAAAAACggYfDQ4GgBIckCCEPgYIEFiQ8D0f8hATEIQ+BgIGlgYOJoOU8ladAFH9VhaOBqiEIA2AgAQRsF0CIAKAAAAAAAAChD0eBoAQIE1eViACBlYKBgU+BpHOFiYWDhaThDSR6hYOBgMAAucPi9EAIB1TpACeBgaEEcYWAGcOBoOEMKLuBgBtAAIuFqYGiBQgPZCwAC4AEi9+cDAOdoWxt/BQTU52mfQgHdACoe0IFCANgBAA8aACDlYmVgACugYAndIgAZACgAAAAAAAAoAtAAIMBD+L0ALwjQoGnlYmVgwBugYeBoECEIQ+Bg4GgAAgnVYWigaeViSRtAGGVgoGEBIMBD+L0wAPi9","func_0010145C":"/7UGAIuwCHj/KAXQSRwtKATQACMAIAjgACAO4AEj+ecAmgokSRxiQ4AYAJAIeP8o9tEAKwLQAJhAQgCQACUDlQ2YLAAAeC0oAdArKBbRDZlJHC0oDZEC0AAgA5AO4AEg++dAHAAiAZINkCgAIQAKIgAjAAAAAAGcPRhMQQ2YB3j/L+7RACEIAAAAAAADmQApAtCBAEAYQAgAAoAPASgEkALdACDAQwSQDpkAmEcYKAAgQwbRA5jAB3BgACAwYA+w8L36SIdCBdoDmMAHcGAAIDBgDeD/IPUwh0IO3fRIeEQBaEBoMWBwYAOZyQcIQ3BgAAAAAAIhAWDh5zkeAtoEmEJCAOAEmgApANp5QgioAAAAAAioBasHyAfD5kgAkAAgAQAhQwTR40ksAAUAIDkAkSEMCQQBQwbRKQwkBAxDAJktBBA5AJEhDgkGAUMG0SkOJAIMQwCZLQIIOQCRIQ8JBwFDBtEpDyQBDEMAmS0BCR8AkaEPiQcBQwbRqQ+kAAxDAJmtAIkeAJHhD8kHCEME0QCYbRlkQUAeAJBoRgSaAC8FqQKVAZQC3QAAAAAB4AAAAAAEAAOYDQAAKALQASDAB0RAvU9gAEAIKEMD0GAAQA24QhHRAAAAAAIhAWBgAEANuEIJ0bVIeEQBaEBoMWDhD8kHCENwYGLnNWB0YF/n","func_00102B04":"/7UMAMOwFgABIUGRIJQAkGpGQZhBHkGRgQAJH4AAVVgAHyCpCFhCkEAQQplwQywYyQcA0YAbRponGCEAKACQRwAoDt0wAAEAKUOJB2TQIngpeCpwIXBtHGQcQB730a0bpBtGmjkAIACQRwAoI91GmjkAKACQRwAoDt0wAAEAKUOJB1DQOngpeCpwOXBtHH8cQB730a0bvxswAAEAIUOJB0jQOngheCJwOXBkHH8cQB730aQbvxsxAAoAIkO4G5IHP9ADeCJ4I3ACcGQcQBxJHvfRhxssAECXRpqkGUCZIACQRwAo+NtGmr8bQJk4AJBHACj43KdCMtkwAAEAIUOJBybQOngheCJwOXBkHH8cQB730aQbvxvf5yJoKWgAHwTFAsT50ZvnOmgpaAAfBMUCx/nRr+c6aCFoAB8ExALH+dG35wNoImgJHwjEBMD50cDnOmghaAAfBMQCx/nR2ecwAAEAIUOJByLQQJoheBJ4InBAmmQcEXBAmUkcQB5AkfPRpBtgGzEAAAAAAEKZQB4JGkkeiEIb3QopFd1rRkGakgCdUCCrmFBBmEAcQZAd4ECaIWgSaATEQJoRYECZCR0AH0CR9NHc5wooE91CkCznCigJ3WtGQZqSAJxQIKuZUEGZSRxBkfHnCikD3UKRQpglABrnQZgAKADQCudHsPC9"});
const fail = message => { throw new Error(message); };
const check = (condition, message) => { if (!condition) fail(message); };
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const readBounded = (name, limit = LIMIT.file) => {
  const st = fs.statSync(name);
  check(st.isFile(), `${name}: not a regular file`);
  check(st.size <= limit, `${name}: exceeds ${limit}-byte file cap`);
  return fs.readFileSync(name);
};

function records(config) {
  const instruction = [], local = [], returns = [], indirect = [], tails = [], direct = [];
  for (const f of config.functions) {
    let offset = 0;
    const wide = new Set(f.wideInstructionOffsets);
    for (const entry of f.schedule.split('|')) {
      const split = entry.indexOf(' ');
      const mnemonic = split < 0 ? entry : entry.slice(0, split);
      const operands = split < 0 ? '' : entry.slice(split + 1);
      instruction.push(`${f.name}:${offset.toString(16)}:${mnemonic}:${operands}`);
      offset += wide.has(offset) ? 4 : 2;
    }
    check(offset === f.size, `${f.name}: schedule width mismatch`);
    for (const x of f.localTransfers) local.push(`${f.name}:${x.replace(/:(\+)/, ':local:$1')}`);
    for (const x of f.returns) returns.push(`${f.name}:${x}`);
    for (const x of f.indirectCalls) indirect.push(`${f.name}:${x}`);
    for (const x of f.indirectTails) tails.push(`${f.name}:${x}`);
    for (const x of f.directCalls) direct.push(`${f.name}:${x.offset.toString(16)}:${x.mnemonic}:${x.symbol}:${x.targetMode}:${x.relocation}`);
  }
  return { instruction, local, returns, indirect, tails, direct };
}

function validateConfig(c) {
  const names = c.functions.map(f => f.name);
  check(c.schemaVersion === 1 && c.mode === 'thumb' && c.minimumAlignment === 2, 'configuration header mismatch');
  check(names.length === 13 && new Set(names).size === 13, 'expected exactly 13 unique functions');
  check(c.duplicateBodyClasses.length === 0, 'duplicate body inventory must be empty');
  check(c.pcRelativeDataAccesses.length === 32, 'expected 32 PC-relative accesses');
  const sum = key => c.functions.reduce((n, f) => n + f[key], 0);
  const expected = { size:4482, instructionCount:2159, localBranchCount:364, memoryOperationCount:629, returnCount:18, indirectCallCount:35, indirectTailCount:0, directCallCount:82 };
  for (const [key, value] of Object.entries(expected)) check(sum(key) === value, `${key} aggregate mismatch`);
  check(c.totalBodySize === 4482 && c.totalAdjacentSize === 0 && c.expectedInstructionCount === 2159 && c.wideInstructionCount === 82, 'top-level totals mismatch');
  check(c.localBranchCount === 364 && c.memoryOperationCount === 629 && c.returnCount === 18 && c.indirectCallCount === 35 && c.indirectTailCount === 0 && c.directCallCount === 82, 'top-level control totals mismatch');
  check(c.directCalls.length === 82 && c.relocations.length === 82, 'call/relocation inventory mismatch');
  const r = records(c);
  const hashKeys = { instruction:'instructionSchedule', local:'localTransferSchedule', returns:'returnTransferSchedule', indirect:'indirectCallSchedule', tails:'indirectTailSchedule', direct:'directCallSchedule' };
  for (const [key, configKey] of Object.entries(hashKeys)) check(sha256(r[key].join('\n')) === c.canonicalHashes[configKey], `${configKey} hash mismatch`);
  const flatten = c.functions.flatMap(f => f.directCalls.map(x => ({ function:f.name, ...x })));
  check(JSON.stringify(flatten) === JSON.stringify(c.directCalls), 'top-level direct calls differ from per-function calls');
  const relocProjection=c.directCalls.map(x=>({function:x.function,offset:x.offset,type:x.relocation,symbol:x.symbol}));
  check(JSON.stringify(c.relocations) === JSON.stringify(relocProjection), 'relocation inventory differs from direct calls');
  const pcs = new Map(c.pcRelativeDataAccesses.map(x => [`${x.function}:${x.offset}`, x]));
  check(pcs.size === 32, 'duplicate PC-relative record');
  for (const x of c.pcRelativeDataAccesses) {
    const f = c.functions.find(y => y.name === x.function);
    check(f && x.offset < f.size && x.targetOffset >= f.size && x.targetOffset < f.nextGlobalOffset, `${x.function}: invalid unowned PC target`);
    check(x.requiredEntryModulo4 === 0 && x.ownership === 'unowned-post-body', `${x.function}: invalid PC ownership contract`);
  }
  check(/^[0-9a-f]{64}$/.test(c.sourceSha256), 'sourceSha256 must be lowercase SHA-256');
  return names;
}

function renderSource(c) {
  let out = '/* Clean-room implementation generated solely from thumb-leaf-helpers-11.json. */\n.syntax unified\n.thumb\n';
  for (const f of c.functions) {
    let off = 0;
    const labels = new Set(f.localTransfers.map(x => parseInt(x.split(':')[2].slice(1), 16)));
    const wide = new Set(f.wideInstructionOffsets);
    const pcAccesses = new Map(c.pcRelativeDataAccesses.filter(x => x.function === f.name).map(x => [x.offset, x]));
    out += `\n.section .text.${f.name}, "ax", %progbits\n.balign 2\n.global ${f.name}\n.type ${f.name}, %function\n.thumb_func\n${f.name}:\n`;
    for (const entry of f.schedule.split('|')) {
      if (labels.has(off)) out += `.L_${f.name}_${off.toString(16)}:\n`;
      const normalized = entry.replace(/local:\+([0-9a-f]+)/, (_, h) => `.L_${f.name}_${h}`);
      const m = normalized.match(/^(adds|subs) (r(?:[0-7]|1[0-5])), (r(?:[0-7]|1[0-5])), #(\d+)$/);
      const pc = pcAccesses.get(off);
      if (pc) {
        const register = +(normalized.match(/^(?:ldr|add) r([0-7]),/)?.[1] ?? fail(`cannot encode ${normalized}`));
        const imm = (pc.targetOffset - ((off + 4) & ~3)) / 4;
        check(Number.isInteger(imm) && imm >= 0 && imm <= 255, `cannot encode ${normalized}`);
        const code = (pc.mnemonic === 'ldr' ? 0x4800 : 0xa000) | register << 8 | imm;
        out += `  .inst.n 0x${code.toString(16).padStart(4, '0')} @ ${normalized}\n`;
      } else if (normalized === 'nop @ (mov r8, r8)') {
        out += `  .inst.n 0xbf00 @ ${normalized}\n`;
      } else if (m) {
        const rd = +m[2].slice(1), rn = +m[3].slice(1), imm = +m[4];
        check(rd < 8 && rn < 8 && imm < 8, `cannot encode ${normalized}`);
        const code = (m[1] === 'adds' ? 0x1c00 : 0x1e00) | imm << 6 | rn << 3 | rd;
        out += `  .inst.n 0x${code.toString(16).padStart(4, '0')} @ ${normalized}\n`;
      } else out += `  ${normalized}\n`;
      off += wide.has(off) ? 4 : 2;
    }
    out += `.size ${f.name}, .-${f.name}\n`;
  }
  return out;
}

function validateSource(c) {
  const source = readBounded(SOURCE);
  check(sha256(source) === c.sourceSha256, 'source SHA-256 mismatch');
  check(source.equals(Buffer.from(renderSource(c))), 'source does not exactly implement the neutral schedule');
}

function parseElf(buf) {
  check(buf.length <= LIMIT.file, 'ELF exceeds file cap');
  check(buf.length >= 52 && buf[0] === 0x7f && buf.toString('ascii', 1, 4) === 'ELF', 'not an ELF file');
  const cls = buf[4], data = buf[5];
  check(cls === 1, 'only ELF32 objects are accepted');
  check(data === 1 || data === 2, 'invalid ELF byte order');
  const le = data === 1;
  const u16 = o => le ? buf.readUInt16LE(o) : buf.readUInt16BE(o);
  const u32 = o => le ? buf.readUInt32LE(o) : buf.readUInt32BE(o);
  const machine = u16(18), shoff = u32(32), shentsize = u16(46), rawCount = u16(48), rawNames = u16(50);
  check(machine === 40, 'ELF is not ARM');
  check(shentsize >= 40 && shoff + shentsize <= buf.length, 'invalid section table');
  let count = rawCount;
  if (count === 0) count = u32(shoff + 20);
  check(count > 0 && count <= LIMIT.sections, `section count exceeds ${LIMIT.sections}`);
  check(shoff + count * shentsize <= buf.length, 'truncated section table');
  let shstrndx = rawNames;
  if (shstrndx === 0xffff) shstrndx = u32(shoff + 24);
  check(shstrndx < count, 'invalid section-name table');
  const sections = [];
  for (let i=0; i<count; i++) {
    const o = shoff + i * shentsize;
    sections.push({ index:i, nameOff:u32(o), type:u32(o+4), flags:u32(o+8), addr:u32(o+12), offset:u32(o+16), size:u32(o+20), link:u32(o+24), info:u32(o+28), align:u32(o+32), entsize:u32(o+36) });
  }
  for (const s of sections) if (s.type !== 8) check(s.offset + s.size <= buf.length, `section ${s.index} out of file`);
  const shstr = sections[shstrndx];
  const cstring = (section, off) => {
    check(off < section.size || (off === 0 && section.size === 0), 'string offset out of range');
    let end = off;
    while (end < section.size && buf[section.offset + end] !== 0) end++;
    check(end < section.size, 'unterminated ELF string');
    return buf.toString('utf8', section.offset + off, section.offset + end);
  };
  for (const s of sections) s.name = cstring(shstr, s.nameOff);
  const executable = sections.reduce((n,s) => n + ((s.flags & 4) ? s.size : 0), 0);
  check(executable <= LIMIT.executable, `executable payload exceeds ${LIMIT.executable}`);
  const symbols = []; let symbolCount = 0;
  for (const tab of sections.filter(s => s.type === 2 || s.type === 11)) {
    check(tab.entsize >= 16 && tab.size % tab.entsize === 0 && tab.link < count, 'invalid symbol table');
    const n = tab.size / tab.entsize; symbolCount += n;
    check(symbolCount <= LIMIT.symbols, `symbol count exceeds ${LIMIT.symbols}`);
    const strings = sections[tab.link];
    for (let i=0; i<n; i++) {
      const o=tab.offset+i*tab.entsize, info=buf[o+12], shndx=le?buf.readUInt16LE(o+14):buf.readUInt16BE(o+14);
      symbols.push({ table:tab.index, index:i, name:cstring(strings,u32(o)), value:u32(o+4), size:u32(o+8), bind:info>>4, type:info&15, shndx });
    }
  }
  const byTable = new Map(); for (const x of symbols) { if (!byTable.has(x.table)) byTable.set(x.table, []); byTable.get(x.table)[x.index]=x; }
  const relocations = []; let relocationCount=0;
  for (const rel of sections.filter(s => s.type === 9 || s.type === 4)) {
    const minimum = rel.type === 9 ? 8 : 12;
    check(rel.entsize >= minimum && rel.size % rel.entsize === 0 && rel.link < count && rel.info < count, 'invalid relocation section');
    const n=rel.size/rel.entsize; relocationCount += n;
    check(relocationCount <= LIMIT.relocations, `relocation count exceeds ${LIMIT.relocations}`);
    const table=byTable.get(rel.link); check(table, 'relocation has no symbol table');
    for(let i=0;i<n;i++){const o=rel.offset+i*rel.entsize, info=u32(o+4), symbol=table[info>>>8];check(symbol,'bad relocation symbol');relocations.push({ target:rel.info, offset:u32(o), type:info&255, symbol });}
  }
  return { buf, le, sections, symbols, relocations, sectionCount:count, symbolCount, relocationCount, executable };
}

function validatePcEncoding(elf, section, x) {
  const body = elf.buf.subarray(section.offset, section.offset + section.size);
  check(x.offset + 2 <= body.length, `${x.function}: PC instruction outside body`);
  const hw = elf.le ? body.readUInt16LE(x.offset) : body.readUInt16BE(x.offset);
  const base = (x.offset + 4) & ~3;
  if (x.mnemonic === 'ldr') check((hw & 0xf800) === 0x4800 && base + (hw & 0xff) * 4 === x.targetOffset, `${x.function}+${x.offset.toString(16)}: bad literal load`);
  else if (x.mnemonic === 'adr') check((hw & 0xf800) === 0xa000 && base + (hw & 0xff) * 4 === x.targetOffset, `${x.function}+${x.offset.toString(16)}: bad ADR`);
  else fail('unknown PC-relative form');
}

function validateObject(c, fileOrBuffer) {
  const elf = parseElf(Buffer.isBuffer(fileOrBuffer) ? fileOrBuffer : readBounded(fileOrBuffer));
  const expectedNames = new Set(c.functions.map(f => f.name));
  const selectedSections = new Map();
  for (const f of c.functions) {
    const sectionName = `.text.${f.name}`;
    const matches = elf.sections.filter(s => s.name === sectionName);
    check(matches.length === 1, `${sectionName}: expected exactly one section`);
    const s=matches[0]; selectedSections.set(f.name,s);
    check(s.type === 1 && (s.flags & 6) === 6 && s.size === f.size && s.align === 2, `${sectionName}: type/flags/size/alignment mismatch`);
    const normalized=Buffer.from(elf.buf.subarray(s.offset,s.offset+s.size));
    for(const call of f.directCalls) {
      const expectedCall=call.mnemonic==='bl'?'fff7feff':'fff7feef';
      check(normalized.subarray(call.offset,call.offset+4).toString('hex')===expectedCall, `${f.name}+${call.offset.toString(16)}: direct-call opcode mismatch`);
      normalized.fill(0,call.offset,call.offset+4);
    }
    check(normalized.equals(Buffer.from(EXPECTED_BODIES[f.name],'base64')), `${f.name}: semantic instruction body mismatch`);
    const defs=elf.symbols.filter(x => x.name === f.name);
    check(defs.length === 1, `${f.name}: selected-name collision or missing symbol`);
    const sym=defs[0]; check(sym.shndx === s.index && (sym.value & ~1) === 0 && (sym.value & 1) === 1 && sym.size === f.size && sym.type === 2 && sym.bind === 1, `${f.name}: invalid function symbol`);
    const maps=elf.symbols.filter(x => x.shndx === s.index && /^\$(?:t|a|d)(?:\.|$)/.test(x.name)).sort((a,b)=>(a.value&~1)-(b.value&~1));
    check(maps.some(x => /^\$t(?:\.|$)/.test(x.name) && (x.value&~1) === 0), `${f.name}: no Thumb mapping at entry`);
    check(!maps.some(x => !/^\$t(?:\.|$)/.test(x.name) && (x.value&~1) < f.size), `${f.name}: non-Thumb mapping inside body`);
    const owned=elf.symbols.filter(x => x.shndx === s.index && x.name && !/^\$[tad](?:\.|$)/.test(x.name) && x.type !== 3);
    check(owned.length === 1 && owned[0].name === f.name, `${f.name}: extra executable ownership`);
  }
  for (const x of elf.symbols) if (expectedNames.has(x.name)) check(selectedSections.get(x.name)?.index === x.shndx, `${x.name}: collision outside selected section`);
  const expectedRelocs = new Map();
  for (const x of c.directCalls) expectedRelocs.set(`${selectedSections.get(x.function).index}:${x.offset}`, x);
  const actualSelected=elf.relocations.filter(x => [...selectedSections.values()].some(s => s.index === x.target));
  check(actualSelected.length === 82, 'selected relocation total mismatch');
  for (const r of actualSelected) {
    const e=expectedRelocs.get(`${r.target}:${r.offset}`);
    check(e && r.type === 10 && r.symbol.name === e.symbol, `unexpected call relocation at section ${r.target}+${r.offset.toString(16)}`);
    expectedRelocs.delete(`${r.target}:${r.offset}`);
  }
  check(expectedRelocs.size === 0, 'missing call relocation');
  for (const x of c.pcRelativeDataAccesses) validatePcEncoding(elf, selectedSections.get(x.function), x);
  return elf;
}

function makeFixture(c, options={}) {
  const foreign = options.foreign ?? 12000;
  const secs=[{name:'',type:0,flags:0,align:0,data:Buffer.alloc(0)}];
  const selectedIndex=new Map();
  for(const f of c.functions){const data=Buffer.from(EXPECTED_BODIES[f.name],'base64');for(const x of f.directCalls)Buffer.from(x.mnemonic==='bl'?'fff7feff':'fff7feef','hex').copy(data,x.offset);selectedIndex.set(f.name,secs.length);secs.push({name:`.text.${f.name}`,type:1,flags:6,align:options.badAlign===f.name?4:2,data});}
  for(let i=0;i<foreign;i++)secs.push({name:`.foreign.${i}`,type:1,flags:6,align:1,data:Buffer.alloc(0)});
  const selectedNames=new Set(c.functions.map(x=>x.name));
  const destinations=[...new Set(c.directCalls.map(x=>x.symbol).filter(x=>!selectedNames.has(x)))];
  const strings=['']; const addString=s=>{const n=Buffer.byteLength(strings.join('\0'))+1;strings.push(s);return n;};
  const symbolDefs=[];
  for(const f of c.functions){symbolDefs.push({name:'$t',nameOff:addString('$t'),value:0,size:0,info:0,shndx:selectedIndex.get(f.name)});}
  const localCount=1+symbolDefs.length;
  for(const f of c.functions)symbolDefs.push({name:f.name,nameOff:addString(f.name),value:1,size:f.size,info:0x12,shndx:selectedIndex.get(f.name)});
  for(const d of destinations)symbolDefs.push({name:d,nameOff:addString(d),value:0,size:0,info:0x10,shndx:0});
  if(options.collision){const f=c.functions[0];symbolDefs.push({name:f.name,nameOff:addString(f.name),value:1,size:f.size,info:0x12,shndx:selectedIndex.get(f.name)});}
  if(options.dataMap){const f=c.functions[0];symbolDefs.unshift({name:'$d',nameOff:addString('$d'),value:2,size:0,info:0,shndx:selectedIndex.get(f.name)});}
  if(options.extraOwner){const f=c.functions[0];symbolDefs.push({name:'hostile_owner',nameOff:addString('hostile_owner'),value:2,size:0,info:0x10,shndx:selectedIndex.get(f.name)});}
  const strtab=Buffer.from(strings.join('\0')+'\0');const strIndex=secs.length;secs.push({name:'.strtab',type:3,flags:0,align:1,data:strtab});
  const symtab=Buffer.alloc((1+symbolDefs.length)*16);const symbolIndex=new Map();symbolDefs.forEach((s,i)=>{const o=(i+1)*16;symtab.writeUInt32LE(s.nameOff,o);symtab.writeUInt32LE(s.value,o+4);symtab.writeUInt32LE(s.size,o+8);symtab[o+12]=s.info;symtab.writeUInt16LE(s.shndx,o+14);if(s.name && !symbolIndex.has(s.name))symbolIndex.set(s.name,i+1);});
  const symIndex=secs.length;secs.push({name:'.symtab',type:2,flags:0,align:4,entsize:16,link:strIndex,info:localCount,data:symtab});
  for(const f of c.functions){let calls=f.directCalls;if(options.missingReloc && f===c.functions[0])calls=calls.slice(1);const rel=Buffer.alloc(calls.length*8);calls.forEach((x,i)=>{rel.writeUInt32LE(x.offset,i*8);rel.writeUInt32LE((symbolIndex.get(x.symbol)<<8)|10,i*8+4);});secs.push({name:`.rel.text.${f.name}`,type:9,flags:0,align:4,entsize:8,link:symIndex,info:selectedIndex.get(f.name),data:rel});}
  const shNames=[''];const shOff=s=>{const n=Buffer.byteLength(shNames.join('\0'))+1;shNames.push(s);return n;};for(const s of secs)s.nameOff=shOff(s.name);const shstrIndex=secs.length;secs.push({name:'.shstrtab',nameOff:shOff('.shstrtab'),type:3,flags:0,align:1,data:null});secs[shstrIndex].data=Buffer.from(shNames.join('\0')+'\0');
  let off=52;for(const s of secs.slice(1)){const a=Math.max(1,s.align||1);off=(off+a-1)&~(a-1);s.offset=off;s.size=s.data.length;off+=s.size;}off=(off+3)&~3;const shoff=off,total=shoff+secs.length*40;const b=Buffer.alloc(total);b.write('\x7fELF',0,'binary');b[4]=1;b[5]=1;b[6]=1;b.writeUInt16LE(1,16);b.writeUInt16LE(40,18);b.writeUInt32LE(1,20);b.writeUInt32LE(shoff,32);b.writeUInt16LE(52,40);b.writeUInt16LE(40,46);b.writeUInt16LE(secs.length,48);b.writeUInt16LE(shstrIndex,50);
  secs.forEach((s,i)=>{if(i)s.data.copy(b,s.offset);const o=shoff+i*40;b.writeUInt32LE(s.nameOff||0,o);b.writeUInt32LE(s.type||0,o+4);b.writeUInt32LE(s.flags||0,o+8);b.writeUInt32LE(s.offset||0,o+16);b.writeUInt32LE(s.size||0,o+20);b.writeUInt32LE(s.link||0,o+24);b.writeUInt32LE(s.info||0,o+28);b.writeUInt32LE(s.align||0,o+32);b.writeUInt32LE(s.entsize||0,o+36);});return b;
}

function expectReject(fn, label){let rejected=false;try{fn();}catch{rejected=true;}check(rejected,`self-test failed to reject ${label}`);}
function selfTest(c){
  validateSource(c);
  const valid=makeFixture(c);const parsed=validateObject(c,valid);check(parsed.sectionCount>=12000,'large foreign composite was not exercised');
  for(const [label,opts] of [['alignment',{badAlign:c.functions[0].name}],['selected-name collision',{collision:true}],['interior data mapping',{dataMap:true}],['extra ownership',{extraOwner:true}],['missing relocation',{missingReloc:true}]])expectReject(()=>validateObject(c,makeFixture(c,{foreign:0,...opts})),label);
  const pc=makeFixture(c,{foreign:0});const p=parseElf(pc),x=c.pcRelativeDataAccesses[0],s=p.sections.find(y=>y.name===`.text.${x.function}`);pc[s.offset+x.offset]^=1;expectReject(()=>validateObject(c,pc),'PC-relative mismatch');
  const tooMany=Buffer.from(valid);tooMany.writeUInt16LE(LIMIT.sections+1,48);expectReject(()=>parseElf(tooMany),'section cap');
  const hugeExec=makeFixture(c,{foreign:0});const he=parseElf(hugeExec),hs=he.sections.find(x=>(x.flags&4)!==0);hugeExec.writeUInt32LE(LIMIT.executable+1,he.sections[hs.index].index*0+hugeExec.readUInt32LE(32)+hs.index*40+20);expectReject(()=>parseElf(hugeExec),'executable cap');
  check(LIMIT.file===67108864&&LIMIT.executable===16777216&&LIMIT.sections===16384&&LIMIT.symbols===1000000&&LIMIT.relocations===1000000,'independent caps changed');
  console.log(`self-test ok: ${parsed.sectionCount} sections; hostile collision/mapping/ownership/relocation/PC/alignment/cap cases rejected`);
}

try {
  const c=JSON.parse(readBounded(CONFIG).toString('utf8'));validateConfig(c);
  const args=process.argv.slice(2);
  if(args.length===1&&args[0]==='--self-test')selfTest(c);
  else {check(args.length===1,'usage: validate-thumb-leaf-helpers-11.mjs <object.o> | --self-test');validateSource(c);const e=validateObject(c,path.resolve(args[0]));console.log(`ok: 13 functions, 4482 bytes, 2159 instructions, 82 calls/relocations, 32 unowned PC accesses; ${e.sectionCount} ELF sections`);}
} catch (error) { console.error(`thumb-leaf-helpers-11: ${process.env.THUMB11_DEBUG ? error.stack : error.message}`); process.exitCode=1; }
