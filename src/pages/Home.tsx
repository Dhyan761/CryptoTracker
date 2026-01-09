import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { usePrices } from '../context/PriceContext';
import Recommendations from '../components/Recommendations';

const Home = () => {
  const { coins, loading } = usePrices();
  const [search, setSearch] = useState('');

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
          <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
          <span>Top 100</span>
        </div>
      </div>

      <Recommendations />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-800">
              <th className="px-6 py-3 rounded-tl-lg">#</th>
              <th className="px-6 py-3">Coin</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">24h</th>
              <th className="px-6 py-3 rounded-tr-lg">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin, index) => (
              <tr
                key={coin.id}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/coin/${coin.id}`}
                    className="flex items-center space-x-2 hover:text-blue-500"
                  >
                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-gray-400 uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`flex items-center ${
                      coin.price_change_percentage_24h > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {coin.price_change_percentage_24h > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  ${coin.market_cap.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;