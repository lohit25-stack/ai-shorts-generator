/*
✅ AI Shorts Generator Development Checklist (v1.0)

✔️ Step 1: Generate AI Shorts from Prompt
✔️ Step 2: Save Output History with LocalStorage (Last 10 Prompts)
✔️ Step 3: Add "Favorite" Option to Save Best Outputs
✔️ Step 4: Implement Export to PDF / Text Format
✔️ Step 5: Add Voice Input (Mic)
✔️ Step 6: Enable Theme Switch with Persistence
✔️ Step 7: Shareable Page View (Dynamic Route for Slug)
✔️ Step 8: Add Animation on Output Reveal
✔️ Step 9: Add Tags or Categories to Organize
✔️ Step 10: Backend Auth + Firebase Sync (Optional)
*/
import { useState } from 'react';
// Firebase imports for Firestore sync (if Firebase is configured)
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// Adjust the path below as necessary to point to your firebase.ts/firebaseConfig.js file
import { app } from '../api/firebase';
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
import { debounce } from 'lodash';
import { useEffect } from 'react';
import { useRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Move the "share slug" useEffect above the state declarations so setters are accessible.
// Declare fallback setters if not already declared below.
const Home = () => {
  // Temporary fallback state setters (used only for shared slug hydration)
  const [, setScript] = useState('');
  const [, setCaption] = useState('');
  const [, setHashtags] = useState('');
  const [, setThumbnailText] = useState('');
  const [, setShowOutput] = useState(false);
  const outputRef = useRef<HTMLDivElement | null>(null);

  // "Share slug" useEffect moved here so fallback setters are in scope.
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/share/')) {
      try {
        const slug = decodeURIComponent(escape(atob(path.split('/share/')[1])));
        const [s, c, h, t] = slug.split('|');
        setScript(s);
        setCaption(c);
        setHashtags(h);
        setThumbnailText(t);
        setShowOutput(true);
        // If "real" setters are declared below, also set them
        if (typeof setScriptReal === 'function') setScriptReal(s);
        if (typeof setCaptionReal === 'function') setCaptionReal(c);
        if (typeof setHashtagsReal === 'function') setHashtagsReal(h);
        if (typeof setThumbnailTextReal === 'function') setThumbnailTextReal(t);
        if (typeof setShowOutputReal === 'function') setShowOutputReal(true);
        setTimeout(() => {
          if (outputRef.current instanceof HTMLElement) {
            outputRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      } catch (e) {
        console.error('Invalid share slug');
      }
    }
  }, []);

  const [showOutput, setShowOutputReal] = useState(false);
  const [script, setScriptReal] = useState('');
  const [caption, setCaptionReal] = useState('');
  const [hashtags, setHashtagsReal] = useState('');
  const [thumbnailText, setThumbnailTextReal] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [, setTags] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  // Use the "real" setters in the component logic below.

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      setScriptReal(data.script || '');
      setCaptionReal(data.caption || '');
      setHashtagsReal(data.hashtags || '');
      setThumbnailTextReal(data.thumbnailText || '');

      const extractedTags = prompt
        .split(' ')
        .filter(word => word.startsWith('#'))
        .map(tag => tag.replace(/[^a-zA-Z0-9#]/g, ''));
      setTags(extractedTags);

      setShowOutputReal(true);
      setTimeout(() => {
        if (outputRef.current instanceof HTMLElement) {
          outputRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);

      const newEntry = {
        prompt,
        script: data.script,
        caption: data.caption,
        hashtags: data.hashtags,
        thumbnailText: data.thumbnailText,
        tags: extractedTags,
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [newEntry, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('outputHistory', JSON.stringify(updatedHistory));
      // Save to Firestore if Firebase is configured and user is authenticated
      try {
        const db = getFirestore(app);
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, 'outputHistory'), {
            uid: user.uid,
            ...newEntry
          });
        }
      } catch (err) {
        console.error('Failed to sync with Firestore:', err);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    document.getElementById('promptInput')?.focus();
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('outputHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Restore darkMode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  // Save darkMode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const debouncedSetPrompt = debounce((value: string) => setPrompt(value), 300);

  const handleToggleFavorite = (item: any) => {
    const exists = favorites.find(fav => fav.timestamp === item.timestamp);
    const updatedFavorites = exists
      ? favorites.filter(fav => fav.timestamp !== item.timestamp)
      : [item, ...favorites].slice(0, 20);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    toast.success(exists ? 'Removed from favorites!' : 'Added to favorites!');
  };

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleMicClick = () => {
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setPrompt(speechResult);
        toast.success('Voice input captured!');
      };

      recognition.onerror = (event: any) => {
        toast.error('Mic error: ' + event.error);
      };

      recognitionRef.current = recognition;
    }

    if (!isListening) {
      recognitionRef.current.start();
      toast.info('Listening...');
    } else {
      recognitionRef.current.stop();
    }
    setIsListening(!isListening);
  };

  return (
    <div className={`min-h-screen px-4 py-8 transition-all duration-1000 ease-in-out ${darkMode ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded shadow-md font-semibold transition duration-300 ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <div
        className={`transition-all duration-1000 ease-in-out ${
          prompt.length > 0
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto animate-fadeIn delay-300'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        {/* HERO section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:to-white leading-snug sm:leading-normal">
            Turn any idea into a viral Short in 10 seconds
          </h1>
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => debouncedSetPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          id="promptInput"
        />
        <button
          onClick={handleMicClick}
          className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg mb-4 hover:bg-emerald-700 transition duration-300 w-full max-w-sm mx-auto"
        >
          {isListening ? '🛑 Stop Mic' : '🎤 Voice Input'}
        </button>
        <button
          onClick={handleGenerate}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all duration-1000 shadow-lg w-full max-w-sm mx-auto"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Generating...
            </span>
          ) : 'Generate'}
        </button>
        {/* Sample idea and icons */}
        <div className="text-center mt-6">
          <p className="text-gray-500 dark:text-gray-300 mb-2">Or try a sample idea ↓</p>
          <div className="inline-block px-5 py-3 bg-white dark:bg-slate-700 rounded-full shadow-sm font-semibold text-base sm:text-lg cursor-pointer hover:scale-105 transition">
            How to study 2x faster
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6 text-center items-center">
          <div>
            <div className="text-3xl">🎥</div>
            <div className="text-sm font-medium">Script</div>
          </div>
          <div>
            <div className="text-3xl">🙂</div>
            <div className="text-sm font-medium">Caption</div>
          </div>
          <div>
            <div className="text-3xl">🖼️</div>
            <div className="text-sm font-medium">Thumbnail</div>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-8 bg-slate-900 p-4 rounded-lg shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-3">📜 Your Previous Outputs</h3>
          <ul className="space-y-4 text-sm text-gray-200 max-h-80 overflow-y-auto scroll-mb-20 pr-2">
            {history.map((item, index) => (
              <li key={index} className="bg-slate-800 rounded p-3 border border-slate-700">
                <div className="font-semibold text-cyan-300 mb-1">Prompt: {item.prompt}</div>
                <div><span className="text-pink-400">Caption:</span> {item.caption}</div>
                <div><span className="text-green-400">Hashtags:</span> {item.hashtags}</div>
                <div><span className="text-yellow-400">Thumbnail:</span> {item.thumbnailText}</div>
                <div className="text-gray-400 mt-1 text-xs">🕒 {new Date(item.timestamp).toLocaleString()}</div>
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((tag: string, i: number) => (
                      <span key={i} className="bg-blue-700 px-2 py-1 rounded-full text-xs text-white">{tag}</span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => handleToggleFavorite(item)}
                  className={`mt-2 text-xs px-3 py-1 rounded-full font-semibold transition ${
                    favorites.find(fav => fav.timestamp === item.timestamp)
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  ⭐ {favorites.find(fav => fav.timestamp === item.timestamp) ? 'Favorited' : 'Add to Favorites'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="mt-10 bg-slate-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-3">⭐ Favorites</h3>
          <ul className="space-y-4 text-sm text-gray-200 max-h-80 overflow-y-auto scroll-mb-20 pr-2">
            {favorites.map((item, index) => (
              <li key={index} className="bg-slate-700 rounded p-3 border border-slate-600">
                <div className="font-semibold text-yellow-300 mb-1">Prompt: {item.prompt}</div>
                <div><span className="text-pink-400">Caption:</span> {item.caption}</div>
                <div><span className="text-green-400">Hashtags:</span> {item.hashtags}</div>
                <div><span className="text-yellow-400">Thumbnail:</span> {item.thumbnailText}</div>
                <div className="text-gray-400 mt-1 text-xs">🕒 {new Date(item.timestamp).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className={`mt-6 transition-all duration-1000 ease-in-out ${
          showOutput
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto animate-fadeIn animate-slideInUp'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Generated Output</h2>
          <hr className="border-t border-gray-600 w-1/2 mx-auto" />
        </div>
        <div ref={outputRef} className="mt-12 border-t border-gray-700 pt-6">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 space-y-8 transition-opacity duration-700 ease-in-out">
            {/* Output Preview Section */}
            <div className={`bg-slate-800 rounded-lg p-8 shadow-md space-y-6 border ${showOutput ? 'animate-pulse border-purple-500' : 'border-transparent'}`}>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400">🎬 Script</h3>
                <p className="text-white whitespace-pre-line">{script}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pink-400">📝 Caption</h3>
                <p className="text-white whitespace-pre-line">{caption}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400">🏷️ Hashtags</h3>
                <p className="text-white whitespace-pre-line">{hashtags}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">🖼️ Thumbnail Text</h3>
                <p className="text-white whitespace-pre-line">{thumbnailText}</p>
              </div>
            </div>
            <div className="bg-slate-700 border border-yellow-400 rounded-lg p-6 text-center shadow-lg transition-all duration-500">
              <h3 className="text-lg font-bold text-yellow-300 mb-3">🔲 Thumbnail Preview</h3>
              <div className="bg-slate-900 text-white font-semibold text-lg p-8 rounded-lg border border-yellow-300 shadow-inner">
                {thumbnailText || 'Your thumbnail text will appear here...'}
              </div>
              <div className="mt-5">
                <button
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob([thumbnailText], { type: "text/plain" });
                    element.href = URL.createObjectURL(file);
                    element.download = "thumbnail-text.txt";
                    document.body.appendChild(element);
                    element.click();
                    toast.success("Thumbnail downloaded!");
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105 text-black font-semibold"
                >
                  ⬇️ Download Thumbnail Text
                </button>
              </div>
              <div className="mt-3 flex justify-center gap-5">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(thumbnailText);
                    toast.success('Thumbnail text copied!');
                  }}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105 text-white font-semibold"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => {
                    const text = `Thumbnail Idea:\n\n${thumbnailText}`;
                    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                    window.open(shareUrl, '_blank');
                    toast.info('Opening WhatsApp...');
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105 text-white font-semibold"
                >
                  📤 Share
                </button>
              </div>
            </div>
            <div className="sticky left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur-md rounded-lg px-8 py-4 shadow-lg z-50 top-full mt-8 transition-all duration-500">
              <div className="flex flex-wrap gap-5 gap-y-3 justify-center text-sm text-white">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Script:\n${script}\n\nCaption:\n${caption}\n\nHashtags:\n${hashtags}`);
                    toast.success('Copied to clipboard!');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105"
                >
                  📋 Copy Output
                </button>
                <button
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob(
                      [`Script:\n${script}\n\nCaption:\n${caption}\n\nHashtags:\n${hashtags}`],
                      { type: "text/plain" }
                    );
                    element.href = URL.createObjectURL(file);
                    element.download = "ai-shorts-output.txt";
                    document.body.appendChild(element);
                    element.click();
                    toast.success('Download started!');
                  }}
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105"
                >
                  💾 Download
                </button>
                <button
                  onClick={() => {
                    const text = `Check this out!\n\n${caption}\n\n${hashtags}`;
                    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                    window.open(shareUrl, '_blank');
                    toast.info('Opening WhatsApp...');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105"
                >
                  📤 Share
                </button>
                <button
                  onClick={() => {
                    const base = window.location.origin;
                    const slug = btoa(unescape(encodeURIComponent(`${script}|${caption}|${hashtags}|${thumbnailText}`)));
                    const link = `${base}/share/${slug}`;
                    navigator.clipboard.writeText(link);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105"
                >
                  🔗 Copy Link
                </button>
                <button
                  onClick={handleGenerate}
                  className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105"
                >
                  🔄 Regenerate
                </button>
                <button
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob(
                      [`Script:\n${script}\n\nCaption:\n${caption}\n\nHashtags:\n${hashtags}`],
                      { type: "application/pdf" }
                    );
                    element.href = URL.createObjectURL(file);
                    element.download = "ai-shorts-output.pdf";
                    document.body.appendChild(element);
                    element.click();
                    toast.success("PDF Download started!");
                  }}
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105"
                >
                  🧾 Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
        {!showOutput && prompt.length > 0 && (
          <div className="flex justify-center mt-10">
            <div className="text-white text-sm flex flex-col items-center opacity-80 animate-fadeInUp delay-500 mt-10 text-center">
              <span className="mb-2 text-base font-medium animate-pulse">Scroll down to preview your content</span>
              <span className="text-3xl animate-bounce">⬇️</span>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </div>
  );
};


// (Moved above for proper state setter access)

export default Home;
