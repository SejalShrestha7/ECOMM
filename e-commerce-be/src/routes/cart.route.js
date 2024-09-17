import express from "express";
import {
  clearCart,
  deleteCartItem,
  getCart,
  insertNewCartItem,
} from "../controller/cartController.js";

const router = express.Router();

router.post("/newCartItem", insertNewCartItem);
router.post("/", getCart);
router.delete("/", clearCart);
router.post("/removeCart", deleteCartItem);

export default router;
