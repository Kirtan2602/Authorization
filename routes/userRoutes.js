import express from "express";
import { register, login, logout } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout)

// protected route
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Welcome to profile",
        user: req.user
    });
});

export default router;