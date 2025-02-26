"use client";

import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
  BackIcon,
  PauseIcon,
  VideoPlayIcon,
  VolumeIcon,
  MuteIcon,
} from "./icons/Icons";
import { useRouter } from "next/navigation";

const VideoPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const router = useRouter();

  // Play/Pause toggle
  const handlePlayPause = () => setIsPlaying(!isPlaying);

  // Volume Control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Mute toggle
  const handleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) setVolume(0.8); // Restore volume when unmuting
  };

  // Seek bar update
  const handleProgress = (state: { played: number }) => setPlayed(state.played);

  // Seek video manually
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    playerRef.current?.seekTo(newPlayed);
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
        onProgress={handleProgress}
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

      {/* Controls */}
      {controlsVisible && (
        <div className="absolute bottom-0 left-0 w-screen bg-black bg-opacity-50 p-3 flex flex-col space-y-2">
          {/* Seek Bar */}
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

          {/* Playback & Volume Controls */}
          <div className="flex justify-between items-center px-6">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="text-white  p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseIcon /> : <VideoPlayIcon />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              {/* Mute/Unmute Button */}
              <button
                onClick={handleMute}
                className="text-white  p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
              >
                {isMuted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
              </button>

              {/* Volume Slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-300 rounded-lg cursor-pointer appearance-none accent-red-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
