import { useEffect } from "react";
import {
  useDeleteAdminUserMutation,
  useGetAdminAllUsersQuery,
} from "../../reducers/productRTKquery";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import SideBar from "./SideBar";
import { DataGrid } from "@mui/x-data-grid";

const UsersList = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAdminAllUsersQuery();
  const { user = [] } = data || [];
  const [
    deleteUser,
    {
      isError: deleteIsError,
      data: deleteData,
      isLoading: deleteLoading,
      error: deleteError,
      isSuccess,
    },
  ] = useDeleteAdminUserMutation();
  const { message = "" } = deleteData || "";

  const deleteUserHandler = (id) => {
    deleteUser(id);
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }

    if (deleteIsError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success(message);
      navigate("/admin/users");
    }
  }, [
    error,
    deleteError,
    message,
    isError,
    deleteIsError,
    isSuccess,
    navigate,
  ]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.formattedValue === "admin" ? "greenColor" : "redColor";
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
            <Link to={`/admin/user/${params.id}`}>
              <Edit />
            </Link>

            <Button onClick={() => deleteUserHandler(params.id)}>
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  user &&
    user.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  if (isLoading || deleteLoading) return <Loader />;

  return (
    <>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

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

export default UsersList;
