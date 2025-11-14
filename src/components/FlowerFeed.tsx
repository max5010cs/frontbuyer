import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Store } from 'lucide-react';
import { FlowerCard } from './FlowerCard';
import { OrderModal } from './OrderModal';
import { Flower } from '../types';
import { api } from '../services/api';
import { useBuyer } from '../context/BuyerContext';

interface FlowerFeedProps {
  onCreateCustom: () => void;
}

export function FlowerFeed({ onCreateCustom }: FlowerFeedProps) {
  const { buyerId } = useBuyer();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
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
    if (!selectedFlower) return;

    try {
      const result = await api.createOrder(buyerId, selectedFlower.id, quantity);
      setNotification(result.message);
      setSelectedFlower(null);
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      console.error('Failed to create order:', error);
      setNotification('Failed to create order. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Browse Flowers
          </h1>

          <button
            onClick={onCreateCustom}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            Create Custom Bouquet with AI
          </button>
        </div>

        {notification && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg">
            {notification}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flowers.map((flower) => (
            <FlowerCard
              key={flower.id}
              flower={flower}
              onOrder={setSelectedFlower}
            />
          ))}
        </div>

        {flowers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No flowers available at the moment
            </p>
          </div>
        )}
      </div>

      {selectedFlower && (
        <OrderModal
          flower={selectedFlower}
          onClose={() => setSelectedFlower(null)}
          onConfirm={handleOrder}
        />
      )}
    </div>
  );
}
