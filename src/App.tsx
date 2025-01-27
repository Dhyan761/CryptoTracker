import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CoinDetails from './pages/CoinDetails';
import Watchlist from './pages/Watchlist';
import { AuthProvider } from './context/AuthContext';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Required</h1>
          <p className="text-gray-400">
            Please set your Google OAuth client ID in the .env file:
          </p>
          <code className="block bg-gray-700 p-4 rounded mt-4 text-sm">
            VITE_GOOGLE_CLIENT_ID=your_client_id_here
          </code>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/coin/:id" element={<CoinDetails />} />
                <Route path="/watchlist" element={<Watchlist />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;