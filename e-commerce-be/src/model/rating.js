import mongoose from "mongoose";
import user from "./user.js";
import product from "./product.js";

const ratingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
    require: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: product,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
  },
});

// ProductSchema.index({ name: "text" });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
