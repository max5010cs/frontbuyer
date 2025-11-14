import { useState } from 'react';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useBuyer } from '../context/BuyerContext';
import { CustomBouquet as CustomBouquetType } from '../types';

interface CustomBouquetProps {
  onBack: () => void;
  onViewBids: (bouquetId: number) => void;
}

export function CustomBouquet({ onBack, onViewBids }: CustomBouquetProps) {
  const { buyerId } = useBuyer();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [bouquet, setBouquet] = useState<CustomBouquetType | null>(null);
  const [isCreatingBid, setIsCreatingBid] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState<string | null>(null);

  const suggestedPrompts = [
    'A romantic red roses bouquet with white lilies',
    'Pastel pink and lavender arrangement with eucalyptus',
    'Bright sunflowers with orange gerberas',
    'Elegant white orchids wrapped in silk',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const result = await api.generateCustomBouquet(buyerId, prompt, 'en');
      setBouquet(result);
    } catch (error) {
      console.error('Failed to generate bouquet:', error);
      setError('Failed to generate bouquet');
      setNotification('Failed to generate bouquet. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateBid = async () => {
    if (!bouquet) return;

    setIsCreatingBid(true);
    try {
      await api.createBid(bouquet.bouquet_id);
      setNotification('Your request has been sent to all sellers!');
      setTimeout(() => {
        onViewBids(bouquet.bouquet_id);
      }, 2000);
    } catch (error) {
      console.error('Failed to create bid:', error);
      setNotification('Failed to send bid request. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    } finally {
      setIsCreatingBid(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Browse
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full p-2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Your Custom Bouquet
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            Describe your dream bouquet and let AI bring it to life
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A pastel pink rose and white lily bouquet wrapped in silk ribbon"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none mb-4"
          />

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Bouquet
              </>
            )}
          </button>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Try these ideas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(suggestion)}
                  className="text-sm bg-violet-50 hover:bg-violet-100 text-violet-700 px-3 py-1 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {notification && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg">
            {notification}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {bouquet && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <img
              src={bouquet.image_url}
              alt="Generated bouquet"
              className="w-full h-96 object-cover"
            />

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Your Custom Bouquet
              </h3>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Includes:
                </p>
                <div className="flex flex-wrap gap-2">
                  {bouquet.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateBid}
                disabled={isCreatingBid}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-colors duration-200"
              >
                {isCreatingBid ? 'Sending...' : 'Request Quotes from Sellers'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
