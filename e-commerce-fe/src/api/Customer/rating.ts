import axios from "axios";

const URL = process.env.REACT_APP_API_URL || "http://localhost:5000/";

const ratingUrl = URL + `rating/`;

export const rateProduct = async (data: any) => {
  return await axios.post(ratingUrl + "newRating", data);
};
export const hasRatedTheProduct = async (data: any) => {
  return await axios.post(ratingUrl + "hasRated", data);
};
