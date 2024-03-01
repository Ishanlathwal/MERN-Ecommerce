import { useDispatch, useSelector } from "react-redux";
import "./OrderDetails.css";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { clearError, getOrderDetails } from "../../reducers/MY_ORDER_REDUCER";
import { Link, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import { Typography } from "@mui/material";

const OrderDetails = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  console.log(order);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);
  if (loading) return <Loader />;
  return (
    <>
      <MetaData title="Order Details" />

      <div className="orderDetailsPage">
        <div className="orderDetailsContainer">
          <Typography component="h1">Order #{order && order._id}</Typography>
          <Typography>Shipping Info</Typography>
          <div className="orderDetailsContainerBox">
            <div>
              <p>Name:</p>
              <span>{order.user && order.user.name}</span>
            </div>
            <div>
              <p>Phone:</p>
              <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
            </div>
            <div>
              <p>Address:</p>
              <span>
                {order.shippingInfo &&
                  `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
              </span>
            </div>
          </div>
          <Typography>Payment</Typography>
          <div className="orderDetailsContainerBox">
            <div>
              <p
                className={
                  order.paymentInfo && order.paymentInfo.status === "succeeded"
                    ? "greenColor"
                    : "redColor"
                }>
                {order.paymentInfo && order.paymentInfo.status === "succeeded"
                  ? "PAID"
                  : "NOT PAID"}
              </p>
            </div>

            <div>
              <p>Amount:</p>
              <span>{order.totalPrice && order.totalPrice}</span>
            </div>
          </div>

          <Typography>Order Status</Typography>
          <div className="orderDetailsContainerBox">
            <div>
              <p
                className={
                  order.orderStatus && order.orderStatus === "Delivered"
                    ? "greenColor"
                    : "redColor"
                }>
                {order.orderStatus && order.orderStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="orderDetailsCartItems">
          <Typography>Order Items:</Typography>
          <div className="orderDetailsCartItemsContainer">
            {order.orderItems &&
              order.orderItems.map((item) => (
                <div key={item.product}>
                  <img src={item.image} alt="Product" />
                  <Link to={`/product/${item.productId}`}>{item.name}</Link>
                  <span>
                    {item.quantity} X ₹{item.price} ={" "}
                    <b>₹{item.price * item.quantity}</b>
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;