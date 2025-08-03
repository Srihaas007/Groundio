#!/usr/bin/env python3
"""
Simple SPA server for React Router support
Serves all routes through index.html while serving static assets normally
"""
import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="dist", **kwargs)

    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_GET(self):
        # Parse the URL path, removing query parameters
        url_path = self.path.split('?')[0]
        
        # Remove leading slash for file system operations
        clean_path = url_path.lstrip('/')
        
        # If it's the root or empty, serve index.html
        if not clean_path or clean_path == '':
            self.path = '/index.html'
            return super().do_GET()
        
        # Check if it's a request for a static file
        file_path = Path('dist') / clean_path
        
        # If the file exists and it's a static asset, serve it normally
        if file_path.exists() and file_path.is_file():
            return super().do_GET()
        
        # If it doesn't exist, it's probably a React Router route
        # Serve index.html instead
        self.path = '/index.html'
        return super().do_GET()

def main():
    PORT = 3000
    
    # Check if dist directory exists
    if not os.path.exists('dist'):
        print("❌ Error: 'dist' directory not found!")
        print("Please run 'npm run build' first to create the production build.")
        return 1
    
    # Check if index.html exists
    if not os.path.exists('dist/index.html'):
        print("❌ Error: 'dist/index.html' not found!")
        print("Please run 'npm run build' first.")
        return 1
    
    print("🚀 Starting Groundio SPA Server...")
    print(f"📁 Serving from: {os.path.abspath('dist')}")
    print(f"🌐 Server URL: http://localhost:{PORT}")
    print("📱 React Router support: ✅ ENABLED")
    print("✨ All routes will serve your React app")
    print()
    print("🎯 Try these URLs:")
    print(f"   • Home: http://localhost:{PORT}/")
    print(f"   • Search: http://localhost:{PORT}/search")
    print(f"   • Login: http://localhost:{PORT}/login")
    print(f"   • SignUp: http://localhost:{PORT}/signup")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print(f"🌐 Opened browser at http://localhost:{PORT}")
            except:
                pass
            
            httpd.serve_forever()
    
    except KeyboardInterrupt:
        print("\n👋 Server stopped gracefully")
        return 0
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use!")
            print("Try killing other servers or use a different port.")
        else:
            print(f"❌ Error starting server: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
