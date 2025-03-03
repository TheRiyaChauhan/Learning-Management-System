import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createOrder, verifyPayment ,purchasedCourses} from "../controllers/purchaseCourse.controller.js";

const router = express.Router();

router.route("/").post(isAuthenticated,createOrder)
router.route("/verify").post(isAuthenticated,verifyPayment)
router.route("/purchased-course").get(isAuthenticated,purchasedCourses)

export default router;