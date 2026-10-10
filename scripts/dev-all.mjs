import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const next = require.resolve('next/dist/bin/next');
const root = new URL('../', import.meta.url);
if (Number(process.versions.node.split('.')[0]) !== 24) {
  console.error('Use Node 24 (nvm use), then run npm run dev:all.');
  process.exit(1);
}
const children = [
  ...[['rewards', '3000'], ['website', '3001']].map(([app, port]) =>
    spawn(process.execPath, [next, 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', port], {
      cwd: fileURLToPath(new URL(`apps/${app}/`, root)),
      stdio: 'inherit',
      // Next loads each app's own .env files; do not override them with defaults.
      env: { ...process.env },
    }),
  ),
];
let closing = false;
function stop(code = 0) {
  if (closing) return;
  closing = true;
  for (const child of children) child.kill('SIGTERM');
  process.exitCode = code;
}
for (const child of children) {
  child.on('error', (error) => { console.error(error.message); stop(1); });
  child.on('exit', (code) => { if (!closing) stop(code || 1); });
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
console.log('Website: http://localhost:3001\nRewards: http://localhost:3000');
