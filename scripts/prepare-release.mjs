import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { constants } from "node:fs";
import { copyFile, mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Run through release:prepare: the build and publication checks must pass first.
const root = fileURLToPath(new URL("../", import.meta.url));
const source = join(root, "dist");
const serverConfiguration = join(root, "deployment", "hostinger", ".htaccess");
const parent = join(root, "outputs", "hostinger");
const files = [];

async function inspect(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isDirectory()) await inspect(join(directory, entry.name), path + "/");
    else {
      if (!entry.isFile() || entry.isSymbolicLink()) throw new Error(`Recurso no publicable: ${path}`);
      const bytes = await readFile(join(source, path));
      files.push({ path, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
    }
  }
}

await inspect(source);
const configurationBytes = await readFile(serverConfiguration);
files.push({ path: ".htaccess", bytes: configurationBytes.length, sha256: createHash("sha256").update(configurationBytes).digest("hex") });
files.sort((a, b) => a.path.localeCompare(b.path, "en"));
const id = createHash("sha256").update(JSON.stringify(files)).digest("hex").slice(0, 12);
await mkdir(parent, { recursive: true });
const destination = await mkdtemp(join(parent, `ink-demo-${id}-`));
for (const file of files) {
  const target = join(destination, "site", file.path);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(file.path === ".htaccess" ? serverConfiguration : join(source, file.path), target, constants.COPYFILE_EXCL);
  const copy = await readFile(target);
  if (createHash("sha256").update(copy).digest("hex") !== file.sha256) throw new Error(`La copia no coincide: ${file.path}`);
}
const manifest = {
  id,
  generatedAt: new Date().toISOString(),
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  includesUncommittedChanges: execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim().length > 0,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  uploadDirectory: "site",
  files,
};
await writeFile(join(destination, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", { flag: "wx" });
console.log(`Versión preparada: ${id}\nDirectorio: ${destination}\nPublicar solo el contenido de site/ (${files.length} archivos).`);
