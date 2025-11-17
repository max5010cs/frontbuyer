import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { FlowerCard } from './FlowerCard';
import { FlowerFullScreen } from './FlowerFullScreen';
import { Flower } from '../types';
import { api } from '../services/api';
import { useBuyer } from '../context/BuyerContext';

interface FlowerFeedProps {
  onCreateCustom: () => void;
}

export function FlowerFeed({ onCreateCustom }: FlowerFeedProps) {
  const { buyerId } = useBuyer();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getFlowers()
      .then(setFlowers)
      .catch(() => setError('Failed to load flowers'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleOrder = async (quantity: number) => {
    if (selectedIndex === null) return;
    const selectedFlower = flowers[selectedIndex];
    try {
      const result = await api.createOrder(buyerId, selectedFlower.id, quantity);
      setNotification(result.message);
      setSelectedIndex(null);
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      console.error('Failed to create order:', error);
      setNotification('Failed to create order. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-flower-pink via-flower-blue to-flower-green">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin-slow" />
          <div className="absolute w-20 h-20 border-4 border-emerald-300 rounded-full animate-ping-slow"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-flower-pink via-flower-blue to-flower-green">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 animate-slide-up animation-delay-100">
            Browse Flowers
          </h1>

          <button
            onClick={onCreateCustom}
            className="w-full bg-gradient-to-r from-primary-purple to-violet-600 hover:from-primary-purple hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 animate-slide-up animation-delay-200"
          >
            <Sparkles className="w-5 h-5 animate-pulse-slow" />
            Create Custom Bouquet with AI
          </button>
        </div>

        {notification && (
          <div className="mb-6 bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg shadow-md animate-fade-in">
            {notification}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {flowers.map((flower, index) => (
            <div key={flower.id} className={`opacity-0 animate-slide-up animation-delay-${200 + index * 100}`}>
              <FlowerCard
                flower={flower}
                onOrder={() => setSelectedIndex(index)}
              />
            </div>
          ))}
        </div>

        {flowers.length === 0 && (
          <div className="text-center py-12 opacity-0 animate-fade-in animation-delay-500">
            <p className="text-gray-500 text-lg">
              No flowers available at the moment
            </p>
          </div>
        )}
      </div>

      {selectedIndex !== null && (
        <FlowerFullScreen
          flowers={flowers}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onConfirm={handleOrder}
        />
      )}
    </div>
  );
}
