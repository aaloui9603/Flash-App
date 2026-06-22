# Flashback — Deine persönliche Lernkartei-App

> Eine moderne Lernkartei-App mit KI-Unterstützung, Rich-Text-Editor, Statistiken und Dark Mode — gebaut mit Vue 3, Vite, Supabase und der Anthropic API.

---

## Projektbeschreibung

**Flashback** ist eine vollständige Lernkartei-Webanwendung, die ich im Rahmen meines Praktikums bei Einmahl WebSolution GmbH als Fachinformatikerin für Anwendungsentwicklung entwickelt habe.

Die App richtet sich an Lernende, die ihre Webentwicklungskenntnisse mit einem smarten, personalisierten System vertiefen möchten — ohne auf externe Plattformen angewiesen zu sein.

Das besondere Merkmal: **BlueBooster**, ein integrierter KI-Lernassistent auf Basis der Anthropic Claude API, begleitet die Nutzerin beim Lernen und kann nach 3 fehlgeschlagenen Versuchen automatisch die Antwort liefern.

---

## Tech-Stack

| Technologie | Version | Verwendungszweck |
|---|---|---|
| Vue 3 | ^3.5.34 | Frontend-Framework (Composition API) |
| Vite | ^8.0.12 | Build-Tool & Dev-Server |
| Tailwind CSS | ^4.3.1 | Utility-First Styling |
| SCSS | ^1.101.0 | Design-System & Glassmorphismus |
| Supabase | ^2.108.2 | Datenbank & Backend (PostgreSQL) |
| Pinia | ^3.0.4 | State Management |
| TipTap | ^3.26.1 | Rich-Text-Editor (Notizen & Antworten) |
| VueUse | ^14.3.0 | Composables (Dark Mode, Debounce) |
| Vue-Toastification | ^2.0.0-rc.5 | Toast-Benachrichtigungen |
| Vue Router | ^4.6.4 | Client-seitiges Routing |
| vite-plugin-pwa | ^1.3.0 | PWA & Service Worker |
| marked | - | Markdown-Rendering (BlueBooster) |
| Express | ^5.2.1 | Lokaler API-Proxy-Server |
| Anthropic Claude API | claude-sonnet-4-6 | KI-Fragengenerierung & Chatbot |

---

##  Features

### Flashcard-System
- Flashcards erstellen, bearbeiten und löschen
- Kategorie-System mit Filter
- Gelernt/Nicht-gelernt-Toggle
- 3D-Flip-Animation

###  Lern-Modus
- Alle Karten sequenziell durchgehen
- Fortschrittsbalken
- Auswertung am Ende (Gewusst / Nicht gewusst)

### Tagesfragen
- Tägliche Lernfrage aus der Datenbank
- Automatische Generierung via Anthropic API wenn leer
- Flip-Karte zum Aufdecken der Antwort
- Tagesfortschritt wird lokal gespeichert

### Übungs-Fragenkatalog
- Zufällige Prüfungsfragen via Anthropic API
- 15 verschiedene Webentwicklungs-Themen
- Rich-Text-Editor für Antworten (TipTap)
- **3-Versuch-Validierungssystem:**
  -  Richtige Antwort → blauer Rahmen
  - Falsche Antwort → dunkelpinker Rahmen
  -  Nach 3 Fehlversuchen → Musterantwort wird angezeigt
- Fragen in Supabase speicherbar

### Fragen-Bibliothek
- Alle gespeicherten Fragen in der Übersicht
- Antworten aufklappbar
- Suchfunktion
- Löschen möglich

### Notizen
- Notizen erstellen, bearbeiten und löschen
- Rich-Text-Editor mit Formatierung (fett, kursiv, unterstrichen)
- Schriftfarben & Textmarker
- Farbiges Ordner-System (8 Farben)
- Ordner-Filter-Leiste

### Statistik
- Erledigungsquote der Flashcards
- Beantwortungsquote der Tagesfragen
- Visuelle Fortschrittsbalken

### Suchfunktion
- Globale Suche über alle Inhalte
- Flashcards, Notizen und Fragen gleichzeitig
- Debouncing (300ms) via VueUse

### BlueBooster Chatbot
- KI-Lernassistent via Anthropic API
- DSGVO-konform: kein Chatverlauf wird gespeichert
- Markdown-Rendering der Antworten
- Chatverlauf jederzeit löschbar

### Design & UX
- Glassmorphismus-Design
- Dark Mode / Light Mode (via VueUse)
- PWA-Support (installierbar, Offline-fähig)
- Responsive Navbar mit allen Routen

---

## Lokales Setup

### Voraussetzungen
- Node.js ≥ 18
- npm ≥ 9
- Supabase-Account
- Anthropic API Key

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/aaloui9603/Flash-App.git
cd Flash-App

# 2. Abhängigkeiten installieren
npm install

# 3. Umgebungsvariablen einrichten (siehe unten)

# 4. App starten (Vite + API-Server gleichzeitig)
npm run start
```

### Verfügbare Scripts

```bash
npm run start    # Startet API-Server (Port 3001) + Vite (Port 5173) gleichzeitig
npm run dev      # Nur Vite (ohne API-Server — BlueBooster & Fragenkatalog funktionieren nicht)
npm run server   # Nur der Express-API-Server
npm run build    # Produktions-Build
npm run preview  # Produktions-Build lokal vorschauen
```

> **Wichtig:** Immer `npm run start` verwenden — nicht `npm run dev` — da sonst die Anthropic API nicht erreichbar ist.

---

## Umgebungsvariablen

```env
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-supabase-anon-key
ANTHROPIC_API_KEY=sk-ant-dein-api-key
```

> Die `.env` Datei darf **niemals** in Git committet werden — sie steht in `.gitignore`.

---



## Architektur-Entscheidungen

### Warum ein lokaler Express-Server?
Der Anthropic API Key darf niemals im Frontend-Code stehen. Der `server.cjs` fungiert als sicherer Proxy — er empfängt Anfragen von Vite und leitet sie mit dem API Key an die Anthropic API weiter.

### Warum Pinia mit Persistenz?
Alle Stores nutzen `pinia-plugin-persistedstate`, damit geladene Daten beim Seitenreload nicht neu von Supabase geladen werden müssen.

### Warum TipTap für Antworten?
Lernende sollen ihre Antworten strukturieren können — mit Überschriften, Listen, Farben und Textmarkern. Das fördert aktives Lernen und strukturiertes Denken.

---

## PWA

Die App ist als Progressive Web App installierbar:
- **Desktop:** Installationsbutton in der Adressleiste
- **iOS:** Safari → Teilen → Zum Home-Bildschirm
- **Android:** Chrome → Menü → App installieren

---

## Datenschutz (DSGVO)

- Der **BlueBooster Chatbot** speichert keine personenbezogenen Daten
- Der Chatverlauf existiert nur im Arbeitsspeicher (flüchtiger State)
- Die einzige localStorage-Nutzung: DSGVO-Einwilligung (`blueBooster_dsgvo_akzeptiert`)
- Supabase läuft auf EU-Servern

---



