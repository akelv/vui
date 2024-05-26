// import Image from "next/image";
// // import { assistant } from "@/components/assistant"; 
// import VideoUploader from "@/components/VideoUploader";
// export default function Home() {
//   return VideoUploader()
// }
import React from 'react';
import StoreRoom from '@/components/StoreRoom';

const Page: React.FC = () => {
  return (
    <div>
      <h1>Store Room</h1>
      <StoreRoom />
    </div>
  );
};

export default Page;
