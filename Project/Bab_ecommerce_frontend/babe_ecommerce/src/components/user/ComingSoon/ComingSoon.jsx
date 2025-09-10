import React from "react";
import { FaRocket } from "react-icons/fa";

function ComingSoon() {
  return (
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/photo/comingsoon.jpg')`, // Apna background
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
   <div className="relative z-10 text-center px-6">
      <h1 className="flex items-center justify-center gap-4   font-extrabold text-white drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]" style={{fontSize:"5rem"}}>
        
        Coming Soon
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-gray-200 tracking-wide">
        We’re preparing something amazing for you.
      </p>
    </div>
    </div>
  );
}

export default ComingSoon;
