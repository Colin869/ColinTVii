import React, { useEffect, useRef, useState } from 'react';
import { useChannels } from '../context/ChannelContext';
import { X, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

const Player = () => {
  const { currentChannel, setCurrentChannel } = useChannels();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (currentChannel && videoRef.current) {
      const video = videoRef.current;
      
      // Reset video
      video.pause();
      video.currentTime = 0;
      
      // Set new source
      video.src = currentChannel.url;
      
      // Load and play
      video.load();
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Failed to play video:', err);
        setIsPlaying(false);
      });
    }
  }, [currentChannel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e) => {
      console.error('Video error:', e);
      setIsPlaying(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const closePlayer = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.src = '';
    }
    setIsPlaying(false);
    setCurrentChannel(null);
  };

  if (!currentChannel) {
    return null;
  }

  return (
    <div className={`player-container ${currentChannel ? 'active' : ''}`}>
      <div className="player-header">
        <div className="player-info">
          <img
            src={currentChannel.logo || '/default-channel.png'}
            alt={currentChannel.name}
            className="player-channel-logo"
          />
          <span className="player-channel-name">{currentChannel.name}</span>
        </div>
        <button className="player-close" onClick={closePlayer}>
          <X size={20} />
        </button>
      </div>
      
      <div className="video-container">
        <video
          ref={videoRef}
          className="video-player"
          controls={false}
          onMouseMove={() => setShowControls(true)}
          onMouseLeave={() => setTimeout(() => setShowControls(false), 3000)}
        >
          Your browser does not support the video tag.
        </video>
        
        {showControls && (
          <div className="video-controls">
            <div className="controls-left">
              <button className="control-btn" onClick={togglePlay}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>
            
            <div className="controls-center">
              <div className="volume-control">
                <button className="control-btn" onClick={toggleMute}>
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>
            
            <div className="controls-right">
              <button className="control-btn" onClick={toggleFullscreen}>
                <Maximize size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player; 