import { CharacterClass } from "@/enums/class.ts";
import {
  CraSpell,
  EcaflipSpell,
  EniripsaSpell,
  EnutrofSpell,
  FecaSpell,
  IopSpell,
  OsamodasSpell,
  PandawaSpell,
  RoublardSpell,
  SacrieurSpell,
  SadidaSpell,
  SramSpell,
  XelorSpell,
} from "@/enums/spell.ts";

export type ClassSpellsMap = {
  [CharacterClass.Feca]: FecaSpell;
  [CharacterClass.Osamodas]: OsamodasSpell;
  [CharacterClass.Enutrof]: EnutrofSpell;
  [CharacterClass.Sram]: SramSpell;
  [CharacterClass.Xelor]: XelorSpell;
  [CharacterClass.Ecaflip]: EcaflipSpell;
  [CharacterClass.Eniripsa]: EniripsaSpell;
  [CharacterClass.Iop]: IopSpell;
  [CharacterClass.Cra]: CraSpell;
  [CharacterClass.Sadida]: SadidaSpell;
  [CharacterClass.Sacrieur]: SacrieurSpell;
  [CharacterClass.Pandawa]: PandawaSpell;
  [CharacterClass.Roublard]: RoublardSpell;
};
