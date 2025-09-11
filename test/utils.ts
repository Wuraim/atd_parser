export function readAtdFile(name: string): Uint8Array<ArrayBuffer> {
  return Deno.readFileSync(Deno.cwd() + "/test/teams/" + name);
}
