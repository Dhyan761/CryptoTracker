import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

interface PriceContextType {
  coins: Coin[];
  loading: boolean;
  error?: string;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    const fetchCoins = async () => {
      try {
        const resp = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        });
        if (!mounted) return;
        setCoins(resp.data);
        setLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        console.error('PriceProvider fetch error', err);
        setError(err?.message || 'Error fetching prices');
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 10000); // poll every 10s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <PriceContext.Provider value={{ coins, loading, error }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrices = () => {
  const ctx = useContext(PriceContext);
  if (!ctx) throw new Error('usePrices must be used within PriceProvider');
  return ctx;
};

export default PriceContext;
