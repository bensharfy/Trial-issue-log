const db = require('../db/client');

function findAllIssues({ title, status, severity } = {}) {
  let query = 'SELECT * FROM issues WHERE 1=1';
  const params = [];

  if (title) {
    query += ' AND title LIKE ?';
    params.push(`%${title}%`);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (severity) {
    query += ' AND severity = ?';
    params.push(severity);
  }

  query += ' ORDER BY createdAt DESC';

  return db.prepare(query).all(...params);
}

function findIssueById(id) {
  const query = 'SELECT * FROM issues WHERE id = ?';

  return db.prepare(query).get(id) ?? null;
}

function createIssue(data) {
  const query = `
    INSERT INTO issues (title, description, site, severity, status, createdAt, updatedAt)
    VALUES (@title, @description, @site, @severity, @status, @createdAt, @updatedAt)
  `;

  const { lastInsertRowid } = db.prepare(query).run(data);

  return lastInsertRowid;
}

function updateIssue(id, data) {
  const fields = Object.keys(data)
    .map((k) => `${k} = @${k}`)
    .join(', ');

  const query = `UPDATE issues SET ${fields} WHERE id = @id`;

  db.prepare(query).run({ ...data, id });
}

function deleteIssue(id) {
  const query = 'DELETE FROM issues WHERE id = ?';

  db.prepare(query).run(id);
}

function bulkCreateIssues(rows) {
  const stmt = db.prepare(`
    INSERT INTO issues (title, description, site, severity, status, createdAt, updatedAt)
    VALUES (@title, @description, @site, @severity, @status, @createdAt, @updatedAt)
  `);

  const insertAll = db.transaction((items) => {
    return items.map((row) => stmt.run(row).lastInsertRowid);
  });

  const ids = insertAll(rows);
  const placeholders = ids.map(() => '?').join(', ');

  return db.prepare(`SELECT * FROM issues WHERE id IN (${placeholders})`).all(...ids);
}

module.exports = { findAllIssues, findIssueById, createIssue, updateIssue, deleteIssue, bulkCreateIssues };
