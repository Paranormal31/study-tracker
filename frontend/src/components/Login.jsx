import API from "../api/api";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login States
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [groupName, setGroupName] = useState("");
  const [action, setAction] = useState("join"); // 'join' or 'create'

  // Sign Up States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const payload = {
          identifier,
          password,
        };
        // Only include groupName/action if user provided a group name (implies they are trying to join/create)
        if (groupName.trim()) {
          payload.groupName = groupName;
          payload.action = action;
        }

        const res = await API.post("/users/login", payload);

        login({
          _id: res.data.userId,
          username: res.data.username,
          group: res.data.group,
        });
      } else {
        // --- SIGN UP LOGIC ---
        await API.post("/users", {
          username,
          email,
          password,
          confirmPassword,
        });

        setSuccess("Account created successfully! Please login.");
        setIsLogin(true);
        setIdentifier(email || username);
        setPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-3 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-500 text-sm mb-3 text-center bg-green-100 dark:bg-green-900/30 p-2 rounded">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isLogin ? (
          <>
            <input
              type="text"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            
            <div className="pt-2 border-t dark:border-gray-700">
                <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                    If you are already in a group, leave this blank.
                </p>
                <input
                type="text"
                placeholder="Group Name (Optional for existing users)"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />

                {/* Show Join/Create toggle only if user is typing a group name */}
                {groupName && (
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="action" 
                                value="join" 
                                checked={action === "join"} 
                                onChange={() => setAction("join")}
                            />
                            <span className="text-sm">Join Group</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="action" 
                                value="create" 
                                checked={action === "create"} 
                                onChange={() => setAction("create")}
                            />
                            <span className="text-sm">Create Group</span>
                        </label>
                    </div>
                )}
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            className="text-blue-500 hover:underline font-medium"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
