import { useEffect } from "react";
import {
  useDeleteAdminProductsMutation,
  useGetAdminProductsQuery,
} from "../../reducers/productRTKquery";
import Loader from "../Loader/Loader";
import "./ProductList.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import SideBar from "./SideBar";
import { DataGrid } from "@mui/x-data-grid";

const ProductList = () => {
  const navigate = useNavigate();
  const {
    data: adminData,
    isLoading: adminLoading,
    isError: iaAdminError,
    error: adminError,
  } = useGetAdminProductsQuery();
  const { product = [] } = adminData || [];

  const [
    deleteProduct,
    {
      isError: adminDelete,
      isLoading: adminDeleteLoading,
      error: adminDeleteError,
      isSuccess,
    },
  ] = useDeleteAdminProductsMutation();

  const deleteProductHandler = (id) => {
    deleteProduct(id);
  };

  useEffect(() => {
    if (iaAdminError) {
      toast.error(adminError?.data?.message);
    }
    if (adminDelete) {
      toast.error(adminDeleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("Product Deleted Successfully");
      navigate("/admin/dashboard");
    }
  }, [
    adminDelete,
    adminDeleteError?.data?.message,
    adminError?.data?.message,
    iaAdminError,
    isSuccess,
    navigate,
  ]);

  //////////////

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "price",
      headerName: "Price",
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
            <Link to={`/admin/product/${params.id}`}>
              <Edit />
            </Link>

            <Button onClick={() => deleteProductHandler(params.id)}>
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  product &&
    product.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      });
    });
  if (adminLoading || adminDeleteLoading) return <Loader />;

  return (
    <>
      <MetaData title={`ALL PRODUCTS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL PRODUCTS</h1>

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

export default ProductList;
