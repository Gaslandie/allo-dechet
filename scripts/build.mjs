import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checking = process.argv.includes("--check");
const read = (path) => readFile(resolve(root, path), "utf8");
const partials = Object.fromEntries(
  await Promise.all(
    ["head", "navigation", "footer", "mobile-menu"].map(async (name) => [
      name,
      await read(`src/partials/${name}.html`),
    ]),
  ),
);
const escapeHtml = (text) =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
const render = (template, values) =>
  template.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_, key) => {
    if (!(key in values))
      throw new Error(`Variable de template inconnue : ${key}`);
    return values[key];
  });
const pages = [
  { path: "", title: "Ensemble pour une ville propre", template: "home" },
  ...JSON.parse(await read("src/pages.json")).map((page) => ({
    ...page,
    template: "construction",
  })),
];
for (const page of pages) {
  if (!/^[a-z0-9/-]*$/.test(page.path) || page.path.includes(".."))
    throw new Error("Chemin de page invalide");
  const values = {
    ...partials,
    title: escapeHtml(page.title),
    page_scripts:
      page.template === "home" ? '<script src="/app.js" defer></script>' : "",
  };
  values.head = render(partials.head, values);
  const html = await format(
    render(await read(`src/pages/${page.template}.html`), values),
    { parser: "html" },
  );
  const target = resolve(root, "public", page.path, "index.html");
  if (checking) {
    if ((await readFile(target, "utf8")) !== html)
      throw new Error(`Page à régénérer : ${page.path || "/"}`);
  } else {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html);
  }
}
console.log(`${pages.length} pages ${checking ? "vérifiées" : "générées"}.`);
