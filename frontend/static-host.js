import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname as pathExtname } from 'path';

const port = process.env.PORT || 5173;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = createServer(async (req, res) => {
  let filePath = join(process.cwd(), 'build', req.url === '/' ? 'index.html' : req.url);
  let extname = String(pathExtname(filePath)).toLowerCase();
  let contentType = mimeTypes[extname] || 'application/octet-stream';

  try {
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      const content = await readFile(join(process.cwd(), 'build', '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    } else {
      res.writeHead(500);
      res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
    }
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
