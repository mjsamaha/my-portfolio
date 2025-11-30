#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return out.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  } catch (e) {
    console.error('Failed to get staged files:', e.message);
    process.exit(0);
  }
}

const patterns = [
  { name: 'Private key PEM header', regex: /-----BEGIN (?:RSA |)PRIVATE KEY-----/i },
  { name: 'Certificate header', regex: /-----BEGIN CERTIFICATE-----/i },
  { name: 'Firebase API key', regex: /AIza[0-9A-Za-z_\-]{35}/ },
  { name: 'JSON private_key field', regex: /"private_key"\s*:/i },
  { name: 'Service account marker', regex: /"type"\s*:\s*"service_account"/i }
];

const files = getStagedFiles();
if (!files.length) {
  console.log('No staged files to check.');
  process.exit(0);
}

let found = [];
for (const file of files) {
  const lower = file.toLowerCase();
  if (lower.includes('node_modules/') || lower.includes('dist/') || lower.includes('build/') || lower.includes('.git/')) continue;
  let content;
  try {
    content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  } catch (e) {
    // binary or unreadable files — skip
    continue;
  }
  for (const p of patterns) {
    if (p.regex.test(content)) {
      found.push({ file, pattern: p.name, excerpt: content.match(p.regex)[0] });
    }
  }
}

if (found.length) {
  console.error('\nERROR: Potential secret(s) detected in staged files. Commit blocked.');
  for (const f of found) {
    console.error(`\n - ${f.file}: ${f.pattern}\n   Matched: ${f.excerpt}`);
  }
  console.error('\nIf these are false positives, fix the files or remove them from the commit.');
  console.error('To bypass (not recommended) you can use: git commit --no-verify');
  process.exit(1);
}

console.log('Secret scan passed — no obvious secrets found in staged files.');
process.exit(0);
