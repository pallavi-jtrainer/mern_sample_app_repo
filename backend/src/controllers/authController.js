import User from "../models/user.js";
import BlacklistedToken from "../models/BlackListedToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/*
--------------------------------
REGISTER USER
--------------------------------
*/
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

/*
--------------------------------
LOGIN USER
--------------------------------
*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};

/*
--------------------------------
LOGOUT USER
TOKEN BLACKLISTING
--------------------------------
*/
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "Token required",
      });
    }

    /* store token in blacklist */

    await BlacklistedToken.create({
      token,
    });

    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed",
    });
  }
};
