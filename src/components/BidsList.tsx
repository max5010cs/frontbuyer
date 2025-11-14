import { useState, useEffect } from 'react';
import { ArrowLeft, Store, Loader2, MapPin } from 'lucide-react';
import { Bid } from '../types';
import { api } from '../services/api';
import { useBuyer } from '../context/BuyerContext';

interface BidsListProps {
  bouquetId: number;
  onBack: () => void;
}

export function BidsList({ bouquetId, onBack }: BidsListProps) {
  const { buyerId } = useBuyer();
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [acceptingBidId, setAcceptingBidId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBids();
    const interval = setInterval(loadBids, 10000);
    return () => clearInterval(interval);
  }, [bouquetId]);

  const loadBids = async () => {
    try {
      const data = await api.getBids(bouquetId);
      setBids(data);
    } catch (error) {
      console.error('Failed to load bids:', error);
      setError('Failed to load bids');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: number) => {
    setAcceptingBidId(bidId);
    try {
      const result = await api.acceptBid(buyerId, bidId);
      setNotification(result.message);
      await loadBids();
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      console.error('Failed to accept bid:', error);
      setNotification('Failed to accept bid. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    } finally {
      setAcceptingBidId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Seller Quotes
        </h1>

        {notification && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg">
            {notification}
          </div>
        )}

        {bids.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg mb-2">
              Waiting for seller quotes...
            </p>
            <p className="text-gray-500 text-sm">
              Sellers will respond with their prices soon. This page refreshes automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid.bid_id}
                className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-200 ${
                  bid.status === 'accepted'
                    ? 'ring-2 ring-emerald-500'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={bid.image_url}
                    alt="Bouquet"
                    className="w-full sm:w-48 h-48 object-cover"
                  />

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Store className="w-5 h-5 text-gray-500" />
                          <h3 className="text-xl font-bold text-gray-900">
                            {bid.seller_name}
                          </h3>
                        </div>

                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                          <span className="text-sm">{bid.seller_address}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600">
                          ${bid.price}
                        </div>
                        {bid.status === 'accepted' && (
                          <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                            Accepted
                          </span>
                        )}
                      </div>
                    </div>

                    {bid.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptBid(bid.bid_id)}
                        disabled={acceptingBidId === bid.bid_id}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                      >
                        {acceptingBidId === bid.bid_id
                          ? 'Accepting...'
                          : 'Accept Quote'}
                      </button>
                    )}

                    {bid.status === 'accepted' && (
                      <p className="text-sm text-gray-600 mt-2">
                        Order confirmed! You will receive pickup details via Telegram.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
