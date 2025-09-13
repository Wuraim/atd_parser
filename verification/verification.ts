import { CharacterClass } from "../enums/class.ts";
import { RECORD_CLASS } from "../mapping/class.ts";
import {
  RECORD_HEAD_EQUIPMENT,
  RECORD_WEAPON_EQUIPMENT,
  RECORD_PET_EQUIPMENT,
  RECORD_CAPE_EQUIPMENT,
  RECORD_DOFUS_EQUIPMENT,
} from "../mapping/equipment.ts";
import { SEXE_RECORD } from "../mapping/sexe.ts";
import { RECORD_SKIN_GAME } from "../mapping/skinGame.ts";
import { RECORD_CLASS_RECORD_CLASS_SPELL } from "../mapping/spell.ts";
import { ExtractedCharacter } from "../type/character.ts";

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

function isHeadEquipment(extractedEquipment: number): boolean {
  return RECORD_HEAD_EQUIPMENT[extractedEquipment] !== undefined;
}

export function isWeaponEquipment(extractedEquipment: number): boolean {
  return RECORD_WEAPON_EQUIPMENT[extractedEquipment] !== undefined;
}

export function isPetEquipment(extractedEquipment: number): boolean {
  return RECORD_PET_EQUIPMENT[extractedEquipment] !== undefined;
}

export function isCapeEquipment(extractedEquipment: number): boolean {
  return RECORD_CAPE_EQUIPMENT[extractedEquipment] !== undefined;
}

export function isDofusEquipment(extractedEquipment: number): boolean {
  return RECORD_DOFUS_EQUIPMENT[extractedEquipment] !== undefined;
}

export function isExtractedEquipmentsCorrect(
  extractedEquipments: Array<number>
): boolean {
  let nbWeapon = 0,
    nbPet = 0,
    nbCape = 0,
    nbHead = 0,
    nbDofus = 0;

  let hasError = false;

  extractedEquipments.forEach((sub) => {
    if (isWeaponEquipment(sub)) nbWeapon++;
    else if (isPetEquipment(sub)) nbPet++;
    else if (isCapeEquipment(sub)) nbCape++;
    else if (isHeadEquipment(sub)) nbHead++;
    else if (isDofusEquipment(sub)) nbDofus++;
    else hasError = true;
  });

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

  return result;
}

export function isExtractedTeamCorrect(
  extractedTeam: Array<ExtractedCharacter>
): boolean {
  return extractedTeam.every((sub) => isExtractedCharacterCorrect(sub));
}
