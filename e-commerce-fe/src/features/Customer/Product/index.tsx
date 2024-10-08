import "./style.css";
import { Button, notification, Rate, Select } from "antd";
import { useParams } from "react-router-dom";
import {
  getProductById,
  getSimilarProducts,
} from "../../../api/Customer/product";
import { useEffect, useState } from "react";
import { IProduct } from "../../../types";
import {
  SliderLoading,
  ParagraphWithImageLoading,
} from "../../../constants/SkeletonLoader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../../Redux/cartSlice";
import { RootState } from "../../../Redux/store";
import { getUser } from "../../../Redux/userSlice";
import { hasRatedTheProduct, rateProduct } from "../../../api/Customer/rating";
import RecommendationSlider from "../recommendation";
import { insertNewCartItems } from "../../../api/Customer/cart";

function ProductPage() {
  const { id } = useParams();

  const [loader, setLoader] = useState<boolean>(true);
  const [productDetails, setProductDetails] = useState<IProduct>();
  const [simailarProducts, setSimilarProducts] = useState<any>();
  const [productSize, setProductSize] = useState<string>("XL");
  const [productColor, setProductColor] = useState<string>("Red");
  const [rating, setRating] = useState<number>(0);
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cartReducer.items);
  const user = useSelector(getUser);

  useEffect(() => {
    getProduct();
    setTimeout(() => {
      setLoader(false);
    }, 500);
    window.scrollTo(0, 0);
  }, [id, rating]);

  useEffect(() => {
    ProductWithCategory();
  }, [productDetails]);

  useEffect(() => {
    getRatingData();
  }, [user, productDetails, []]);

  const getProduct = async () => {
    setLoader(true);
    const res = await getProductById(id);
    setProductDetails(res?.data?.data);
  };

  const getRatingData = async () => {
    if (user.isAuthenticated) {
      const responseData = await hasRatedTheProduct({
        user_id: user.id,
        product_id: productDetails?._id,
      });
      const ratings = responseData.data.data;
      setRating(() => ratings.rating);
    }
  };
  const isAddedToCart = cart.some((el) => el.id === productDetails?._id);

  const ProductWithCategory = async () => {
    const res = await getSimilarProducts(id);
    setSimilarProducts(res?.data?.data);
  };

  const handleRating = async (value: number) => {
    setRating(() => value);
    const res = await rateProduct({
      user_id: user.id,
      product_id: productDetails?._id,
      rating: value,
    });
    if (res.status === 200) {
      return notification.success({
        message: "Thank you! for rating the product",
      });
    }
    return notification.error({ message: "Unable to rate the product" });
  };
  const handleSizeChange = (value: string) => {
    setProductSize(value);
  };

  const handelAdd = async () => {
    const cartDetails = {
      user_id: user.id,
      product_id: productDetails?._id,
      quantity: 1,
      size: productSize,
      color: productColor,
    };

    if (cartDetails.product_id !== undefined) {
      await insertNewCartItems(cartDetails);
    }
  };

  const handelRemove = () => {
    dispatch(removeFromCart(productDetails?._id));
  };

  return (
    <div>
      {loader ? (
        <ParagraphWithImageLoading />
      ) : (
        <section className="Cover-section">
          <div className="White-wrapper"></div>
          <div className="bg-holder">
            <div className="relative cursor-pointer product-image-holder ">
              <img
                src={productDetails?.photo}
                alt=""
                className="product-image"
              />
              {productDetails?.discount && (
                <div
                  className="ribbon"
                  style={{ boxShadow: "5px -5px 15px -9px rgba(0,0,0,0.45)" }}
                >
                  <span className="ribbon-2"></span>
                  <span className="discount-text ">
                    {productDetails?.discount}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-start justify-center w-1/2 Content-holder ">
              <div className="flex flex-col"></div>
              <div className="w-[80%]">
                <h1 className="text-4xl font-medium">
                  {productDetails?.name}{" "}
                </h1>
                <h3 className="mt-2 text-lg">{productDetails?.intro}</h3>
                <div className="flex items-center gap-1 mt-3 font-semibold">
                  <Rate
                    onChange={handleRating}
                    defaultValue={rating}
                    allowHalf={true}
                    disabled={user.isAuthenticated ? false : true}
                  />
                  <span>|</span>
                  <div>
                    {productDetails?.averageRating}
                    <Rate count={1} defaultValue={1} disabled={true} />
                  </div>
                  <div>| {productDetails?.totalRating} Ratings</div>
                </div>
                <div className="w-full h-[1px] bg-[#000] mt-2"></div>
                <h1 className="mt-2 text-4xl font-medium">
                  Rs.{productDetails?.price}{" "}
                </h1>
                <div>
                  <h1 className="mt-10 text-2xl">Available Colors </h1>
                  <Select
                    className="my-2"
                    defaultValue={productColor}
                    onChange={(value: string) => setProductColor(value)}
                    style={{ width: 120 }}
                    options={[
                      { value: "Red", label: "Red" },
                      { value: "Blue", label: "Blue" },
                      { value: "Green", label: "Green" },
                      { value: "White", label: "White" },
                      { value: "Black", label: "Black" },
                    ]}
                  />
                  <div>
                    <h1 className="mt-5 text-2xl">Select Size </h1>
                    <Select
                      defaultValue={productSize}
                      onChange={handleSizeChange}
                      style={{ width: 120 }}
                      options={[
                        { value: "S", label: "S" },
                        { value: "M", label: "M" },
                        { value: "LG", label: "LG" },
                        { value: "XL", label: "XL" },
                        { value: "XXL", label: "XXL" },
                      ]}
                    />
                  </div>
                </div>
                <h1 className="mt-5 mb-3 text-2xl">Description </h1>
                <p className="">{productDetails?.description}</p>
                <div className="flex items-center gap-5">
                  {!isAddedToCart ? (
                    <Button
                      type="primary"
                      size="large"
                      className="mt-12"
                      onClick={handelAdd}
                    >
                      + Add to Cart
                    </Button>
                  ) : (
                    <Button
                      size="large"
                      type="primary"
                      className="mt-12"
                      onClick={handelRemove}
                    >
                      Remove from Cart
                    </Button>
                  )}
                  <Button size="large" className="mt-12">
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {loader ? (
        <SliderLoading />
      ) : (
        <RecommendationSlider
          title={"Suggesstions"}
          productArray={simailarProducts[0].recommendations}
        />
      )}
    </div>
  );
}

export default ProductPage;
