# Trip & Design API

FastAPI · Neon Postgres · SQLAlchemy 2 · bcrypt · JWT + server-side sessions · Cloudinary

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
├── models/models.py         User, UserSession, Project, Doc, Destination, ActivityLog
├── schemas/                 Pydantic request/response models
├── services/                cloudinary_service, activity (audit log)
└── routers/
    ├── auth.py              /api/auth/{register,login,logout}
    ├── users.py             /api/users/me (GET, PUT, DELETE)
    ├── projects.py          /api/projects[/{id}]
    ├── docs.py              /api/docs[/{id}]
    └── admin/               /api/admin/{users,projects,destinations,analytics}
```

## Auth model
- Login verifies the bcrypt hash, creates a `user_sessions` row, and issues a JWT whose `jti` points at that row.
- The JWT is returned in the body **and** stored in a signed session cookie. Send either `Authorization: Bearer <token>` or rely on the cookie.
- Every request checks the JWT signature/expiry **and** that the session row is not revoked, so logout, suspension and password change take effect immediately.
- Cookie auth: `SameSite=Lax` in dev, `None; Secure` in production. If you use cookies cross-site, add CSRF protection; Bearer tokens avoid this.

## Notes
- Uploads (`POST /docs`, `PUT /users/me`, admin destinations) are `multipart/form-data`.
- `DELETE /admin/users/{id}` deactivates by default; add `?hard=true` to permanently delete.
- `PUT /admin/destinations/{id}`: send new `media` files to append and `remove_media=<public_id>` (repeatable) to delete.
- Neon: keep `?sslmode=require` in `DATABASE_URL`; the engine uses `pool_pre_ping` because Neon suspends idle compute.
