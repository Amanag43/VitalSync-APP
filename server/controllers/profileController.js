const UserProfile = require("../models/UserProfile");

const createProfile = async (req, res) => {
  try {
    const { fullName, email, phone, gender, dob, photo, bloodGroup, height, weight, allergies, diseases, medications } = req.body;
    const targetUserId = req.params.userId || req.user.uid;

    const profile = await UserProfile.findOneAndUpdate(
      { $or: [{ userId: targetUserId }, { userId: req.user.uid }] },
      { userId: targetUserId, fullName, email, phone, gender, dob, photo, bloodGroup, height, weight, allergies, diseases, medications },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(201).json({ success: true, message: "Profile created successfully", profile });
  } catch (error) {
    console.error("Error creating profile:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.user.uid;

    const profile = await UserProfile.findOne({
      $or: [{ userId: targetUserId }, { userId: req.user.uid }, { userId: "user123" }],
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.user.uid;

    const updateData = { ...req.body };
    delete updateData.userId;

    const profile = await UserProfile.findOneAndUpdate(
      { $or: [{ userId: targetUserId }, { userId: req.user.uid }] },
      { ...updateData, userId: targetUserId },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("[Profile Controller] Update Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.user.uid;

    const profile = await UserProfile.findOneAndDelete({
      $or: [{ userId: targetUserId }, { userId: req.user.uid }],
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    return res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createProfile, getProfile, updateProfile, deleteProfile };
