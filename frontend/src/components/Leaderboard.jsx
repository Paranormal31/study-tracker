import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/api";
import { deleteUser } from "../api/api";

function Leaderboard() {
  const [data, setData] = useState([]);
  const [type, setType] = useState("daily");
  useEffect(() => {
    getLeaderboard(type).then((res) => setData(res.data));
  }, [type]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">🏆 Leaderboard</h2>
        <select
          className="border rounded px-2 py-1 bg-white dark:bg-gray-700"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <ul className="space-y-2">
        {data.map((u, i) => (
          <li
            key={u.userId}
            className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded"
          >
            <span className="font-medium">
              #{i + 1} {u.username}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {(u.totalMinutes / 60).toFixed(1)} hrs
              </span>

              <button
                onClick={async () => {
                  if (!confirm(`Delete ${u.username}? This cannot be undone.`))
                    return;
                  await deleteUser(u.userId);
                  window.location.reload();
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
