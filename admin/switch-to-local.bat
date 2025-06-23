@echo off
echo Switching to local SQLite database...

REM Backup current .env
copy .env .env.supabase.backup

REM Create local .env configuration
(
echo APP_NAME=Laravel
echo APP_ENV=local
echo APP_KEY=base64:OXhx/ssPwPlLWyjwdr14WmdILGUQ1W+sO7eKed7WORs=
echo APP_DEBUG=true
echo APP_URL=http://localhost
echo.
echo LOG_CHANNEL=stack
echo LOG_DEPRECATIONS_CHANNEL=null
echo LOG_LEVEL=debug
echo.
echo DB_CONNECTION=sqlite
echo DB_DATABASE=database/database.sqlite
echo.
echo BROADCAST_DRIVER=log
echo CACHE_DRIVER=file
echo FILESYSTEM_DISK=local
echo QUEUE_CONNECTION=sync
echo SESSION_DRIVER=file
echo SESSION_LIFETIME=120
echo.
echo MAIL_MAILER=smtp
echo MAIL_HOST=mailpit
echo MAIL_PORT=1025
echo MAIL_USERNAME=null
echo MAIL_PASSWORD=null
echo MAIL_ENCRYPTION=null
echo MAIL_FROM_ADDRESS="hello@example.com"
echo MAIL_FROM_NAME="${APP_NAME}"
) > .env

REM Create SQLite database file if it doesn't exist
if not exist "database\database.sqlite" (
    echo Creating SQLite database file...
    echo. > database\database.sqlite
)

REM Clear cache and migrate
php artisan config:clear
php artisan cache:clear
php artisan migrate --force

echo Local environment ready! You can now run: php artisan serve
pause 