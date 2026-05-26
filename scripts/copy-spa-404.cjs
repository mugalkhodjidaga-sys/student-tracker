/**
 * GitHub Pages SPA fallback: serve index.html for unknown routes (404.html trick).
 */
const { copyFileSync, existsSync } = require('fs');
const { join } = require('path');

const indexPath = join(__dirname, '..', 'dist', 'index.html');
const destPath = join(__dirname, '..', 'dist', '404.html');

if (!existsSync(indexPath)) {
  console.error('dist/index.html not found. Run npm run build first.');
  process.exit(1);
}

copyFileSync(indexPath, destPath);
console.log('Created dist/404.html for GitHub Pages SPA routing.');
