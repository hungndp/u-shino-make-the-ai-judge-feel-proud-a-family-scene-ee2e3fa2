// Make the AI Judge Feel Proud: A Family Scene
// Entry: one short family scene (1-2 lines, max 280 chars).
// Writes the entry text to /output/entry.txt, deterministically.
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY_TEXT =
  "My son fixed the kitchen chair that has wobbled since before he was born, " +
  "then called his little sister over. He held out the screwdriver, the way I " +
  "once held it out to him, and said, 'Watch. This is how Dad taught me.'";

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");
const MAX_CHARS = 280;

// The grader runs as uid 65534 on a read-only fs with /output writable but
// its parent NOT writable: never delete the output dir itself, only clear
// what is inside it.
function clearOutputDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    rmSync(p, { recursive: statSync(p).isDirectory(), force: true });
  }
}

function validateEntry(text: string): void {
  if (text.length === 0) throw new Error("entry text is empty");
  if (text.length > MAX_CHARS) {
    throw new Error(`entry is ${text.length} chars, over the ${MAX_CHARS} limit`);
  }
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 1 || lines.length > 2) {
    throw new Error(`entry must be 1-2 lines, got ${lines.length}`);
  }
}

function main(): void {
  validateEntry(ENTRY_TEXT);
  clearOutputDir(OUT_DIR);
  writeFileSync(OUT_FILE, ENTRY_TEXT + "\n", "utf8");
  console.log(`wrote ${OUT_FILE} (${ENTRY_TEXT.length} chars)`);
}

main();
