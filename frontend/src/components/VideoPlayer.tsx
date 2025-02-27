"use client";

import React, { useRef, useState } from "react";
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
    className={`text-white p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition ${className}`}
  >
    {children}
  </button>
);

const VideoPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [showVolumeInput, setShowVolumeInput] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const router = useRouter();

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
    playerRef.current?.seekTo(newPlayed);
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

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
    >
      {/* Back Button */}
      {controlsVisible && (
        <button
          aria-label="Go back"
          onClick={() => router.back()}
          className="absolute top-12 left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
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
        onProgress={({ played }) => setPlayed(played)}
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
        className="absolute top-[11rem] left-0 right-0 bottom-[11.25rem]"
        style={{
          zIndex: 50,
        }}
        onClick={() => handlePlayPause()}
      />

      {/* Controls */}
      {controlsVisible && (
        <div className="absolute bottom-0 left-0 w-screen bg-black bg-opacity-50 p-3 pb-10 flex flex-col space-y-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={played}
            onChange={handleSeekChange}
            className="w-full h-1 bg-gray-300 rounded-lg cursor-pointer appearance-none accent-red-500"
            style={{
              background: `linear-gradient(to right, #ef4444 ${
                played * 100
              }%, #D1D5DB ${played * 100}%)`,
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
                    className="w-24 h-1 bg-gray-300 rounded-lg cursor-pointer appearance-none accent-red-500"
                    style={{
                      background: `linear-gradient(to right, #ef4444 ${
                        volume * 100
                      }%, #D1D5DB ${volume * 100}%)`,
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
