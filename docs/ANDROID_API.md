# SodaStream API — Android Client Reference

Base URL: `{SERVER_HOST}/api/v1`

## Authentication

Protected routes require two credentials sent on every request:

| Credential | Location | Description |
|---|---|---|
| `access_token` | Cookie (`httpOnly`, path `/api/v1`) | JWT access token |
| `x-csrf-token` | Header | CSRF token (from `csrf_token` cookie) |

Both are set automatically by the server on login and refresh.

### Token Lifetimes

| Token | Default Duration |
|---|---|
| `access_token` + `csrf_token` | 15 minutes |
| `refresh_token` + `refresh_csrf_token` | 7 days |

### Refresh Flow

When a protected request returns **401**, call `POST /users/refresh_token` with:

- Cookie: `refresh_token` (httpOnly, sent automatically)
- Header: `x-csrf-token: <value of refresh_csrf_token cookie>`

On success the server sets new `access_token`, `csrf_token`, and `refresh_csrf_token` cookies. Retry the original request with the new credentials.

If refresh also returns 401, redirect the user to `/signin`.

---

## Users

### `POST /users` — Register

Auth: None

**Body (JSON)**

| Field | Type | Required |
|---|---|---|
| `usu_nombre` | string | yes |
| `usu_ape_paterno` | string | yes |
| `usu_ape_materno` | string | yes |
| `usu_correo` | string | yes |
| `usu_contrasena` | string | yes |

**Response 200**

```json
{
  "msg": "...",
  "success": true,
  "error": 0
}
```

---

### `POST /users/signin` — Login

Auth: None

**Body (JSON)**

| Field | Type | Required |
|---|---|---|
| `usu_correo` | string | yes |
| `usu_contrasena` | string | yes |

**Response 200** (also sets cookies: `access_token`, `csrf_token`, `refresh_token`, `refresh_csrf_token`)

```json
{
  "msg": "Inicio de sesión exitoso.",
  "success": true,
  "error": 0,
  "data": {
    "usu_id": 1,
    "usu_nombre": "...",
    "usu_correo": "..."
  }
}
```

**Response 401**

```json
{
  "msg": "El usuario no fue autorizado o no existe.",
  "success": false,
  "error": 1
}
```

---

### `POST /users/refresh_token` — Refresh Token

Auth: `refresh_token` cookie + `x-csrf-token` header (`refresh_csrf_token` value)

**Body**: None

**Response 200** (sets new `access_token`, `csrf_token`, `refresh_csrf_token` cookies)

```json
{
  "msg": "Token renovado exitosamente.",
  "success": true,
  "error": 0,
  "data": {
    "user": {
      "usu_id": 1,
      "usu_nombre": "...",
      "usu_correo": "..."
    }
  }
}
```

**Response 401**

```json
{
  "success": false,
  "error": 1,
  "msg": "Authentication rejected."
}
```

---

### `GET /users/info` — Current User Info

Auth: `access_token` cookie + `x-csrf-token` header

**Response 200**

```json
{
  "msg": "Información del usuario obtenida exitosamente.",
  "success": true,
  "error": 0,
  "data": {
    "usu_id": 1,
    "usu_nombre": "...",
    "usu_correo": "..."
  }
}
```

---

### `GET /users` — List All Users

Auth: `access_token` cookie + `x-csrf-token` header

**Response 200**

```json
{
  "msg": "...",
  "success": true,
  "error": 0,
  "data": [ { ... } ]
}
```

---

### `PUT /users/:usu_id` — Update User

Auth: None

**Params**

| Param | Type |
|---|---|
| `usu_id` | integer |

**Body (JSON)**

| Field | Type | Required |
|---|---|---|
| `usu_nombre` | string | yes |
| `usu_ape_paterno` | string | yes |
| `usu_ape_materno` | string | yes |
| `usu_correo` | string | yes |

**Response 200**

```json
{
  "msg": "...",
  "success": true,
  "error": 0
}
```

---

## Videos

### `GET /videos` — Feed (Card Format)

Auth: None

**Response 200**

```json
{
  "msg": "Se obtuvieron los videos correctamente.",
  "success": true,
  "error": 0,
  "data": [
    {
      "vid_id_public": "...",
      "vid_nombre": "...",
      "vid_descripcion": "...",
      "vid_path": "/hls/videos/{id}/playlist.m3u8",
      "vid_thumbnail": "..."
    }
  ]
}
```

---

### `GET /videos/table_format` — Admin Table Format

Auth: `access_token` cookie + `x-csrf-token` header

