import {
  CharacterEquipment,
  ExtractedCharacter,
  ExtractedEquipment,
  ExtractedTeam,
  Team,
} from "@/type/character.ts";
import { ParsingError } from "@/enums/error.ts";
import { readExtractedData } from "@/read.ts";
import {
  RECORD_CATEGORY_EQUIPMENT_REVERSE,
  RECORD_WEAPON_EQUIPMENT_REVERSE,
  RECORD_PET_EQUIPMENT_REVERSE,
  RECORD_CAPE_EQUIPMENT_REVERSE,
  RECORD_HEAD_EQUIPMENT_REVERSE,
  RECORD_DOFUS_EQUIPMENT_REVERSE,
} from "@/mapping/equipment.ts";
import {
  RECORD_IOP_SPELL_REVERSE,
  RECORD_CRA_SPELL_REVERSE,
  RECORD_SADIDA_SPELL_REVERSE,
  RECORD_SACRIEUR_SPELL_REVERSE,
  RECORD_PANDAWA_SPELL_REVERSE,
  RECORD_ROUBLARD_SPELL_REVERSE,
  RECORD_ENIRIPSA_SPELL_REVERSE,
  RECORD_SRAM_SPELL_REVERSE,
  RECORD_XELOR_SPELL_REVERSE,
  RECORD_ECAFLIP_SPELL_REVERSE,
  RECORD_FECA_SPELL_REVERSE,
  RECORD_OSAMODAS_SPELL_REVERSE,
  RECORD_ENUTROF_SPELL_REVERSE,
} from "@/mapping/spell.ts";
import { CharacterClass } from "@/enums/class.ts";
import { EquipmentCategory } from "./enums/equipment.ts";
import { Spell } from "./type/spell.ts";
import { RECORD_CLASS_REVERSE } from "./mapping/class.ts";
import { RECORD_SKIN_GAME_REVERSE } from "./mapping/skinGame.ts";
import { SEXE_RECORD_REVERSE } from "./mapping/sexe.ts";

