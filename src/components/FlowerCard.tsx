import { Store } from 'lucide-react';
import { Flower } from '../types';

interface FlowerCardProps {
  flower: Flower;
  onOrder?: (flower: Flower) => void;
}

export function FlowerCard({ flower, onOrder }: FlowerCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 group relative">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={flower.image || flower.image_url}
          alt={flower.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-xl text-gray-900 mb-2">
          {flower.name}
        </h3>

        {flower.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {flower.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          {flower.seller_name && (
            <>
              <Store className="w-4 h-4 text-emerald-500" />
              <span>{flower.seller_name}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-extrabold text-emerald-600">
            ${flower.price}
          </span>

          {/* This ul seems to be for flower items, keeping it as is for now */}
          <ul>
            {(flower.items || []).map((item, idx) => (
              <li key={idx} className="text-xs text-gray-500">{item}</li>
            ))}
          </ul>

          {onOrder && (
            <button
              onClick={() => onOrder(flower)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md group-hover:shadow-lg"
            >
              Order Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