**Response 200**: Same shape as `GET /videos`.

---

### `GET /videos/:vid_id` — Video by ID

Auth: None

**Params**

| Param | Type |
|---|---|
| `vid_id` | string (vid_id_public) |

**Response 200**

```json
{
  "msg": "Se obtuvo el video correctamente.",
  "success": true,
  "error": 0,
  "data": {
    "vid_id_public": "...",
    "vid_nombre": "...",
    "vid_descripcion": "...",
    "vid_path": "...",
    "vid_thumbnail": "..."
  }
}
```

---

### `GET /videos/:vid_id/series/relacionados` — Related Series Videos

Auth: None

**Params**

| Param | Type |
|---|---|
| `vid_id` | string |

**Response 200**

```json
{
  "msg": "Se obtuvieron los videos relacionados correctamente.",
  "success": true,
  "error": 0,
  "data": [ { ... } ]
}
```

---

### `POST /videos` — Upload Video

Auth: `access_token` cookie + `x-csrf-token` header

**Body (multipart/form-data)**

| Field | Type | Required |
|---|---|---|
| `video` | file (.mp4) | yes |
| `vid_nombre` | string | yes |
| `vid_descripcion` | string | no |
| `vid_tags` | string | no |
| `vid_id_serie` | integer | no |
| `vid_id_temporada` | integer | no |
| `vid_temporada` | integer | no |
| `vid_capitulo` | integer | no |

**Response 200**

```json
{
  "msg": "...",
  "success": true,
  "error": 0,
  "data": {
    "vid_id": 1,
    "vid_thumbnail": "..."
  }
}
```

---

### `PUT /videos/:vid_id` — Update Video

Auth: `access_token` cookie + `x-csrf-token` header

**Params**

| Param | Type |
|---|---|
| `vid_id` | integer |

**Body (JSON)**

| Field | Type | Required |
|---|---|---|
| `vid_nombre` | string | no |
| `vid_descripcion` | string | no |
| `vid_tags` | string | no |
| `vid_id_serie` | integer | no |
| `vid_id_temporada` | integer | no |
| `vid_capitulo` | integer | no |

**Response 200**

```json
{
  "msg": "Se actualizaron los datos correctamente.",
  "success": true,
  "error": 0
}
```

---

### `PUT /videos/:vid_id/views` — Increment View Count

Auth: None

**Params**

| Param | Type |
|---|---|
| `vid_id` | integer |

**Response 200**

```json
{
  "msg": "...",
  "success": true,
  "error": 0
}
```

---

### `GET /videos/progress/:session_id` — Upload Progress

Auth: None

**Params**

| Param | Type |
|---|---|
| `session_id` | string |

**Response 200**

```json
{
  "sessionId": "...",
  "progress": 75,
  "loaded": 5242880,
  "total": 7000000,
  "status": "uploading"
}
```

---

### `GET /videos/thumbnails` — All Thumbnails (Combo)

Auth: None

**Response 200**

```json
{
  "msg": "Se obtuvieron los thumbnails correctamente.",
  "success": true,
  "error": 0,
  "data": [ { ... } ]
}
```

---

### `GET /videos/thumbnails/:thu_id_public` — Thumbnail Image

Auth: None

**Params**

| Param | Type |
|---|---|
| `thu_id_public` | string |
| `ext` (optional, in path `:thu_id_public.:ext`) | string |

**Response 200**: Image stream (`image/jpeg`, `image/png`, `image/gif`, or `image/webp`)

**Response 404**: `{ "msg": "Imagen no encontrada" }`

---

### `POST /videos/:vid_id/thumbnails` — Upload Thumbnail for Video

Auth: None

**Body (multipart/form-data)**

| Field | Type | Required |
|---|---|---|
| `image` | file | yes |

**Response 200**

```json
{
  "msg": "...",
  "success": true,
  "error": 0
}
```

---

### `POST /videos/thumbnails` — Upload Standalone Thumbnail

Auth: None

**Body (multipart/form-data)**

| Field | Type | Required |
|---|---|---|
| `image` | file | yes |

**Response 200**

```json
{
  "msg": "...",
  "success": true,
  "error": 0
}
```

---

### `POST /videos/:vid_id/report` — Report Video

Auth: None (currently returns maintenance message)

**Body (JSON)**

| Field | Type | Required |
|---|---|---|
| `rep_nombre` | string | yes |
| `rep_msg` | string | yes |

**Response 200**: `{ "msg": "Under Maintenance" }`

---

## Series

### `GET /series` — List All Series

