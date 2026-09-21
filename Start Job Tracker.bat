@echo off
echo Starting Job Hunt Tracker...
cd /d "%~dp0"

:: Start the Next.js development server in the background
start /b npm run dev

:: Wait a few seconds for the server to start
timeout /t 5 /nobreak > nul

:: Open Microsoft Edge in "App Mode" (looks like a native desktop app)
start msedge --app=http://localhost:3000

echo App opened! You can minimize this window.
