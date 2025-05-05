// No need to import React when using "jsx": "react-jsx"
const Hero = ({
  showOutput,
  script,
  caption,
  hashtags,
  thumbnailText,
}: {
  showOutput: boolean;
  script: string;
  caption: string;
  hashtags: string;
  thumbnailText: string;
}) => {
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
      {showOutput && (
        <section className="mt-10 w-full max-w-2xl text-left bg-gray-900 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Your Short is ready!</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Script</h3>
            <p className="text-sm leading-relaxed">{script}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Caption</h3>
            <p className="text-sm">{caption}</p>
            <p className="text-xs text-gray-400">{hashtags}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Thumbnail</h3>
            <div className="bg-blue-700 text-center text-white font-bold text-lg py-6 rounded-md">{thumbnailText}</div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button className="px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-semibold">📋 Copy</button>
            <button className="px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-semibold">⬇️ Download</button>
            <button className="px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-semibold">🔗 Share</button>
            <button className="px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-semibold">🔄 Regenerate</button>
          </div>
        </section>
      )}
    </section>
  );
};

export default Hero;
