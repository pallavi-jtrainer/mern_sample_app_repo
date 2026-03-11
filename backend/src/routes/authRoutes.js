import express from "express";
import auth from "../middleware/authMiddleware.js";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

/* PUBLIC */

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);

export default router;
