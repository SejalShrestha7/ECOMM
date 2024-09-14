import React from "react";
import Popular from "../../../../assets/Collection/Popular.jpg";
import Childrent from "../../../../assets/Collection/Childrengt.jpg";
import Men from "../../../../assets/Collection/Men.jpg";
import Girl from "../../../../assets/Collection/Girl.jpg";
import Stylist from "../../../../assets/Collection/Stylist.jpg";
import { Button } from "antd";
import { Link } from "react-router-dom";
function Collection() {
  const categories = {
    Men: "63eb12ac1781cbec3191c381",
    Women: "63eb12cf1781cbec3191c383",
    Children: "63eb133d1781cbec3191c385",
  };
  return (
    <section className="my-10 Collection">
      <div className="py-5 text-3xl font-bold text-center title text-primary">
        Collection
      </div>
      <div className="collection-section flex flex-col sm:flex-row justify-center items-center h-10 px-5 gap-5 w-full h-full sm:h-[50vh] lg:h-[85vh]">
        <div className="flex flex-col w-full sm:w-[28.5%] h-full gap-5">
          <Link
            to={`allproducts?category=${categories.Men}`}
            className="flex w-full h-[30vh] sm:h-full bg-primary  overflow-hidden relative"
          >
            <img
              src={Men}
              alt=""
              className="object-cover object-top w-full h-full cursor-pointer Collection-image hover:scale-110 hover:opacity-80"
              style={{ transition: "all 400ms ease-in-out" }}
            />
            <h1
              className="absolute text-4xl font-medium text-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none collection-title bottom-5 w-72 left-1/2 text-light text-semibold sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
              style={{ textShadow: "2px 4px 3px rgba(255,255,255,0.6)" }}
            >
              Men Clothes
            </h1>
          </Link>
          <Link
            to={`allproducts?category=${categories.Women}`}
            className="flex w-full h-[30vh] sm:h-full bg-primary overflow-hidden relative"
          >
            <img
              src={Girl}
              alt=""
              className="object-cover object-top w-full h-full cursor-pointer Collection-image hover:scale-110 hover:opacity-80"
              style={{ transition: "all 400ms ease-in-out" }}
            />
            <h1
              className="absolute text-4xl font-medium text-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none collection-title bottom-5 w-72 left-1/2 text-light text-semibold sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
              style={{ textShadow: "2px 4px 3px rgba(255,255,255,0.6)" }}
            >
              Women Clothes
            </h1>
          </Link>
        </div>
        <Link
          to="allProducts"
          className="w-full sm:w-[43%] h-[40vh] sm:h-full bg-primary overflow-hidden relative"
        >
          <img
            src={Popular}
            alt=""
            className="object-cover object-top w-full h-full cursor-pointer Collection-image hover:scale-110 hover:opacity-80"
            style={{ transition: "all 400ms ease-in-out" }}
          />
          <h1
            className="absolute text-4xl font-medium text-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none collection-title bottom-5 w-72 left-1/2 text-light text-semibold sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
            style={{ textShadow: "2px 4px 3px rgba(255,255,255,0.6)" }}
          >
            Most Popular
          </h1>
        </Link>
        <div className="flex flex-col w-full sm:w-[28.5%] h-full gap-5">
          <Link
            to="allProducts"
            className="flex w-full h-[30vh] sm:h-full  bg-primary overflow-hidden relative"
          >
            <img
              src={Stylist}
              alt=""
              className="object-cover object-top w-full h-full cursor-pointer Collection-image hover:scale-110 hover:opacity-80"
              style={{ transition: "all 400ms ease-in-out" }}
            />
            <h1
              className="absolute text-4xl font-medium text-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none collection-title bottom-5 w-72 left-1/2 text-light text-semibold sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
              style={{ textShadow: "2px 4px 3px rgba(255,255,255,0.6)" }}
            >
              Staff Choice
            </h1>
          </Link>
          <Link
            to={`allproducts?category=${categories.Children}`}
            className="flex w-full h-[30vh] sm:h-full bg-primary overflow-hidden relative"
          >
            <img
              src={Childrent}
              alt=""
              className="object-cover object-top w-full h-full cursor-pointer Collection-image hover:scale-110 hover:opacity-80"
              style={{ transition: "all 400ms ease-in-out" }}
            />
            <h1
              className="absolute text-4xl font-medium text-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none collection-title bottom-5 w-72 left-1/2 text-light text-semibold sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
              style={{ textShadow: "2px 4px 3px rgba(255,255,255,0.6)" }}
            >
              Children Clothes
            </h1>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Collection;
