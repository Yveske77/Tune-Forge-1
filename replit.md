# DAiW - Musical Intention Engine

## Overview

DAiW (Digital AI Workstation) is a musical intention engine that serves as a composer's control surface for generative AI music models. It allows users to compose musical intent through visual lanes (energy, density, brightness, vocal presence), arrange sections on a timeline, and export structured prompts for AI music generation platforms like Suno and Udio.

The application provides a visual sequencer interface where users can:
- Define song architecture (tempo, key, time signature, genres)
- Create and arrange sections (verse, chorus, bridge, etc.)
- Control musical parameters through lane-based visualization
- Compile intentions into formatted prompts for AI music generators
- Save and manage multiple project documents
- Secure user authentication with individual data isolation
- AI-powered prompt quality analysis and improvement suggestions

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
- `/components/UserMenu.tsx` - User account management and logout
- `/components/AgentPanel.tsx` - AI assistant interface for QA and improvements
- `/lib/` - Core utilities (store, compiler, API client)
- `/data/` - Static dictionaries and block definitions (genres, instruments, pro blocks)
- `/hooks/use-auth.ts` - Authentication state management hook

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Authentication**: Replit Auth (OpenID Connect) with session management
- **Rate Limiting**: Custom middleware for API protection
- **Development**: Vite dev server with HMR proxied through Express

The server handles:
- User authentication (`/api/login`, `/api/logout`, `/api/auth/user`)
- Project CRUD operations (`/api/projects`) with user isolation
- File upload/download/management (`/api/files`) with per-user storage
- AI Agent routes (`/api/agent/*`) for QA and improvements
- Static file serving in production
- Vite middleware integration in development

### Authentication System
- **Provider**: Replit OpenID Connect (supports Google, GitHub, Apple, email/password)
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **Session TTL**: 7 days
- **Protected Routes**: All `/api/projects`, `/api/files`, and `/api/agent` routes require authentication

### AI Agent System
The AI agent provides:
- **Prompt Quality Analysis**: Scores prompts (0-100) and provides optimization suggestions
- **Best Practice Search**: Researches improvements for specific topics
- **Full QA Assessment**: Comprehensive UI/functionality checks
- **Agent Logs**: Historical record of all AI agent activities

Located in:
- `/server/services/aiAgent.ts` - Core AI agent logic
- `/server/agentRoutes.ts` - API endpoints for agent features

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `/shared/schema.ts`
- **Migrations**: Drizzle Kit with `db:push` command

Current schema includes:
- `users` - User accounts (id, email, firstName, lastName, profileImageUrl)
- `sessions` - Authentication sessions
- `projects` - Musical documents stored as JSONB with userId ownership
- `user_files` - User-uploaded files with metadata
- `agent_logs` - AI agent activity history
- `conversations` - AI chat conversations
- `messages` - AI chat messages

### File Management
- **Upload Directory**: `./uploads/{userId}/`
- **Max File Size**: 10MB
- **Allowed Types**: Audio (mp3, wav, ogg), Images (png, jpeg, webp), Text/JSON
- **User Isolation**: Files stored in user-specific directories

### Security Features
- **Rate Limiting**: 
  - API: 100 requests/minute
  - Agent: 10 requests/minute
  - Uploads: 20 requests/minute
- **Input Validation**: Zod schemas for all request bodies
- **User Isolation**: Projects and files scoped to authenticated user
- **Session Security**: httpOnly cookies, secure flag, 7-day TTL

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
- **connect-pg-simple**: PostgreSQL session storage

### AI Integration
- **OpenAI**: Via Replit AI Integrations (gpt-4o, gpt-image-1)
- **Environment**: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Authentication
- **openid-client**: OpenID Connect client for Replit Auth
- **passport**: Authentication middleware
- **express-session**: Session management

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

### Subgenre Templates
The template system provides pre-configured starting points for various music genres:
- **Location**: `/client/src/data/templates.ts`, `/client/src/components/TemplateSelector.tsx`
- **Templates**: Melodic Deep House, Synthwave, Lo-Fi Hip Hop, Epic Cinematic, Indie Pop, Ambient Drone
- Each template includes: architecture presets (tempo, key, genres), lane defaults, suggested sections, instrument groups, and nuance presets

### Export System
Multi-format export functionality:
- **Location**: `/client/src/components/ExportPanel.tsx`
- **Formats**: Suno/Udio Prompt, Lyrics Text, Project JSON, MIDI Structure
- Supports copy-to-clipboard and file download

### AI Creative Suggestions
Genre-aware AI recommendations:
- **Endpoint**: `/api/agent/creative-suggestions`
- **Categories**: instruments, effects, structure, mood, production
- Integrated into AgentPanel creative tab
- **Apply Button**: Each suggestion has an "Apply" button that adds it to the project:
  - instruments: adds to Sound Palette
  - effects: adds to nuance.fx
  - production: adds to nuance.mix
  - mood: adds to nuance.vocalTone
  - structure: adds to architecture.microtags

## Recent Changes

### December 2025
- **Per-Section Layers**: Major architectural shift - layers (instruments/voices) are now managed per-section instead of globally. Each section has its own `layers` array containing independent instrument/voice selections
- **Sound Palette**: Global layers renamed to "Sound Palette" - acts as a template that sections can copy from using the "From Palette" button
- **Hierarchical Prompt Compilation**: Compiler now uses section.layers directly with hierarchical bracketing format `[Section { attr1; attr2; ... }]`
- **Legacy Deprecation**: `sectionLayerAutomation` and `setLayerAutomation` deprecated in favor of per-section layers
- Added subgenre template system with 6 pre-configured genre templates
- Implemented export panel with 4 formats (prompt, lyrics, project JSON, MIDI structure)
- Added AI creative suggestions feature for genre-aware production recommendations
- Added Replit Auth integration for secure user authentication
- Implemented user-scoped projects and files (data isolation)
- Added AI Agent system for prompt quality analysis and improvements
- Created file upload/download system with user isolation
- Added rate limiting for API protection
- Implemented AI-powered QA monitoring system
- Added continuous improvement agent for best practices research
