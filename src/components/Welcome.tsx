import { Flower } from 'lucide-react';

interface WelcomeProps {
  buyerName: string;
  onStartShopping: () => void;
}

export function Welcome({ buyerName, onStartShopping }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-flower-pink via-flower-blue to-flower-green flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements - purely decorative */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-primary-green rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary-purple rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute top-20 right-0 w-48 h-48 bg-accent-orange rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>


      <div className="text-center max-w-md relative z-10">
        <div className="mb-8 inline-flex items-center justify-center w-28 h-28 bg-white rounded-full shadow-xl opacity-0 animate-fade-in animation-delay-100">
          <Flower className="w-14 h-14 text-emerald-600 transform -rotate-12 animate-bounce-subtle" />
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 opacity-0 animate-slide-up animation-delay-300">
          Welcome, <span className="text-emerald-700">{buyerName}</span>
        </h1>

        <p className="text-lg text-gray-700 mb-10 opacity-0 animate-slide-up animation-delay-500">
          Discover beautiful flowers or create your perfect custom bouquet
        </p>

        <button
          onClick={onStartShopping}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl opacity-0 animate-slide-up animation-delay-700 animate-pulse-slow"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
}
