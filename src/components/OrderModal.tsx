import { useState } from 'react';
import { X } from 'lucide-react';
import type { Flower } from '../types';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 z-50">
      <div className="bg-white rounded-2xl w-full max-w-xs mx-auto shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <div className="overflow-y-auto flex-1 flex flex-col items-center">
          <img
            src={flower.image_path ? `https://flowybackend.onrender.com${flower.image_path}` : ''}
            alt={flower.name}
            className="w-full h-64 object-cover rounded-t-2xl"
            style={{ background: '#f3f4f6' }}
          />
          <div className="p-4 w-full flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">{flower.name}</h2>
            <div className="text-xs text-gray-500 text-center mb-1">{flower.items?.join(', ')}</div>
            <div className="text-sm text-gray-600 text-center mb-2">{flower.description}</div>
            <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-base mb-4">${flower.price.toFixed(2)}</span>
            <div className="flex items-center gap-2 mb-4">
              <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="border rounded px-2 py-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-xl hover:bg-primary-focus transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Ordering...' : 'Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
