import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { preview } from "vite";

const dist = new URL("../dist/", import.meta.url);

async function runtimeFiles(directory = dist, prefix = "") {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isDirectory()) result.push(...await runtimeFiles(new URL(entry.name + "/", directory), path + "/"));
    else result.push(path);
  }
  return result;
}

for (const base of ["/", "/demo/"]) {
  test(`compiled resources work under ${base} without source-file access`, async () => {
    const server = await preview({
      configFile: false,
      base,
      appType: "mpa",
      build: { outDir: fileURLToPath(dist) },
      preview: { host: "127.0.0.1", port: 0 },
      logLevel: "silent",
    });
    try {
      const address = server.httpServer.address();
      assert.ok(address && typeof address === "object");
      const root = new URL(base, `http://127.0.0.1:${address.port}`);
      const html = await readFile(new URL("index.html", dist), "utf8");
      assert.doesNotMatch(html, /@vite\/client|\/src\/|frame-ancestors/i);
      for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        assert.ok(match[1].startsWith("./"), `Build resource must be relative: ${match[1]}`);
        const response = await fetch(new URL(match[1], root));
        assert.equal(response.status, 200);
      }
      const contentTypes = { html: /text\/html/, js: /(?:text|application)\/javascript/, css: /text\/css/, png: /image\/png/ };
      for (const path of await runtimeFiles()) {
        const response = await fetch(new URL(path, root));
        assert.equal(response.status, 200, path);
        assert.match(response.headers.get("content-type") ?? "", contentTypes[path.split(".").at(-1)], path);
        assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(new URL(path, dist)), path);
      }
      for (const path of ["src/App.tsx", "src/demoScenario.ts", ".git/config", ".env", "package.json", "docs/fidelidad-demo.md"]) {
        const response = await fetch(new URL(path, root));
        assert.equal(response.status, 404, `Source file must not be served: ${path}`);
      }
    } finally {
      server.httpServer.closeAllConnections();
      await new Promise((resolve, reject) => server.httpServer.close((error) => error ? reject(error) : resolve()));
    }
  });
}
