import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(root, "dist");
const base = process.env.PAGES_BASE_PATH || "/allo-dechet/";
if (!/^\/[a-zA-Z0-9_-]+\/$/.test(base))
  throw new Error("Préfixe GitHub Pages invalide");
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(resolve(root, "public"), destination, { recursive: true });

async function prepare(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await prepare(path);
    else if (/\.(html|css)$/.test(entry.name)) {
      let source = await readFile(path, "utf8");
      if (entry.name.endsWith(".html")) {
        source = source.replace(/\b(href|src)="\/(?!\/)/g, `$1="${base}`);
      } else {
        source = source.replace(/url\((['"]?)\/(?!\/)/g, `url($1${base}`);
      }
      await writeFile(path, source);
    }
  }
}
await prepare(destination);
await writeFile(resolve(destination, ".nojekyll"), "");
console.log(`Site GitHub Pages prêt dans dist, préfixe ${base}`);
