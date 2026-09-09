#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(process.argv[2] || process.cwd());
const maxFindings = Number(process.env.QA_SCAN_MAX_FINDINGS || 80);

const ignoredDirs = new Set([
  ".git",
  ".next",
  ".vercel",
  ".turbo",
  "node_modules",
  "deploy-artifacts",
  "dist",
  "build",
  "coverage",
  "playwright-report",
  "test-results",
  ".cache"
]);

const ignoredDirPrefixes = [
  ".chrome-",
  ".qa-chrome-",
  ".playwright-",
  ".next-release-"
];

const textExts = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".scss",
  ".html",
  ".md",
  ".json",
  ".yml",
  ".yaml",
  ".toml",
  ".env",
  ".example",
  ".sql"
]);

const conflictPattern = /^(<<<<<<<|=======|>>>>>>>)($|\s)/;
const suspiciousPatterns = [
  { label: "ts-nocheck", regex: /@ts-nocheck/ },
  { label: "ts-ignore", regex: /@ts-ignore/ },
  { label: "eslint-disable", regex: /eslint-disable/ },
  { label: "broad-any", regex: /\b(as any|: any\b|<any>)/ },
  { label: "hardcoded-demo-admin", regex: /\b(admin123|admin\s*\/\s*admin123|demo-password)\b/i },
  { label: "silent-catch", regex: /catch\s*\([^)]*\)\s*{\s*}/ },
  { label: "console-log", regex: /\bconsole\.log\s*\(/ }
];

const findings = {
  root,
  gitStatus: null,
  packageScripts: null,
  qaChecklist: fs.existsSync(path.join(root, "QA_CHECK_BEFORE_DEPLOY.md")),
  conflictMarkers: [],
  suspiciousPatterns: []
};

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function shouldScanFile(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file).toLowerCase();
  return textExts.has(ext) || base.startsWith(".env") || base === "dockerfile";
}

function walk(dir) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name) && !ignoredDirPrefixes.some((prefix) => entry.name.startsWith(prefix))) walk(full);
      continue;
    }
    if (!entry.isFile() || !shouldScanFile(full)) continue;
    scanFile(full);
  }
}

function pushLimited(list, item) {
  if (list.length < maxFindings) list.push(item);
}

function scanFile(file) {
  let content = "";
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    return;
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (conflictPattern.test(line)) {
      pushLimited(findings.conflictMarkers, { file: rel(file), line: index + 1, text: line.trim().slice(0, 120) });
    }
    for (const pattern of suspiciousPatterns) {
      if (pattern.regex.test(line)) {
        pushLimited(findings.suspiciousPatterns, {
          label: pattern.label,
          file: rel(file),
          line: index + 1,
          text: line.trim().slice(0, 160)
        });
      }
    }
  });
}

function readGitStatus() {
  try {
    findings.gitStatus = execFileSync("git", ["status", "--short"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    findings.gitStatus = "git status unavailable";
  }
}

function readPackageScripts() {
  const packagePath = path.join(root, "package.json");
  if (!fs.existsSync(packagePath)) return;
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const scripts = pkg.scripts || {};
    findings.packageScripts = Object.fromEntries(
      Object.entries(scripts).filter(([name]) => /^(qa|test|typecheck|build|smoke|lint|check)/i.test(name))
    );
  } catch {
    findings.packageScripts = "package.json unreadable";
  }
}

readGitStatus();
readPackageScripts();
walk(root);

const status = findings.conflictMarkers.length ? "BLOCKED" : "CHECK";
const summary = {
  status,
  root: findings.root,
  qaChecklist: findings.qaChecklist,
  gitStatus: findings.gitStatus ? findings.gitStatus.split(/\r?\n/).slice(0, 40) : [],
  packageScripts: findings.packageScripts,
  conflictMarkerCount: findings.conflictMarkers.length,
  suspiciousPatternCount: findings.suspiciousPatterns.length
};

console.log(JSON.stringify({ summary, findings }, null, 2));

if (findings.conflictMarkers.length) process.exitCode = 2;
