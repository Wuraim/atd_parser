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
  ZobalSpell,
} from "../enums/spell.ts";

export type Spell = FecaSpell &
  OsamodasSpell &
  EnutrofSpell &
  SramSpell &
  IopSpell &
  CraSpell &
  SadidaSpell &
  SacrieurSpell &
  PandawaSpell &
  XelorSpell &
  EcaflipSpell &
  EniripsaSpell &
  RoublardSpell &
  ZobalSpell;
