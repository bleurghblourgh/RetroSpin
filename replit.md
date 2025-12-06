# RetroSpin Music Player

## Overview

RetroSpin is a client-side music player web application that allows users to upload, organize, and play their personal MP3 files. The app features a retro vaporwave/80s-90s aesthetic with a spinning vinyl disk visualization, playlist management, and persistent local storage. Built as a single-page application, it runs entirely in the browser with no backend dependencies for core functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Single-page application using Wouter for client-side routing
- Component-based architecture with functional components and hooks

**State Management**
- Custom React Context (`MusicProvider`) for global music player state
- Reducer pattern for predictable state updates
- Local state management with `useState` and `useReducer` hooks
- React Query (`@tanstack/react-query`) configured for potential API integration

**UI Component Library**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Custom theme system supporting light/dark modes
- Responsive design with mobile-first approach

**Design System**
- Custom color palette with neon accent colors (cyan, magenta, blue, purple)
- Typography using Orbitron (display), Space Mono (monospace), and Inter/Poppins (body)
- Custom animations including spinning disk, equalizer bars, and hover effects
- Consistent spacing system using Tailwind's spacing scale

### Client-Side Data Layer

**Storage Strategy**
- IndexedDB for persistent storage of tracks, playlists, and settings
- Three object stores: `tracks`, `playlists`, and `settings`
- Blob storage for MP3 file data within IndexedDB
- Wrapper functions in `lib/db.ts` for CRUD operations

**Audio Processing**
- `music-metadata-browser` library for extracting MP3 metadata (artist, title, album, duration)
- HTML5 Audio API for playback control
- Custom audio player state management with queue, shuffle, and repeat functionality

**Data Models**
- Track: Contains metadata (title, artist, album, duration) and file data
- Playlist: Named collections of track IDs with creation timestamps
- LibrarySettings: User preferences for volume, shuffle, repeat, and sorting
- PlayerState: Current playback state including track, time, volume, and queue

### Component Architecture

**Key Components**
- `App.tsx`: Root component with routing and provider setup
- `AppSidebar`: Navigation with library, playlists, and upload views
- `DropZone`: Drag-and-drop file upload interface
- `SpinningDisk`: Animated vinyl record visualization
- `PlayerControls`: Playback controls (play/pause, skip, volume, shuffle, repeat)
- `LibraryView`: Track listing with search, sort, and filtering
- `PlaylistManager`: Playlist creation and management
- `NowPlayingCard`: Current track display with spinning disk

**Responsive Patterns**
- Desktop: Sidebar navigation with main content area and persistent bottom player
- Mobile: Collapsible sidebar with expandable now-playing view
- Sticky player controls on mobile with bottom sheet pattern
- Custom hooks for mobile detection (`useIsMobile`)

### File Upload & Metadata Extraction

**Upload Flow**
1. User drags MP3 files or uses file picker
2. Files are validated (MP3 format check)
3. Metadata extracted using `music-metadata-browser`
4. Tracks created with unique IDs (UUID v4)
5. Files stored in IndexedDB with metadata
6. UI updates to show new tracks in library

**Metadata Handling**
- Automatic extraction of ID3 tags from MP3 files
- Fallback to filename if metadata unavailable
- Duration calculation from audio format data
- Timestamp tracking for "recently added" sorting

### Audio Playback Architecture

**Player State Machine**
- Centralized player state in MusicContext
- Queue management with shuffle and repeat modes
- Time tracking with current position and duration
- Volume control with mute functionality
- Previous/next track navigation with queue awareness

**Playback Features**
- Continuous playback with automatic track progression
- Shuffle mode with randomized queue
- Repeat modes: off, repeat one, repeat all
- Seek functionality with slider control
- Real-time progress tracking

### Backend Structure (Minimal)

**Express Server**
- Serves static built files from `dist/public`
- Development mode: Vite middleware for HMR
- Production mode: Pre-built static files
- API routes placeholder in `server/routes.ts` (unused for core features)
- Storage interface defined but implemented as in-memory (not used by client)

**Build Process**
- Client built with Vite to `dist/public`
- Server bundled with esbuild to `dist/index.cjs`
- Dependencies bundled to reduce cold start times
- Separate development and production configurations

### Styling Approach

**Tailwind Configuration**
- Custom color system with CSS variables
- Theme-aware colors for light/dark modes
- Custom animations for spinning disk and equalizer
- Extended border radius and spacing tokens
- Custom font families loaded from Google Fonts

**Design Tokens**
- Neon colors as accent highlights
- Semantic color names (background, foreground, border, etc.)
- Card and popover variants with custom borders
- Shadow system for depth and elevation

## External Dependencies

### UI & Styling
- **Radix UI**: Headless UI primitives for accessibility (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Variant-based styling utilities
- **clsx & tailwind-merge**: Class name utilities

### Audio & Metadata
- **music-metadata-browser**: MP3 metadata extraction library
- No external audio streaming services
- No cloud storage dependencies

### Data Management
- **idb**: IndexedDB wrapper for simplified storage operations
- **uuid**: Unique ID generation for tracks and playlists
- **zod**: Runtime type validation and schema definition
- **drizzle-orm**: ORM library (configured but not actively used)

### Development & Build
- **Vite**: Fast build tool and dev server
- **esbuild**: JavaScript bundler for server code
- **TypeScript**: Type checking and compile-time safety
- **ESLint & Prettier**: Code quality tools (implied by project structure)

### Backend (Optional/Future)
- **Express**: Web server framework
- **PostgreSQL**: Database (configured via Drizzle but not used)
- **connect-pg-simple**: PostgreSQL session store (available but unused)

### State Management
- **React Context API**: Global state management
- **@tanstack/react-query**: Server state management library (configured)

### Utilities
- **date-fns**: Date manipulation library
- **wouter**: Lightweight routing library
- **nanoid**: Compact unique ID generator

### Notes on Architecture Decisions

**Why Client-Side Storage?**
- Eliminates need for backend database for MVP
- Works offline by default
- Instant responsiveness with no network latency
- User data stays private on their device

**Why IndexedDB over LocalStorage?**
- Can store large binary files (MP3s)
- Better performance for large datasets
- Structured data with indexes
- Asynchronous API prevents blocking UI

**Why Custom Audio Player over Library?**
- Full control over playback logic
- Tighter integration with app state
- Smaller bundle size
- Custom queue and shuffle implementations

**Why Minimal Backend?**
- App designed to work entirely client-side
- Server only needed for static file serving
- Backend ready for future features (user accounts, cloud sync)
- Development convenience with HMR support