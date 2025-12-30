DAiW – Digital AI Workstation (Tune‑Forge‑1)

DAiW (short for Digital AI Workstation) is a musical intention engine and prompt‑writing tool designed for generative music platforms such as Suno and Udio. Instead of drawing waveforms in a DAW, DAiW lets you sculpt intent: you paint energy curves, density, brightness and vocal presence, arrange sections like verse and chorus, and then export everything as structured prompts for AI models. The goal is to give both musicians and non‑musicians an accessible way to orchestrate complex musical ideas without learning a traditional DAW.

Key Features

Some highlights of what DAiW provides:

Intent‑First Sequencer – Compose songs by drawing lanes (energy, density, brightness, vocal presence) and arranging sections on a timeline. The UI uses a tube metaphor, letting you paint how the song evolves over time
github.com
.

Structured Prompt Compilation – A compiler turns your document into platform‑specific prompts. It supports bracket notation for hard parameters like tempo and key, parentheses for nuance, and validates Suno’s character limits
github.com
.

Adaptive & Pro Blocks – Drag‑and‑drop pre‑built Part Blocks to quickly insert builds, drops, breaks or outros. An adaptive engine scales block intensity based on neighbouring sections, so a “Chorus Lift” will automatically raise energy relative to the previous section.

Library & Templates – Save your own loops, FX chains, or arrangement templates and reuse them in new projects. The /client/src/data/templates.ts file includes ready‑made subgenre templates such as Melodic Deep House, Synthwave, Lo‑Fi Hip Hop and Epic Cinematic with preset tempos, keys and lane defaults
github.com
.

Multi‑Format Export – Export your project as a Suno/Udio prompt, lyrics text, JSON file or MIDI structure. The export panel handles copy‑to‑clipboard and file downloads for each format
github.com
.

AI Creative Assistance – An integrated AI agent analyses your prompts, scores quality, suggests best practices and can research improvements. It also offers genre‑aware creative suggestions for instruments, effects, structure and mood
github.com
github.com
.

User Accounts & Isolation – The server runs an Express API with Replit OpenID Connect authentication. Projects and files are stored per user, and rate limits protect the API
github.com
github.com
.

Repository Layout

This project follows a client / server / shared monorepo pattern. Below is a high‑level overview of the main folders and files:

Path	Purpose
client/	React 18 app built with Vite and TypeScript. Contains the sequencer UI, drag‑and‑drop block system, export panel, templates and AI agent panel. Uses Zustand for state, TanStack Query for API calls, Tailwind CSS and shadcn/ui components
github.com
.
server/	Node.js + Express backend exposing a JSON API under /api/. Handles authentication, project CRUD, file uploads, and AI agent routes. Integrates Replit Auth via OpenID Connect, uses PostgreSQL via Drizzle for persistence, and applies rate limiting
github.com
github.com
.
shared/	Shared TypeScript types and database schema definitions. Includes the Document model which describes every part of a musical intention: meta fields, architecture, nuance, layers, lanes, arrangement tracks and sections
github.com
.
script/	Utility scripts (database migration helpers, seeding, etc.).
attached_assets/	Example audio and image assets used in the application.
components.json	UI configuration for shadcn/ui and Tailwind.
drizzle.config.ts	Configuration for Drizzle ORM and database migrations.
.replit	Configuration for running the project on Replit.
package.json	Root package with workspace definitions and scripts. Dependencies include react, express, drizzle-orm, radix-ui, dnd-kit, openai and Replit tooling.
replit.md	Comprehensive technical guide for developers, describing the DAiW philosophy, architecture, data model and recent changes (December 2025 release notes)
github.com
github.com
.
Getting Started

Assuming you want to run DAiW locally with Node.js 18+ and npm installed. These steps will clone the repository, install dependencies and start both the client and server.

# 1. Clone the repository
git clone https://github.com/Yveske77/Tune-Forge-1.git
cd Tune-Forge-1

# 2. Install all dependencies
npm install

# 3. Run the development server
# This concurrently runs the Express backend and Vite frontend
npm run dev

# The app will be available at http://localhost:5173 and proxies API
# requests to the backend.

Environment variables

Some features (authentication, database connection and AI integration) require environment variables:

DATABASE_URL – connection string for your PostgreSQL database.

REPLIT_OIDC_CLIENT_ID and REPLIT_OIDC_CLIENT_SECRET – Replit Auth credentials (or your own OpenID provider).

AI_INTEGRATIONS_OPENAI_API_KEY – API key for OpenAI models used by the AI agent
github.com
.

Create a .env file at the project root and define these variables before running the app. See replit.md for more details on configuration and security settings.

Building & Deployment

To create a production build, run:

npm run build


This command uses Vite to compile the client and esbuild to bundle the server. The output appears in dist/ with server files in build/. You can deploy these artefacts to any Node‑compatible hosting service or run them with node build/index.js.

Contributing

Contributions are welcome! If you’d like to add new block presets, improve the sequencer, or fix bugs, please:

Fork the repository and create a new branch.

Install dependencies (npm install) and run the dev server to reproduce the issue or develop your feature.

Make your changes, including tests if applicable.

Submit a pull request with a clear description of what you changed and why.

For major changes or features, please open a discussion or issue first to ensure alignment with the project’s goals. Follow the existing coding style and respect the separation between client, server and shared modules.

License

This repository is published as a public template. Unless a specific license is provided, all rights remain with the original author. Please consult the project owner before using this code for commercial purposes.

DAiW reimagines what a music workstation can be: not a multitrack audio editor, but a canvas for intentional composition. We hope you enjoy building with it as much as we’ve enjoyed creating it.
