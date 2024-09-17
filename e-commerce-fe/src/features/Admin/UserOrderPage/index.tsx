import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../../api/Admin/order";
import AdminLayout from "../../../layout/Admin";
import { IProduct } from "../../../types";
import Products from "./products";
import User from "./user";
import clsx from "clsx";
import { stat } from "fs";

function UserOrdersPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>({});
  const [products, setProducts] = useState<any>([]);
  const [status, setStatus] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    getOrderDetails();
  }, []);

  const getOrderDetails = async () => {
    const res = await getOrderById(id);
    const responseData = res.data.data;
    setStatus(responseData.status);
    setPaymentMethod(responseData.paymentMethod);
    setProducts(responseData.products);
    setUser(responseData.user_id);
  };

  return (
    <AdminLayout>
      <section className="py-10 px-14">
        <div className="table bg-light w-full h-screen rounded-2xl p-10">
          <h1 className="text-2xl text-primary text-medium">
            Order <span className="font-semibold text-secondary">#0001</span>
          </h1>
          <div className="flex gap-4 text-xs mt-2">
            <div className="status bg-[#1fb3d1] px-2 py-1 rounded-lg text-light">
              {status}
            </div>
            <div
              className={clsx(
                "bg-[#9e09de] px-2 py-1 rounded-lg text-light",
                paymentMethod === "E-sewa" && "bg-esewaGreen"
              )}
            >
              {paymentMethod}
            </div>
          </div>
          <div className="mt-5 flex flex-start gap-10">
            <Products products={products} />
            <User user={user} />
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default UserOrdersPage;
