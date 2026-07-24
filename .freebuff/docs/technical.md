# Run Doc — NEXUS AI Frontend Preview

Reproduced at: C:\Users\risha\Documents\NEXUS-AI\.freebuff\worktrees\thmrx2zmzj7azu

## How to reproduce uncommitted artifacts

No `.env.local` or other env files needed — the frontend uses defaults (`NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000/api/v1` in `src/lib/api.ts`).

Copy commands:
- No env files to copy from main checkout (`C:\Users\risha\Documents\NEXUS-AI`).

## How to run the server

1. Install dependencies:
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

2. Clean stale cache:
   ```bash
   rm -rf frontend/.next
   ```

3. Start dev server (port 3000):
   ```bash
   cd frontend
   npx next dev -p 3000
   ```

4. Verify: `curl http://localhost:3000/` should return 200.

Key fixes applied:
- Created `src/lib/utils.ts` (cn helper) and `src/lib/api.ts` (API layer with streaming chat, document management, graph visualization).
- Upgraded `@react-three/fiber` v8→v9 and `@react-three/drei` v9→v10 for React 19 compatibility (fixes `ReactCurrentOwner` runtime crash).
- Both upgrades recorded in `package.json`.
