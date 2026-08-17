const express = require("express");
const router  = express.Router();
const { getAiInsights } = require("../controllers/aiController");
const { authenticate, requireMatchingUser } = require("../middleware/authenticate");

router.use(authenticate);

router.get("/insights/:userId", requireMatchingUser, getAiInsights);

module.exports = router;
