#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = join(process.cwd(), 'src');
const EXTENSIONS = new Set(['.tsx', '.ts', '.css']);

// Skip files that are already in the git diff (already migrated)
const ALREADY_MIGRATED = new Set([
  'app/(dashboard)/api-keys/page.tsx',
  'app/(dashboard)/audit/page.tsx',
  'app/(dashboard)/dashboard/page.tsx',
  'app/(dashboard)/organization/page.tsx',
  'app/(dashboard)/sessions/page.tsx',
  'app/(dashboard)/workspace/page.tsx',
  'features/agents/dashboard/agent-dashboard.tsx',
  'features/agents/dashboard/agent-grid.tsx',
  'features/agents/dashboard/agent-health-metrics.tsx',
  'features/embedding/dashboard/embedding-dashboard.tsx',
  'features/governance/dashboard/admin-center-dashboard.tsx',
  'features/graphrag/dashboard/graphrag-dashboard.tsx',
  'features/graphrag/dashboard/graphrag-metrics.tsx',
  'features/knowledge/explorer/knowledge-explorer.tsx',
  'features/memory/dashboard/memory-dashboard.tsx',
  'features/operations/dashboard/operations-center-dashboard.tsx',
  'features/research/dashboard/research-dashboard.tsx',
  'features/studio/dashboard/ai-studio-dashboard.tsx',
  'features/tools/dashboard/tool-dashboard.tsx',
]);

// List of files to skip entirely
const SKIP_LIST = new Set([
  'styles/globals.css',  // Already has nexus theme
  'styles/tokens.ts',    // Already has nexus theme
]);

function getAllFiles(dir) {
  const files = [];
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else if (EXTENSIONS.has(extname(item))) {
      files.push(fullPath);
    }
  }
  return files;
}

function getRelativePath(fullPath) {
  const rel = fullPath.replace(/\\/g, '/');
  const srcIdx = rel.indexOf('src/');
  return srcIdx >= 0 ? rel.slice(srcIdx + 4) : rel;
}

