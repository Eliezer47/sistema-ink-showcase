import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";
import test from "node:test";

const candidates = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" },
).split("\0").filter(Boolean).map((path) => path.replaceAll("\\", "/"));

const forbiddenExtensions = new Set([
  ".bak", ".backup", ".cer", ".cs", ".csproj", ".db", ".der", ".dll", ".exe",
  ".inkbackup", ".key", ".ldf", ".map", ".mdf", ".msi", ".nupkg", ".p12", ".pdb",
  ".pem", ".pfx", ".ps1", ".rar", ".resx", ".sln", ".sql", ".sqlite", ".sqlite3",
  ".xaml", ".zip", ".7z",
]);

const forbiddenPaths = [
  /(^|\/)app\/api(\/|$)/i,
  /(^|\/)(auth|backups?|database|db|drizzle|examples|migrations|prisma|server)(\/|$)/i,
  /(^|\/)chatgpt-auth\.[cm]?[jt]sx?$/i,
];

test("contains no product source, database artifacts, backups or binaries", () => {
  for (const path of candidates) {
    assert.ok(!forbiddenExtensions.has(extname(path).toLowerCase()), `Forbidden extension: ${path}`);
    assert.ok(!forbiddenPaths.some((pattern) => pattern.test(path)), `Forbidden path: ${path}`);
    assert.ok(!path.endsWith(".gitmodules"), `Submodules are not allowed: ${path}`);
  }
});

test("application code performs no network calls or browser persistence", () => {
  const appFiles = candidates.filter((path) => /^src\/.*\.[cm]?[jt]sx?$/i.test(path));
  const source = appFiles.map((path) => readFileSync(path, "utf8")).join("\n");

  for (const pattern of [
    /\bfetch\s*\(/i,
    /\baxios\b/i,
    /\bXMLHttpRequest\b/i,
    /\bWebSocket\b/i,
    /\bEventSource\b/i,
    /\bsendBeacon\b/i,
    /\blocalStorage\b/i,
    /\bsessionStorage\b/i,
    /["']use server["']/i,
    /\/api(?:\/|["'])/i,
  ]) {
    assert.doesNotMatch(source, pattern);
  }
});

test("uses explicit synthetic-data conventions and no private product markers", () => {
  const textFiles = candidates.filter(
    (path) => !path.startsWith("tests/") && /\.(css|html|json|md|mjs|ts|tsx|yml)$/i.test(path),
  );
  const source = textFiles.map((path) => readFileSync(path, "utf8")).join("\n");

  assert.match(source, /DEMO-/);
  assert.match(source, /\.example\b/);
  assert.match(source, /Datos ficticios/i);
  assert.doesNotMatch(source, /localhost:5114|SistemaInk\.Contracts|Authorization:\s*Bearer|C:\\Users\\/i);

  const emails = source.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g) ?? [];
  const allowedPublicEmails = new Set(["eliezerponcexd@gmail.com"]);
  for (const email of emails) {
    assert.ok(email.endsWith(".example") || allowedPublicEmails.has(email), `Unexpected email: ${email}`);
  }
});

test("keeps product-facing dependencies out of the direct dependency list", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const direct = new Set([...Object.keys(packageJson.dependencies ?? {}), ...Object.keys(packageJson.devDependencies ?? {})]);
  for (const dependency of ["axios", "drizzle-kit", "drizzle-orm", "mongodb", "mysql", "pg", "prisma", "sqlite"]) {
    assert.ok(!direct.has(dependency), `Forbidden direct dependency: ${dependency}`);
  }
});
