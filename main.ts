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
import { ExtractedCharacter } from "./type/character.ts";
import { CharacterClass } from "./enums/class.ts";

const args = Deno.args;
function getOption(name: string): string | null {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

const inputDirectory = getOption("--input") || path.join(Deno.cwd(), "input");
const DEBUG = args.includes("--debug");

function getInteger(
  buffer: Uint8Array,
  cursor: Cursor,
  byteLength: number
): number {
  let result = 0;
  for (let i = 0; i < byteLength; i++) {
    result |= buffer[cursor.value + i] << (8 * (byteLength - i - 1));
  }
  cursor.value += byteLength;

  return result;
}

function getString(
  buffer: Uint8Array,
  cursor: Cursor,
  byteLength: number
): string {
  let result = "";

  const offsetEnd = cursor.value + byteLength;
  while (cursor.value < offsetEnd) {
    result += String.fromCharCode(buffer[cursor.value]);
    cursor.value++;
  }

  return result;
}

function getSpells(
  buffer: Uint8Array,
  cursor: Cursor,
  byteLength: number
): Array<number> {
  const result = [];

  const offsetEnd = cursor.value + byteLength;
  while (cursor.value < offsetEnd) {
    const spell = getInteger(buffer, cursor, 4);
    result.push(spell);
  }

  return result;
}

function getEquipments(
  buffer: Uint8Array,
  cursor: Cursor,
  byteLength: number
): Array<number> {
  const result = [];

  const offsetEnd = cursor.value + byteLength;
  while (cursor.value < offsetEnd) {
    const spell = getInteger(buffer, cursor, 6);
    result.push(spell);
  }

  return result;
}

interface FileParsing {
  file: string;
  extractedTeam: Array<ExtractedCharacter<CharacterClass>>;
}

interface Cursor {
  value: number;
}

function parseData(
  data: Uint8Array<ArrayBuffer>
): Array<ExtractedCharacter<CharacterClass>> {
  const team: Array<ExtractedCharacter<CharacterClass>> = [];

  const cursor: Cursor = { value: 0 };
  const teamLength = getInteger(data, cursor, 2);
  for (let indexCharacter = 0; indexCharacter < teamLength; indexCharacter++) {
    const characterSize = getInteger(data, cursor, 2);

    // We don't know what this 3 bytes are for (Maybe a checksum)
    const characterChecksum = getInteger(data, cursor, 3);

    const classCharacter = getInteger(data, cursor, 1);

    const nameSize = getInteger(data, cursor, 1);
    const nameCharacter = getString(data, cursor, nameSize);

    const sexeCharacter = getInteger(data, cursor, 1);
    const skinGameCharacter = getInteger(data, cursor, 1);

    const hairColorCharacter = getInteger(data, cursor, 1);
    const skinColorCharacter = getInteger(data, cursor, 1);
    const eyesColorCharacter = getInteger(data, cursor, 1);

    const spellsSize = getInteger(data, cursor, 2);
    const spellsCharacter = getSpells(data, cursor, spellsSize);

    const equipmentsSize = getInteger(data, cursor, 2);
    const equipmentsCharacter = getEquipments(data, cursor, equipmentsSize);

    const extractedCharacter: ExtractedCharacter<CharacterClass> = {
      class: classCharacter,
      name: nameCharacter,
      sexe: sexeCharacter,
      skinGame: skinGameCharacter,
      skinColor: {
        hairColor: hairColorCharacter,
        skinColor: skinColorCharacter,
        eyesColor: eyesColorCharacter,
      },
      equipments: equipmentsCharacter,
      spells: spellsCharacter,
    };

    team.push(extractedCharacter);

    console.log("characterSize", characterSize.toString(16));
    console.log("characterChecksum", characterChecksum.toString(16));
    console.log("extractedCharacter", extractedCharacter);
  }

  return team;
}

function parseAtd(filePath: string): FileParsing {
  const data = Deno.readFileSync(filePath);
  const extractedTeam = parseData(data);

  return {
    file: path.resolve(filePath),
    extractedTeam,
  };
}

// Parcours dossier et sorties
function run() {
  const absolutePathInput = path.resolve(inputDirectory);
  const isAbsolutePathExisting = fs.existsSync(absolutePathInput);
  const isAsbsolutePathDirectory = Array.from(
    fs.walkSync(absolutePathInput)
  ).some((file) => file.name === "input" && file.isDirectory);

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
        console.log("f.path", f.path);
        return parseAtd(f.path);
      } catch (e) {
        if (DEBUG) console.error("Erreur parse", f, e);
        return { file: path.resolve(f.path), error: String(e) };
      }
    });
  } else {
    console.error(
      "Le chemin d’entrée n’est pas un dossier valide:",
      absolutePathInput,
      isAbsolutePathExisting,
      isAsbsolutePathDirectory
    );
    Deno.exit(1);
  }
}

run();
