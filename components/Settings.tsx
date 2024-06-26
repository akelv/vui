"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { CameraIcon, Grid3x3Icon, StoreIcon } from './ui/controls';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Settings: React.FC = () => {
  const router = useRouter();
  const navigateToStoreRoom = () => {
    router.push('/storeroom');
  };

  const navigateToProductList = () => {
    router.push('/productlist');
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const navigateToHome = () => {
    router.push('/');
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={navigateToSettings}
        >
          <Avatar className="h-16 w-16 bg-gray-900 text-gray-50">
            <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
            <AvatarFallback>KV</AvatarFallback>
          </Avatar>
        </button>
      </div>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col items-center justify-center z-10">
          <div className="text-white mb-2 text-center">Welcome to the Settings</div>
          <button
            className="bg-white/20 disabled:bg-white/5 backdrop-blur-sm rounded-full p-4 text-white hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors"
            type="button"
            onClick={navigateToHome}
          >
            <CameraIcon className="h-8 w-8" />
          </button>
        </div>
        <div className="absolute bottom-0 left-4 mb-4 z-10">
          <button
            className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors"
            type='button'
            onClick={navigateToProductList}
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
          >
            <StoreIcon className="h-6 w-6" />
            <span className="sr-only">Go to store room</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;