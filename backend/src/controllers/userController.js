import User from "../models/user.js";
import bcrypt from "bcryptjs";

/*
--------------------------------
GET LOGGED IN USER PROFILE
--------------------------------
*/

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve profile",
    });
  }
};

/*
--------------------------------
UPDATE CUSTOMER PROFILE
--------------------------------
*/

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

/*
--------------------------------
CHANGE PASSWORD
--------------------------------
*/

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /* verify current password */

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    /* hash new password */

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Password update failed",
    });
  }
};

/*
--------------------------------
ADMIN: GET ALL CUSTOMERS
--------------------------------
*/

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password");

    res.json({
      totalCustomers: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve customers",
    });
  }
};

/*
--------------------------------
ADMIN: ACTIVATE / DEACTIVATE USER
--------------------------------
*/

export const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /* prevent admin from disabling another admin */

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Cannot modify admin status",
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    res.json({
      message: "User status updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user status",
    });
  }
};
