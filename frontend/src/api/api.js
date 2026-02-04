import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 👈 REQUIRED for JWT cookies
});

//ALL TIME LEADERBOARD TEXT
export const getAllTimeLeaderboard = () => API.get("/leaderboard/all-time");

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
// GROUP STUDY GRAPH
export const getStudyGraph = (type) =>
  API.get("/graphs/study-time", {
    params: { type },
  });

// STUDY LOG
export const saveStudyLog = (data) => API.post("/study-logs", data);
export const getStudyLogs = (page = 1, limit = 10) =>
  API.get("/study-logs", { params: { page, limit } });
export const updateStudyLogEntry = (id, data) =>
  API.put(`/study-logs/${id}`, data);
export const deleteStudyLogEntry = (id) => API.delete(`/study-logs/${id}`);

export default API;
