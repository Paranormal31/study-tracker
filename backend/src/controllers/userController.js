const User = require("../models/User");
const StudyLog = require("../models/StudyLog");

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// CREATE user
const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.create({ name });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to create user" });
  }
};

// DELETE user + logs
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await StudyLog.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
};
