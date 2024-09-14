import product from "../model/product.js";
import Rating from "../model/rating.js";

import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const addRating = async (request, response) => {
  try {
    const rating = request.body;
    const hasBeenRated = await Rating.findOne({
      product_id: rating.product_id,
      user_id: rating.user_id,
    });

    if (hasBeenRated) {
      const updateRating = await Rating.findByIdAndUpdate(
        hasBeenRated._id,
        {
          product_id: rating.product_id,
          user_id: rating.user_id,
          rating: rating.rating,
        },
        { new: true }
      );
      return response.json({
        status: 200,
        message: "Rating inserted successfully",
        data: updateRating,
      });
    }

    const newRating = await new Rating(rating).save();
    return response.json({
      status: 200,
      message: "Rating inserted successfully",
      data: newRating,
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const hasUserRated = async (request, response) => {
  try {
    const { user_id, product_id } = request.body;
    const hasRated = await Rating.findOne({
      user_id: user_id,
      product_id: product_id,
    });
    if (!hasRated) {
      return response.json({
        status: 200,
        message: "User has rated the product",
        data: {
          rating: 0,
          hasRated: false,
        },
      });
    }
    return response.json({
      status: 200,
      message: "User has rated the product",
      data: {
        rating: hasRated.rating,
        hasRated: true,
      },
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getAverageRating = async (productId) => {
  try {
    const result = await Rating.aggregate([
      {
        $match: { product_id: productId },
      },
      {
        $group: {
          _id: "$product_id",
          averageRating: { $avg: "$rating" },
          totalRating: { $sum: 1 },
        },
      },
    ]).exec();

    if (result.length > 0) {
      return result[0];
    }
    return { averageRating: 0, totalRating: 0 };
  } catch (error) {
    console.log(error);
    return null;
  }
};
