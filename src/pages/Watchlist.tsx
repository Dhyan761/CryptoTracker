import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const Watchlist = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-8">
        <Star className="h-6 w-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">Your Watchlist</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
        <p className="text-gray-400">
          Start adding cryptocurrencies to track their prices
        </p>
      </div>
    </div>
  );
};

export default Watchlist;