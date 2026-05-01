const repo = require('../repos/issues');
const { parse } = require('csv-parse/sync');

const SEVERITIES = ['minor', 'major', 'critical'];
const STATUSES = ['open', 'in_progress', 'resolved'];

function validateCreate(data) {
  const errors = [];

  if (!data.title) {
    errors.push('title is required');
  }

  if (!data.description) {
    errors.push('description is required');
  }

  if (!SEVERITIES.includes(data.severity)) {
    errors.push(`severity must be one of: ${SEVERITIES.join(', ')}`);
  }

  if (!STATUSES.includes(data.status)) {
    errors.push(`status must be one of: ${STATUSES.join(', ')}`);
  }

  return errors;
}

function validateUpdate(data) {
  const errors = [];

  if (data.title !== undefined && !data.title) {
    errors.push('title cannot be empty');
  }

  if (data.description !== undefined && !data.description) {
    errors.push('description cannot be empty');
  }

  if (data.severity !== undefined && !SEVERITIES.includes(data.severity)) {
    errors.push(`severity must be one of: ${SEVERITIES.join(', ')}`);
  }

  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    errors.push(`status must be one of: ${STATUSES.join(', ')}`);
  }

  return errors;
}

function getAllIssues(filters = {}) {
  return repo.findAllIssues(filters);
}

function getIssueById(id) {
  const issue = repo.findIssueById(Number(id));
  if (!issue) {
    const err = new Error('Issue not found');
    err.status = 404;

    throw err;
  }

  return issue;
}

function createIssue(data) {
  const errors = validateCreate(data);
  if (errors.length) {
    const err = new Error(errors.join('; '));
    err.status = 400;
    throw err;
  }

  const now = new Date().toISOString();

  const id = repo.createIssue({
    title: data.title,
    description: data.description,
    site: data.site,
    severity: data.severity,
    status: data.status,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

function buildPatch(data) {
  const patch = {};

  if (data.title !== undefined) {
    patch.title = data.title;
  }

  if (data.description !== undefined) {
    patch.description = data.description;
  }

  if (data.site !== undefined) {
    patch.site = data.site;
  }

  if (data.severity !== undefined) {
    patch.severity = data.severity;
  }

  if (data.status !== undefined) {
    patch.status = data.status;
  }

  return patch;
}

function updateIssue(id, data) {
  const errors = validateUpdate(data);
  if (errors.length) {
    const err = new Error(errors.join('; '));
    err.status = 400;
    throw err;
  }

  const existing = repo.findIssueById(Number(id));
  if (!existing) {
    const err = new Error('Issue not found');
    err.status = 404;

    throw err;
  }

  const patch = buildPatch(data);
  const updated = { ...patch, updatedAt: new Date().toISOString() };

  repo.updateIssue(Number(id), updated);
}

function deleteIssue(id) {
  const existing = repo.findIssueById(Number(id));
  if (!existing) {
    const err = new Error('Issue not found');
    err.status = 404;

    throw err;
  }

  repo.deleteIssue(Number(id));
}

function parseCSV(text) {
  return parse(text, { columns: true, skip_empty_lines: true, trim: true });
}

function validateCSVRows(rows) {
  const errors = [];

  rows.forEach((row, i) => {
    const rowErrors = validateCreate(row);
    if (rowErrors.length) {
      errors.push(`row ${i + 2}: ${rowErrors.join('; ')}`);
    }
  });

  return errors;
}

function importIssues(buffer) {
  const rows = parseCSV(buffer.toString('utf8'));

  if (!rows.length) {
    const err = new Error('CSV has no data rows');
    err.status = 400;
    throw err;
  }

  const rowErrors = validateCSVRows(rows);

  if (rowErrors.length) {
    const err = new Error(rowErrors.join(' | '));
    err.status = 400;

    throw err;
  }

  const now = new Date().toISOString();
  const prepared = rows.map((row) => ({
    title: row.title,
    description: row.description,
    site: row.site,
    severity: row.severity,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: now,
  }));

  return repo.bulkCreateIssues(prepared);
}

module.exports = { getAllIssues, getIssueById, createIssue, updateIssue, deleteIssue, importIssues };
