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

export interface Recommendation {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  score: number;
  action: 'Buy' | 'Hold' | 'Take Profit';
  reason: string;
}

interface PriceContextType {
  coins: Coin[];
  loading: boolean;
  error?: string;
  recommendations: Recommendation[];
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

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
        // compute simple recommendations whenever we fetch new data
        try {
          const computeRecommendations = (coinsData: Coin[]) => {
            // Score favors larger market caps and larger recent drops (dip-buy strategy)
            const scored = coinsData.map((c) => {
              const dropFactor = -Math.min(c.price_change_percentage_24h ?? 0, 100); // positive when dropped
              const capFactor = Math.log10(Math.max(c.market_cap, 1));
              const score = dropFactor * 0.7 + (capFactor - 5) * 0.3; // heuristic

              let action: Recommendation['action'] = 'Hold';
              let reason = 'Neutral movement';
              if ((c.price_change_percentage_24h ?? 0) <= -5) {
                action = 'Buy';
                reason = `Dropped ${c.price_change_percentage_24h.toFixed(2)}% in 24h — possible dip`;
              } else if ((c.price_change_percentage_24h ?? 0) >= 8) {
                action = 'Take Profit';
                reason = `Up ${c.price_change_percentage_24h.toFixed(2)}% in 24h — strong rally`;
              } else {
                reason = `24h change ${c.price_change_percentage_24h?.toFixed(2)}%`;
              }

              return {
                id: c.id,
                symbol: c.symbol,
                name: c.name,
                current_price: c.current_price,
                score,
                action,
                reason,
              } as Recommendation;
            });

            // sort by score descending and take top 6
            const top = scored.sort((a, b) => b.score - a.score).slice(0, 6);
            return top;
          };

          const recs = computeRecommendations(resp.data);
          setRecommendations(recs);
        } catch (err) {
          console.warn('Recommendation computation failed', err);
        }
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
    <PriceContext.Provider value={{ coins, loading, error, recommendations }}>
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
