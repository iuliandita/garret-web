import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function assertRelease({ cwd, env }) {
  if (env.SITE_ENV !== 'production') throw new Error('Deployment requires SITE_ENV=production.');
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  if (git('status', '--porcelain', '--untracked-files=all')) throw new Error('Deployment requires a clean working tree.');
  if (git('rev-parse', '--abbrev-ref', 'HEAD') !== 'main') throw new Error('Deployment requires the main release branch.');
  const head = git('rev-parse', 'HEAD');
  const remote = git('ls-remote', '--exit-code', 'origin', 'refs/heads/main').split(/\s+/)[0];
  if (head !== remote) throw new Error('Deployment requires HEAD at the current origin/main tip.');
  return head;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const cwd = fileURLToPath(new URL('..', import.meta.url));
    const env = { ...process.env };
    const head = assertRelease({ cwd, env });
    const run = args => execFileSync('bun', args, { cwd, env, stdio: 'inherit' });
    run(['run', 'build']);
    run(['run', 'check:output']);
    if (assertRelease({ cwd, env }) !== head) throw new Error('Release changed during the build.');
    run(['x', '--no-install', 'wrangler', 'deploy', '--strict']);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
