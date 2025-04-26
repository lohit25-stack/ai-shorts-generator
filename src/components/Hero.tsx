import React from "react";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
        Turn any idea into <br className="hidden md:inline" />
        a viral Short in <span className="text-blue-500">10 seconds</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Create video scripts, captions, thumbnails — instantly, using AI.
      </p>
      <input
        type="text"
        placeholder="What's your video about?"
        className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg mb-4 text-gray-900"
      />
      <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-lg font-semibold shadow-md hover:opacity-90">
        🎬 Generate My Script
      </button>
      <p className="text-sm text-gray-500 mt-4">Or try a sample idea ↓</p>
      <div className="bg-white shadow rounded-lg px-4 py-2 mt-4 font-medium">
        How to study 2x faster
      </div>
    </section>
  );
};

export default Hero;
