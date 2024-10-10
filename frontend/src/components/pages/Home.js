import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar';
import ResultList from '../ResultList';
import SavedList from '../SavedList';
import RecentSearches from '../RecentSearches'; // We'll create this component
import { AuthContext } from '../../context/AuthState';
import Toast from '../Toast';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { setCache, getCache } from '../../utils/cache';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [saveStatus, setSaveStatus] = useState({});
  const [isFetching, setIsFetching] = useInfiniteScroll(() => {});
  const [recentSearches, setRecentSearches] = useState([]);

  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const fetchMoreListItems = useCallback(() => {
    if (query) {
      handleSearch(query, page + 1);
    }
  }, [query, page]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchSavedItems();
    }
  }, [isAuthenticated, authLoading]);

  const fetchSavedItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items`);
      setSavedItems(response.data);
    } catch (err) {
      console.error('Error fetching saved items:', err);
      setError('Failed to fetch saved items. Please try again.');
    }
  };

  const handleSearch = async (searchQuery, currentPage = 1) => {
    setLoading(true);
    setError(null);
    const cacheKey = `${searchQuery}_${searchType}_${currentPage}`;
    const cachedResults = getCache(cacheKey);

    // Add the search query to recent searches
    setRecentSearches(prev => {
      const updatedSearches = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      return updatedSearches;
    });

    if (cachedResults) {
      updateSearchResults(cachedResults, currentPage);
    } else {
      try {
        let youtubeResults = [];
        let redditResults = [];

        if (searchType === 'all' || searchType === 'youtube') {
          const youtubeResponse = await axios.get(`${API_BASE_URL}/api/youtube/search?q=${searchQuery}&page=${currentPage}`);
          youtubeResults = youtubeResponse.data.items;
        }

        if (searchType === 'all' || searchType === 'reddit') {
          const redditResponse = await axios.get(`${API_BASE_URL}/api/reddit/search?q=${searchQuery}&page=${currentPage}`);
          redditResults = redditResponse.data.items;
        }

        const combinedResults = [...youtubeResults, ...redditResults].sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.created_utc * 1000);
          const dateB = new Date(b.publishedAt || b.created_utc * 1000);
          return dateB - dateA;
        });

        setCache(cacheKey, combinedResults);
        updateSearchResults(combinedResults, currentPage);
      } catch (err) {
        console.error('Search error:', err);
        setError('An error occurred while fetching results. Please try again.');
      }
    }
    setLoading(false);
    setIsFetching(false);
  };

  const updateSearchResults = (results, currentPage) => {
    if (currentPage === 1) {
      setSearchResults(results);
    } else {
      setSearchResults(prevResults => [...prevResults, ...results]);
    }
    setPage(currentPage);
    setHasMore(results.length > 0);
  };

  const handleSave = async (item) => {
    try {
      setSaveStatus(prev => ({ ...prev, [item.id]: 'saving' }));
      const response = await axios.post(`${API_BASE_URL}/api/items`, {
        title: item.title,
        link: item.url || item.link,
        source: item.source
      });
      setSavedItems(prevItems => [...prevItems, response.data]);
      setSaveStatus(prev => ({ ...prev, [item.id]: 'saved' }));
      setSuccessMessage('Item saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving item:', err);
      setSaveStatus(prev => ({ ...prev, [item.id]: 'error' }));
      setError(`Failed to save item: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/items/${itemId}`);
      setSavedItems(savedItems.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  const handleTrendingTopicClick = (topic) => {
    handleSearch(topic, 1);
  };

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  return (
    <div>
      <h1>Welcome to ContentHub</h1>
      <SearchBar onSearch={(q) => handleSearch(q, 1)} onTypeChange={setSearchType} searchType={searchType} />
      <RecentSearches searches={recentSearches} onSearchClick={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="content-wrapper">
        <ResultList 
          results={searchResults} 
          onSave={handleSave} 
          saveStatus={saveStatus}
        />
        <SavedList items={savedItems} onDelete={handleDelete} />
      </div>
      {isFetching && hasMore && <p>Loading more...</p>}
      {!hasMore && <p>No more results</p>}
      {successMessage && <Toast message={successMessage} type="success" />}
      {error && <Toast message={error} type="error" />}
    </div>
  );
};

export default Home;