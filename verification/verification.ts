import { CharacterClass } from "../enums/class.ts";
import { EquipmentCategory } from "../enums/equipment.ts";
import { RECORD_CLASS } from "../mapping/class.ts";
import {
  RECORD_HEAD_EQUIPMENT,
  RECORD_WEAPON_EQUIPMENT,
  RECORD_PET_EQUIPMENT,
  RECORD_CAPE_EQUIPMENT,
  RECORD_DOFUS_EQUIPMENT,
  RECORD_CATEGORY_EQUIPMENT,
} from "../mapping/equipment.ts";
import { SEXE_RECORD } from "../mapping/sexe.ts";
import { RECORD_SKIN_GAME } from "../mapping/skinGame.ts";
import { RECORD_CLASS_RECORD_CLASS_SPELL } from "../mapping/spell.ts";
import {
  ExtractedCharacter,
  ExtractedEquipment,
  ExtractedTeam,
} from "../type/character.ts";

export function isExtractedSpellsCorrect(
  characterClass: CharacterClass,
  extractedSpells: Array<number>
): boolean {
  const classSpellsRecord = RECORD_CLASS_RECORD_CLASS_SPELL[characterClass];
  const isListWithoutDuplicate =
    new Set(extractedSpells).size === extractedSpells.length;
  const isListNotTooLong = extractedSpells.length <= 6;

  return (
    isListNotTooLong &&
    isListWithoutDuplicate &&
    extractedSpells
      .map((sub) => classSpellsRecord[sub])
      .every((sub) => sub !== undefined)
  );
}

export function isExtractedClassCorrect(extractedClass: number): boolean {
  return RECORD_CLASS[extractedClass] !== undefined;
}

export function isExtractedSexeCorrect(extractedSexe: number): boolean {
  return SEXE_RECORD[extractedSexe] !== undefined;
}

export function isExtractedSkinGameCorrect(extractedGame: number): boolean {
  return RECORD_SKIN_GAME[extractedGame] !== undefined;
}

export function isWeaponEquipment(
  extractedEquipment: ExtractedEquipment
): boolean {
  return (
    RECORD_CATEGORY_EQUIPMENT[extractedEquipment.category] ===
      EquipmentCategory.Weapon &&
    RECORD_WEAPON_EQUIPMENT[extractedEquipment.id] !== undefined
  );
}

export function isPetEquipment(
  extractedEquipment: ExtractedEquipment
): boolean {
  return (
    RECORD_CATEGORY_EQUIPMENT[extractedEquipment.category] ===
      EquipmentCategory.Pet &&
    RECORD_PET_EQUIPMENT[extractedEquipment.id] !== undefined
  );
}

export function isCapeEquipment(
  extractedEquipment: ExtractedEquipment
): boolean {
  return (
    RECORD_CATEGORY_EQUIPMENT[extractedEquipment.category] ===
      EquipmentCategory.Cape &&
    RECORD_CAPE_EQUIPMENT[extractedEquipment.id] !== undefined
  );
}

function isHeadEquipment(extractedEquipment: ExtractedEquipment): boolean {
  return (
    RECORD_CATEGORY_EQUIPMENT[extractedEquipment.category] ===
      EquipmentCategory.Head &&
    RECORD_HEAD_EQUIPMENT[extractedEquipment.id] !== undefined
  );
}

export function isDofusEquipment(
  extractedEquipment: ExtractedEquipment
): boolean {
  return (
    RECORD_CATEGORY_EQUIPMENT[extractedEquipment.category] ===
      EquipmentCategory.Dofus &&
    RECORD_DOFUS_EQUIPMENT[extractedEquipment.id] !== undefined
  );
}

function helperEquipmentMapping(category: number): string {
  switch (category) {
    case 0:
      return "weapon";
    case 1:
      return "pet";
    case 2:
      return "cape";
    case 3:
      return "head";
    case 4:
      return "dofus";
    default:
      return "unknown";
  }
}

function helperEquipment(extractedEquipment: ExtractedEquipment): string {
  return (
    helperEquipmentMapping(extractedEquipment.category) +
    " -> " +
    extractedEquipment.id.toString(16)
  );
}

export function isExtractedEquipmentsCorrect(
  extractedEquipments: Array<ExtractedEquipment>
): boolean {
  let nbWeapon = 0,
    nbPet = 0,
    nbCape = 0,
    nbHead = 0,
    nbDofus = 0;

  let hasError = false;

  for (const sub of extractedEquipments) {
    if (isWeaponEquipment(sub)) nbWeapon++;
    else if (isPetEquipment(sub)) nbPet++;
    else if (isCapeEquipment(sub)) nbCape++;
    else if (isHeadEquipment(sub)) nbHead++;
    else if (isDofusEquipment(sub)) nbDofus++;
    else {
      hasError = true;
      console.error("Unknown equipement :", helperEquipment(sub));
      break;
    }
  }

  return (
    nbWeapon < 2 &&
    nbPet < 2 &&
    nbCape < 2 &&
    nbHead < 2 &&
    nbDofus < 2 &&
    hasError === false
  );
}

export function isExtractedCharacterCorrect(
  extractedCharacter: ExtractedCharacter
): boolean {
  let result = false;

  if (isExtractedClassCorrect(extractedCharacter.class)) {
    const supposedClass = RECORD_CLASS[extractedCharacter.class];
    result =
      isExtractedSexeCorrect(extractedCharacter.sexe) &&
      isExtractedSkinGameCorrect(extractedCharacter.skinGame) &&
      isExtractedSpellsCorrect(supposedClass, extractedCharacter.spells) &&
      isExtractedEquipmentsCorrect(extractedCharacter.equipments);
  }

  if (result === false) {
    console.error("name :", extractedCharacter.name);
  }

  return result;
}

export function isExtractedTeamCorrect(extractedTeam: ExtractedTeam): boolean {
  return (
    extractedTeam.size <= 6 &&
    extractedTeam.size === extractedTeam.list.length &&
    extractedTeam.list.every((sub) => isExtractedCharacterCorrect(sub))
  );
}
