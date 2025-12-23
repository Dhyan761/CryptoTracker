import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { usePrices } from '../context/PriceContext';

const Watchlist = () => {
  const { user } = useAuth();
  const { ids, remove } = useWatchlist();
  const { coins, loading } = usePrices();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const watchedCoins = coins.filter((c) => ids.includes(c.id));

  return (
    <div>
      <div className="flex items-center space-x-2 mb-8">
        <Star className="h-6 w-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">Your Watchlist</h1>
      </div>

      {ids.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
          <p className="text-gray-400">Start adding cryptocurrencies to track their prices</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-800">
                <th className="px-6 py-3">Coin</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">24h</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4">Loading...</td>
                </tr>
              ) : (
                ids.map((id) => {
                  const coin = coins.find((c) => c.id === id);
                  if (!coin) {
                    return (
                      <tr key={id} className="border-b border-gray-800">
                        <td className="px-6 py-4">{id}</td>
                        <td className="px-6 py-4">—</td>
                        <td className="px-6 py-4">—</td>
                        <td className="px-6 py-4">
                          <button onClick={() => remove(id)} className="text-sm text-red-400">Remove</button>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={coin.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/coin/${coin.id}`} className="flex items-center space-x-2 hover:text-blue-500">
                          <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                          <div>
                            <div className="font-medium">{coin.name}</div>
                            <div className="text-sm text-gray-400 uppercase">{coin.symbol}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">${coin.current_price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {coin.price_change_percentage_24h > 0 ? <span>▲</span> : <span>▼</span>}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => remove(coin.id)} className="text-sm text-red-400">Remove</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Watchlist;