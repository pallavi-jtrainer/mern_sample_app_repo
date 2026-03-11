import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    firstName: String,
    lastName: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    phone: String,

    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },

    role: {
      type: String,
      enum: ["ADMIN", "CUSTOMER"],
      default: "CUSTOMER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
