"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const VideoUploader: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [counter, setCounter] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isCounterVisible, setIsCounterVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const getMediaStream = async (facingMode: "environment" | "user") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facingMode}, 
          audio: true });
        console.log(facingMode)
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
        }); // Ensure video playback on user interaction
      }
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };
  useEffect(() => {
    getMediaStream(facingMode);

    // Cleanup function to stop the media stream when the component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startRecording = () => {
    if (mediaStream) {
      console.log("Recording started");
      const options = { mimeType: 'video/webm; codecs=vp9' };
      const recorder = new MediaRecorder(mediaStream, options);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            console.log("Saving data");
            uploadVideo(event.data);
            console.log("Uploaded data");
        //   setVideoBlob(event.data);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
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

  const uploadVideo = async (blob: Blob) => {
    if (blob) {
      console.log("Start Uploading")
      const formData = new FormData();
      formData.append('file', blob, 'recorded-video.webm');

      try {
        setIsUploading(true);
        const response = await axios.post('https://mpnhdm.buildship.run/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total){ 
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
          }
        });
        console.log('Video uploaded successfully:', response.data);
        setUploadProgress(null);
        setIsUploading(false);
      } catch (err) {
        console.error('Error uploading video:', err);
      }
    }
  };

  const toggleRecording = () => {
    isRecording? handleStop() : handleStart();
  }
  const handleStart = () => {
    setIsCounterVisible(true);
    startRecording();
    intervalRef.current = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 100);
  };

  const handleStop = () => {
    stopRecording();
    setIsCounterVisible(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setCounter(0);
    }
  };

  const toggleCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
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
        >
         <SwitchCameraIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="relative w-full h-full">
        <video playsInline muted autoPlay ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col items-center justify-center z-10">
          <div id='counter' className={`${isCounterVisible ? '' : 'hidden'} text-white mb-2 text-center`}>{counter/10}s</div>
          <button
            className={`${isRecording ? 'bg-red-500' : 'bg-white/20'} disabled:bg-white-200/10 backdrop-blur-sm rounded-full p-4 text-white hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors`}
            type="button"
            onClick={toggleRecording}
            disabled={isUploading}
          >
            <CircleIcon className="h-8 w-8" />
          </button>
          {uploadProgress !== null && (
            <div className="text-white mt-2 z-10">Upload Progress: {uploadProgress}%</div>
          )}
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
