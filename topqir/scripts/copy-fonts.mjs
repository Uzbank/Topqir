// Шрифтларни (Unbounded, Manrope) node_modules'дан www/fonts га кўчиради,
// шунда илова интернетсиз ҳам тўғри шрифт билан ишлайди.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.join(root, "www", "fonts");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "files"), { recursive: true });

const want = { unbounded: ["700", "800"], manrope: ["500", "600", "700", "800"] };
let css = "";
for (const [family, weights] of Object.entries(want)) {
  const pkg = path.join(root, "node_modules", "@fontsource", family);
  for (const w of weights) {
    let src = fs.readFileSync(path.join(pkg, `${w}.css`), "utf8");
    // фақат кирилл ва лотин тўпламлари керак
    src = src.replace(/\/\*[^*]*\*\/\s*@font-face\s*{[^}]*}/g, block =>
      /(cyrillic|latin)/.test(block) && !/(greek|vietnamese)/.test(block) ? block : "");
    src = src.replace(/url\(\.\/files\/([^)]+)\)\s*format\('woff'\),?/g, "");
    src = src.replace(/url\(\.\/files\/([^)]+\.woff2)\)/g, (m, f) => {
      fs.copyFileSync(path.join(pkg, "files", f), path.join(out, "files", f));
      return `url(./files/${f})`;
    });
    css += src.replace(/,\s*;/g, ";") + "\n";
  }
}
fs.writeFileSync(path.join(out, "fonts.css"), css);
console.log("fonts →", out, fs.readdirSync(path.join(out, "files")).length, "files");
