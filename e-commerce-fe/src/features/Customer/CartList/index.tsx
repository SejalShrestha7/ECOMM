import { Button, Empty } from "antd";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { CartItem } from "./cartItem";
import { useDispatch, useSelector } from "react-redux";
import { CartState, clearCart } from "../../../Redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../Redux/store";
import { getAllCartItem } from "../../../api/Customer/cart";
import { getUser } from "../../../Redux/userSlice";

function CardList({ setShowCart, showCart }: any) {
  const cart = useSelector((state: RootState) => state.cartReducer.items);
  const [cartItems, setCartItems] = useState<any>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const handelCheckout = () => {
    navigate("/payment");
  };
  const handelClear = () => {
    dispatch(clearCart("clearCartItems"));
  };

  const getCartItems = async () => {
    if (user.id) {
      const res = await getAllCartItem(user.id);
      const productDetails = res.data.data?.products;
      const formattedProductDetails: any[] = [];
      if (productDetails !== null && productDetails !== undefined) {
        productDetails.map((product: any) => {
          formattedProductDetails.push({
            id: product.product_Id._id,
            name: product.product_Id.name,
            photo: product.product_Id.photo,
            price: product.product_Id.price,
            quantity: product.quantity,
            size: product.size,
            color: product.color,
          });
        });

        setCartItems(formattedProductDetails);
      }
    }
  };

  useEffect(() => {
    getCartItems();
  }, [user, []]);

  return (
    <section
      className={clsx(
        "fixed top-0 bottom-0  right-0 left-[60%] z-50 bg-[#fff] drop-shadow-2xl translate-x-[0%] overflow-auto",
        !showCart && "translate-x-[110%] "
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
        {cartItems !== null &&
          cartItems !== undefined &&
          cartItems.length >= 0 &&
          cartItems.map((cartItem: any, idx: number) => {
            return (
              <CartItem {...cartItem} key={idx} setShowCart={setShowCart} />
            );
          })}
      </div>

      {cartItems.length > 0 ? (
        <div className="flex items-center justify-center gap-5 mt-10">
          <Button
            type="primary"
            className=""
            size="large"
            onClick={handelCheckout}
          >
            Checkout
          </Button>
          <Button className="" size="large" onClick={handelClear}>
            Clear Cart
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
