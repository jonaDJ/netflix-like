import "video.js/dist/video-js.css";
import videojs from "video.js";
import { useEffect, useRef } from "react";

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  /**
   * This component uses video.js for video playback.
   * Consider updating to a newer version or exploring alternative libraries
   * for potential improvements and bug fixes.
   */
  useEffect(() => {
    if (videoRef.current) {
      videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
      });
    }
  }, []);

  return (
    <div className="relative w-full mx-auto">
      <video
        ref={videoRef}
        controls
        className="video-js vjs-big-play-centered w-full h-full"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
