# Squad Vision - Agent Dashboard

A real-time dashboard to monitor Vijay's agent squad (Plop, Clawe, Inky, Pixel, Scout, Buddy).

## Quick Start

```bash
cd ~/workspace/agent-dashboard-app
npm run dev
```

Then open http://localhost:5173 in your browser.

## Project Structure

```
agent-dashboard-app/
├── SPEC.md              # Full specification
├── README.md            # This file
├── architecture/        # C4 diagrams (PlantUML .puml files)
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API client
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Utility functions
└── dist/                # Production build
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
