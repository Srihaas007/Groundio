const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Groundio server running at http://localhost:${port}`);
  console.log(`📱 React Router support enabled - all routes will work!`);
  console.log(`✨ Production build served from dist/`);
  console.log(`\nPress Ctrl+C to stop the server`);
});
