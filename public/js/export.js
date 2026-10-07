// Erzeugt bei Bedarf eine einzelne HTML-Datei mit eingebetteten Bildern,
// Styles und Skripten. Das GitHub-Projekt bleibt in lesbare Dateien aufgeteilt.
let standaloneTemplatePromise = null;

async function loadExportFile(path) {
  const response = await fetch(new URL(path, document.baseURI));
  if (!response.ok) throw new Error('Datei nicht geladen: ' + path);
  return response;
}

async function imageDataURL(path) {
  if (path.startsWith('data:')) return path;
  const blob = await (await loadExportFile(path)).blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Bild konnte nicht eingebettet werden.'));
    reader.readAsDataURL(blob);
  });
}

async function makeStandaloneTemplate() {
  const doc = new DOMParser().parseFromString(pristine, 'text/html');
  const styles = [...doc.querySelectorAll('link[rel="stylesheet"]')];
  const scripts = [...doc.querySelectorAll('script[src]')];
  const pictureEntries = Object.entries(PICTURES);
  const [pictures, hunefer, cssTexts, jsTexts] = await Promise.all([
    Promise.all(pictureEntries.map(async ([id, path]) => [id, await imageDataURL(path)])),
    imageDataURL(HUNEFER),
    Promise.all(styles.map(async node => (await loadExportFile(node.getAttribute('href'))).text())),
    Promise.all(scripts.map(async node => (await loadExportFile(node.getAttribute('src'))).text()))
  ]);

  styles.forEach((node, i) => {
    const style = doc.createElement('style');
    style.textContent = cssTexts[i];
    node.replaceWith(style);
  });
  scripts.forEach((node, i) => {
    let code = jsTexts[i];
    if (node.getAttribute('src') === 'js/bilder.js') {
      code = 'const PICTURES = ' + JSON.stringify(Object.fromEntries(pictures)) + ';\n' +
        'const HUNEFER = ' + JSON.stringify(hunefer) + ';';
    }
    const script = doc.createElement('script');
    script.textContent = code.replace(/<\/script/gi, '<\\/script');
    node.replaceWith(script);
  });
  return '<!doctype html>\n' + doc.documentElement.outerHTML;
}

async function exportAsset(item) {
  const button = document.querySelector('#export');
  const status = document.querySelector('#export-status');
  button.disabled = true;
  status.hidden = false;
  status.textContent = 'HTML-Datei wird vorbereitet …';
  try {
    if (!standaloneTemplatePromise) {
      standaloneTemplatePromise = makeStandaloneTemplate().catch(error => {
        standaloneTemplatePromise = null;
        throw error;
      });
    }
    const template = await standaloneTemplatePromise;
    const html = template.replace('<body>', '<body data-only="' + item.id + '">');
    download('Aegypten-' + String(item.id).padStart(2, '0') + '.html', html, 'text/html;charset=utf-8');
    status.textContent = 'Baustein ' + item.id + ': HTML-Datei mit Bildern heruntergeladen.';
  } catch (error) {
    status.textContent = location.protocol === 'file:'
      ? 'Für den Export öffne die Werkbank über Netlify oder den lokalen Webserver aus der README.'
      : 'Der Download konnte nicht vorbereitet werden. Prüfe die Verbindung und versuche es erneut.';
  } finally {
    button.disabled = false;
  }
}
