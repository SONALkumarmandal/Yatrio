# Trip & Design API

FastAPI · Neon Postgres · SQLAlchemy 2 · bcrypt · bearer JWT · Cloudinary

## Run
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # fill in Neon, Cloudinary and secrets
uvicorn app.main:app --reload
```
Docs: http://localhost:8000/docs · Tables are created on startup; the first admin is seeded from `FIRST_ADMIN_*`.

## Layout
```
app/
├── main.py                  app, middleware, router wiring (all under /api)
├── core/                    config, database (Neon), security (bcrypt/JWT), deps (auth guards)
├── models/models.py         User, UserSession, Project, Doc, Destination, Favorite, ActivityLog
├── schemas/                 Pydantic request/response models
├── services/                cloudinary_service, activity (audit log)
└── routers/
    ├── auth.py              /api/auth/{register,login,logout}
    ├── users.py             /api/users/me and per-user favorites
    ├── projects.py          /api/projects[/{id}]
    ├── docs.py              /api/docs[/{id}]
    └── admin/               /api/admin/{users,projects,destinations,analytics}
```

## Auth model
- Login verifies the bcrypt hash, creates a `user_sessions` row, and issues a JWT whose `jti` points at that row.
- The JWT is returned in the response body. Send it as `Authorization: Bearer <token>`.
- Every request checks the JWT signature/expiry **and** that the session row is not revoked, so logout, suspension and password change take effect immediately.
- `GET /api/users/me/favorites` returns the signed-in user's saved published destinations. `PUT` and `DELETE /api/users/me/favorites/{slug}` add and remove them; favorites are unique per user/destination and never shared between accounts.
- Registration passwords must be at least 8 characters, contain a letter and a digit, and fit bcrypt's 72-byte limit. Usernames are 3–50 characters using letters, numbers, `.`, `_`, or `-`.
- Authentication is bearer-token only; browsers do not automatically attach the `Authorization` header cross-site, so cookie-based CSRF does not apply.
- Set `ENVIRONMENT=production`, `CORS_ORIGINS=https://yatrio.vercel.app`, and a generated `JWT_SECRET_KEY` in the backend deployment environment. Generate it with `python -c "import secrets; print(secrets.token_urlsafe(48))"`. Never reuse or commit production secrets.

## Notes
- Uploads (`POST /docs`, `PUT /users/me`, admin destinations) are `multipart/form-data`.
- `DELETE /admin/users/{id}` deactivates by default; add `?hard=true` to permanently delete.
- `PUT /admin/destinations/{id}`: send new `media` files to append and `remove_media=<public_id>` (repeatable) to delete.
- Neon: keep `?sslmode=require` in `DATABASE_URL`; the engine uses `pool_pre_ping` because Neon suspends idle compute.
