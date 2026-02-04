import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getMonthlyCumulativeUsersGraph } from "../api/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#eab308"];

function MonthlyCumulativeUsersGraph() {
  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  // 🔹 Fetch graph data
  const fetchGraph = () => {
    setLoading(true);
    getMonthlyCumulativeUsersGraph(from, to)
      .then((res) => {
        setGraph(res.data);
      })
      .catch((err) => {
        console.error("Graph fetch error:", err);
        setGraph(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 🔹 Initial load
  useEffect(() => {
    fetchGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Safety guard (prevents white screen)
  if (loading || !graph || !graph.dates || !graph.users) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        Loading monthly cumulative graph…
      </div>
    );
  }

  const chartData = {
    labels: graph.dates,
    datasets: graph.users.map((u, i) => ({
      label: u.name,
      data: u.data.map((m) => m / 60), // minutes → hours
      borderColor: COLORS[i % COLORS.length],
      backgroundColor: "transparent",
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)} hrs`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Study Hours (Cumulative)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">
        📅 Monthly Cumulative Study (Per User)
      </h2>

      {/* Date controls */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="text-sm block mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 rounded border dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 rounded border dark:bg-gray-700"
          />
        </div>

        <button
          onClick={fetchGraph}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </div>

      <Line data={chartData} options={options} />
    </div>
  );
}

export default MonthlyCumulativeUsersGraph;
