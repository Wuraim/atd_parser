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
import { Equipment } from "./equipment.ts";
import { ClassSpellsMap } from "./mapClassSpell.ts";

export type CharacterEquipment = {
  weapon: WeaponEquipment;
  pet: PetEquipment;
  cape: CapeEquipment;
  head: HeadEquipment;
  dofus: DofusEquipment;
};

export type CharacterSkinColor = {
  hairColor: number;
  skinColor: number;
  eyesColor: number;
};

export type Character<Class extends CharacterClass> = {
  name: string;
  sexe: CharacterSexe;
  class: Class;
  spells: Array<ClassSpellsMap[Class]>;
  equipments: CharacterEquipment;
  skinGame: CharacterSkinGame;
  skinColor: CharacterSkinColor;
};

export type ExtractedCharacter<Class extends CharacterClass> = {
  name: string;
  sexe: CharacterSexe;
  class: Class;
  spells: Array<ClassSpellsMap[Class]>;
  equipments: Array<number>;
  skinGame: CharacterSkinGame;
  skinColor: CharacterSkinColor;
};
