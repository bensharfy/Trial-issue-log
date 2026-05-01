const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createIssue, updateIssue } = require('./service');

// createIssue validation
test('createIssue — missing title throws 400', () => {
  assert.throws(
    () => createIssue({ description: 'Desc', severity: 'minor', status: 'open' }),
    (err) => {
      assert.equal(err.status, 400);
      assert.ok(err.message.includes('title'));

      return true;
    }
  );
});

test('createIssue — missing description throws 400', () => {
  assert.throws(
    () => createIssue({ title: 'Test', severity: 'minor', status: 'open' }),
    (err) => {
      assert.equal(err.status, 400);
      assert.ok(err.message.includes('description'));

      return true;
    }
  );
});

test('createIssue — invalid severity throws 400', () => {
  assert.throws(
    () => createIssue({ title: 'Test', description: 'Desc', severity: 'extreme', status: 'open' }),
    (err) => {
      assert.equal(err.status, 400);
      assert.ok(err.message.includes('severity'));

      return true;
    }
  );
});

test('createIssue — invalid status throws 400', () => {
  assert.throws(
    () => createIssue({ title: 'Test', description: 'Desc', severity: 'minor', status: 'pending' }),
    (err) => {
      assert.equal(err.status, 400);
      assert.ok(err.message.includes('status'));

      return true;
    }
  );
});

// updateIssue validation
test('updateIssue — empty title throws 400', () => {
  assert.throws(
    () => updateIssue(1, { title: '' }),
    (err) => {
      assert.equal(err.status, 400);
      assert.ok(err.message.includes('title'));

      return true;
    }
  );
});

test('updateIssue — invalid severity throws 400', () => {
  assert.throws(
    () => updateIssue(1, { severity: 'extreme' }),
    (err) => {
      assert.equal(err.status, 400);
      assert.ok(err.message.includes('severity'));

      return true;
    }
  );
});

test('updateIssue — invalid status throws 400', () => {
  assert.throws(
    () => updateIssue(1, { status: 'pending' }),
    (err) => {
      assert.equal(err.status, 400);
      assert.ok(err.message.includes('status'));

      return true;
    }
  );
});
