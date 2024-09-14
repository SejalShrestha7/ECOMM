import { Button, Empty } from "antd";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { CartItem } from "./cartItem";
import { useDispatch, useSelector } from "react-redux";
import { CartState, clearCart } from "../../../Redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../Redux/store";

function CardList({ setShowCart, showCart }: any) {
  const cart = useSelector((state: RootState) => state.cartReducer.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handelCheckout = () => {
    navigate("/payment");
  };
  const handelClear = () => {
    dispatch(clearCart("clearCartItems"));
  };
  return (
    <section
      className={clsx(
        "fixed top-0 bottom-0  right-0 left-[60%] z-50 bg-[#fff] drop-shadow-2xl translate-x-[0%] overflow-auto",
        !showCart && "translate-x-[110%]"
      )}
      style={{ transition: "all 300ms ease-in-out" }}
    >
      <div className="flex items-center justify-between py-10 px-14">
        <span className="text-3xl font-medium text-primary">Cart</span>
        <i
          className="fa-solid fa-xmark text-[1.5rem] text-primary cursor-pointer"
          onClick={() => setShowCart(false)}
        ></i>
      </div>
      <div className="flex flex-col gap-10 px-10">
        {cart.map((item) => {
          return <CartItem {...item} key={item.id} />;
        })}
      </div>

      {cart.length > 0 ? (
        <div className="flex items-center justify-center gap-5 mt-10">
          <Button
            type="primary"
            className=""
            size="large"
            onClick={handelCheckout}
          >
            {" "}
            Checkout{" "}
          </Button>
          <Button className="" size="large" onClick={handelClear}>
            {" "}
            Clear Cart{" "}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-5 mt-10">
          <Empty />
        </div>
      )}
      <Link to={"/allproducts"} className="flex justify-center mt-5 mb-10">
        <span className="underline cursor-pointer opacity-70 text-primary hover:text-secondary">
          Continue shopping
        </span>
      </Link>
    </section>
  );
}

export default CardList;
