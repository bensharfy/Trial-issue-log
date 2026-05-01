CREATE TABLE IF NOT EXISTS issues (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL,
  site        TEXT    NOT NULL,
  severity    TEXT    NOT NULL,
  status      TEXT    NOT NULL,
  createdAt   TEXT    NOT NULL,
  updatedAt   TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_issues_status   ON issues (status);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues (severity);
