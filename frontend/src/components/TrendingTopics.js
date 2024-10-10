import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const TrendingTopics = ({ onTopicClick }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/trending`);
        setTopics(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trending topics:', err);
        setError('Failed to fetch trending topics');
        setLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  if (loading) return <div>Loading trending topics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="trending-topics">
      <h3>Trending Topics</h3>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>
            <button onClick={() => onTopicClick(topic)}>{topic}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingTopics;