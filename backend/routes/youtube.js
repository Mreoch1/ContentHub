const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, pageSize = 10 } = req.query;
    console.log('Searching YouTube for:', q);
    
    const url = `https://www.googleapis.com/youtube/v3/search`;
    const params = {
      part: 'snippet',
      q: `"${q}"`, // Use quotes for exact phrase matching
      type: 'video',
      maxResults: pageSize,
      order: 'relevance', // Changed from 'date' to 'relevance'
      key: process.env.YOUTUBE_API_KEY,
      pageToken: page > 1 ? await getPageToken(q, page, pageSize) : undefined,
    };
    console.log('Request URL:', url);
    console.log('Request Params:', params);
    
    const response = await axios.get(url, { params });
    
    console.log('YouTube API Response Status:', response.status);
    console.log('YouTube API Response Data:', JSON.stringify(response.data, null, 2));
    
    const items = response.data.items
      .filter(item => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        const searchTerms = q.toLowerCase().split(' ');
        return searchTerms.every(term => title.includes(term) || description.includes(term));
      })
      .map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        publishedAt: item.snippet.publishedAt,
        source: 'youtube'
      }));
    
    res.json({
      items,
      nextPageToken: response.data.nextPageToken,
      prevPageToken: response.data.prevPageToken,
    });
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    res.status(500).json({ message: 'Error fetching YouTube data', error: error.message });
  }
});

async function getPageToken(q, page, pageSize) {
  let token;
  for (let i = 2; i <= page; i++) {
    const url = `https://www.googleapis.com/youtube/v3/search`;
    const params = {
      part: 'snippet',
      q: `"${q}"`,
      type: 'video',
      maxResults: pageSize,
      order: 'relevance',
      key: process.env.YOUTUBE_API_KEY,
      pageToken: token,
    };
    const response = await axios.get(url, { params });
    token = response.data.nextPageToken;
  }
  return token;
}

module.exports = router;
