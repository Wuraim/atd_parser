#!/usr/bin/env node
/**
 * main.js (v3.5)
 * - Par défaut: lit ./input et écrit des JSON individuels dans ./output
 *   --input <dir>    : (optionnel) dossier .atd (défaut: ./input)
 *   --out <dir>      : (optionnel) dossier .json (défaut: ./output)
 *   --merge <file>   : (optionnel) JSON fusionné en plus
 *   --list           : (optionnel) affiche juste la liste des noms
 *   --debug          : (optionnel) logs offsets/choix d'analyse
 *
 * Heuristique bloc "personnage":
 *   ... 01 KK [padding 0..8] ([len][name][term] | [name][term]) [flag=FE/FF]? [00 08 18 00]? [u32 LE]...
 *   où KK ∈ {04,05,06,07} et term ∈ {00,01}
 */

import * as fs from "@std/fs";
import * as path from "@std/path";
import { RECORD_CLASS } from "./mapping/class.ts";
import { Character } from "./type/character.ts";
import { CharacterClass } from "./enums/class.ts";

const args = Deno.args;
function getOption(name: string): string | null {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

const inputDirectory = getOption("--input") || path.join(Deno.cwd(), "input");
const outDir = getOption("--out") || path.join(Deno.cwd(), "output");
const mergeFile = getOption("--merge");
const LIST_ONLY = args.includes("--list");
const DEBUG = args.includes("--debug");

// Caractères plausibles pour un nom
const NAME_OK = /^[\p{L}\p{N} .,'\-_/]{2,32}$/u;

function readU32LE(buf, off) {
  return buf.readUInt32LE(off);
}

// Cherche un en-tête nom: 0x01 suivi de 0x04..0x07
function findNextNameHeader(buf, start) {
  for (let i = start; i + 1 < buf.length; i++) {
    if (buf[i] === 0x01) {
      const k = buf[i + 1];
      if (k >= 0x04 && k <= 0x07) return { index: i, kindByte: k };
    }
  }
  return null;
}

// Tente [len][text][term] avec term ∈ {00,01}
function tryLengthPrefixed(buf, off) {
  if (off >= buf.length) return null;
  const L = buf[off];
  if (L < 1 || L > 60) return null;
  const textStart = off + 1;
  const end0 = textStart + L;
  if (end0 >= buf.length) return null;

  const term = buf[end0];
  if (term !== 0x00 && term !== 0x01) return null;

  const raw = buf.subarray(textStart, end0);
  try {
    const name = raw.toString("utf8");
    if (!NAME_OK.test(name)) return null;
    return {
      name,
      next: end0 + 1,
      nameLenOff: off,
      mode: "len",
      term,
      lengthBytes: L,
    }; // NEW lengthBytes
  } catch {
    return null;
  }
}

// Tente [text][term] avec term ∈ {00,01}, borne max
function tryNullTerminated(buf, off, maxLen = 40) {
  if (off >= buf.length) return null;
  let end = off,
    gotTerm = null;
  while (end < buf.length && end - off <= maxLen) {
    if (buf[end] === 0x00 || buf[end] === 0x01) {
      gotTerm = buf[end];
      break;
    }
    end++;
  }
  if (gotTerm == null) return null;
  const raw = buf.subarray(off, end);
  try {
    const name = raw.toString("utf8");
    if (!NAME_OK.test(name)) return null;
    return {
      name,
      next: end + 1,
      nameLenOff: off,
      mode: "nul",
      term: gotTerm,
      lengthBytes: end - off,
    }; // NEW lengthBytes
  } catch {
    return null;
  }
}

// NEW: helpers sûrs pour lire un octet si dans les bornes
function readByteSafe(buf, off) {
  if (off < 0 || off >= buf.length) return null;
  return buf[off];
}

// Lit un bloc personnage à partir de header.index
function parseOneCharacter(buf, headerIdx) {
  // Sauter 0x01 0xKK et tolérer 0..8 octets de padding avant la longueur/texte
  const base = headerIdx + 2;

  let got = null,
    usedOff = null,
    usedDelta = null;
  for (let delta = 0; delta <= 8 && !got; delta++) {
    const off = base + delta;
    got = tryLengthPrefixed(buf, off);
    if (got) {
      usedOff = off;
      usedDelta = delta;
      break;
    }
  }
  if (!got) {
    for (let delta = 0; delta <= 8 && !got; delta++) {
      const off = base + delta;
      got = tryNullTerminated(buf, off);
      if (got) {
        usedOff = off;
        usedDelta = delta;
        break;
      }
    }
  }
  if (!got) return null;

  let { name, next: cursor, nameLenOff, mode, term, lengthBytes } = got;

  // NEW: calculer startOfName et longueur en octets UTF-8
  const startOfName = mode === "len" ? nameLenOff + 1 : nameLenOff;
  const nameLenBytes = lengthBytes; // déjà calculée par les fonctions try*

  // Flag optionnel 0xFE/0xFF (on tolère un éventuel 0x00 d’alignement avant)
  if (cursor < buf.length && buf[cursor] === 0x00) cursor++;
  let flag = null;
  if (cursor < buf.length && (buf[cursor] === 0xfe || buf[cursor] === 0xff)) {
    flag = buf[cursor];
    cursor += 1;
  }

  // Signature 00 08 18 00 optionnelle (tolère 1 octet 0x00 de padding avant)
  if (cursor < buf.length && buf[cursor] === 0x00) {
    if (
      cursor + 4 <= buf.length &&
      buf[cursor + 1] === 0x08 &&
      buf[cursor + 2] === 0x18 &&
      buf[cursor + 3] === 0x00
    ) {
      cursor += 4; // on laisse cursor sur le 0x00 initial pour lecture u32 ci-dessous
    }
  } else if (
    cursor + 4 <= buf.length &&
    buf[cursor] === 0x00 &&
    buf[cursor + 1] === 0x08 &&
    buf[cursor + 2] === 0x18 &&
    buf[cursor + 3] === 0x00
  ) {
    cursor += 4;
  }

  // Fin du bloc: prochain header ou fin
  const nextHdr = findNextNameHeader(buf, cursor);
  const end = nextHdr ? nextHdr.index : buf.length;

  // Lire les u32 LE jusqu'à end (tronqué au multiple de 4)
  const len32 = Math.floor((end - cursor) / 4);
  const u32 = new Array(len32);
  for (let k = 0; k < len32; k++) u32[k] = readU32LE(buf, cursor + 4 * k);

  // NEW: extraire classe/genre si possible
  const classByte = readByteSafe(buf, startOfName - 2);
  const genderByte = readByteSafe(buf, startOfName + nameLenBytes);
  const className = classByte != null ? RECORD_CLASS[classByte] || null : null;
  const genderName =
    genderByte === 0x00 ? "Male" : genderByte === 0x01 ? "Femelle" : null;

  if (DEBUG) {
    console.error(
      `name='${name}'@${nameLenOff} mode=${mode} delta=${usedDelta} term=${term?.toString(
        16
      )} flag=${flag ?? "null"} ` +
        `startOfName=${startOfName} lenBytes=${nameLenBytes} class=0x${
          classByte != null ? classByte.toString(16).padStart(2, "0") : "??"
        }(${className ?? "?"}) ` +
        `gender=${genderByte != null ? genderByte.toString(16) : "??"}(${
          genderName ?? "?"
        }) next=${end}`
    );
  }

  return {
    entry: {
      name,
      // NEW: enrichissements
      gender_byte: genderByte != null ? genderByte : null,
      gender: genderName, // "Male" | "Femelle" | null
      class_byte: classByte != null ? classByte : null,
      class_name: className, // ex. "Ecaflip" | null
      // existants
      flag, // 254/255 ou null
      sig00181800: false, // laissé à false tant que non garanti
      u32_fields: u32,
      name_offset: nameLenOff,
      name_start_offset: startOfName, // NEW: offset du 1er octet du nom
      name_len_bytes: nameLenBytes, // NEW: longueur en octets UTF-8
      name_mode: mode, // "len" | "nul"
    },
    nextIndex: end,
  };
}

interface FileParsing {
  file: string;
  team: Array<Partial<Character<CharacterClass>>>;
}

function parseAtd(filePath: string): FileParsing {
  const data = fs.read(filePath);
  const n = data.length;

  const team: Array<Partial<Character<CharacterClass>>> = [];

  let i = 0,
    guard = 0;
  while (i < n && guard++ < 10000) {
    const hdr = findNextNameHeader(data, i);
    if (!hdr) break;
    const got = parseOneCharacter(data, hdr.index);
    if (!got) {
      i = hdr.index + 1;
      continue;
    }
    team.push(got.entry);
    i = got.nextIndex;
  }

  return {
    file: path.resolve(filePath),
    team,
  };
}

// Parcours dossier et sorties
function run() {
  const absolutePathInput = path.resolve(inputDirectory);
  const isAbsolutePathExisting = fs.existsSync(absolutePathInput);
  const isAsbsolutePathDirectory = Array.from(
    fs.walkSync(absolutePathInput)
  ).some((file) => file.path === "." && file.isDirectory);

  if (isAbsolutePathExisting && isAsbsolutePathDirectory) {
    const inputFiles: Array<fs.WalkEntry> = Array.from(
      fs.walkSync(absolutePathInput, {
        includeDirs: false,
        exts: [".atd"],
      })
    );

    if (inputFiles.length === 0) {
      console.error("Aucun fichier .atd trouvé dans:", absolutePathInput);
      Deno.exit(2);
    }

    const results: Array<unknown> = inputFiles.map((f) => {
      try {
        return parseAtd(f);
      } catch (e) {
        if (DEBUG) console.error("Erreur parse", f, e);
        return { file: path.resolve(f), error: String(e) };
      }
    });

    if (LIST_ONLY) {
      for (const result of results) {
        console.log(`# ${path.basename(result.file)}`);
        if (result.characters) {
          for (const c of result.characters) {
            // NEW: afficher classe/genre dans --list
            const cls =
              c.class_name ??
              `0x${(c.class_byte ?? 0).toString(16).padStart(2, "0")}`;
            const g =
              c.gender ??
              (c.gender_byte != null ? `0x${c.gender_byte.toString(16)}` : "?");
            console.log(` - ${c.name} [${cls}; ${g}]`);
          }
        }
      }
      return;
    }

    const absOut = path.resolve(outDir);
    fs.mkdirSync(absOut, { recursive: true });
    for (const r of results) {
      const base = path.basename(r.file).replace(/\.atd$/i, ".json");
      const outPath = path.join(absOut, base);
      fs.writeFileSync(outPath, JSON.stringify(r, null, 2), "utf8");
    }
    console.log("OK - JSON individuels dans", absOut);

    if (mergeFile) {
      const mf = path.resolve(mergeFile);
      fs.mkdirSync(path.dirname(mf), { recursive: true });
      fs.writeFileSync(mf, JSON.stringify(results, null, 2), "utf8");
      console.log("OK - fusion écrite dans", mf);
    }
  } else {
    console.error(
      "Le chemin d’entrée n’est pas un dossier valide:",
      absolutePathInput
    );
    Deno.exit(1);
  }
}

run();
