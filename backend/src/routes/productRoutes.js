import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "../controllers/productController.js";

const router = express.Router();

/* PUBLIC */

router.get("/", getProducts);
router.get("/:id", getProductById);

/* ADMIN */

router.post("/", auth, role(["ADMIN"]), createProduct);

router.put("/:id", auth, role(["ADMIN"]), updateProduct);

router.delete("/:id", auth, role(["ADMIN"]), deleteProduct);

router.put("/:id/toggle", auth, role(["ADMIN"]), toggleProductStatus);

export default router;
