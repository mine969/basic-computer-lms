@echo off
setlocal

echo.
echo Set OpenAI API Key
echo.
echo Do not share your API key in chat.
echo This will save it on this Windows user account as OPENAI_API_KEY.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$key = Read-Host 'Paste your OpenAI API key here' -AsSecureString; $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($key)); if ([string]::IsNullOrWhiteSpace($plain)) { Write-Host 'No key entered.'; exit 1 }; [Environment]::SetEnvironmentVariable('OPENAI_API_KEY', $plain, 'User'); Write-Host 'OPENAI_API_KEY saved for this Windows user.'"

if errorlevel 1 (
  echo.
  echo API key was not saved.
  pause
  exit /b 1
)

echo.
echo Done.
echo Close and reopen your terminal before running translation.
echo Then run:
echo npm run translate:my
echo npm run build
echo.
pause
