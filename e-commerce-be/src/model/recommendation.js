import mongoose from "mongoose";
import category from "./category.js";
import product from "./product.js";

const RecommendationSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: product,
    require: true,
  },
  recommendations: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: product,
        require: true,
      },
      score: {
        type: mongoose.Schema.Types.Number,
      },
    },
  ],
});

const Recommendation = mongoose.model("Recommendation", RecommendationSchema);

export default Recommendation;
