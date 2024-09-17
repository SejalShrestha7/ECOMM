import { request, response } from "express";
import Order from "../model/order.js";
import Product from "../model/product.js";
import crypto from "crypto";
import Cart from "../model/cart.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const addOrder = async (request, response) => {
  try {
    const { transaction_id, user_id, status, payment_method } = request.body;

    const order = await Order.findOne({ transaction_id: transaction_id });
    if (order) {
      return response.json({
        status: 401,
        message: "Order with this transaction id already exists",
      });
    }
    const userCartItems = await Cart.findOne({
      user_id: new ObjectId(user_id),
    });
    if (
      userCartItems.products === null ||
      userCartItems.products === undefined ||
      userCartItems.products.length <= 0
    ) {
      response.json({
        status: 401,
        message: "Cart Is Empty",
      });
    }
    const new_transaction_id = transaction_id || "";

    const newOrder = new Order({
      user_id: user_id,
      products: userCartItems.products,
      status: status,
      paymentMethod: payment_method,
      transaction_id: new_transaction_id,
    });
    await newOrder.save();
    await Cart.findOneAndDelete({ user_id: user_id });

    response.json({
      status: 201,
      message: "Order Created Sucessfully",
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getAllOrder = async (request, response) => {
  try {
    const order = await Order.find({}).populate("user_id");
    response.json({
      status: 200,
      message: "Order fetched Sucessfully",
      data: order.reverse(),
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getOneOderById = async (request, response) => {
  try {
    const order = await Order.findById(request.params.id)
      .populate("user_id")
      .populate("products.product_Id");
    const { _id, firstName, lastName, userName, email } = order.user_id;
    const productArray = order.products;
    const product = await Product.find({}).populate("category_id");
    const productsDetails = product.filter((prod) => {
      const newId = prod._id.toString();
      return productArray.find((items) => {
        const id = items.product_id;
        return newId == id;
      });
    });

    const orderWithAllData = {
      id: order._id,
      receiver: order.receiver,
      user: {
        id: _id,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
      },
      product: productsDetails,
      status: order.status,
    };
    response.json({
      status: 201,
      message: "order fetch sucessfully",
      data: orderWithAllData,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getOneOderByIdV2 = async (request, response) => {
  try {
    const order = await Order.findById(request.params.id)
      .populate("user_id")
      .populate({
        path: "products",
        populate: {
          path: "product_Id",
        },
      });

    response.json({
      status: 201,
      message: "order fetch sucessfully",
      data: order,
    });
  } catch (error) {}
};

export const esewaPayment = async (request, response) => {
  try {
    const orderedItems = request.body;
    const product_details = [];
    let totalAmount = 0;
    const transactionId = crypto.randomUUID();

    orderedItems.map((item) => {
      product_details.push({
        identity: item.id,
        name: item.name,
        total_price: parseFloat(item.price) * parseInt(item.quantity),
        quantity: item.quantity,
        unit_price: item.price,
      });
      totalAmount =
        totalAmount + parseFloat(item.price) * parseInt(item.quantity);
    });
    let hash = crypto
      .createHmac("sha256", "8gBm/:&EnhH.1/q")
      .update(
        `total_amount=${totalAmount},transaction_uuid=${transactionId},product_code=EPAYTEST`
      )
      .digest("base64");
    const formData = new FormData();
    formData.set("amount", totalAmount);
    formData.set("failure_url", "https://google.com");
    formData.set("product_delivery_charge", "0");
    formData.set("product_service_charge", "0");
    formData.set("product_code", "EPAYTEST");
    formData.set("signature", hash);
    formData.set(
      "signed_field_names",
      "total_amount,transaction_uuid,product_code"
    );
    formData.set("success_url", `${process.env.CLIENT_URL}/payment`);
    formData.set("tax_amount", "0");
    formData.set("total_amount", totalAmount);
    formData.set("transaction_uuid", transactionId);

    const initiatePayment = await fetch(
      "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      {
        method: "post",
        body: formData,
      }
    );

    if (initiatePayment.status === 200) {
      return response.json({
        status: 200,
        message: "order fetch sucessfully",
        data: initiatePayment.url,
      });
    }
    return response.json({
      status: 400,
      message: "Error",
      data: null,
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};
