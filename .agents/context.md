# Project Context — SodaStream

## Tech Stack
- **Backend**: Node.js + Express, MSSQL (stored procedures via `store_eject`)
- **Frontend**: Vanilla JS, custom graphic library (`Gb`), no frameworks
- **Video**: HLS streaming (HLS.js on web), FFmpeg for conversion
- **Auth**: Custom JWT (GOST encryption), httpOnly cookies + CSRF tokens, `access_token` / `refresh_token` flow
- **Core**: Git submodule at `src/server/app/core` → `https://github.com/ulisesten/core.git`

## Architecture
- Domain-driven: `domain/` (business logic), `service/` (tech/external), `dto/` (response adaptation)
- DB access exclusively via `store_eject` (no raw SQL)
- Stored procedures use `tipoConsulta` (SELECT) / `tipoProceso` / `tipoRegistro` (INSERT/UPDATE/DELETE)
- Frontend graphic lib: `Gb.define(type, opts)` → classes with `create()`, `applyStyle()`, `getEl()`, `getValues()`, CSS-only styling (prefix `g_`), no inline styles

## Auth Flow
- **Login**: `POST /api/v1/users/signin` or `/api/v2/users/signin` → sets `access_token` (httpOnly, path `/api/v1`), `csrf_token`, `refresh_token`, `refresh_csrf_token` cookies
- **Protected requests**: send `access_token` cookie + `x-csrf-token` header
- **Refresh**: `POST /api/v1/users/refresh_token` with `refresh_token` cookie + `x-csrf-token` (value from `refresh_csrf_token` cookie)
- **Token lifetimes**: access 15min, refresh 7 days; cookie `secure` only in production
- **`funProtectedFetch`**: auto-refresh on 401, no `Content-Type` on FormData, redirect to `/signin?redirect=<path>` on refresh failure
- **`authService.verify`/`.refresh`**: now async (uses `this.userDAO()`), must use `.bind(authService)` as middleware

## API Routes
- **v1**: `/api/v1/users`, `/api/v1/videos`, `/api/v1/series`, `/api/v1/seasons`, `/api/v1/genres`, `/api/v1/email`
- **v2**: `/api/v2/users` (signin + register with salt, nanoid)
- **Client routes**: `/`, `/signin`, `/feed`, `/video/:video`, `/feed_tv`, `/video_tv/:video`, `/upload`
- **Docs**: `docs/ANDROID_API.md`

## Graphic Library Components
- `Form`: scoped IDs (`__form_N`), `getValues`/`setValues`/`reset` skip `type=submit`, `no_border`/`no_margin`
- `TableGrid`: sticky header (no z-index), row/multi selection (`getSelection()` → `{rows, data, count}`), `loadData(data)`, `no_border`/`no_margin`, `setHeaders()`
- `CardGrid`: wrapper div for scroll, `getEl()` returns wrapper
- `Header`: username left, thumbnail right
- `Toolbar`: separator `type: '-'`, menu panel, `no_border`/`no_margin`
- `Button`: color option (`'purple'`, `'yellow'`), green default
- `Window`: `no_controls`, `no_border` (removes radius+shadow), minimize/maximize/close
- `GNotification`: type (success/error/warning/info), icon, close, animation
- `ProgressBar`: `close()` for any window type
- `VideoPlayer`: HLS.js, `setData()` uses `vid_path.replace('/hls/videos', '')`

