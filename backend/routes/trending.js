const express = require('express');
const router = express.Router();

// This is a placeholder. In a real application, you'd implement logic to determine trending topics.
const trendingTopics = [
  'Technology',
  'Science',
  'Politics',
  'Entertainment',
  'Sports'
];

router.get('/', (req, res) => {
  res.json(trendingTopics);
});

module.exports = router;