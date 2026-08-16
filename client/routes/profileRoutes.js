const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");
const { authenticate, requireMatchingUser } = require("../middleware/authenticate");

router.use(authenticate);

// Create Profile (supports both POST / and POST /:userId)
router.post("/", requireMatchingUser, createProfile);
router.post("/:userId", requireMatchingUser, createProfile);

// Get Profile (supports both GET /:userId and GET /)
router.get("/:userId", requireMatchingUser, getProfile);
router.get("/", requireMatchingUser, getProfile);

// Update Profile (supports both PUT /:userId and PUT /)
router.put("/:userId", requireMatchingUser, updateProfile);
router.put("/", requireMatchingUser, updateProfile);

// Delete Profile
router.delete("/:userId", requireMatchingUser, deleteProfile);
router.delete("/", requireMatchingUser, deleteProfile);

module.exports = router;
