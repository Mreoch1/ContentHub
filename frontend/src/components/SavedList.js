import React from 'react';
import SocialShare from './SocialShare';

function SavedList({ items, onDelete }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <div className="saved-list">
      <h2>Saved Items</h2>
      {items.length === 0 ? (
        <p>No saved items</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id} className={item.source === 'reddit' ? 'reddit-item' : 'youtube-item'}>
              <h3>{item.title}</h3>
              {item.source === 'youtube' ? (
                <>
                  <p>Source: YouTube</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="rainbow-button">Watch Video</a>
                </>
              ) : (
                <>
                  <p>Source: Reddit</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="rainbow-button">View Thread</a>
                </>
              )}
              <SocialShare url={item.link} title={item.title} />
              <button onClick={() => onDelete(item._id)} className="rainbow-button">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedList;
