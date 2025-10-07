@echo off
echo ========================================
echo    RDC Assay Pro - Demarrage Rapide
echo ========================================
echo.

REM Verifier si Node.js est installe
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe ou pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js detecte: 
node --version

REM Verifier si les dependances sont installees
if not exist "node_modules" (
    echo [INFO] Installation des dependances...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec de l'installation des dependances
        pause
        exit /b 1
    )
)

REM Verifier si le fichier .env.local existe
if not exist ".env.local" (
    echo [INFO] Creation du fichier de configuration...
    copy ".env.example" ".env.local" >nul
    echo Configuration creee: .env.local
)

echo.
echo [SUCCESS] Configuration terminee !
echo.
echo ========================================
echo  L'application va demarrer sur:
echo  http://localhost:3000
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

REM Demarrer le serveur de developpement
call npm run dev
