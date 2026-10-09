import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const next = require.resolve('next/dist/bin/next');
if (Number(process.versions.node.split('.')[0]) !== 24) {
  console.error('Use Node 24 (nvm use), then run npm run dev:all.');
  process.exit(1);
}
const children = [
  spawn(process.execPath, [next, 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', '3000'], { stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3001' } }),
  spawn(process.execPath, [next, 'dev', 'website', '--webpack', '--hostname', '127.0.0.1', '--port', '3001'], { stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001', NEXT_PUBLIC_REWARDS_URL: process.env.NEXT_PUBLIC_REWARDS_URL || 'http://localhost:3000' } }),
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
