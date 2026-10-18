#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdtemp, open, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { gunzipSync } from "node:zlib";

const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const R_ARM_THM_CALL = 10;

// A compressed object assembled solely from this batch's clean-room source.
// Self-tests derive every positive and hostile fixture from these immutable bytes.
const SELF_TEST_OBJECT_GZIP_BASE64 =
  "H4sIAAAAAAACA81Zf3Abx3V+dzgAR4giQf0gQfIIHSiJPNEkdQRACqwlGTiQkBgpDuWxW0cTxQeGcg+UaFMyzaEcT0Sprk25TgZ0ExuUlA45I8e047hMJvK4HitBYk0rp2nmQFmtK1HTkyYJ1UxSq7YjyUnH7u7dQVysoMZp/ylnMLtvv91v3+6+9/bt8WD39gTDMJD/Y0CCRQlACpiFM2xJsAE6QD7JgRPG9lza843Z5vaKtATLJj65/vEn+AfS6vMVM1bNn1uOMFxf/h34hlOreGkwxbxc8e2ZLcsnmZe/WsNKHt0hLdFFuAOYellmXrLGcTqIK2flU4z4+wV1T7Ra/dJHC9dPHp4tB/Y4NKA+70EaNCa9drRfgBanbrZo0V1Z929zd7SwekuLoPf7IQMBRuWOdoJo6oBWtZ7TI9qUwuTYTERFuMai2SHDHGXVIafr3FbFOXsVzTrGuuL/tsDD9YWrJ53wFJpXS2AGLl29reYzncCLWGLTe7U3FTi7EVo1R9oAZ9ptODJt5lyODN/By470Os2Z4X2zyvs5l8FmLgHv4yb7BdzjTeXaWVePpOH6wyp7nJlpVnFdBDfS4QbaYdBWAbOagQuso8EXdTc5L4DE6FUvuIyqFzgD1ytfAKPyBa94KB5Qp1JZP6yfSjJ61D+VtFYM60v0Pm1ai0B6izgQFcS+LPq5DHHgdwt9mjQ6rQ0K6S0j/htzVv8bp4ru8vgJtMucbp0kSNfsPV6ln7hlj9mie1yG9/iYA+1xyTlY3av8VawaFnd6fsGLdvoG2ulSGNcqIev25mQNWUGuuofXogKvyqqorYPDmojWMaUxAT4+pUpah8bLMe27ivNdCMDEPmHAPCNJawNeNjVFHC79R1qP/0cqm2O0Hm18i4HQqGCg0VYfTr3Nmm9rWauKWNb/ftWfnHRDGayAQ7N36tDaqXta2X/ljmHOEf8meDA+VA3pO4xWaKkGo6P2B4rzLHd0HchoH9A5zIsgxduqx9zIhsVKo8m3XGOMSq1yx7Lap5XfzUHd8h1TSunc+wsIGUXIaOV9FhIVlt83pXxwFjJ/qehnsU7Xkb2VQ6DnidkDXdDgeLsdIM1M8MaBXQMJ1vRmRoLciDAoiNqYiz1npGYV50UXGv+bC6O7QPpVbio1Vpu3u/KeA12JTsyDWcqNvyNY3Dkt0afBkWktb5MjwquIxRqJbf8g0sWytAo9OSAOQMO1+CFlqS6iszs8gG2AsfcdJBatnJsdOiWm1sKYO1sut+PokUf/U2+zPRePiMr5WtiyD1FNTiWNpNon9k315a2by+Vrc4jbkZZUEf5p4f+jTthuoZE9vhJE5KHM8zKeuWWlvtIQx5nGE8IomvV+s61EX2JAC6N7W9w5cRwavWtPCKzBrwXDsxYa4LkKAyaZxlSc960DtnRfHDjkiumv+SLckwpzlhGZNJ5hna3DlfOODEhOHdYzOAIY7HFOZTLY17C3sMgzzvixTcGkzPHxj0g9kVcV6DnKNPbfTs9RrGf/H6snmqGYnv2fQs9P0Bkfml0jL0W2H9DGXdw5b72RmkCxFQxGnFGYi1tqwYBGLjOdeqza6+NrkL1rWRf7jn22DTyK/zjeju2ybHsEWTeXeVL54ALu5zln9XMZuI8s5u0/Agf9IH047zbAHB3dlUckGETIB/PWOFED5HmsaMWQ3y9gn10JzT1PYp9tdLy92fTZCsOdGUjsg9hOy+NiglsPaEdcjnOXU52+CaXs3bt8Ize9+HXFdfFV5RcX3Jl9EN0JkoH8OHvTj1ciP97Zib0YRGai0ojBQMKdyTM701HBo8NaJ1oPO2PpPSg4UUy4dpbLRIVZhUv/4oI4kK0W+yy+EqT5xydbp01feg+kHfjmn7bq23RGjLJmDAC2PmD7CKzxNkTX4h4O8Gkozu/6sXuuHHQmsLneqzA6W18RZ6EJ1TizFkQ1HtV4hILeFs+YvUTUIkqCDvXQBPq6OGu2jqHWw6BEx0QWSVFg4ir0C533GKs+ipzJWfNH4ONTzq0fn2LqLyH7+ItZAZzfhPRn47Butf6iBmLMgPWxeSM1o/jPM5OwrhbF/HrIWyCjv6i2GIYWcx4pZ5Dn8kZ9Kqkdqbmc2lGTdUyrzDtblSnVmcFRb0bhzhvobnvbyccNdIOgtGsUs1w2256Ox4TLqhvPKbkuANpdZBnplQaIxgK2e6+xGf5WgYutoGowGTT3V9V+WDtWrSKuserv1KIzbJmZf1H9B3MdKwAaerV2YNITqec1LjO+BdJlk64MH3fqJcZ0issMCrgtMAAYk36bw3M6dCaTdXP6CjRvNo61FjWmLqC6tCUGRljUSx57TZhOHfTnGWD9yot47DLdhXzPrcOxpUdLJ639+XnObZRlsNXl57mgX0phbZhM2WQWxU4+Djl5bEp7XeEu4p4oM1zPIkvJxn+4IMEp5AOV8PRscOto196EAx4PZR/eqR3Tlp5u2fblrodCfMjxytJ/XHp6g5hleN+GQC2Ose+hzHVTKdRuZM/1K4yIPFqExpJ0uWGge7RUXNUzGj/QdXdnzKclrH3ck3C/1e89KEDzb3JVnzvY1XpXpXHFvUwXmWw1A2Vvuyb4v3Y/m9Wuots/U82ng+B6yTFj2uy33W8NenEm8ctciRmLUojTwjgjCKmEVfccc7+11LyFn5iFAJePlBMoUk7guFilVxn56LYYLT16qR0t+RyYaEG8bETx4Pk6gwkwEzAZglTc44NnJfj3qj+xvO8orF5W+pQPjn4+VgZeM5Ki3eAOmZGULYik8+ed5tnh6GnFUu64M8OprNm6GE0ZM3eFo5HSNo6JRzhv/NoCsSZ8S926pvET/9Oaxgvuqv/rmohbrHBNJ/7INTkB3Wno2q/SkCetr5q/lHJkmIZrzkMKO2doMvJgrznPJe278cPCJVXQY8Ln9EZNGhoUkEZpmHRkNkO0ZlaBORcktSCYN/x7Se312iPVSRUmRfVINW/mi+Mu5ty3BjjklaoW9QVSiRrHZD3kM4IVF1t8kJZ9OOuXQIwEUtmD0MgPiSkmgDLdPlU1tB4Ox5TTC1YU/lZSTKHWvksairjcofgl1UhFURz6/gKIf4+iw1MoOrgBxE3At7sAZbNNo6pDn7LmQ96yV5VUpyHCOq3fPwawqqwXmq+j05pRr6hS0pPRknymGfiNgF53eE3dgqUrP9lkrnEq6UI74JzJJrIJBqy7xGG+rGCSM19WuzU3uFrgLHyzQZsB5nkOvawY+2XFZDrqoI5BNzRnv6ycxgw4JrPVg+a7Csz7x9UjapbUqKqqNYcIS9Bu2tGvsVfbjKJfWgMUAXHEQa+Pgvg3IuC2wIAEVvzTbka/lVT0c2ulZvRjcpuGUJTIRFFkXmRAbwFJuKgJNWb8K9evVGXLotWximjJ0+CajDI7fE01Jegk0lFGuYDiYSnq9S+5/LxzN+Nh6c14GBma1iBzCOXfpVZ+k8E5J46J31+Q4XsL6JkBkNyd7EsBU46f7h3bwFXCMyXks/6WPwcwlMxSsoOSOWoER+EuCndROE/hPIV7KNxD4aUUXkrhZRReRuFeCvdS+DIKX0bhKyh8BYVXUnglhfso3EfhNRReQ+EChQsU7qdwP4WLFC5SeD2F11P4GgpfQ+ENFN5A4RKFSxTeROFNFN5M4c0U3krhrRQuU7hM4UEKD1J4yLR43GfYtA6uwEK81I56KQ2wvJGSP2PzjZh8Lrifwh+k5GG7/4zZX4DDtjxqyjy6Zgr7/w0lv0LJb1DyGUr+5wJ+D/ycwt+nvYmx+j9m9i+FMqYQF2z8HRNvhqaC/mUQofonKPleu//jZn8v9BXwNcGQLY+b8jL4CjX+GRt/xsRXwFEKn7Hxr5t4JbxG4acpeY6SDUr+D0r+L0r2sIWyjyXn90EDhYcpWWFJe6iBXgr/oo3Pmrgf9trya6YswmNU/3Ebf8PE6+E5Cj9Byd+j5Cwl/8zmO2PyrYF5Cv8VJd+gZJfDGv9Tc3wDrHAU4vU2/jMTl0Cm8M2UvJ2Sd1KyZvPNm3ytMELhT1Dys5Q8ZY83zPEyvErhb1LyTyj5XUr+JSV/aPNfNvlRfFozDA8++tCXHpDlkNzeHuwgpHAsTEpxeVEKR5RuUuq6ibXJwc7ITSmY6O7aECGlBMHS1qYQ48KxdlKS4/HFnnJnJyGFN7SHSSxBSKGOODF7IhQME7N3ywVSiNQ6EYuTekbCi1gouCFOzhAm1hBq7yJn75TjJCc5Q6gtFiGwLjlISIpMzCe3xwr2LESMC3cpMWIn4jHixMKdHeQZxRVS6pTJcZ0bCK3DXcECqYPQur0jHCMtpC1eYBMxUmu54Ny7yHPojBBraAvFSExJEFioO0TMEAyFiBNLyJ2EnsGE0kFK3d0ESzhG2llXiJCCneQaZCVIahYMdRPzxUOETSTa2iLEOMIGERZsK+jZTUpKN2kFoTi5hnB7kFwt6R3BcDBGsHSFI+ROhAo8ICIXSAWeo5B7Hekg7FNOtHfbWainw8omPRusrM0TsXIP3L4Tl51WNu2508oaPSgR2YzLTXb7Xfb4KLpjcBkD+FO77MOlAvAQLuPozsElmng/LhOLvDjb9Gy1chxPD0AXLrcB3I3L7Xb/7bfR424rW/b02jz3WLkRnqfflp+w58M5mOdeK7v03GfPg5TtxeWf2eu93x53v5W7eD4PZq7k2WmP/4I9fpc9vv3TjzfX8QCK/fY6aHkjqTcqj9t6m+eCNvOLdvvjtvyqjePXkqffenXg0tyH3VYW7HnQPhdE/jIu/9zKfj0pe/4BK7fz7LH3adDKbj0PA6i4HAI4apf47vfsA/ixLWu43G/r/4CN33n7dnPfhm37QPM9ictHrZzBM2K9WrDe5rmP2v122+s+YOuLEr4x297M/fkyuhvt8ie2veHc04M3qfWRA4PDyT5UDu+3Si1fG949Ogyt/cnhJLT2PfIItO7fvddsbC28FW9pt++5Iu3mPXZLu30XFePBN0+Rec17pmj/UPF2fKMUaTdvk2J64pukSLsZ8YvyyHIxPc1bvNh6ccwvwmNG/yLtZuQv1h4u3t+M1cXmxXG6GE9b8X0wb/di7ThSF+PHkZjeGxxJW2P3fLY1OTy8P9X36PDuR+DT/tXab6T8144whedT/oBdd/yBfo32l5E/1E8uMu8w0Y8lXskl6Be1Zb3WenmH7S84nD3fVopvxn6X0nxdFN+NWuvuCNtj83wqxednrFhK832B4vMK1trCNk+eb5Tie+42fMMUX1Sw3072F6U8X5riK2OtdyjN9wzF1yssrreU4Juh+MZvw3eC4tMIvjKCL0vxsQ7rzqD53qT4xgg+L8H3LsX3FYf1Tqb53qH4MoI1Pmx/EcvzXaX4XJy1VzTfrym+KcH6ThK2c5c8H88U8j3LWe9gmo9jCvmyglUP21/c8nwixdfgLM4nUHxQt8jnI/giFN8bTuvMab4wxRetW7S/GoKvl+LrcxXn207x9RJ8AsGnUXwet/Xup/n6KT61btFe/ATfGL1et5UD0HyPU3yjdYvnKxJ8GYpviC/8/pTn+zrFl6lbjAf1BN8sxddUUvj9Ks/3CsV3hljvGoLvDMX3fon13YHmO03xGXWL/tFA8BkU3w881ncKmm+e4rtStxifJYLvBsX3zBLLV2m+Dyk+r39xvU0En5ct5FNLi/OVsoV8EsHXTPBJFF94qfUdheZbQ/FF/Yv20krwRSk+b5n1XYXm20jxqX4rlw/bd2Se716K72qZ9R2F5tNY8+4dyrfPlRd+iWeIkvyPya9RPwP5CHpKmD/Ojr8lxF2O/35ahcZxt/JVUP1m0TpG2Vv7/TcGFu3owCkAAA==";

