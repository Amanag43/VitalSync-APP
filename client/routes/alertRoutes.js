const express = require("express");
const router = express.Router();
const {
  createAlert,
  getAlertsByUser,
  resolveAlert,
} = require("../controllers/alertController");
const { authenticate, requireMatchingUser } = require("../middleware/authenticate");
router.use(authenticate);
router.post("/", requireMatchingUser, createAlert);
router.get("/:userId", requireMatchingUser, getAlertsByUser);

router.patch("/:id/resolve", resolveAlert);

module.exports = router;
