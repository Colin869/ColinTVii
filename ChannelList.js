import React from 'react';
import { useChannels } from '../context/ChannelContext';
import { Heart, Play, Clock } from 'lucide-react';

const ChannelList = ({ favoritesOnly = false }) => {
  const { 
    channels, 
    currentChannel, 
    favorites,
    setCurrentChannel,
    isFavorite,
    addToFavorites,
    removeFromFavorites
  } = useChannels();

  const displayChannels = favoritesOnly ? favorites : channels;

  const handleChannelClick = (channel) => {
    setCurrentChannel(channel);
  };

  const handleFavoriteClick = (e, channel) => {
    e.stopPropagation();
    if (isFavorite(channel)) {
      removeFromFavorites(channel);
    } else {
      addToFavorites(channel);
    }
  };

  const handlePlayClick = (e, channel) => {
    e.stopPropagation();
    setCurrentChannel(channel);
  };

  if (displayChannels.length === 0) {
    return (
      <div className="channel-list-container">
        <div className="empty-state">
          <div className="empty-icon">📺</div>
          <h3>{favoritesOnly ? 'No Favorite Channels' : 'No Channels Available'}</h3>
          <p>
            {favoritesOnly 
              ? 'Add channels to your favorites to see them here'
              : 'Channels will appear here once loaded'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="channel-list-container">
      <div className="channel-grid">
        {displayChannels.map((channel) => (
          <div
            key={channel.url}
            className={`channel-card ${currentChannel?.url === channel.url ? 'active' : ''}`}
            onClick={() => handleChannelClick(channel)}
          >
            <div className="channel-card-header">
              <img
                src={channel.logo || '/default-channel.png'}
                alt={channel.name}
                className="channel-card-logo"
                onError={(e) => {
                  e.target.src = '/default-channel.png';
                }}
              />
              <div className="channel-card-actions">
                <button
                  className={`action-btn favorite-btn ${isFavorite(channel) ? 'active' : ''}`}
                  onClick={(e) => handleFavoriteClick(e, channel)}
                  title={isFavorite(channel) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={16} />
                </button>
                <button
                  className="action-btn play-btn"
                  onClick={(e) => handlePlayClick(e, channel)}
                  title="Play channel"
                >
                  <Play size={16} />
                </button>
              </div>
            </div>
            
            <div className="channel-card-content">
              <h4 className="channel-card-name">{channel.name}</h4>
              <p className="channel-card-group">{channel.group}</p>
            </div>
            
            <div className="channel-card-footer">
              <div className="channel-status">
                {currentChannel?.url === channel.url && (
                  <span className="status-indicator playing">● LIVE</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelList; 