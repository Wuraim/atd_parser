import {
  Character,
  CharacterEquipment,
  ExtractedCharacter,
  ExtractedEquipment,
} from "@/type/character.ts";
import { CharacterClass } from "@/enums/class.ts";
import { RECORD_CLASS } from "@/mapping/class.ts";
import { SEXE_RECORD } from "@/mapping/sexe.ts";
import { RECORD_CLASS_RECORD_CLASS_SPELL } from "@/mapping/spell.ts";
import { RECORD_SKIN_GAME } from "@/mapping/skinGame.ts";
import {
  RECORD_CAPE_EQUIPMENT,
  RECORD_CATEGORY_EQUIPMENT,
  RECORD_DOFUS_EQUIPMENT,
  RECORD_HEAD_EQUIPMENT,
  RECORD_PET_EQUIPMENT,
  RECORD_WEAPON_EQUIPMENT,
} from "@/mapping/equipment.ts";
import { ClassSpellsMap } from "@/type/mapClassSpell.ts";
import { EquipmentCategory } from "@/enums/equipment.ts";

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

export function mapCorrectExtractedCharacter(
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
