const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3001;
const distPath = path.join(__dirname, 'dist');

// MIME types for different file extensions
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

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Remove leading slash
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }
  
  // If no pathname or it's a directory, serve index.html
  if (!pathname || pathname === '') {
    pathname = 'index.html';
  }
  
  const filePath = path.join(distPath, pathname);
  const ext = path.parse(filePath).ext;
  const mimeType = mimeTypes[ext] || 'text/plain';
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist - serve index.html for SPA routing
      const indexPath = path.join(distPath, 'index.html');
      fs.readFile(indexPath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      });
    } else {
      // File exists - serve it
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content, 'utf-8');
      });
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Groundio SPA Server running at http://localhost:${port}`);
  console.log(`📁 Serving from: ${distPath}`);
  console.log(`📱 React Router support enabled`);
  console.log(`\nPress Ctrl+C to stop the server`);
});
