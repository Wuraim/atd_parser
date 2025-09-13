import * as fs from "@std/fs";
import * as path from "@std/path";
import {
  Character,
  CharacterEquipment,
  ExtractedCharacter,
} from "./type/character.ts";
import { CharacterClass } from "./enums/class.ts";
import { isExtractedTeamCorrect } from "./verification/verification.ts";
import { RECORD_CLASS } from "./mapping/class.ts";
import { SEXE_RECORD } from "./mapping/sexe.ts";
import { RECORD_CLASS_RECORD_CLASS_SPELL } from "./mapping/spell.ts";
import { RECORD_SKIN_GAME } from "./mapping/skinGame.ts";
import {
  RECORD_CAPE_EQUIPMENT,
  RECORD_DOFUS_EQUIPMENT,
  RECORD_HEAD_EQUIPMENT,
  RECORD_PET_EQUIPMENT,
  RECORD_WEAPON_EQUIPMENT,
} from "./mapping/equipment.ts";
import { ClassSpellsMap } from "./type/mapClassSpell.ts";

const args = Deno.args;
function getOption(name: string): string | null {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

const inputDirectory = getOption("--input") || path.join(Deno.cwd(), "input");

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
  team: Array<Character<CharacterClass>> | undefined;
}

interface Cursor {
  value: number;
}

export function parseData(
  data: Uint8Array<ArrayBuffer>
): Array<ExtractedCharacter> {
  const team: Array<ExtractedCharacter> = [];

  const cursor: Cursor = { value: 0 };
  const teamLength = getInteger(data, cursor, 2);
  for (let indexCharacter = 0; indexCharacter < teamLength; indexCharacter++) {
    // TODO: #12 - Compare the expected size with the number of bytes read
    // deno-lint-ignore no-unused-vars
    const characterSize = getInteger(data, cursor, 2);

    // Sauvegarde de la position avant de lire le checksum
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

    const extractedCharacter: ExtractedCharacter = {
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
      checksum: characterChecksum,
    };

    team.push(extractedCharacter);

    /*
    console.log("characterSize", characterSize.toString(16));
    console.log("characterChecksum", characterChecksum.toString(16));
    console.log("extractedCharacter", extractedCharacter);

    const spellsHex = spellsCharacter.map((spell) => {
      return spell.toString(16);
    });

    console.log(spellsHex);
    */
  }

  return team;
}

function mapCorrectExtractedSpells<T extends CharacterClass>(
  classe: T,
  extractedSpells: Array<number>
): Array<ClassSpellsMap[T]> {
  return extractedSpells.map(
    (sub) => RECORD_CLASS_RECORD_CLASS_SPELL[classe][sub]
  ) as Array<ClassSpellsMap[T]>;
}

function mapCorrectExtractedEquipments(
  extractedEquipment: Array<number>
): CharacterEquipment {
  const result: CharacterEquipment = {};

  extractedEquipment.forEach((sub) => {
    if (RECORD_WEAPON_EQUIPMENT[sub]) {
      result.weapon = RECORD_WEAPON_EQUIPMENT[sub];
    } else if (RECORD_PET_EQUIPMENT[sub]) {
      result.pet = RECORD_PET_EQUIPMENT[sub];
    } else if (RECORD_HEAD_EQUIPMENT[sub]) {
      result.head = RECORD_HEAD_EQUIPMENT[sub];
    } else if (RECORD_CAPE_EQUIPMENT[sub]) {
      result.cape = RECORD_CAPE_EQUIPMENT[sub];
    } else {
      result.dofus = RECORD_DOFUS_EQUIPMENT[sub];
    }
  });

  return result;
}

function mapCorrectExtractedCharacter(
  extractedCharacter: ExtractedCharacter
): Character<CharacterClass> {
  const classe = RECORD_CLASS[extractedCharacter.class];
  return {
    classe: RECORD_CLASS[extractedCharacter.class],
    name: extractedCharacter.name,
    sexe: SEXE_RECORD[extractedCharacter.sexe],
    spells: mapCorrectExtractedSpells(classe, extractedCharacter.spells),
    equipments: mapCorrectExtractedEquipments(extractedCharacter.equipments),
    skinGame: RECORD_SKIN_GAME[extractedCharacter.skinGame],
    skinColor: extractedCharacter.skinColor,
    checksum: extractedCharacter.checksum,
  };
}

export function readExtractedData(
  extractedTeam: Array<ExtractedCharacter>
): Array<Character<CharacterClass>> | undefined {
  let result: Array<Character<CharacterClass>> | undefined;

  if (isExtractedTeamCorrect(extractedTeam)) {
    result = extractedTeam.map((sub) => mapCorrectExtractedCharacter(sub));
  }

  return result;
}

function parseAtd(filePath: string): FileParsing {
  const data = Deno.readFileSync(filePath);
  const extractedTeam = parseData(data);
  const team = readExtractedData(extractedTeam);
  console.log(team);

  return {
    file: path.resolve(filePath),
    team,
  };
}

// TODO: #13 - Write the convertTeamToAtd
// deno-lint-ignore no-unused-vars
function convertTeamToAtd(
  // deno-lint-ignore no-unused-vars
  team: Array<Character<CharacterClass>>
): Array<number> {
  return [0x00];
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
    } else {
      inputFiles.forEach((sub) => {
        parseAtd(sub.path);
      });
    }
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
