import { useEffect, useState } from "react";
import {
  useDeleteReviewAdminMutation,
  useLazyGetAllReviewsAdminQuery,
} from "../../reducers/productRTKquery";
import "./ProductReviews.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Delete, Star } from "@mui/icons-material";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import SideBar from "./SideBar";
import { DataGrid } from "@mui/x-data-grid";

const ProductReviews = () => {
  const navigate = useNavigate();

  const [productId, setProductId] = useState("");

  const [
    getReviews,
    {
      data,
      isError: reviewIsError,
      isLoading: reviewIsLoading,
      error: reviewError,
    },
  ] = useLazyGetAllReviewsAdminQuery();

  const { reviews = [] } = data || [];

  const [deleteReview, { isError, isLoading, isSuccess, error }] =
    useDeleteReviewAdminMutation();

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    setProductId(productId.trim());
    getReviews(productId.trim());
  };

  const deleteReviewHandler = (reviewId) => {
    deleteReview({ reviewId, productId });
  };

  useEffect(() => {
    if (reviewIsError) {
      toast.error(reviewError?.data?.message);
    }

    if (isError) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Review Deleted Successfully");
      navigate("/admin/reviews");
    }
  }, [
    error,
    productId,
    reviewIsError,
    isError,
    isSuccess,
    reviewError?.data?.message,
    navigate,
  ]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },

    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.4,

      cellClassName: (params) => {
        return params.formattedValue >= 3 ? "greenColor" : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => deleteReviewHandler(params.id)}>
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

  if (isLoading || reviewIsLoading) return <Loader />;
  return (
    <>
      <MetaData title={`ALL REVIEWS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}>
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <Star />
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={
                isLoading ? true : false || productId === "" ? true : false
              }>
              Search
            </Button>
          </form>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="productListTable"
              autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductReviews;
