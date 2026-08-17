import { copyFile, mkdir, readdir, rename, writeFile } from "node:fs/promises";

const workerSource = `const worker = {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return assetResponse;

    const shellUrl = new URL(request.url);
    shellUrl.pathname = "/index.html";
    shellUrl.search = "";
    return env.ASSETS.fetch(new Request(shellUrl, { method: request.method }));
  },
};

export default worker;
`;

await mkdir("dist/client", { recursive: true });
const viteEntries = await readdir("dist", { withFileTypes: true });
for (const entry of viteEntries) {
  if (entry.name === "client") continue;
  await rename(`dist/${entry.name}`, `dist/client/${entry.name}`);
}

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await writeFile("dist/server/index.js", workerSource, "utf8");
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
