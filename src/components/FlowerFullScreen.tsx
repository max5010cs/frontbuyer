import { useState, useEffect } from 'react';
import { X, Heart, ThumbsDown, ShoppingCart, MessageCircle } from 'lucide-react';
import { Flower } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { api } from '../services/api';

interface Props {
  flowers: Flower[];
  initialIndex: number;
  onClose: () => void;
  onConfirm: (quantity: number) => Promise<void>;
}

export function FlowerFullScreen({ flowers, initialIndex, onClose, onConfirm }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [sellerLocation, setSellerLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [buyerLocation, setBuyerLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const flower = flowers[currentIndex];

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % flowers.length);
    setQuantity(1);
  };
  const handlePrev = () => {
    setCurrentIndex((i) => (i - 1 + flowers.length) % flowers.length);
    setQuantity(1);
  };

  const handleOrder = async () => {
    setIsOrdering(true);
    try {
      await onConfirm(quantity);
    } finally {
      setIsOrdering(false);
    }
  };

  useEffect(() => {
    async function fetchLocations() {
      const res = await api.getOrderLocationInfo(flower.id);
      setSellerLocation(res.seller_location);
      setBuyerLocation(res.buyer_location);
      setDistance(res.distance_km);
    }
    fetchLocations();
  }, [flower.id]);

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => handleNext(),
    onSwipedDown: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        {...swipeHandlers}
      >
        {/* Exit button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white text-3xl z-10 bg-black/40 rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Flower image */}
        <motion.img
          key={flower.id}
          src={flower.image_path ? `https://flowybackend.onrender.com${flower.image_path}` : ''}
          alt={flower.name}
          loading="lazy"
          className="w-full h-full object-cover"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Overlay info and actions */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {/* Action buttons */}
          <div className="absolute right-4 bottom-36 flex flex-col gap-4 pointer-events-auto items-end z-20">
            <button className="bg-white/40 p-3 rounded-full hover:bg-white/70 transition-colors shadow-lg pointer-events-auto">
              <Heart className="w-6 h-6 text-red-500" />
            </button>
            <button className="bg-white/40 p-3 rounded-full hover:bg-white/70 transition-colors shadow-lg pointer-events-auto">
              <ThumbsDown className="w-6 h-6 text-gray-200" />
            </button>
            <button className="bg-white/40 p-3 rounded-full hover:bg-white/70 transition-colors shadow-lg pointer-events-auto">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="mt-5 px-8 py-3 bg-gradient-to-r from-blue-500 via-pink-400 to-orange-400 text-white font-extrabold rounded-full shadow-2xl transition-all duration-300 animate-pulse focus:outline-none focus:ring-4 focus:ring-pink-300 hover:scale-105 text-lg tracking-wide pointer-events-auto"
              style={{ boxShadow: '0 0 24px 4px #f472b6, 0 0 32px 8px #60a5fa99' }}
            >
              Order
            </button>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-6 bg-gradient-to-t from-black/80 to-transparent text-white flex flex-col items-start animate-fade-in-up pointer-events-auto">
            <h2 className="text-3xl font-extrabold mb-1 tracking-tight drop-shadow-lg">{flower.name}</h2>
            <div className="text-sm opacity-80 mb-1 truncate w-full">{flower.items?.join(', ')}</div>
            <div className="text-xs opacity-70 truncate w-full mb-2">{flower.description}</div>
            <span className="bg-emerald-500/80 text-white font-bold px-4 py-1 rounded-full text-lg shadow-lg animate-bounce-in">${flower.price.toFixed(2)}</span>
            <div className="flex items-center gap-2 mt-4">
              <label htmlFor="quantity" className="text-sm font-medium">Qty:</label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="border rounded px-2 py-1 w-16 text-center text-black focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Confirm order modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full flex flex-col items-center animate-fade-in-up border-2 border-emerald-200">
              <h3 className="text-xl font-extrabold mb-3 text-gray-900 tracking-tight">Confirm Order</h3>
              {sellerLocation ? (
                <a
                  href={`https://maps.google.com/?q=${sellerLocation.lat},${sellerLocation.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 underline mb-2 text-base font-semibold hover:text-emerald-800 transition-colors"
                >
                  View Seller Location on Map
                </a>
              ) : (
                <div className="mb-2 text-gray-400 text-base">Loading seller location...</div>
              )}
              {distance !== null ? (
                <div className="mb-2 text-gray-700 text-base font-medium">{distance.toFixed(1)} km from you</div>
              ) : (
                <div className="mb-2 text-gray-400 text-base">Calculating distance...</div>
              )}
              <div className="flex items-center gap-2 mb-6 mt-2">
                <label htmlFor="quantity" className="text-base font-semibold text-gray-700">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="border-2 border-emerald-400 rounded-xl px-4 py-2 w-24 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all shadow-md bg-gray-50 hover:border-emerald-600 placeholder-gray-400"
                  style={{ boxShadow: '0 2px 12px 0 #d1fae5' }}
                  placeholder="Enter quantity"
                />
              </div>
              <button
                onClick={async () => { setShowConfirm(false); await handleOrder(); }}
                disabled={isOrdering}
                className="w-full bg-gradient-to-r from-blue-500 via-pink-400 to-orange-400 text-white font-extrabold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-60 text-lg tracking-wide mb-2"
              >
                {isOrdering ? 'Ordering...' : 'Confirm Order'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="mt-1 text-gray-400 hover:text-gray-700 text-sm underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
