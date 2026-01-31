import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getMonthlyTotalGraph } from "../api/api";

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

function MonthlyTotalGraph() {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    getMonthlyTotalGraph().then((res) => setGraph(res.data));
  }, []);

  if (!graph) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        Loading monthly graph...
      </div>
    );
  }

  const chartData = {
    labels: graph.dates,
    datasets: [
      {
        label: "Total Study Hours (All Users)",
        data: graph.data.map((m) => m / 60),
        borderColor: "#10B981", // emerald
        backgroundColor: "#10B981",
        borderWidth: 3,
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">
        📅 Total Study Time (This Month)
      </h2>
      <Line data={chartData} />
    </div>
  );
}

export default MonthlyTotalGraph;
