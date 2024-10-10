import React from 'react';
import SocialShare from './SocialShare';

function ResultList({ results, onSave, saveStatus }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!results) {
    return <div>Loading...</div>;
  }

  return (
    <div className="result-list">
      <h2>Search Results</h2>
      {results.length === 0 ? (
        <p>No results to display</p>
      ) : (
        <ul>
          {results.map((item, index) => (
            <li key={index} className={item.source === 'reddit' ? 'reddit-item' : 'youtube-item'}>
              <h3 className={`item-title ${item.source}-title`}>{item.title}</h3>
              {item.source === 'youtube' ? (
                <>
                  <p>{item.description}</p>
                  <p>Published on: {formatDate(item.publishedAt)}</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="rainbow-button">Watch Video</a>
                </>
              ) : (
                <>
                  <p>Author: {item.author}</p>
                  <p>Subreddit: {item.subreddit}</p>
                  <p>Score: {item.score}</p>
                  <p>Comments: {item.num_comments}</p>
                  <p>Created: {formatDate(item.created_utc * 1000)}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="rainbow-button">View Thread</a>
                </>
              )}
              <SocialShare url={item.url || item.link} title={item.title} />
              <button 
                onClick={() => onSave(item)} 
                disabled={saveStatus[item.id] === 'saving' || saveStatus[item.id] === 'saved'}
                className="rainbow-button"
              >
                {saveStatus[item.id] === 'saving' ? 'Saving...' : 
                 saveStatus[item.id] === 'saved' ? 'Saved' : 'Save'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResultList;
