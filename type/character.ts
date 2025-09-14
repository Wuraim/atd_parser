import { CharacterClass } from "../enums/class.ts";
import {
  CapeEquipment,
  DofusEquipment,
  HeadEquipment,
  PetEquipment,
  WeaponEquipment,
} from "../enums/equipment.ts";
import { CharacterSexe } from "../enums/sexe.ts";
import { CharacterSkinGame } from "../enums/skin.ts";
import { ClassSpellsMap } from "./mapClassSpell.ts";

export type CharacterEquipment = {
  weapon?: WeaponEquipment;
  pet?: PetEquipment;
  cape?: CapeEquipment;
  head?: HeadEquipment;
  dofus?: DofusEquipment;
};

export type CharacterSkinColor = {
  hairColor: number;
  skinColor: number;
  eyesColor: number;
};

export type Character<T extends CharacterClass> = {
  name: string;
  sexe: CharacterSexe;
  classe: T;
  spells: Array<ClassSpellsMap[T]>;
  equipments: CharacterEquipment;
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
