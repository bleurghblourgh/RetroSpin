# RetroSpin Music Player - Design Guidelines

## Design Approach
**Reference-Based: Retro Vaporwave/80s-90s Hi-Fi Aesthetic**

Drawing inspiration from vintage stereo equipment, vaporwave art movement, and classic music players like Winamp. The design balances nostalgic visual language with modern usability standards.

## Typography System

**Primary Font**: "Orbitron" or "Audiowide" (Google Fonts) - geometric, futuristic feel for headings
**Secondary Font**: "Roboto Mono" or "Space Mono" - clean monospace for data/metadata
**Body Font**: "Inter" or "Poppins" - modern, highly legible for UI elements

**Type Scale**:
- App Title/Logo: text-4xl font-bold (36px)
- Section Headings: text-2xl font-bold (24px)
- Track Titles: text-lg font-semibold (18px)
- Metadata/Labels: text-sm font-medium (14px)
- Microcopy: text-xs (12px)

**Letter Spacing**: Slightly increased for headings (tracking-wide) to emphasize retro aesthetic

## Layout & Spacing System

**Tailwind Spacing Units**: Consistently use 2, 4, 6, 8, 12, 16, 20, 24 units
- Tight spacing: p-2, gap-2
- Standard spacing: p-4, gap-4, m-4
- Section padding: p-6, p-8
- Major sections: p-12, p-16

**Grid System**:
- Desktop: 12-column grid with 240px fixed sidebar
- Content area: flex-1 with max-w-7xl container
- Mobile: Single column, full-width

## Component Library

### 1. Drag & Drop Upload Zone
- **Empty State**: Large centered area (min-h-96) with dashed border (border-dashed border-2)
- Icon: Oversized music note or vinyl disk icon (w-24 h-24)
- Primary text: text-2xl
- Subtext: text-sm with reduced opacity
- Browse button: Large, prominent (px-8 py-4)
- **Hover State**: Subtle scale transform (scale-105) and glow effect

### 2. Spinning Disk Visualization
- **Size**: Desktop: w-64 h-64 | Mobile: w-48 h-48
- Circular container with gradient border (border-4)
- Inner disk with concentric circles suggesting vinyl grooves
- Center label area for track info overlay
- **Animation**: CSS rotation (360deg continuous when playing)
- Glow effect: Multiple box-shadows with blur
- Includes small metallic "spindle" in center (w-8 h-8 circle)

### 3. Library Table/List
**Desktop Table View**:
- Header: sticky top-0, backdrop-blur, border-b-2
- Columns: Track (40%) | Artist (25%) | Album (25%) | Duration (10%)
- Row height: h-14 for comfortable touch targets
- Row hover: Subtle background change, scale-up cursor effect
- Selected row: Border-l-4 accent indicator

**Mobile Card View**:
- Stack to card layout (p-4, rounded-lg, border)
- Track title: text-base font-semibold
- Metadata: text-sm in flex row with separators
- Compact spacing: gap-2

### 4. Player Controls Bar
**Desktop**: Fixed bottom bar (h-24), full-width with backdrop-blur
- **Layout**: 3-column grid
  - Left (30%): Track info with small thumbnail
  - Center (40%): Playback controls
  - Right (30%): Volume and secondary controls

**Control Buttons**:
- Primary (Play/Pause): w-12 h-12, rounded-full
- Secondary (Next/Prev/Shuffle/Repeat): w-10 h-10
- Icon size: Consistent w-5 h-5
- Button spacing: gap-4
- Hover: scale-110 with glow

**Seek Bar**:
- Height: h-2
- Full-width with mx-4
- Thumb: w-4 h-4 circle
- Progress fill: rounded-full with gradient

**Volume Slider**:
- Horizontal on desktop (w-24)
- Icon + slider combo
- Same styling as seek bar

**Mobile**: Collapsed to h-16 mini-player
- Tap to expand full-screen "Now Playing" view
- Mini: Track title + play/pause only
- Expanded: Full disk visualization + complete controls

### 5. Sidebar Navigation (Desktop)
- Fixed left sidebar: w-60
- Logo area: h-20, centered
- Nav items: h-12, px-4, rounded-lg
- Icon + label layout (gap-3)
- Active state: Border-l-4 indicator
- Section dividers: my-6 with border-t

### 6. Playlist Management
**Playlist Cards**:
- Grid layout: grid-cols-2 gap-4 (desktop) | grid-cols-1 (mobile)
- Card: rounded-xl, p-6, aspect-square or min-h-48
- Title: text-xl font-bold
- Track count: text-sm
- Cover art placeholder: gradient or icon
- Hover: Lift effect (shadow-xl) + scale-102

**Playlist Editor Modal**:
- Full-screen overlay with backdrop-blur
- Content card: max-w-2xl, rounded-2xl, p-8
- Header with close button
- Draggable track list with reorder handles
- Action buttons: px-6 py-3

### 7. Search & Filter Bar
- Height: h-12
- Icon prefix (w-5 h-5)
- Input: flex-1, transparent background
- Clear button when active
- Dropdown filters: rounded-lg, p-2

### 8. Equalizer Visualization
- Position: Near spinning disk or integrated in player bar
- 5-7 vertical bars (w-2 each, varying heights)
- Spacing: gap-1
- Animation: Pulsing heights synchronized with beat (simplified, not actual audio analysis)
- Each bar: rounded-t-full

### 9. Nostalgic UI Details
**Stereo Label Elements**:
- Small badges with text like "Hi-Fi", "STEREO", "REC"
- Positioned near disk or player controls
- Size: px-2 py-1, text-xs, rounded
- Monospace font

**LED Indicators**:
- Small circles (w-2 h-2) for status
- Positioned near buttons (shuffle, repeat active states)

**Retro Borders & Panels**:
- Use double borders (border-2 + inner border) for "panel" effect
- Subtle inset shadows for recessed areas
- Raised effect for buttons (shadow-sm + shadow-md on hover)

## Animation Principles

**Minimal but Impactful**:
- Spinning disk: Primary focal animation (smooth rotation)
- Equalizer bars: Subtle pulse (0.5s intervals)
- Button interactions: Quick scale (duration-150)
- Panel transitions: Slide + fade (duration-300)
- Page transitions: Minimal, prefer instant swaps

**Easing**: Use ease-out for most transitions, ease-in-out for continuous animations

## Accessibility Standards

- Focus rings: 2px offset, high contrast
- Button minimum size: 44x44px (touch targets)
- Keyboard shortcuts clearly labeled
- ARIA labels for all icon-only buttons
- Sufficient contrast for all text (minimum 4.5:1)
- Focus trap in modals
- Skip navigation links

## Responsive Breakpoints

- Mobile: < 768px (single column, stacked layout)
- Tablet: 768px - 1024px (sidebar collapses to icon-only or hamburger)
- Desktop: > 1024px (full sidebar + multi-column layout)

## Visual Hierarchy

1. **Primary Focus**: Spinning disk when playing, upload zone when empty
2. **Secondary**: Current track info, playback controls
3. **Tertiary**: Library list, navigation
4. **Background**: Metadata, timestamps, secondary actions

## Interaction Patterns

- **Drag & Drop**: Visual feedback with border change, background shift
- **File Upload**: Progress indicator if needed (thin bar, h-1)
- **Track Selection**: Single click to select, double-click to play
- **Playlist Actions**: Right-click context menu or ellipsis button
- **Volume/Seek**: Click to jump, drag to scrub smoothly

This design creates an immersive retro experience while maintaining modern usability standards and responsive flexibility.