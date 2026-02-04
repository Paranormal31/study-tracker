import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getAllUsersGraph } from "../api/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AllUsersGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchGroupGraph = async () => {
      try {
        const res = await getAllUsersGraph();

        // Fix: API returns { dates: [], users: [] }, not just []
        const users = res.data.users || [];
        
        const labels = users.map((u) => u.name || u.username || "User");
        // Backend returns 'data' property in user object for the graph values if I recall correctly from graphController
        // Let's re-verify graphController mapping: return { ... data: [...] }
        // Wait, AllUsersGraph was mapping u.totalMinutes. 
        // Logic in AllUsersGraph BEFORE: const values = res.data.map((u) => u.totalMinutes);
        // Logic in graphController getAllUsersStudyGraph: returns { userId, name, data: [1, 2, 0...] } -> array of minutes for each date.
        // Wait, AllUsersGraph seems to be wanting a BAR chart of TOTAL minutes? 
        // But graphController returns a DATASET for a multi-line or stacked bar over time?
        // graphController.js Line 84: data = dates.map(...) -> returns array of minutes per day.
        
        // If AllUsersGraph wants TOTAL minutes, it needs to sum them up or use a different endpoint.
        // Line 11 says: import { getAllUsersGraph } from "../api/api";
        // api.js Line 18: export const getAllUsersGraph = () => API.get("/graphs/all-users");
        // routes? 
        // I haven't seen routes.
        
        // Assuming graphController.getAllUsersStudyGraph is mapped to /graphs/all-users.
        // It returns { dates, users: [ { name, data: [10, 20] } ] }
        
        // Original AllUsersGraph code:
        // const values = res.data.map((u) => u.totalMinutes);
        
        // It seems AllUsersGraph EXPECTS a simple list of users with total time.
        // But the endpoint returns time series.
        
        // I should sum the data array to get totalMinutes for the bar chart.
        const values = users.map((u) => {
            if (u.totalMinutes) return u.totalMinutes; // validation if backend changes
            if (Array.isArray(u.data)) return u.data.reduce((a, b) => a + b, 0);
            return 0;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Study Minutes",
              data: values,
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              borderRadius: 6,
            },
          ],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load group study graph");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupGraph();
  }, []);

  if (loading) return <p className="text-center">Loading group graph...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 border rounded dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        Group Study Time (All Users)
      </h2>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Minutes",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default AllUsersGraph;
