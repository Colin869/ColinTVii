import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ChannelContext = createContext();

export const useChannels = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error('useChannels must be used within a ChannelProvider');
  }
  return context;
};

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from electron store
  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('get-favorites').then(setFavorites);
    }
  }, []);

  const loadChannels = useCallback(async (m3uUrl) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading channels from:', m3uUrl);
      const response = await fetch(m3uUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain,application/x-mpegurl,*/*',
          'User-Agent': 'ColinTvii/1.0.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const m3uContent = await response.text();
      console.log('M3U content length:', m3uContent.length);
      console.log('First 500 characters:', m3uContent.substring(0, 500));
      
      const parsedChannels = parseM3U(m3uContent);
      console.log('Parsed channels:', parsedChannels.length);
      setChannels(parsedChannels);
    } catch (err) {
      console.error('Error loading channels:', err);
      setError('Failed to load channels: ' + err.message);
      
      // Add some sample channels for testing
      const sampleChannels = [
        {
          name: 'NHK G',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/NHK%E7%B7%8F%E5%90%88%E3%83%AD%E3%82%B42020-.png',
          group: 'Tokyo',
          url: 'https://vthanh.utako.moe/NHK_G/index.m3u8'
        },
        {
          name: 'NTV',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Nippon_TV_logo_2014.svg/2560px-Nippon_TV_logo_2014.svg.png',
          group: 'Tokyo',
          url: 'https://vthanh.utako.moe/Nippon_TV/index.m3u8'
        },
        {
          name: 'TBS',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Tokyo_Broadcasting_System_logo_2020.svg/2560px-Tokyo_Broadcasting_System_logo_2020.svg.png',
          group: 'Tokyo',
          url: 'https://vthanh.utako.moe/TBS/index.m3u8'
        }
      ];
      setChannels(sampleChannels);
    } finally {
      setLoading(false);
    }
  }, []);

  const parseM3U = (content) => {
    const lines = content.split('\n');
    const channels = [];
    let currentChannel = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        // Parse channel info
        const infoMatch = line.match(/tvg-name="([^"]*)"|tvg-logo="([^"]*)"|group-title="([^"]*)"|,(.+)$/g);
        const channelName = line.match(/,(.+)$/)?.[1] || 'Unknown Channel';
        const logoMatch = line.match(/tvg-logo="([^"]*)"/);
        const groupMatch = line.match(/group-title="([^"]*)"/);
        
        currentChannel = {
          name: channelName,
          logo: logoMatch ? logoMatch[1] : null,
          group: groupMatch ? groupMatch[1] : 'Other',
          url: null
        };
      } else if (line && !line.startsWith('#') && currentChannel) {
        // This is the URL
        currentChannel.url = line;
        channels.push(currentChannel);
        currentChannel = null;
      }
    }

    return channels;
  };

  const addToFavorites = (channel) => {
    const newFavorites = [...favorites, channel];
    setFavorites(newFavorites);
    
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('save-favorites', newFavorites);
    }
  };

  const removeFromFavorites = (channel) => {
    const newFavorites = favorites.filter(fav => fav.url !== channel.url);
    setFavorites(newFavorites);
    
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('save-favorites', newFavorites);
    }
  };

  const isFavorite = (channel) => {
    return favorites.some(fav => fav.url === channel.url);
  };

  const value = {
    channels,
    loading,
    error,
    currentChannel,
    favorites,
    setCurrentChannel,
    loadChannels,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <ChannelContext.Provider value={value}>
      {children}
    </ChannelContext.Provider>
  );
}; 