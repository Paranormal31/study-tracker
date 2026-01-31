import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getAllUsersGraph } from "../api/api";

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

const colors = [
  "#4F46E5",
  "#16A34A",
  "#DC2626",
  "#CA8A04",
  "#9333EA",
  "#0891B2",
];

function AllUsersGraph() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAllUsersGraph().then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading graph...</p>;

  const chartData = {
    labels: data.dates,
    datasets: data.users.map((u, i) => ({
      label: u.name,
      data: u.data.map((m) => m / 60), // hours
      borderColor: [
        "#ef4444", // red
        "#3b82f6", // blue
        "#22c55e", // green
        "#eab308", // yellow
        "#a855f7", // purple
      ][i % 5],
      backgroundColor: "transparent",
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.4,
    })),
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Study Hours",
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
        📊 All Users Study Comparison
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default AllUsersGraph;
