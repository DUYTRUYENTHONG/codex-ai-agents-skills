import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { sync } from './sync-skills.mjs';

function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-skills-sync-'));
  const repo = path.join(root, 'repo');
  const source = path.join(root, 'source');
  fs.mkdirSync(path.join(repo, 'skills', 'example'), { recursive: true });
  fs.mkdirSync(path.join(source, 'example'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'manifest.json'), JSON.stringify({
    generated_at: 'initial', included_skills: [
      { name: '.system', path: 'skills/.system', skill_md_sha256: '---' },
      { name: 'example', path: 'skills/example', skill_md_sha256: 'old' },
    ],
  }));
  fs.writeFileSync(path.join(repo, 'skills', 'example', 'SKILL.md'), 'old');
  fs.writeFileSync(path.join(source, 'example', 'SKILL.md'), 'new');
  try { fn({ repo, source }); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}

test('check is read-only; apply updates tracked skill and manifest; rerun is idempotent', () => fixture(({ repo, source }) => {
  fs.mkdirSync(path.join(source, 'unlisted'));
  fs.writeFileSync(path.join(source, 'unlisted', 'SKILL.md'), 'do not publish');
  assert.deepEqual(sync(source, repo, false), ['example/SKILL.md']);
  assert.equal(fs.readFileSync(path.join(repo, 'skills', 'example', 'SKILL.md'), 'utf8'), 'old');
  assert.deepEqual(sync(source, repo, true), ['example/SKILL.md']);
  assert.equal(fs.readFileSync(path.join(repo, 'skills', 'example', 'SKILL.md'), 'utf8'), 'new');
  const manifest = JSON.parse(fs.readFileSync(path.join(repo, 'manifest.json')));
  assert.match(manifest.included_skills[1].skill_md_sha256, /^[A-F0-9]{64}$/);
  assert.deepEqual(sync(source, repo, true), []);
  assert.equal(fs.existsSync(path.join(repo, 'skills', 'unlisted')), false);
}));

test('missing packaged file blocks the whole sync', () => fixture(({ repo, source }) => {
  fs.writeFileSync(path.join(repo, 'skills', 'example', 'keep.txt'), 'old');
  assert.throws(() => sync(source, repo, true), /review deletion manually/);
  assert.equal(fs.readFileSync(path.join(repo, 'skills', 'example', 'SKILL.md'), 'utf8'), 'old');
}));

test('secret and sensitive filenames block publication', () => fixture(({ repo, source }) => {
  fs.writeFileSync(path.join(source, 'example', '.env'), 'A=B');
  assert.throws(() => sync(source, repo, true), /Sensitive filename/);
  fs.rmSync(path.join(source, 'example', '.env'));
  fs.writeFileSync(path.join(source, 'example', 'SKILL.md'), '-----BEGIN' + ' PRIVATE KEY-----');
  assert.throws(() => sync(source, repo, true), /Potential secret/);
}));

test('missing tracked skill blocks publication', () => fixture(({ repo, source }) => {
  fs.rmSync(path.join(source, 'example'), { recursive: true });
  assert.throws(() => sync(source, repo, true), /Missing tracked skills/);
}));
