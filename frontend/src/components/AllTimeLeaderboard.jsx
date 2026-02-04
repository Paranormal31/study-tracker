import { useEffect, useState } from "react";
import { getAllTimeLeaderboard } from "../api/api";

function AllTimeLeaderboard() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getAllTimeLeaderboard()
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">🏆 All-Time Leaderboard</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Rank</th>
            <th className="py-2">Name</th>
            <th className="py-2">Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u, i) => (
            <tr key={u.userId} className="border-b">
              <td className="py-2">{i + 1}</td>
              <td className="py-2">{u.username}</td>
              <td className="py-2">{(u.totalMinutes / 60).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllTimeLeaderboard;
