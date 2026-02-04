import { useState } from "react";
import { saveStudyLog } from "../api/api";

function StudyLogForm({ onSaved }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [minutes, setMinutes] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await saveStudyLog({ date, minutes: Number(minutes) });
    setMinutes("");
    if (onSaved) onSaved();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">➕ Log Study Time</h2>

      <form className="grid gap-4" onSubmit={submit}>
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
