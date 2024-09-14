import axios from "axios";

const URL = process.env.REACT_APP_API_URL || "http://localhost:5000/";

const ProductURL = URL + `product/`;

export const getAllProducts = async () => {
  return await axios.get(ProductURL + "getAllProduct");
};

export const getProductById = async (id: any) => {
  return await axios.get(ProductURL + `/${id}`);
};

export const getProductByCategory = async (id: any) => {
  return await axios.get(ProductURL + `category/${id}`);
};

export const getSimilarProducts = async (id: any) => {
  return await axios.get(ProductURL + `recommendations/${id}`);
};

export const getFilteredProduct = async (filter: any) => {
  return await axios.get(
    URL +
      `product?name=${filter.name}&category=${filter.category}&sprice=${filter.price[0]}&eprice=${filter.price[1]}&sdiscount=${filter.discount[0]}&ediscount=${filter.discount[1]}`
  );
};
