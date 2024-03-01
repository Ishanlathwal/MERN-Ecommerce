import { useEffect, useState } from "react";
import {
  useGetSingleUserAdminQuery,
  useUpdateAdminUserMutation,
} from "../../reducers/productRTKquery";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import SideBar from "./SideBar";
import { MailOutline, Person, VerifiedUser } from "@mui/icons-material";
import { Button } from "@mui/material";

const UpdateUserAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: userLoading,
    isError: userIsError,
    error: userError,
  } = useGetSingleUserAdminQuery(id);
  const { user = [] } = userData || [];

  const [updateUser, { isLoading, isError, error, isSuccess }] =
    useUpdateAdminUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
    }
  }, [user]);

  useEffect(() => {
    if (userIsError) {
      toast.error(userError?.data?.message);
    }

    if (isError) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("User Updated Successfully");
      navigate("/admin/users");
    }
  }, [
    error,
    user,
    userIsError,
    isError,
    isSuccess,
    userError?.data?.message,
    navigate,
  ]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    updateUser({ id, data: myForm });
  };
  if (isLoading || userLoading) return <Loader />;
  return (
    <>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            onSubmit={updateUserSubmitHandler}>
            <h1>Update User</h1>

            <div>
              <Person />
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <MailOutline />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <VerifiedUser />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Choose Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={isLoading ? true : false || role === "" ? true : false}>
              Update
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateUserAdmin;
