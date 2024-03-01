import { toast } from "react-toastify";
import { useGetProductsWithoutInfiniteQuery } from "../../reducers/productRTKquery";
import Loader from "../Loader/Loader";
import "./Products.css";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import { useEffect, useState } from "react";
import { Slider, Typography } from "@mui/material";
import MetaData from "../layout/MetaData";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
  "Machine",
  "",
];

const Products = () => {
  const { keyword } = useParams();

  const [currentPage, setCurrentPage] = useState(1);

  const [price, setPrice] = useState([0, 25000]);

  const [category, setCategory] = useState("");

  const [ratings, setRatings] = useState(0);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setCurrentPage(1);
    setPrice(newPrice);
  };

  const { isError, isLoading, data, error } =
    useGetProductsWithoutInfiniteQuery(
      {
        currentPage,
        keyword: keyword || "",
        price,
        category,
        ratings,
      },
      // { // additional  options in rtk query. ye har 1 second baad req bhjega backend p kbtk page open
      //   pollingInterval: 1000,
      //   skipPollingIfUnfocused: true,
      // },
    );

  const {
    product = [],
    productsCount = 0,
    resultPerPage = 0,
    filteredProductsCount = 0,
  } = data || {};

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [error?.data?.message, isError]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="PRODUCTS -- ECOMMERCE" />
      <h2 className="productsHeading">Products</h2>
      <div className="products">
        {product.length ? (
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
          })
        ) : (
          <div className="notFound">
            <h1>PRODUCT NOT FOUND</h1>
          </div>
        )}
      </div>

      <div className="filterBox">
        <Typography>Price</Typography>
        <Slider
          value={price}
          onChange={priceHandler}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          min={0}
          max={25000}
        />

        <Typography>Categories</Typography>
        <ul className="categoryBox">
          {categories.map((category) => (
            <li
              className="category-link"
              key={category}
              onClick={() => {
                setCurrentPage(1);
                setCategory(category.toLowerCase());
              }}>
              {category}
            </li>
          ))}
          <li className="category-link" onClick={() => setCategory("")}>
            All Products
          </li>
        </ul>

        <fieldset>
          <Typography component="legend">Ratings Above</Typography>
          <Slider
            value={ratings}
            onChange={(e, newRating) => {
              setCurrentPage(1);
              setRatings(newRating);
            }}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            min={0}
            max={5}
          />
        </fieldset>
      </div>

      {resultPerPage < filteredProductsCount && (
        <div className="paginationBox">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="1st"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive"
          />
        </div>
      )}
    </>
  );
};

export default Products;
