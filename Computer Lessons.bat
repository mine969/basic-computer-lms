@echo off
setlocal

cd /d "%~dp0"
title Computer Lessons

echo.
echo ========================================
echo   Computer Lessons
echo ========================================
echo.
echo Please wait. The lessons will open soon.
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed on this computer.
  echo Please ask for help installing Node.js first.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\vite.cmd" (
  echo First-time setup is running.
  echo This may take a few minutes.
  echo.
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo Setup failed. Please ask for help.
    echo.
    pause
    exit /b 1
  )
)

if not exist "dist\index.html" (
  echo Preparing lessons for offline use.
  echo.
  call npm.cmd run build
  if errorlevel 1 (
    echo.
    echo Lesson preparation failed. Please ask for help.
    echo.
    pause
    exit /b 1
  )
)

netstat -ano | findstr ":4173" >nul 2>nul
if not errorlevel 1 (
  echo Lessons are already running.
  echo Opening the browser now...
  start "" "http://127.0.0.1:4173"
  echo.
  echo If the lessons are open, you may close this window.
  echo.
  pause
  exit /b 0
)

echo Opening lessons now...
echo.
start "" "http://127.0.0.1:4173"

echo The lessons are open in the browser.
echo Keep this window open while studying.
echo Close this window when finished.
echo.

call npm.cmd run serve