## CSS Themes
- `style.default_dark.css` — solid dark (#11161d), green accents (#43c464), gradient title text
- `style.light_gradient.css` — light gradient (#25c481→#25b7c4), glassmorphism rgba(255,255,255,0.05~0.12), white text
- `style.dark_gradient.css` — dark gradient (#0a1628→#132743), glassmorphism rgba(0,0,0,0.2~0.35), teal accents (#5eead4)
- Fontello icons loaded via `@import` in CSS
- Buttons: border-radius 4px, no bold, green/rgba default
- `body.g_video_scrollable` for scroll pages vs `overflow: hidden` for grid pages

## Smart TV Modules
- `videos_ver_tv`: fullscreen player, `TVFocusManager` (D-pad + mousemove/mouseover for Hi Browser), `cursor: none`, ArrowDown exits fullscreen
- `videos_feed_tv`: sticky header, search, row-based cards, `TVFeedFocusManager`
- Detection: `funEsSmartTV()` → redirect to TV pages
- Direct DOM construction (no graphic lib) for full control
- HLS: `vid_path.replace('/hls/videos', '')`, no `<source>` tag (HLS.js API only)

## Frontend Rules
- Functions read from forms via `Gb.getEl(...).getValues()`, no input params
- Requests to URLs in `fun.constants.js`, `Content-Type: application/json`
- Error handling: `try/catch`, `console.error`, `Gb.define('notification', ...)`
- On success: close form windows, reset forms + progress bars
- Keep functions simple, no unnecessary modularization

## Key Files
- `src/server/app/core/` — submodule (auth, JWT, encrypt, config, sql_eject, errors)
- `src/server/app/librerias/sql_server/sql_eject.js` — DB adapter (same as core's but with telegram_bot)
- `src/server/app/routes/api/v1/users/` — user routes, domain, dto
- `src/server/app/routes/api/v2/users/` — v2 user API (salt, nanoid)
- `src/server/app/routes/api/v1/videos/` — video CRUD, upload (multer), thumbnails, progress
- `src/server/app/routes/api/v1/series/`, `seasons/`, `genres/` — catalog modules
- `src/server/client_routes.js` — HTML page routes
- `src/server/server.js` — Express app + route mounts
- `public/pages/general/librerias/graphic/lib.js` — graphic library
- `public/pages/general/librerias/graphic/styles/` — CSS themes
- `public/pages/general/functions/fun.general.js` — `funProtectedFetch`, `funRefrescarToken`
- `public/pages/videos_ver_tv/` — TV video page
- `public/pages/videos_feed_tv/` — TV feed page
- `public/pages/sign_in/functions/fun.constants.js` — frontend URLs (`urlUsersSignin = '/api/v2/users/signin'`)

## Completed
- TableGrid: selection, sticky header, height/width, no_border/no_margin, credentials/headers
- Form: scoped IDs, getValues/setValues/reset skip submits, no_border/no_margin, button colors
- Window/Toolbar/Button/CardGrid/GNotification/ProgressBar features
- Auth fixes: `write_token` duration, cookie secure conditional, `refresh_csrf_token` path `/`, sameSite Lax
- `funProtectedFetch`: 401-only refresh, no Content-Type on FormData, redirect with hostname validation
- VideoPlayer: HLS.js, fontello icons
- TV modules: spatial nav, fullscreen, mousemove/mouseover, cursor:none
- Core as git submodule
- Android API docs
- CSS themes: default_dark, light_gradient, dark_gradient

## Pending
- Git push (submodule + main repo, credentials issue) — requiere `git push --force --all` tras purge de historial
- Dockerfile, docker-compose.yml, .dockerignore
- Healthcheck endpoint (`GET /health`)
- Fix `API_NAS` hardcoded path for Docker volumes
- **Seguridad P0 restantes:**
  - Endpoints sin auth: `POST /series`, `/seasons`, `/genres`, `/:vid_id/thumbnails` → agregar `authService.verify`
  - `DB_ENCRYPT`/`DB_TRUST_CERTIFICATE` lógica invertida en `configuration.js:54-55` (`=== 'false'` → `=== 'true'`)
  - `purchases/dto.js` exporta `SalesDto` en vez de `PurchasesDto`
  - `JSON.parse(decrypted_data)` sin try/catch en `jwt.js` (`gost_verify`, `verify_refresh_token`)
  - `FileDeleter` borra archivo original aunque la conversión FFmpeg falle en `video_processor.cpp`
- **Seguridad P1:**
  - Sin pool de conexiones DB en `sql_eject.js`
  - `ConvertToHLS` bloquea el event loop (C++ síncrono)
  - Claves GOST regeneradas en cada reinicio en `encrypt.js`
  - `X_VECTOR` estático rompe seguridad del cifrado GOST
  - Límite de 999 segmentos HLS en `video_processor.cpp`
  - Sin rate limiting en ningún endpoint
  - HLS.js desde CDN sin SRI
  - Sin filtro ni límite de tamaño en multer para upload de video
- **Otros:**
  - Módulos muertos no montados: `videos_images/`, `products/`, `purchases/`, `orders/` (eliminar), `init_websocket.js`
  - Path hardcodeado en `videos_images/index.js`
  - Path relativo profundo en `config.js`
  - Sin tests reales
  - API FFmpeg deprecada `av_init_packet` en `video_processor.cpp`
  - `binding.gyp` solo Linux
  - `start.sh` sin manejo de errores

## Critical Bugs Fixed (don't regress)
- `write_token` used 86400000 (days ms) instead of 60000 (minutes ms)
- `REFRESH_TOKEN_EXPIRATION_DAYS` raw string → NaN → immediate cookie expiry
- Cookie `secure: true` in dev (HTTP) blocked all cookies
- `csrf_token` had no maxAge (session-only); `refresh_csrf_token` had unreadable path
- `funProtectedFetch` forced `Content-Type: application/json` on FormData
- VideoPlayer `setData()`: double `/hls/videos/` without `.replace()`
- HLS.js + `<source>` tag conflict
- `authService.verify` needs `.bind(authService)` for async `this.userDAO()`
- `authorization.js` in submodule used wrong path `../librerias/sql_server/sql_eject.js` → fixed to `./sql_eject.js`
- `users_domain.js` signin passed `dao` param to updated `authService.user_signin()` (now self-queries)

## Security Fixes Applied
- `.gitignore`: agregados `http_files/` y `.env.example`; historial git purgado con `git-filter-repo` (credenciales en `http_files/users.http` eliminadas de todos los commits)
- `jwt.js`: comparaciones vulnerables a timing attack reemplazadas con `crypto.timingSafeEqual` (`gost_verify`, `gost_hash_verify`, `verify_refresh_token`, `verify_csrf_token`) vía helper estático `safeCompare`
- `server.js`: eliminado fallback a HTTP en producción cuando fallan certificados SSL → ahora `process.exit(1)`
- `server.js`: eliminado `express.json()` duplicado; límite reducido de 10GB a 10MB en JSON y URL-encoded
