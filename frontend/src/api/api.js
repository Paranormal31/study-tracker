import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// MONTHLY CUMULATIVE (PER USER)
export const getMonthlyCumulativeUsersGraph = (from, to) =>
  API.get("/graphs/monthly-cumulative", {
    params: { from, to },
  });

// ALL USERS GRAPH
export const getAllUsersGraph = () => API.get("/graphs/all-users");

// CREATE USER
export const createUser = (data) => API.post("/users", data);

// DELETE USER
export const deleteUser = (id) => API.delete(`/users/${id}`);

// USERS
export const getUsers = () => API.get("/users");

// LEADERBOARD
export const getLeaderboard = (type) =>
  API.get(`/leaderboard${type ? `?type=${type}` : ""}`);

// SINGLE USER GRAPH (if still used anywhere)
export const getStudyGraph = (userId, type) =>
  API.get(`/graphs/study-time?userId=${userId}&type=${type}`);

// STUDY LOG
export const saveStudyLog = (data) => API.post("/study-logs", data);

export default API;
