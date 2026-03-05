"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
  BackIcon,
  PauseIcon,
  VideoPlayIcon,
  VolumeIcon,
  MuteIcon,
  Forward10Icon,
  Backward10Icon,
  FullScreenIcon,
} from "./icons/Icons";
import { useRouter } from "next/navigation";
import { useProfile } from "./contexts/ProfileContext";
import { saveWatchProgress } from "../utils/profileStorage";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

const ButtonController: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  ariaLabel,
}) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`text-brand-text p-2 bg-brand-overlaySoft rounded-full hover:bg-brand-overlaySubtle transition ${className}`}
  >
    {children}
  </button>
);

const VideoPlayer = ({
  src,
  contentId,
  contentType,
}: {
  src: string;
  contentId: string;
  contentType: string;
}) => {
  const { activeProfile } = useProfile();
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showVolumeInput, setShowVolumeInput] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const playedRef = useRef(0);
  const lastPersistedRef = useRef(0);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const persistProgress = useCallback(
    (nextPlayed: number, force = false) => {
      if (!activeProfile || !contentId) return;
      const duration = playerRef.current?.getDuration() ?? 0;

      if (!force && Math.abs(nextPlayed - lastPersistedRef.current) < 0.03) {
        return;
      }

      saveWatchProgress(activeProfile.id, {
        id: contentId,
        type: contentType,
        played: nextPlayed,
        durationSeconds: duration,
      });

      lastPersistedRef.current = nextPlayed;
    },
    [activeProfile, contentId, contentType]
  );

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    setVolume(() => (isMuted ? 0.5 : 0));
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    playedRef.current = newPlayed;
    playerRef.current?.seekTo(newPlayed);
    persistProgress(newPlayed);
  };

  const handleForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10);
    }
  };

  const handleBackward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime - 10);
    }
  };

  // Fullscreen toggle
  const handleFullScreen = () => {
    const videoContainer = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainer.requestFullscreen().catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
      hideControlsTimeoutRef.current = null;
    }

    if (controlsVisible && isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 2500);
    }

    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      persistProgress(playedRef.current, true);
    };
  }, [persistProgress, controlsVisible, isPlaying]);

  const showControls = () => setControlsVisible(true);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={showControls}
      onMouseMove={showControls}
      onMouseLeave={() => setControlsVisible(false)}
      onTouchStart={showControls}
    >
      {/* Back Button */}
      {controlsVisible && (
        <button
          aria-label="Go back"
          onClick={() => router.back()}
          className="absolute top-12 left-4 z-30 bg-brand-overlaySoft text-brand-text p-3 rounded-full hover:bg-brand-overlaySubtle transition"
        >
          <BackIcon />
        </button>
      )}

      {/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={src}
        playing={isPlaying}
        controls={false}
        width="100%"
        height="100%"
        muted={isMuted}
        volume={volume}
        onProgress={({ played }) => {
          setPlayed(played);
          playedRef.current = played;
          persistProgress(played);
        }}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              fs: 1,
              controls: 0,
              disablekb: 1,
              iv_load_policy: 3,
              cc_load_policy: 0,
              autoplay: 1,
              playsinline: 1,
            },
          },
        }}
      />

      <div
        className="absolute inset-0 z-10"
        onClick={() => handlePlayPause()}
      />

      {/* Controls */}
      {controlsVisible && (
        <div className="absolute bottom-0 left-0 z-30 w-full bg-brand-overlaySoft p-3 pb-10 flex flex-col space-y-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={played}
            onChange={handleSeekChange}
            className="w-full h-1 bg-brand-progressTrack rounded-lg cursor-pointer appearance-none accent-brand-progressFill"
            style={{
              background: `linear-gradient(to right, var(--color-progress-fill) ${
                played * 100
              }%, var(--color-progress-track) ${played * 100}%)`,
            }}
          />

          <div className="flex justify-between px-6">
            <div className="flex gap-3">
              <ButtonController
                onClick={handlePlayPause}
                ariaLabel={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <PauseIcon /> : <VideoPlayIcon />}
              </ButtonController>
              <ButtonController
                onClick={handleBackward}
                ariaLabel="Rewind 10 seconds"
              >
                <Backward10Icon />
              </ButtonController>
              <ButtonController
                onClick={handleForward}
                ariaLabel="Forward 10 seconds"
              >
                <Forward10Icon />
              </ButtonController>

              <div
                className="flex items-center relative"
                onMouseEnter={() => setShowVolumeInput(true)}
                onMouseLeave={() => setShowVolumeInput(false)}
              >
                <ButtonController onClick={handleMute}>
                  {isMuted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
                </ButtonController>
                {showVolumeInput && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-brand-progressTrack rounded-lg cursor-pointer appearance-none accent-brand-progressFill"
                    style={{
                      background: `linear-gradient(to right, var(--color-progress-fill) ${
                        volume * 100
                      }%, var(--color-progress-track) ${volume * 100}%)`,
                    }}
                  />
                )}
              </div>
            </div>
            <ButtonController onClick={handleFullScreen} ariaLabel="Fullscreen">
              <FullScreenIcon />
            </ButtonController>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
