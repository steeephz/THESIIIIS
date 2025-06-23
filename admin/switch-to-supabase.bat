@echo off
echo Switching back to Supabase database...

REM Restore Supabase .env configuration
copy .env.supabase .env

REM Clear cache
php artisan config:clear
php artisan cache:clear

echo Supabase environment restored! You can now run: php artisan serve
pause 