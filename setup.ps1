# QuizHub Platform - Quick Start Script for Windows
# Run this script in PowerShell to set up the project

Write-Host "🚀 QuizHub Platform - Quick Start Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm installation
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚙️  Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Please edit .env file and add your MongoDB password!" -ForegroundColor Yellow
    Write-Host "   Location: $PWD\.env" -ForegroundColor Yellow
    Write-Host ""
    
    # Ask if user wants to edit now
    $response = Read-Host "Do you want to edit .env file now? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        notepad .env
    }
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔨 Building shared package..." -ForegroundColor Yellow
Set-Location "packages\shared"
npm install
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build shared package" -ForegroundColor Red
    Set-Location "..\..\"
    exit 1
}

Set-Location "..\..\"
Write-Host "✅ Shared package built successfully" -ForegroundColor Green
Write-Host ""

Write-Host "🏗️  Setting up Auth Service..." -ForegroundColor Yellow
Set-Location "apps\auth-service"
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install auth service dependencies" -ForegroundColor Red
    Set-Location "..\..\"
    exit 1
}

Set-Location "..\..\"
Write-Host "✅ Auth service setup complete" -ForegroundColor Green
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure MongoDB:" -ForegroundColor White
Write-Host "   - Edit .env file" -ForegroundColor Gray
Write-Host "   - Replace <db_password> with your actual MongoDB Atlas password" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start Development Server:" -ForegroundColor White
Write-Host "   cd apps\auth-service" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test the API:" -ForegroundColor White
Write-Host "   - Health Check: http://localhost:3001/health" -ForegroundColor Gray
Write-Host "   - API Docs: http://localhost:3001/api-docs" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Read Documentation:" -ForegroundColor White
Write-Host "   - Setup Guide: SETUP.md" -ForegroundColor Gray
Write-Host "   - Project Status: PROJECT_STATUS.md" -ForegroundColor Gray
Write-Host "   - Contributing: CONTRIBUTING.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Happy Coding!" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to start dev server
$startDev = Read-Host "Do you want to start the Auth Service now? (y/n)"
if ($startDev -eq "y" -or $startDev -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Starting Auth Service..." -ForegroundColor Cyan
    Set-Location "apps\auth-service"
    npm run dev
}
