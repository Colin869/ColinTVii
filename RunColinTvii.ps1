Write-Host "Starting ColinTvii IPTV Player..." -ForegroundColor Green
Write-Host ""

# Change to the script directory
Set-Location $PSScriptRoot

# Start the application
npm start

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 