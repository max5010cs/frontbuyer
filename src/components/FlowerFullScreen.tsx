import { useState } from 'react';
import { X, Heart, ThumbsDown, ShoppingCart, MessageCircle } from 'lucide-react';
import { Flower } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

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
          <div className="absolute right-4 bottom-32 flex flex-col gap-2 pointer-events-auto items-end">
            <button className="bg-white/30 p-2 rounded-full hover:bg-white/60 transition-colors shadow-lg">
              <Heart className="w-5 h-5 text-red-500" />
            </button>
            <button className="bg-white/30 p-2 rounded-full hover:bg-white/60 transition-colors shadow-lg">
              <ThumbsDown className="w-5 h-5 text-gray-200" />
            </button>
            <button className="bg-white/30 p-2 rounded-full hover:bg-white/60 transition-colors shadow-lg">
              <MessageCircle className="w-5 h-5 text-blue-400" />
            </button>
            <button
              onClick={handleOrder}
              disabled={isOrdering}
              className="mt-3 px-5 py-2 bg-emerald-500 text-white font-bold rounded-full shadow-lg transition-all duration-300 animate-pulse focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:bg-emerald-600 text-base"
              style={{ boxShadow: '0 0 16px 2px #34d399, 0 0 32px 4px #34d39955' }}
            >
              {isOrdering ? 'Ordering...' : 'Order'}
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
      </motion.div>
    </AnimatePresence>
  );
}
