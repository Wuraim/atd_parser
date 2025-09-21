import type { CharacterClass } from "@/enums/class.ts";
import type { EquipmentCategory } from "@/enums/equipment.ts";
import type { CharacterSexe } from "@/enums/sexe.ts";
import type { CharacterSkinGame } from "@/enums/skin.ts";
import type { ClassSpellsMap } from "@/type/mapClassSpell.ts";
import type { Equipment } from "@/type/equipment.ts";

export type CharacterEquipment<T extends EquipmentCategory> = {
  category: T;
  id: Equipment[T];
};

export type CharacterEquipments = Array<CharacterEquipment<EquipmentCategory>>;

export type CharacterSkinColor = {
  hairColor: number;
  skinColor: number;
  eyesColor: number;
};

export type CharacterSpells<T extends CharacterClass> = Array<
  ClassSpellsMap[T]
>;

export type Character<T extends CharacterClass> = {
  name: string;
  sexe: CharacterSexe;
  classe: T;
  spells: CharacterSpells<T>;
  equipments: CharacterEquipments;
  skinGame: CharacterSkinGame;
  skinColor: CharacterSkinColor;
  checksum: number;
};

export type ExtractedEquipment = {
  id: number;
  category: number;
};

export type ExtractedCharacter = {
  name: string;
  sexe: number;
  class: number;
  spells: Array<number>;
  equipments: Array<ExtractedEquipment>;
  skinGame: number;
  skinColor: {
    hairColor: number;
    skinColor: number;
    eyesColor: number;
  };
  checksum: number;
};

export type ExtractedTeam = {
  size: number;
  list: Array<ExtractedCharacter>;
};

export type Team = Array<Character<CharacterClass>>;
