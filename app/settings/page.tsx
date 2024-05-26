// import Image from "next/image";
// // import { assistant } from "@/components/assistant"; 
// import VideoUploader from "@/components/VideoUploader";
// export default function Home() {
//   return VideoUploader()
// }
import React from 'react';
import Settings from '@/components/Settings';

const Page: React.FC = () => {
  return (
    <div>
      <h1>Settings</h1>
      <Settings />
    </div>
  );
};

export default Page;
