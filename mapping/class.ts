import { CharacterClass } from "@/enums/class.ts";
import { invertRecord } from "@/mapping/utils.ts";

export const RECORD_CLASS: Record<number, CharacterClass> = {
  0x01: CharacterClass.Feca,
  0x02: CharacterClass.Osamodas,
  0x03: CharacterClass.Enutrof,
  0x04: CharacterClass.Sram,
  0x05: CharacterClass.Xelor,
  0x06: CharacterClass.Ecaflip,
  0x07: CharacterClass.Eniripsa,
  0x08: CharacterClass.Iop,
  0x09: CharacterClass.Cra,
  0x0a: CharacterClass.Sadida,
  0x0b: CharacterClass.Sacrieur,
  0x0c: CharacterClass.Pandawa,
  0x0d: CharacterClass.Roublard,
};

export const RECORD_CLASS_REVERSE = invertRecord(RECORD_CLASS);
