import { ParsingError } from "@/enums/error.ts";
import {
  ExtractedEquipment,
  ExtractedTeam,
  ExtractedCharacter,
  Team,
} from "@/type/character.ts";
import { mapCorrectExtractedCharacter } from "@/map.ts";
import { isExtractedTeamCorrect } from "@/verification/verification.ts";

function getInteger(
  buffer: Uint8Array,
  cursor: Cursor,
  byteLength: number
): number {
  let result = 0;
  for (let i = 0; i < byteLength; i++) {
    try {
      result |= buffer[cursor.value + i] << (8 * (byteLength - i - 1));
    } catch {
      throw new Error(ParsingError.INVALID_FILE_SIZE);
    }
  }
  cursor.value += byteLength;

  return result;
}

function getString(
  buffer: Uint8Array,
  cursor: Cursor,
  byteLength: number
): string {
  let result = "";

  const offsetEnd = cursor.value + byteLength;
  while (cursor.value < offsetEnd) {
    try {
      result += String.fromCharCode(buffer[cursor.value]);
    } catch {
      throw new Error(ParsingError.INVALID_FILE_SIZE);
    }

    cursor.value++;
  }

  return result;
}

function getSpells(
  buffer: Uint8Array,
  cursor: Cursor,
  byteLength: number
): Array<number> {
  const result = [];

  const offsetEnd = cursor.value + byteLength;
  while (cursor.value < offsetEnd) {
    const spell = getInteger(buffer, cursor, 4);
    result.push(spell);
  }

  return result;
}

function getEquipments(
  buffer: Uint8Array,
  cursor: Cursor,
  byteLength: number
): Array<ExtractedEquipment> {
  const result = [];

  const offsetEnd = cursor.value + byteLength;
  while (cursor.value < offsetEnd) {
    const category = getInteger(buffer, cursor, 2);
    const id = getInteger(buffer, cursor, 4);
    result.push({ category, id });
  }

  return result;
}

interface Cursor {
  value: number;
}

export function parseData(data: Uint8Array<ArrayBuffer>): ExtractedTeam {
  const team: Array<ExtractedCharacter> = [];

  const cursor: Cursor = { value: 0 };
  const teamLength = getInteger(data, cursor, 2);
  for (let indexCharacter = 0; indexCharacter < teamLength; indexCharacter++) {
    const characterSize = getInteger(data, cursor, 2);

    const characterChecksum = getInteger(data, cursor, 3);

    const classCharacter = getInteger(data, cursor, 1);

    const nameSize = getInteger(data, cursor, 1);
    const nameCharacter = getString(data, cursor, nameSize);

    const sexeCharacter = getInteger(data, cursor, 1);
    const skinGameCharacter = getInteger(data, cursor, 1);

    const hairColorCharacter = getInteger(data, cursor, 1);
    const skinColorCharacter = getInteger(data, cursor, 1);
    const eyesColorCharacter = getInteger(data, cursor, 1);

    const spellsSize = getInteger(data, cursor, 2);
    const spellsCharacter = getSpells(data, cursor, spellsSize);

    const equipmentsSize = getInteger(data, cursor, 2);
    const equipmentsCharacter = getEquipments(data, cursor, equipmentsSize);

    const realCharacterSize =
      3 +
      1 +
      1 +
      nameSize +
      1 +
      1 +
      1 +
      1 +
      1 +
      2 +
      spellsSize +
      2 +
      equipmentsSize;

    const extractedCharacter: ExtractedCharacter = {
      class: classCharacter,
      name: nameCharacter,
      sexe: sexeCharacter,
      skinGame: skinGameCharacter,
      skinColor: {
        hairColor: hairColorCharacter,
        skinColor: skinColorCharacter,
        eyesColor: eyesColorCharacter,
      },
      equipments: equipmentsCharacter,
      spells: spellsCharacter,
      checksum: characterChecksum,
    };

    if (realCharacterSize === characterSize) {
      team.push(extractedCharacter);
    } else {
      throw new Error(ParsingError.INVALID_CHARACTER_SIZE);
    }
  }

  return {
    size: teamLength,
    list: team,
  };
}

export function readExtractedData(
  extractedTeam: ExtractedTeam
): Team | undefined {
  let result: Team | undefined;

  if (isExtractedTeamCorrect(extractedTeam)) {
    result = extractedTeam.list.map((sub) => mapCorrectExtractedCharacter(sub));
  }

  return result;
}

export function parseAtd(data: Uint8Array<ArrayBuffer>): Team | undefined {
  const extractedTeam = parseData(data);
  return readExtractedData(extractedTeam);
}
