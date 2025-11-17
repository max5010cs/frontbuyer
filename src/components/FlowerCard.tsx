import type { Flower } from '../types';

const IMAGE_BASE_URL = "https://flowybackend.onrender.com";

interface FlowerCardProps {
  flower: Flower;
  onOrder: () => void;
}

export const FlowerCard: React.FC<FlowerCardProps> = ({ flower, onOrder }) => {
  return (
    <div
      className="relative rounded-3xl shadow-xl bg-white/80 p-0 flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl min-w-0 overflow-hidden group animate-fade-in"
      style={{ minHeight: 210, maxWidth: 200 }}
      onClick={onOrder}
    >
      <div className="w-full h-40 overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={flower.image_path ? `${IMAGE_BASE_URL}${flower.image_path}` : ''}
          alt={flower.name}
          className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500 rounded-3xl"
          style={{ background: '#f3f4f6' }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent text-white flex flex-col items-start animate-fade-in-up">
        <h3 className="font-extrabold text-lg mb-0.5 tracking-tight drop-shadow-lg">{flower.name}</h3>
        <div className="text-xs opacity-80 mb-0.5 truncate w-full">{flower.items?.join(', ')}</div>
        <div className="text-xs opacity-70 truncate w-full">{flower.description}</div>
        <span className="mt-1 bg-emerald-500/80 text-white font-bold px-3 py-0.5 rounded-full text-xs shadow-lg animate-bounce-in">${flower.price.toFixed(2)}</span>
      </div>
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-white/80 hover:bg-emerald-100 text-emerald-600 rounded-full p-2 shadow-lg transition-all duration-200 scale-90 hover:scale-100">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
        </button>
      </div>
    </div>
  );
};
