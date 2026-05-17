# Start Backend
Write-Host "Starting FastAPI Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python main.py"

# Start Frontend
Write-Host "Starting Vite Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Both services are starting. Please wait a few seconds..." -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend: http://localhost:8000"