const expectedBodyHashes = new Map(Object.entries({
  func_00305526: "02ae027139f94e0aada6512f6fdc3a8020db36e6ea6b3d1db8f9a5f3d823938c",
  func_00102980: "3cbe82516d1d1d4f2ec3990b5142201e54afff7fa01dadda72340a12232c2616",
  func_00104A50: "8a70a15c0a9185ef31463aaebfa4ba6962877b79ab4daeb37a8ec8c6a38fe060",
  func_002FF324: "2ad9dcbb5fac2181e151507742c477fc654f2fa0ede430493345935cde525d55",
  func_00102FAC: "14e50bf5a6fc2f87013800eb6d009314898cbff5c60a7ae10db69a32fa810e4e",
  func_00303640: "f380c1838188d89c31094b77158a1a7ae9299d54bbd32415ef321d5f4e6f087d",
  func_00102F30: "9b43e3d8bde1ba8038255e23c4496aff2e533ccac156f8dfb7e722e787a0696d",
  func_00102D02: "68429c3f58bcc7f65a751686e0e41453a989f6f02d81e69178b952a003882d7d",
  func_001005A8: "e290fdc1e88fb4d407a86bb8de12c951529369df6a49d461af7d4d6026cdd537",
  func_00104DBA: "324116c9fa33b54dc63646a03a18e9621c0e39716722bb789571dbbe92ba18e2",
  func_0010564A: "324116c9fa33b54dc63646a03a18e9621c0e39716722bb789571dbbe92ba18e2",
  func_00100500: "fb9136265f33d829653dadff6d376809809e78b094ecdac28f806415ab5d8599",
  func_003011B0: "b517bb97eef8c62b8bf8abc3b3505d5a3beffd7bd5e6297e05481965c1f964ff",
  func_002FF988: "68c2f433bf5cda3c50fb46beb9b049f084a6ac2079b80bc79b98f4bf0118bf8d",
  func_001013A0: "37bb8177080ee667a813581545d59bf9170a3bae078198630524ce41914bf503",
  func_00103E3C: "35a9c296900f8326ddead448defb88f3ba8b29d07adf5564af8d09099a10973c",
  func_001034A0: "d3a2787e4092d08ff5cc09feba4276fcc383cfc5f5937e19eba2ecfc69587700",
  func_0010123E: "223ae2272a82aaa720ce0bdc1335191db222c411a0e5dab88c9f46010c15ae65",
  func_002FF118: "e80ae8ee228d0add475ca8a5d0463985d81fa188aa8dd15cac4e1358426aef09",
  func_001031A8: "e47749f2bee67f1d2755e06a25dbba4160886a56039b05f9f61032541940b91f",
  func_0010327C: "19b12478b33c361f2319aed35f5778707a995f1444eff4ba7b0432ee2b496e79",
  func_001033C4: "b80611da1afe17d40d5094cce16e261febe6a09726518ce02240d2ae3cf690a3",
  func_002FFD48: "37837ff7f3f62720d3b443c46d764c83dc58c0188f79aa3f789c4a0aa2b77df7",
  func_00100F5E: "cf234bdd35fa6d5b82d97f912d0d7b16f2e8541be5f44ce0b6125a8cd925fdac",
}));

