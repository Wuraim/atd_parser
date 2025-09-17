import { CharacterSexe } from "@/enums/sexe.ts";
import { invertRecord } from "./utils.ts";

export const SEXE_RECORD: Record<number, CharacterSexe> = {
  0x00: CharacterSexe.Male,
  0x01: CharacterSexe.Female,
};

export const SEXE_RECORD_REVERSE = invertRecord(SEXE_RECORD);
