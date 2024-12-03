import React, { useState, useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Cleanup function for video element
    const cleanupVideo = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (videoRef.current) {
              videoRef.current.play().catch(() => {
                // Handle autoplay failure silently
              });
            }
          } else {
            setIsVisible(false);
            cleanupVideo();
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Preload slightly before element comes into view
      }
    );

    // Start observing
    const container = document.querySelector(`[data-video-url="${videoUrl}"]`);
    if (container && observerRef.current) {
      observerRef.current.observe(container);
    }

    // Cleanup on unmount or when videoUrl changes
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      cleanupVideo();
      setIsLoaded(false);
      setIsVisible(false);
    };
  }, [videoUrl]);

  // Handle video errors
  const handleVideoError = () => {
    console.warn('Video failed to load:', videoUrl);
    setIsLoaded(false);
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden bg-zinc-900"
      data-video-url={videoUrl}
    >
      {isVisible && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoUrl} type="video/webm" />
        </video>
      )}
      
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Loading placeholder */}
      {!isLoaded && isVisible && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
      )}
    </div>
  );
};

export default VideoBackground;