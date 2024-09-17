import mongoose from "mongoose";
import product from "./product.js";
import user from "./user.js";

const CartSchema = new mongoose.Schema({
  products: [
    {
      product_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: product,
        require: true,
      },
      quantity: { type: Number, required: true, default: 1 },
      size: { type: String, required: true, default: "XL" },
      color: { type: String, required: true, default: "White" },
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
    require: true,
  },
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
