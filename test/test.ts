import { expect } from "@std/expect";
import { assert } from "@std/assert";
import { convertTeamToAtd, parseData } from "@/main.ts";
import { readExtractedData } from "@/read.ts";
import { readAtdFile } from "@/test/utils.ts";
import { CharacterClass } from "@/enums/class.ts";
import { RECORD_CLASS } from "@/mapping/class.ts";
import { isExtractedTeamCorrect } from "@/verification/verification.ts";
import { Character } from "@/type/character.ts";
import { CharacterSexe } from "@/enums/sexe.ts";
import {
  EcaflipSpell,
  FecaSpell,
  IopSpell,
  OsamodasSpell,
  PandawaSpell,
  SacrieurSpell,
  SramSpell,
  XelorSpell,
} from "@/enums/spell.ts";
import {
  CapeEquipment,
  DofusEquipment,
  HeadEquipment,
  PetEquipment,
  WeaponEquipment,
} from "@/enums/equipment.ts";
import { CharacterSkinGame } from "@/enums/skin.ts";
import { ParsingError } from "@/enums/error.ts";

Deno.test("The team length is 2, only eniripsa with matched spells", () => {
  const buffer = readAtdFile("correct/SPELLS5.atd");
  const teamParsed = parseData(buffer);

  expect(teamParsed.list.length).toBe(2);
  assert(
    teamParsed.list.every(
      (character) => RECORD_CLASS[character.class] === CharacterClass.Eniripsa
    )
  );

  const firstCharacter = teamParsed.list.find((sub) => sub.name === "UNO")!;
  expect(firstCharacter).not.toBe(undefined);

  const secondCharacter = teamParsed.list.find((sub) => sub.name === "DOS")!;
  expect(secondCharacter).not.toBe(undefined);

  assert(isExtractedTeamCorrect(teamParsed));

  const team = readExtractedData(teamParsed)!;
  const atdData = convertTeamToAtd(team);
  expect(atdData).toEqual(buffer);
});

Deno.test("The parsing shalml throw", () => {
  const buffer = readAtdFile("incorrect/SPELLS5.atd");
  expect(() => parseData(buffer)).toThrow(ParsingError.INVALID_CHARACTER_SIZE);
});

Deno.test("Every spells are mapped", () => {
  for (let i = 1; i <= 5; i++) {
    const buffer = readAtdFile(`correct/SPELLS${i}.atd`);
    const teamParsed = parseData(buffer);
    expect(isExtractedTeamCorrect(teamParsed)).toBe(true);
  }
});

Deno.test("Every dofus are mapped", () => {
  const buffer = readAtdFile("correct/equipdofu.atd");
  const teamParsed = parseData(buffer);
  expect(isExtractedTeamCorrect(teamParsed)).toBe(true);
});

Deno.test("All equipment are mapped", () => {
  for (let i = 1; i <= 4; i++) {
    const buffer = readAtdFile(`correct/STUFF${i}.atd`);
    const teamParsed = parseData(buffer);
    expect(isExtractedTeamCorrect(teamParsed)).toBe(true);
  }
});

Deno.test("Exact team composition -> GENERAL1.atd", () => {
  const buffer = readAtdFile("correct/GENERAL1.atd");
  const teamParsed = parseData(buffer);
  const team = readExtractedData(teamParsed)!;

  expect(team).not.toBe(undefined);

  const bouclier: Character<CharacterClass.Feca> = {
    classe: CharacterClass.Feca,
    name: "Bouclier",
    sexe: CharacterSexe.Female,
    spells: [FecaSpell.Bulle, FecaSpell.BouclierFeca],
    equipments: {
      pet: PetEquipment.Moon,
      cape: CapeEquipment.CapePlumelaches,
      head: HeadEquipment.Caracoiffe,
    },
    skinGame: CharacterSkinGame.Dofus,
    skinColor: { hairColor: 0, skinColor: 8, eyesColor: 24 },
    checksum: 67536,
  };

  const lucky: Character<CharacterClass.Ecaflip> = {
    classe: CharacterClass.Ecaflip,
    name: "Lucky",
    sexe: CharacterSexe.Male,
    spells: [
      EcaflipSpell.BondDuFelin,
      EcaflipSpell.PileOuFace,
      EcaflipSpell.Trefle,
    ],
    equipments: {
      pet: PetEquipment.Chienchien,
      cape: CapeEquipment.Vegacape,
      dofus: DofusEquipment.Turquoise,
    },
    skinGame: CharacterSkinGame.Wakfu,
    skinColor: { hairColor: 7, skinColor: 20, eyesColor: 26 },
    checksum: 67186,
  };

  const tankeur: Character<CharacterClass.Iop> = {
    classe: CharacterClass.Iop,
    name: "Tankeur",
    sexe: CharacterSexe.Male,
    spells: [
      IopSpell.Bond,
      IopSpell.EpeeDuDestin,
      IopSpell.Mutilation,
      IopSpell.Vitalite,
    ],
    equipments: {
      pet: PetEquipment.Kwoko,
      cape: CapeEquipment.CapeDuWaWabbit,
      head: HeadEquipment.Dragocoiffe,
      dofus: DofusEquipment.Turquoise,
    },
    skinGame: CharacterSkinGame.Dofus,
    skinColor: { hairColor: 0, skinColor: 10, eyesColor: 26 },
    checksum: 67886,
  };

  expect(team[0]).toEqual(bouclier);
  expect(team[1]).toEqual(lucky);
  expect(team[2]).toEqual(tankeur);
});

