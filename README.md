# Trial Issue Log

A simple app to track issues found during clinical trial site visits.

---

## What it does

- Create, edit, resolve, and delete issues
- Filter issues by title, status, and severity
- Dashboard with counts by status and severity
- Import issues in bulk via CSV

---

## How to run locally

**Requirements:** Node.js 20+

```sh
./start.sh
```

Open http://localhost:3000 in your browser.

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /issues | List all issues (supports `?title=`, `?status=`, `?severity=`) |
| GET | /issues/:id | Get a single issue |
| POST | /issues | Create an issue |
| PUT | /issues/:id | Update an issue |
| DELETE | /issues/:id | Delete an issue |
| POST | /issues/import | Import issues from a CSV file |

All requests and responses use JSON. Invalid input returns a `400` with an `error` field.

**GET /issues — list all, with optional filters:**
```sh
curl http://localhost:3000/issues
curl http://localhost:3000/issues?status=open
curl "http://localhost:3000/issues?severity=critical&status=open"
```

**GET /issues/:id — get a single issue:**
```sh
curl http://localhost:3000/issues/1
```

**POST /issues — create an issue (returns the new id):**
```sh
curl -X POST http://localhost:3000/issues \
  -H "Content-Type: application/json" \
  -d '{"title":"Missing consent form","description":"Not in patient file","site":"Site-101","severity":"major","status":"open"}'
```

**PUT /issues/:id — update fields on an issue:**
```sh
curl -X PUT http://localhost:3000/issues/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"resolved"}'
```

**DELETE /issues/:id — delete an issue:**
```sh
curl -X DELETE http://localhost:3000/issues/1
```

**POST /issues/import — bulk import from a CSV file:**
```sh
curl -X POST http://localhost:3000/issues/import \
  -F "file=@issues.csv"
```

---

## Database schema

SQLite, single table:

```sql
CREATE TABLE IF NOT EXISTS issues (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL,
  site        TEXT    NOT NULL,
  severity    TEXT    NOT NULL,  -- minor | major | critical
  status      TEXT    NOT NULL,  -- open | in_progress | resolved
  createdAt   TEXT    NOT NULL,
  updatedAt   TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_issues_status   ON issues (status);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues (severity);
```

---

## Tech choices

**Framework — Express**
Simple, minimal, and widely understood. No magic — just routes and middleware. For a project this size it's the right call. If the product grew significantly, I'd consider Fastify for better performance and built-in validation.

**Database — SQLite (via better-sqlite3)**
No setup, no separate process, the DB is just a file. Perfect for a self-contained assignment or a single-server deployment. If this went to production with multiple servers or heavy write load, I'd move to PostgreSQL on RDS.

**Frontend — React + Vite**
React is the practical standard for building interactive UIs. Vite makes the dev/build experience fast and simple. The built output is just static files served directly by the Express server — no separate hosting needed. For a larger product I'd add a router (React Router) and a proper component library.

---

## Deployment

The app is deployed on an AWS EC2 t2.micro instance (free tier) running Ubuntu. The server is managed by PM2 to keep it alive after disconnecting and auto-restart on reboot. The frontend is built into static files and served directly by the Express server — no separate hosting needed.

**Live URL:** http://16.171.21.28:3000

---

## Sample CSV

A sample file is included at `issues.csv`. Use the Import CSV button in the app to load it.
