@echo off
echo 🚀 Starting RDC Assay Pro Backend...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 18.0.0 or higher from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed or not in PATH
    pause
    exit /b 1
)

:: Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found
    echo Creating .env file from .env.example...
    copy .env.example .env >nul
    echo ✅ .env file created
    echo.
    echo ⚠️  Please edit .env file with your configuration before continuing
    echo Press any key to open .env file in notepad...
    pause >nul
    notepad .env
    echo.
    echo Press any key to continue after editing .env file...
    pause >nul
)

:: Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
    echo.
)

:: Check if Prisma client is generated
if not exist node_modules\.prisma (
    echo 🔧 Generating Prisma client...
    npm run prisma:generate
    if %errorlevel% neq 0 (
        echo ❌ Failed to generate Prisma client
        pause
        exit /b 1
    )
    echo ✅ Prisma client generated
    echo.
)

:: Create uploads and logs directories
if not exist uploads mkdir uploads
if not exist logs mkdir logs

echo 🏥 Checking database connection...
npm run prisma:migrate >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Database migration failed
    echo Please ensure PostgreSQL is running and DATABASE_URL is correct in .env
    echo.
    echo Would you like to continue anyway? (y/n)
    set /p continue=
    if /i not "%continue%"=="y" (
        pause
        exit /b 1
    )
) else (
    echo ✅ Database connection successful
)

echo.
echo 🌱 Would you like to seed the database with sample data? (y/n)
set /p seed=
if /i "%seed%"=="y" (
    npm run seed
    if %errorlevel% neq 0 (
        echo ⚠️  Database seeding failed, but continuing...
    ) else (
        echo ✅ Database seeded successfully
        echo.
        echo 📝 Test credentials:
        echo Admin: admin@rdcassay.africa / admin123
        echo Analyst: analyst@rdcassay.africa / analyst123
        echo Client: client@mining-corp.cd / client123
    )
)

echo.
echo 🚀 Starting development server...
echo.
echo 📍 Server will be available at:
echo    - API: http://localhost:5000
echo    - Documentation: http://localhost:5000/api-docs
echo    - Health Check: http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
