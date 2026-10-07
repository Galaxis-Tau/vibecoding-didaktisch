// Ohne zusätzliche Pakete: Dateien, JavaScript, Bausteine und Bilder prüfen.
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = path.join(root, 'public');
const html = await readFile(path.join(publicDir, 'index.html'), 'utf8');
const scriptPaths = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
const stylePaths = [...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"/g)].map(match => match[1]);
assert.equal(scriptPaths.length, 7, 'Die sieben Skripte müssen eingebunden sein.');
assert.equal(stylePaths.length, 1, 'Die CSS-Datei muss eingebunden sein.');

function localPath(relative) {
  assert(!/^(?:[a-z]+:|\/)/i.test(relative), 'Nur relative lokale Dateiverweise: ' + relative);
  const resolved = path.resolve(publicDir, relative);
  assert(resolved.startsWith(publicDir + path.sep), 'Pfad außerhalb von public: ' + relative);
  return resolved;
}

const sources = [];
for (const relative of scriptPaths) {
  const text = await readFile(localPath(relative), 'utf8');
  new vm.Script(text, { filename: relative });
  sources.push(text);
}
// Prüft auch doppelte const-/let-Deklarationen über Dateigrenzen hinweg.
new vm.Script(sources.join('\n'));
for (const relative of stylePaths) await access(localPath(relative));

// Registriert die Aufgaben, führt dabei noch keine Browser-Interaktion aus.
const context = vm.createContext({});
vm.runInContext(sources.slice(0, 5).join('\n'), context);
const inventory = vm.runInContext('JSON.stringify({ids:ITEMS.map(x=>x.id),categories:CATEGORY.length,pictures:Object.values(PICTURES),hunefer:HUNEFER})', context);
const data = JSON.parse(inventory);
assert.deepEqual(data.ids, Array.from({ length: 69 }, (_, i) => i + 1));
assert.equal(data.categories, 8);
assert.equal(data.pictures.length, 8);
for (const image of [...data.pictures, data.hunefer]) await access(localPath(image));
const config = await readFile(path.join(root, 'netlify.toml'), 'utf8');
assert.match(config, /publish\s*=\s*"public"/);
console.log('OK: 69 Bausteine, 8 Kategorien, 9 Bilder, Skripte und Netlify-Verzeichnis geprüft.');