// Replacement pairs: [old, new]
const REPLACEMENTS = [
  // --- Text colors ---
  [/text-slate-100/g, 'text-nexus-50'],
  [/text-slate-200/g, 'text-nexus-200'],
  [/text-slate-300/g, 'text-nexus-300'],
  [/text-slate-400/g, 'text-nexus-400'],
  [/text-slate-500/g, 'text-nexus-500'],
  [/text-slate-600/g, 'text-nexus-600'],

  // --- Semantic colors ---
  [/text-cyan-400/g, 'text-nexus-accent'],
  [/text-indigo-400/g, 'text-nexus-brand-light'],
  [/text-amber-400/g, 'text-nexus-amber'],
  [/text-emerald-400/g, 'text-nexus-emerald'],
  [/text-rose-400/g, 'text-nexus-rose'],

  // --- Glass panels ---
  [/glass-panel/g, 'nexus-glass'],

  // --- Borders ---
  [/border-slate-800\/80/g, 'border-nexus-border/80'],
  [/border-slate-800\/60/g, 'border-nexus-border/60'],
  [/border-slate-800\/50/g, 'border-nexus-border/50'],
  [/border-slate-800/g, 'border-nexus-border'],
  [/border-slate-700/g, 'border-nexus-border'],
  [/border-slate-900/g, 'border-nexus-border'],

  // --- Border with semantic colors ---
  [/border-rose-500\/30/g, 'border-nexus-rose/30'],
  [/border-blue-500\/60/g, 'border-nexus-accent/60'],
  [/border-emerald-500\/30/g, 'border-nexus-emerald/30'],
  [/border-amber-500\/30/g, 'border-nexus-amber/30'],
  [/border-indigo-500\/30/g, 'border-nexus-brand-light/30'],
  [/border-cyan-500\/30/g, 'border-nexus-accent/30'],

  // --- Backgrounds ---
  [/bg-slate-950\/90/g, 'bg-nexus-950/90'],
  [/bg-slate-950\/80/g, 'bg-nexus-950/80'],
  [/bg-slate-950\/60/g, 'bg-nexus-950/60'],
  [/bg-slate-950/g, 'bg-nexus-950'],

  [/bg-slate-900\/60/g, 'bg-nexus-850/60'],
  [/bg-slate-900\/40/g, 'bg-nexus-850/40'],
  [/bg-slate-900\/20/g, 'bg-nexus-850/20'],
  [/bg-slate-900/g, 'bg-nexus-850'],

  [/bg-slate-800\/80/g, 'bg-nexus-800/80'],
  [/bg-slate-800\/50/g, 'bg-nexus-800/50'],
  [/bg-slate-800/g, 'bg-nexus-800'],

  [/bg-blue-500\/20/g, 'bg-nexus-accent/20'],

  // --- Hover states ---
  [/hover:text-rose-300/g, 'hover:text-nexus-rose/80'],
  [/hover:text-cyan-300/g, 'hover:text-nexus-accent/80'],
  [/hover:text-emerald-300/g, 'hover:text-nexus-emerald/80'],
  [/hover:text-amber-300/g, 'hover:text-nexus-amber/80'],

  [/hover:bg-rose-500\/10/g, 'hover:bg-nexus-rose/10'],
  [/hover:bg-cyan-500\/10/g, 'hover:bg-nexus-accent/10'],
  [/hover:bg-emerald-500\/10/g, 'hover:bg-nexus-emerald/10'],
  [/hover:bg-amber-500\/10/g, 'hover:bg-nexus-amber/10'],
  [/hover:bg-indigo-500\/10/g, 'hover:bg-nexus-brand-light/10'],
  [/hover:bg-blue-500\/10/g, 'hover:bg-nexus-accent/10'],
  [/hover:bg-slate-900/g, 'hover:bg-nexus-850'],
  [/hover:bg-slate-800/g, 'hover:bg-nexus-800'],

  // --- Group hover states ---
  [/group-hover:text-cyan-400/g, 'group-hover:text-nexus-accent'],
  [/group-hover:text-rose-400/g, 'group-hover:text-nexus-rose'],
  [/group-hover:text-emerald-400/g, 'group-hover:text-nexus-emerald'],
  [/group-hover:text-amber-400/g, 'group-hover:text-nexus-amber'],

  // --- Dark variants ---
  [/dark:text-slate-100/g, 'dark:text-nexus-50'],

  // --- peer focus states ---
  [/peer-focus:text-cyan-400/g, 'peer-focus:text-nexus-accent'],

  // --- Shadow variants ---
  [/shadow-glow-blue/g, 'shadow-glow-accent'],
  [/shadow-glow-purple/g, 'shadow-glow-brand'],

  // --- Divide colors ---
  [/divide-slate-800/g, 'divide-nexus-border'],
  [/divide-slate-700/g, 'divide-nexus-border'],

  // --- From/To in gradients ---
  [/from-slate-900/g, 'from-nexus-850'],
  [/to-slate-950/g, 'to-nexus-950'],
  [/from-slate-950/g, 'from-nexus-950'],
  [/to-slate-900/g, 'to-nexus-850'],

  // --- Ring colors ---
  [/ring-slate-800/g, 'ring-nexus-border'],
  [/ring-slate-700/g, 'ring-nexus-border'],

  // --- Caret colors ---
  [/caret-cyan-400/g, 'caret-nexus-accent'],
  [/caret-emerald-400/g, 'caret-nexus-emerald'],

  // --- bg-emerald-500/10 in badge contexts ---
  [/bg-emerald-500\/10/g, 'bg-nexus-emerald/10'],
  [/bg-amber-500\/10/g, 'bg-nexus-amber/10'],
  [/bg-rose-500\/10/g, 'bg-nexus-rose/10'],
  [/bg-cyan-500\/10/g, 'bg-nexus-accent/10'],

  // === SECOND PASS: Additional patterns ===

  // --- placeholder text ---
  [/placeholder-slate-500/g, 'placeholder-nexus-500'],
  [/placeholder-slate-400/g, 'placeholder-nexus-400'],

  // --- Focus states with blue (inputs) ---
  [/focus:border-blue-500/g, 'focus:border-nexus-accent'],
  [/focus-within:border-blue-500\/60/g, 'focus-within:border-nexus-accent/60'],

  // --- Text blue colors (used in badges/status indicators) ---
  [/text-blue-400/g, 'text-nexus-accent'],
  [/text-blue-500/g, 'text-nexus-accent'],

  // --- Blue borders ---
  [/border-blue-500\/40/g, 'border-nexus-accent/40'],
  [/border-blue-500\/30/g, 'border-nexus-accent/30'],
  [/border-blue-500\/20/g, 'border-nexus-accent/20'],
  [/border-blue-500\/50/g, 'border-nexus-accent/50'],
  [/border-blue-500/g, 'border-nexus-accent'],

  // --- Blue backgrounds ---
  [/bg-blue-500\/10/g, 'bg-nexus-accent/10'],
  [/bg-blue-600\/20/g, 'bg-nexus-accent/20'],
  [/bg-blue-600\/10/g, 'bg-nexus-accent/10'],
  [/bg-blue-950\/40/g, 'bg-nexus-950/40'],
  [/bg-blue-600/g, 'bg-nexus-accent'],

  // --- Blue hover states ---
  [/hover:bg-blue-500/g, 'hover:bg-nexus-accent'],

  // --- Accent color for range sliders ---
  [/accent-blue-500/g, 'accent-nexus-accent'],

  // --- Gradient blue/indigo pairs ---
  [/from-blue-600/g, 'from-nexus-accent'],
  [/from-blue-500/g, 'from-nexus-accent'],
  [/to-blue-500/g, 'to-nexus-accent'],
  [/to-indigo-600/g, 'to-nexus-brand-light'],
  [/via-indigo-500/g, 'via-nexus-brand-light'],
  [/from-cyan-500/g, 'from-nexus-accent'],
  [/to-emerald-400/g, 'to-nexus-emerald'],

  // --- Hover gradient states ---
  [/hover:from-blue-500/g, 'hover:from-nexus-accent'],
  [/hover:to-indigo-500/g, 'hover:to-nexus-brand-light'],

  // --- Buttons with indigo gradient ---
  [/to-indigo-600/g, 'to-nexus-brand-light'],

  // --- via-indigo-950/50 ---
  [/via-indigo-950\/50/g, 'via-nexus-950/50'],
];

function migrateFile(filePath) {
  const relPath = getRelativePath(filePath);
  
  if (SKIP_LIST.has(relPath)) return false;
  
  let content = readFileSync(filePath, 'utf-8');
  let original = content;
  
  for (const [pattern, replacement] of REPLACEMENTS) {
    content = content.replace(pattern, replacement);
  }
  
  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// Main
const files = getAllFiles(SRC_DIR);
let changed = 0;
let errors = 0;

for (const file of files) {
  try {
    if (migrateFile(file)) {
      const relPath = getRelativePath(file);
      console.log(`✓ ${relPath}`);
      changed++;
    }
  } catch (err) {
    const relPath = getRelativePath(file);
    console.error(`✗ ${relPath}: ${err.message}`);
    errors++;
  }
}

console.log(`\nDone! ${changed} files changed, ${errors} errors.`);
