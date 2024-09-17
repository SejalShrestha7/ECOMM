import { response } from "express";
import Cart from "../model/cart.js";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
export const insertNewCartItem = async (request, response) => {
  try {
    const { user_id, product_id, quantity, size, color } = request.body;
    const user = await Cart.findOne({ user_id: user_id });

    if (!user) {
      await new Cart({
        user_id: user_id,
        products: [
          {
            product_Id: product_id,
            quantity: quantity,
          },
        ],
      }).save();
    } else {
      const newCartItem = await Cart.findOne({ user_id: user_id });

      const productExistsInCart = newCartItem.products.find((product) => {
        return (
          String(product.product_Id) === String(new ObjectId(product_id)) &&
          product.color === color &&
          product.size === size
        );
      });
      if (productExistsInCart) {
        productExistsInCart.quantity += quantity;
      } else {
        newCartItem.products.push({
          product_Id: product_id,
          quantity: quantity,
          size: size,
          color: color,
        });
      }

      newCartItem.save();
    }

    const newItem = await Cart.find({ user_id: user_id }).populate(
      "products.product_Id"
    );

    return response.json({
      status: 200,
      message: "Added Item in cart",
      data: newItem,
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getCart = async (request, response) => {
  try {
    const { user_id } = request.body;
    const cartItems = await Cart.findOne({
      user_id: new ObjectId(user_id),
    }).populate("products.product_Id");
    return response.json({
      status: 200,
      message: "Fetched All The Cart Items ",
      data: cartItems,
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const clearCart = async (request, response) => {
  try {
    const { user_id } = request.body;
    const cartItems = await Cart.findOneAndDelete({ user_id: user_id });
    return response.json({
      status: 200,
      message: "Cart Deleted",
      data: [],
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const deleteCartItem = async (request, response) => {
  try {
    const { user_id, product_id, color, size } = request.body;

    const newCartItem = await Cart.findOne({ user_id: user_id });
    if (!newCartItem) {
      response.json({ status: 500, message: "Internal Server error" });
    }
    newCartItem.products = newCartItem.products.filter((product) => {
      if (String(product.product_Id) !== String(new ObjectId(product_id))) {
        return product;
      }

      return product.color !== color || product.size !== size;
    });

    newCartItem.save();

    const newItem = await Cart.find({ user_id: user_id }).populate(
      "products.product_Id"
    );

    return response.json({
      status: 200,
      message: "Added Item in cart",
      data: newItem,
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};
