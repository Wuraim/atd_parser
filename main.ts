import { parseAtd as _parseAtd } from "@/parse.ts";
import { convertTeamToAtd as _convertTeamToAtd } from "@/unparse.ts";

/**
 * Converts an ATD buffer (Uint8Array) to a team (Team).
 * @param data - The ATD buffer to parse.
 * @returns The team extracted from the buffer.
 */
export const convertAtdToTeam: typeof _parseAtd = _parseAtd;

/**
 * Converts a team (Team) to an ATD buffer (Uint8Array).
 * @param team - The team to convert.
 * @returns The ATD buffer corresponding to the team.
 */
export const convertTeamToAtd: typeof _convertTeamToAtd = _convertTeamToAtd;

// Exports des types et enums
export * from "@/type/character.ts";
export * from "@/type/equipment.ts";
export * from "@/type/mapClassSpell.ts";
export * from "@/type/spell.ts";
export * from "@/enums/class.ts";
export * from "@/enums/equipment.ts";
export * from "@/enums/error.ts";
export * from "@/enums/sexe.ts";
export * from "@/enums/skin.ts";
export * from "@/enums/spell.ts";
