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
  const { buyer, setBuyer, setBuyerId } = useBuyer();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentBouquetId, setCurrentBouquetId] = useState<number | null>(null);
  const [authLog, setAuthLog] = useState<string>('Authenticating with Telegram...');

  // Define loadBuyerInfo using useCallback before the useEffect that uses it
  const loadBuyerInfo = useCallback(async (encryptedId: string) => {
    try {
      setAuthLog('Loading profile from backend...');
      const data = await api.authenticateBuyer(encryptedId);
      if (data.profile) {
        setBuyer(data.profile);
        setBuyerId(data.profile.user_id);
        setAuthLog('Authentication successful, opening app...');
      } else {
        setAuthLog('Authentication failed: user not found.');
      }
    } catch (error) {
      setAuthLog('Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [setBuyer, setBuyerId, setAuthLog]); // Dependencies for useCallback

  useEffect(() => {
    // Read encrypted user_id from URL param  "auth"
    const params = new URLSearchParams(window.location.search);
    const encryptedId = params.get('auth');
    if (!encryptedId) {
      setAuthLog('Authentication failed: No auth token found in URL.');
      return;
    }
    setAuthLog('Authenticating with Telegram...');
    loadBuyerInfo(encryptedId);
  }, [loadBuyerInfo, setAuthLog]); // Dependencies for useEffect

  useEffect(() => {
    console.log('AppContent mounted. Checking Telegram WebApp...');
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        console.log('Telegram WebApp ready and expanded.');
      } catch (e) {
        console.error('Error initializing Telegram WebApp:', e);
        // Optionally, display an error message to the user
        setAuthLog('Error initializing Telegram app. Please try again.');
      }
    } else {
      console.log('Telegram WebApp not found on window object.');
      // For development outside Telegram, we might want to bypass auth
      // setAuthLog('Telegram WebApp not detected. Proceeding without Telegram auth (dev mode).');
      // loadBuyerInfo('some_dev_encrypted_id'); // Uncomment for local dev without Telegram
    }
  }, [setAuthLog]); // setAuthLog is a dependency here

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
