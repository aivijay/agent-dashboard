# Agent Dashboard App - Specification

## Project Overview

**Project Name:** Agent Dashboard (codename: Squad Vision)
**Project Type:** Real-time monitoring webapp
**Core Functionality:** Visual dashboard to monitor Vijay's agent squad (Plop, Clawe, Inky, Pixel, Scout, Buddy) - showing their status, activity, and inter-agent communication in real-time.
**Target Users:** Vijay (single user, local部署)

---

## 1. Project Structure

```
~/workspace/agent-dashboard-app/
├── SPEC.md                    # This specification
├── README.md                  # Quick start guide
├── architecture/              # C4 diagrams
│   ├── context.puml          # System context diagram
│   ├── container.puml        # Container diagram  
│   └── components.puml       # Component diagram
├── src/
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   ├── index.css             # Global styles
│   ├── components/
│   │   ├── AgentCard.tsx     # Individual agent status card
│   │   ├── AgentGrid.tsx     # Grid layout for agents
│   │   ├── ActivityFeed.tsx  # Real-time activity stream
│   │   ├── Header.tsx        # App header
│   │   └── StatusBadge.tsx   # Agent status indicator
│   ├── hooks/
│   │   ├── useAgents.ts      # Fetch and manage agent data
│   │   └── useActivity.ts    # Fetch activity/events
│   ├── services/
│   │   └── api.ts            # OpenClaw Gateway API client
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── utils/
│       └── formatters.ts      # Formatting utilities
├── public/
│   └── index.html            # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example              # Environment variables template
```

---

## 2. UI/UX Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: "Squad Vision" + status indicator + last refresh time │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Plop    │ │  Clawe   │ │  Inky    │ │  Pixel   │          │
│  │    👋    │ │    🦞    │ │    ✍️    │ │    🎨    │          │
│  │  [Status]│ │  [Status]│ │  [Status]│ │  [Status]│          │
│  │  Task... │ │  Task... │ │  Task... │ │  Task... │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
│  ┌──────────┐ ┌──────────┐                                     │
│  │  Scout   │ │  Buddy   │                                     │
│  │    🔍    │ │    🐐    │                                     │
│  │  [Status]│ │  [Status]│                                     │
│  │  Task... │ │  Task... │                                     │
│  └──────────┘ └──────────┘                                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ACTIVITY FEED: Real-time event stream                          │
│  • 12:30:45 - Clawe assigned task to Inky                      │
│  • 12:30:42 - Scout started researching "goat care"            │
│  • 12:30:15 - Pixel is generating hero image                  │
└─────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop (≥1024px):** 4-column agent grid
- **Tablet (768-1023px):** 3-column agent grid
- **Mobile (≤767px):** 2-column agent grid, stacked layout

### Visual Design

#### Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Background (dark) | Charcoal | `#1a1a2e` |
| Surface/Cards | Dark Slate | `#16213e` |
| Card Hover | Navy | `#1f3460` |
| Primary Accent | Electric Blue | `#4cc9f0` |
| Secondary Accent | Soft Purple | `#7209b7` |
| Success/Online | Mint Green | `#06d6a0` |
| Warning/Working | Amber | `#ffd166` |
| Idle/Offline | Gray | `#6c757d` |
| Text Primary | White | `#ffffff` |
| Text Secondary | Light Gray | `#a0a0a0` |
| Border | Subtle Blue | `#2a4066` |

#### Agent-Specific Colors

| Agent | Emoji | Accent Color |
|-------|-------|--------------|
| Plop | 👋 | `#4cc9f0` (Blue) |
| Clawe | 🦞 | `#f72585` (Pink) |
| Inky | ✍️ | `#4361ee` (Indigo) |
| Pixel | 🎨 | `#f8961e` (Orange) |
| Scout | 🔍 | `#90be6d` (Green) |
| Buddy | 🐐 | `#06d6a0` (Mint) |

#### Typography

- **Font Family:** `"JetBrains Mono", "Fira Code", monospace` (for that techy dashboard feel)
- **Headings:** `"Inter", system-ui, sans-serif`
- **Font Sizes:**
  - App Title: 24px, weight 700
  - Agent Name: 18px, weight 600
  - Agent Role: 14px, weight 400
  - Status Text: 12px, weight 500
  - Activity Feed: 13px, weight 400

#### Spacing System

- Base unit: 4px
- Card padding: 16px (4 units)
- Grid gap: 16px
- Section margins: 24px
- Border radius: 12px (cards), 8px (badges)

#### Visual Effects

- **Card shadows:** `0 4px 20px rgba(0, 0, 0, 0.3)`
- **Glow effect on status:** `0 0 12px <status-color>`
- **Hover transitions:** 200ms ease-out
- **Activity feed slide-in:** 300ms ease-out from right

### Components

#### AgentCard

