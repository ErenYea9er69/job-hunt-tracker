import webview
import subprocess
import time
import sys
import os
import atexit

def start_server():
    # Use CREATE_NO_WINDOW to hide the console window of the Next.js server
    CREATE_NO_WINDOW = 0x08000000
    
    cwd = os.getcwd()
    
    process = subprocess.Popen(
        ['npm', 'run', 'dev'],
        cwd=cwd,
        shell=True,
        creationflags=CREATE_NO_WINDOW
    )
    return process

def main():
    server_process = start_server()
    
    # Ensure server is killed when app exits
    atexit.register(lambda: server_process.kill())
    
    # Wait for the Next.js server to boot up
    time.sleep(4)
    
    # Create and start the webview window
    webview.create_window('Job Hunt Tracker', 'http://localhost:3000', width=1280, height=800)
    webview.start()
    
    # When window is closed, kill the server and exit
    server_process.kill()
    sys.exit(0)

if __name__ == '__main__':
    main()
