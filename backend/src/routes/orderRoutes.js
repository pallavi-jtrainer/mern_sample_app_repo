import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  checkout,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

/* customer */

router.post("/checkout", auth, checkout);

router.get("/my-orders", auth, getMyOrders);

router.get("/:id", auth, getOrderById);

/* admin */

router.get("/", auth, role(["admin"]), getAllOrders);

router.put("/:id/status", auth, role(["admin"]), updateOrderStatus);

export default router;
