import {
  CharacterEquipments,
  ExtractedEquipment,
  Team,
} from "@/type/character.ts";
import {
  RECORD_CATEGORY_EQUIPMENT_REVERSE,
  getEquipmentReverseRecord,
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
import { Spell } from "./type/spell.ts";
import { RECORD_CLASS_REVERSE } from "@/mapping/class.ts";
import { RECORD_SKIN_GAME_REVERSE } from "@/mapping/skinGame.ts";
import { SEXE_RECORD_REVERSE } from "@/mapping/sexe.ts";

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

function writeEquipments(equipments: CharacterEquipments, arr: number[]) {
  const extractedEquipments =
    characterEquipmentToExtractedEquipments(equipments);
  extractedEquipments.forEach((equipment) => {
    writeInteger(equipment.category, 2, arr);
    writeInteger(equipment.id, 4, arr);
  });
}

export function convertTeamToAtd(team: Team): Uint8Array {
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
  equipments: CharacterEquipments
): ExtractedEquipment[] {
  return equipments.map((equipment) => {
    const category = RECORD_CATEGORY_EQUIPMENT_REVERSE[equipment.category];
    const reverseRecord = getEquipmentReverseRecord(category);
    return {
      category,
      id: reverseRecord[equipment.id as keyof typeof reverseRecord],
    };
  });
}
