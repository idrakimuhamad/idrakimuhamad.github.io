// Rename rollup's dist/template.html -> dist/index.html
// (rollup names HTML output after the input file; we build from template.html
//  because the folder root's index.html is the deployed site, not the template)
import { renameSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'dist', 'template.html');
const to = join(root, 'dist', 'index.html');
if (existsSync(from)) {
  renameSync(from, to);
  console.log('renamed dist/template.html -> dist/index.html');
} else {
  console.log('nothing to rename');
}
