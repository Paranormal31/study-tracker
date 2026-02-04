import { useEffect, useState } from "react";
import {
  getStudyLogs,
  deleteStudyLogEntry,
  updateStudyLogEntry,
} from "../api/api";
import { useAuth } from "../context/AuthContext";

const DailyStudyLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editMinutes, setEditMinutes] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true); // Only show full loading on first page
      
      const res = await getStudyLogs(pageNum, 10);
      
      if (reset) {
        setLogs(res.data);
      } else {
        setLogs((prev) => [...prev, ...res.data]);
      }

      // If we got fewer than 10 logs, we've reached the end
      if (res.data.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLogs(nextPage, false);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchLogs(1, true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteStudyLogEntry(id);
      setLogs(logs.filter((log) => log._id !== id));
    } catch (err) {
      alert("Failed to delete log");
    }
  };

  const startEdit = (log) => {
    setEditingId(log._id);
    setEditMinutes(log.minutes);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditMinutes("");
  };

  const saveEdit = async (id) => {
    try {
      const res = await updateStudyLogEntry(id, { minutes: Number(editMinutes) });
      setLogs(logs.map((log) => (log._id === id ? res.data : log)));
      setEditingId(null);
    } catch (err) {
      alert("Failed to update log");
    }
  };

  if (loading && page === 1) return <p>Loading logs...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📅 All Study Logs</h2>
        <button
          onClick={handleRefresh}
          className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700 text-gray-500 text-sm">
              <th className="py-2">Date</th>
              <th className="py-2">User</th>
              <th className="py-2">Minutes</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3">
                  {new Date(log.date).toLocaleDateString()}
                </td>
                <td className="py-3 font-medium">
                  {log.user?.username || "Unknown"}
                </td>
                <td className="py-3">
                  {editingId === log._id ? (
                    <input
                      type="number"
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(e.target.value)}
                      className="w-20 p-1 border rounded dark:bg-gray-600"
                    />
                  ) : (
                    <span>{log.minutes} min</span>
                  )}
                </td>
                <td className="py-3 text-right space-x-2">
                  {editingId === log._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(log._id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(log)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(log._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No study logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && logs.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={handleLoadMore}
            className="text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 px-4 py-2 rounded font-medium transition"
          >
            Load More Logs
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyStudyLogs;
