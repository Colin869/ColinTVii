import React, { useEffect, useState } from 'react';
import { useEPG } from '../context/EPGContext';
import { useChannels } from '../context/ChannelContext';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import moment from 'moment';

const EPG = () => {
  const { 
    epgData, 
    loading, 
    error, 
    currentDate, 
    setCurrentDate,
    loadEPG,
    getProgrammesForChannel,
    getCurrentProgramme,
    getNextProgramme
  } = useEPG();
  
  const { channels } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    // Load EPG data on component mount
    loadEPG('http://epg.utako.moe/jcom.xml');
  }, []);

  const handleDateChange = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(currentDate.clone().subtract(1, 'day'));
    } else {
      setCurrentDate(currentDate.clone().add(1, 'day'));
    }
  };

  const formatTime = (time) => {
    return moment(time).format('HH:mm');
  };

  const formatDuration = (start, stop) => {
    const duration = moment.duration(moment(stop).diff(moment(start)));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours}h ${minutes}m`;
  };

  const isCurrentProgramme = (programme) => {
    const now = moment();
    return now.isBetween(programme.start, programme.stop);
  };

  const isNextProgramme = (programme) => {
    const now = moment();
    return programme.start.isAfter(now) && programme.start.isBefore(now.clone().add(2, 'hours'));
  };

  if (loading) {
    return (
      <div className="epg-container">
        <div className="loading">Loading EPG data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="epg-container">
        <div className="error">Error loading EPG: {error}</div>
        <button onClick={() => loadEPG('http://epg.utako.moe/jcom.xml')}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="epg-container">
      <div className="epg-header">
        <div className="epg-date">
          <Calendar size={20} />
          {currentDate.format('dddd, MMMM D, YYYY')}
        </div>
        <div className="epg-nav">
          <button 
            className="epg-nav-btn" 
            onClick={() => handleDateChange('prev')}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button 
            className="epg-nav-btn" 
            onClick={() => handleDateChange('next')}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="epg-grid">
        {channels.slice(0, 10).map((channel) => {
          const programmes = getProgrammesForChannel(channel.name, currentDate);
          const currentProgramme = getCurrentProgramme(channel.name);
          const nextProgramme = getNextProgramme(channel.name);

          return (
            <React.Fragment key={channel.url}>
              <div className="epg-channel">
                <img
                  src={channel.logo || '/default-channel.png'}
                  alt={channel.name}
                  className="epg-channel-logo"
                />
                <div className="epg-channel-info">
                  <div className="epg-channel-name">{channel.name}</div>
                  {currentProgramme && (
                    <div className="epg-current-programme">
                      <span className="current-indicator">● LIVE</span>
                      {currentProgramme.title}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="epg-programs">
                {programmes.length === 0 ? (
                  <div className="no-programmes">No programme data available</div>
                ) : (
                  programmes.map((programme, index) => (
                    <div
                      key={index}
                      className={`programme-item ${
                        isCurrentProgramme(programme) ? 'current' : ''
                      } ${isNextProgramme(programme) ? 'next' : ''}`}
                    >
                      <div className="programme-time">
                        <Clock size={12} />
                        {formatTime(programme.start)} - {formatTime(programme.stop)}
                        <span className="programme-duration">
                          ({formatDuration(programme.start, programme.stop)})
                        </span>
                      </div>
                      <div className="programme-title">{programme.title}</div>
                      {programme.description && (
                        <div className="programme-description">{programme.description}</div>
                      )}
                      {programme.category && (
                        <div className="programme-category">{programme.category}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default EPG; 