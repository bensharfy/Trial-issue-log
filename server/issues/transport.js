const { Router } = require('express');
const multer = require('multer');
const service = require('./service');

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllIssuesHandler);
router.get('/:id', getIssueByIdHandler);
router.post('/', createIssueHandler);
router.post('/import', upload.single('file'), importIssuesHandler);
router.put('/:id', updateIssueHandler);
router.delete('/:id', deleteIssueHandler);

function handleError(res, err) {
  res.status(err.status || 500).json({ error: err.message });
}

function getAllIssuesHandler(req, res) {
  try {
    const { title, status, severity } = req.query;
    const issues = service.getAllIssues({ title, status, severity });

    res.json(issues);
  } catch (err) {
    handleError(res, err);
  }
}

function getIssueByIdHandler(req, res) {
  try {
    const issue = service.getIssueById(req.params.id);

    res.json(issue);
  } catch (err) {
    handleError(res, err);
  }
}

function createIssueHandler(req, res) {
  try {
    const id = service.createIssue(req.body);

    res.status(201).json({ id });
  } catch (err) {
    handleError(res, err);
  }
}

function importIssuesHandler(req, res) {
  if (!req.file) {
    res.status(400).json({ error: 'CSV file is required' });
    return;
  }

  try {
    const issues = service.importIssues(req.file.buffer);

    res.json({ imported: issues.length, issues });
  } catch (err) {
    handleError(res, err);
  }
}

function updateIssueHandler(req, res) {
  try {
    service.updateIssue(req.params.id, req.body);

    res.status(200).send();
  } catch (err) {
    handleError(res, err);
  }
}

function deleteIssueHandler(req, res) {
  try {
    service.deleteIssue(req.params.id);

    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = router;
