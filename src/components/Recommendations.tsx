import React from 'react';
import { usePrices } from '../context/PriceContext';
import { useWatchlist } from '../context/WatchlistContext';

const Recommendations: React.FC = () => {
  const { recommendations } = usePrices();
  const { has, toggle } = useWatchlist();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Investment Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {recommendations.map((r) => (
          <div
            key={r.id}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.name} — {r.symbol.toUpperCase()}</div>
                <div className="text-sm text-gray-400">${r.current_price.toLocaleString()}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    r.action === 'Buy'
                      ? 'bg-green-900 text-green-300'
                      : r.action === 'Take Profit'
                      ? 'bg-yellow-900 text-yellow-300'
                      : 'bg-gray-900 text-gray-300'
                  }`}
                >
                  {r.action}
                </span>
                <button
                  onClick={() => toggle(r.id)}
                  className={`ml-2 px-2 py-1 rounded text-xs font-medium focus:outline-none ${
                    has(r.id) ? 'bg-red-700 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  {has(r.id) ? 'Remove' : 'Watch'}
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">{r.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
