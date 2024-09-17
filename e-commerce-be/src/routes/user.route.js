import express from "express";
import {
  addUser,
  logIn,
  getUserByID,
  getAllUser,
  updateUserDetails,
} from "../controller/userController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/addUser", addUser);
router.patch("/ ", updateUserDetails);
router.post("/login", logIn);
router.get("/getUserByID", verifyToken, getUserByID);
router.get("/getallUser", getAllUser);
export default router;
