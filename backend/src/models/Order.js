import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    userId: {
      type: Number,
      required: true,
    },

    items: [
      {
        productId: Number,
        productName: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
