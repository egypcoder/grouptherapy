# GroupTherapy Record Label Website

## Overview

GroupTherapy is a comprehensive record label website featuring a public-facing site for music discovery and fan engagement, combined with an admin dashboard for content management. The platform showcases releases, artists, events, and includes an integrated 24/7 streaming radio player. Built with React, Express, and PostgreSQL, the site emphasizes a media-rich, dark-mode-optimized experience inspired by major record labels like Interscope Records and modern platforms like Apple Music and Spotify.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite for build tooling

**Routing**: Wouter for lightweight client-side routing with separate public and admin route hierarchies

**UI Framework**: Shadcn/UI components built on Radix UI primitives, configured for a "new-york" style with dark mode support via Tailwind CSS

**State Management**: 
- TanStack Query (React Query) for server state and API data fetching with aggressive caching
- React Context for global radio player state and theme management
- Local component state via React hooks

**Styling**: 
- Tailwind CSS with custom design tokens for colors, spacing, and typography
- CSS variables for theme switching (light/dark modes)
- Custom font stack: Space Grotesk (headlines), Geist (body), Geist Mono (monospace)

**Animation**: Framer Motion for page transitions, carousels, and interactive elements

**Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript

**API Design**: RESTful API architecture with all routes prefixed under `/api`

**Static File Serving**: Express static middleware serves the compiled Vite build from `dist/public`, with SPA fallback to `index.html`

**Development Setup**: 
- Vite dev server integrated as Express middleware for HMR during development
- Separate build process using esbuild for server and Vite for client
- Server dependencies bundled to reduce cold start syscalls

**Storage Interface**: Abstract `IStorage` interface with in-memory implementation (`MemStorage`) designed for easy swap to database-backed storage

### Data Storage

**Database**: PostgreSQL configured via Drizzle ORM

**Schema Design** (`shared/schema.ts`):
- **users**: Admin authentication with role-based access (admin, editor, contributor)
- **artists**: Artist roster with social links, Spotify integration, and featured flags
- **releases**: Music releases with genre tags, streaming platform URLs, preview audio, and campaign flags
- **events**: Event listings with venue info, ticketing, RSVP capability, and geo data
- **playlists**: Curated playlists with Spotify integration
- **posts**: Blog/news CMS with categories, scheduling, and SEO fields
- **videos**: Video content with YouTube integration and categorization
- **radioShows**: Radio show schedule with host information and time slots
- **pressAssets**: Press kit materials and downloadable assets
- **contacts**: Contact form submissions with categorization
- **teamMembers**: Team/staff directory

**ORM**: Drizzle ORM with Drizzle-Zod for runtime validation

**Migrations**: Managed via `drizzle-kit` with migrations stored in `/migrations`

### Authentication & Authorization

**Strategy**: Role-based access control with three levels (admin, editor, contributor)

**Session Management**: Designed for session-based auth (connect-pg-simple package included for PostgreSQL session store)

**Current Implementation**: Storage interface includes user CRUD methods; full auth flow to be implemented

### Media & External Services

**Spotify Integration**: 
- Spotify Web API SDK for fetching artist, album, and track data
- Deep-linking to Spotify for streaming
- Album/track preview support

**Radio Streaming**: 
- Global audio player context manages streaming state
- Demo stream configured (Zeno.fm)
- Support for live streaming metadata and show scheduling

**Image Handling**: External URLs stored in database; future implementation may include Supabase storage or CDN integration

**Video Platform**: YouTube integration for music videos, behind-the-scenes content, and event aftermovies

### Build & Deployment

**Build Process**: 
1. Client built with Vite → `dist/public`
2. Server built with esbuild → `dist/index.cjs`
3. Select dependencies bundled to reduce file I/O on startup

**Environment Variables**: 
- `DATABASE_URL`: PostgreSQL connection string (required for production)
- `NODE_ENV`: development/production mode switching
- `SESSION_SECRET`: Secret key for session management
- See `.env.example` for complete list

**Development**: `npm run dev` starts Express with Vite middleware for HMR

**Production**: `npm run build` then `npm start` serves compiled static assets

### Vercel Deployment

The project is configured for Vercel deployment with serverless functions:

**Key Files**:
- `api/index.ts`: Vercel serverless function handler
- `vercel.json`: Build and routing configuration
- `server/app.ts`: Refactored Express app factory (supports both local and serverless)
- `DEPLOYMENT.md`: Comprehensive deployment guide

**Architecture on Vercel**:
- Frontend: Static files served from Vercel CDN (`dist/public/`)
- API: Serverless function at `/api/*` handles all backend routes
- Sitemap: Generated dynamically via serverless function
- Client-side routing: SPA fallback to `index.html`

**To Deploy**:
1. Push to GitHub
2. Import project in Vercel Dashboard
3. Set environment variables (DATABASE_URL, SESSION_SECRET, etc.)
4. Deploy

### Design System

**Component Library**: Custom implementation of Shadcn/UI with extensive Radix UI primitives for accessibility

**Theme System**: 
- CSS custom properties for all color tokens
- Light and dark modes with system preference detection
- Stored in localStorage as `grouptherapy-theme`

**Typography Scale**: 
- Responsive sizing (mobile → desktop)
- Semantic hierarchy with Space Grotesk for impact and Geist for readability

**Layout Primitives**: 
- 12-column responsive grid
- Max-width containers (max-w-7xl)
- Consistent spacing scale (4, 6, 8, 12, 16, 20, 24px)

**Key UI Patterns**:
- Carousels with keyboard navigation and lazy loading
- Sticky/expandable radio player at bottom of viewport
- Modal overlays for video playback and forms
- Card-based content presentation with hover states

## External Dependencies

### Third-Party APIs

**Spotify Web API**: Artist, album, and track metadata retrieval for music catalog integration

**Streaming Services**: Radio stream hosting (currently demo: Zeno.fm) for 24/7 live audio

### Database

**PostgreSQL**: Primary data store accessed via Drizzle ORM with connection pooling

### UI Libraries

**Radix UI**: Headless component primitives for accessibility (dialogs, dropdowns, accordions, etc.)

**Framer Motion**: Animation library for transitions and interactive elements

**React Icons**: Icon sets (Simple Icons for brand logos, Lucide for UI icons)

### Development Tools

**TypeScript**: Type safety across client, server, and shared code

**Tailwind CSS**: Utility-first CSS with PostCSS processing

**Vercel**: Serverless deployment platform with automatic builds

## Recent Changes

- **2025-12-04**: Migrated project for Vercel deployment
  - Removed Replit-specific Vite plugins
  - Created serverless API handler (`api/index.ts`)
  - Refactored server to support both local dev and serverless modes
  - Added `vercel.json` with proper rewrites and headers
  - Created `.env.example` and `DEPLOYMENT.md` documentation
  - Updated package.json with @vercel/node types