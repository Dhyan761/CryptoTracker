import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  id: string;
  initialDays?: number; // how many days of history
}

import { usePrices } from '../context/PriceContext';

const PriceChart: React.FC<Props> = ({ id, initialDays = 30 }) => {
  const [days, setDays] = useState<number>(initialDays);
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const lastAppended = useRef<number | null>(null);
  const { coins } = usePrices();

  // fetch historical data when id or days changes
  useEffect(() => {
    let mounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
          params: { vs_currency: 'usd', days },
        });
        if (!mounted) return;
        const data: [number, number][] = res.data.prices || [];
        setLabels(data.map((d) => new Date(d[0]).toLocaleString()));
        setPrices(data.map((d) => d[1]));
        lastAppended.current = data.length ? data[data.length - 1][1] : null;
      } catch (e) {
        console.error('Error fetching chart:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      mounted = false;
    };
  }, [id, days]);

  // append live price points when PriceProvider updates
  useEffect(() => {
    const coin = coins.find((c) => c.id === id);
    if (!coin) return;
    const latest = coin.current_price;
    if (lastAppended.current == null || latest !== lastAppended.current) {
      // append
      setPrices((p) => {
        const next = [...p, latest];
        // keep dataset reasonably sized
        if (next.length > 1000) next.shift();
        return next;
      });
      setLabels((l) => [...l, new Date().toLocaleTimeString()]);
      lastAppended.current = latest;
    }
    // depend on coins so this runs whenever the provider updates
  }, [coins, id]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: `${id} price (USD)`,
          data: prices,
          borderColor: 'rgba(59,130,246,1)',
          backgroundColor: 'rgba(59,130,246,0.2)',
          tension: 0.2,
          pointRadius: 0,
        },
      ],
    }),
    [id, labels, prices]
  );

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { maxTicksLimit: 8, color: '#9CA3AF' } },
      y: { ticks: { color: '#9CA3AF' } },
    },
  }), []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex space-x-2">
          {[1, 7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded ${d === days ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {d}d
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-400">Live updates appended every 10s</div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">Loading chart...</div>
      ) : (
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default PriceChart;
