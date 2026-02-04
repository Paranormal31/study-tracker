import { useState } from "react";
import { createUser } from "../api/api";

function AddUserForm({ onAdded }) {
  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await createUser({ name });
      setName("");
      onAdded();
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-3">➕ Add User</h2>

      <form onSubmit={submit} className="flex gap-2">
        <input
          type="text"
          placeholder="User name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border rounded p-2 bg-white dark:bg-gray-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 rounded"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}

export default AddUserForm;
