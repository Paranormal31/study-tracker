import { useEffect, useState } from "react";
import { getStudyGraph } from "../api/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const StudyGraph = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStudyGraph();
        // res.data = { users: [...], logs: [...] }
        const { users, logs } = res.data;

        // Process data: Calculate total minutes per user
        const processedData = users.map((u) => {
          // logs from getStudyGraph are aggregated by user+date, so we filter by user and sum
          const userLogs = logs.filter(
            (l) => l._id.user === u._id || l._id.user === u._id.toString(),
          );
          const totalMinutes = userLogs.reduce(
            (sum, log) => sum + log.totalMinutes,
            0,
          );
          return {
            username: u.username,
            totalMinutes,
          };
        });

        // Prepare Chart Data
        setChartData({
          labels: processedData.map((d) => d.username),
          datasets: [
            {
              label: "Total Study Minutes",
              data: processedData.map((d) => d.totalMinutes),
              backgroundColor: "rgba(79, 70, 229, 0.6)", // Indigo-600
              borderColor: "rgba(79, 70, 229, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch group study graph", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading group study graph...</p>;
  if (!chartData) return <p>No data available</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">
        📊 Group Study Time (Per User)
      </h2>
      <div className="h-64">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Minutes" },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default StudyGraph;