function fail(message) {
  throw new Error(message);
}

function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

function checkedRange(buffer, offset, size, what) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset + size > buffer.length)
    fail(`${what} is outside the file`);
  return buffer.subarray(offset, offset + size);
}

function cString(table, offset, what) {
  if (!Number.isInteger(offset) || offset < 0 || offset >= table.length) fail(`${what} string offset is invalid`);
  const end = table.indexOf(0, offset);
  if (end < 0) fail(`${what} is not NUL-terminated`);
  return table.toString("utf8", offset, end);
}

async function boundedRead(filename, label) {
  const info = await stat(filename);
  if (!info.isFile()) fail(`${label} is not a regular file: ${filename}`);
  if (info.size > MAX_FILE) fail(`${label} exceeds the independent 64 MiB file limit`);
  return readFile(filename);
}

function parseElf(buffer) {
  if (buffer.length < 52 || buffer.toString("latin1", 0, 4) !== "\x7fELF") fail("object is not ELF");
  if (buffer[4] !== 1 || buffer[5] !== 1 || buffer[6] !== 1) fail("object must be ELF32 little-endian version 1");
  if (buffer.readUInt16LE(16) !== 1) fail("object must be relocatable (ET_REL)");
  if (buffer.readUInt16LE(18) !== 40) fail("object must target ARM");
  const shoff = buffer.readUInt32LE(32);
  const shentsize = buffer.readUInt16LE(46);
  let shnum = buffer.readUInt16LE(48);
  let shstrndx = buffer.readUInt16LE(50);
  if (shentsize < 40) fail("section header entry is too small");
  checkedRange(buffer, shoff, shentsize, "section header zero");
  if (shnum === 0) shnum = buffer.readUInt32LE(shoff + 20);
  if (shnum > MAX_SECTIONS) fail("section count exceeds 16384");
  checkedRange(buffer, shoff, shentsize * shnum, "section header table");
  if (shstrndx === 0xffff) shstrndx = buffer.readUInt32LE(shoff + 24);
  if (shstrndx >= shnum) fail("section-name table index is invalid");

  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    sections.push({
      headerOffset: p,
      index: i, nameOffset: buffer.readUInt32LE(p), type: buffer.readUInt32LE(p + 4),
      flags: buffer.readUInt32LE(p + 8), addr: buffer.readUInt32LE(p + 12),
      offset: buffer.readUInt32LE(p + 16), size: buffer.readUInt32LE(p + 20),
      link: buffer.readUInt32LE(p + 24), info: buffer.readUInt32LE(p + 28),
      align: buffer.readUInt32LE(p + 32), entsize: buffer.readUInt32LE(p + 36),
    });
  }
  const bytesFor = (section, what = "section") => section.type === 8
    ? Buffer.alloc(0) : checkedRange(buffer, section.offset, section.size, what);
  const shstr = bytesFor(sections[shstrndx], "section-name table");
  for (const section of sections) section.name = cString(shstr, section.nameOffset, `section ${section.index}`);
  let executableSize = 0;
  for (const section of sections) if (section.flags & 4) {
    executableSize += section.size;
    if (executableSize > MAX_EXEC) fail("total executable payload exceeds 16 MiB");
  }

  const symbols = [];
  let symbolCount = 0;
  for (const section of sections) if (section.type === 2 || section.type === 11) {
    if (section.entsize < 16 || section.size % section.entsize) fail(`malformed symbol table ${section.name}`);
    const count = section.size / section.entsize;
    symbolCount += count;
    if (symbolCount > MAX_SYMBOLS) fail("symbol count exceeds 1000000");
    if (section.link >= sections.length) fail(`bad string-table link from ${section.name}`);
    const strings = bytesFor(sections[section.link], `strings for ${section.name}`);
    const data = bytesFor(section, section.name);
    const table = [];
    for (let i = 0; i < count; i++) {
      const p = i * section.entsize;
      const nameOffset = data.readUInt32LE(p);
      const symbol = {
        entryOffset: section.offset + p, stringSection: section.link, nameOffset,
        tableSection: section.index, index: i, name: cString(strings, nameOffset, `symbol ${i}`),
        value: data.readUInt32LE(p + 4), size: data.readUInt32LE(p + 8),
        bind: data[p + 12] >>> 4, type: data[p + 12] & 15, other: data[p + 13],
        shndx: data.readUInt16LE(p + 14),
      };
      if (symbol.shndx === 0xffff) fail("SHN_XINDEX symbols are unnecessary below the section cap and are rejected");
      table.push(symbol); symbols.push(symbol);
    }
    section.symbols = table;
  }

  const relocations = [];
  let relocationCount = 0;
  for (const section of sections) if (section.type === 9 || section.type === 4) {
    const minimum = section.type === 9 ? 8 : 12;
    if (section.entsize < minimum || section.size % section.entsize) fail(`malformed relocation table ${section.name}`);
    const count = section.size / section.entsize;
    relocationCount += count;
    if (relocationCount > MAX_RELOCS) fail("relocation count exceeds 1000000");
    if (section.link >= sections.length || !sections[section.link].symbols) fail(`bad symbol-table link from ${section.name}`);
    if (section.info >= sections.length) fail(`bad target-section link from ${section.name}`);
    const data = bytesFor(section, section.name);
    for (let i = 0; i < count; i++) {
      const p = i * section.entsize, info = data.readUInt32LE(p + 4), symbolIndex = info >>> 8;
      const symbol = sections[section.link].symbols[symbolIndex];
      if (!symbol) fail(`bad relocation symbol index in ${section.name}`);
      relocations.push({ entryOffset: section.offset + p, tableSection: section.index, targetSection: section.info, offset: data.readUInt32LE(p), type: info & 0xff, symbol });
    }
  }
  return { buffer, sections, symbols, relocations, bytesFor, executableSize, symbolCount, relocationCount, shoff, shentsize, shstrndx };
}

