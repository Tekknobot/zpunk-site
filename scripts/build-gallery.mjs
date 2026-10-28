import { readdir, stat, mkdir, cp, writeFile, rm } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const videos = join(root, 'videos');
const collator = new Intl.Collator('en', { numeric: true, sensitivity:'base' });
const images = new Set(['.jpg','.jpeg','.png','.webp','.avif']);

// Vercel checks out files with fresh timestamps; filename order is reliable.
// Name clips session-001.mp4, session-002.mp4 etc. for newest-first ordering.
const names = await readdir(videos);
const mp4s = names.filter(name => !name.startsWith('.') && extname(name).toLowerCase() === '.mp4'
  && name.toLowerCase() !== 'demo.mp4');
mp4s.sort((a,b) => collator.compare(b,a));
const files = new Set(names.map(name => name.toLowerCase()));
const manifest = {
  version:1,
  items:mp4s.map(file => {
    const stem = basename(file,extname(file));
    const title = stem.replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim()
      .replace(/\b[a-z]/g, char => char.toUpperCase());
    const posterFile = [...images].map(ext => stem + ext).find(name => files.has(name.toLowerCase()));
    return {
      file,
      title: title || 'ZPUNK Session',
      url: 'videos/' + encodeURIComponent(file),
      poster: posterFile ? 'videos/' + encodeURIComponent(names.find(name => name.toLowerCase() === posterFile.toLowerCase())) : null,
    };
  }),
};
// Keep the site deployable as plain HTML locally, but publish only dist/ on Vercel.
await rm(out, { recursive:true, force:true });
await mkdir(out, { recursive:true });
await cp(join(root,'index.html'),join(out,'index.html'));
await cp(join(root,'images'),join(out,'images'), { recursive:true });
await cp(videos,join(out,'videos'), { recursive:true });
await writeFile(join(out,'videos','gallery.json'),JSON.stringify(manifest,null,2)+'\n');
await writeFile(join(videos,'gallery.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Made with ZPUNK: ${manifest.items.length} song videos (demo.mp4 excluded).`);
