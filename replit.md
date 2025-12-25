# DAiW - Musical Intention Engine

## Overview

DAiW (Digital AI Workstation) is a musical intention engine that serves as a composer's control surface for generative AI music models. It allows users to compose musical intent through visual lanes (energy, density, brightness, vocal presence), arrange sections on a timeline, and export structured prompts for AI music generation platforms like Suno and Udio.

The application provides a visual sequencer interface where users can:
- Define song architecture (tempo, key, time signature, genres)
- Create and arrange sections (verse, chorus, bridge, etc.)
- Control musical parameters through lane-based visualization
- Compile intentions into formatted prompts for AI music generators
- Save and manage multiple project documents

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: Zustand for global application state
- **Data Fetching**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS v4 with custom theme variables
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Build Tool**: Vite with React plugin

The frontend follows a feature-based structure with:
- `/components/sequencer/` - Main music sequencer UI (Tube, InstrumentRack, PromptPreview)
- `/components/layout/` - Application shell and layout components
- `/components/ui/` - Reusable shadcn/ui components
- `/lib/` - Core utilities (store, compiler, API client)
- `/data/` - Static dictionaries and block definitions (genres, instruments, pro blocks)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Development**: Vite dev server with HMR proxied through Express

The server handles:
- Project CRUD operations (`/api/projects`)
- Static file serving in production
- Vite middleware integration in development

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `/shared/schema.ts`
- **Migrations**: Drizzle Kit with `db:push` command

Current schema includes:
- `users` - Basic user authentication (id, username, password)
- `projects` - Musical documents stored as JSONB with timestamps

### Document Model
The core `Document` type represents a complete musical intention with:
- `meta` - Target platform, model version, title, language, voice type
- `architecture` - Tempo, key, time signature, genre tags
- `nuance` - Mix settings, FX, vocal tone preferences
- `layers` - Instrument and voice definitions with levels/positions
- `lanes` - Global values for energy, density, brightness, vocal presence
- `arrangementTracks` - A/B arrangement variants with sections
- Each section contains type, label, content, modifiers, emphasis, tension, and per-section lane overrides

### Prompt Compiler
The `/lib/compiler.ts` module transforms Document state into platform-specific prompt formats:
- Suno format: Bracket notation `[hard params]`, parentheses `(nuance)`
- Supports section markers, global nuance, and layer definitions
- Validates character limits (style 4500, lyrics 5000)

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **pg**: Node.js PostgreSQL client

### UI Framework Dependencies
- **Radix UI**: Full primitive component set (dialog, dropdown, tabs, etc.)
- **Framer Motion**: Animation library for sequencer visualizations
- **dnd-kit**: Drag-and-drop for arrangement section reordering
- **Lucide React**: Icon library
- **cmdk**: Command palette component

### Build & Development
- **Vite**: Frontend bundler with HMR
- **esbuild**: Server-side bundling for production
- **TypeScript**: Type checking across client/server/shared code

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` - Error overlay in development
- `@replit/vite-plugin-cartographer` - Development tooling
- `@replit/vite-plugin-dev-banner` - Development environment indicator