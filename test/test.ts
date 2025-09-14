import { expect } from "@std/expect";
import { assert } from "@std/assert";
import { parseData, readExtractedData } from "../main.ts";
import { readAtdFile } from "./utils.ts";
import { CharacterClass } from "../enums/class.ts";
import { RECORD_CLASS } from "../mapping/class.ts";
import { isExtractedTeamCorrect } from "../verification/verification.ts";
import { Character } from "../type/character.ts";
import { CharacterSexe } from "../enums/sexe.ts";
import {
  EcaflipSpell,
  FecaSpell,
  IopSpell,
  OsamodasSpell,
} from "../enums/spell.ts";
import {
  CapeEquipment,
  DofusEquipment,
  HeadEquipment,
  PetEquipment,
} from "../enums/equipment.ts";
import { CharacterSkinGame } from "../enums/skin.ts";

Deno.test("The team length is 2, only eniripsa with matched spells", () => {
  const buffer = readAtdFile("correct/SPELLS5.atd");
  const teamParsed = parseData(buffer);

  expect(teamParsed.length).toBe(2);
  assert(
    teamParsed.every(
      (character) => RECORD_CLASS[character.class] === CharacterClass.Eniripsa
    )
  );

  const firstCharacter = teamParsed.find((sub) => sub.name === "UNO")!;
  expect(firstCharacter).not.toBe(undefined);

  const secondCharacter = teamParsed.find((sub) => sub.name === "DOS")!;
  expect(secondCharacter).not.toBe(undefined);

  assert(isExtractedTeamCorrect(teamParsed));
});

Deno.test("The extracted team shall be incorrect", () => {
  const buffer = readAtdFile("incorrect/SPELLS5.atd");
  const teamParsed = parseData(buffer);
  expect(isExtractedTeamCorrect(teamParsed)).toBe(false);
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

  /*
  team.forEach((sub) => console.log(JSON.stringify(sub)));

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
    checksum: 67536,
  };
  */
});