function validateConfig(config) {
  if (config.schemaVersion !== 1 || config.mode !== "thumb" || config.minimumAlignment !== 2) fail("unsupported config header");
  if (config.source !== "src/main/thumb_leaf_helpers_10.S") fail("config source path is not canonical");
  if (!/^[0-9a-f]{64}$/.test(config.sourceSha256)) fail("sourceSha256 must be lowercase SHA-256");
  if (!Array.isArray(config.functions) || config.functions.length !== 24) fail("expected exactly 24 configured functions");
  if (config.duplicateBodyClasses?.length !== 0) fail("duplicateBodyClasses must remain empty");
  const names = new Set(), records = { instructionSchedule: [], localTransferSchedule: [], returnTransferSchedule: [], indirectCallSchedule: [], indirectTailSchedule: [], directCallSchedule: [] };
  const totals = { totalBodySize: 0, expectedInstructionCount: 0, wideInstructionCount: 0, localBranchCount: 0, memoryOperationCount: 0, returnCount: 0, indirectCallCount: 0, indirectTailCount: 0, directCallCount: 0 };
  for (const fn of config.functions) {
    if (!/^func_[0-9A-F]{8}$/.test(fn.name) || names.has(fn.name)) fail(`invalid or duplicate function name ${fn.name}`);
    names.add(fn.name);
    if (fn.size <= 0 || fn.size & 1) fail(`invalid size for ${fn.name}`);
    const wide = new Set(fn.wideInstructionOffsets);
    if (wide.size !== fn.wideInstructionOffsets.length) fail(`duplicate wide offset in ${fn.name}`);
    let offset = 0;
    const instructions = fn.schedule.split("|");
    for (const instruction of instructions) {
      const split = instruction.indexOf(" "), mnemonic = split < 0 ? instruction : instruction.slice(0, split), operands = split < 0 ? "" : instruction.slice(split + 1);
      records.instructionSchedule.push(`${fn.name}:${offset.toString(16)}:${mnemonic}:${operands}`);
      offset += wide.has(offset) ? 4 : 2;
    }
    if (offset !== fn.size || instructions.length !== fn.instructionCount) fail(`schedule boundary mismatch for ${fn.name}`);
    for (const entry of fn.localTransfers) { const [at, mnemonic, target] = entry.split(":"); records.localTransferSchedule.push(`${fn.name}:${at}:${mnemonic}:local:${target}`); }
    for (const entry of fn.returns) records.returnTransferSchedule.push(`${fn.name}:${entry}`);
    for (const entry of fn.indirectCalls) records.indirectCallSchedule.push(`${fn.name}:${entry}`);
    for (const entry of fn.indirectTails) records.indirectTailSchedule.push(`${fn.name}:${entry}`);
    for (const call of fn.directCalls) records.directCallSchedule.push(`${fn.name}:${call.offset.toString(16)}:${call.mnemonic}:${call.symbol}:${call.targetMode}:${call.relocation}`);
    const checks = [[fn.localTransfers.length, fn.localBranchCount], [fn.returns.length, fn.returnCount], [fn.indirectCalls.length, fn.indirectCallCount], [fn.indirectTails.length, fn.indirectTailCount], [fn.directCalls.length, fn.directCallCount]];
    if (checks.some(([actual, wanted]) => actual !== wanted)) fail(`control count mismatch for ${fn.name}`);
    totals.totalBodySize += fn.size; totals.expectedInstructionCount += fn.instructionCount; totals.wideInstructionCount += wide.size;
    for (const key of ["localBranchCount", "memoryOperationCount", "returnCount", "indirectCallCount", "indirectTailCount", "directCallCount"]) totals[key] += fn[key];
  }
  for (const [key, value] of Object.entries(totals)) if (config[key] !== value) fail(`aggregate ${key} mismatch`);
  if (config.totalAdjacentSize !== 0 || config.directCalls.length !== config.directCallCount || config.relocations.length !== config.directCallCount) fail("top-level ownership or call count mismatch");
  for (const [key, lines] of Object.entries(records)) if (sha256(lines.join("\n")) !== config.canonicalHashes[key]) fail(`canonical ${key} hash mismatch`);
  const flattened = config.functions.flatMap(fn => fn.directCalls.map(call => ({ function: fn.name, ...call })));
  if (JSON.stringify(flattened) !== JSON.stringify(config.directCalls)) fail("top-level directCalls do not match per-function calls");
  const normalized = flattened.map(call => ({ function: call.function, offset: call.offset, type: call.relocation, symbol: call.symbol }));
  if (JSON.stringify(normalized) !== JSON.stringify(config.relocations)) fail("relocation inventory does not match direct calls");
  if (expectedBodyHashes.size !== names.size || [...names].some(name => !expectedBodyHashes.has(name))) fail("validator body inventory is stale");
}

