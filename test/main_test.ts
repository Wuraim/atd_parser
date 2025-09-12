import { expect } from "@std/expect";
import { assert } from "@std/assert";
import { parseData } from "../main.ts";
import { readAtdFile } from "./utils.ts";
import { CharacterClass } from "../enums/class.ts";
import { RECORD_CLASS } from "../mapping/class.ts";
import { isExtractedTeamCorrect } from "../verification/verification.ts";

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
