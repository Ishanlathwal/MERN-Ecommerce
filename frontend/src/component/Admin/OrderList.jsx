import { toast } from "react-toastify";
import {
  useDeleteAdminOrdersMutation,
  useGetAdminOrdersQuery,
} from "../../reducers/productRTKquery";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import SideBar from "./SideBar";
import { DataGrid } from "@mui/x-data-grid";

const OrderList = () => {
  const navigate = useNavigate();
  const [
    deleteOrder,
    {
      isError: orderIsError,
      isLoading: orderIsLoading,
      isSuccess: orderIsSuccess,
      error: orderError,
    },
  ] = useDeleteAdminOrdersMutation();

  const { data, isLoading, isError, error } = useGetAdminOrdersQuery();

  const { orders = [] } = data || [];

  const deleteOrderHandler = (id) => {
    deleteOrder(id);
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }

    if (orderIsError) {
      toast.error(orderError?.data?.message);
    }

    if (orderIsSuccess) {
      toast.success("Order Deleted Successfully");
      navigate("/admin/orders");
    }
  }, [
    error,
    isError,
    orderIsError,
    orderIsSuccess,
    orderError?.data?.message,
    navigate,
  ]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        const className =
          params.formattedValue === "Delivered" ? "greenColor" : "redColor";
        return className;
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.4,
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
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/order/${params.id}`}>
              <Edit />
            </Link>

            <Button onClick={() => deleteOrderHandler(params.id)}>
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });
  if (orderIsLoading || isLoading) return <Loader />;
  return (
    <>
      <MetaData title={`ALL ORDERS - Admin`} />
      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 50]}
          />
        </div>
      </div>
    </>
  );
};

export default OrderList;
