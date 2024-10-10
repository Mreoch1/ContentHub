import React from 'react';

const RecentSearches = ({ searches, onSearchClick }) => {
  if (searches.length === 0) return null;

  return (
    <div className="recent-searches">
      <h3>Recent Searches</h3>
      <ul>
        {searches.map((search, index) => (
          <li key={index}>
            <button onClick={() => onSearchClick(search)}>{search}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;