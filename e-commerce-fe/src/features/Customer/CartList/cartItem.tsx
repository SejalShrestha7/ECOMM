import { notification, Radio } from "antd";
import React, { useState } from "react";
import type { RadioChangeEvent } from "antd";
import { ICart } from "../../../types";
import {
  changeSizeItem,
  changeQuantityItem,
  removeFromCart,
} from "../../../Redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../Redux/userSlice";
import { deleteCartItem, insertNewCartItems } from "../../../api/Customer/cart";

interface cartTypes extends ICart {
  color: string;
  setShowCart: any;
}

export const CartItem = ({
  id,
  name,
  photo,
  price,
  quantity,
  discount,
  size,
  color,
  setShowCart,
}: cartTypes) => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const newCartElement = {
    id: id,
    name: name,
    photo: photo,
    price: price,
    quantity: quantity,
    size: size,
    color: color,
  };
  const onChange = (e: RadioChangeEvent) => {
    dispatch(changeSizeItem({ ...newCartElement, size: e.target.value }));
  };

  const onQuantatyChange = async (key: string) => {
    if (key == "add") {
      await insertNewCartItems({
        user_id: user.id,
        product_id: id,
        quantity: 1,
      });
    } else {
      await insertNewCartItems({
        user_id: user.id,
        product_id: id,
        quantity: -1,
      });
    }
    dispatch(changeQuantityItem({ ...newCartElement, quantity: quantity }));
  };
  const removeCart = async () => {
    if (user.id) {
      const cartData = {
        user_id: user.id,
        product_id: id,
        color: color,
        size: size,
      };
      await deleteCartItem(cartData);

      notification.success({ message: `${name} removed from the cart` });
      setShowCart(false);
    }
  };
  return (
    <div className="relative cart-data-container">
      <i
        className="fa-solid fa-xmark text-[1.5rem] text-primary absolute top-2 right-5 cursor-pointer"
        onClick={() => removeCart()}
      ></i>
      <div className="flex items-start gap-4 p-2 shadow cart-data">
        <div className="image-container bg-secondary flex items-center justify-center h-[10rem] p-3">
          <img src={photo} alt="" className="w-full h-full cover " />
        </div>
        <div>
          <h1 className="text-lg">{name}</h1>
          <h1 className="mt-2 text-base">Rs.{price}</h1>
          <h1>Size: {size}</h1>
          <h1>Color: {color}</h1>
          <div className="flex items-center w-full gap-5 mt-2">
            <span>Quantity</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuantatyChange("sub")}
                disabled={quantity === 0 ? true : false}
                className={`${
                  quantity === 0
                    ? "bg-secondary cursor-not-allowed"
                    : "bg-primary"
                } !w-[20px]  p-[5px] !h-[20px] rounded-full flex items-center justify-center text-light font-medium`}
              >
                <i className="fa-solid fa-minus text-[13px]"></i>
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => onQuantatyChange("add")}
                className="bg-primary !w-[20px]  p-[5px] !h-[20px] rounded-full flex items-center justify-center text-light font-medium"
              >
                <i className="fa-solid fa-plus text-[13px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
