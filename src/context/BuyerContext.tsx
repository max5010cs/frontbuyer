import { createContext, useContext, useState, ReactNode } from 'react';
import { Buyer } from '../types';

interface BuyerContextType {
  buyer: Buyer | null;
  setBuyer: (buyer: Buyer | null) => void;
  buyerId: string;
  setBuyerId: (id: string) => void;
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export function BuyerProvider({ children }: { children: ReactNode }) {
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [buyerId, setBuyerId] = useState<string>('');

  return (
    <BuyerContext.Provider value={{ buyer, setBuyer, buyerId, setBuyerId }}>
      {children}
    </BuyerContext.Provider>
  );
}

export function useBuyer() {
  const context = useContext(BuyerContext);
  if (!context) {
    throw new Error('useBuyer must be used within BuyerProvider');
  }
  return context;
}
