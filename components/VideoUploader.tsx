"use client";
import useFFmpeg from './hooks/useFFmpeg';
// import {FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile} from '@ffmpeg/util';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LoaderPinwheelIcon , Grid3x3Icon, SwitchCameraIcon, CircleIcon, StoreIcon } from './ui/controls';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
const VideoUploader: React.FC = () => {
  const ffmpeg = useFFmpeg();
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
  const [items, setItems] = useState(0);
  const [resp, setResp] = useState("");
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

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
            console.log("Saving data");
            setIsUploading(true);
            const compressedBlob = await compressVideo(event.data);
            uploadVideo(compressedBlob);
            // uploadVideo(event.data);
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

  const compressVideo = async (videoBlob: Blob): Promise<Blob> => {
    if (!ffmpeg) {
      throw new Error("FFmpeg is not loaded yet");
    }

    const inputName = 'input.webm';
    const outputName = 'output.mp4';
    const inputData = await fetchFile(videoBlob);

    ffmpeg.writeFile(inputName, inputData);

    await ffmpeg.exec(['-i', inputName, '-vcodec', 'libx264', '-crf', '28', outputName]);

    const outputData = ffmpeg.readFile(outputName);
    const compressedBlob = new Blob([(await outputData).valueOf()], { type: 'video/mp4' });

    return compressedBlob;
  };
  const uploadVideo = async (blob: Blob) => {
    if (blob) {
      console.log("Start Uploading")
      const formData = new FormData();
      formData.append('file', blob, 'recorded-video.mp4');

      try {
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
        setItems(response.data.data.length);
        localStorage.setItem('uploadResponse', JSON.stringify(response.data));
        setUploadProgress(null);
        setIsUploading(false);
      } catch (err) {
        console.error('Error uploading video:', err);
        setIsUploading(false);
        setUploadProgress(null);
        setResp("Service Unavailable");
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
            {isUploading && (
              <LoaderPinwheelIcon className="h-12 w-12 animate-spin text-white" />
            )
            }
          </button>
          {uploadProgress !== null && (
                <div className="absolute bottom-0 mt-2 w-full z-10">
                  <Progress className="bg-white/20 rounded-full h-1 [&>div]:bg-[#ffd700]" value={uploadProgress}/>
                </div>
          )}
          <div className='absolute bottom-20 center z-10'>
            {!isRecording && !isUploading && (<p className="text-white text-sm bg-white/20 p-1 rounded">Snap a few seconds video and say how much you sell</p> )} 
            {isUploading && uploadProgress !== null && uploadProgress != 100 &&(<p className="text-white text-sm bg-white/20 p-1 rounded">Uploading video</p> )}
            {isUploading && uploadProgress == null &&(<p className="text-white text-sm bg-white/20 p-1 rounded">Compressing video</p> )} 
            {isUploading && uploadProgress == 100 &&(<p className="text-white text-sm bg-white/20 p-1 rounded">Itemize and prepare listing</p> )}
            {resp != "" &&(<p className="text-white text-sm bg-white/20 p-1 rounded">{resp}</p>)}
          </div>
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
           {items > 0 && (
               <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-medium">
                  {items}
             </div>
           )}
            <span className="sr-only">Go to store room</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;
