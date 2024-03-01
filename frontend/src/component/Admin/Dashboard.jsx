import "./Dashboard.css";
import { useEffect } from "react";
import MetaData from "../layout/MetaData";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SideBar from "./SideBar";
import { Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  useGetAdminAllUsersQuery,
  useGetAdminOrdersQuery,
  useGetAdminProductsQuery,
} from "../../reducers/productRTKquery";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

const Dashboard = () => {
  // Product
  const {
    data: adminData,
    isLoading: productIsLoading,
    isError: productIsError,
    error: productError,
  } = useGetAdminProductsQuery();
  const { product = [] } = adminData || [];

  // Order
  const {
    data,
    isLoading,
    isError: orderIsError,
    error: orderError,
  } = useGetAdminOrdersQuery();

  const { orders = [] } = data || [];
  // Users

  const {
    data: userData,
    isLoading: userLoading,
    isError: userIsError,
    error: userError,
  } = useGetAdminAllUsersQuery();
  const { user = [] } = userData || [];
  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (productIsError) {
      toast.error(productError?.data?.message);
    }
    if (orderIsError) {
      toast.error(orderError?.data?.message);
    }
    if (userIsError) {
      toast.error(userError?.data?.message);
    }
  }, [
    orderError?.data?.message,
    orderIsError,
    productError?.data?.message,
    productIsError,
    userError?.data?.message,
    userIsError,
  ]);

  let outOfStock = 0;

  product &&
    product.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, product.length - outOfStock],
      },
    ],
  };
  if (productIsLoading || isLoading || userLoading) return <Loader />;
  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <SideBar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{product && product.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{user && user.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
