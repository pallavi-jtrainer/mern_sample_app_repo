import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  getCustomers,
  toggleUserStatus,
} from "../controllers/userController.js";

const router = express.Router();

/* CUSTOMER */

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

/* ADMIN */

router.get("/customers", auth, role(["ADMIN"]), getCustomers);
router.put("/:id/toggle-status", auth, role(["ADMIN"]), toggleUserStatus);

export default router;
