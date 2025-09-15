import {
  ExtractedTeam,
  Team,
} from "./type/character.ts";
import { isExtractedTeamCorrect } from "./verification/verification.ts";
import { mapCorrectExtractedCharacter } from "./main.ts";

export function readExtractedData(
  extractedTeam: ExtractedTeam
): Team | undefined {
  let result: Team | undefined;

  if (isExtractedTeamCorrect(extractedTeam)) {
    result = extractedTeam.list.map((sub) => mapCorrectExtractedCharacter(sub));
  }

  return result;
}