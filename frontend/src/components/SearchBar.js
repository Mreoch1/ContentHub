import React, { useState } from 'react';

function SearchBar({ onSearch, onTypeChange, searchType }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      console.error('onSearch function is not provided to SearchBar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for content..."
      />
      <select value={searchType} onChange={(e) => onTypeChange(e.target.value)}>
        <option value="all">All</option>
        <option value="youtube">YouTube</option>
        <option value="reddit">Reddit</option>
      </select>
      <button type="submit" className="rainbow-button">Search</button>
    </form>
  );
}

export default SearchBar;
