import express from "express";
import verifyToken from "../middleware/auth.js";
import {
  addRating,
  getAverageRating,
  hasUserRated,
} from "../controller/ratingController.js";

const router = express.Router();

router.post("/newRating", addRating);
router.post("/hasRated", hasUserRated);

export default router;
