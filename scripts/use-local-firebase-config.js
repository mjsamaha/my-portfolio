#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const local = path.join(process.cwd(), 'src', 'environments', 'firebase.config.local.ts');
const target = path.join(process.cwd(), 'src', 'environments', 'firebase.config.ts');

if (fs.existsSync(local)) {
  fs.copyFileSync(local, target);
  console.log(`Copied ${local} -> ${target}`);
  process.exit(0);
}

console.warn(`No local firebase config found at ${local}. Create it from firebase.config.template.ts with your credentials.`);
process.exit(0);
