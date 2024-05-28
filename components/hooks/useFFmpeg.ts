import { useEffect, useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';

const useFFmpeg = () => {
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);

  useEffect(() => {
    const loadFfmpeg = async () => {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const ffmpegInstance = new FFmpeg();
      await ffmpegInstance.load();
      setFfmpeg(ffmpegInstance);
    };

    loadFfmpeg();
  }, []);

  return ffmpeg;
};

export default useFFmpeg;
