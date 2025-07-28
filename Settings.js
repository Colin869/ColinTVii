import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Download, Upload, RefreshCw } from 'lucide-react';

const Settings = ({ settings, setSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleInputChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('save-settings', localSettings);
      }
      setSettings(localSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = async () => {
    try {
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        const filePath = await ipcRenderer.invoke('select-file');
        if (filePath) {
          handleInputChange('m3uUrl', `file://${filePath}`);
        }
      }
    } catch (error) {
      console.error('Failed to select file:', error);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      m3uUrl: 'https://raw.githubusercontent.com/luongz/iptv-jp/refs/heads/main/jp.m3u',
      epgUrl: 'http://epg.utako.moe/jcom.xml',
      theme: 'dark',
      language: 'en'
    };
    setLocalSettings(defaultSettings);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <SettingsIcon size={24} />
        <h2>Settings</h2>
      </div>

      <div className="settings-section">
        <h3>Playlist Configuration</h3>
        
        <div className="setting-item">
          <label className="setting-label">M3U Playlist URL</label>
          <div className="setting-input-group">
            <input
              type="text"
              className="setting-input"
              value={localSettings.m3uUrl}
              onChange={(e) => handleInputChange('m3uUrl', e.target.value)}
              placeholder="Enter M3U playlist URL"
            />
            <button className="setting-btn" onClick={handleFileSelect}>
              <Upload size={16} />
              Browse
            </button>
          </div>
          <small>Enter the URL of your M3U playlist or select a local file</small>
        </div>

        <div className="setting-item">
          <label className="setting-label">EPG Guide URL</label>
          <input
            type="text"
            className="setting-input"
            value={localSettings.epgUrl}
            onChange={(e) => handleInputChange('epgUrl', e.target.value)}
            placeholder="Enter EPG XML URL"
          />
          <small>Enter the URL of your XMLTV EPG data</small>
        </div>
      </div>

      <div className="settings-section">
        <h3>Appearance</h3>
        
        <div className="setting-item">
          <label className="setting-label">Theme</label>
          <select
            className="setting-select"
            value={localSettings.theme}
            onChange={(e) => handleInputChange('theme', e.target.value)}
          >
            <option value="dark">Dark Theme</option>
            <option value="light">Light Theme</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>

        <div className="setting-item">
          <label className="setting-label">Language</label>
          <select
            className="setting-select"
            value={localSettings.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
            <option value="ko">Korean</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Player Settings</h3>
        
        <div className="setting-item">
          <label className="setting-label">Auto-play on channel select</label>
          <input
            type="checkbox"
            className="setting-checkbox"
            checked={localSettings.autoPlay || false}
            onChange={(e) => handleInputChange('autoPlay', e.target.checked)}
          />
        </div>

        <div className="setting-item">
          <label className="setting-label">Remember last played channel</label>
          <input
            type="checkbox"
            className="setting-checkbox"
            checked={localSettings.rememberChannel || false}
            onChange={(e) => handleInputChange('rememberChannel', e.target.checked)}
          />
        </div>

        <div className="setting-item">
          <label className="setting-label">Default volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            className="setting-range"
            value={localSettings.defaultVolume || 0.5}
            onChange={(e) => handleInputChange('defaultVolume', parseFloat(e.target.value))}
          />
          <span className="setting-value">{(localSettings.defaultVolume || 0.5) * 100}%</span>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <RefreshCw size={16} className="spinning" /> : <Download size={16} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button className="reset-btn" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>

      <div className="settings-info">
        <h4>About ColinTvii</h4>
        <p>Version: 1.0.0</p>
        <p>A custom IPTV player for Japanese channels with EPG support.</p>
        <p>Built with Electron, React, and modern web technologies.</p>
      </div>
    </div>
  );
};

export default Settings; 