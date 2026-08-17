const express = require("express");
const router = express.Router();

const EmergencyContact = require("../models/EmergencyContact");
const { authenticate, requireMatchingUser } = require("../middleware/authenticate");
router.use(authenticate);
router.use("/:userId", requireMatchingUser);
// GET all emergency contacts for a user
router.get("/:userId", async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      userId: req.user.uid,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      contacts,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ADD emergency contact
router.post("/:userId", async (req, res) => {
  try {
    const { name, phone, relation } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required.",
      });
    }

    const contact = await EmergencyContact.create({
      userId: req.user.uid,
      name,
      phone,
      relation,
    });

    res.status(201).json({
      success: true,
      contact,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE emergency contact
router.delete("/:userId/:contactId", async (req, res) => {
  try {
    const deleted = await EmergencyContact.findOneAndDelete({
      _id: req.params.contactId,
      userId: req.user.uid,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
