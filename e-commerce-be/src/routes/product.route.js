import express from "express";
import {
  addProduct,
  deleteProduct,
  getProductByCategory,
  getAllProduct,
  getProductById,
  getProductByFilter,
  getProductRecommendation,
} from "../controller/productController.js";
import uploadRouter from "../controller/uploadController.js";
const router = express.Router();

router.post("/addProduct", addProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.use("/upload", uploadRouter);
router.get("/category/:id", getProductByCategory);
router.get("/recommendations/:id", getProductRecommendation);
router.get("/", getProductByFilter);

export default router;
