# Squad Vision - Agent Dashboard

A real-time dashboard to monitor Vijay's agent squad (Plop, Clawe, Inky, Pixel, Scout, Buddy).

## Quick Start

```bash
cd agent-dashboard
npm run dev
```

Then open http://localhost:5173 in your browser.

## Project Structure

```
agent-dashboard/
├── index.html             # Entry HTML
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
├── start-api-dashboard.sh # Gateway + dashboard launcher
├── SPEC.md                # Full specification
├── README.md              # This file
├── architecture/          # C4 diagrams (PlantUML .puml files)
├── dist/                  # Production build
└── src/
    ├── App.tsx            # Root component
    ├── main.tsx           # Entry point
    ├── index.css          # Global styles
    ├── components/        # React components
    │   ├── AgentArena.tsx
    │   ├── AgentCard.tsx
    │   ├── AgentGrid.tsx
    │   ├── AgentVisualCard.tsx
    │   ├── Header.tsx
    │   ├── QuickActions.tsx
    │   └── StatusBadge.tsx
    ├── hooks/             # Custom React hooks
    │   ├── useActivity.tsx
    │   ├── useAgents.ts
    │   ├── useCommunications.tsx
    │   └── useToast.tsx
    ├── services/          # API client
    │   └── api.ts
    ├── types/             # TypeScript interfaces
    │   └── index.ts
    └── utils/             # Utility functions
        └── formatters.ts
```

## Architecture Diagrams

C4 diagrams are in the `architecture/` folder. To generate PNGs:

```bash
# Install PlantUML
brew install plantuml  # macOS
# or: sudo apt install plantuml

# Generate diagrams
npx -y plantuml -tpng architecture/context.puml
npx -y plantuml -tpng architecture/container.puml
```

## API Endpoints

The dashboard connects to OpenClaw Gateway at `http://127.0.0.1:18789`:

- `GET /health` - Gateway health check
- `GET /api/sessions` - List all agent sessions
- `GET /api/agents` - List configured agents

## Features

- ✅ Real-time agent status grid
- ✅ Auto-refresh every 5 seconds
- ✅ Connection status indicator
- ✅ Manual refresh button
- ✅ Responsive design

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS (custom properties)

---

**Version:** 1.0.0 | **Last Updated:** 2026-03-08
