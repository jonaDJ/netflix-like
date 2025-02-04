import "video.js/dist/video-js.css";
import videojs from "video.js";
import { useEffect, useRef } from "react";

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        responsive: true,
        fluid: true,
      });
    }
  }, []);

  return (
    <video ref={videoRef} className="video-js w-full max-w-4xl">
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer;
