import {
  Character,
  CharacterEquipment,
  CharacterEquipments,
  ExtractedCharacter,
  ExtractedEquipment,
} from "@/type/character.ts";
import { CharacterClass } from "@/enums/class.ts";
import { RECORD_CLASS } from "@/mapping/class.ts";
import { SEXE_RECORD } from "@/mapping/sexe.ts";
import { RECORD_CLASS_RECORD_CLASS_SPELL } from "@/mapping/spell.ts";
import { RECORD_SKIN_GAME } from "@/mapping/skinGame.ts";
import {
  RECORD_CATEGORY_EQUIPMENT,
  RECORD_CATEGORY_RECORD_ID,
} from "@/mapping/equipment.ts";
import { ClassSpellsMap } from "@/type/mapClassSpell.ts";
import { EquipmentCategory } from "@/enums/equipment.ts";
import { Equipment } from "./type/equipment.ts";

function mapCorrectExtractedSpells<T extends CharacterClass>(
  classe: T,
  extractedSpells: Array<number>
): Array<ClassSpellsMap[T]> {
  return extractedSpells.map(
    (sub) => RECORD_CLASS_RECORD_CLASS_SPELL[classe][sub]
  ) as Array<ClassSpellsMap[T]>;
}

function mapCorrectExtractedEquipment<T extends EquipmentCategory>(
  extractedEquipment: ExtractedEquipment
): CharacterEquipment<T> {
  const category = RECORD_CATEGORY_EQUIPMENT[extractedEquipment.category] as T;
  const id = RECORD_CATEGORY_RECORD_ID[category][
    extractedEquipment.id
  ] as Equipment[T];

  return { category, id };
}

function mapCorrectExtractedEquipments(
  extractedEquipments: Array<ExtractedEquipment>
): CharacterEquipments {
  return extractedEquipments.map((sub) => mapCorrectExtractedEquipment(sub));
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
