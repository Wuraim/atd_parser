import { parseAtd as _parseAtd } from "./parse.ts";
import { convertTeamToAtd as _convertTeamToAtd } from "./unparse.ts";

/**
 * Converts an ATD buffer (Uint8Array) to a team (Team).
 * @param data - The ATD buffer to parse.
 * @returns The team extracted from the buffer.
 */
export const convertAtdToTeam = _parseAtd;

/**
 * Converts a team (Team) to an ATD buffer (Uint8Array).
 * @param team - The team to convert.
 * @returns The ATD buffer corresponding to the team.
 */
export const convertTeamToAtd = _convertTeamToAtd;
