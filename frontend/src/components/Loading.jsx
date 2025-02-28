import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* Outer spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 animate-spin"></div>
        {/* Inner spinner */}
        <div className="w-12 h-12 rounded-full border-t-4 border-blue-500 animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-gray-600 animate-pulse">Loading...</p>
    </div>
  );
};

export default Loading;
