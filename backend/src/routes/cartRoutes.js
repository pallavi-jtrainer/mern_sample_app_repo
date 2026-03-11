import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

/*
--------------------------------
ADD PRODUCT TO CART
--------------------------------
*/

router.post("/add", authMiddleware, addToCart);

/*
--------------------------------
GET USER CART
--------------------------------
*/

router.get("/", authMiddleware, getCart);

/*
--------------------------------
UPDATE CART ITEM QUANTITY
--------------------------------
*/

router.put("/update", authMiddleware, updateCartItem);

/*
--------------------------------
REMOVE ITEM FROM CART
--------------------------------
*/

router.delete("/remove/:productId", authMiddleware, removeCartItem);

/*
--------------------------------
CLEAR CART
--------------------------------
*/

router.delete("/clear", authMiddleware, clearCart);

export default router;
