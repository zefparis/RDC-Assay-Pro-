@echo off
echo 🔍 Vérification Pré-Déploiement RDC Assay Pro
echo =============================================
echo.

set "errors=0"

echo 📁 Vérification de la structure des fichiers...

REM Vérifier fichiers critiques backend
if not exist "backend\package.json" (
    echo ❌ backend\package.json manquant
    set /a errors+=1
) else (
    echo ✅ backend\package.json
)

if not exist "backend\.env.example" (
    echo ❌ backend\.env.example manquant
    set /a errors+=1
) else (
    echo ✅ backend\.env.example
)

if not exist "backend\railway.json" (
    echo ❌ backend\railway.json manquant
    set /a errors+=1
) else (
    echo ✅ backend\railway.json
)

if not exist "backend\Procfile" (
    echo ❌ backend\Procfile manquant
    set /a errors+=1
) else (
    echo ✅ backend\Procfile
)

if not exist "backend\prisma\schema.prisma" (
    echo ❌ backend\prisma\schema.prisma manquant
    set /a errors+=1
) else (
    echo ✅ backend\prisma\schema.prisma
)

REM Vérifier fichiers critiques frontend
if not exist "package.json" (
    echo ❌ package.json (frontend) manquant
    set /a errors+=1
) else (
    echo ✅ package.json (frontend)
)

if not exist ".env.example" (
    echo ❌ .env.example (frontend) manquant
    set /a errors+=1
) else (
    echo ✅ .env.example (frontend)
)

if not exist "src\lib\api.ts" (
    echo ❌ src\lib\api.ts manquant
    set /a errors+=1
) else (
    echo ✅ src\lib\api.ts
)

REM Vérifier .gitignore
if not exist ".gitignore" (
    echo ❌ .gitignore manquant
    set /a errors+=1
) else (
    echo ✅ .gitignore
)

echo.
echo 🔧 Vérification des configurations...

REM Vérifier que .env n'est pas commité
if exist "backend\.env" (
    echo ⚠️  backend\.env existe - assurez-vous qu'il est dans .gitignore
)

if exist ".env.local" (
    echo ⚠️  .env.local existe - assurez-vous qu'il est dans .gitignore
)

echo.
echo 📊 Résumé de la vérification:

if %errors% equ 0 (
    echo ✅ Tous les fichiers critiques sont présents
    echo ✅ Prêt pour Git et déploiement Railway !
    echo.
    echo 🚀 Prochaines étapes:
    echo 1. git add .
    echo 2. git commit -m "🎉 Ready for Railway deployment"
    echo 3. git push
    echo 4. Déployer sur Railway selon le guide
) else (
    echo ❌ %errors% erreur(s) détectée(s)
    echo ❌ Corrigez les erreurs avant le déploiement
)

echo.
echo 📖 Consultez RAILWAY_FULLSTACK_DEPLOYMENT.md pour le guide complet
echo.
pause