- Avatar (emoji in circle, 48px)
- Agent name (bold)
- Role/subtitle
- Status badge (colored dot + text)
- Current task (truncated to 2 lines)
- Last activity timestamp

**States:**
- **Online/Idle:** Green dot, "Ready" or "Idle"
- **Working:** Amber dot, pulsing glow, task description
- **Offline:** Gray dot, "Offline"

#### StatusBadge

- Small colored dot (8px)
- Status text label
- Optional subtle pulse animation for "working" state

#### ActivityFeed

- Scrollable list (max-height: 300px)
- Auto-scroll to newest
- Timestamp + agent emoji + message
- Color-coded by agent
- Fade-in animation for new items

#### Header

- App title with icon
- Connection status (Connected/Disconnected)
- Last refresh timestamp
- Manual refresh button

---

## 3. Functionality Specification

### Core Features

#### F1: Agent Status Grid
- Display all 6 agents in a responsive grid
- Show real-time status for each agent
- Display current task (if any)
- Auto-refresh every 5 seconds

#### F2: Real-time Activity Feed
- Stream of agent activities
- Shows: timestamp, agent, action, details
- Auto-scroll to latest
- Maximum 100 items (then oldest removed)

#### F3: Connection Management
- Connect to OpenClaw Gateway API
- Handle connection loss gracefully
- Show connection status
- Auto-reconnect on failure

#### F4: Manual Refresh
- Button to manually refresh all data
- Debounced to prevent spam

### Data Sources (OpenClaw Gateway API)

```
Base URL: http://127.0.0.1:18789/api

Endpoints:
- GET /sessions          → List all sessions (agents)
- GET /agents           → List configured agents
- GET /subagents/runs   → Recent subagent runs
```

### User Interactions

1. **View Dashboard** — Load page, see all agents at a glance
2. **Watch Activity** — Scroll through feed, see what's happening
3. **Manual Refresh** — Click refresh button to update immediately
4. **Hover Agent Card** — Subtle highlight effect

### Edge Cases

- **Gateway unreachable:** Show "Disconnected" banner, retry every 5s
- **No agents configured:** Show empty state with message
- **Agent goes offline:** Update status immediately
- **Activity feed overflow:** Keep last 100 items, remove oldest

---

## 4. Technical Architecture

### C4 Model

See `architecture/` folder for diagrams:

- **Context (Level 1):** Shows system boundary and external users
- **Container (Level 2):** React app + Gateway API + Browser
- **Components (Level 3):** Internal React components

### Data Flow

```
┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  React App       │────▶│  Gateway API    │────▶│  OpenClaw        │
│  (Browser)       │◀────│  (localhost)    │◀────│  Gateway         │
└──────────────────┘     └─────────────────┘     └──────────────────┘
        │                                                  │
        │                                                  │
        ▼                                                  ▼
┌──────────────────┐                              ┌──────────────────┐
│  Local State     │                              │  Agent Sessions  │
│  (useState)      │                              │  & History       │
└──────────────────┘                              └──────────────────┘
```

### API Integration

```typescript
// Example API calls
GET http://127.0.0.1:18789/api/sessions
GET http://127.0.0.1:18789/api/agents
GET http://127.0.0.1:18789/api/subagents/runs
```

---

## 5. Acceptance Criteria

### Visual Checkpoints

- [ ] App loads with dark theme (charcoal background)
- [ ] 6 agent cards displayed in responsive grid
- [ ] Each card shows: emoji avatar, name, role, status, task
- [ ] Status badges show correct colors (green/amber/gray)
- [ ] Activity feed shows at bottom with scroll
- [ ] Header shows app title and connection status

### Functional Checkpoints

- [ ] Page loads without console errors
- [ ] Agent data fetches from Gateway API
- [ ] Status updates every 5 seconds automatically
- [ ] Manual refresh button works
- [ ] Connection error state shows gracefully

### Build Checkpoints

- [ ] `npm run build` succeeds without errors
- [ ] `npm run dev` starts development server
- [ ] Production build is servable

---

## 6. Future Enhancements (Post-MVP)

- **Task Pipeline View:** Kanban-style board of tasks
- **Communication Timeline:** Full chat between agents
- **Historical Data:** Charts of agent activity over time
- **Notifications:** Alerts for important events
- **Mobile App:** Native iOS/Android views
- **Multi-window:** Pop-out agent details

---

## 7. Development Phases

### Phase 1: Foundation (Current)
- Project setup + dependencies
- Basic UI layout
- API client setup
- Agent status grid (MVP)

### Phase 2: Real-time
- Activity feed implementation
- Auto-refresh logic
- Connection management

### Phase 3: Polish
- Animations and transitions
- Error handling
- Mobile responsiveness
- C4 diagrams

---

**Last Updated:** 2026-03-08
**Version:** 1.0.0
