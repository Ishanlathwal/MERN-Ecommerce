/* eslint-disable react/prop-types */
import "./ProductDetails.css";
import { useGetSingleProductQuery } from "../../reducers/productRTKquery";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import ReviewCard from "./ReviewCard";
import MetaData from "../layout/MetaData";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Carousel from "react-material-ui-carousel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../reducers/CART_REDUCER";
import { clearErrorReview, newReview } from "../../reducers/NEW_REVIEW_REDUCER";

const SingleProductComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data, isLoading, isError, error, refetch } =
    useGetSingleProductQuery(id);
  const { product } = data || {};

  const { success, error: reviewError } = useSelector(
    (state) => state.newReview,
  );

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const options = {
    size: "large",
    value: product?.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;

    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    setQuantity((prev) => prev - 1);
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const addToCartHandler = () => {
    dispatch(addToCart(id, quantity));
    toast.success("Item Added To Cart");
  };

  const reviewSubmitHandler = async () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));
    await refetch();
    setOpen(false);
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrorReview());
    }

    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrorReview());
    }

    if (success) {
      toast.success("Review Submitted Successfully");
      dispatch({ type: "review/reset" });
    }
  }, [dispatch, error, reviewError, success]);

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [error?.data?.message, isError]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={`${product.name} -- ECOMMERCE`} />
      <div className="ProductDetails">
        <div>
          <div style={{ width: "100%" }}>
            <Carousel navButtonsAlwaysVisible={true}>
              {product.images &&
                product.images.map((item, i) => (
                  <img
                    className="CarouselImage"
                    key={i}
                    src={item.url}
                    alt={`${i} Slide`}
                  />
                ))}
            </Carousel>
          </div>
        </div>

        <div>
          <div className="detailsBlock-1">
            <h2>{product.name}</h2>
            <p>Product # {product._id}</p>
          </div>
          <div className="detailsBlock-2">
            <Rating {...options} />
            <span className="detailsBlock-2-span">
              ({product.numOfReviews} Reviews)
            </span>
          </div>
          <div className="detailsBlock-3">
            <h1>{`₹${product.price}`}</h1>
            {product.stock > 0 && (
              <div className="detailsBlock-3-1">
                <div className="detailsBlock-3-1-1">
                  <button onClick={decreaseQuantity}>-</button>
                  <input readOnly type="number" value={quantity} />
                  <button onClick={increaseQuantity}>+</button>
                </div>
                <button
                  disabled={product.stock < 1 ? true : false}
                  onClick={addToCartHandler}>
                  Add to Cart
                </button>
              </div>
            )}
            {product.stock >= 1 && (
              <small style={{ font: "200 0.9vmax Roboto" }}>
                Available Stocks: {product.stock}
              </small>
            )}
            <p>
              Status:
              <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                {product.stock < 1 ? "OutOfStock" : "InStock"}
              </b>
            </p>
          </div>

          <div className="detailsBlock-4">
            Description : <p>{product.description}</p>
          </div>

          <button onClick={submitReviewToggle} className="submitReview">
            Submit Review
          </button>
        </div>
      </div>

      <h3 className="reviewsHeading">REVIEWS</h3>

      <Dialog
        aria-labelledby="simple-dialog-title"
        open={open}
        onClose={submitReviewToggle}>
        <DialogTitle>Submit Review</DialogTitle>
        <DialogContent className="submitDialog">
          <IconButton
            aria-label="close"
            onClick={submitReviewToggle}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <Close />
          </IconButton>
          <Rating
            onChange={(e) => setRating(e.target.value)}
            value={rating}
            size="large"
          />
          <textarea
            className="submitDialogTextArea"
            cols="30"
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}></textarea>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={submitReviewToggle}>
            Cancel
          </Button>
          <Button onClick={reviewSubmitHandler} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {product.reviews && product.reviews[0] ? (
        <div className="reviews">
          {product.reviews &&
            product.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
        </div>
      ) : (
        <p className="noReviews">No Reviews Yet</p>
      )}
    </>
  );
};

export default SingleProductComponent;
