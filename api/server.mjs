import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 3000);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg' };
const send = (res, status, data, type='application/json; charset=utf-8') => { res.writeHead(status, {
  'Content-Type':type,
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'Content-Type',
  'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS',
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY',
  'Referrer-Policy':'no-referrer',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  'Cache-Control':type.startsWith('text/html')||type.startsWith('application/json')?'no-store':'public, max-age=300'
}); const body=type.startsWith('application/json')&&!Buffer.isBuffer(data)&&typeof data!=='string'?JSON.stringify(data):data;res.end(body); };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (url.pathname === '/api/health') return send(res, 200, { ok:true, service:'A AND C Order API' });
  if (url.pathname.startsWith('/api/')) return send(res, 501, { message:'เส้น API พร้อมกำหนดแล้ว แต่ต้องเชื่อมฐานข้อมูลก่อนใช้งานจริง', endpoint:url.pathname });
  const relative = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
  send(res, 200, fs.readFileSync(file), types[path.extname(file).toLowerCase()] || 'application/octet-stream');
}).listen(port, () => console.log(`A AND C Order System: http://localhost:${port}`));
