import express from "express";
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword
} from "../controller/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout)
router.post("/refresh", refresh);
router.post("/forgot", forgotPassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// protected route
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

export default router;
