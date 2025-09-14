# atd-converter (Deno/JSR + npm)

Convert Arena “.atd” team files to JSON, and back.

Status: Work in progress — not published to JSR or npm yet.  
Note: This project is not affiliated with the game or its creators.

---

## What is an .atd file?

An “.atd” file is the team export format used by the game (e.g., Dofus Arena Confrontation/Arena-like titles). It contains the team composition and related metadata.

This module provides functions to:
- Decode an .atd file into a typed JSON object.
- Encode a team JSON object back into a valid .atd file.

---

## Features

- Parse .atd → JSON
- Serialize JSON → .atd
- First‑class TypeScript (Deno)
- Zero runtime dependencies (planned)
- Dual distribution: JSR (Deno) and npm (Node.js), using a converter/bridge during publish (e.g., via a tool such as Oak or similar)

---

## Installation / Import

Not published yet. Two options are planned:

### 1) Deno (local development or via JSR)

```ts
// main.ts
import { parseAtd, serializeAtd, type TeamJson } from "./mod.ts";

// or, once published on JSR:
import { parseAtd, serializeAtd, type TeamJson } from "jsr:@your-scope/atd-converter@^0.1.0";
```

### 2) Node.js (via npm, planned)
```
# once published
npm install @your-scope/atd-converter
# or
pnpm add @your-scope/atd-converter
# or
yarn add @your-scope/atd-converter
```

```js
// ESM
import { parseAtd, serializeAtd } from "@your-scope/atd-converter";

// CommonJS
const { parseAtd, serializeAtd } = require("@your-scope/atd-converter");
```

Publishing to npm will be done via a converter/bridge (e.g., Deno → npm tooling such as Oak or similar), so the same API is available in Node.js.

Example deno.json
```json
{
  "tasks": {
    "dev": "deno run --watch main.ts",
    "test": "deno test --allow-read test/test.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1",
    "@std/expect": "jsr:@std/expect@^1.0.17",
    "@std/fs": "jsr:@std/fs@^1.0.19",
    "@std/path": "jsr:@std/path@^1.1.2"
  }
}
```

Quick start
Read an .atd, convert to JSON, modify, and write back:
```ts
// examples/roundtrip.ts
import { parseAtd, serializeAtd, type Character } from "./mod.ts";

const input = await Deno.readFile("MyTeam.atd"); // Uint8Array
const team: Array<Character> = parseAtd(input);
console.log("Team name:", team.name);

// Edit
team.name = "My Edited Team";

// Re‑encode
const out = serializeAtd(team); // Uint8Array
await Deno.writeFile("MyEditedTeam.atd", out);
```

Best practices:

Preserve unknown/undocumented fields in extras to avoid data loss.
Keep id mapping tables (heroes/items/spells) in a separate module and document them.

### How to export a team in the game
In the game, open the team export screen. The game shows the path to the generated .atd file.
<img width="400" height="1000" alt="export step 1" src="https://github.com/user-attachments/assets/b9b65717-986c-4049-8554-7d4ed43907ea" />
<img width="400" height="1000" alt="export step 2" src="https://github.com/user-attachments/assets/6c96ad98-fba1-4fd2-97ab-220bc3f0a6ef" />

### Requirements

Deno (current stable)
TypeScript included
Node.js LTS (for the npm package, once published)

Deno tasks

Dev: deno task dev (runs main.ts with watch)
Tests: deno task test (reads test/test.ts with --allow-read)

Example test:
```ts
// test/test.ts
import { assertEquals } from "jsr:@std/assert";
import { parseAtd, serializeAtd } from "../mod.ts";

Deno.test("roundtrip", async () => {
  const bin = await Deno.readFile("samples/sample.atd");
  const json = parseAtd(bin);
  const out = serializeAtd(json);
  const json2 = parseAtd(out);
  assertEquals(json2, json);
});
```

### Security and robustness

Treat .atd files as untrusted binary input.
Validate magic/header, version, section lengths, and checksum (if present).
Reject unknown versions with a clear error, e.g., E_VERSION_UNSUPPORTED.
Fuzz tests are planned to detect corruption/edge cases.
Avoid uncontrolled memory growth when parsing; bound-read all slices.


### Roadmap
 Finalize the public JSON schema
 Publish a pre‑release on JSR
 Publish the npm package (converted from the Deno module so the same API works in Node.js; via a converter such as Oak or similar)
 Deno CLI:
deno run -A jsr:@your-scope/atd-converter decode file.atd > team.json
deno run -A jsr:@your-scope/atd-converter encode team.json > file.atd

 Robust test corpus and samples
 Game data version compatibility matrix
 Comprehensive docs and examples


### Contributing
Issues and PRs are welcome. Before submitting:
deno fmt && deno lint && deno task test

### License
MIT (to be confirmed).All trademarks are the property of their respective owners. This project is independent and provided for interoperability purposes only.
