# Chochichoderdu

Rezepte aus dem Internet importieren und automatisch in Thermomix TM7-Schritte umwandeln.

**Live:** [chochichoderdu.vercel.app](https://chochichoderdu.vercel.app)

## Features

- **Rezept-Import:** URL einfuegen, Rezept wird automatisch extrahiert (JSON-LD / Fallback)
- **KI-Konvertierung:** Rezepte werden via LLM in praezise Thermomix TM7-Schritte umgewandelt
- **Portionenrechner:** Zutatenmengen dynamisch fuer 1-8 Personen umrechnen
- **Ernaehrungsoptionen:** Kinderfreundlich, vegetarisch oder vegan - direkt beim Import waehlbar
- **Schweizerhochdeutsch:** Alle Rezepte werden in Schweizer Begriffe uebersetzt (Rahm, Poulet, Ruebli...)
- **Masseinheiten:** Cups, oz, Fahrenheit etc. werden automatisch ins metrische System umgerechnet
- **Garzeit-Hinweise:** Bei Reis, Pasta etc. erscheint automatisch ein Hinweis zur Verpackungsangabe
- **Favoriten:** Rezepte als Favorit markieren und filtern
- **Dark Mode:** Reagiert automatisch auf die Systemeinstellung
- **PWA:** Installierbar auf iPhone und Android (Add to Homescreen)
- **Einladen:** Link zur App per E-Mail teilen

## Tech Stack

| Komponente | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Datenbank | Supabase (PostgreSQL) |
| LLM | OpenRouter (Gemini Flash / austauschbar) |
| Scraping | Cheerio + JSON-LD |
| Hosting | Vercel |
| Icons | Lucide React |

## Projektstruktur

```
src/
├── app/
│   ├── page.tsx                 # Startseite mit Rezeptliste
│   ├── layout.tsx               # Root Layout (PWA Meta, Dark Mode)
│   ├── rezept/
│   │   ├── neu/page.tsx         # Import-Flow: URL -> Scrape -> Optionen -> Konvertierung
│   │   └── [id]/page.tsx        # Rezeptdetail mit TM7-Schritten + Portionenrechner
│   └── api/
│       ├── scrape/route.ts      # Rezept von URL extrahieren
│       ├── convert/route.ts     # LLM-Konvertierung zu Thermomix-Schritten
│       └── recipes/
│           ├── route.ts         # POST: Rezept speichern
│           └── [id]/route.ts    # PATCH: Favorit | DELETE: Loeschen
├── components/
│   ├── ImportForm.tsx           # Mehrstufiger Import-Flow mit Optionen
│   ├── RecipeCard.tsx           # Rezeptkarte fuer die Liste
│   ├── RecipeSteps.tsx          # Thermomix-Schritte mit Badges
│   ├── PortionCalculator.tsx    # Zutaten-Umrechner (1-8 Portionen)
│   ├── RecipeActions.tsx        # Favorit-Toggle + Loeschen
│   ├── HomeSearch.tsx           # Suche + Favoriten-Filter
│   ├── UserName.tsx             # Name setzen (localStorage)
│   ├── InviteButton.tsx         # Einladung per E-Mail
│   └── Navbar.tsx               # Bottom Navigation
├── lib/
│   ├── scraper.ts               # JSON-LD + Cheerio Rezept-Extraktion
│   ├── llm.ts                   # OpenRouter API Client
│   ├── prompts.ts               # Thermomix-Konvertierungs-Prompt (Herzstueck!)
│   ├── types.ts                 # TypeScript Interfaces
│   └── supabase/
│       ├── client.ts            # Browser Supabase Client
│       ├── server.ts            # Server Supabase Client
│       └── service.ts           # Service Role Client (fuer DB-Operationen)
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql
        └── 002_add_created_by_name.sql
```

## Setup

### Voraussetzungen

- Node.js 18+
- Supabase Projekt
- OpenRouter API Key

### Installation

```bash
npm install
```

### Umgebungsvariablen

Erstelle `.env.local` basierend auf `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=google/gemini-2.0-flash-001
```

### Datenbank

Fuehre die SQL-Migrationen im Supabase SQL Editor aus:

1. `supabase/migrations/001_initial_schema.sql` - Tabellen, RLS, Tags
2. `supabase/migrations/002_add_created_by_name.sql` - Benutzer-Name Spalte

### Entwicklung

```bash
npm run dev
```

### Deployment

Das Repo ist mit Vercel verbunden. Jeder Push auf `main` triggert ein automatisches Deployment.

## Datenbank-Schema

### recipes
| Spalte | Typ | Beschreibung |
|---|---|---|
| id | uuid | Primary Key |
| title | text | Rezepttitel |
| ingredients | jsonb | Zutaten (Amount, Unit, Name) |
| thermomix_steps | jsonb | TM7-Schritte (Zeit, Temp, Stufe, Zubehoer) |
| original_steps | jsonb | Original-Zubereitungsschritte |
| source_url | text | URL des Originalrezepts |
| image_url | text | Rezeptbild-URL |
| servings | text | Portionenangabe |
| is_favorite | boolean | Favorit-Markierung |
| created_by_name | text | Wer hat das Rezept hinzugefuegt |
| raw_scraped_data | jsonb | Rohdaten fuer spaetere Re-Konvertierung |

### tags
Vordefinierte Tags: Hauptgericht, Vorspeise, Dessert, Suppe, Beilage, Brot, Kuchen, Vegan, Vegetarisch, Schnell, Meal Prep

## LLM-Prompt

Der Konvertierungs-Prompt (`src/lib/prompts.ts`) ist das Herzstueck der App. Er kodiert:

- Thermomix TM7 Einstellungen (Stufen, Temperaturen, Zubehoer)
- Schweizerhochdeutsche Begriffe und Umschreibungen
- Masseinheiten-Umrechnung (Imperial -> Metrisch)
- Ernaehrungsvarianten (Kinderfreundlich, Vegetarisch, Vegan)
- Garzeit-Hinweise fuer variable Produkte
