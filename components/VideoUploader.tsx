"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Grid3x3Icon, SwitchCameraIcon, CircleIcon, StoreIcon } from './ui/controls';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
const VideoUploader: React.FC = () => {
  const router = useRouter();
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
    const handleVisibilityChange = () => {
        if (document.hidden) {
            console.log("stop stream");
          stopMediaStream();
          if (isRecording) {
            stopRecording();
          }
        }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
        stopMediaStream();
        document.addEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [facingMode]);

  const stopMediaStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const startRecording = () => {
    if (mediaStream) {
      console.log("Recording started");
      let options = { mimeType: 'video/webm; codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm; codecs=vp8' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: '' }; // Let the browser decide
      }
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
        // Save response data to local storage
        localStorage.setItem('uploadResponse', JSON.stringify(response.data));
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

  const navigateToStoreRoom = () => {
    stopMediaStream();
    router.push('/storeroom');
  };

  const navigateToProductList = () => {
    stopMediaStream();
    router.push('/productlist');
  };

  const navigateToSettings = () => {
    stopMediaStream();
    router.push('/settings');
  };

  const navigateToHome = () => {
    stopMediaStream();
    router.push('/');
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
            <div className="absolute top-4 left-4 z-10">
          <button onClick={navigateToSettings} hidden={isRecording} >
          <Avatar className="h-16 w-16 bg-gray-900 text-gray-50">
            <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
            <AvatarFallback>KV</AvatarFallback>
          </Avatar>
          </button>
        </div>
      <div className="absolute top-4 right-4 z-10">
        <button
          className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors"
          onClick={toggleCamera}
          hidden={isRecording}
        >
         <SwitchCameraIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="relative w-full h-full">
        <video playsInline muted autoPlay ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col items-center justify-center z-10">
          <div id='counter' className={`${isCounterVisible ? '' : 'hidden'} text-white mb-2 text-center`}>{counter/10}s</div>
          <button
            className={`${isRecording ? 'bg-red-500' : 'bg-white/20'} disabled:bg-white/5 backdrop-blur-sm rounded-full p-4 text-white hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors`}
            type="button"
            onClick={toggleRecording}
            disabled={isUploading}
          >
            {!isUploading && (
                 <CircleIcon className="h-8 w-8" />
            )}
            {uploadProgress !== null && (
                 <div className="text-white mt-2 z-10">{uploadProgress}%</div>
            )}
          </button>

        </div>
        {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex justify-between z-10"> */}
        <div className="absolute bottom-0 left-4 mb-4 z-10">
        <button
            className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors"
            type='button'
            onClick={navigateToProductList}
            hidden={isRecording} 
          >
            <Grid3x3Icon className="h-6 w-6" />
            <span className="sr-only">Go to product listing</span>
          </button>
        </div>
        <div className="absolute bottom-0 right-4 mb-4 z-10">
        <button
            className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors"
            type='button'
            onClick={navigateToStoreRoom}
            hidden={isRecording} 
          >
            <StoreIcon className="h-6 w-6" />
            <span className="sr-only">Go to store room</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;
