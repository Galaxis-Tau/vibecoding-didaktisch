# Ägypten-Werkbank

69 interaktive Lernbausteine in acht Kategorien. Volle Arbeitsansicht, responsive Darstellung und eigenständige HTML-Downloads mit eingebetteten Bildern.

## Auf GitHub hochladen und mit Netlify veröffentlichen

1. ZIP entpacken und auf GitHub ein neues Repository anlegen, zum Beispiel `werkbank-aegypten`.
2. Den **Inhalt** des entpackten Ordners hochladen. `netlify.toml`, `README.md` und der Ordner `public` müssen direkt im Hauptverzeichnis des Repositorys liegen. Die ZIP-Datei selbst wird nicht hochgeladen. Bei Nutzung von GitHub Desktop werden auch `.gitignore` und `.gitattributes` mit übernommen.
3. In Netlify ein neues Projekt aus dem GitHub-Repository importieren und den gewünschten Branch auswählen, üblicherweise `main`.
4. Mit diesen Einstellungen veröffentlichen:

| Einstellung | Wert |
| --- | --- |
| Base directory | leer lassen |
| Build command | leer lassen |
| Publish directory | `public` |

Das Veröffentlichungsverzeichnis steht bereits in `netlify.toml`. Die Website braucht keine Paketinstallation, keine Zugangsschlüssel und keine Datenbank. Nach dem Verbinden mit GitHub werden neue Commits auf dem Produktionsbranch automatisch veröffentlicht.

[Netlify: dateibasierte Konfiguration](https://docs.netlify.com/build/configure-builds/file-based-configuration/)

Für einen manuellen Test per Netlify Drop kann direkt der Ordner `public` hochgeladen werden. Für dauerhafte automatische Updates empfiehlt sich die GitHub-Verbindung.

## Projektaufbau

```text
werkbank-aegypten/
├── netlify.toml              # Veröffentlichungsverzeichnis und HTTP-Header
├── README.md
├── QUELLEN.md
├── .gitignore
├── .gitattributes
├── scripts/
│   └── pruefen.mjs           # Optionale lokale Struktur- und Syntaxprüfung
└── public/
    ├── index.html            # Startseite
    ├── css/werkbank.css      # Darstellung und responsive Layouts
    ├── js/
    │   ├── bilder.js         # Zuordnung der lokalen Bilder
    │   ├── grundlagen.js     # Themen, Texte, Begriffe, gemeinsame Funktionen
    │   ├── bausteine-01-25.js
    │   ├── bausteine-26-44.js
    │   ├── bausteine-45-69.js
    │   ├── export.js         # Eigenständige HTML-Downloads
    │   └── app.js            # Kategorien, Suche und Navigation
    └── assets/images/        # Neun lokale Bilddateien
```

## Lokal ansehen

Im Projektordner ausführen, wenn Python 3 installiert ist:

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory public
```

Dann `http://localhost:8080` öffnen. Mit `Strg+C` den Server beenden. Der lokale Webserver ist insbesondere für den HTML-Export erforderlich; beim direkten Öffnen über `file://` blockieren Browser das Nachladen der Quelldateien für den Export.

Optional mit Node.js die Struktur, Skripte und Bildverweise prüfen:

```sh
node scripts/pruefen.mjs
```

## Inhalte bearbeiten

- Texte, Fachbegriffe und Themen: `public/js/grundlagen.js`.
- Aufgaben und Interaktionen: die drei Dateien `bausteine-…js`.
- Farben, Abstände und Darstellung: `public/css/werkbank.css`.
- Bilder: Dateien in `public/assets/images/` austauschen und bei neuen Dateinamen `public/js/bilder.js` anpassen.

Es gibt keinen Generierungsschritt: Änderungen in diesen Dateien sind nach dem nächsten Deployment sichtbar. Die bisherige große HTML-Datei und der alte Ordner `werkbank-v3` werden für dieses Projekt nicht benötigt.

## Bausteine weiterverwenden

Ein direkter Link lautet beispielsweise `https://DEINE-SEITE.netlify.app/#baustein-39`.

Mit **HTML herunterladen** wird ein Baustein als eigenständige Datei inklusive Darstellung, Funktionen und Bildern gespeichert. Diese Datei lässt sich offline öffnen oder in eine Lernlandschaft übernehmen. Der Download enthält die leere Aufgabe, keine eingegebenen Antworten. Ergebnisfelder mit einem eigenen Download-Button speichern Antworten separat als Textdatei.

Eingaben bleiben beim Wechsel zwischen Bausteinen innerhalb der geöffneten Seite erhalten. Beim Neuladen gehen sie verloren. Die Werkbank enthält kein Backend und überträgt keine Lernantworten an einen Server. Die Sprachausgabe nutzt die verfügbaren Stimmen des Geräts bzw. Browsers.
