import { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Flower } from '../types';

interface OrderModalProps {
  flower: Flower;
  onClose: () => void;
  onConfirm: (quantity: number) => Promise<void>;
}

export function OrderModal({ flower, onClose, onConfirm }: OrderModalProps) {
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
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="relative">
          <img
            src={flower.image_url}
            alt={flower.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {flower.name}
          </h2>

          {flower.description && (
            <p className="text-gray-600 mb-4">{flower.description}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <ShoppingBag className="w-4 h-4" />
            <span>{flower.seller_name}</span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-medium">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center font-semibold"
                >
                  -
                </button>
                <span className="font-semibold text-lg w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Total</span>
              <span className="text-2xl font-bold text-emerald-600">
                ${(flower.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-colors duration-200"
          >
            {isLoading ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