Auth: None

**Response 200**

```json
{
  "success": true,
  "error": 0,
  "msg": "Series obtenidas exitosamente",
  "data": [
    {
      "ser_id": 1,
      "ser_nombre": "..."
    }
  ]
}
```

---

### `POST /series` — Create Series

Auth: None

**Body (JSON)**

| Field | Type | Required |
|---|---|---|
| `ser_nombre` | string | yes |
| `ser_id_thumbnail` | integer | no |

**Response 201**

```json
{
  "success": true,
  "error": 0,
  "msg": "Serie creada exitosamente",
  "data": []
}
```

---

## Seasons

### `GET /seasons` — List All Seasons

Auth: None

**Response 200**

```json
{
  "success": true,
  "error": 0,
  "msg": "Temporadas obtenidas exitosamente",
  "data": [
    {
      "sea_id": 1,
      "sea_numero": 1,
      "sea_id_serie": 1,
      "sea_id_thumbnail": 1
    }
  ]
}
```

---

### `GET /seasons/series/:ser_id` — Seasons by Series

Auth: None

**Params**

| Param | Type |
|---|---|
| `ser_id` | integer |

**Response 200**: Same shape as `GET /seasons`, filtered by series.

---

### `POST /seasons` — Create Season

Auth: None

**Body (JSON)**

| Field | Type | Required |
|---|---|---|
| `sea_numero` | integer | yes |
| `sea_id_serie` | integer | yes |
| `sea_id_thumbnail` | integer | no |

**Response 201**

```json
{
  "success": true,
  "error": 0,
  "msg": "Temporada creada exitosamente",
  "data": []
}
```

---

## Genres

### `GET /genres` — List All Genres

Auth: None

**Response 200**

```json
{
  "success": true,
  "error": 0,
  "msg": "Géneros obtenidos exitosamente",
  "data": [
    {
      "gen_id": 1,
      "gen_nombre": "..."
    }
  ]
}
```

---

### `POST /genres` — Create Genre

Auth: None

**Body (JSON)**

| Field | Type | Required |
|---|---|---|
| `gen_nombre` | string | yes |

**Response 201**

```json
{
  "success": true,
  "error": 0,
  "msg": "Género creado exitosamente",
  "data": []
}
```

---

## HLS Video Playback

Videos are served as HLS streams. The `vid_path` field in video responses contains the relative playlist path:

```
/hls/videos/{id}/playlist.m3u8
```

Full URL: `{SERVER_HOST}/hls/videos/{id}/playlist.m3u8`

Use an HLS-compatible player (ExoPlayer on Android, HLS.js on web).

---

## Error Response Format

All endpoints return errors in the same structure:

```json
{
  "success": false,
  "error": 1,
  "msg": "Description of the error"
}
```

| HTTP Status | Meaning |
|---|---|
| 400 | Bad request / missing fields |
| 401 | Unauthorized (missing or invalid token/CSRF) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Quick Reference Table

| Method | Path | Auth | Summary |
|---|---|---|---|
| POST | `/users` | No | Register |
| POST | `/users/signin` | No | Login (sets cookies) |
| POST | `/users/refresh_token` | Refresh token | Refresh access token |
| GET | `/users/info` | Yes | Current user info |
| GET | `/users` | Yes | List all users |
| PUT | `/users/:usu_id` | No | Update user |
| GET | `/videos` | No | Video feed |
| GET | `/videos/table_format` | Yes | Videos (table) |
| GET | `/videos/:vid_id` | No | Video by ID |
| GET | `/videos/:vid_id/series/relacionados` | No | Related videos |
| POST | `/videos` | Yes | Upload video |
| PUT | `/videos/:vid_id` | Yes | Update video |
| PUT | `/videos/:vid_id/views` | No | Increment views |
| GET | `/videos/progress/:session_id` | No | Upload progress |
| GET | `/videos/thumbnails` | No | List thumbnails |
| GET | `/videos/thumbnails/:thu_id_public` | No | Thumbnail image |
| POST | `/videos/:vid_id/thumbnails` | No | Upload thumb for video |
| POST | `/videos/thumbnails` | No | Upload standalone thumb |
| POST | `/videos/:vid_id/report` | No | Report video |
| GET | `/series` | No | List series |
| POST | `/series` | No | Create series |
| GET | `/seasons` | No | List seasons |
| GET | `/seasons/series/:ser_id` | No | Seasons by series |
| POST | `/seasons` | No | Create season |
| GET | `/genres` | No | List genres |
| POST | `/genres` | No | Create genre |
