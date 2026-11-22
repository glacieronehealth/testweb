import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = 8080;
const PUBLIC_DIR = path.resolve('./fraenk-app/dist');
const UPLOAD_DIR = path.resolve('./uploads');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function safeJoin(baseDir, relPath) {
  const cleaned = decodeURIComponent(relPath).replace(/^\/+/, '');
  const resolved = path.resolve(baseDir, cleaned);
  if (resolved !== baseDir && !resolved.startsWith(baseDir + path.sep)) {
    return null;
  }
  return resolved;
}

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(Object.assign(new Error('Payload too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

    // 1. GET <path> -> statische Datei aus PUBLIC_DIR laden
    if (req.method === 'GET') {
      const target = safeJoin(PUBLIC_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
      if (!target) {
        return sendJson(res, 403, { error: 'Forbidden' });
      }

      let filePath = target;
      try {
        const st = await fs.stat(filePath);
        if (st.isDirectory()) filePath = path.join(filePath, 'index.html');
        const content = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
        return res.end(content);
      } catch {
        return sendJson(res, 404, { error: 'Not found' });
      }
    }

    // 2. POST JSON -> lokale Verarbeitung je nach Payload/Aktion
    if (req.method === 'POST' && url.pathname === '/api/action') {
      const raw = await readBody(req, 1024 * 1024); // max. 1 MB
      let payload;
      try {
        payload = JSON.parse(raw.toString('utf8'));
      } catch {
        return sendJson(res, 400, { error: 'Invalid JSON' });
      }

      switch (payload.action) {
        case 'ping':
          return sendJson(res, 200, { ok: true, time: new Date().toISOString() });

        case 'save-item':
          // Hier lokal z. B. JSON/Markdown in ein festes Verzeichnis schreiben
          return sendJson(res, 200, { ok: true, received: payload.id ?? null });

        default:
          return sendJson(res, 400, { error: 'Unknown action' });
      }
    }

    // 3. POST File -> Raw-Bytes unter festem Basisverzeichnis speichern
    if (req.method === 'POST' && url.pathname === '/api/upload') {
      const rawName = path.basename(url.searchParams.get('name') ?? '');
      if (!rawName || rawName === '.' || rawName === '..') {
        return sendJson(res, 400, { error: 'Missing or invalid filename' });
      }

      const target = safeJoin(UPLOAD_DIR, rawName);
      if (!target) {
        return sendJson(res, 403, { error: 'Forbidden' });
      }

      const data = await readBody(req, 10 * 1024 * 1024); // max. 10 MB
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      await fs.writeFile(target, data, { flag: 'wx' }); // 'wx' verhindert stilles Überschreiben
      return sendJson(res, 201, { ok: true, file: rawName, size: data.length });
    }

    sendJson(res, 404, { error: 'Endpoint not found' });
  } catch (err) {
    if (err.status === 413) {
      return sendJson(res, 413, { error: 'Request body too large' });
    }
    if (err.code === 'EEXIST') {
      return sendJson(res, 409, { error: 'File already exists' });
    }
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
