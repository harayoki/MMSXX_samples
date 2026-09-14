#!/usr/bin/env python3
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8000

class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        if self.path == '/':
            return self.list_directory(self.translate_path(self.path))
        return super().send_head()

if __name__ == '__main__':
    print(f'serving {os.getcwd()} at http://127.0.0.1:{PORT}/')
    try:
        ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        pass