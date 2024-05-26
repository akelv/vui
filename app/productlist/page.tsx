// import Image from "next/image";
// // import { assistant } from "@/components/assistant"; 
// import VideoUploader from "@/components/VideoUploader";
// export default function Home() {
//   return VideoUploader()
// }
import React from 'react';
import ProductList from '@/components/ProductList';

const Page: React.FC = () => {
  return (
    <div>
      <h1>Product Listings</h1>
      <ProductList />
    </div>
  );
};

export default Page;
