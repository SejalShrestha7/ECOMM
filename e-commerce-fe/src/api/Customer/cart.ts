import axios from "axios";

const URL = process.env.REACT_APP_API_URL || "http://localhost:5000/";

const cartUrl = URL + `cart/`;

export const getAllCartItem = async (user_id: string) => {
  return await axios.post(cartUrl, { user_id: user_id });
};

export const insertNewCartItems = async (cartData: {
  user_id: string;
  product_id: string | undefined;
  quantity: number;
}) => {
  return await axios.post(cartUrl + "newCartItem", cartData);
};

export const deleteCartItem = async (cartData: any) => {
  return await axios.post(cartUrl + "removeCart", cartData);
};
