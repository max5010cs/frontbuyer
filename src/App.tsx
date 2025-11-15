import { useState, useEffect } from 'react';
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
    let telegramUserId = '';
    let telegramLang = 'en';
    if ((window as any).Telegram?.WebApp?.initData) {
      const params = new URLSearchParams((window as any).Telegram.WebApp.initData);
      telegramUserId = params.get('user') || '';
      telegramLang = params.get('lang') || 'en';
      console.log('Telegram user ID from initData:', telegramUserId);
    }
    setAuthLog('Authenticating with Telegram...');
    if (!telegramUserId) {
      setAuthLog('Authentication failed: Telegram user not found.');
      return;
    }
    setAuthLog('Telegram authentication succeeded, loading profile...');
    loadBuyerInfo(telegramUserId, telegramLang);
  }, []);

  useEffect(() => {
    if ((window as any).Telegram?.WebApp) {
      (window as any).Telegram.WebApp.ready();
      (window as any).Telegram.WebApp.expand();
    }
  }, []);

  const loadBuyerInfo = async (userId: string, lang: string) => {
    try {
      setAuthLog('Loading profile from backend...');
      const res = await fetch(`/api/v1/buyer/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, lang })
      });
      const data = await res.json();
      setBuyer(data.profile);
      setAuthLog('Profile loaded, opening app...');
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
