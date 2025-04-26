import React from 'react';
import { useNavigate } from 'react-router-dom';

const OutputPreview = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const result = params.get('result');

  return (
    <div className="w-full max-w-xl bg-[#1A1A2E] text-white p-6 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold mb-4">🎬 Your AI-Generated Short</h1>

      <div className="bg-[#2A2A3E] rounded-md h-40 mb-4 flex items-center justify-center text-gray-400 text-sm">
        [Thumbnail Placeholder]
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium">{result || "“How to study 2x faster”"}</p>
        <p className="text-sm text-gray-400 mt-1">Auto-generated title for your YouTube Short</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-md text-sm text-white font-medium"
          onClick={() => navigate('/')}
        >
          🔙 Back to Home
        </button>
      </div>
    </div>
  );
};

export default OutputPreview;
