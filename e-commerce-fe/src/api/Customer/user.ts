import axios from "axios";
import { IUser } from "../../types";
const URL = process.env.REACT_APP_API_URL || "http://localhost:5000/";

export const getUserApi = async (token: string) =>
  await axios.get(URL + "user/getUserByID", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUser = async (data: any) =>
  await axios.patch(URL + "user/", data);
