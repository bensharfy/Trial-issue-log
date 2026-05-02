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
The goal was to use the most minimal framework that fits the project, nothing more than what's needed. Express is widely adopted, well understood, and simple.

**Database — SQLite (via better-sqlite3)**
SQLite requires no setup, the database is just a file on disk, no separate process to run or configure. For a production environment, I would switch to PostgreSQL or MySQL.

**Frontend — React + Vite**
React is the standard choice for building interactive UIs, and Vite keeps the dev and build experience fast with minimal configuration. The output is static files served directly by Express, no separate hosting needed.

---

## Deployment

The app is deployed on an AWS EC2 t2.micro instance (free tier) running Ubuntu. The server is managed by PM2 to keep it alive after disconnecting. The frontend is built into static files and served directly by the Express server.

**Live URL:** http://ec2-16-171-21-28.eu-north-1.compute.amazonaws.com:3000

---

## Sample CSV

A sample file is included at `issues.csv`. Use the Import CSV button in the app to load it.
