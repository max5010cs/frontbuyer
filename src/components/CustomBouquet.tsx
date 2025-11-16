import { useState } from 'react';
import { ArrowLeft, Sparkles, Loader2, Flower as FlowerIcon } from 'lucide-react';
import { api } from '../services/api';
import { useBuyer } from '../context/BuyerContext';

interface CustomBouquetProps {
  onBack: () => void;
  onViewBids: (bouquetId: number) => void;
}

export function CustomBouquet({ onBack, onViewBids }: CustomBouquetProps) {
  const { buyerId } = useBuyer();
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bouquetResult, setBouquetResult] = useState<{ id: number; description: string; image_url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description for your custom bouquet.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setBouquetResult(null);

    try {
      const result = await api.createCustomBouquet(buyerId, description);
      setBouquetResult(result);
    } catch (err) {
      setError('Failed to create custom bouquet. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Flower Feed
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create Your Custom Bouquet
        </h1>

        <p className="text-gray-600 mb-8">
          Describe your dream bouquet, and our AI will help create it for you.
          Sellers will then bid to fulfill your unique request!
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="mb-6">
            <label htmlFor="description" className="block text-lg font-medium text-gray-800 mb-2">
              Bouquet Description
            </label>
            <textarea
              id="description"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
              placeholder="e.g., A vibrant bouquet with red roses, white lilies, and a touch of baby's breath, perfect for a wedding anniversary."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-purple to-violet-600 hover:from-primary-purple hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-slow"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin-slow" />
                <div className="absolute w-7 h-7 border-2 border-white rounded-full animate-ping-slow"></div>
                <span className="ml-3">Generating Bouquet...</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Custom Bouquet
              </>
            )}
          </button>
        </form>

        {bouquetResult && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in animation-delay-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Custom Bouquet is Ready!
            </h2>
            <p className="text-gray-700 mb-6">{bouquetResult.description}</p>
            <div className="mb-6 flex justify-center">
              <img
                src={bouquetResult.image_url}
                alt="Custom Bouquet"
                className="max-w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
            <button
              onClick={() => onViewBids(bouquetResult.id)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
            >
              <FlowerIcon className="w-5 h-5" />
              View Bids for this Bouquet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}