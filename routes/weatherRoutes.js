import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getWeather } from "../controller/weatherController.js";

const router = express.Router();

router.get("/weather", verifyToken, getWeather);

export default router;
