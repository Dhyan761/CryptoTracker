import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { PriceProvider } from './context/PriceContext';
import { WatchlistProvider } from './context/WatchlistContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider>
        <PriceProvider>
          <WatchlistProvider>
            <App />
          </WatchlistProvider>
        </PriceProvider>
      </ThemeProvider>
  </StrictMode>
);
