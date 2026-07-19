import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("build contains the isolated Sistema Ink visual showcase", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>Sistema Ink \| Recorrido visual<\/title>/i);
  assert.match(html, /connect-src 'none'/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);

  const assetNames = await readdir(new URL("../dist/assets/", import.meta.url));
  const javascript = (
    await Promise.all(
      assetNames.filter((name) => name.endsWith(".js")).map((name) => readFile(new URL(`../dist/assets/${name}`, import.meta.url), "utf8")),
    )
  ).join("\n");

  assert.match(javascript, /Demo visual aislada/i);
  assert.match(javascript, /Datos ficticios/i);
  assert.match(javascript, /Panel principal/i);
  assert.match(javascript, /DEMO-1048/i);
  assert.doesNotMatch(javascript, /localhost:5114|Bearer\s|SistemaInk\.Contracts/i);
});
