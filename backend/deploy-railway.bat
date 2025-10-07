@echo off
echo 🚀 Déploiement RDC Assay Pro Backend sur Railway...
echo.

echo 📦 Installation des dépendances...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo 🔧 Génération du client Prisma...
npm run prisma:generate
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la génération Prisma
    pause
    exit /b 1
)

echo 🏗️ Build du projet...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo 🗄️ Déploiement des migrations...
npm run prisma:deploy
if %errorlevel% neq 0 (
    echo ⚠️ Erreur lors des migrations (peut être normal si déjà appliquées)
)

echo 🌱 Seeding de la base de données...
npm run seed
if %errorlevel% neq 0 (
    echo ⚠️ Erreur lors du seeding (peut être normal si déjà fait)
)

echo.
echo ✅ Préparation terminée !
echo.
echo 📝 Prochaines étapes :
echo 1. Connectez-vous à Railway : railway login
echo 2. Initialisez le projet : railway init
echo 3. Déployez : railway up
echo.
echo 🔗 Ou connectez votre repo GitHub à Railway
echo.
pause
