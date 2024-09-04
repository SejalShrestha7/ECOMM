import { request, response } from "express";
import Product from "../model/product.js";

export const addProduct = async (request, response) => {
  try {
    const product = request.body;
    const newProduct = await new Product(product).save();
    response.json({
      status: 201,
      message: "Product Created Sucessfully",
      data: newProduct,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getAllProduct = async (request, response) => {
  console.log(request);
  try {
    const product = await Product.find({}).populate("category_id");
    response.json({
      status: 200,
      message: "Product fetched Sucessfully",
      data: product,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getProductById = async (request, response) => {
  try {
    const product = await Product.findById(request.params.id).populate(
      "category_id"
    );
    response.json({
      status: 200,
      message: "Product fetched Sucessfully",
      data: product,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const deleteProduct = async (request, response) => {
  try {
    await Product.findByIdAndRemove(request.params.id);
    response.json({ status: 201, message: "Product  deleted sucessfully" });
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
