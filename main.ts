import * as path from "@std/path";
import {
  Character,
  CharacterEquipment,
  ExtractedCharacter,
  ExtractedEquipment,
} from "./type/character.ts";
import { CharacterClass } from "./enums/class.ts";
import { isExtractedTeamCorrect } from "./verification/verification.ts";
import { RECORD_CLASS } from "./mapping/class.ts";
import { SEXE_RECORD } from "./mapping/sexe.ts";
import { RECORD_CLASS_RECORD_CLASS_SPELL } from "./mapping/spell.ts";
import { RECORD_SKIN_GAME } from "./mapping/skinGame.ts";
import {
  RECORD_CAPE_EQUIPMENT,
  RECORD_CATEGORY_EQUIPMENT,
  RECORD_DOFUS_EQUIPMENT,
  RECORD_HEAD_EQUIPMENT,
  RECORD_PET_EQUIPMENT,
  RECORD_WEAPON_EQUIPMENT,
} from "./mapping/equipment.ts";
import { ClassSpellsMap } from "./type/mapClassSpell.ts";
import { EquipmentCategory } from "./enums/equipment.ts";

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
): Array<ExtractedEquipment> {
  const result = [];

  const offsetEnd = cursor.value + byteLength;
  while (cursor.value < offsetEnd) {
    const category = getInteger(buffer, cursor, 2);
    const id = getInteger(buffer, cursor, 4);
    result.push({ category, id });
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

function mapCorrectExtractedEquipment(
  characterEquipment: CharacterEquipment,
  extractedEquipment: ExtractedEquipment
): void {
  const category = RECORD_CATEGORY_EQUIPMENT[extractedEquipment.category];
  switch (category) {
    case EquipmentCategory.Weapon:
      characterEquipment.weapon =
        RECORD_WEAPON_EQUIPMENT[extractedEquipment.id];
      break;
    case EquipmentCategory.Pet:
      characterEquipment.pet = RECORD_PET_EQUIPMENT[extractedEquipment.id];
      break;
    case EquipmentCategory.Cape:
      characterEquipment.cape = RECORD_CAPE_EQUIPMENT[extractedEquipment.id];
      break;
    case EquipmentCategory.Head:
      characterEquipment.head = RECORD_HEAD_EQUIPMENT[extractedEquipment.id];
      break;
    case EquipmentCategory.Dofus:
      characterEquipment.dofus = RECORD_DOFUS_EQUIPMENT[extractedEquipment.id];
      break;
  }
}

function mapCorrectExtractedEquipments(
  extractedEquipment: Array<ExtractedEquipment>
): CharacterEquipment {
  const result: CharacterEquipment = {};

  extractedEquipment.forEach((sub) =>
    mapCorrectExtractedEquipment(result, sub)
  );

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
