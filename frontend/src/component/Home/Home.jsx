import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import { useGetProductsQuery } from "../../reducers/productRTKquery";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const Home = () => {
  const [page, setPage] = useState(1);

  const { isError, isLoading, data, error, isFetching } =
    useGetProductsQuery(page);

  const { product, productsCount } = data || { products: [], productsCount: 0 };

  // For Infinite scrool

  useEffect(() => {
    const onScroll = () => {
      const scrolledToBottom =
        window.outerHeight + window.scrollY >=
        document.documentElement.scrollHeight;

      if (scrolledToBottom && !isFetching && product?.length < productsCount) {
        setPage(page + 1);
      }
    };

    document.addEventListener("scroll", onScroll);

    return function () {
      document.removeEventListener("scroll", onScroll);
    };
  }, [page, isFetching, productsCount, product?.length]);

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [error?.data?.message, isError]);
  //////////////////////////////

  if (isLoading) return <Loader />;

  if (isError) toast.error(error?.data?.message);

  return (
    <>
      <MetaData title="ECOMMERCE" />;
      <div className="banner">
        <p>Welcome to E-Commerce</p>
        <h1>Find Amazing Products Below</h1>
        <a href="#container">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </div>
      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
        {product &&
          product.map((item) => {
            return (
              <ProductCard
                product={item}
                key={item._id}
                isError={isError}
                isLoading={isLoading}
                productCount={productsCount}
              />
            );
          })}
      </div>
    </>
  );
};

export default Home;
