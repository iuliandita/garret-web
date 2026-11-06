import { expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { assertRelease } from './deploy.mjs';

// Only the read-only release guard runs; build and deployment are never invoked.
test.each(['valid', 'unset environment', 'preview', 'tracked change', 'untracked file', 'wrong branch', 'ahead of remote', 'behind remote'])('release guard: %s', scenario => {
  const cwd = mkdtempSync(resolve(tmpdir(), 'site-release-'));
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  try {
    git('init', '--initial-branch=main');
    git('config', 'user.name', 'Release tests');
    git('config', 'user.email', 'tests@example.invalid');
    git('init', '--bare', 'origin.git');
    writeFileSync(resolve(cwd, '.gitignore'), 'origin.git/\n');
    writeFileSync(resolve(cwd, 'source.txt'), 'original');
    git('add', '.');
    git('commit', '-m', 'test: initial release');
    git('remote', 'add', 'origin', resolve(cwd, 'origin.git'));
    git('push', 'origin', 'main');
    const head = git('rev-parse', 'HEAD');
    const env = { SITE_ENV: scenario === 'preview' ? 'preview' : scenario === 'unset environment' ? undefined : 'production' };
    if (scenario === 'tracked change') writeFileSync(resolve(cwd, 'source.txt'), 'modified');
    if (scenario === 'untracked file') writeFileSync(resolve(cwd, 'extra.txt'), 'untracked');
    if (scenario === 'wrong branch') git('switch', '-c', 'feature');
    if (scenario === 'ahead of remote' || scenario === 'behind remote') {
      git('commit', '--allow-empty', '-m', 'test: next release');
      if (scenario === 'behind remote') {
        git('push', 'origin', 'main');
        git('reset', '--hard', head);
        // A stale tracking ref must not allow deployment of an old release.
        git('update-ref', 'refs/remotes/origin/main', head);
      }
    }
    if (scenario === 'valid') expect(assertRelease({ cwd, env })).toBe(head);
    else expect(() => assertRelease({ cwd, env })).toThrow({
      'unset environment': 'SITE_ENV=production', preview: 'SITE_ENV=production',
      'tracked change': 'clean working tree', 'untracked file': 'clean working tree',
      'wrong branch': 'main release branch', 'ahead of remote': 'current origin/main tip', 'behind remote': 'current origin/main tip',
    }[scenario]);
  } finally { rmSync(cwd, { recursive: true, force: true }); }
});
