const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, pageSize = 10 } = req.query;
    const response = await axios.get(`https://www.reddit.com/search.json`, {
      params: {
        q: `"${q}"`,
        limit: 100,
        sort: 'relevance',
        t: 'all',
        type: 'link',
        include_over_18: 'false',
        after: page > 1 ? await getAfterParam(q, page, pageSize) : null,
      },
    });

    const threads = response.data.data.children
      .map(child => ({
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        subreddit: child.data.subreddit,
        score: child.data.score,
        num_comments: child.data.num_comments,
        created_utc: child.data.created_utc,
        url: `https://www.reddit.com${child.data.permalink}`,
        thumbnail: child.data.thumbnail,
        selftext: child.data.selftext,
        source: 'reddit'
      }))
      .filter(thread => {
        const searchTerms = q.toLowerCase().split(' ');
        const threadText = `${thread.title} ${thread.selftext}`.toLowerCase();
        return searchTerms.every(term => threadText.includes(term));
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, pageSize);

    res.json({
      items: threads,
      after: response.data.data.after,
      before: response.data.data.before,
    });
  } catch (error) {
    console.error('Error fetching Reddit data:', error);
    res.status(500).json({ message: 'Error fetching Reddit data', error: error.message });
  }
});

async function getAfterParam(q, page, pageSize) {
  let after;
  for (let i = 2; i <= page; i++) {
    const response = await axios.get(`https://www.reddit.com/search.json`, {
      params: {
        q: `"${q}"`,
        limit: pageSize,
        sort: 'relevance',
        t: 'all',
        type: 'link',
        include_over_18: 'false',
        after: after,
      },
    });
    after = response.data.data.after;
  }
  return after;
}

module.exports = router;
