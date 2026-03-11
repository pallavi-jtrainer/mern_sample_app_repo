import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
