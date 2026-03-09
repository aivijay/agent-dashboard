#!/usr/bin/env python3
"""
Agent Dashboard API Server
Standalone HTTP server that reads OpenClaw session data

Run: python3 agent-dashboard-api.py
Default port: 18790
"""

import http.server
import socketserver
import os
import json
from pathlib import Path
from datetime import datetime, timedelta

PORT = int(os.environ.get('PORT', 18790))
AGENTS_DIR = os.environ.get('OPENCLAW_AGENTS_DIR', '/home/vijay/.openclaw/agents')

# Activity thresholds (in seconds)
ACTIVE_THRESHOLD = 5 * 60  # 5 minutes - agent is actively working
IDLE_THRESHOLD = 30 * 60   # 30 minutes - agent is idle but was recently active

AGENT_CONFIGS = {
    'main': {'name': 'Plop', 'emoji': '👋', 'role': 'Main Assistant'},
    'clawe': {'name': 'Clawe', 'emoji': '🦞', 'role': 'Squad Lead'},
    'inky': {'name': 'Inky', 'emoji': '✍️', 'role': 'Content Writer'},
    'pixel': {'name': 'Pixel', 'emoji': '🎨', 'role': 'Graphic Designer'},
    'scout': {'name': 'Scout', 'emoji': '🔍', 'role': 'SEO Specialist'},
    'buddy': {'name': 'Buddy', 'emoji': '🐐', 'role': 'Team Mascot'},
}

class AgentDashboardHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/health' or self.path == '/api/health':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True, 'status': 'ok'}).encode())
            return
        
        if self.path == '/api/agents':
            agents = []
            for agent_id in AGENT_CONFIGS:
                sessions_path = Path(AGENTS_DIR) / agent_id / 'sessions'
                has_sessions = sessions_path.exists() and any(sessions_path.glob('*.jsonl'))
                agents.append({'id': agent_id, 'configured': has_sessions})
            
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'requester': 'dashboard',
                'allowAny': False,
                'agents': agents
            }).encode())
            return
        
        if self.path == '/api/agents/detail':
            agents = []
            now = datetime.now().timestamp()
            
            for agent_id, config in AGENT_CONFIGS.items():
                sessions_path = Path(AGENTS_DIR) / agent_id / 'sessions'
                has_sessions = False
                last_session_at = None
                last_activity_at = None
                
                if sessions_path.exists():
                    try:
                        files = list(sessions_path.glob('*.jsonl'))
                        has_sessions = len(files) > 0
                        if has_sessions:
                            # Get the most recently modified session file
                            latest = max(files, key=lambda f: f.stat().st_mtime)
                            last_session_at = int(latest.stat().st_mtime * 1000)
                            
                            # Check file content for more recent activity
                            try:
                                with open(latest, 'r') as f:
                                    lines = f.readlines()
                                    if lines:
                                        # Get timestamp from last line
                                        last_line = json.loads(lines[-1])
                                        ts = None
                                        if 'timestamp' in last_line:
                                            ts = last_line['timestamp']
                                        elif 'createdAt' in last_line:
                                            ts = last_line['createdAt']
                                        
                                        # Parse timestamp (could be ISO string or epoch ms)
                                        if ts:
                                            if isinstance(ts, str):
                                                # ISO timestamp - parse it
                                                try:
                                                    dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                                                    last_activity_at = int(dt.timestamp() * 1000)
                                                except:
                                                    last_activity_at = last_session_at
                                            elif isinstance(ts, (int, float)):
                                                # Already epoch ms
                                                last_activity_at = int(ts)
                                            else:
                                                last_activity_at = last_session_at
                                        else:
                                            last_activity_at = last_session_at
                            except:
                                last_activity_at = last_session_at
                    except:
                        pass
                
                # Determine status based on last activity
                if last_activity_at:
                    seconds_since_activity = now - (last_activity_at / 1000)
                    if seconds_since_activity < ACTIVE_THRESHOLD:
                        status = 'active'
                    elif seconds_since_activity < IDLE_THRESHOLD:
                        status = 'idle'
                    else:
                        status = 'offline'
                else:
                    status = 'idle' if has_sessions else 'offline'
                
                agents.append({
                    'id': agent_id,
                    'name': config['name'],
                    'emoji': config['emoji'],
                    'role': config['role'],
                    'hasSessions': has_sessions,
                    'lastSessionAt': last_session_at,
                    'lastActivityAt': last_activity_at,
                    'status': status
                })
            
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'agents': agents}).encode())
            return
        
        if self.path == '/api/sessions':
            sessions = []
            for agent_id in AGENT_CONFIGS:
                sessions_path = Path(AGENTS_DIR) / agent_id / 'sessions'
                if sessions_path.exists():
                    try:
                        for f in sessions_path.glob('*.jsonl'):
                            stat = f.stat()
                            sessions.append({
                                'key': f'agent:{agent_id}:main',
                                'sessionId': f.stem,
                                'updatedAt': int(stat.st_mtime * 1000),
                                'abortedLastRun': False
                            })
                    except:
                        pass
            
            sessions.sort(key=lambda x: x['updatedAt'], reverse=True)
            
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'sessions': sessions}).encode())
            return
        
        # 404
        self.send_response(404)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def log_message(self, format, *args):
        print(f"[API] {args[0]}")

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    print(f"🤖 Agent Dashboard API running on port {PORT}")
    print(f"   GET http://localhost:{PORT}/health")
    print(f"   GET http://localhost:{PORT}/api/agents")
    print(f"   GET http://localhost:{PORT}/api/agents/detail")
    print(f"   GET http://localhost:{PORT}/api/sessions")
    
    with ReusableTCPServer(('', PORT), AgentDashboardHandler) as httpd:
        httpd.serve_forever()
