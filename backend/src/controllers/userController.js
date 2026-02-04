const User = require("../models/User");
const StudyLog = require("../models/StudyLog");
const bcrypt = require("bcryptjs");
const Group = require("../models/Group");
const jwt = require("jsonwebtoken");

// GET CURRENT LOGGED-IN USER
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    // We need to populate the group name
    await req.user.populate("group", "name");

    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      group: req.user.group,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// LOGIN + GROUP ASSIGNMENT
// LOGIN + GROUP ASSIGNMENT
const loginUser = async (req, res) => {
  try {
    const { identifier, password, groupName, action } = req.body; // action: 'join' | 'create'

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required" });
    }

    // Find user by username OR email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // --- GROUP LOGIC ---
    let groupDoc = null;

    if (user.group) {
      // SCENARIO 1: User is ALREADY in a group
      if (groupName) {
        return res.status(400).json({
          message:
            "You are already in a group. Leave the group name blank to login.",
        });
      }
      groupDoc = await Group.findById(user.group);
    } else {
      // SCENARIO 2: User is NOT in a group
      if (!groupName) {
        return res
          .status(400)
          .json({ message: "You must join or create a group to continue." });
      }

      if (!action || !["join", "create"].includes(action)) {
        return res
          .status(400)
          .json({ message: "Please specify if you want to Join or Create." });
      }

      // Find group by name
      let group = await Group.findOne({ name: groupName });

      if (action === "create") {
        if (group) {
          return res
            .status(400)
            .json({ message: "Group already exists. Did you mean to join?" });
        }
        // Create new group
        group = await Group.create({
          name: groupName,
          members: [user._id],
        });
      } else if (action === "join") {
        if (!group) {
          return res
            .status(400)
            .json({ message: "Group not found. Did you mean to create it?" });
        }
        // Join existing group
        if (!group.members.includes(user._id)) {
          group.members.push(user._id);
          await group.save();
        }
      }

      // Update user with new group
      user.group = group._id;
      await user.save();
      groupDoc = group;
    }

    // Create JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
      group: groupDoc ? groupDoc.name : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// CREATE user
// SIGNUP (create user)
const createUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (group is null by default)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
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

// LOGOUT
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};
