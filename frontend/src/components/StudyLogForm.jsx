import { useEffect, useState } from "react";
import { getUsers, saveStudyLog } from "../api/api";

function StudyLogForm({ onSaved }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [minutes, setMinutes] = useState("");

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res.data);
      if (res.data.length > 0) setUserId(res.data[0]._id);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await saveStudyLog({ userId, date, minutes: Number(minutes) });
    setMinutes("");
    onSaved();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">➕ Log Study Time</h2>

      <form className="grid gap-4" onSubmit={submit}>
        <select
          className="border rounded p-2 bg-white dark:bg-gray-700"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border rounded p-2 bg-white dark:bg-gray-700"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="number"
          className="border rounded p-2 bg-white dark:bg-gray-700"
          placeholder="Minutes studied"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
          Save Study Log
        </button>
      </form>
    </div>
  );
}

export default StudyLogForm;