Deno.test("Exact team composition -> GENERAL2.atd", () => {
  const buffer = readAtdFile("correct/GENERAL2.atd");
  const teamParsed = parseData(buffer);

  expect(isExtractedTeamCorrect(teamParsed)).toBe(true);

  const team = readExtractedData(teamParsed)!;

  expect(team).not.toBe(undefined);

  const craque: Character<CharacterClass.Osamodas> = {
    classe: CharacterClass.Osamodas,
    name: "Craque",
    sexe: CharacterSexe.Male,
    spells: [
      OsamodasSpell.Bouftou,
      OsamodasSpell.BenedictionAnimale,
      OsamodasSpell.Corbeau,
    ],
    equipments: {
      pet: PetEquipment.Fotome,
    },
    skinGame: CharacterSkinGame.Dofus,
    skinColor: { hairColor: 0, skinColor: 8, eyesColor: 24 },
    checksum: 66786,
  };

  const redoublante: Character<CharacterClass.Sram> = {
    classe: CharacterClass.Sram,
    name: "Redoublante",
    sexe: CharacterSexe.Female,
    spells: [SramSpell.Double, SramSpell.VolDeVie],
    equipments: {
      pet: PetEquipment.Chacha,
      head: HeadEquipment.CouronneDeNidhane,
    },
    skinGame: CharacterSkinGame.Dofus,
    skinColor: { hairColor: 0, skinColor: 8, eyesColor: 24 },
    checksum: 66636,
  };

  const miamiam: Character<CharacterClass.Sacrieur> = {
    classe: CharacterClass.Sacrieur,
    name: "MIAMAM",
    sexe: CharacterSexe.Male,
    spells: [
      SacrieurSpell.Punition,
      SacrieurSpell.FolieSanguinaire,
      SacrieurSpell.Attirance,
    ],
    equipments: {
      head: HeadEquipment.Dantgoule,
    },
    skinGame: CharacterSkinGame.Wakfu,
    skinColor: { hairColor: 0, skinColor: 8, eyesColor: 24 },
    checksum: 66886,
  };

  const RALALALALA: Character<CharacterClass.Xelor> = {
    classe: CharacterClass.Xelor,
    name: "RALALALALA",
    sexe: CharacterSexe.Female,
    spells: [XelorSpell.VolDuTemps, XelorSpell.Ralentissement],
    equipments: {
      cape: CapeEquipment.CapeBouffante,
    },
    skinGame: CharacterSkinGame.Dofus,
    skinColor: { hairColor: 0, skinColor: 8, eyesColor: 24 },
    checksum: 66736,
  };

  const ALLERLENS: Character<CharacterClass.Pandawa> = {
    classe: CharacterClass.Pandawa,
    name: "ALLERLENS",
    sexe: CharacterSexe.Male,
    spells: [PandawaSpell.Karcham, PandawaSpell.Chamrak],
    equipments: {
      weapon: WeaponEquipment.Rafeuses,
    },
    skinGame: CharacterSkinGame.Dofus,
    skinColor: { hairColor: 0, skinColor: 8, eyesColor: 24 },
    checksum: 66636,
  };

  expect(team[0]).toEqual(craque);
  expect(team[1]).toEqual(redoublante);
  expect(team[2]).toEqual(miamiam);
  expect(team[3]).toEqual(RALALALALA);
  expect(team[4]).toEqual(ALLERLENS);

  const atdData = convertTeamToAtd(team);
  expect(atdData).toEqual(buffer);
});

Deno.test("Exact team composition -> Les Roberts.atd", () => {
  const buffer = readAtdFile("correct/Les Roberts.atd");
  const teamParsed = parseData(buffer);

  expect(isExtractedTeamCorrect(teamParsed)).toBe(true);

  const team = readExtractedData(teamParsed)!;

  expect(team).not.toBe(undefined);

  const Didier: Character<CharacterClass.Sram> = {
    classe: CharacterClass.Sram,
    name: "Didier",
    sexe: CharacterSexe.Male,
    spells: [
      SramSpell.AttaqueMortelle,
      SramSpell.InvisibiliteDautrui,
      SramSpell.Diversion,
      SramSpell.Double,
      SramSpell.Invisibilite,
      SramSpell.VolDeVie,
    ],
    equipments: {
      weapon: WeaponEquipment.ArcAnge,
      pet: PetEquipment.BwakDeTerre,
      cape: CapeEquipment.CapeDuWaWabbit,
      head: HeadEquipment.Corbacoiffe,
      dofus: DofusEquipment.Vulbis,
    },
    skinGame: CharacterSkinGame.Wakfu,
    skinColor: { hairColor: 4, skinColor: 19, eyesColor: 25 },
    checksum: 68636,
  };

  const Michel: Character<CharacterClass.Ecaflip> = {
    classe: CharacterClass.Ecaflip,
    name: "Michel",
    sexe: CharacterSexe.Female,
    spells: [
      EcaflipSpell.BondDuFelin,
      EcaflipSpell.Trefle,
      EcaflipSpell.Guigne,
      EcaflipSpell.Loterie,
      EcaflipSpell.PileOuFace,
      EcaflipSpell.ToutOuRien,
    ],
    equipments: {
      weapon: WeaponEquipment.Comete,
      pet: PetEquipment.Chienchien,
      cape: CapeEquipment.CapeOrale,
      head: HeadEquipment.CoiffeDuBouftou,
      dofus: DofusEquipment.Emeraude,
    },
    skinGame: CharacterSkinGame.Dofus,
    skinColor: { hairColor: 3, skinColor: 19, eyesColor: 24 },
    checksum: 68136,
  };

  expect(team[0]).toEqual(Didier);
  expect(team[1]).toEqual(Michel);

  const atdData = convertTeamToAtd(team);
  expect(atdData).toEqual(buffer);
});
