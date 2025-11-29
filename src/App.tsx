import { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { BuyerProvider, useBuyer } from './context/BuyerContext';
import { Welcome } from './components/Welcome';
import { FlowerFeed } from './components/FlowerFeed';
import { CustomBouquet } from './components/CustomBouquet';
import { BidsList } from './components/BidsList';
import { Loader2 } from 'lucide-react'; // Import Loader2 for loading state

type Screen = 'welcome' | 'feed' | 'custom' | 'bids';

function AppContent() {
  const { buyer, setBuyer } = useBuyer();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentBouquetId, setCurrentBouquetId] = useState<number | null>(null);
  const [authLog, setAuthLog] = useState<string>('Initializing...');

  const loadBuyerInfo = useCallback(async (encryptedId: string) => {
    try {
      console.log('[Auth Step 3] Sending authentication token to backend...');
      setAuthLog('Verifying identity with server...');
      const data = await api.authenticateBuyer(encryptedId);
      console.log('[Auth Step 4] Received response from backend:', data);

      if (data.profile) {
        setBuyer(data.profile);
        setAuthLog('Authentication successful. Welcome!');
        console.log('Authentication successful. Buyer profile:', data.profile);
      } else {
        const errorMessage = `Authentication failed: ${data.message || 'User not found.'}`;
        setAuthLog(errorMessage);
        console.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown network or server error.');
      setAuthLog(errorMessage);
      console.error('Error during authentication API call:', error);
    }
  }, [setBuyer]);

  useEffect(() => {
    console.log('[Auth Step 1] Starting authentication process...');
    setAuthLog('Reading authentication token...');
    
    const params = new URLSearchParams(window.location.search);
    const encryptedId = params.get('auth');

    if (!encryptedId) {
      const errorMessage = 'Authentication failed: No auth token found in URL.';
      setAuthLog(errorMessage);
      console.error(errorMessage);
      return;
    }

    console.log('[Auth Step 2] Found encrypted auth token:', encryptedId);
    loadBuyerInfo(encryptedId);
  }, [loadBuyerInfo]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      try {
        console.log('Initializing Telegram WebApp...');
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        console.log('Telegram WebApp ready and expanded.');
      } catch (e) {
        const errorMessage = 'Error initializing Telegram WebApp.';
        setAuthLog(errorMessage);
        console.error(errorMessage, e);
      }
    } else {
      console.warn('Telegram WebApp not found. Running in development mode.');
      // In dev mode, you might want to bypass auth or use a mock token.
      // For this test, we will show an error if no token is in the URL.
    }
  }, []);

  const handleViewBids = (bouquetId: number) => {
    setCurrentBouquetId(bouquetId);
    setScreen('bids');
  };

  if (!buyer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-flower-pink via-flower-blue to-flower-green">
        <div className="relative flex items-center justify-center mb-4">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin-slow" />
          <div className="absolute w-20 h-20 border-4 border-emerald-300 rounded-full animate-ping-slow"></div>
        </div>
        <div className="text-gray-700 text-lg font-medium animate-pulse">{authLog}</div>
      </div>
    );
  }

  return (
    <>
      {screen === 'welcome' && (
        <Welcome
          buyerName={buyer.name}
          onStartShopping={() => setScreen('feed')}
        />
      )}

      {screen === 'feed' && (
        <FlowerFeed onCreateCustom={() => setScreen('custom')} />
      )}

      {screen === 'custom' && (
        <CustomBouquet
          onBack={() => setScreen('feed')}
          onViewBids={handleViewBids}
        />
      )}

      {screen === 'bids' && currentBouquetId && (
        <BidsList
          bouquetId={currentBouquetId}
          onBack={() => setScreen('custom')}
        />
      )}
    </>
  );
}

function App() {
  return (
    <BuyerProvider>
      <AppContent />
    </BuyerProvider>
  );
}

export default App;
