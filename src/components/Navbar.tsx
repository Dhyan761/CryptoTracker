import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Star, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginButton from './LoginButton';

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">CryptoTracker</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2">
              Cryptocurrencies
            </Link>
            {user && (
              <Link to="/watchlist" className="text-gray-300 hover:text-white px-3 py-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Watchlist</span>
                </div>
              </Link>
            )}
            <LoginButton />
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link
              to="/"
              className="block text-gray-300 hover:text-white px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Cryptocurrencies
            </Link>
            {user && (
              <Link
                to="/watchlist"
                className="block text-gray-300 hover:text-white px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Watchlist</span>
                </div>
              </Link>
            )}
            <div className="px-3 py-2">
              <LoginButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;