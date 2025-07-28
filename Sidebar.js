import React, { useEffect, useState } from 'react';
import { useChannels } from '../context/ChannelContext';
import { Heart, Play, Clock } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const { 
    channels, 
    loading, 
    error, 
    currentChannel, 
    favorites, 
    loadChannels,
    setCurrentChannel,
    isFavorite,
    addToFavorites,
    removeFromFavorites
  } = useChannels();

  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load channels on component mount
    loadChannels('https://raw.githubusercontent.com/luongz/iptv-jp/refs/heads/main/jp.m3u');
  }, [loadChannels]);

  // Group channels by their group title
  const groupedChannels = channels.reduce((groups, channel) => {
    const group = channel.group || 'Other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(channel);
    return groups;
  }, {});

  // Filter channels based on search term
  const filteredChannels = Object.entries(groupedChannels).reduce((acc, [group, channels]) => {
    const filtered = channels.filter(channel =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[group] = filtered;
    }
    return acc;
  }, {});

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

  const renderChannelItem = (channel) => (
    <div
      key={channel.url}
      className={`channel-item ${currentChannel?.url === channel.url ? 'active' : ''}`}
      onClick={() => handleChannelClick(channel)}
    >
      <img
        src={channel.logo || '/default-channel.png'}
        alt={channel.name}
        className="channel-logo"
        onError={(e) => {
          e.target.src = '/default-channel.png';
        }}
      />
      <div className="channel-info">
        <div className="channel-name">{channel.name}</div>
        <div className="channel-group-name">{channel.group}</div>
      </div>
      <div className="channel-actions">
        <button
          className={`favorite-btn ${isFavorite(channel) ? 'active' : ''}`}
          onClick={(e) => handleFavoriteClick(e, channel)}
        >
          <Heart size={16} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="sidebar">
        <div className="loading">Loading channels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sidebar">
        <div className="error">Error: {error}</div>
        <button onClick={() => loadChannels('https://raw.githubusercontent.com/luongz/iptv-jp/refs/heads/main/jp.m3u')}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Channels</h3>
        <input
          type="text"
          placeholder="Search channels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {currentView === 'favorites' && (
        <div className="channel-group">
          <div className="group-title">⭐ Favorites</div>
          {favorites.length === 0 ? (
            <div className="no-favorites">No favorite channels yet</div>
          ) : (
            favorites.map(renderChannelItem)
          )}
        </div>
      )}

      {currentView === 'channels' && (
        <>
          {Object.entries(filteredChannels).map(([group, channels]) => (
            <div key={group} className="channel-group">
              <div className="group-title">{group}</div>
              {channels.map(renderChannelItem)}
            </div>
          ))}
        </>
      )}

      {currentView === 'epg' && (
        <div className="channel-group">
          <div className="group-title">📅 EPG Channels</div>
          {channels.slice(0, 20).map(renderChannelItem)}
        </div>
      )}
    </div>
  );
};

export default Sidebar; 