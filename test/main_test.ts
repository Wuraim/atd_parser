import { expect } from "@std/expect";
import { parseData } from "../main.ts";
import { readAtdFile } from "./utils.ts";
import { CharacterClass } from "../enums/class.ts";
import { EniripsaSpell } from "../enums/spell.ts";
import { RECORD_ENIRIPSA_SPELL } from "../mapping/spell.ts";

Deno.test("La taille de l'équipe devrait être de 2", () => {
  const buffer = readAtdFile("SPELLS5.atd");
  const parsed = parseData(buffer);

  expect(parsed.length).toBe(2);
  expect(
    parsed.every((character) => character.class === CharacterClass.Eniripsa)
  );

  /*
  const firstCharacter = parsed.find((sub) => sub.name === "UNO")!;

  const unoSpellsKeys = Object.values(EniripsaSpell);
  console.log(unoSpellsKeys, EniripsaSpell);

  const extractedUnoSpells = firstCharacter.spells.map(
    (num) => RECORD_ENIRIPSA_SPELL[num]
  );

  extractedUnoSpells.every((spell) => expect(unoSpells.includes(spell)));
  */
});
