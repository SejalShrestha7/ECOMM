import React, { useEffect, useState } from "react";
import { Col, Row, Radio, Space, Slider, Input, Skeleton } from "antd";
import type { SliderMarks } from "antd/es/slider";
import type { RadioChangeEvent } from "antd";
import Card from "../../../constants/Card";
import Layout from "../../../layout/Customer";
import { getAllProducts ,getFilteredProduct} from "../../../api/Customer/product";
import { AudioOutlined } from "@ant-design/icons";
import { IProduct } from "../../../types";

const initialFilter = {
  name: null,
  category: null,
  price: [0, 100000000],
  discount: [0, 100000000],
};



function AllProductsDisplay() {
  const [productArray, setProductArray] = useState<IProduct[]>();
  const [filteredArray, setFilteredArray] = useState<IProduct[]>();
  const [loader, setLoader] = useState<boolean>(true);
  const [filter, setfilter] = useState<any>(initialFilter);

  useEffect(() => {
    allProduct();
    setTimeout(() => {
      setLoader(false);
    }, 1000);
    window.scrollTo(0, 0);
  }, []);
  const allProduct = async () => {
    const products = await getAllProducts();
    setProductArray(products?.data?.data);
  };
  const marks: SliderMarks = {
    0: "0",
    20: "20",
    40: "40",
    60: "60",
    80: "80",
    100: "100",
  };

  const priceMarks: SliderMarks = {
    0: "0",
    20: "2000",
    40: "4000",
    60: "6000",
    80: "8000",
    100: "10000",
  }
  const hadnelSliderChangePrice = ([value1, value2]: any) => {
    console.log(value1, value2);
    setfilter({
      ...filter,
      price: [value1*100, value2*100],
    });
  };
  const hadnelSliderChangeDiscount = ([value1, value2]: any) => {
    console.log(value1, value2);
    setfilter({
      ...filter,
      discount: [value1, value2],
    });
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log(filter);

    setfilter({
      ...filter,
      category: e.target.value,
    });
  };
  const { Search } = Input;

  const handleFilter = async () => {

    const products = await getFilteredProduct(filter);
    console.log(products)
    setProductArray(products?.data.data);
  }

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 19,
        color: "#1890ff",
      }}
    />
  );

  // const onSearch = (value: any) => setfilter({ ...filter, name: value });
  const onSearch = (e: any) => setfilter({ ...filter, name: e.target.value });

  return (
    <Layout hideFooter>
      <section className="flex relative ">
        <div className=" py-14 pl-5 min-w-[22rem] max-w-[22rem] ">
          <div className="p-2 bg-[#e4eaf5] pb-10 rounded-3xl px-7">
            <span className="text-3xl font-medium flex justify-center items-center mt-5">
              <i className="fa-solid fa-filter"></i> Filter
            </span>
            <div className="mt-5 flex flex-col items-start">
              <span className="text-lg font-medium">Search</span>
              <Search
                placeholder="search ..."
                size="large"
                className="border-none rounded mt-3 text-gray-700 leading-tight"
                allowClear
                onChange={onSearch}
              />
            </div>
            <div className="mt-5 flex flex-col items-start">
              <span className="text-lg font-medium">Category</span>
              <Radio.Group
                onChange={onChange}
                value={filter.category}
                className="mt-3"
              >
                <Space direction="vertical">
                <Radio value={"null"}>All</Radio>
                  <Radio value={"63eb12ac1781cbec3191c381"}>Men</Radio>
                  <Radio value={"63eb12cf1781cbec3191c383"}>Women</Radio>
                  <Radio value={"63eb133d1781cbec3191c385"}>Children</Radio>
                </Space>
              </Radio.Group>
            </div>
            <div className="mt-5 flex flex-col items-start">
              <span className="text-lg font-medium">
                Price<span className="text-sm"> ( in 00)</span>
              </span>
              <Slider
                range
                marks={priceMarks}
                className="w-full mt-3"
                onAfterChange={hadnelSliderChangePrice}
                defaultValue={[0, 10000]}
              />
            </div>
            <div className="mt-5 flex flex-col items-start">
              <span className="text-lg font-medium">
                Discount<span className="text-sm"> ( in %)</span>
              </span>
              <Slider
                range
                marks={marks}
                className="w-full mt-3"
                onAfterChange={hadnelSliderChangeDiscount}
                defaultValue={[0, 100]}
              />
            </div>
            <div className="w-full flex items-center justify-center mt-3">
              <button onClick={handleFilter} className="bg-primary p-2 px-4 rounded-xl text-light transition-colors duration-300 hover:bg-secondary hover:text-dark">

                <i className="fa-solid fa-filter mr-2"></i>
                Filter</button>
            </div>
          </div>
        </div>
        <div className="grid h-[85vh] w-full gap-10 overflow-auto p-14">
          <Row gutter={[24, 50]}>
            {productArray?.map((item: IProduct, index: number) => {
              return (
                <Col span={8} key={index}>
                  {loader ? (
                    <div>
                      <Skeleton.Image
                        active
                        style={{ width: "300px", height: "250px" }}
                      />
                      <Skeleton
                        active
                        paragraph={{ rows: 7 }}
                        style={{ width: "300px", height: "700px" }}
                      />
                    </div>
                  ) : (
                    <Card
                      _id={item._id}
                      photo={item.photo}
                      name={item.name}
                      intro={item.intro}
                      discount={item.discount}
                      price={item.price}
                    />
                  )}
                </Col>
              );
            })}
          </Row>
        </div>
      </section>
    </Layout>
  );
}

export default AllProductsDisplay;
