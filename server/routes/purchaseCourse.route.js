import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createOrder, verifyPayment } from "../controllers/purchaseCourse.controller.js";

const router = express.Router();

router.route("/").post(isAuthenticated,createOrder)
router.route("/verify").post(isAuthenticated,verifyPayment)

export default router;