const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { getCurrentUser } = require("../controllers/userController");
const {
  getUsers,
  createUser,
  deleteUser,
  logoutUser,
} = require("../controllers/userController");

router.get("/me", authMiddleware, getCurrentUser);
router.get("/", getUsers);
router.post("/", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.delete("/:id", deleteUser);

module.exports = router;
