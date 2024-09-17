import mongoose from "mongoose";
import product from "./product.js";
import user from "./user.js";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      require: true,
    },
    products: [
      {
        product_Id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: product,
          require: true,
        },
        size: {
          type: String,
          require: true,
        },
        color: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    transaction_id: {
      type: String,
    },
  },
  { timestamps: true }
);

const order = mongoose.model("Order", orderSchema);

export default order;
