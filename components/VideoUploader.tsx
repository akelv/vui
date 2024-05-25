"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const VideoUploader: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isPressed, setIsPressed] = useState(false);
  const [counter, setCounter] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isCounterVisible, setIsCounterVisible] = useState(false);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: facingMode}, 
            audio: true });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    getMediaStream();

    // Cleanup function to stop the media stream when the component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (mediaStream) {
      const options = { mimeType: 'video/webm; codecs=vp9' };
      const recorder = new MediaRecorder(mediaStream, options);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setVideoBlob(event.data);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const uploadVideo = async () => {
    if (videoBlob) {
      const formData = new FormData();
      formData.append('file', videoBlob, 'recorded-video.webm');

      try {
        const response = await axios.post('https://mpnhdm.buildship.run/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Video uploaded successfully:', response.data);
        setCounter(0);
      } catch (err) {
        console.error('Error uploading video:', err);
      }
    }
  };

  const handleStart = () => {
    setIsPressed(true);
    setIsCounterVisible(true);
    startRecording();
    intervalRef.current = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 100);
  };

  const handleStop = () => {
    setIsPressed(false);
    stopRecording();
    setIsCounterVisible(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    uploadVideo();
  };

  const toggleCamera = () => {
    setFacingMode((prevFacingMode) => (prevFacingMode === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="absolute top-4 right-4 z-10">
        <button
          className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors"
          onClick={toggleCamera}
          onTouchStart={toggleCamera}
        >
         <SwitchCameraIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="relative w-full h-full">
        <video playsInline muted autoPlay ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col items-center justify-center z-10">
          <div id='counter' className={`${isCounterVisible ? '' : 'hidden'} text-white mb-2 text-center`}>{counter/10}s</div>
          <button
            className={`${isPressed ? 'bg-red-500' : 'bg-white/20'} backdrop-blur-sm rounded-full p-4 text-white hover:bg-white-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors`}
            type="button"
            onClick={isPressed ? handleStop: handleStart}
            onTouchStart={isPressed? handleStop: handleStart}
          >
            <CircleIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;

interface IconProps extends React.SVGProps<SVGSVGElement> {}
function CircleIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
function SwitchCameraIcon(props: IconProps) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
        <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
        <circle cx="12" cy="12" r="3" />
        <path d="m18 22-3-3 3-3" />
        <path d="m6 2 3 3-3 3" />
      </svg>
    )
  }
