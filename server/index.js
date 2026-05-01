const path = require('path');
const express = require('express');
const issuesRouter = require('./issues/transport');

const app = express();
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, '../frontend/dist');

app.use(express.json());
app.use(express.static(DIST));

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use('/issues', issuesRouter);

app.use((req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
