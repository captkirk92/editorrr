import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex flex-col justify-center items-center z-[1000] text-white">
      <div className="border-4 border-gray-200 border-t-[#4285F4] rounded-full w-10 h-10 animate-spin"></div>
      <p className="mt-4 text-base">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
