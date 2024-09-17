import React, { FormEvent, useEffect, useRef, useState } from "react";
import { paymentSchema } from "../../../validation/Customer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { ErrorMessage } from "@hookform/error-message";
import { signUp } from "../../../api/Customer/index";
import KJInput from "../../../constants/KJInput";
import KJTextarea from "../../../constants/KJTextArea";
import { Col, Row, Radio, Button, Alert, notification } from "antd";
import clsx from "clsx";
import type { RadioChangeEvent } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { addUser, getUser } from "../../../Redux/userSlice";

import { EsewaPayment, sendOrder } from "../../../api/Customer/order";
import { getAllCartItem } from "../../../api/Customer/cart";
import { updateUser } from "../../../api/Customer/user";
type ContactUsFormData = z.infer<typeof paymentSchema>;

function PaymentDetails() {
  const [isSelected, setIsSelected] = useState(false);
  const [editShippingDetails, setEditShippingDetails] = useState(false);
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState<any>([]);
  const stateRef = useRef<HTMLInputElement>(null);
  const districtRef = useRef<HTMLInputElement>(null);
  const locationaRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const { id } = user;

  const getCartItems = async () => {
    if (user.id) {
      const res = await getAllCartItem(user.id);
      const productDetails = res.data.data.products;
      const formattedProductDetails: any[] = [];
      if (
        res.data.data?.products !== null &&
        res.data.data?.products !== undefined
      ) {
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
  }, [[]]);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    setIsSelected(true);
  };

  const placeOrder = async (
    transaction_id: string,
    payment_method: string,
    status: string
  ) => {
    if (user.id) {
      const res = await sendOrder({
        transaction_id: transaction_id,
        user_id: user.id,
        status: status,
        payment_method: payment_method,
      });
      if (res.status == 200) {
        localStorage.removeItem("cart");
        notification.success({ message: "Order Send Sucessfully" });
        window.location.href = "/";
      } else {
        notification.error({ message: "Something went wrong. Try again" });
      }
    }
  };

  const [searchParams] = useSearchParams();
  const successPayment = searchParams.get("data");

  useEffect(() => {
    if (successPayment) {
      try {
        const decodedString = atob(successPayment);
        const responseData = JSON.parse(decodedString);
        if (responseData.status === "COMPLETE") {
          placeOrder(responseData.transaction_uuid, "E-sewa", "Paid");
          notification.success({ message: "Order has been placed." });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const onSubmit = async (data: ContactUsFormData) => {
    const productArray = cartItems.map((item: any) => {
      return {
        ...item,
        product_id: item.id,
      };
    });

    console.log(productArray);

    const orderData = {
      user_id: id,
      receiver: {
        receiver_name: data.name,
        receiver_contact: data.phone,
        location: data.location,
        monument: data.monument,
      },
      products: productArray,
      status: "pending",
      paymentMethod:
        data.paymentMethod == "1" ? "cash on delivery" : "digital wallet",
    };
    const res = await sendOrder(orderData);
    if (res.status == 200) {
      localStorage.removeItem("cart");
      notification.success({ message: "Order Send Sucessfully" });
      window.location.href = "/";
    } else {
      notification.error({ message: "Something went wrong. Try again" });
    }
  };
  const handelCancle = () => {
    notification.warning({ message: "Order was canceled." });
    navigate("/");
  };
  const handleEsewa = async () => {
    const response = await EsewaPayment(cartItems);
    if (response.status === 200) {
      window.location.href = response?.data.data;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userDetails = {
      user_id: user.id,
      firstname: user.firstName,
      lastname: user.lastName,
      username: user.userName,
      phone: user.phone,
      email: user.email,
      state: stateRef.current?.value,
      district: districtRef.current?.value,
      location: locationaRef.current?.value,
    };
    const res = await updateUser(userDetails);

    const updatedUserDetails = {
      id: res.data.data._id,
      firstName: res.data.data.firstName,
      lastName: res.data.data.lastName,
      userName: res.data.data.userName,
      phone: res.data.data.phone,
      email: res.data.data.email,
      state: res.data.data.state || "",
      district: res.data.data.district || "",
      location: res.data.data.location || "",
    };

    dispatch(addUser(updatedUserDetails));
    console.log(res.data.data);
    if (res.status === 200) {
      setEditShippingDetails(false);
    }
  };
  return (
    <>
      <div className="min-h-full min-w-[50%] flex flex-col justify-center items-center ">
        <div className="bg-grey rounded-xl w-1/2 my-2 h-[90%] flex flex-col justify-around  ">
          {!editShippingDetails && (
            <>
              <h1 className="font-bold text-3xl p-2 px-4  text-center">
                Delivery Information
              </h1>
              <div className="px-7">
                <h1 className="text-xl font-semibold px-4  p-2 underline">
                  Contact Information
                </h1>
                <h1 className="text-lg  px-4 p-1 ">
                  Name : {`${user.firstName}  ${user.lastName}  `}
                </h1>
                <h1 className="text-lg  px-4 p-1 ">Contact : {user.phone}</h1>
                <h1 className="text-lg  px-4 p-1 ">Email : {user.email}</h1>
              </div>

              <div className="px-7">
                <h1 className="font-semibold text-xl p-2 px-4 underline">
                  Shipping Address
                </h1>
                <h1 className="text-lg  px-4 p-1 ">State : {user.state}</h1>
                <h1 className="text-lg  px-4 p-1 ">
                  District : {user.district}
                </h1>
                <h1 className="text-lg  px-4 p-1 ">
                  Location : {user.location}
                </h1>
              </div>

              <div className="px-7 flex justify-center items-center flex-col">
                <button
                  onClick={() => setEditShippingDetails(true)}
                  className="bg-primary p-2 font-semibold text-light px-4 rounded-xl"
                >
                  Add Shipping Details
                </button>
                <p className="text-sm italic mt-4 text-darkGrey">
                  *Enter your shipping details to order the items
                </p>
              </div>
            </>
          )}
          {editShippingDetails && (
            <form onSubmit={handleSubmit} className="flex-col flex px-4">
              <label className="font-semibold px-2 my-2">State</label>
              <input
                ref={stateRef}
                type="text"
                placeholder="Enter your state"
                className="h-11 px-4  placeholder:px-2 rounded-xl"
              />
              <label className="font-semibold px-2 my-2">District</label>
              <input
                ref={districtRef}
                type="text"
                placeholder="Enter your district"
                className="h-11 px-4   placeholder:px-2 rounded-xl"
              />
              <label className="font-semibold px-2 my-2">Location</label>
              <input
                ref={locationaRef}
                type="text"
                placeholder="Enter your district"
                className="h-11 px-4   placeholder:px-2 rounded-xl"
              />
              <button
                onSubmit={handleSubmit}
                className="bg-primary p-2 font-semibold mt-4 text-light px-4 rounded-xl"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
        <div className="w-full flex items-center justify-center *:mx-4">
          <button
            onClick={() => placeOrder("", "Cash On Delivery", "Pending")}
            className="bg-primary p-2 font-semibold mt-4 text-light px-4 rounded-xl"
          >
            Cash on delivery
          </button>
          <button
            onClick={handleEsewa}
            className="bg-esewaGreen p-2 font-semibold mt-4 text-light px-4 rounded-xl"
          >
            Pay Wtih Esewa
          </button>
        </div>
      </div>
    </>
  );
}

export default PaymentDetails;
