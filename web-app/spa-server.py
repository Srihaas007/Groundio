#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the request path
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # If it's a file request (has extension), serve it normally
        if os.path.splitext(path)[1]:
            return super().do_GET()
        
        # For all other requests (routes), serve index.html
        if not path.endswith('/') and not os.path.exists(path.lstrip('/')):
            self.path = '/index.html'
        
        return super().do_GET()

if __name__ == "__main__":
    PORT = 3000
    
    # Change to dist directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(script_dir, 'dist')
    os.chdir(dist_dir)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
