import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import ChannelList from './components/ChannelList';
import EPG from './components/EPG';
import Settings from './components/Settings';
import { ChannelProvider } from './context/ChannelContext';
import { EPGProvider } from './context/EPGContext';
import './styles.css';

function App() {
  const [currentView, setCurrentView] = useState('channels');
  const [settings, setSettings] = useState({
    m3uUrl: 'https://raw.githubusercontent.com/luongz/iptv-jp/refs/heads/main/jp.m3u',
    epgUrl: 'http://epg.utako.moe/jcom.xml',
    theme: 'dark',
    language: 'en'
  });

  useEffect(() => {
    // Load settings from electron store
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('get-settings').then(setSettings);
    }
  }, []);

  return (
    <ChannelProvider>
      <EPGProvider>
        <Router>
          <div className="app">
            <div className="header">
              <div className="logo-container">
                <div className="logo-oval">
                  <span className="logo-text">ColinTvii</span>
                </div>
              </div>
              <div className="header-controls">
                <button className="control-btn" onClick={() => setCurrentView('channels')}>
                  📺 Channels
                </button>
                <button className="control-btn" onClick={() => setCurrentView('epg')}>
                  📅 EPG Guide
                </button>
                <button className="control-btn" onClick={() => setCurrentView('favorites')}>
                  ⭐ Favorites
                </button>
                <button className="control-btn" onClick={() => setCurrentView('settings')}>
                  ⚙️ Settings
                </button>
              </div>
            </div>
            
            <div className="main-content">
              <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
              
              <div className="content-area">
                {currentView === 'channels' && <ChannelList />}
                {currentView === 'epg' && <EPG />}
                {currentView === 'favorites' && <ChannelList favoritesOnly={true} />}
                {currentView === 'settings' && <Settings settings={settings} setSettings={setSettings} />}
              </div>
            </div>
            
            <Player />
          </div>
        </Router>
      </EPGProvider>
    </ChannelProvider>
  );
}

export default App; 