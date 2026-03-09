#!/bin/bash

# Terminal 1: Start API
python3 ~/.openclaw/workspace/agent-dashboard-plugin/agent-dashboard-api.py

# Terminal 2: Start Dashboard
cd ~/.openclaw/workspace/agent-dashboard-app && npm run dev
