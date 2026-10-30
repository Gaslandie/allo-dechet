import { readdir, readFile } from "node:fs/promises";
import postcss from "postcss";

const files = (await readdir("public")).filter((name) => name.endsWith(".css"));
const typographyProperties = new Set([
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
]);
for (const file of files) {
  const sheet = postcss.parse(await readFile(`public/${file}`, "utf8"), {
    from: file,
  });
  sheet.walkDecls((declaration) => {
    if (
      typographyProperties.has(declaration.prop) &&
      file !== "typography.css"
    ) {
      throw new Error(
        `${file}: ${declaration.prop} doit être défini dans typography.css`,
      );
    }
  });
}
console.log("Styles valides ; typographie centralisée.");
