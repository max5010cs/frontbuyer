import { Store } from 'lucide-react';
import { Flower } from '../types';

interface FlowerCardProps {
  flower: Flower;
  onOrder?: (flower: Flower) => void;
}

export function FlowerCard({ flower, onOrder }: FlowerCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={flower.image || flower.image_url}
          alt={flower.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {flower.name}
        </h3>

        {flower.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {flower.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          {flower.seller_name && (
            <>
              <Store className="w-4 h-4" />
              <span>{flower.seller_name}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-emerald-600">
            ${flower.price}
          </span>

          <ul>
            {(flower.items || []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          {onOrder && (
            <button
              onClick={() => onOrder(flower)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Order Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
