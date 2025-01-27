import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
  };
  description: {
    en: string;
  };
}

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`,
          {
            params: {
              localization: false,
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false,
              sparkline: false,
            },
          }
        );
        setCoin(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!coin) {
    return <div>Coin not found</div>;
  }

  const toggleWatchlist = () => {
    if (!user) {
      alert('Please login to add to watchlist');
      return;
    }
    setIsWatchlisted(!isWatchlisted);
    // Here you would typically update the watchlist in your backend
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={coin.image.large}
            alt={coin.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h1>
            <div className="text-gray-400">
              Rank #{coin.market_cap_rank}
            </div>
          </div>
        </div>
        <button
          onClick={toggleWatchlist}
          className={`p-2 rounded-full ${
            isWatchlisted ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Star className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Price Statistics</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Price</span>
              <span className="font-medium">
                ${coin.market_data.current_price.usd.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h Change</span>
              <span
                className={
                  coin.market_data.price_change_percentage_24h > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {coin.market_data.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h High</span>
              <span>${coin.market_data.high_24h.usd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h Low</span>
              <span>${coin.market_data.low_24h.usd.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Market Stats</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap</span>
              <span>${coin.market_data.market_cap.usd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h Volume</span>
              <span>${coin.market_data.total_volume.usd.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About {coin.name}</h2>
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: coin.description.en }}
        />
      </div>
    </div>
  );
};

export default CoinDetails;