# ZHĪ AI — Frontend Dev Server

## Artifacts to Reproduce

This project's workspace is the same as the main checkout (`C:\Users\risha\Documents\NEXUS-AI`), so **no artifact copying is needed**. Dependencies are already installed in `frontend/node_modules/`.

If starting from a fresh checkout:

1. `cd frontend`
2. `npm install` (installs all dependencies — Next.js 15, React 18, Three.js, etc.)

## How to Run the Dev Server

1. From the project root, run:
   ```bash
   cd frontend && npx next dev -p 3000
   ```
   (Use `-p <port>` if port 3000 is occupied.)

2. The server compiles and serves the Next.js app router at `http://localhost:3000/`.

3. All 26 pages are statically generated; the landing page, login, onboarding, chat, dashboard, knowledge, embedding, graph, agents, research, studio, memory, tools, governance, and all other routes render without runtime errors.

4. **No backend required** for frontend development — mock data is provided by the frontend stores and hooks.
