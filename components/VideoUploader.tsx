"use client";
import React, { useState, useRef } from 'react';
import axios from 'axios';

const VideoUploader: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const options = { mimeType: 'video/webm; codecs=vp9' };
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setVideoBlob(event.data);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
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
      } catch (err) {
        console.error('Error uploading video:', err);
      }
    }
  };
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
    startRecording();
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    stopRecording();
    uploadVideo();
  };
  return (
    <div>
     <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
      <div className="relative w-full h-full max-w-[450px] overflow-hidden rounded-xl">
        <video ref={videoRef} style={{ width: '100%', height: '100%' }} />
        <span className="w-full h-full object-cover rounded-md bg-muted" />
        <div className="absolute inset-0 flex items-center justify-center" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex justify-center">
          <button
          className={`${
            isPressed ? 'bg-red-500' : 'bg-white/20'
            } backdrop-blur-sm rounded-full p-4 text-white hover:bg-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors`}
            type="button"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <CircleIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>       
      {/* <div>
        {isRecording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
      </div> */}
      {/* {videoBlob && (
        <div>
          <button onClick={uploadVideo}>Upload Video</button>
        </div>
      )} */}
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
    )
}
