#!/usr/bin/env node
// Sync only skills already listed in this repository's manifest from a local Codex installation.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(repoRoot, 'manifest.json');
const ignoredDirs = new Set(['.git', '.venv', '__pycache__', '.pytest_cache', 'node_modules']);
const ignoredFiles = /^(?:\.DS_Store|Thumbs\.db)$|\.pyc$/i;
const forbiddenFiles = /(^|[\\/])(?:\.env(?:\..*)?|id_rsa|id_ed25519|.*\.(?:pem|p12|pfx|key))$/i;
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/,
  /\bsk-[A-Za-z0-9_-]{40,}\b/,
];

function args(argv) {
  let mode = 'check';
  let source = process.env.CODEX_SKILLS_ROOT || path.join(os.homedir(), '.codex', 'skills');
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--apply') mode = 'apply';
    else if (argv[i] === '--check') mode = 'check';
    else if (argv[i] === '--source' && argv[i + 1]) source = argv[++i];
    else throw new Error(`Unknown or incomplete argument: ${argv[i]}`);
  }
  return { mode, source: path.resolve(source) };
}

function filesUnder(root) {
  const result = new Map();
  function walk(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const relative = path.join(prefix, entry.name);
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Symlink not allowed: ${full}`);
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) walk(full, relative);
      } else if (entry.isFile() && !ignoredFiles.test(entry.name)) {
        if (forbiddenFiles.test(relative)) throw new Error(`Sensitive filename: ${full}`);
        result.set(relative, full);
      }
    }
  }
  walk(root);
  return result;
}

function digest(bytes) { return createHash('sha256').update(bytes).digest('hex').toUpperCase(); }

function scanSecrets(bytes, name) {
  if (bytes.includes(0)) return;
  const content = bytes.toString('utf8');
  if (secretPatterns.some((pattern) => pattern.test(content))) {
    throw new Error(`Potential secret in ${name}; review locally before publishing`);
  }
}

export function planSync(sourceRoot, root = repoRoot) {
  if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
    throw new Error(`Skills source does not exist: ${sourceRoot}`);
  }
  const sourceReal = fs.realpathSync(sourceRoot);
  const repoReal = fs.realpathSync(root);
  if (sourceReal === repoReal || sourceReal.startsWith(repoReal + path.sep)) {
    throw new Error('Source must be outside the repository');
  }
  const manifestFile = path.join(root, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  if (!Array.isArray(manifest.included_skills)) throw new Error('Invalid manifest');
  const changes = [];
  const missing = [];
  const seen = new Set();
  for (const skill of manifest.included_skills) {
    if (!skill || !/^[a-z0-9][a-z0-9-]*$/.test(skill.name) && skill.name !== '.system') {
      throw new Error('Invalid skill name in manifest');
    }
    if (skill.path !== `skills/${skill.name}` || seen.has(skill.name)) {
      throw new Error(`Invalid or duplicate manifest path for ${skill.name}`);
    }
    seen.add(skill.name);
    // .system is Codex-managed and historically recorded but not packaged under skills/.
    if (skill.name === '.system') continue;
    const sourceDir = path.join(sourceRoot, skill.name);
    const targetDir = path.join(root, 'skills', skill.name);
    if (!fs.existsSync(sourceDir) || !fs.existsSync(targetDir)) {
      missing.push(skill.name);
      continue;
    }
    if (fs.lstatSync(sourceDir).isSymbolicLink() || fs.lstatSync(targetDir).isSymbolicLink()) {
      throw new Error(`Symlinked skill directory: ${skill.name}`);
    }
    const sourceFiles = filesUnder(sourceDir);
    const targetFiles = filesUnder(targetDir);
    if (!sourceFiles.has('SKILL.md')) throw new Error(`Missing SKILL.md: ${skill.name}`);
    for (const relative of targetFiles.keys()) {
      if (!sourceFiles.has(relative)) {
        throw new Error(`Source lacks packaged file ${skill.name}/${relative}; review deletion manually`);
      }
    }
    for (const [relative, sourceFile] of sourceFiles) {
      const bytes = fs.readFileSync(sourceFile);
      const targetFile = path.join(targetDir, relative);
      if (!fs.existsSync(targetFile) || !bytes.equals(fs.readFileSync(targetFile))) {
        scanSecrets(bytes, `${skill.name}/${relative}`);
        changes.push({ skill: skill.name, relative, sourceFile, targetFile, bytes });
      }
    }
    skill.skill_md_sha256 = digest(fs.readFileSync(path.join(sourceDir, 'SKILL.md')));
  }
  if (missing.length) throw new Error(`Missing tracked skills: ${missing.join(', ')}`);
  return { changes, manifest, manifestFile };
}

export function sync(sourceRoot, root = repoRoot, apply = false) {
  const plan = planSync(sourceRoot, root);
  if (apply && plan.changes.length) {
    for (const change of plan.changes) {
      fs.mkdirSync(path.dirname(change.targetFile), { recursive: true });
      fs.writeFileSync(change.targetFile, change.bytes);
    }
    plan.manifest.generated_at = new Date().toISOString();
    plan.manifest.source_root = 'local Codex skills root (CODEX_SKILLS_ROOT or --source)';
    fs.writeFileSync(plan.manifestFile, JSON.stringify(plan.manifest, null, 2) + '\n');
  }
  return plan.changes.map(({ skill, relative }) => `${skill}/${relative}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { mode, source } = args(process.argv.slice(2));
    const changed = sync(source, repoRoot, mode === 'apply');
    console.log(`${mode === 'apply' ? 'Synced' : 'Would sync'} ${changed.length} file(s) across ${new Set(changed.map((name) => name.split('/')[0])).size} skill(s).`);
    for (const name of changed) console.log(name);
    if (mode === 'check' && changed.length) process.exitCode = 2;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
