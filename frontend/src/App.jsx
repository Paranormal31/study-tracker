import { useAuth } from "./context/AuthContext";
import { deleteUser } from "./api/api";
import Login from "./components/Login";
import Leaderboard from "./components/Leaderboard";
import AllTimeLeaderboard from "./components/AllTimeLeaderboard";
import StudyLogForm from "./components/StudyLogForm";
import MonthlyCumulativeUsersGraph from "./components/MonthlyCumulativeUsersGraph";
import DarkModeToggle from "./components/DarkModeToggle";
import DailyStudyLogs from "./components/DailyStudyLogs";

function App() {
  const { user, loading, logout } = useAuth();

  // While checking /users/me
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Not logged in → show Login page
  if (!user) {
    return <Login />;
  }

  // Logged in → show Dashboard
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold">
          Study Tracker — {user.username} (Group: {user.group?.name || user.group || "No Group"})
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (
                confirm(
                  "Are you sure you want to delete your account? This action cannot be undone.",
                )
              ) {
                await deleteUser(user._id);
                logout(); // Clear session and redirect to login
              }
            }}
            className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 text-sm font-bold"
          >
            Delete Account
          </button>
          <DarkModeToggle />
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 space-y-8">
        {/* Add study log */}
        <StudyLogForm />

        {/* Leaderboards */}
        <Leaderboard />
        <AllTimeLeaderboard />

        {/* Graphs (group-based) */}
        <MonthlyCumulativeUsersGraph />
        
        {/* Daily Logs Management */}
        <DailyStudyLogs />
      </main>
    </div>
  );
}

export default App;
