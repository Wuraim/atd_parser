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

export const RECORD_ENIRIPSA_SPELL: Record<number, EniripsaSpell> = {
  0x30: EniripsaSpell.Altruisme,
  0x15: EniripsaSpell.MotCuratif,
  0x19: EniripsaSpell.MotRevitalisant,
  0x16: EniripsaSpell.MotSoignant,
  0x17: EniripsaSpell.MotStimulant,
  0xa1: EniripsaSpell.MotDeffacement,
  0xa2: EniripsaSpell.MotDeJouvence,
  0x85: EniripsaSpell.MotDeRegeneration,
  0x18: EniripsaSpell.MotDeSacrifice,
  0xa3: EniripsaSpell.MotDeTorture,
};

export const RECORD_SRAM_SPELL: Record<number, SramSpell> = {
  0x49: SramSpell.AttaqueMortelle,
  0x99: SramSpell.Brume,
  0x3f: SramSpell.CoupSournois,
  0x41: SramSpell.Diversion,
  0x45: SramSpell.Double,
  0x97: SramSpell.Invisibilite,
  0x98: SramSpell.InvisibiliteDautrui,
  0x43: SramSpell.Peur,
  0x9a: SramSpell.PiegeMortel,
  0x47: SramSpell.VolDeVie,
};

export const RECORD_XELOR_SPELL: Record<number, XelorSpell> = {
  0x2b: XelorSpell.Aiguille,
  0x9d: XelorSpell.CadranDeXelor,
  0x96: XelorSpell.Contre,
  0x2e: XelorSpell.Devouement,
  0x2d: XelorSpell.FuiteDuTemps,
  0x2c: XelorSpell.Horloge,
  0x2f: XelorSpell.Momification,
  0x9b: XelorSpell.PoussiereTemporelle,
  0x2a: XelorSpell.Ralentissement,
  0x9c: XelorSpell.VolDuTemps,
};

export const RECORD_ECAFLIP_SPELL: Record<number, EcaflipSpell> = {
  0xc: EcaflipSpell.BondDuFelin,
  0xb: EcaflipSpell.EspritFelin,
  0xa0: EcaflipSpell.Fascination,
  0xf: EcaflipSpell.Guigne,
  0x9f: EcaflipSpell.Loterie,
  0x9e: EcaflipSpell.Perception,
  0xa: EcaflipSpell.PileOuFace,
  0x86: EcaflipSpell.Roulette,
  0xd: EcaflipSpell.ToutOuRien,
  0xe: EcaflipSpell.Trefle,
};

export const RECORD_FECA_SPELL: Record<number, FecaSpell> = {
  0x21: FecaSpell.ArmureAvalanche,
  0x20: FecaSpell.ArmureOrageuse,
  0x1f: FecaSpell.AttaqueNuageuse,
  0x24: FecaSpell.BouclierFeca,
  0x89: FecaSpell.Bulle,
  0x23: FecaSpell.Faiblesse,
  0x22: FecaSpell.Immunite,
  0x8a: FecaSpell.Rebond,
  0x8b: FecaSpell.Treve,
  0x8c: FecaSpell.Teleportation,
};

export const RECORD_OSAMODAS_SPELL: Record<number, OsamodasSpell> = {
  0x6e: OsamodasSpell.Bouftou,
  0x37: OsamodasSpell.BenedictionAnimale,
  0x8e: OsamodasSpell.Carapace,
  0x3d: OsamodasSpell.Corbeau,
  0x8f: OsamodasSpell.Craqueleur,
  0x90: OsamodasSpell.CriDeLours,
  0x39: OsamodasSpell.Fouet,
  0x8d: OsamodasSpell.PiqureMotivante,
  0x6f: OsamodasSpell.Prespic,
  0x33: OsamodasSpell.Tofu,
};

export const RECORD_ENUTROF_SPELL: Record<number, EnutrofSpell> = {
  0x27: EnutrofSpell.Acceleration,
  0x93: EnutrofSpell.Corruption,
  0x31: EnutrofSpell.ForceDeLage,
  0x94: EnutrofSpell.Fossilisation,
  0x26: EnutrofSpell.LancerDePiece,
  0x25: EnutrofSpell.Maladresse,
  0x95: EnutrofSpell.MaladresseDeMasse,
  0x28: EnutrofSpell.PelleFantomatique,
  0x29: EnutrofSpell.PelleMasacrante,
  0x91: EnutrofSpell.TaniereDesRoches,
};
