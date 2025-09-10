import {
  CraSpell,
  IopSpell,
  PandawaSpell,
  RoublardSpell,
  SacrieurSpell,
  SadidaSpell,
} from "../enums/spell.ts";

export const RECORD_IOP_SPELL: Record<number, IopSpell> = {
  0x04: IopSpell.Pression,
  0x08: IopSpell.GuideDeBravoure,
  0x09: IopSpell.Mutilation,
  0x07: IopSpell.Vitalite,
  0xa7: IopSpell.Amplification,
  0x06: IopSpell.Bond,
  0xa5: IopSpell.ColereDeIop,
  0xa4: IopSpell.Couper,
  0xa6: IopSpell.EpeeCeleste,
  0x05: IopSpell.EpeeDuDestin,
};

export const RECORD_CRA_SPELL: Record<number, CraSpell> = {
  0xa9: CraSpell.FlecheAbsorbante,
  0x03: CraSpell.FlecheChercheuse,
  0x12: CraSpell.FlecheEnflamme,
  0x11: CraSpell.FlecheGlacee,
  0x10: CraSpell.FlecheMagique,
  0xa8: CraSpell.FlecheDeRecul,
  0x14: CraSpell.OeilDeLynx,
  0x13: CraSpell.OeilDeTaupe,
  0xaa: CraSpell.TirTranquilisant,
  0xab: CraSpell.TourmenteVisuelle,
};

export const RECORD_SADIDA_SPELL: Record<number, SadidaSpell> = {
  0xaf: SadidaSpell.Arbre,
  0x70: SadidaSpell.LaBloqueuse,
  0x6d: SadidaSpell.LaFolle,
  0xae: SadidaSpell.LaSacrifiee,
  0xad: SadidaSpell.Poison,
  0x88: SadidaSpell.PuissanceSylvestre,
  0x4b: SadidaSpell.Ronce,
  0x55: SadidaSpell.SacrificePoupesque,
  0x4f: SadidaSpell.SavoirPoupesque,
  0x53: SadidaSpell.Tremblement,
};

export const RECORD_SACRIEUR_SPELL: Record<number, SacrieurSpell> = {
  0x1a: SacrieurSpell.Assaut,
  0x1b: SacrieurSpell.Attirance,
  0x199: SacrieurSpell.Demence,
  0x1d: SacrieurSpell.FolieSanguinaire,
  0x1e: SacrieurSpell.Furie,
  0xcc: SacrieurSpell.PiedDuSacrieur,
  0x32: SacrieurSpell.Punition,
  0x87: SacrieurSpell.Sacrifice,
  0xb0: SacrieurSpell.TransfertDeVie,
  0x1c: SacrieurSpell.Transposition,
};

export const RECORD_PANDAWA_SPELL: Record<number, PandawaSpell> = {
  0x84: PandawaSpell.Chamrak,
  0x198: PandawaSpell.CoupDeBambou,
  0x80: PandawaSpell.FlasqueExplosive,
  0x7e: PandawaSpell.Karcham,
  0x7f: PandawaSpell.Karzam,
  0x81: PandawaSpell.Pandatak,
  0x197: PandawaSpell.Picole,
  0x83: PandawaSpell.SouffleAlcoolise,
  0x82: PandawaSpell.Stabilisation,
  0xb3: PandawaSpell.StabilisationDeGroupe,
};

export const RECORD_ROUBLARD_SPELL: Record<number, RoublardSpell> = {
  0x1c2: RoublardSpell.Arsenal,
  0x1c8: RoublardSpell.BombeIncendiaire,
  0x1c9: RoublardSpell.BombeAEau,
  0x1bc: RoublardSpell.Cigue,
  0x1c3: RoublardSpell.Evanescence,
  0x1bd: RoublardSpell.Evasion,
  0x1c4: RoublardSpell.Feinte,
  0x1ba: RoublardSpell.Larcin,
  0x1c1: RoublardSpell.MauvaisOeil,
  0x1bb: RoublardSpell.Pulsar,
};
