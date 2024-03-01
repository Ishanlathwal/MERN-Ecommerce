import { useEffect, useState } from "react";
import {
  useGetSingleOrderQuery,
  useUpdateOrdersMutation,
} from "../../reducers/productRTKquery";
import "./ProcessOrder.css";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import SideBar from "./SideBar";
import { Button, Typography } from "@mui/material";
import { AccountTree } from "@mui/icons-material";
const ProcessOrder = () => {
  const { id } = useParams();

  const {
    data: orderData,
    isError,
    isLoading,
    error,
  } = useGetSingleOrderQuery(id);
  const { order = {} } = orderData || {};

  const [
    updateOrder,
    {
      isError: updateError,
      isSuccess,
      error: updateErrorMsg,
      isLoading: updateLoading,
    },
  ] = useUpdateOrdersMutation();

  const [status, setStatus] = useState("");

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);

    updateOrder({ id, data: myForm });
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
    if (updateError) {
      toast.error(updateErrorMsg?.data?.message);
    }
    if (isSuccess) {
      toast.success("Order Updated Successfully");
    }
  }, [error, updateError, isError, isSuccess, updateErrorMsg?.data?.message]);

  if (updateLoading || isLoading) return <Loader />;

  return (
    <>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <div
            className="confirmOrderPage"
            style={{
              display: order.orderStatus === "Delivered" ? "block" : "grid",
            }}>
            <div>
              <div className="confirmshippingArea">
                <Typography>Shipping Info</Typography>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p>Name:</p>
                    <span>{order.user && order.user.name}</span>
                  </div>
                  <div>
                    <p>Phone:</p>
                    <span>
                      {order.shippingInfo && order.shippingInfo.phoneNo}
                    </span>
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
                        order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "greenColor"
                          : "redColor"
                      }>
                      {order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
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
              <div className="confirmCartItems">
                <Typography>Your Cart Items:</Typography>
                <div className="confirmCartItemsContainer">
                  {order.orderItems &&
                    order.orderItems.map((item) => (
                      <div key={item._id}>
                        <img src={item.image} alt="Product" />
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                        <span>
                          {item.quantity} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div
              style={{
                display: order.orderStatus === "Delivered" ? "none" : "block",
              }}>
              <form
                className="updateOrderForm"
                onSubmit={updateOrderSubmitHandler}>
                <h1>Process Order</h1>

                <div>
                  <AccountTree />
                  <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Choose Category</option>
                    {order.orderStatus === "Processing" && (
                      <option value="Shipped">Shipped</option>
                    )}

                    {order.orderStatus === "Shipped" && (
                      <option value="Delivered">Delivered</option>
                    )}
                  </select>
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={
                    isLoading ? true : false || status === "" ? true : false
                  }>
                  Process
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessOrder;
