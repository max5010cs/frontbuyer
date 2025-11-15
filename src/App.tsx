import { useState, useEffect } from 'react';
import { api } from './services/api';
import { BuyerProvider, useBuyer } from './context/BuyerContext';
import { Welcome } from './components/Welcome';
import { FlowerFeed } from './components/FlowerFeed';
import { CustomBouquet } from './components/CustomBouquet';
import { BidsList } from './components/BidsList';

type Screen = 'welcome' | 'feed' | 'custom' | 'bids';

function AppContent() {
  const { buyer, setBuyer } = useBuyer();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentBouquetId, setCurrentBouquetId] = useState<number | null>(null);
  const [authLog, setAuthLog] = useState<string>('Authenticating with Telegram...');

  useEffect(() => {
    let initDataRaw = (window as any).Telegram?.WebApp?.initData;
    console.log('Raw Telegram initData:', initDataRaw);
    if (!initDataRaw) {
      setAuthLog('Authentication failed: Telegram initData not found.');
      return;
    }
    setAuthLog('Authenticating with Telegram...');
    // Send raw initData to backend for verification and extraction
    loadBuyerInfo(initDataRaw);
  }, []);

  useEffect(() => {
    if ((window as any).Telegram?.WebApp) {
      (window as any).Telegram.WebApp.ready();
      (window as any).Telegram.WebApp.expand();
    }
  }, []);

  const loadBuyerInfo = async (initData: string) => {
    try {
      setAuthLog('Loading profile from backend...');
      console.log('Authenticating with backend, sending initData:', initData);
      const data = await api.authenticateBuyer(initData);
      console.log('Backend response for buyer authentication:', data);
      if (data.profile) {
        setBuyer(data.profile);
        setAuthLog('Authentication successful, opening app...');
      } else {
        setAuthLog('Authentication failed: user not found.');
      }
    } catch (error) {
      setAuthLog('Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleViewBids = (bouquetId: number) => {
    setCurrentBouquetId(bouquetId);
    setScreen('bids');
  };

  if (!buyer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <div className="text-gray-600">{authLog}</div>
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





