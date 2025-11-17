import type { Flower } from '../types';

const IMAGE_BASE_URL = "https://flowybackend.onrender.com";

interface FlowerCardProps {
  flower: Flower;
  onOrder: () => void;
}

export const FlowerCard: React.FC<FlowerCardProps> = ({ flower, onOrder }) => {
  return (
    <div
      className="rounded-xl shadow-md bg-white p-2 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg min-w-0"
      style={{ minHeight: 210, maxWidth: 180 }}
      onClick={onOrder}
    >
      <img
        src={flower.image_path ? `${IMAGE_BASE_URL}${flower.image_path}` : ''}
        alt={flower.name}
        className="w-full h-28 object-cover rounded-lg mb-2"
        style={{ background: '#f3f4f6' }}
      />
      <div className="w-full flex-1 flex flex-col justify-between">
        <h3 className="font-semibold text-base text-gray-900 truncate mb-1 text-center">{flower.name}</h3>
        <div className="text-xs text-gray-500 text-center mb-1">{flower.items?.join(', ')}</div>
        <div className="text-xs text-gray-600 text-center mb-2">{flower.description}</div>
        <div className="flex justify-center items-center gap-2 mt-1">
          <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full text-xs">${flower.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
