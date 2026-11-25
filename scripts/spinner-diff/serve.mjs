// Static server for the diff harness: serves the repo root (so the page can
// fetch the sprites) and takes POST /save?path=… from the diff page, writing
// the body into ./report (data: URLs are decoded to binary).
//   node scripts/spinner-diff/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const reportDir = join(here, 'report');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.css': 'text/css' };

export function serve(port = 4178) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (req.method === 'POST' && url.pathname === '/save') {
        const target = normalize(join(reportDir, url.searchParams.get('path')));
        if (!target.startsWith(reportDir)) throw new Error('bad path');
        let body = '';
        for await (const chunk of req) body += chunk;
        const m = body.match(/^data:[^;]+;base64,(.*)$/);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, m ? Buffer.from(m[1], 'base64') : body);
        res.end('ok');
        return;
      }
      const path = url.pathname === '/' ? '/scripts/spinner-diff/out/diff.html' : url.pathname;
      const file = normalize(join(root, path));
      if (!file.startsWith(root)) throw new Error('bad path');
      const data = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(data);
    } catch (err) {
      res.writeHead(404);
      res.end(String(err.message));
    }
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2]) || 4178;
  await serve(port);
  console.log(`spinner diff: http://localhost:${port}/scripts/spinner-diff/out/diff.html`);
}
