import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CartState } from "../../../Redux/cartSlice";
import { RootState } from "../../../Redux/store";
import { ICart } from "../../../types";
import { getAllCartItem } from "../../../api/Customer/cart";
import { getUser } from "../../../Redux/userSlice";

const Product = ({ id, name, price, quantity, size, photo }: ICart) => {
  return (
    <div className="flex items-start gap-4 p-2 mt-4 shadow cart-data bg-emerald-100">
      <div className="image-container bg-secondary flex items-center justify-center h-[7rem] p-1">
        <img src={photo} alt="" className="w-full h-full cover " />
      </div>
      <div className="content">
        <h1 className="text-xl">{name}</h1>
        <div className="flex items-center gap-4">
          <h1 className="w-32 mt-1 text-base ">Price: Rs.{price}</h1>
          <h1 className="w-32 mt-1 text-base"> Quantity: {quantity}</h1>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="w-32 mt-1 text-base">Size: {size}</h1>
        </div>
      </div>
    </div>
  );
};

function ProductList() {
  const cart = useSelector((state: RootState) => state.cartReducer.items);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<any>([]);
  const user = useSelector(getUser);
  const getCartItems = async () => {
    if (user.id) {
      const res = await getAllCartItem(user.id);
      if (
        res.data.data?.products !== null &&
        res.data.data?.products !== undefined
      ) {
        const productDetails = res.data.data.products;
        const formattedProductDetails: any[] = [];
        let total = 0;
        productDetails.map((product: any) => {
          total += product.product_Id.price * product.quantity;
          formattedProductDetails.push({
            id: product.product_Id._id,
            name: product.product_Id.name,
            photo: product.product_Id.photo,
            price: product.product_Id.price,
            quantity: product.quantity,
            size: "XL",
          });
        });

        setCartItems(formattedProductDetails);
        setTotalAmount(total);
      }
    }
  };
  useEffect(() => {
    getCartItems();
  }, [user]);

  const total = cart.reduce((aacumulator, object) => {
    return aacumulator + Number(object.price) * Number(object.quantity);
  }, 0);

  return (
    <section className="flex flex-col w-1/2 pl-20 ">
      <div className="w-[90%]">
        <h1 className="my-2 text-xl font-medium">Your Order</h1>
        {cartItems !== null &&
        cartItems !== undefined &&
        cartItems.length > 0 ? (
          cartItems.map((item: any) => {
            return <Product {...item} key={item.id} />;
          })
        ) : (
          <div>
            <Empty />
          </div>
        )}

        <div className="flex items-center justify-between mt-10 total-amount">
          <h1 className="text-xl font-medium">Total</h1>
          <h1 className="text-xl font-medium">Rs {totalAmount}</h1>
        </div>
      </div>
    </section>
  );
}

export default ProductList;
