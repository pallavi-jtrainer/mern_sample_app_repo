/* this script is used to create an admin user in the database. It should be run only once when setting up the application for the first time. Please remove this script from the production version once an admin is created */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/User.js";

// dotenv.config({ path: "../.env" });

/*
--------------------------------
CREATE ADMIN FUNCTION
--------------------------------
*/

const createAdmin = async () => {
  try {
    const adminEmail = "admin@shop.com";

    /* check if admin exists */

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    /* hash password */

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    /* generate numeric id */

    const lastUser = await User.findOne().sort({ _id: -1 });
    let newId = 1;

    if (!lastUser) {
      console.log("No users found in the database. Starting with ID 1.");
    }

    newId = lastUser ? lastUser._id + 1 : 1;

    /* create admin */

    const admin = new User({
      _id: newId,
      firstName: "System",
      lastName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    });

    await admin.save();

    console.log("Admin user created successfully");

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);

    process.exit(1);
  }
};

/*
--------------------------------
CONNECT DATABASE FIRST
--------------------------------
*/
// console.log("MongoDB: ", process.env.MONGO_URL);
mongoose
  .connect("mongodb://localhost:27017/e-commercedb")
  .then(() => {
    console.log("MongoDB connected");
    createAdmin();
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
