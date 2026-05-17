$ErrorActionPreference = "Stop"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " Starting GeoProteoNet Fetal Anemia Diagnostic API " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Initializing Backend Engine and React Frontend..." -ForegroundColor Yellow
Write-Host ""

# Get the current directory (should be the root of the project)
$RootDir = Get-Location

# 1. Start the FastAPI Backend in a new window so we can see its logs clearly
Write-Host "-> Launching AI Backend (FastAPI)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host '--- GeoProteoNet AI Backend Logs ---' -ForegroundColor Cyan; uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

# 2. Wait a few seconds for the backend to initialize the model weights
Start-Sleep -Seconds 5

# 3. Start the React Frontend in the current terminal window
Write-Host "-> Launching Frontend Dashboard (Vite)..." -ForegroundColor Green
Write-Host "Dashboard will be available at: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Set-Location -Path "frontend"
npm run dev
