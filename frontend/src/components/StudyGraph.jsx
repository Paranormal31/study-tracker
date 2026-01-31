import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getStudyGraph } from "../api/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ FULL registration (VERY IMPORTANT)
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

function StudyGraph({ userId }) {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getStudyGraph(userId, "weekly")
      .then((res) => {
        setGraphData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Graph error:", err);
        setGraphData([]);
        setLoading(false);
      });
  }, [userId]);

  // 🛑 Prevent chart render with empty data
  if (loading) return <p>Loading graph...</p>;
  if (!graphData || graphData.length === 0)
    return <p>No study data available for this user.</p>;

  const data = {
    labels: graphData.map((d) => d.date),
    datasets: [
      {
        label: "Study Hours",
        data: graphData.map((d) => d.totalMinutes / 60),
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">📈 Weekly Study Progress</h2>
      <Line data={data} />
    </div>
  );
}

export default StudyGraph;
