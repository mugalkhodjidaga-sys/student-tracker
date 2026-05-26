/**
 * Starts Vite using Node 18+ (picks a suitable Node on Windows when PATH is wrong).
 */
const { spawnSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

const MIN_NODE = 18;
const projectRoot = path.join(__dirname, '..');
const viteBin = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');

function nodeMajor(nodePath) {
  const result = spawnSync(nodePath, ['-v'], {
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.error || result.status !== 0) return 0;
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  const match = output.match(/v(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function findNodeExecutable() {
  const candidates = [];

  if (process.platform === 'win32') {
    candidates.push(
      'C:\\Program Files\\nodejs\\node.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Programs', 'nodejs', 'node.exe')
    );
  }

  candidates.push(process.execPath);

  const seen = new Set();
  for (const candidate of candidates) {
    if (!candidate || seen.has(candidate) || !existsSync(candidate)) continue;
    seen.add(candidate);
    if (nodeMajor(candidate) >= MIN_NODE) return candidate;
  }

  return null;
}

const nodeExe = findNodeExecutable();

if (!nodeExe) {
  console.error(`
Node.js ${process.version} — no suitable Node ${MIN_NODE}+ found.

Install Node 20 LTS: https://nodejs.org/
Then close and reopen your terminal, run: node -v
`);
  process.exit(1);
}

const viteArgs = process.argv.slice(2);
const result = spawnSync(nodeExe, [viteBin, ...viteArgs], {
  stdio: 'inherit',
  cwd: projectRoot,
  env: process.env,
});

process.exit(result.status === null ? 1 : result.status);
