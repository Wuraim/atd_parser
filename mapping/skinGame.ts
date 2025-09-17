import { CharacterSkinGame } from "@/enums/skin.ts";
import { invertRecord } from "./utils.ts";

export const RECORD_SKIN_GAME: Record<number, CharacterSkinGame> = {
  0xfe: CharacterSkinGame.Dofus,
  0xff: CharacterSkinGame.Wakfu,
};

export const RECORD_SKIN_GAME_REVERSE = invertRecord(RECORD_SKIN_GAME);
