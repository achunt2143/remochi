// MochiVideo.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MochiButton } from '../Button/MochiButton';
import { MochiSlider } from '../Slider/MochiSlider';
import {
  FaPlay, FaPause,
  FaVolumeUp, FaVolumeDown, FaVolumeMute,
  FaExpand, FaCompress,
} from 'react-icons/fa';
import './MochiVideo.scss';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MochiVideo = ({
  src,
  poster,
  autoPlay  = false,
  loop      = false,
  muted     = false,
  controls  = true,
  className = '',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
}) => {
  const videoRef          = useRef(null);
  const controlsTimeout  = useRef(null);

  const [isPlaying,     setIsPlaying]     = useState(false);
  const [currentTime,   setCurrentTime]   = useState(0);
  const [duration,      setDuration]      = useState(0);
  const [volume,        setVolume]        = useState(1);
  const [isMuted,       setIsMuted]       = useState(muted);
  const [showControls,  setShowControls]  = useState(false);
  const [isFullscreen,  setIsFullscreen]  = useState(false);

  // ── video event wiring ───────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onMeta    = () => setDuration(v.duration);
    const onTime    = () => { setCurrentTime(v.currentTime); onTimeUpdate?.(v.currentTime); };
    const onPlayEvt = () => { setIsPlaying(true);  onPlay?.(); };
    const onPauseEvt= () => { setIsPlaying(false); onPause?.(); };
    const onEndEvt  = () => { setIsPlaying(false); onEnded?.(); };
    const onFS      = () => setIsFullscreen(!!document.fullscreenElement);

    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('timeupdate',     onTime);
    v.addEventListener('play',           onPlayEvt);
    v.addEventListener('pause',          onPauseEvt);
    v.addEventListener('ended',          onEndEvt);
    document.addEventListener('fullscreenchange', onFS);

    return () => {
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('timeupdate',     onTime);
      v.removeEventListener('play',           onPlayEvt);
      v.removeEventListener('pause',          onPauseEvt);
      v.removeEventListener('ended',          onEndEvt);
      document.removeEventListener('fullscreenchange', onFS);
    };
  }, [onPlay, onPause, onEnded, onTimeUpdate]);

  // ── control handlers ─────────────────────────────────────────────────────
  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    isPlaying ? v.pause() : v.play();
  };

  // MochiSlider reports value in the same units as min/max, so for the
  // timeline slider that means seconds directly.
  const handleSeek = (val) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolumeChange = (val) => {
    const v = videoRef.current;
    if (!v) return;
    const norm = val / 100;        // MochiSlider default range is 0-100
    setVolume(norm);
    v.volume = norm;
    setIsMuted(norm === 0);
  };

  const handleMuteToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    setIsMuted(next);
    v.muted = next;
  };

  const handleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (!isFullscreen) container.requestFullscreen?.();
    else              document.exitFullscreen?.();
  };

  const revealControls = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Volume icon selection
  const VolumeIcon = isMuted || volume === 0
    ? FaVolumeMute
    : volume < 0.5
      ? FaVolumeDown
      : FaVolumeUp;

  return (
    <div
      className={`mochi-video-container ${className} ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={revealControls}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="mochi-video-player"
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        onClick={handlePlayPause}
      />

      {controls && (
        <div className={`mochi-video-controls ${showControls || !isPlaying ? 'visible' : ''}`}>

          {/* ── Play / Pause ── */}
          <MochiButton
            className="mochi-video-btn"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </MochiButton>

          {/* ── Seek timeline ── */}
          <div className="mochi-video-timeline">
            <MochiSlider
              value={currentTime}
              min={0}
              max={duration || 1}
              step={0.5}
              width="100%"
              onChange={handleSeek}
            />
          </div>

          {/* ── Time readout ── */}
          <span className="mochi-video-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* ── Mute toggle ── */}
          <MochiButton
            className="mochi-video-btn"
            onClick={handleMuteToggle}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon />
          </MochiButton>

          {/* ── Volume slider ── */}
          <div className="mochi-video-volume">
            <MochiSlider
              value={Math.round(volume * 100)}
              min={0}
              max={100}
              step={1}
              width="80px"
              onChange={handleVolumeChange}
            />
          </div>

          {/* ── Fullscreen ── */}
          <MochiButton
            className="mochi-video-btn"
            onClick={handleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </MochiButton>

        </div>
      )}
    </div>
  );
};

export default MochiVideo;
