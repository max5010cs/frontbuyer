import { Flower } from 'lucide-react';

interface WelcomeProps {
  buyerName: string;
  onStartShopping: () => void;
}

export function Welcome({ buyerName, onStartShopping }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg">
          <Flower className="w-12 h-12 text-emerald-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Welcome, {buyerName}
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Discover beautiful flowers or create your perfect custom bouquet
        </p>

        <button
          onClick={onStartShopping}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
}