function validateObject(elf, config) {
  const bySectionName = new Map();
  for (const section of elf.sections) {
    const list = bySectionName.get(section.name) ?? [];
    list.push(section); bySectionName.set(section.name, list);
  }
  const selectedSections = new Map(), selectedNames = new Set(config.functions.map(fn => fn.name));
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`, matches = bySectionName.get(sectionName) ?? [];
    if (matches.length !== 1) fail(`${sectionName} must exist exactly once`);
    const section = matches[0];
    if (!(section.flags & 4) || section.type !== 1) fail(`${sectionName} must be executable PROGBITS`);
    if (section.size !== fn.size || section.align !== 2) fail(`${sectionName} size/alignment mismatch`);
    if (section.addr % 4 !== 0) fail(`${sectionName} entry is not zero modulo four`);
    const body = elf.bytesFor(section, sectionName);
    if (sha256(body) !== expectedBodyHashes.get(fn.name)) fail(`${fn.name} instruction encoding/schedule mismatch`);
    selectedSections.set(section.index, { fn, section, body });

    const named = elf.symbols.filter(symbol => symbol.name === fn.name && symbol.shndx !== 0);
    if (named.length !== 1) fail(`${fn.name} must have exactly one definition`);
    const symbol = named[0];
    if (symbol.shndx !== section.index || (symbol.value & ~1) !== 0 || !(symbol.value & 1) || symbol.size !== fn.size || symbol.type !== 2 || (symbol.bind !== 1 && symbol.bind !== 2))
      fail(`${fn.name} symbol type, Thumb state, boundary, or binding mismatch`);
  }

  for (const symbol of elf.symbols) if (selectedSections.has(symbol.shndx)) {
    const owner = selectedSections.get(symbol.shndx).fn.name;
    if ((symbol.bind === 1 || symbol.bind === 2) && symbol.name !== owner) fail(`extra global ownership ${symbol.name || "<anonymous>"} in ${owner}`);
    if (symbol.type === 1) fail(`data symbol ${symbol.name || "<anonymous>"} lies in ${owner}`);
  }

  for (const { fn, section } of selectedSections.values()) {
    const mappings = elf.symbols.filter(symbol => symbol.shndx === section.index && /^\$[tad](?:\.|$)/.test(symbol.name)).sort((a, b) => (a.value & ~1) - (b.value & ~1));
    if (!mappings.some(symbol => /^\$t(?:\.|$)/.test(symbol.name) && (symbol.value & ~1) === 0)) fail(`${fn.name} lacks a Thumb mapping at offset zero`);
    for (const symbol of mappings) {
      const offset = symbol.value & ~1;
      if (offset < fn.size && !/^\$t(?:\.|$)/.test(symbol.name)) fail(`${fn.name} has interior non-Thumb mapping ${symbol.name}`);
    }
  }

  const expectedRelocs = new Map(config.relocations.map(rel => [`${config.functions.find(fn => fn.name === rel.function) ? rel.function : ""}:${rel.offset}`, rel]));
  const seenRelocs = new Set();
  for (const relocation of elf.relocations) if (selectedSections.has(relocation.targetSection)) {
    const fn = selectedSections.get(relocation.targetSection).fn;
    const key = `${fn.name}:${relocation.offset}`, expected = expectedRelocs.get(key);
    if (!expected || seenRelocs.has(key)) fail(`unexpected or duplicate relocation in ${fn.name} at 0x${relocation.offset.toString(16)}`);
    if (relocation.type !== R_ARM_THM_CALL || expected.type !== "R_ARM_THM_CALL" || relocation.symbol.name !== expected.symbol) fail(`relocation mismatch in ${fn.name} at 0x${relocation.offset.toString(16)}`);
    seenRelocs.add(key);
  }
  if (seenRelocs.size !== expectedRelocs.size) fail(`missing direct-call relocation(s): expected ${expectedRelocs.size}, found ${seenRelocs.size}`);

  for (const access of config.pcRelativeDataAccesses) {
    const selected = [...selectedSections.values()].find(entry => entry.fn.name === access.function);
    if (!selected || access.ownership !== "unowned-post-body" || access.requiredEntryModulo4 !== 0) fail(`invalid PC-relative ownership record for ${access.function}`);
    if (!(access.targetOffset >= selected.fn.size && access.targetOffset < selected.fn.nextGlobalOffset)) fail(`PC-relative target ownership boundary mismatch for ${access.function}`);
    const halfword = selected.body.readUInt16LE(access.offset);
    const base = (access.offset + 4) & ~3;
    let target;
    if (access.mnemonic === "ldr" && (halfword & 0xf800) === 0x4800) target = base + (halfword & 0xff) * 4;
    else if (access.mnemonic === "adr" && (halfword & 0xf800) === 0xa000) target = base + (halfword & 0xff) * 4;
    else fail(`PC-relative opcode mismatch for ${access.function}+0x${access.offset.toString(16)}`);
    if (target !== access.targetOffset) fail(`PC-relative target mismatch for ${access.function}+0x${access.offset.toString(16)}`);
  }

  const selectedSignatures = new Map();
  for (const { fn, section, body } of selectedSections.values()) {
    const rel = elf.relocations.filter(r => r.targetSection === section.index).sort((a, b) => a.offset - b.offset).map(r => `${r.offset}:${r.type}:${r.symbol.name}`).join("|");
    const signature = sha256(Buffer.concat([body, Buffer.from(`\0${rel}`)]));
    if (selectedSignatures.has(signature)) fail(`selected body collision between ${fn.name} and ${selectedSignatures.get(signature)}`);
    selectedSignatures.set(signature, fn.name);
  }
  for (const symbol of elf.symbols) {
    if (symbol.shndx === 0 || symbol.shndx >= elf.sections.length || symbol.type !== 2 || selectedNames.has(symbol.name) || symbol.size === 0) continue;
    const section = elf.sections[symbol.shndx], start = symbol.value & ~1;
    if (!(section.flags & 4) || section.type !== 1 || start + symbol.size > section.size) continue;
    const body = elf.bytesFor(section).subarray(start, start + symbol.size);
    const rel = elf.relocations.filter(r => r.targetSection === section.index && r.offset >= start && r.offset < start + symbol.size).sort((a, b) => a.offset - b.offset).map(r => `${r.offset - start}:${r.type}:${r.symbol.name}`).join("|");
    const collision = selectedSignatures.get(sha256(Buffer.concat([body, Buffer.from(`\0${rel}`)])));
    if (collision) fail(`unexpected duplicate body collision: ${symbol.name} duplicates ${collision}`);
  }
}

function buildComposite(base, extraSections = [], extraSymbols = []) {
  const elf = parseElf(base);
  const headers = elf.sections.map(section => Buffer.from(base.subarray(section.headerOffset, section.headerOffset + 40)));
  const shstrSection = elf.sections[elf.shstrndx];
  const symtab = elf.sections.find(section => section.type === 2);
  if (!symtab) fail("self-test fixture lacks a symbol table");
  const symstrSection = elf.sections[symtab.link];
  let shstr = Buffer.from(elf.bytesFor(shstrSection));
  let symstr = Buffer.from(elf.bytesFor(symstrSection));
  const sectionNameOffsets = [];
  for (const section of extraSections) {
    sectionNameOffsets.push(shstr.length);
    shstr = Buffer.concat([shstr, Buffer.from(`${section.name}\0`)]);
  }
  const symbolNameOffsets = [];
  for (const symbol of extraSymbols) {
    symbolNameOffsets.push(symstr.length);
    symstr = Buffer.concat([symstr, Buffer.from(`${symbol.name}\0`)]);
  }
  let symbytes = Buffer.from(elf.bytesFor(symtab));
  for (let i = 0; i < extraSymbols.length; i++) {
    const symbol = extraSymbols[i], entry = Buffer.alloc(16);
    entry.writeUInt32LE(symbolNameOffsets[i], 0);
    entry.writeUInt32LE(symbol.value ?? 1, 4);
    entry.writeUInt32LE(symbol.size ?? 0, 8);
    entry[12] = symbol.info ?? 0x12;
    entry.writeUInt16LE(symbol.sectionIndex ?? (elf.sections.length + symbol.extraSection), 14);
    symbytes = Buffer.concat([symbytes, entry]);
  }

  const chunks = [Buffer.from(base.subarray(0, elf.shoff))];
  let cursor = chunks[0].length;
  const append = (data, alignment = 4) => {
    const padding = (alignment - cursor % alignment) % alignment;
    if (padding) { chunks.push(Buffer.alloc(padding)); cursor += padding; }
    const offset = cursor;
    chunks.push(data); cursor += data.length;
    return offset;
  };
  const shstrOffset = append(shstr);
  headers[shstrSection.index].writeUInt32LE(shstrOffset, 16);
  headers[shstrSection.index].writeUInt32LE(shstr.length, 20);
  if (extraSymbols.length) {
    const symstrOffset = append(symstr);
    headers[symstrSection.index].writeUInt32LE(symstrOffset, 16);
    headers[symstrSection.index].writeUInt32LE(symstr.length, 20);
    const symtabOffset = append(symbytes);
    headers[symtab.index].writeUInt32LE(symtabOffset, 16);
    headers[symtab.index].writeUInt32LE(symbytes.length, 20);
  }
  const extraHeaders = [];
  for (let i = 0; i < extraSections.length; i++) {
    const section = extraSections[i], data = section.data ?? Buffer.alloc(0);
    const offset = data.length ? append(data, section.align ?? 2) : 0;
    const header = Buffer.alloc(40);
    header.writeUInt32LE(sectionNameOffsets[i], 0);
    header.writeUInt32LE(section.type ?? 1, 4);
    header.writeUInt32LE(section.flags ?? 6, 8);
    header.writeUInt32LE(offset, 16);
    header.writeUInt32LE(section.size ?? data.length, 20);
    header.writeUInt32LE(section.link ?? 0, 24);
    header.writeUInt32LE(section.info ?? 0, 28);
    header.writeUInt32LE(section.align ?? 2, 32);
    extraHeaders.push(header);
  }
  const tablePadding = (4 - cursor % 4) % 4;
  if (tablePadding) { chunks.push(Buffer.alloc(tablePadding)); cursor += tablePadding; }
  const newHeaderOffset = cursor;
  chunks.push(...headers, ...extraHeaders);
  const result = Buffer.concat(chunks);
  result.writeUInt32LE(newHeaderOffset, 32);
  result.writeUInt16LE(headers.length + extraHeaders.length, 48);
  return result;
}

function cloneAndMutate(base, mutate) {
  const copy = Buffer.from(base);
  mutate(copy, parseElf(copy));
  return copy;
}

async function runSelfTest(config) {
  const golden = gunzipSync(Buffer.from(SELF_TEST_OBJECT_GZIP_BASE64, "base64"));
  const passed = [];
  const accept = (label, buffer, extraCheck) => {
    const elf = parseElf(buffer);
    validateObject(elf, config);
    extraCheck?.(elf);
    passed.push(label);
  };
  const reject = (label, action, pattern) => {
    try { action(); } catch (error) {
      if (pattern && !pattern.test(error.message)) fail(`self-test ${label} rejected for the wrong reason: ${error.message}`);
      passed.push(label); return;
    }
    fail(`self-test ${label} unexpectedly passed`);
  };

  accept("isolated golden object", golden);
  const goldenElf = parseElf(golden);
  const foreignSections = Array.from({ length: 12_000 }, (_, i) => ({ name: `.text.foreign_${i.toString().padStart(5, "0")}` }));
  const largeComposite = buildComposite(golden, foreignSections);
  accept("unrelated 12000-section composite", largeComposite, elf => {
    if (elf.sections.length < 12_000 || elf.sections.length > MAX_SECTIONS) fail("large composite section count escaped its independent cap");
  });

  const first = goldenElf.sections.find(section => section.name === ".text.func_00305526");
  reject("altered instruction schedule", () => validateObject(parseElf(cloneAndMutate(golden, copy => { copy[first.offset] ^= 1; })), config), /instruction encoding\/schedule mismatch/);
  reject("wrong section alignment", () => validateObject(parseElf(cloneAndMutate(golden, copy => { copy.writeUInt32LE(4, first.headerOffset + 32); })), config), /size\/alignment mismatch/);
  const firstReloc = goldenElf.relocations.find(relocation => relocation.targetSection === first.index);
  reject("unexpected relocation offset", () => validateObject(parseElf(cloneAndMutate(golden, copy => { copy.writeUInt32LE(1, firstReloc.entryOffset); })), config), /unexpected or duplicate relocation/);
  reject("wrong relocation symbol", () => validateObject(parseElf(cloneAndMutate(golden, copy => { copy.writeUInt32LE(R_ARM_THM_CALL, firstReloc.entryOffset + 4); })), config), /relocation mismatch/);
  const firstRelocTable = goldenElf.sections[firstReloc.tableSection];
  reject("missing relocations", () => validateObject(parseElf(cloneAndMutate(golden, copy => { copy.writeUInt32LE(0, firstRelocTable.headerOffset + 28); })), config), /missing direct-call relocation/);

  const interiorData = buildComposite(golden, [], [{ name: "$d.selftest", sectionIndex: first.index, value: 2, size: 0, info: 0 }]);
  reject("interior data mapping", () => validateObject(parseElf(interiorData), config), /interior non-Thumb mapping/);
  const extraOwner = buildComposite(golden, [], [{ name: "extra_owner", sectionIndex: first.index, value: 2, size: 0, info: 0x12 }]);
  reject("extra executable ownership", () => validateObject(parseElf(extraOwner), config), /extra global ownership/);
  const other = goldenElf.sections.find(section => section.name === ".text.func_00102980");
  const nameCollision = buildComposite(golden, [], [{ name: "func_00305526", sectionIndex: other.index, value: 1, size: first.size, info: 0x12 }]);
  reject("selected-name collision", () => validateObject(parseElf(nameCollision), config), /exactly one definition/);

  const collisionOwner = goldenElf.sections.find(section => section.name === ".text.func_00100F5E");
  const collisionBody = Buffer.from(goldenElf.bytesFor(collisionOwner));
  const duplicate = buildComposite(golden, [{ name: ".text.foreign_collision", data: collisionBody }], [{ name: "foreign_collision", extraSection: 0, value: 1, size: collisionBody.length, info: 0x12 }]);
  reject("duplicate body collision", () => validateObject(parseElf(duplicate), config), /unexpected duplicate body collision/);

  const overExec = buildComposite(golden, [{ name: ".text.foreign_over_exec", data: Buffer.alloc(MAX_EXEC) }]);
  reject("executable payload cap", () => parseElf(overExec), /executable payload exceeds 16 MiB/);
  reject("section count cap", () => parseElf(buildComposite(golden, Array.from({ length: MAX_SECTIONS - goldenElf.sections.length + 1 }, (_, i) => ({ name: `.x${i}` })))), /section count exceeds 16384/);
  const symtab = goldenElf.sections.find(section => section.type === 2);
  reject("symbol count cap", () => parseElf(cloneAndMutate(golden, copy => { copy.writeUInt32LE((MAX_SYMBOLS + 1) * symtab.entsize, symtab.headerOffset + 20); })), /symbol count exceeds 1000000/);
  const relocTable = goldenElf.sections.find(section => section.type === 9 || section.type === 4);
  reject("relocation count cap", () => parseElf(cloneAndMutate(golden, copy => { copy.writeUInt32LE((MAX_RELOCS + 1) * relocTable.entsize, relocTable.headerOffset + 20); })), /relocation count exceeds 1000000/);

  const temporary = await mkdtemp(path.join(tmpdir(), "thumb10-self-test-"));
  try {
    const oversized = path.join(temporary, "oversized.o"), handle = await open(oversized, "w");
    try { await handle.truncate(MAX_FILE + 1); } finally { await handle.close(); }
    await boundedRead(oversized, "self-test object").then(() => fail("self-test file-size cap unexpectedly passed"), error => {
      if (!/64 MiB file limit/.test(error.message)) fail(`self-test file-size cap rejected for the wrong reason: ${error.message}`);
      passed.push("file-size cap");
    });
  } finally { await rm(temporary, { recursive: true, force: true }); }

  console.log(`self-test passed: ${passed.length} deterministic cases`);
  console.log(`self-test composite: ${parseElf(largeComposite).sections.length} sections, ${largeComposite.length} bytes, ${parseElf(largeComposite).executableSize} executable bytes`);
}

async function main() {
  const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, "..");
  const args = process.argv.slice(2);
  const selfTest = args.length === 1 && args[0] === "--self-test";
  let objectPath;
  if (!selfTest && args.length === 1 && !args[0].startsWith("-")) objectPath = args[0];
  else if (!selfTest && args.length === 2 && args[0] === "--object") objectPath = args[1];
  else if (!selfTest) fail("usage: validate-thumb-leaf-helpers-10.mjs --self-test | [--object] <relocatable-object>");
  const configPath = path.join(root, "config/thumb-leaf-helpers-10.json");
  const configBytes = await boundedRead(configPath, "config");
  let config;
  try { config = JSON.parse(configBytes.toString("utf8")); } catch { fail("config is not valid JSON"); }
  validateConfig(config);
  const sourcePath = path.join(root, config.source), sourceBytes = await boundedRead(sourcePath, "source");
  if (sha256(sourceBytes) !== config.sourceSha256) fail("source SHA-256 does not match config");
  if (selfTest) { await runSelfTest(config); return; }
  const objectBytes = await boundedRead(path.resolve(objectPath), "object");
  const elf = parseElf(objectBytes);
  validateObject(elf, config);
  console.log(`validated batch 10: ${config.functions.length} functions, ${config.totalBodySize} bytes, ${config.expectedInstructionCount} instructions, ${config.directCallCount} relocations`);
  console.log(`object inventory: ${elf.sections.length} sections, ${elf.symbolCount} symbols, ${elf.relocationCount} relocations, ${elf.executableSize} executable bytes`);
}

await main().catch(error => { console.error(`validation failed: ${error.message}`); process.exitCode = 1; });
