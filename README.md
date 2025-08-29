A Laravel 12 backend with a React SPA front end powered by Vite (Laravel Breeze React).

Requirements

PHP ≥ 8.2 with extensions: mbstring, openssl, pdo, tokenizer, xml, ctype, json, fileinfo

Composer ≥ 2.5

Node.js ≥ 18 and npm ≥ 9

SQLite (default), MySQL/MariaDB, or PostgreSQL

Git (optional)

Redis (optional, for cache/queue)

Current Installed Versions

- Laravel Framework: 12.26.3
- PHP: 8.3.6
- Composer: 2.7.1
- Node.js: 24.2.0
- npm: 11.3.0

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

# For SQLite (default):
DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite

# For MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=app
# DB_USERNAME=app
# DB_PASSWORD=secret

# For PostgreSQL:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=app
# DB_USERNAME=app
# DB_PASSWORD=secret


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


Serve with Nginx/Apache pointing the document root to public/. Ensure .env is set for production and APP_KEY exists.

Common tasks
# Clear caches
php artisan optimize:clear

# Storage symlink for user uploads
php artisan storage:link

# Run queue worker (if using queues)
php artisan queue:work

# Run tests
php artisan test

Project structure
app/                     # Laravel application code
bootstrap/
config/
database/                # migrations, seeders, factories
public/                  # web root (index.php, built assets in build/)
resources/
  js/                    # React app (entry: app.jsx, components/)
  views/                 # Blade templates (app.blade.php)
routes/
  api.php                # JSON API routes (/api/*)
  web.php                # Web routes (SPA catch-all -> app.blade.php)
vite.config.js
package.json
composer.json

Notes

Do not hand-copy files into public/. Vite writes to public/build.

If React routes 404 on refresh, ensure a catch-all in routes/web.php:

Route::view('/{any}', 'app')->where('any', '.*');

For cookie-based SPA auth, use Laravel Sanctum and same-site domain settings.

Laravel 12 Features
- Improved performance and reduced memory usage
- Enhanced error handling and debugging
- Latest PHP 8.2+ features support
- Improved testing capabilities
- Enhanced security features