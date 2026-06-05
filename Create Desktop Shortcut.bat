@echo off
setlocal

cd /d "%~dp0"
set "TARGET=%CD%\Computer Lessons.bat"
set "SHORTCUT=%USERPROFILE%\Desktop\Computer Lessons.lnk"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$shell = New-Object -ComObject WScript.Shell; $shortcut = $shell.CreateShortcut('%SHORTCUT%'); $shortcut.TargetPath = '%TARGET%'; $shortcut.WorkingDirectory = '%CD%'; $shortcut.IconLocation = '%SystemRoot%\System32\shell32.dll,220'; $shortcut.Save()"

echo.
echo Desktop shortcut created:
echo Computer Lessons
echo.
echo Your mother can double-click that one shortcut to open the LMS.
echo.
pause
