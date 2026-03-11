import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },

    productName: String,

    description: String,

    price: Number,

    stock: Number,

    image: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
