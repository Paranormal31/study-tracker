import { useState } from "react";
import Leaderboard from "./components/Leaderboard";
import StudyLogForm from "./components/StudyLogForm";
import DarkModeToggle from "./components/DarkModeToggle";
import AddUserForm from "./components/AddUserForm";
import AllUsersGraph from "./components/AllUsersGraph";
import MonthlyCumulativeUsersGraph from "./components/MonthlyCumulativeUsersGraph"; // ✅ REQUIRED

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">📚 Study Tracker</h1>
          <DarkModeToggle />
        </div>

        <AddUserForm onAdded={() => setRefreshKey((k) => k + 1)} />
        <StudyLogForm onSaved={() => setRefreshKey((k) => k + 1)} />
        <Leaderboard key={refreshKey} />

        <AllUsersGraph key={`all-${refreshKey}`} />

        <MonthlyCumulativeUsersGraph key={`month-${refreshKey}`} />
      </div>
    </div>
  );
}

export default App;
