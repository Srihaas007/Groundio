#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="dist", **kwargs)

    def do_GET(self):
        # Parse the URL path
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # If it's the root path, serve index.html
        if path == '/' or path == '':
            self.path = '/index.html'
            return super().do_GET()
        
        # If it's a static file (has extension), try to serve it
        if '.' in path:
            # Check if file exists in dist directory
            file_path = os.path.join('dist', path.lstrip('/'))
            if os.path.exists(file_path):
                return super().do_GET()
        
        # For all other paths (React Router routes), serve index.html
        self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    PORT = 3002
    
    # Check if dist directory exists
    if not os.path.exists('dist'):
        print("❌ Error: 'dist' directory not found!")
        print("Please run 'npm run build' first.")
        sys.exit(1)
    
    print(f"🚀 Starting Groundio SPA Server...")
    print(f"📁 Serving from: {os.path.abspath('dist')}")
    print(f"🌐 Server running at: http://localhost:{PORT}")
    print(f"📱 React Router support enabled")
    print(f"✨ All routes will serve the React app")
    print()
    print("Press Ctrl+C to stop the server")
    
    try:
        with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped gracefully")
    except OSError as e:
        if e.errno == 98 or "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use. Please try a different port.")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
