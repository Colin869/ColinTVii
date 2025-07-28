import React, { createContext, useContext, useState, useEffect } from 'react';
import moment from 'moment';

const EPGContext = createContext();

export const useEPG = () => {
  const context = useContext(EPGContext);
  if (!context) {
    throw new Error('useEPG must be used within an EPGProvider');
  }
  return context;
};

export const EPGProvider = ({ children }) => {
  const [epgData, setEpgData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());

  const loadEPG = async (epgUrl) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading EPG from:', epgUrl);
      const response = await fetch(epgUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/xml,text/xml,*/*',
          'User-Agent': 'ColinTvii/1.0.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const xmlContent = await response.text();
      console.log('EPG content length:', xmlContent.length);
      console.log('First 500 characters:', xmlContent.substring(0, 500));
      
      const parsedEPG = parseXMLTV(xmlContent);
      console.log('Parsed EPG channels:', Object.keys(parsedEPG).length);
      setEpgData(parsedEPG);
    } catch (err) {
      console.error('Error loading EPG:', err);
      setError('Failed to load EPG: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseXMLTV = (xmlContent) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    const channels = xmlDoc.getElementsByTagName('channel');
    const programmes = xmlDoc.getElementsByTagName('programme');
    
    const epgData = {};
    
    // Parse channels
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      const id = channel.getAttribute('id');
      const displayName = channel.querySelector('display-name')?.textContent || id;
      const icon = channel.querySelector('icon')?.getAttribute('src');
      
      epgData[id] = {
        name: displayName,
        icon: icon,
        programmes: []
      };
    }
    
    // Parse programmes
    for (let i = 0; i < programmes.length; i++) {
      const programme = programmes[i];
      const channelId = programme.getAttribute('channel');
      const start = programme.getAttribute('start');
      const stop = programme.getAttribute('stop');
      const title = programme.querySelector('title')?.textContent || 'Unknown';
      const desc = programme.querySelector('desc')?.textContent || '';
      const category = programme.querySelector('category')?.textContent || '';
      
      if (epgData[channelId]) {
        epgData[channelId].programmes.push({
          start: moment(start, 'YYYYMMDDHHmmss Z'),
          stop: moment(stop, 'YYYYMMDDHHmmss Z'),
          title,
          description: desc,
          category
        });
      }
    }
    
    return epgData;
  };

  const getProgrammesForChannel = (channelId, date = currentDate) => {
    const channel = epgData[channelId];
    if (!channel) return [];
    
    const startOfDay = date.clone().startOf('day');
    const endOfDay = date.clone().endOf('day');
    
    return channel.programmes.filter(programme => 
      programme.start.isBetween(startOfDay, endOfDay, null, '[]')
    );
  };

  const getCurrentProgramme = (channelId) => {
    const programmes = getProgrammesForChannel(channelId);
    const now = moment();
    
    return programmes.find(programme => 
      now.isBetween(programme.start, programme.stop)
    );
  };

  const getNextProgramme = (channelId) => {
    const programmes = getProgrammesForChannel(channelId);
    const now = moment();
    
    return programmes.find(programme => 
      programme.start.isAfter(now)
    );
  };

  const value = {
    epgData,
    loading,
    error,
    currentDate,
    setCurrentDate,
    loadEPG,
    getProgrammesForChannel,
    getCurrentProgramme,
    getNextProgramme
  };

  return (
    <EPGContext.Provider value={value}>
      {children}
    </EPGContext.Provider>
  );
}; 