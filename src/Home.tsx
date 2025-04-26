import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function Output() {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedResult = urlParams.get("result");

  const [resultText, setResultText] = useState(
    sharedResult || "Here’s your AI-generated short: 'Boost your productivity in 30 seconds with these 3 hacks…'"
  );
  const [loading, setLoading] = useState(false);

  const regenerate = async () => {
    setLoading(true);
    try {
      const response = await new Promise<{ result: string }>((resolve) =>
        setTimeout(() => {
          resolve({
            result: "🔥 Fresh short: 'Conquer procrastination with this 20-second trick...'",
          });
        }, 1500)
      );
      setResultText(response.result);
      toast.success("⚡ New short ready!");
    } catch (error) {
      console.error("Failed to regenerate:", error);
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  const shareLink = `${window.location.origin}/output?result=${encodeURIComponent(resultText)}`;

  return (
    <div className="min-h-screen bg-[#0F0F1B] text-white flex flex-col items-center justify-center p-6">
      <Toaster position="top-center" />
      <h1 className="text-4xl text-pink-500 font-bold mb-4">🎬 Hello Tailwind!</h1>

      <div className="bg-[#1A1A2E] p-4 rounded-lg shadow-md w-full max-w-xl mb-6">
        <p className="text-lg text-gray-100">
          {loading ? "Generating a fresh new short..." : resultText}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 transition duration-200 py-2 rounded-md font-medium"
          onClick={() => {
            navigator.clipboard.writeText(resultText);
            toast.success("✅ Copied to clipboard!");
          }}
          disabled={loading}
        >
          📋 Copy
        </button>

        <button
          className="flex-1 bg-purple-600 hover:bg-purple-700 transition duration-200 py-2 rounded-md font-medium"
          onClick={regenerate}
          disabled={loading}
        >
          🔁 Regenerate
        </button>

        <button
          className="flex-1 bg-green-600 hover:bg-green-700 transition duration-200 py-2 rounded-md font-medium"
          onClick={() => {
            navigator.clipboard.writeText(shareLink);
            toast.success("🔗 Share link copied!");
          }}
          disabled={loading}
        >
          📤 Share Link
        </button>
      </div>
    </div>
  );
}

export default Output;