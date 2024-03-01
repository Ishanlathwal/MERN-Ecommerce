import { useDispatch, useSelector } from "react-redux";
import "./MyOrders.css";
import { Link } from "react-router-dom";
import { Launch } from "@mui/icons-material";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { clearError, myOrder } from "../../reducers/MY_ORDER_REDUCER";
import Loader from "../Loader/Loader";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MetaData from "../layout/MetaData";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrder);
  const { user } = useSelector((state) => state.user);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (field) => {
        return field.formattedValue === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (field) => {
        return (
          <Link to={`/order/${field.id}`}>
            <Launch />
          </Link>
        );
      },
    },
  ];
  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    dispatch(myOrder());
  }, [dispatch, error]);

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title={`${user.name} - Orders`} />

      <div className="myOrdersPage">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          className="myOrdersTable"
          autoHeight
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
        />

        <Typography id="myOrdersHeading">{user.name}&apos;s Orders</Typography>
      </div>
    </>
  );
};

export default MyOrders;
