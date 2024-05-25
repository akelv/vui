// import Image from "next/image";
// // import { assistant } from "@/components/assistant"; 
// import VideoUploader from "@/components/VideoUploader";
// export default function Home() {
//   return VideoUploader()
// }
import React from 'react';
import VideoUploader from '../components/VideoUploader';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Video Recorder</h1>
      <VideoUploader />
    </div>
  );
};

export default Home;
