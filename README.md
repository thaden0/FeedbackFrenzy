#Feedback Frenzy
A Laravel 12 backend with a React SPA front end powered by Vite (Laravel Breeze React).

![screen shot](https://github.com/thaden0/FeedbackFrenzy/blob/main/public/images/screenshot.png)


Requirements

PHP ≥ 8.2 with extensions: mbstring, openssl, pdo, tokenizer, xml, ctype, json, fileinfo
Composer ≥ 2.5
Node.js ≥ 18 and npm ≥ 9
SQLite (default), MySQL/MariaDB, or PostgreSQL

Quick start
# 1) Clone and enter
git clone <repo_url> app && cd app

# 2) Backend deps
composer install

# 3) Frontend deps
npm install

# 4) Env
cp .env.example .env
php artisan key:generate

Edit .env database values (SQLite is configured by default):


Create DB and run migrations:

php artisan migrate --seed   # omit --seed if not using seeders

Run in development

Terminal A (PHP server):
php artisan serve           # http://127.0.0.1:8000


Terminal B (Vite dev server):
npm run dev                 # hot reload for React

Open http://127.0.0.1:8000
. The SPA mounts from resources/views/app.blade.php and bootstraps at resources/js/app.jsx.

Build for production
npm run build               # outputs to public/build
php artisan config:cache route:cache view:cache
php artisan migrate --force
