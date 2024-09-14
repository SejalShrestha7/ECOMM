import { ItemBasedCollabrativeFiltering } from "../Alogrithm/itemBasedCollabrative.js";
import Product from "../model/product.js";
import Rating from "../model/rating.js";
import Recommendation from "../model/recommendation.js";
import { getAverageRating } from "./ratingController.js";

const storeNewTrainedModel = async (allProduct) => {
  await Recommendation.deleteMany({});
  const itemBasedCollabrativeFiltering = new ItemBasedCollabrativeFiltering();
  const newRecommendation =
    itemBasedCollabrativeFiltering.getTrainedData(allProduct);
  await Recommendation.insertMany(newRecommendation);
};

export const addProduct = async (request, response) => {
  try {
    const product = request.body;
    const newProduct = await new Product(product).save();
    const allProduct = await Product.find({}).populate("category_id");
    await storeNewTrainedModel(allProduct);

    response.json({
      status: 201,
      message: "Product Created Sucessfully",
      data: allProduct,
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getAllProduct = async (request, response) => {
  try {
    // const product = await Product.find({}).populate("category_id");
    const product = await Product.aggregate([
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "product_id",
          as: "ratings",
        },
      },
      {
        $unwind: {
          path: "$ratings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          price: { $first: "$price" },
          photo: { $first: "$photo" },
          intro: { $first: "$intro" },
          discount: { $first: "$discount" },
          category_id: { $first: "$category_id" },
          averageRating: { $avg: "$ratings.rating" },
          totalRating: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id",
        },
      },
      {
        $unwind: {
          path: "$category_id",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    response.json({
      status: 200,
      message: "Product fetched Sucessfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getProductById = async (request, response) => {
  try {
    const product = await Product.findById(request.params.id).populate(
      "category_id"
    );
    const { averageRating, totalRating } = await getAverageRating(product._id);

    const productWithRating = { ...product._doc, averageRating, totalRating };
    response.json({
      status: 200,
      message: "Product fetched Sucessfully",
      data: productWithRating,
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const deleteProduct = async (request, response) => {
  try {
    const productId = request.params.id;
    await Product.findByIdAndRemove(productId);
    await Recommendation.findOneAndDelete({
      product_id: productId,
    });
    response.json({ status: 200, message: "Product  deleted sucessfully" });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getProductByCategory = async (request, response) => {
  try {
    const categoryId = request.params.id;
    const allProduct = await Product.find({}).populate("category_id");
    const filterProduct = allProduct
      .filter((product) => {
        return product.category_id.id === categoryId;
      })
      .slice(0, 10);
    response.json({
      status: 200,
      message: "Product fetched Sucessfully",
      data: filterProduct,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

const filterProductByPrice = (products, startingPrice, EndingPrice) => {
  const filteredProduct = products.filter(
    (product) =>
      product.price >= parseInt(startingPrice) &&
      product.price <= parseInt(EndingPrice)
  );

  return filteredProduct;
};
const filterProductDiscount = (products, startingDiscount, EndingDiscount) => {
  const filteredProduct = products.filter(
    (product) =>
      product.discount >= parseInt(startingDiscount) &&
      product.discount <= parseInt(EndingDiscount)
  );

  return filteredProduct;
};

export const getProductByFilter = async (request, response) => {
  try {
    const { name, category, sprice, eprice, sdiscount, ediscount } =
      request.query;

    if (name && name !== "null" && category && category !== "null") {
      const allProduct = await Product.find({
        $text: { $search: name },
        category_id: category,
      });
      const filterProduct = filterProductByPrice(allProduct, sprice, eprice);

      const discountFilteredProduct = filterProductDiscount(
        filterProduct,
        sdiscount,
        ediscount
      );

      response.json({
        status: 200,
        message: "Product fetched Sucessfully",
        data: discountFilteredProduct,
      });
    } else if (name && name !== "null" && (!category || category === "null")) {
      const allProduct = await Product.find({
        $text: { $search: name },
      });
      const filterProduct = filterProductByPrice(allProduct, sprice, eprice);

      const discountFilteredProduct = filterProductDiscount(
        filterProduct,
        sdiscount,
        ediscount
      );
      response.json({
        status: 200,
        message: "Product fetched Sucessfully",
        data: discountFilteredProduct,
      });
    } else if ((!name || name === "null") && category && category !== "null") {
      const allProduct = await Product.find({
        category_id: category,
      });
      const filterProduct = filterProductByPrice(allProduct, sprice, eprice);

      const discountFilteredProduct = filterProductDiscount(
        filterProduct,
        sdiscount,
        ediscount
      );
      response.json({
        status: 200,
        message: "Product fetched Sucessfully",
        data: discountFilteredProduct,
      });
    } else {
      const allProduct = await Product.find({});
      const filterProduct = filterProductByPrice(allProduct, sprice, eprice);

      const discountFilteredProduct = filterProductDiscount(
        filterProduct,
        sdiscount,
        ediscount
      );
      response.json({
        status: 200,
        message: "Product fetched Sucessfully",
        data: discountFilteredProduct,
      });
    }
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getProductRecommendation = async (request, response) => {
  try {
    const productId = request.params.id;

    const allProduct = await Recommendation.find({
      product_id: productId,
    }).populate("recommendations.id");

    response.json({
      status: 200,
      message: "Product fetched Sucessfully",
      data: allProduct,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};
