import { useState } from 'react';
import { X } from 'lucide-react';
import type { Flower } from '../types';

interface OrderModalProps {
  flower: Flower;
  onClose: () => void;
  onConfirm: (quantity: number) => Promise<void>;
  onPrev?: () => void;
  onNext?: () => void;
}

export function OrderModal({ flower, onClose, onConfirm, onPrev, onNext }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(quantity);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative">
        <div className="relative">
          <img
            src={flower.image_path ? `https://flowybackend.onrender.com${flower.image_path}` : ''}
            alt={flower.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
            >
              <span className="sr-only">Previous</span>
              &#8592;
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="absolute top-1/2 right-12 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
            >
              <span className="sr-only">Next</span>
              &#8594;
            </button>
          )}
        </div>
        <div className="p-6 flex flex-col gap-3">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{flower.name}</h2>
          <div className="text-sm text-gray-500 mb-2">{flower.items?.join(', ')}</div>
          <div className="text-gray-700 mb-2">{flower.description}</div>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-base">${flower.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="border rounded px-2 py-1 w-16 text-center"
            />
          </div>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="mt-4 w-full bg-primary text-white font-semibold py-2 px-4 rounded-xl hover:bg-primary-focus transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Ordering...' : 'Order Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