function getInteger(
  buffer: Uint8Array,
  cursor: Cursor,
  byteLength: number
): number {
  let result = 0;
  for (let i = 0; i < byteLength; i++) {
    try {
      result |= buffer[cursor.value + i] << (8 * (byteLength - i - 1));
    } catch {
      throw new Error(ParsingError.INVALID_FILE_SIZE);
    }
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
    try {
      result += String.fromCharCode(buffer[cursor.value]);
    } catch {
      throw new Error(ParsingError.INVALID_FILE_SIZE);
    }

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

interface Cursor {
  value: number;
}

export function parseData(data: Uint8Array<ArrayBuffer>): ExtractedTeam {
  const team: Array<ExtractedCharacter> = [];

  const cursor: Cursor = { value: 0 };
  const teamLength = getInteger(data, cursor, 2);
  for (let indexCharacter = 0; indexCharacter < teamLength; indexCharacter++) {
    const characterSize = getInteger(data, cursor, 2);

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

    const realCharacterSize =
      3 +
      1 +
      1 +
      nameSize +
      1 +
      1 +
      1 +
      1 +
      1 +
      2 +
      spellsSize +
      2 +
      equipmentsSize;

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

    if (realCharacterSize === characterSize) {
      team.push(extractedCharacter);
    } else {
      throw new Error(ParsingError.INVALID_CHARACTER_SIZE);
    }
  }

  return {
    size: teamLength,
    list: team,
  };
}

export function parseAtd(data: Uint8Array<ArrayBuffer>): Team | undefined {
  const extractedTeam = parseData(data);
  return readExtractedData(extractedTeam);
}

function getSpellReverseRecord(
  characterClass: CharacterClass
): Record<Spell, number> {
  switch (characterClass) {
    case CharacterClass.Iop:
      return RECORD_IOP_SPELL_REVERSE;
    case CharacterClass.Cra:
      return RECORD_CRA_SPELL_REVERSE;
    case CharacterClass.Sadida:
      return RECORD_SADIDA_SPELL_REVERSE;
    case CharacterClass.Sacrieur:
      return RECORD_SACRIEUR_SPELL_REVERSE;
    case CharacterClass.Pandawa:
      return RECORD_PANDAWA_SPELL_REVERSE;
    case CharacterClass.Roublard:
      return RECORD_ROUBLARD_SPELL_REVERSE;
    case CharacterClass.Eniripsa:
      return RECORD_ENIRIPSA_SPELL_REVERSE;
    case CharacterClass.Sram:
      return RECORD_SRAM_SPELL_REVERSE;
    case CharacterClass.Xelor:
      return RECORD_XELOR_SPELL_REVERSE;
    case CharacterClass.Ecaflip:
      return RECORD_ECAFLIP_SPELL_REVERSE;
    case CharacterClass.Feca:
      return RECORD_FECA_SPELL_REVERSE;
    case CharacterClass.Osamodas:
      return RECORD_OSAMODAS_SPELL_REVERSE;
    case CharacterClass.Enutrof:
      return RECORD_ENUTROF_SPELL_REVERSE;
  }
}

export function convertTeamToAtd(team: Team): Uint8Array {
  // Helper pour écrire un entier sur n octets
  function writeInteger(value: number, byteLength: number, arr: number[]) {
    for (let i = byteLength - 1; i >= 0; i--) {
      arr.push((value >> (8 * i)) & 0xff);
    }
  }

  // Helper pour écrire une chaîne
  function writeString(str: string, arr: number[]) {
    for (let i = 0; i < str.length; i++) {
      arr.push(str.charCodeAt(i));
    } 
  }

  // Helper pour écrire les sorts
  function writeSpells(
    characterClass: CharacterClass,
    spells: Array<Spell>,
    arr: number[]
  ) {
    const reverseRecord = getSpellReverseRecord(characterClass);
    for (const spell of spells) {
      writeInteger(reverseRecord[spell], 4, arr);
    }
  }

  function writeEquipments(equipments: CharacterEquipment, arr: number[]) {
    const extractedEquipments =
      characterEquipmentToExtractedEquipments(equipments);
    extractedEquipments.forEach((equipment) => {
      writeInteger(equipment.category, 2, arr);
      writeInteger(equipment.id, 4, arr);
    });
  }

  const arr: number[] = [];
  writeInteger(team.length, 2, arr);

  for (const character of team) {
    const nameBytes = Array.from(character.name).map((c) => c.charCodeAt(0));
    const spellsBytes: number[] = [];
    writeSpells(character.classe, character.spells, spellsBytes);
    const equipmentsBytes: number[] = [];
    writeEquipments(character.equipments, equipmentsBytes);

    // Calcul de la taille réelle du personnage
    const characterSize =
      3 + // checksum
      1 + // class
      1 + // nameSize
      nameBytes.length +
      1 + // sexe
      1 + // skinGame
      1 + // hairColor
      1 + // skinColor
      1 + // eyesColor
      2 + // spellsSize
      spellsBytes.length +
      2 + // equipmentsSize
      equipmentsBytes.length;

    writeInteger(characterSize, 2, arr);
    writeInteger(character.checksum, 3, arr);
    writeInteger(RECORD_CLASS_REVERSE[character.classe], 1, arr);
    writeInteger(nameBytes.length, 1, arr);
    writeString(character.name, arr);
    writeInteger(SEXE_RECORD_REVERSE[character.sexe], 1, arr);
    writeInteger(RECORD_SKIN_GAME_REVERSE[character.skinGame], 1, arr);
    writeInteger(character.skinColor.hairColor, 1, arr);
    writeInteger(character.skinColor.skinColor, 1, arr);
    writeInteger(character.skinColor.eyesColor, 1, arr);
    writeInteger(spellsBytes.length, 2, arr);
    arr.push(...spellsBytes);
    writeInteger(equipmentsBytes.length, 2, arr);
    arr.push(...equipmentsBytes);
  }

  return new Uint8Array(arr);
}

export function characterEquipmentToExtractedEquipments(
  equipments: CharacterEquipment
): ExtractedEquipment[] {
  const result: ExtractedEquipment[] = [];
  if (equipments.weapon !== undefined) {
    result.push({
      category: RECORD_CATEGORY_EQUIPMENT_REVERSE[EquipmentCategory.Weapon],
      id: RECORD_WEAPON_EQUIPMENT_REVERSE[equipments.weapon],
    });
  }
  if (equipments.pet !== undefined) {
    result.push({
      category: RECORD_CATEGORY_EQUIPMENT_REVERSE[EquipmentCategory.Pet],
      id: RECORD_PET_EQUIPMENT_REVERSE[equipments.pet],
    });
  }
  if (equipments.cape !== undefined) {
    result.push({
      category: RECORD_CATEGORY_EQUIPMENT_REVERSE[EquipmentCategory.Cape],
      id: RECORD_CAPE_EQUIPMENT_REVERSE[equipments.cape],
    });
  }
  if (equipments.head !== undefined) {
    result.push({
      category: RECORD_CATEGORY_EQUIPMENT_REVERSE[EquipmentCategory.Head],
      id: RECORD_HEAD_EQUIPMENT_REVERSE[equipments.head],
    });
  }
  if (equipments.dofus !== undefined) {
    result.push({
      category: RECORD_CATEGORY_EQUIPMENT_REVERSE[EquipmentCategory.Dofus],
      id: RECORD_DOFUS_EQUIPMENT_REVERSE[equipments.dofus],
    });
  }
  return result;
}
